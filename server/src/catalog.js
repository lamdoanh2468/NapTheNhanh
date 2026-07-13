// Nguồn SỰ THẬT về giá nằm ở server — client gửi lên gì cũng phải tính lại tại đây.
// Giữ đồng bộ với src/data/catalog.js của app (chiết khấu theo loại thẻ).
export const CARD_TYPES = [
  { id: "v-coin", name: "V-Coin", discount: 0.03 },
  { id: "garena", name: "Garena", discount: 0.02 },
  { id: "zing", name: "Zing", discount: 0.025 },
  { id: "appota", name: "Appota", discount: 0.04 },
  { id: "gate", name: "Gate", discount: 0.03 },
  { id: "oncash", name: "On Cash", discount: 0.05 },
  { id: "bit", name: "Bit", discount: 0.02 },
];

export const DENOMINATIONS = [
  10000, 20000, 50000, 100000, 200000, 500000, 1000000,
];

export const MAX_QTY = 20;

// Tính giá phía server. Trả về null nếu input không hợp lệ (chặn giả mạo mệnh giá/SL).
export function quotePrice({ cardTypeId, denom, qty }) {
  const card = CARD_TYPES.find((c) => c.id === cardTypeId);
  if (!card) return null;
  if (!DENOMINATIONS.includes(denom)) return null;
  if (!Number.isInteger(qty) || qty < 1 || qty > MAX_QTY) return null;

  const subtotal = denom * qty;
  const discount = Math.round(subtotal * card.discount);
  return { card, subtotal, discount, fee: 0, total: subtotal - discount };
}
