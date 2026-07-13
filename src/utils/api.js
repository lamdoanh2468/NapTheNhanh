/**
 * Lớp API giả lập — ranh giới client/server.
 * Khác bản web: localStorage (đồng bộ) → AsyncStorage (BẤT ĐỒNG BỘ).
 * Mọi hàm đọc/ghi vì thế đều phải await.
 *
 * QUAN TRỌNG: quotePrice() và createOrder() phải chạy ở SERVER trong bản thật.
 */
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as WebBrowser from "expo-web-browser";
import { CARD_TYPES, PAYMENTS } from "../data/catalog";
import { API_BASE_URL, PAYMENT_RETURN_URL } from "./config";

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

// Lưu đơn trả về từ server vào AsyncStorage để HistoryScreen xem lại offline.
async function cacheOrder(serverOrder, { userId, idempotencyKey }) {
  const pay = PAYMENTS.find((p) => p.id === serverOrder.paymentId);
  const local = {
    id: serverOrder.id,
    idempotencyKey,
    userId,
    cardName: serverOrder.cardName,
    denom: serverOrder.denom,
    qty: serverOrder.qty,
    subtotal: serverOrder.subtotal,
    discount: serverOrder.discount,
    total: serverOrder.total,
    email: serverOrder.email,
    payment: pay?.name || "—",
    status: serverOrder.status,
    createdAt: serverOrder.createdAt || new Date().toISOString(),
    codes: serverOrder.codes || [],
  };
  const orders = await read(KEY_ORDERS, []);
  const idx = orders.findIndex((o) => o.id === local.id);
  if (idx >= 0) orders[idx] = local;
  else orders.unshift(local);
  await write(KEY_ORDERS, orders);
  return local;
}

// Luồng thật với VNPay:
//   1) POST /api/orders  → server tạo đơn PENDING (tính giá phía server) + trả payUrl.
//   2) Mở payUrl bằng expo-web-browser; đóng khi VNPay redirect về deep link app.
//   3) Poll GET /api/orders/:id → server đã nhận IPN (hoặc Return ở chế độ dev) → cấp mã.
export async function createOrder({
  userId, cardTypeId, denom, qty, email, paymentId, idempotencyKey, onStatus,
}) {
  // Idempotency phía client: tránh double-tap tạo 2 đơn khi chưa kịp sang cổng.
  const orders = await read(KEY_ORDERS, []);
  const existing = orders.find((o) => o.idempotencyKey === idempotencyKey);
  if (existing && existing.status === "DELIVERED") return existing;

  onStatus?.("PENDING");

  // 1) Tạo đơn ở server, lấy payUrl.
  let created;
  try {
    const res = await fetch(`${API_BASE_URL}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, cardTypeId, denom, qty, email, paymentId }),
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

  // 2) Mở cổng VNPay; openAuthSessionAsync tự đóng khi bắt được redirect về PAYMENT_RETURN_URL.
  const browser = await WebBrowser.openAuthSessionAsync(created.payUrl, PAYMENT_RETURN_URL);
  if (browser.type === "cancel" || browser.type === "dismiss") {
    // Người dùng đóng trình duyệt — vẫn poll một nhịp phòng khi đã trả tiền xong.
  }

  onStatus?.("PAID"); // đang chờ server xác nhận
  const final = await pollOrder(created.orderId);

  if (final?.status === "DELIVERED") {
    onStatus?.("DELIVERED");
    return cacheOrder(final, { userId, idempotencyKey });
  }
  if (final?.status === "FAILED") {
    await cacheOrder({ ...final }, { userId, idempotencyKey });
    throw new Error("Thanh toán thất bại hoặc đã huỷ.");
  }
  throw new Error(
    "Chưa nhận được xác nhận thanh toán. Nếu đã trừ tiền, mã sẽ xuất hiện trong Lịch sử giao dịch sau ít phút."
  );
}

// TODO(server): GET /api/orders?page=&status=
export async function listOrders(userId) {
  await delay(300);
  const orders = await read(KEY_ORDERS, []);
  return orders.filter((o) => o.userId === userId);
}
