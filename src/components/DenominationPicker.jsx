import { View, Text, Pressable, StyleSheet } from "react-native";
import { DENOMINATIONS } from "../data/catalog";
import { vnd } from "../utils/format";
import { colors, spacing, radius, font } from "../theme";

export default function DenominationPicker({ value, onChange }) {
  return (
    <View style={s.grid}>
      {DENOMINATIONS.map((d) => {
        const active = value === d;
        return (
          <Pressable
            key={d}
            onPress={() => onChange(d)}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            style={[s.item, active && s.itemActive]}
          >
            <Text style={[s.text, active && s.textActive]}>{vnd(d)}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  grid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  item: {
    width: "31%",
    paddingVertical: spacing.md,
    borderWidth: 2, borderColor: colors.border,
    borderRadius: radius.md,
    alignItems: "center",
  },
  itemActive: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  text: { fontWeight: "700", fontSize: font.sm, color: colors.text },
  textActive: { color: colors.primaryDark },
});
