import { View, Text, Pressable, StyleSheet } from "react-native";
import { colors, spacing, radius, font } from "../theme";

export default function EmptyState({ title, subtitle, actionLabel, onAction }) {
  return (
    <View style={s.wrap}>
      <Text style={s.title}>{title}</Text>
      {subtitle ? <Text style={s.sub}>{subtitle}</Text> : null}
      {actionLabel ? (
        <Pressable style={s.btn} onPress={onAction}>
          <Text style={s.btnText}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const s = StyleSheet.create({
  wrap: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1, borderColor: colors.border,
    padding: 48, alignItems: "center",
  },
  title: { fontWeight: "700", color: colors.text, marginBottom: spacing.xs, textAlign: "center" },
  sub: { fontSize: font.sm, color: colors.textMuted, textAlign: "center", marginBottom: spacing.lg },
  btn: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl, paddingVertical: 10,
    borderRadius: radius.md,
  },
  btnText: { color: colors.onDark, fontWeight: "700", fontSize: font.sm },
});
