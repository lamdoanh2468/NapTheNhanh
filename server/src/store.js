// Kho đơn hàng trong bộ nhớ — ĐỦ để demo/sandbox.
// Production: thay bằng DB thật (Postgres/Mongo…) và transaction để chống race khi IPN + return
// cùng xác nhận một đơn.
const orders = new Map();

// vnp_TxnRef chỉ nhận [a-zA-Z0-9] và tối đa 100 ký tự → dùng mã ngắn không dấu.
export function newOrderId() {
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `NT${Date.now().toString().slice(-9)}${rand}`;
}

export function createOrder(data) {
  const order = {
    status: "PENDING", // PENDING → PAID(+DELIVERED) | FAILED
    codes: [],
    createdAt: new Date().toISOString(),
    ...data,
  };
  orders.set(order.id, order);
  return order;
}

export function getOrder(id) {
  return orders.get(id) || null;
}

// Sinh mã thẻ giả lập. Production: gọi API nhà phát hành để lấy mã thật.
function issueCodes(qty) {
  return Array.from({ length: qty }, () => ({
    serial: "S" + Math.random().toString().slice(2, 12),
    pin:
      Math.random().toString(36).slice(2, 8).toUpperCase() +
      "-" +
      Math.random().toString(36).slice(2, 8).toUpperCase(),
  }));
}

// Xác nhận đã thanh toán. Idempotent: gọi nhiều lần (IPN + return) chỉ xử lý một lần.
// - Đơn thẻ game (kind "card"): cấp mã thẻ.
// - Đơn hàng vật lý (kind "product"): không có mã, chỉ chuyển sang trạng thái đã thanh toán/chờ giao.
// Trả về "already" nếu đơn đã được xác nhận trước đó.
export function markPaid(order) {
  if (order.status === "PAID" || order.status === "DELIVERED") return "already";
  order.status = "DELIVERED";
  order.codes = order.kind === "product" ? [] : issueCodes(order.qty);
  order.paidAt = new Date().toISOString();
  return "ok";
}

export function markFailed(order) {
  if (order.status === "PENDING") order.status = "FAILED";
}
