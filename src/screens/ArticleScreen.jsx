import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useRoute } from "@react-navigation/native";
import { ARTICLES } from "../data/catalog";
import EmptyState from "../components/EmptyState";
import { colors, spacing, radius, font, shadow } from "../theme";

export default function ArticleScreen() {
  const { slug } = useRoute().params;
  const a = ARTICLES[slug];

  if (!a)
    return (
      <View style={s.root}>
        <EmptyState title="Nội dung không tồn tại" />
      </View>
    );

  return (
    <ScrollView style={s.root} contentContainerStyle={{ padding: spacing.lg }}>
      <View style={s.card}>
        <Text style={s.title}>{a.title}</Text>
        {a.body.map((p, i) => (
          <Text key={i} style={s.p}>{p}</Text>
        ))}
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
  title: { fontWeight: "800", fontSize: font.xl, color: colors.text, marginBottom: spacing.lg },
  p: { fontSize: font.base, color: colors.text, lineHeight: 23, marginBottom: spacing.md },
});
