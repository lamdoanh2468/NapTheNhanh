import { useState } from "react";
import { View, Text, FlatList, Pressable, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { CATEGORIES, PRODUCTS } from "../data/catalog";
import { vnd } from "../utils/format";
import EmptyState from "../components/EmptyState";
import ProductThumb from "../components/ProductThumb";
import { colors, spacing, radius, font, shadow } from "../theme";

export default function CategoryScreen() {
  const navigation = useNavigation();
  const [active, setActive] = useState("accessory");

  const cat = CATEGORIES.find((c) => c.id === active);
  const items = PRODUCTS[active] || [];

  return (
    <View style={s.root}>
      <FlatList
        horizontal
        data={CATEGORIES}
        keyExtractor={(c) => c.id}
        showsHorizontalScrollIndicator={false}
        style={s.tabBar}
        contentContainerStyle={{ padding: spacing.md, gap: spacing.sm }}
        renderItem={({ item: c }) => {
          const Icon = c.icon;
          const on = active === c.id;
          return (
            <Pressable
              onPress={() =>
                c.id === "game" ? navigation.navigate("Home") : setActive(c.id)
              }
              style={[s.chip, on && s.chipActive]}
            >
              <Icon size={15} color={on ? "#fff" : colors.textMuted} />
              <Text style={[s.chipText, on && s.chipTextActive]}>{c.label}</Text>
            </Pressable>
          );
        }}
      />

      <FlatList
        data={items}
        keyExtractor={(p) => p.id}
        numColumns={2}
        columnWrapperStyle={{ gap: spacing.md }}
        contentContainerStyle={{ padding: spacing.lg, gap: spacing.md, flexGrow: 1 }}
        ListEmptyComponent={
          <EmptyState
            title={`Danh mục "${cat?.label}" đang được cập nhật`}
            actionLabel="Quay lại Nạp thẻ"
            onAction={() => navigation.navigate("Home")}
          />
        }
        renderItem={({ item: p }) => (
          <Pressable
            style={s.product}
            onPress={() => navigation.navigate("Checkout", { product: p })}
          >
            <ProductThumb kind={p.kind} style={s.thumb} />
            <View style={s.info}>
              <Text style={s.pname} numberOfLines={2}>{p.name}</Text>
              <Text style={s.price}>{vnd(p.price)}</Text>
              <Pressable
                style={s.btn}
                onPress={() => navigation.navigate("Checkout", { product: p })}
              >
                <Text style={s.btnText}>Đặt mua</Text>
              </Pressable>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  tabBar: { flexGrow: 0, backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border },
  chip: {
    flexDirection: "row", alignItems: "center", gap: 6,
    paddingHorizontal: spacing.md, paddingVertical: 8,
    borderRadius: radius.pill,
    borderWidth: 1, borderColor: colors.border,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontSize: font.xs, fontWeight: "700", color: colors.textMuted },
  chipTextActive: { color: "#fff" },

  product: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1, borderColor: colors.border,
    overflow: "hidden",
    ...shadow.card,
  },
  thumb: { aspectRatio: 1, borderRadius: 0 },
  info: { padding: spacing.md, gap: 6 },
  pname: { fontSize: font.sm, fontWeight: "600", color: colors.text, minHeight: 34 },
  price: { fontWeight: "800", color: colors.primaryDark, fontSize: font.base },
  btn: {
    backgroundColor: colors.primary,
    paddingVertical: 8, borderRadius: radius.md, alignItems: "center",
  },
  btnText: { color: "#fff", fontWeight: "700", fontSize: font.xs },
});
