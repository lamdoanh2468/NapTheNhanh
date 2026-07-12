import { useState, useCallback } from "react";
import {
  View, Text, FlatList, Pressable, StyleSheet, ActivityIndicator, RefreshControl,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import * as Clipboard from "expo-clipboard";
import { Eye, EyeOff, Copy, Check } from "lucide-react-native";

import Badge from "../components/Badge";
import EmptyState from "../components/EmptyState";
import { vnd, formatDateTime, ORDER_STATUS } from "../utils/format";
import * as api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { colors, spacing, radius, font, shadow } from "../theme";

const FILTERS = [["ALL", "Tất cả"], ...Object.entries(ORDER_STATUS).map(([k, v]) => [k, v.label])];

function CodeRow({ code }) {
  const [shown, setShown] = useState(false);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await Clipboard.setStringAsync(code.pin); // web: navigator.clipboard → RN: expo-clipboard
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <View style={s.codeRow}>
      <Text style={s.serial}>{code.serial}</Text>
      <Text style={s.pin}>{shown ? code.pin : "••••••-••••••"}</Text>
      <Pressable onPress={() => setShown((v) => !v)} hitSlop={8}>
        {shown ? <EyeOff size={15} color={colors.textMuted} /> : <Eye size={15} color={colors.textMuted} />}
      </Pressable>
      <Pressable onPress={copy} hitSlop={8}>
        {copied ? <Check size={15} color={colors.success} /> : <Copy size={15} color={colors.textMuted} />}
      </Pressable>
    </View>
  );
}

export default function HistoryScreen() {
  const { user } = useAuth();
  const navigation = useNavigation();
  const [orders, setOrders] = useState(null);
  const [filter, setFilter] = useState("ALL");
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    if (!user) return setOrders([]);
    const list = await api.listOrders(user.id);
    setOrders(list);
  }, [user]);

  // Web dùng useEffect. RN dùng useFocusEffect: tab được giữ trong bộ nhớ,
  // useEffect chỉ chạy 1 lần → quay lại tab sẽ thấy dữ liệu cũ.
  useFocusEffect(useCallback(() => { load(); }, [load]));

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  if (!user)
    return (
      <View style={s.root}>
        <EmptyState
          title="Đăng nhập để xem lịch sử"
          subtitle="Mã thẻ đã mua được lưu trong tài khoản của bạn."
          actionLabel="Đăng nhập"
          onAction={() => navigation.navigate("Auth", { mode: "login" })}
        />
      </View>
    );

  if (orders === null)
    return (
      <View style={[s.root, s.center]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );

  const shown = filter === "ALL" ? orders : orders.filter((o) => o.status === filter);

  return (
    <View style={s.root}>
      {/* Web dùng <select>. RN không có → chip filter cuộn ngang. */}
      <FlatList
        horizontal
        data={FILTERS}
        keyExtractor={([k]) => k}
        showsHorizontalScrollIndicator={false}
        style={s.chipBar}
        contentContainerStyle={{ padding: spacing.md, gap: spacing.sm }}
        renderItem={({ item: [key, label] }) => {
          const active = filter === key;
          return (
            <Pressable
              onPress={() => setFilter(key)}
              style={[s.chip, active && s.chipActive]}
            >
              <Text style={[s.chipText, active && s.chipTextActive]}>{label}</Text>
            </Pressable>
          );
        }}
      />

      <FlatList
        data={shown}
        keyExtractor={(o) => o.id}
        contentContainerStyle={{ padding: spacing.lg, gap: spacing.md, flexGrow: 1 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <EmptyState
            title={orders.length === 0 ? "Chưa có giao dịch nào" : "Không có đơn ở trạng thái này"}
            actionLabel={orders.length === 0 ? "Mua thẻ ngay" : undefined}
            onAction={() => navigation.navigate("Home")}
          />
        }
        renderItem={({ item: o }) => {
          const st = ORDER_STATUS[o.status];
          return (
            <View style={s.order}>
              <View style={s.orderHead}>
                <Text style={s.orderId}>#{o.id}</Text>
                <Badge label={st.label} bg={st.bg} fg={st.fg} />
                <Text style={s.time}>{formatDateTime(o.createdAt)}</Text>
              </View>

              <Text style={s.meta}>
                {o.cardName} · {vnd(o.denom)} × {o.qty} · {o.payment} ·{" "}
                <Text style={s.total}>{vnd(o.total)}</Text>
              </Text>

              {o.codes.length > 0 ? (
                <View style={s.codeBox}>
                  {o.codes.map((c, i) => <CodeRow key={i} code={c} />)}
                  <Text style={s.warn}>
                    Không chia sẻ mã thẻ cho người khác. Mã chỉ sử dụng được một lần.
                  </Text>
                </View>
              ) : null}
            </View>
          );
        }}
      />
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  center: { justifyContent: "center" },

  chipBar: { flexGrow: 0, backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border },
  chip: {
    paddingHorizontal: spacing.md, paddingVertical: 6,
    borderRadius: radius.pill,
    borderWidth: 1, borderColor: colors.border,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontSize: font.xs, fontWeight: "600", color: colors.textMuted },
  chipTextActive: { color: "#fff" },

  order: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1, borderColor: colors.border,
    padding: spacing.lg,
    ...shadow.card,
  },
  orderHead: { flexDirection: "row", alignItems: "center", gap: spacing.sm, marginBottom: spacing.sm },
  orderId: { fontWeight: "800", fontSize: font.base, color: colors.text },
  time: { marginLeft: "auto", fontSize: font.xs, color: colors.textFaint },
  meta: { fontSize: font.sm, color: colors.textMuted, marginBottom: spacing.md },
  total: { fontWeight: "800", color: colors.primaryDark },

  codeBox: { backgroundColor: colors.bg, borderRadius: radius.md, padding: spacing.md },
  codeRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm, paddingVertical: 4 },
  serial: { width: 90, fontSize: font.xs, color: colors.textFaint, fontFamily: "monospace" },
  pin: { flex: 1, fontSize: font.sm, color: colors.text, fontFamily: "monospace" },
  warn: { fontSize: font.xs, color: colors.textFaint, marginTop: spacing.sm },
});
