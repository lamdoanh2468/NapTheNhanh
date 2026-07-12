import { useEffect, useRef } from "react";
import { Animated, Text, StyleSheet, Pressable } from "react-native";
import { Check, AlertCircle, X } from "lucide-react-native";
import { colors, spacing, radius, font, shadow } from "../theme";

/** Web dùng position:fixed. RN không có → dùng position:absolute + Animated. */
export default function Toast({ toast, onClose }) {
  const y = useRef(new Animated.Value(100)).current;

  useEffect(() => {
    if (!toast) return;
    Animated.spring(y, { toValue: 0, useNativeDriver: true }).start();
    const t = setTimeout(() => {
      Animated.timing(y, { toValue: 100, duration: 200, useNativeDriver: true }).start(onClose);
    }, 3500);
    return () => clearTimeout(t);
  }, [toast, onClose, y]);

  if (!toast) return null;
  const ok = toast.type === "success";

  return (
    <Animated.View
      style={[
        s.wrap,
        { backgroundColor: ok ? colors.success : colors.danger, transform: [{ translateY: y }] },
      ]}
    >
      {ok ? <Check size={16} color="#fff" /> : <AlertCircle size={16} color="#fff" />}
      <Text style={s.text}>{toast.message}</Text>
      <Pressable onPress={onClose} hitSlop={10}>
        <X size={15} color="#fff" />
      </Pressable>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  wrap: {
    position: "absolute",
    left: spacing.lg, right: spacing.lg, bottom: spacing.xl,
    flexDirection: "row", alignItems: "center", gap: spacing.md,
    paddingHorizontal: spacing.lg, paddingVertical: spacing.md,
    borderRadius: radius.lg,
    ...shadow.header,
  },
  text: { flex: 1, color: "#fff", fontSize: font.sm, fontWeight: "600" },
});
