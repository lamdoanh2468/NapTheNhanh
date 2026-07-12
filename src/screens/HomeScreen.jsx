import { useState, useMemo, useEffect, useCallback } from "react";
import {
  View, Text, TextInput, Pressable, ScrollView, StyleSheet,
  KeyboardAvoidingView, Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ticket, ChevronRight } from "lucide-react-native";

import Panel from "../components/Panel";
import CardSelector from "../components/CardSelector";
import DenominationPicker from "../components/DenominationPicker";
import PaymentPicker from "../components/PaymentPicker";
import OrderSummary from "../components/OrderSummary";
import Toast from "../components/Toast";

import { CARD_TYPES, NEWS } from "../data/catalog";
import { isEmail } from "../utils/format";
import * as api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { colors, spacing, radius, font, shadow } from "../theme";

export default function HomeScreen() {
  const { user } = useAuth();
  const navigation = useNavigation();

  const [cardTypeId, setCardTypeId] = useState(null);
  const [denom, setDenom] = useState(null);
  const [qty, setQty] = useState(1);
  const [email, setEmail] = useState("");
  const [paymentId, setPaymentId] = useState("momo");
  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);
  const [stage, setStage] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (user && !email) setEmail(user.email);
  }, [user, email]);

  const card = CARD_TYPES.find((c) => c.id === cardTypeId);
  const quote = useMemo(
    () => api.quotePrice({ cardTypeId, denom, qty }),
    [cardTypeId, denom, qty]
  );

  const validate = () => {
    const e = {};
    if (!cardTypeId) e.cardTypeId = "Chọn loại thẻ";
    if (!denom) e.denom = "Chọn mệnh giá";
    if (qty < 1 || qty > 20) e.qty = "Số lượng từ 1 đến 20";
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
      // idempotencyKey chặn double-tap tạo hai đơn
      const key = `${user.id}-${cardTypeId}-${denom}-${qty}-${Date.now()}`;
      await api.createOrder({
        userId: user.id, cardTypeId, denom, qty, email, paymentId,
        idempotencyKey: key,
        onStatus: setStage,
      });
      setToast({ type: "success", message: "Thanh toán thành công. Mã thẻ đã gửi về email." });
      setDenom(null);
      setQty(1);
      navigation.navigate("History");
    } catch (err) {
      setToast({ type: "error", message: err.message || "Giao dịch thất bại. Vui lòng thử lại." });
    } finally {
      setProcessing(false);
      setStage(null);
    }
  };

  const closeToast = useCallback(() => setToast(null), []);

  return (
    <View style={s.root}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={s.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <Panel step="1" title="Chọn loại thẻ" error={errors.cardTypeId}>
            <CardSelector
              value={cardTypeId}
              onChange={(v) => { setCardTypeId(v); setErrors((e) => ({ ...e, cardTypeId: null })); }}
            />
          </Panel>

          <Panel step="2" title="Chọn mệnh giá" error={errors.denom}>
            <DenominationPicker
              value={denom}
              onChange={(v) => { setDenom(v); setErrors((e) => ({ ...e, denom: null })); }}
            />
          </Panel>

          <Panel step="3" title="Số lượng & email" error={errors.qty || errors.email}>
            <Text style={s.label}>Số lượng</Text>
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

            <Text style={[s.label, { marginTop: spacing.lg }]}>Email nhận mã thẻ</Text>
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
          </Panel>

          <Panel step="4" title="Hình thức thanh toán">
            <PaymentPicker value={paymentId} onChange={setPaymentId} />
          </Panel>

          {/* Web có sidebar sticky. Màn hình hẹp → tóm tắt nằm dưới form. */}
          <OrderSummary
            card={card} denom={denom} qty={qty} email={email} quote={quote}
            loggedIn={!!user} processing={processing} stage={stage} onCheckout={checkout}
          />

          <View style={s.newsCard}>
            <View style={s.newsHead}>
              <Ticket size={18} color={colors.primary} />
              <Text style={s.newsTitle}>Tin tức & khuyến mãi</Text>
              <Pressable onPress={() => navigation.navigate("News")}>
                <Text style={s.newsAll}>Xem tất cả</Text>
              </Pressable>
            </View>

            {NEWS.map((n, i) => (
              <Pressable
                key={n.slug}
                onPress={() => navigation.navigate("NewsDetail", { slug: n.slug })}
                style={[s.newsItem, i > 0 && s.newsDivider]}
              >
                <View style={s.tag}>
                  <Text style={s.tagText}>{n.tag}</Text>
                </View>
                <Text style={s.newsItemTitle} numberOfLines={2}>{n.title}</Text>
                <ChevronRight size={14} color={colors.textFaint} />
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Toast toast={toast} onClose={closeToast} />
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: spacing.lg, paddingBottom: 40 },

  label: { fontSize: font.xs, fontWeight: "700", color: colors.textMuted, marginBottom: spacing.xs },
  input: {
    borderWidth: 1, borderColor: colors.borderStrong,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md, paddingVertical: 10,
    fontSize: font.base, color: colors.text,
  },
  inputError: { borderColor: colors.danger },

  stepper: {
    flexDirection: "row", alignItems: "center",
    borderWidth: 1, borderColor: colors.borderStrong,
    borderRadius: radius.md,
    width: 140, overflow: "hidden",
  },
  stepBtn: { paddingHorizontal: spacing.lg, paddingVertical: 10 },
  stepBtnText: { fontSize: font.lg, color: colors.text },
  stepInput: {
    flex: 1, textAlign: "center",
    fontSize: font.base, color: colors.text,
    paddingVertical: 10,
  },

  newsCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1, borderColor: colors.border,
    padding: spacing.lg,
    ...shadow.card,
  },
  newsHead: { flexDirection: "row", alignItems: "center", gap: spacing.sm, marginBottom: spacing.md },
  newsTitle: { flex: 1, fontWeight: "700", fontSize: font.md, color: colors.text },
  newsAll: { fontSize: font.xs, fontWeight: "700", color: colors.primaryDark },
  newsItem: { flexDirection: "row", alignItems: "center", gap: spacing.sm, paddingVertical: 10 },
  newsDivider: { borderTopWidth: 1, borderTopColor: colors.border },
  newsItemTitle: { flex: 1, fontSize: font.sm, color: colors.text },
  tag: {
    backgroundColor: colors.primaryBadgeBg,
    paddingHorizontal: spacing.sm, paddingVertical: 2,
    borderRadius: radius.sm,
  },
  tagText: { fontSize: 10, fontWeight: "700", color: colors.primaryBadgeText },
});
