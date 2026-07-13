import { View, Text, ScrollView, Pressable, StyleSheet, Linking, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  User, LogIn, LogOut, ChevronRight, Phone, Mail, HelpCircle, BookOpen, FileText, QrCode,
} from "lucide-react-native";
import { COMPANY, CARD_TYPES } from "../data/catalog";
import { useAuth } from "../context/AuthContext";
import { colors, spacing, radius, font, shadow } from "../theme";

const POLICIES = [
  ["chinh-sach-bao-hanh", "Chính sách bảo hành"],
  ["chinh-sach-bao-mat", "Chính sách bảo mật"],
  ["chinh-sach-van-chuyen", "Chính sách giao hàng"],
  ["chinh-sach-doi-tra", "Chính sách đổi trả và hoàn tiền"],
  ["dieu-khoan-chung", "Chính sách hoạt động"],
  ["chinh-sach-kiem-hang", "Chính sách kiểm hàng"],
  ["quy-dinh-thanh-toan", "Quy định và hình thức thanh toán"],
  ["thong-tin-san-pham", "Thông tin sản phẩm"],
];

function Item({ icon: Icon, label, onPress }) {
  return (
    <Pressable onPress={onPress} style={s.item}>
      {Icon ? <Icon size={16} color={colors.textMuted} /> : null}
      <Text style={s.itemText}>{label}</Text>
      <ChevronRight size={16} color={colors.textFaint} />
    </Pressable>
  );
}

/** Web có Footer trên mọi trang. RN không có footer → gom vào tab Tài khoản. */
export default function AccountScreen() {
  const { user, logout } = useAuth();
  const navigation = useNavigation();

  const confirmLogout = () => {
    Alert.alert("Đăng xuất", "Bạn chắc chắn muốn đăng xuất?", [
      { text: "Huỷ", style: "cancel" },
      { text: "Đăng xuất", style: "destructive", onPress: logout },
    ]);
  };

  return (
    <ScrollView style={s.root} contentContainerStyle={{ padding: spacing.lg, gap: spacing.md }}>
      <View style={s.card}>
        {user ? (
          <>
            <View style={s.profile}>
              <View style={s.avatar}>
                <User size={22} color="#fff" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.name}>
                  {user.name || user.phone || (user.email ? user.email.split("@")[0] : "Người dùng")}
                </Text>
                <Text style={s.email}>{user.phone || user.email || "Đã đăng nhập"}</Text>
              </View>
            </View>
            <Pressable onPress={confirmLogout} style={s.logoutBtn}>
              <LogOut size={16} color={colors.danger} />
              <Text style={s.logoutText}>Đăng xuất</Text>
            </Pressable>
          </>
        ) : (
          <>
            <Text style={s.guestTitle}>Chưa đăng nhập</Text>
            <Text style={s.guestSub}>Đăng nhập để mua thẻ và xem lịch sử giao dịch.</Text>
            <Pressable
              onPress={() => navigation.navigate("Auth", { mode: "login" })}
              style={s.loginBtn}
            >
              <LogIn size={16} color="#fff" />
              <Text style={s.loginText}>Đăng nhập / Đăng ký</Text>
            </Pressable>
          </>
        )}
      </View>

      <View style={s.card}>
        <Text style={s.section}>Chia sẻ</Text>
        <Item icon={QrCode} label="Mã QR mở phiên bản web" onPress={() => navigation.navigate("Share")} />
      </View>

      <View style={s.card}>
        <Text style={s.section}>Hỗ trợ</Text>
        <Item icon={HelpCircle} label="Câu hỏi thường gặp" onPress={() => navigation.navigate("Faq")} />
        {COMPANY.hotlines.map((h) => (
          <Item
            key={h}
            icon={Phone}
            label={h}
            onPress={() => Linking.openURL(`tel:${h.replace(/\s/g, "")}`)}
          />
        ))}
        <Item
          icon={Mail}
          label={COMPANY.email}
          onPress={() => Linking.openURL(`mailto:${COMPANY.email}`)}
        />
      </View>

      <View style={s.card}>
        <Text style={s.section}>Hướng dẫn mua thẻ</Text>
        {CARD_TYPES.map((c) => (
          <Item
            key={c.id}
            icon={BookOpen}
            label={`Thẻ ${c.name}`}
            onPress={() => navigation.navigate("Guide", { cardId: c.id })}
          />
        ))}
      </View>

      <View style={s.card}>
        <Text style={s.section}>Chính sách</Text>
        {POLICIES.map(([slug, label]) => (
          <Item
            key={slug}
            icon={FileText}
            label={label}
            onPress={() => navigation.navigate("Article", { slug })}
          />
        ))}
      </View>

      <Text style={s.company}>{COMPANY.name}</Text>
      <Text style={s.legal}>{COMPANY.license}</Text>
      <Text style={s.legal}>{COMPANY.address}</Text>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1, borderColor: colors.border,
    padding: spacing.lg,
    ...shadow.card,
  },
  profile: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  avatar: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: "center", justifyContent: "center",
  },
  name: { fontWeight: "800", fontSize: font.md, color: colors.text },
  email: { fontSize: font.sm, color: colors.textMuted },
  logoutBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: spacing.sm,
    marginTop: spacing.lg, paddingVertical: 10,
    borderWidth: 1, borderColor: colors.dangerBg,
    borderRadius: radius.md,
  },
  logoutText: { color: colors.danger, fontWeight: "700", fontSize: font.sm },

  guestTitle: { fontWeight: "800", fontSize: font.md, color: colors.text },
  guestSub: { fontSize: font.sm, color: colors.textMuted, marginTop: 2, marginBottom: spacing.lg },
  loginBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: spacing.sm,
    backgroundColor: colors.primary,
    paddingVertical: spacing.md, borderRadius: radius.md,
  },
  loginText: { color: "#fff", fontWeight: "800", fontSize: font.base },

  section: { fontWeight: "800", fontSize: font.sm, color: colors.text, marginBottom: spacing.sm },
  item: {
    flexDirection: "row", alignItems: "center", gap: spacing.md,
    paddingVertical: spacing.md,
    borderTopWidth: 1, borderTopColor: colors.border,
  },
  itemText: { flex: 1, fontSize: font.sm, color: colors.text },

  company: { textAlign: "center", fontSize: font.xs, fontWeight: "700", color: colors.textMuted, marginTop: spacing.md },
  legal: { textAlign: "center", fontSize: 10, color: colors.textFaint, lineHeight: 14 },
});
