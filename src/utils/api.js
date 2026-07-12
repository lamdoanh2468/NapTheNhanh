/**
 * Lớp API giả lập — ranh giới client/server.
 * Khác bản web: localStorage (đồng bộ) → AsyncStorage (BẤT ĐỒNG BỘ).
 * Mọi hàm đọc/ghi vì thế đều phải await.
 *
 * QUAN TRỌNG: quotePrice() và createOrder() phải chạy ở SERVER trong bản thật.
 */
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CARD_TYPES, PAYMENTS } from "../data/catalog";

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
// TODO(server): POST /api/orders → tạo đơn PENDING, trả payUrl.
// Trên mobile, mở payUrl bằng expo-web-browser (MoMo/ZaloPay deep link),
// rồi chờ IPN callback ở server xác nhận PAID mới cấp mã.
export async function createOrder({
  userId, cardTypeId, denom, qty, email, paymentId, idempotencyKey, onStatus,
}) {
  const orders = await read(KEY_ORDERS, []);
  const existing = orders.find((o) => o.idempotencyKey === idempotencyKey);
  if (existing) return existing;

  const card = CARD_TYPES.find((c) => c.id === cardTypeId);
  const pay = PAYMENTS.find((p) => p.id === paymentId);
  const { subtotal, discount, total } = quotePrice({ cardTypeId, denom, qty });

  const order = {
    id: "NT" + Date.now().toString().slice(-8),
    idempotencyKey, userId,
    cardName: card.name, cardTypeId,
    denom, qty, subtotal, discount, total, email,
    payment: pay.name,
    status: "PENDING",
    createdAt: new Date().toISOString(),
    codes: [],
  };
  onStatus?.("PENDING");
  orders.unshift(order);
  await write(KEY_ORDERS, orders);

  await delay(900);                       // giả lập mở cổng thanh toán
  order.status = "PAID";
  onStatus?.("PAID");

  await delay(600);                       // giả lập IPN callback + cấp mã
  order.codes = Array.from({ length: qty }, () => ({
    serial: "S" + Math.random().toString().slice(2, 12),
    pin:
      Math.random().toString(36).slice(2, 8).toUpperCase() + "-" +
      Math.random().toString(36).slice(2, 8).toUpperCase(),
  }));
  order.status = "DELIVERED";
  onStatus?.("DELIVERED");

  await write(KEY_ORDERS, orders.map((o) => (o.id === order.id ? order : o)));
  return order;
}

// TODO(server): GET /api/orders?page=&status=
export async function listOrders(userId) {
  await delay(300);
  const orders = await read(KEY_ORDERS, []);
  return orders.filter((o) => o.userId === userId);
}
