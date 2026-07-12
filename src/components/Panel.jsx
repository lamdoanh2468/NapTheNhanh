import { View, Text, StyleSheet } from "react-native";
import { colors, spacing, radius, font, shadow } from "../theme";

export default function Panel({ step, title, error, children }) {
  return (
    <View style={s.card}>
      <View style={s.head}>
        {step ? (
          <View style={s.step}>
            <Text style={s.stepText}>{step}</Text>
          </View>
        ) : null}
        <Text style={s.title}>{title}</Text>
        {error ? <Text style={s.err}>{error}</Text> : null}
      </View>
      {children}
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadow.card,
  },
  head: { flexDirection: "row", alignItems: "center", marginBottom: spacing.lg },
  step: {
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: "center", justifyContent: "center",
    marginRight: spacing.sm,
  },
  stepText: { color: colors.onDark, fontSize: font.xs, fontWeight: "700" },
  title: { fontWeight: "700", fontSize: font.md, color: colors.text },
  err: { color: colors.danger, fontSize: font.xs, marginLeft: spacing.sm, flex: 1 },
});
