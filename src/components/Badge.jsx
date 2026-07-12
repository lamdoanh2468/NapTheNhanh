import { View, Text, StyleSheet } from "react-native";
import { radius, font, spacing } from "../theme";

export default function Badge({ label, bg, fg }) {
  return (
    <View style={[s.wrap, { backgroundColor: bg }]}>
      <Text style={[s.text, { color: fg }]}>{label}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
    alignSelf: "flex-start",
  },
  text: { fontSize: font.xs, fontWeight: "700" },
});
