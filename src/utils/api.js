/**
 * Lớp API giả lập — ranh giới client/server.
 * Khác bản web: localStorage (đồng bộ) → AsyncStorage (BẤT ĐỒNG BỘ).
 * Mọi hàm đọc/ghi vì thế đều phải await.
 *
 * QUAN TRỌNG: quotePrice() và createOrder() phải chạy ở SERVER trong bản thật.
 */
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { CARD_TYPES, PAYMENTS, FREE_SHIP_THRESHOLD, SHIPPING_FEE } from "../data/catalog";
import { API_BASE_URL } from "./config";

const delay = (ms) => new Promise((r) => setTimeout(r, ms));
const KEY_ORDERS = "ntn_orders";
const KEY_USER = "ntn_user";

const read = async (k, fallback) => {
  try {
    const raw = await AsyncStorage.getItem(k);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};
const write = (k, v) => AsyncStorage.setItem(k, JSON.stringify(v));

/* ---------- Auth ---------- */
// TODO(server): POST /api/auth/login → lưu JWT bằng expo-secure-store, KHÔNG dùng AsyncStorage
export async function login({ email, password }) {
  await delay(600);
  if (password.length < 6) throw new Error("Mật khẩu tối thiểu 6 ký tự");
  const user = { id: "u_" + email.replace(/\W/g, "").slice(0, 8), email };
  await write(KEY_USER, user);
  return user;
}

// TODO(server): POST /api/auth/register
export async function register({ email, password }) {
  await delay(600);
  if (password.length < 6) throw new Error("Mật khẩu tối thiểu 6 ký tự");
  const user = { id: "u_" + email.replace(/\W/g, "").slice(0, 8), email };
  await write(KEY_USER, user);
  return user;
}

export const getSession = () => read(KEY_USER, null);
export const logout = () => AsyncStorage.removeItem(KEY_USER);

/* ---------- Báo giá ---------- */
// TODO(server): POST /api/quote — server là nguồn sự thật duy nhất về giá.
export function quotePrice({ cardTypeId, denom, qty }) {
  const card = CARD_TYPES.find((c) => c.id === cardTypeId);
  const subtotal = (denom || 0) * (qty || 0);
  const discount = card ? Math.round(subtotal * card.discount) : 0;
  return { subtotal, discount, fee: 0, total: subtotal - discount };
}

// Báo giá đơn hàng vật lý (hiển thị trước — server tính lại khi tạo đơn).
// items: [{ price, qty }]. Phí ship khớp Chính sách vận chuyển (miễn phí từ 500.000đ).
export function quoteProduct(items) {
  const subtotal = (items || []).reduce(
    (sum, it) => sum + (it.price || 0) * (it.qty || 0),
    0
  );
  const shippingFee = subtotal >= FREE_SHIP_THRESHOLD ? 0 : SHIPPING_FEE;
  return { subtotal, discount: 0, shippingFee, total: subtotal + shippingFee };
}

/* ---------- Đơn hàng ---------- */
// Hỏi trạng thái đơn ở server tới khi có kết quả cuối (DELIVERED/FAILED) hoặc hết lượt.
async function pollOrder(orderId, { tries = 20, interval = 1500 } = {}) {
  let last = null;
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(`${API_BASE_URL}/api/orders/${orderId}`);
      if (res.ok) {
        last = await res.json();
        if (last.status === "DELIVERED" || last.status === "FAILED") return last;
      }
    } catch {
      // mạng chập chờn → thử lại
    }
    await delay(interval);
  }
  return last;
}

// Lưu đơn (thẻ hoặc hàng vật lý) vào AsyncStorage để HistoryScreen xem lại offline.
async function cacheOrder(serverOrder, { userId, idempotencyKey }) {
  const pay = PAYMENTS.find((p) => p.id === serverOrder.paymentId);
  const local = {
    id: serverOrder.id,
    idempotencyKey,
    userId,
    kind: serverOrder.kind || "card",
    subtotal: serverOrder.subtotal,
    discount: serverOrder.discount,
    total: serverOrder.total,
    email: serverOrder.email,
    payment: pay?.name || serverOrder.payment || "—",
    status: serverOrder.status,
    createdAt: serverOrder.createdAt || new Date().toISOString(),
    codes: serverOrder.codes || [],
    // Đơn thẻ game
    cardName: serverOrder.cardName,
    denom: serverOrder.denom,
    qty: serverOrder.qty,
    // Đơn hàng vật lý
    items: serverOrder.items,
    shipping: serverOrder.shipping,
    shippingFee: serverOrder.shippingFee,
  };
  const orders = await read(KEY_ORDERS, []);
  const idx = orders.findIndex((o) => o.id === local.id);
  if (idx >= 0) orders[idx] = local;
  else orders.unshift(local);
  await write(KEY_ORDERS, orders);
  return local;
}

// Luồng thanh toán VNPay dùng chung cho cả đơn thẻ lẫn đơn hàng vật lý:
//   1) POST /api/orders  → server tạo đơn PENDING (tính giá phía server) + trả payUrl.
//   2) Mở payUrl bằng expo-web-browser; đóng khi VNPay redirect về deep link app.
//   3) Poll GET /api/orders/:id → server đã nhận IPN (hoặc Return ở chế độ dev) → chốt đơn.
// `body`  : payload gửi lên server (khác nhau giữa thẻ và hàng vật lý).
// `base`  : dữ liệu hiển thị dựng từ input để lịch sử luôn đủ thông tin dù mất mạng.
async function submitOrder({ body, base, userId, idempotencyKey, onStatus }) {
  // Idempotency phía client: tránh double-tap tạo 2 đơn khi chưa kịp sang cổng.
  const orders = await read(KEY_ORDERS, []);
  const existing = orders.find((o) => o.idempotencyKey === idempotencyKey);
  if (existing && existing.status === "DELIVERED") return existing;

  onStatus?.("PENDING");

  // Return URL sinh động theo môi trường đang chạy:
  //  - Expo Go     → exp://192.168.x.x:8081/--/payment-result
  //  - Dev/standalone build → napthengay://payment-result
  // Gửi lên server để server redirect đúng URL này sau khi thanh toán.
  const returnUrl = Linking.createURL("payment-result");

  // 1) Tạo đơn ở server, lấy payUrl.
  let created;
  try {
    const res = await fetch(`${API_BASE_URL}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...body, returnUrl }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Không tạo được đơn hàng.");
    }
    created = await res.json();
  } catch (e) {
    if (e.message?.includes("Network request failed")) {
      throw new Error("Không kết nối được máy chủ thanh toán. Kiểm tra server đang chạy.");
    }
    throw e;
  }

  const display0 = { ...base, id: created.orderId, total: created.total };

  // Ghi ngay bản ghi "Chờ thanh toán" vào lịch sử TRƯỚC khi mở cổng, để đơn hiển thị
  // ngay cả khi người dùng thoát app giữa chừng. Các bước sau sẽ cập nhật cùng id này.
  await cacheOrder({ ...display0, status: "PENDING" }, { userId, idempotencyKey });

  // 2) Mở cổng VNPay; openAuthSessionAsync tự đóng khi bắt được redirect về returnUrl.
  const browser = await WebBrowser.openAuthSessionAsync(created.payUrl, returnUrl);
  const userClosed = browser.type === "cancel" || browser.type === "dismiss";

  onStatus?.("PAID"); // đang chờ server xác nhận

  // Nếu người dùng chủ động đóng cổng: chỉ kiểm tra nhanh phòng khi vừa trả tiền xong,
  // không bắt chờ đủ 30s. Ngược lại poll bình thường tới khi có kết quả cuối.
  const final = await pollOrder(created.orderId, userClosed ? { tries: 3, interval: 1000 } : undefined);

  // Ưu tiên đơn từ server; nếu mất mạng vẫn còn display0 để hiển thị.
  const display = { ...display0, ...(final || {}) };

  if (final?.status === "DELIVERED") {
    onStatus?.("DELIVERED");
    return cacheOrder({ ...display0, ...final }, { userId, idempotencyKey });
  }
  if (final?.status === "FAILED") {
    onStatus?.("FAILED");
    await cacheOrder({ ...display, status: "FAILED" }, { userId, idempotencyKey });
    throw new Error("Thanh toán thất bại.");
  }
  if (userClosed) {
    // Đóng cổng khi đơn vẫn chưa thanh toán → ghi nhận "Đã huỷ" vào lịch sử.
    onStatus?.("CANCELLED");
    await cacheOrder({ ...display, status: "CANCELLED" }, { userId, idempotencyKey });
    throw new Error("Bạn đã huỷ thanh toán.");
  }
  // Không rõ kết quả (có thể đã trừ tiền, IPN chậm) → lưu trạng thái chờ để theo dõi tiếp.
  await cacheOrder({ ...display, status: display.status || "PENDING" }, { userId, idempotencyKey });
  throw new Error(
    "Chưa nhận được xác nhận thanh toán. Nếu đã trừ tiền, đơn sẽ được cập nhật trong Lịch sử giao dịch sau ít phút."
  );
}

// Đơn nạp thẻ game.
export async function createOrder({
  userId, cardTypeId, denom, qty, email, paymentId, idempotencyKey, onStatus,
}) {
  const card = CARD_TYPES.find((c) => c.id === cardTypeId);
  return submitOrder({
    body: { kind: "card", userId, cardTypeId, denom, qty, email, paymentId },
    base: { kind: "card", cardName: card?.name || cardTypeId, denom, qty, email, paymentId },
    userId, idempotencyKey, onStatus,
  });
}

// Đơn hàng vật lý (phụ kiện game / hàng công nghệ / hoa tươi).
// items: [{ sku, name, price, qty }] — tên/giá chỉ để hiển thị, server tự tra lại theo sku.
// shipping: { name, phone, address }.
export async function createProductOrder({
  userId, items, shipping, email, paymentId, idempotencyKey, onStatus,
}) {
  const serverItems = (items || []).map((it) => ({ sku: it.sku, qty: it.qty }));
  const displayItems = (items || []).map((it) => ({
    sku: it.sku, name: it.name, price: it.price, qty: it.qty,
    lineTotal: (it.price || 0) * (it.qty || 0),
  }));
  const { subtotal, shippingFee, total } = quoteProduct(items);
  return submitOrder({
    body: { kind: "product", userId, items: serverItems, shipping, email, paymentId },
    base: {
      kind: "product", items: displayItems, shipping, email, paymentId,
      subtotal, shippingFee, discount: 0, total,
    },
    userId, idempotencyKey, onStatus,
  });
}

// TODO(server): GET /api/orders?page=&status=
export async function listOrders(userId) {
  await delay(300);
  const orders = await read(KEY_ORDERS, []);
  return orders.filter((o) => o.userId === userId);
}
