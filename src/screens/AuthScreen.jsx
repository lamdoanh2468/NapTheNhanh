import { useState } from "react";
import {
  View, Text, TextInput, Pressable, StyleSheet,
  KeyboardAvoidingView, Platform, ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Phone, ArrowLeft } from "lucide-react-native";
import { useAuth } from "../context/AuthContext";
import { colors, spacing, radius, font, shadow } from "../theme";

// Chuyển số Việt Nam về E.164 cho Firebase: 0912345678 → +84912345678.
function toE164(raw) {
  const d = raw.replace(/[^\d+]/g, "");
  if (d.startsWith("+")) return d;
  if (d.startsWith("84")) return "+" + d;
  if (d.startsWith("0")) return "+84" + d.slice(1);
  return "+84" + d;
}
const isVnPhone = (raw) => /^0\d{9}$/.test(raw.replace(/\s/g, ""));

export default function AuthScreen() {
  const navigation = useNavigation();
  const { signInWithGoogle, sendOtp } = useAuth();

  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [confirmation, setConfirmation] = useState(null); // có giá trị → đang ở bước nhập OTP
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const onGoogle = async () => {
    setBusy(true);
    setErr("");
    try {
      await signInWithGoogle();
      navigation.goBack(); // onAuthStateChanged đã cập nhật user
    } catch (e) {
      setErr(e.message || "Đăng nhập Google thất bại.");
    } finally {
      setBusy(false);
    }
  };

  const onSendOtp = async () => {
    if (!isVnPhone(phone)) return setErr("Số điện thoại không hợp lệ (VD: 0912345678).");
    setBusy(true);
    setErr("");
    try {
      const conf = await sendOtp(toE164(phone));
      setConfirmation(conf);
    } catch (e) {
      setErr(e.message || "Không gửi được mã OTP. Thử lại sau.");
    } finally {
      setBusy(false);
    }
  };

  const onConfirmOtp = async () => {
    if (code.length < 6) return setErr("Nhập đủ 6 số mã OTP.");
    setBusy(true);
    setErr("");
    try {
      await confirmation.confirm(code);
      navigation.goBack(); // đăng nhập thành công
    } catch (e) {
      setErr("Mã OTP không đúng hoặc đã hết hạn.");
    } finally {
      setBusy(false);
    }
  };

  const resetPhone = () => {
    setConfirmation(null);
    setCode("");
    setErr("");
  };

  return (
    <KeyboardAvoidingView
      style={s.root}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={s.card}>
        <Text style={s.title}>Đăng nhập</Text>
        <Text style={s.sub}>Đăng nhập để mua thẻ, đặt hàng và xem lịch sử giao dịch.</Text>

        {/* ĐN Google */}
        <Pressable onPress={onGoogle} disabled={busy} style={[s.googleBtn, busy && s.disabled]}>
          <View style={s.gIcon}>
            <Text style={s.gIconText}>G</Text>
          </View>
          <Text style={s.googleText}>Tiếp tục với Google</Text>
        </Pressable>

        <View style={s.divider}>
          <View style={s.line} />
          <Text style={s.dividerText}>hoặc dùng số điện thoại</Text>
          <View style={s.line} />
        </View>

        {/* ĐN số điện thoại — 2 bước: nhập số → nhập OTP */}
        {!confirmation ? (
          <>
            <Text style={s.label}>Số điện thoại</Text>
            <View style={s.phoneRow}>
              <View style={s.prefix}>
                <Phone size={15} color={colors.textMuted} />
                <Text style={s.prefixText}>+84</Text>
              </View>
              <TextInput
                value={phone}
                onChangeText={(t) => { setPhone(t); setErr(""); }}
                placeholder="0912 345 678"
                placeholderTextColor={colors.textFaint}
                keyboardType="phone-pad"
                style={s.phoneInput}
              />
            </View>

            {err ? <Text style={s.err}>{err}</Text> : null}

            <Pressable onPress={onSendOtp} disabled={busy} style={[s.btn, busy && s.disabled]}>
              {busy
                ? <ActivityIndicator color="#fff" />
                : <Text style={s.btnText}>Gửi mã OTP</Text>}
            </Pressable>
          </>
        ) : (
          <>
            <Pressable onPress={resetPhone} style={s.back}>
              <ArrowLeft size={15} color={colors.textMuted} />
              <Text style={s.backText}>Đổi số ({phone})</Text>
            </Pressable>

            <Text style={s.label}>Mã OTP đã gửi tới {toE164(phone)}</Text>
            <TextInput
              value={code}
              onChangeText={(t) => { setCode(t.replace(/\D/g, "").slice(0, 6)); setErr(""); }}
              placeholder="______"
              placeholderTextColor={colors.textFaint}
              keyboardType="number-pad"
              style={s.otpInput}
              maxLength={6}
            />

            {err ? <Text style={s.err}>{err}</Text> : null}

            <Pressable onPress={onConfirmOtp} disabled={busy} style={[s.btn, busy && s.disabled]}>
              {busy
                ? <ActivityIndicator color="#fff" />
                : <Text style={s.btnText}>Xác nhận & đăng nhập</Text>}
            </Pressable>

            <Pressable onPress={onSendOtp} disabled={busy}>
              <Text style={s.resend}>Gửi lại mã OTP</Text>
            </Pressable>
          </>
        )}

        <Text style={s.note}>
          Bằng việc đăng nhập, bạn đồng ý với Điều khoản sử dụng và Chính sách bảo mật của Nạp Thẻ Ngay.
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg, justifyContent: "center", padding: spacing.lg },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1, borderColor: colors.border,
    padding: spacing.xxl,
    ...shadow.card,
  },
  title: { fontWeight: "800", fontSize: font.xl, color: colors.text, marginBottom: spacing.xs },
  sub: { fontSize: font.sm, color: colors.textMuted, marginBottom: spacing.xl },

  googleBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: spacing.md,
    borderWidth: 1, borderColor: colors.borderStrong,
    borderRadius: radius.md, paddingVertical: spacing.md,
    backgroundColor: colors.surface,
  },
  gIcon: {
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: "#fff", borderWidth: 1, borderColor: colors.border,
    alignItems: "center", justifyContent: "center",
  },
  gIconText: { fontWeight: "900", fontSize: font.sm, color: "#4285F4" },
  googleText: { fontWeight: "700", fontSize: font.base, color: colors.text },

  divider: { flexDirection: "row", alignItems: "center", gap: spacing.sm, marginVertical: spacing.lg },
  line: { flex: 1, height: 1, backgroundColor: colors.border },
  dividerText: { fontSize: font.xs, color: colors.textFaint },

  label: { fontSize: font.xs, fontWeight: "700", color: colors.textMuted, marginBottom: spacing.xs },
  phoneRow: {
    flexDirection: "row", alignItems: "center",
    borderWidth: 1, borderColor: colors.borderStrong, borderRadius: radius.md, overflow: "hidden",
  },
  prefix: {
    flexDirection: "row", alignItems: "center", gap: 4,
    paddingHorizontal: spacing.md, paddingVertical: 10,
    borderRightWidth: 1, borderRightColor: colors.border, backgroundColor: colors.bg,
  },
  prefixText: { fontSize: font.base, fontWeight: "700", color: colors.textMuted },
  phoneInput: { flex: 1, paddingHorizontal: spacing.md, paddingVertical: 10, fontSize: font.base, color: colors.text },

  otpInput: {
    borderWidth: 1, borderColor: colors.borderStrong, borderRadius: radius.md,
    paddingHorizontal: spacing.md, paddingVertical: 12,
    fontSize: font.xl, letterSpacing: 8, textAlign: "center", color: colors.text,
  },

  back: { flexDirection: "row", alignItems: "center", gap: 4, marginBottom: spacing.md },
  backText: { fontSize: font.sm, color: colors.textMuted, fontWeight: "600" },

  err: { color: colors.danger, fontSize: font.xs, marginTop: spacing.sm },
  btn: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md, borderRadius: radius.md,
    alignItems: "center", marginTop: spacing.md,
  },
  disabled: { opacity: 0.6 },
  btnText: { color: "#fff", fontWeight: "800", fontSize: font.base },
  resend: { textAlign: "center", color: colors.primaryDark, fontWeight: "700", fontSize: font.sm, marginTop: spacing.md },

  note: { fontSize: font.xs, color: colors.textFaint, lineHeight: 16, marginTop: spacing.xl, textAlign: "center" },
});
