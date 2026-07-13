import { useState, useMemo, useEffect, useCallback } from "react";
import {
  View, Text, TextInput, Pressable, ScrollView, StyleSheet,
  KeyboardAvoidingView, Platform, ActivityIndicator,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ShieldCheck, Truck } from "lucide-react-native";

import Panel from "../components/Panel";
import PaymentPicker from "../components/PaymentPicker";
import ProductThumb from "../components/ProductThumb";
import Toast from "../components/Toast";

import { FREE_SHIP_THRESHOLD } from "../data/catalog";
import { vnd, isEmail } from "../utils/format";
import * as api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { colors, spacing, radius, font, shadow } from "../theme";

const STAGE_TEXT = {
  PENDING: "Đang mở cổng thanh toán...",
  PAID: "Đã thanh toán, đang xác nhận...",
  DELIVERED: "Hoàn tất",
};

// SĐT Việt Nam: bắt đầu bằng 0, tổng 10 số (di động) hoặc 11 số (một số đầu số cũ).
const isPhone = (v) => /^0\d{9,10}$/.test(v.replace(/\s/g, ""));

export default function CheckoutScreen() {
  const { user } = useAuth();
  const navigation = useNavigation();
  const route = useRoute();
  const product = route.params?.product;

  const [qty, setQty] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [paymentId, setPaymentId] = useState("vnpay");
  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);
  const [stage, setStage] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (user && !email) setEmail(user.email);
  }, [user, email]);

  const quote = useMemo(
    () => api.quoteProduct(product ? [{ price: product.price, qty }] : []),
    [product, qty]
  );

  if (!product) {
    return (
      <View style={[s.root, { justifyContent: "center", alignItems: "center", padding: spacing.xl }]}>
        <Text style={s.emptyText}>Không tìm thấy sản phẩm.</Text>
        <Pressable style={s.backBtn} onPress={() => navigation.goBack()}>
          <Text style={s.backBtnText}>Quay lại</Text>
        </Pressable>
      </View>
    );
  }

  const validate = () => {
    const e = {};
    if (qty < 1 || qty > 20) e.qty = "Số lượng từ 1 đến 20";
    if (!name.trim()) e.name = "Nhập họ tên người nhận";
    if (!isPhone(phone)) e.phone = "Số điện thoại không hợp lệ";
    if (!address.trim()) e.address = "Nhập địa chỉ nhận hàng";
    if (!isEmail(email)) e.email = "Email không hợp lệ";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const checkout = async () => {
    if (!user) {
      navigation.navigate("Auth", { mode: "login" });
      return;
    }
    if (!validate()) return;

    setProcessing(true);
    try {
      const key = `${user.id}-${product.sku}-${qty}-${Date.now()}`;
      await api.createProductOrder({
        userId: user.id,
        items: [{ sku: product.sku, name: product.name, price: product.price, qty }],
        shipping: { name: name.trim(), phone: phone.trim(), address: address.trim() },
        email,
        paymentId,
        idempotencyKey: key,
        onStatus: setStage,
      });
      setToast({ type: "success", message: "Đặt hàng thành công. Đơn đã được ghi nhận." });
      navigation.navigate("Tabs", { screen: "History" });
    } catch (err) {
      setToast({ type: "error", message: err.message || "Giao dịch thất bại. Vui lòng thử lại." });
    } finally {
      setProcessing(false);
      setStage(null);
    }
  };

  const closeToast = useCallback(() => setToast(null), []);
  const freeShip = quote.shippingFee === 0;

  return (
    <View style={s.root}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
          {/* Sản phẩm */}
          <View style={s.productCard}>
            <ProductThumb kind={product.kind} style={s.thumb} />
            <View style={s.productInfo}>
              <Text style={s.pname} numberOfLines={3}>{product.name}</Text>
              <Text style={s.price}>{vnd(product.price)}</Text>
            </View>
          </View>

          <Panel step="1" title="Số lượng" error={errors.qty}>
            <View style={s.stepper}>
              <Pressable
                onPress={() => setQty((q) => Math.max(1, q - 1))}
                style={s.stepBtn}
                accessibilityLabel="Giảm số lượng"
              >
                <Text style={s.stepBtnText}>−</Text>
              </Pressable>
              <TextInput
                value={String(qty)}
                onChangeText={(t) => setQty(Math.min(20, Math.max(1, parseInt(t, 10) || 1)))}
                keyboardType="number-pad"
                style={s.stepInput}
              />
              <Pressable
                onPress={() => setQty((q) => Math.min(20, q + 1))}
                style={s.stepBtn}
                accessibilityLabel="Tăng số lượng"
              >
                <Text style={s.stepBtnText}>+</Text>
              </Pressable>
            </View>
          </Panel>

          <Panel step="2" title="Thông tin giao hàng" error={errors.name || errors.phone || errors.address}>
            <Text style={s.label}>Họ tên người nhận</Text>
            <TextInput
              value={name}
              onChangeText={(t) => { setName(t); setErrors((e) => ({ ...e, name: null })); }}
              placeholder="Nguyễn Văn A"
              placeholderTextColor={colors.textFaint}
              style={[s.input, errors.name && s.inputError]}
            />

            <Text style={[s.label, { marginTop: spacing.md }]}>Số điện thoại</Text>
            <TextInput
              value={phone}
              onChangeText={(t) => { setPhone(t); setErrors((e) => ({ ...e, phone: null })); }}
              placeholder="09xxxxxxxx"
              placeholderTextColor={colors.textFaint}
              keyboardType="phone-pad"
              style={[s.input, errors.phone && s.inputError]}
            />

            <Text style={[s.label, { marginTop: spacing.md }]}>Địa chỉ nhận hàng</Text>
            <TextInput
              value={address}
              onChangeText={(t) => { setAddress(t); setErrors((e) => ({ ...e, address: null })); }}
              placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành"
              placeholderTextColor={colors.textFaint}
              multiline
              style={[s.input, s.inputMultiline, errors.address && s.inputError]}
            />

            <Text style={[s.label, { marginTop: spacing.md }]}>Email nhận xác nhận</Text>
            <TextInput
              value={email}
              onChangeText={(t) => { setEmail(t); setErrors((e) => ({ ...e, email: null })); }}
              placeholder="ban@example.com"
              placeholderTextColor={colors.textFaint}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              style={[s.input, errors.email && s.inputError]}
            />
            {errors.email ? <Text style={s.fieldErr}>{errors.email}</Text> : null}
          </Panel>

          <Panel step="3" title="Hình thức thanh toán">
            <PaymentPicker value={paymentId} onChange={setPaymentId} />
          </Panel>

          {/* Tóm tắt đơn hàng */}
          <View style={s.summary}>
            <View style={s.sHead}>
              <Truck size={16} color="#fff" />
              <Text style={s.sHeadText}>TÓM TẮT ĐƠN HÀNG</Text>
            </View>
            <View style={s.sBody}>
              <Row label={`Tạm tính (${qty} sản phẩm)`} value={vnd(quote.subtotal)} />
              <Row
                label="Phí vận chuyển"
                value={freeShip ? "Miễn phí" : vnd(quote.shippingFee)}
                valueColor={freeShip ? colors.success : colors.text}
              />
              {!freeShip ? (
                <Text style={s.shipHint}>
                  Mua thêm {vnd(FREE_SHIP_THRESHOLD - quote.subtotal)} để được miễn phí vận chuyển.
                </Text>
              ) : null}

              <View style={s.totalRow}>
                <Text style={s.totalLabel}>Tổng thanh toán</Text>
                <Text style={s.totalValue}>{vnd(quote.total)}</Text>
              </View>

              <Pressable
                onPress={checkout}
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
                    {user ? "THANH TOÁN" : "ĐĂNG NHẬP ĐỂ THANH TOÁN"}
                  </Text>
                )}
              </Pressable>

              <View style={s.note}>
                <ShieldCheck size={13} color={colors.textFaint} />
                <Text style={s.noteText}>
                  Thanh toán an toàn qua VNPay. Đơn hàng được giao theo Chính sách vận chuyển.
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Toast toast={toast} onClose={closeToast} />
    </View>
  );
}

function Row({ label, value, valueColor }) {
  return (
    <View style={s.row}>
      <Text style={s.rowLabel}>{label}</Text>
      <Text style={[s.rowValue, valueColor && { color: valueColor }]} numberOfLines={1}>{value}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: spacing.lg, paddingBottom: 40 },
  emptyText: { fontSize: font.md, color: colors.textMuted, marginBottom: spacing.lg },
  backBtn: { backgroundColor: colors.primary, paddingHorizontal: spacing.xl, paddingVertical: spacing.md, borderRadius: radius.md },
  backBtnText: { color: "#fff", fontWeight: "700" },

  productCard: {
    flexDirection: "row", gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1, borderColor: colors.border,
    padding: spacing.md, marginBottom: spacing.md,
    ...shadow.card,
  },
  thumb: { width: 84, height: 84 },
  productInfo: { flex: 1, justifyContent: "center", gap: spacing.xs },
  pname: { fontSize: font.sm, fontWeight: "600", color: colors.text },
  price: { fontWeight: "800", color: colors.primaryDark, fontSize: font.md },

  label: { fontSize: font.xs, fontWeight: "700", color: colors.textMuted, marginBottom: spacing.xs },
  input: {
    borderWidth: 1, borderColor: colors.borderStrong,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md, paddingVertical: 10,
    fontSize: font.base, color: colors.text,
  },
  inputMultiline: { minHeight: 62, textAlignVertical: "top" },
  inputError: { borderColor: colors.danger },
  fieldErr: { color: colors.danger, fontSize: font.xs, marginTop: spacing.xs },

  stepper: {
    flexDirection: "row", alignItems: "center",
    borderWidth: 1, borderColor: colors.borderStrong,
    borderRadius: radius.md, width: 140, overflow: "hidden",
  },
  stepBtn: { paddingHorizontal: spacing.lg, paddingVertical: 10 },
  stepBtnText: { fontSize: font.lg, color: colors.text },
  stepInput: { flex: 1, textAlign: "center", fontSize: font.base, color: colors.text, paddingVertical: 10 },

  summary: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1, borderColor: colors.border,
    overflow: "hidden",
    ...shadow.card,
  },
  sHead: {
    backgroundColor: colors.darkSurface,
    flexDirection: "row", alignItems: "center", gap: spacing.sm,
    paddingHorizontal: spacing.lg, paddingVertical: spacing.md,
  },
  sHeadText: { color: "#fff", fontWeight: "700", fontSize: font.sm },
  sBody: { padding: spacing.lg, gap: spacing.md },
  row: { flexDirection: "row", justifyContent: "space-between", gap: spacing.md },
  rowLabel: { color: colors.textMuted, fontSize: font.base },
  rowValue: { fontWeight: "600", fontSize: font.base, color: colors.text, flexShrink: 1 },
  shipHint: { fontSize: font.xs, color: colors.textFaint },
  totalRow: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    borderTopWidth: 1, borderTopColor: colors.border, paddingTop: spacing.md,
  },
  totalLabel: { fontWeight: "700", fontSize: font.md, color: colors.text },
  totalValue: { fontWeight: "800", fontSize: font.xl, color: colors.primaryDark },
  btn: { backgroundColor: colors.primary, paddingVertical: spacing.md, borderRadius: radius.md, alignItems: "center" },
  btnDisabled: { opacity: 0.6 },
  btnRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  btnText: { color: "#fff", fontWeight: "800", fontSize: font.base },
  note: { flexDirection: "row", gap: spacing.xs },
  noteText: { flex: 1, fontSize: font.xs, color: colors.textFaint, lineHeight: 15 },
});
