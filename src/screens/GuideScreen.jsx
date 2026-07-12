import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { GUIDES, CARD_TYPES } from "../data/catalog";
import EmptyState from "../components/EmptyState";
import { colors, spacing, radius, font, shadow } from "../theme";

export default function GuideScreen() {
  const { cardId } = useRoute().params;
  const navigation = useNavigation();
  const g = GUIDES[cardId];

  if (!g)
    return (
      <View style={s.root}>
        <EmptyState title="Hướng dẫn không tồn tại" />
      </View>
    );

  return (
    <ScrollView style={s.root} contentContainerStyle={{ padding: spacing.lg, gap: spacing.md }}>
      <View style={s.card}>
        <Text style={s.title}>{g.title}</Text>
        <Text style={s.intro}>{g.intro}</Text>

        {g.steps.map((st, i) => (
          <View key={i} style={s.step}>
            <View style={s.num}>
              <Text style={s.numText}>{i + 1}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.stepTitle}>{st.title}</Text>
              <Text style={s.stepBody}>{st.body}</Text>
            </View>
          </View>
        ))}

        <Pressable style={s.cta} onPress={() => navigation.navigate("Tabs", { screen: "Home" })}>
          <Text style={s.ctaText}>Mua thẻ ngay</Text>
        </Pressable>
      </View>

      <View style={s.card}>
        <Text style={s.section}>Hướng dẫn loại thẻ khác</Text>
        <View style={s.chips}>
          {CARD_TYPES.filter((c) => c.id !== cardId).map((c) => (
            <Pressable
              key={c.id}
              style={s.chip}
              onPress={() => navigation.push("Guide", { cardId: c.id })}
            >
              <Text style={s.chipText}>Thẻ {c.name}</Text>
            </Pressable>
          ))}
        </View>
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
  title: { fontWeight: "800", fontSize: font.xl, color: colors.text, marginBottom: spacing.xs },
  intro: { fontSize: font.sm, color: colors.textMuted, lineHeight: 20, marginBottom: spacing.xl },
  step: { flexDirection: "row", gap: spacing.md, marginBottom: spacing.xl },
  num: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: "center", justifyContent: "center",
  },
  numText: { color: "#fff", fontWeight: "800", fontSize: font.sm },
  stepTitle: { fontWeight: "700", fontSize: font.sm, color: colors.text, marginBottom: 4 },
  stepBody: { fontSize: font.sm, color: colors.textMuted, lineHeight: 20 },
  cta: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md, borderRadius: radius.md,
    alignItems: "center",
  },
  ctaText: { color: "#fff", fontWeight: "800", fontSize: font.base },

  section: { fontWeight: "800", fontSize: font.sm, color: colors.text, marginBottom: spacing.md },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  chip: {
    borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md, paddingVertical: 6,
  },
  chipText: { fontSize: font.xs, fontWeight: "700", color: colors.text },
});
