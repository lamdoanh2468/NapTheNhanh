import { View, Text, Pressable, StyleSheet, ActivityIndicator } from "react-native";
import { ShoppingCart, ShieldCheck } from "lucide-react-native";
import { vnd } from "../utils/format";
import { colors, spacing, radius, font, shadow } from "../theme";

function Row({ label, value, valueColor }) {
  return (
    <View style={s.row}>
      <Text style={s.rowLabel}>{label}</Text>
      <Text style={[s.rowValue, valueColor && { color: valueColor }]} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

const STAGE_TEXT = {
  PENDING: "Đang mở cổng thanh toán...",
  PAID: "Đã thanh toán, đang cấp mã...",
  DELIVERED: "Hoàn tất",
};

export default function OrderSummary({
  card, denom, qty, email, quote, loggedIn, processing, stage, onCheckout,
}) {
  return (
    <View style={s.card}>
      <View style={s.head}>
        <ShoppingCart size={16} color="#fff" />
        <Text style={s.headText}>CHI TIẾT GIAO DỊCH</Text>
      </View>

      <View style={s.body}>
        <Row label="Loại mã thẻ" value={card?.name || "—"} />
        <Row label="Mệnh giá thẻ" value={denom ? vnd(denom) : "0đ"} />
        <Row label="Số lượng" value={denom ? String(qty) : "0"} />
        <Row label="Email nhận" value={email || "—"} />
        <Row label="Phí quản lý" value="Miễn phí" valueColor={colors.success} />
        <Row label="Giảm giá" value={`−${vnd(quote.discount)}`} valueColor={colors.success} />

        <View style={s.totalRow}>
          <Text style={s.totalLabel}>Tổng tiền</Text>
          <Text style={s.totalValue}>{vnd(quote.total)}</Text>
        </View>

        <Pressable
          onPress={onCheckout}
          disabled={processing}
          style={[s.btn, processing && s.btnDisabled]}
          accessibilityRole="button"
        >
          {processing ? (
            <View style={s.btnRow}>
              <ActivityIndicator color="#fff" size="small" />
              <Text style={s.btnText}>{STAGE_TEXT[stage] || "Đang xử lý..."}</Text>
            </View>
          ) : (
            <Text style={s.btnText}>
              {loggedIn ? "THANH TOÁN" : "ĐĂNG NHẬP ĐỂ THANH TOÁN"}
            </Text>
          )}
        </Pressable>

        <View style={s.note}>
          <ShieldCheck size={13} color={colors.textFaint} />
          <Text style={s.noteText}>
            Mã thẻ được gửi tới email ngay sau khi thanh toán thành công.
          </Text>
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1, borderColor: colors.border,
    overflow: "hidden",
    marginBottom: spacing.md,
    ...shadow.card,
  },
  head: {
    backgroundColor: colors.darkSurface,
    flexDirection: "row", alignItems: "center", gap: spacing.sm,
    paddingHorizontal: spacing.lg, paddingVertical: spacing.md,
  },
  headText: { color: "#fff", fontWeight: "700", fontSize: font.sm },
  body: { padding: spacing.lg, gap: spacing.md },
  row: { flexDirection: "row", justifyContent: "space-between", gap: spacing.md },
  rowLabel: { color: colors.textMuted, fontSize: font.base },
  rowValue: { fontWeight: "600", fontSize: font.base, color: colors.text, flexShrink: 1 },
  totalRow: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    borderTopWidth: 1, borderTopColor: colors.border,
    paddingTop: spacing.md,
  },
  totalLabel: { fontWeight: "700", fontSize: font.md, color: colors.text },
  totalValue: { fontWeight: "800", fontSize: font.xl, color: colors.primaryDark },
  btn: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    alignItems: "center",
  },
  btnDisabled: { opacity: 0.6 },
  btnRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  btnText: { color: "#fff", fontWeight: "800", fontSize: font.base },
  note: { flexDirection: "row", gap: spacing.xs },
  noteText: { flex: 1, fontSize: font.xs, color: colors.textFaint, lineHeight: 15 },
});
