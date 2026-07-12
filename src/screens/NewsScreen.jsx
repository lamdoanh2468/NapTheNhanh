import { View, Text, FlatList, Pressable, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NEWS } from "../data/catalog";
import { colors, spacing, radius, font, shadow } from "../theme";

export default function NewsScreen() {
  const navigation = useNavigation();

  return (
    <FlatList
      style={s.root}
      data={NEWS}
      keyExtractor={(n) => n.slug}
      contentContainerStyle={{ padding: spacing.lg, gap: spacing.md }}
      renderItem={({ item: n }) => (
        <Pressable
          style={s.card}
          onPress={() => navigation.navigate("NewsDetail", { slug: n.slug })}
        >
          <View style={s.head}>
            <View style={s.tag}><Text style={s.tagText}>{n.tag}</Text></View>
            <Text style={s.date}>{n.date}</Text>
          </View>
          <Text style={s.title}>{n.title}</Text>
          <Text style={s.excerpt} numberOfLines={2}>{n.excerpt}</Text>
        </Pressable>
      )}
    />
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
  head: { flexDirection: "row", alignItems: "center", gap: spacing.sm, marginBottom: spacing.sm },
  tag: {
    backgroundColor: colors.primaryBadgeBg,
    paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: radius.sm,
  },
  tagText: { fontSize: 10, fontWeight: "700", color: colors.primaryBadgeText },
  date: { fontSize: font.xs, color: colors.textFaint },
  title: { fontWeight: "700", fontSize: font.md, color: colors.text, marginBottom: 4 },
  excerpt: { fontSize: font.sm, color: colors.textMuted, lineHeight: 19 },
});
