import { useState } from "react";
import { View, Text, ScrollView, Pressable, StyleSheet, LayoutAnimation, Platform, UIManager } from "react-native";
import { ChevronDown } from "lucide-react-native";
import { FAQS } from "../data/catalog";
import { colors, spacing, radius, font, shadow } from "../theme";

// Android cần bật thủ công mới dùng được LayoutAnimation
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function FaqScreen() {
  const [open, setOpen] = useState(0);

  const toggle = (i) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpen(open === i ? -1 : i);
  };

  return (
    <ScrollView style={s.root} contentContainerStyle={{ padding: spacing.lg }}>
      <View style={s.card}>
        {FAQS.map((f, i) => {
          const on = open === i;
          return (
            <View key={i} style={i > 0 && s.divider}>
              <Pressable onPress={() => toggle(i)} style={s.q}>
                <Text style={s.qText}>{f.q}</Text>
                <ChevronDown
                  size={16}
                  color={colors.textMuted}
                  style={{ transform: [{ rotate: on ? "180deg" : "0deg" }] }}
                />
              </Pressable>
              {on ? <Text style={s.a}>{f.a}</Text> : null}
            </View>
          );
        })}
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
    ...shadow.card,
  },
  divider: { borderTopWidth: 1, borderTopColor: colors.border },
  q: { flexDirection: "row", alignItems: "center", gap: spacing.md, padding: spacing.lg },
  qText: { flex: 1, fontWeight: "700", fontSize: font.sm, color: colors.text },
  a: {
    paddingHorizontal: spacing.lg, paddingBottom: spacing.lg,
    fontSize: font.sm, color: colors.textMuted, lineHeight: 20,
  },
});
