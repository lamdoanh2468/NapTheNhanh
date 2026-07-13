import { View, Text, Pressable, Image, StyleSheet } from "react-native";
import { Check } from "lucide-react-native";
import { CARD_TYPES } from "../data/catalog";
import { colors, spacing, radius, font } from "../theme";

export default function CardSelector({ value, onChange }) {
  return (
    <View style={s.grid}>
      {CARD_TYPES.map((c) => {
        const active = value === c.id;
        return (
          <Pressable
            key={c.id}
            onPress={() => onChange(c.id)}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            style={[s.item, active && s.itemActive]}
          >
            {c.icon ? (
              <Image source={c.icon} style={s.logo} resizeMode="contain" />
            ) : (
              <View style={[s.logo, s.logoFallback, { backgroundColor: c.color }]}>
                <Text style={s.logoText}>{c.name[0]}</Text>
              </View>
            )}
            <Text style={s.name}>{c.name}</Text>
            <Text style={s.disc}>Chiết khấu {(c.discount * 100).toFixed(1)}%</Text>
            {active ? <Check size={16} color={colors.primary} style={s.check} /> : null}
          </Pressable>
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  grid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.md },
  item: {
    width: "47%",
    borderWidth: 2, borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  itemActive: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  logo: {
    width: "100%", height: 64, borderRadius: radius.md,
    marginBottom: spacing.sm,
  },
  logoFallback: { alignItems: "center", justifyContent: "center" },
  logoText: { color: "#fff", fontWeight: "800", fontSize: font.md },
  name: { fontWeight: "700", fontSize: font.sm, color: colors.text },
  disc: { fontSize: font.xs, color: colors.success, fontWeight: "600", marginTop: 2 },
  check: { position: "absolute", top: spacing.sm, right: spacing.sm },
});
