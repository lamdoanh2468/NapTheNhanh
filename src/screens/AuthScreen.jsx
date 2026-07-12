import { useState } from "react";
import {
  View, Text, TextInput, Pressable, StyleSheet,
  KeyboardAvoidingView, Platform, ActivityIndicator,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { isEmail } from "../utils/format";
import { useAuth } from "../context/AuthContext";
import { colors, spacing, radius, font, shadow } from "../theme";

export default function AuthScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { login, register } = useAuth();

  const [mode, setMode] = useState(route.params?.mode || "login");
  const isLogin = mode === "login";

  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!isEmail(email)) return setErr("Email không hợp lệ");
    if (pass.length < 6) return setErr("Mật khẩu tối thiểu 6 ký tự");

    setBusy(true);
    setErr("");
    try {
      await (isLogin ? login : register)({ email, password: pass });
      navigation.goBack(); // web: navigate(from). RN modal: đóng lại là về đúng chỗ.
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={s.root}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={s.card}>
        <Text style={s.title}>{isLogin ? "Đăng nhập" : "Đăng ký"}</Text>
        <Text style={s.sub}>
          {isLogin
            ? "Đăng nhập để mua thẻ và xem lịch sử giao dịch."
            : "Tạo tài khoản để lưu mã thẻ và theo dõi đơn hàng."}
        </Text>

        <Text style={s.label}>Email</Text>
        <TextInput
          value={email}
          onChangeText={(t) => { setEmail(t); setErr(""); }}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          textContentType="emailAddress"
          style={s.input}
        />

        <Text style={s.label}>Mật khẩu</Text>
        <TextInput
          value={pass}
          onChangeText={(t) => { setPass(t); setErr(""); }}
          secureTextEntry
          textContentType={isLogin ? "password" : "newPassword"}
          style={s.input}
        />

        {err ? <Text style={s.err}>{err}</Text> : null}

        <Pressable onPress={submit} disabled={busy} style={[s.btn, busy && s.btnDisabled]}>
          {busy
            ? <ActivityIndicator color="#fff" />
            : <Text style={s.btnText}>{isLogin ? "Đăng nhập" : "Tạo tài khoản"}</Text>}
        </Pressable>

        <Pressable onPress={() => { setMode(isLogin ? "register" : "login"); setErr(""); }}>
          <Text style={s.switch}>
            {isLogin ? "Chưa có tài khoản? " : "Đã có tài khoản? "}
            <Text style={s.switchLink}>{isLogin ? "Đăng ký" : "Đăng nhập"}</Text>
          </Text>
        </Pressable>
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
  label: { fontSize: font.xs, fontWeight: "700", color: colors.textMuted, marginBottom: spacing.xs },
  input: {
    borderWidth: 1, borderColor: colors.borderStrong,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md, paddingVertical: 10,
    fontSize: font.base, color: colors.text,
    marginBottom: spacing.md,
  },
  err: { color: colors.danger, fontSize: font.xs, marginBottom: spacing.sm },
  btn: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    alignItems: "center",
    marginTop: spacing.xs,
  },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: "#fff", fontWeight: "800", fontSize: font.base },
  switch: { textAlign: "center", fontSize: font.sm, color: colors.textMuted, marginTop: spacing.lg },
  switchLink: { color: colors.primaryDark, fontWeight: "700" },
});
