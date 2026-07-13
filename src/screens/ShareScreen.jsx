import { useState, useCallback } from "react";
import { View, Text, Pressable, StyleSheet, Linking, ScrollView } from "react-native";
import QRCode from "react-native-qrcode-svg";
import * as Clipboard from "expo-clipboard";
import { Copy, Check, ExternalLink, QrCode } from "lucide-react-native";

import { WEB_APP_URL } from "../utils/config";
import { COMPANY } from "../data/catalog";
import { colors, spacing, radius, font, shadow } from "../theme";

/**
 * Hiện mã QR để người khác quét → mở giao diện web của app trên trình duyệt.
 * URL lấy từ WEB_APP_URL (xem src/utils/config.js).
 */
export default function ShareScreen() {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async () => {
    await Clipboard.setStringAsync(WEB_APP_URL);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, []);

  const openWeb = useCallback(() => Linking.openURL(WEB_APP_URL), []);

  return (
    <ScrollView style={s.root} contentContainerStyle={s.scroll}>
      <View style={s.card}>
        <View style={s.head}>
          <QrCode size={18} color={colors.primary} />
          <Text style={s.title}>Quét để mở phiên bản web</Text>
        </View>
        <Text style={s.sub}>
          Đưa mã này cho bạn bè quét bằng camera điện thoại để mở {COMPANY.name.includes("FUNTEK") ? "Nạp Thẻ Ngay" : "app"} trên trình duyệt — không cần cài đặt.
        </Text>

        <View style={s.qrBox}>
          <QRCode
            value={WEB_APP_URL}
            size={220}
            color={colors.dark}
            backgroundColor="#ffffff"
            ecl="M"
          />
        </View>

        <Text style={s.urlLabel}>Đường dẫn</Text>
        <Pressable style={s.urlRow} onPress={copy}>
          <Text style={s.url} numberOfLines={1}>{WEB_APP_URL}</Text>
          {copied
            ? <Check size={16} color={colors.success} />
            : <Copy size={16} color={colors.textMuted} />}
        </Pressable>

        <View style={s.actions}>
          <Pressable style={[s.btn, s.btnGhost]} onPress={copy}>
            {copied
              ? <Check size={16} color={colors.primaryDark} />
              : <Copy size={16} color={colors.primaryDark} />}
            <Text style={s.btnGhostText}>{copied ? "Đã sao chép" : "Sao chép link"}</Text>
          </Pressable>
          <Pressable style={[s.btn, s.btnPrimary]} onPress={openWeb}>
            <ExternalLink size={16} color="#fff" />
            <Text style={s.btnPrimaryText}>Mở web</Text>
          </Pressable>
        </View>
      </View>

      <Text style={s.note}>
        Mẹo: người quét cần cùng mạng nếu đây là địa chỉ nội bộ. Khi triển khai chính thức, đặt biến EXPO_PUBLIC_WEB_URL trỏ tới tên miền web đã publish để ai cũng quét được.
      </Text>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: spacing.lg },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1, borderColor: colors.border,
    padding: spacing.xl,
    alignItems: "center",
    ...shadow.card,
  },
  head: { flexDirection: "row", alignItems: "center", gap: spacing.sm, marginBottom: spacing.xs },
  title: { fontWeight: "800", fontSize: font.md, color: colors.text },
  sub: { fontSize: font.sm, color: colors.textMuted, textAlign: "center", marginBottom: spacing.xl, lineHeight: 19 },

  qrBox: {
    backgroundColor: "#fff",
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1, borderColor: colors.border,
    marginBottom: spacing.xl,
  },

  urlLabel: { alignSelf: "flex-start", fontSize: font.xs, fontWeight: "700", color: colors.textMuted, marginBottom: spacing.xs },
  urlRow: {
    flexDirection: "row", alignItems: "center", gap: spacing.sm,
    width: "100%",
    borderWidth: 1, borderColor: colors.borderStrong, borderRadius: radius.md,
    paddingHorizontal: spacing.md, paddingVertical: 10,
    backgroundColor: colors.bg,
  },
  url: { flex: 1, fontSize: font.sm, color: colors.text },

  actions: { flexDirection: "row", gap: spacing.md, marginTop: spacing.lg, width: "100%" },
  btn: {
    flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: spacing.sm,
    paddingVertical: spacing.md, borderRadius: radius.md,
  },
  btnGhost: { borderWidth: 1, borderColor: colors.primary, backgroundColor: colors.primarySoft },
  btnGhostText: { color: colors.primaryDark, fontWeight: "700", fontSize: font.sm },
  btnPrimary: { backgroundColor: colors.primary },
  btnPrimaryText: { color: "#fff", fontWeight: "800", fontSize: font.sm },

  note: { fontSize: font.xs, color: colors.textFaint, lineHeight: 16, marginTop: spacing.lg, textAlign: "center" },
});
