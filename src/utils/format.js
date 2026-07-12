import { colors } from "../theme";

/**
 * Android/Hermes không kèm full-ICU → toLocaleString("vi-VN") trả về "1000000"
 * thay vì "1.000.000". Phải tự chèn dấu chấm phân cách.
 */
export const vnd = (n) =>
  String(Math.round(n || 0)).replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "đ";

export const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

const pad = (x) => String(x).padStart(2, "0");
export const formatDateTime = (iso) => {
  const d = new Date(iso);
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
};

export const ORDER_STATUS = {
  PENDING:   { label: "Chờ thanh toán", bg: colors.warnBg,    fg: colors.warnText },
  PAID:      { label: "Đã thanh toán",  bg: colors.infoBg,    fg: colors.infoText },
  DELIVERED: { label: "Đã giao mã",     bg: colors.successBg, fg: colors.successText },
  FAILED:    { label: "Thất bại",       bg: colors.dangerBg,  fg: colors.dangerText },
};
