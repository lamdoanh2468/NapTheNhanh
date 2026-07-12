import { View, Text, Pressable, StyleSheet } from "react-native";
import { PAYMENTS } from "../data/catalog";
import { colors, spacing, radius, font } from "../theme";

export default function PaymentPicker({ value, onChange }) {
  return (
    <View style={{ gap: spacing.sm }}>
      {PAYMENTS.map((p) => {
        const active = value === p.id;
        return (
          <Pressable
            key={p.id}
            onPress={() => onChange(p.id)}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            style={[s.item, active && s.itemActive]}
          >
            <View style={[s.dot, { backgroundColor: p.color }]} />
            <View>
              <Text style={s.name}>{p.name}</Text>
              <Text style={s.note}>{p.note}</Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  item: {
    flexDirection: "row", alignItems: "center", gap: spacing.md,
    padding: spacing.md,
    borderWidth: 2, borderColor: colors.border,
    borderRadius: radius.md,
  },
  itemActive: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  dot: { width: 32, height: 32, borderRadius: radius.sm },
  name: { fontWeight: "700", fontSize: font.sm, color: colors.text },
  note: { fontSize: font.xs, color: colors.textMuted },
});
