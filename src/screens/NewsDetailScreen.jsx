import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useRoute } from "@react-navigation/native";
import { NEWS } from "../data/catalog";
import EmptyState from "../components/EmptyState";
import { colors, spacing, radius, font, shadow } from "../theme";

export default function NewsDetailScreen() {
  const { slug } = useRoute().params;
  const post = NEWS.find((n) => n.slug === slug);

  if (!post)
    return (
      <View style={s.root}>
        <EmptyState title="Bài viết không tồn tại" />
      </View>
    );

  return (
    <ScrollView style={s.root} contentContainerStyle={{ padding: spacing.lg }}>
      <View style={s.card}>
        <View style={s.head}>
          <View style={s.tag}><Text style={s.tagText}>{post.tag}</Text></View>
          <Text style={s.date}>{post.date}</Text>
        </View>
        <Text style={s.title}>{post.title}</Text>
        <Text style={s.body}>{post.excerpt}</Text>
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1, borderColor: colors.border,
    padding: spacing.xl,
    ...shadow.card,
  },
  head: { flexDirection: "row", alignItems: "center", gap: spacing.sm, marginBottom: spacing.md },
  tag: {
    backgroundColor: colors.primaryBadgeBg,
    paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: radius.sm,
  },
  tagText: { fontSize: 10, fontWeight: "700", color: colors.primaryBadgeText },
  date: { fontSize: font.xs, color: colors.textFaint },
  title: { fontWeight: "800", fontSize: font.xl, color: colors.text, marginBottom: spacing.md },
  body: { fontSize: font.base, color: colors.text, lineHeight: 23 },
});
