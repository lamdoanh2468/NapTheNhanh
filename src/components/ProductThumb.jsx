import { View } from "react-native";
import Svg, { Rect, Circle, Path, Line, G } from "react-native-svg";
import { radius } from "../theme";

/**
 * Ảnh minh hoạ sản phẩm bằng SVG — không cần tải ảnh ngoài, hiển thị được offline.
 * Site napthengay.vn không có ảnh thật cho phụ kiện/hàng công nghệ, nên mỗi sản phẩm
 * được vẽ theo `kind` (loại) với một hình minh hoạ đường nét gọn gàng.
 */

// Mỗi loại một tông màu nền + màu nét để danh mục nhìn có nhịp điệu.
const PALETTE = {
  usb: { bg: "#eef2ff", fg: "#4f46e5" },
  webcam: { bg: "#ecfeff", fg: "#0891b2" },
  powerbank: { bg: "#fef3c7", fg: "#d97706" },
  laptop: { bg: "#f0f9ff", fg: "#0369a1" },
  chair: { bg: "#fdf2f8", fg: "#be185d" },
  vga: { bg: "#ecfdf5", fg: "#059669" },
  mainboard: { bg: "#f0fdf4", fg: "#15803d" },
  phone: { bg: "#eff6ff", fg: "#2563eb" },
  monitor: { bg: "#f5f3ff", fg: "#7c3aed" },
  ssd: { bg: "#f8fafc", fg: "#475569" },
  flower: { bg: "#fdf4ff", fg: "#c026d3" },
  default: { bg: "#f1f5f9", fg: "#64748b" },
};

// Vẽ phần thân theo loại. Toạ độ trong khung viewBox 100×100. `c` là màu nét.
function Shape({ kind, c }) {
  const stroke = { stroke: c, strokeWidth: 3, fill: "none", strokeLinejoin: "round", strokeLinecap: "round" };
  switch (kind) {
    case "usb":
      return (
        <G>
          <Rect x="34" y="24" width="32" height="44" rx="5" {...stroke} />
          <Rect x="42" y="12" width="16" height="14" rx="2" {...stroke} />
          <Line x1="46" y1="16" x2="46" y2="22" {...stroke} />
          <Line x1="54" y1="16" x2="54" y2="22" {...stroke} />
          <Line x1="50" y1="68" x2="50" y2="86" {...stroke} />
          <Circle cx="50" cy="46" r="6" {...stroke} />
        </G>
      );
    case "webcam":
      return (
        <G>
          <Circle cx="50" cy="42" r="24" {...stroke} />
          <Circle cx="50" cy="42" r="11" {...stroke} />
          <Circle cx="50" cy="42" r="3" fill={c} stroke="none" />
          <Path d="M34 64 L34 76 L66 76 L66 64" {...stroke} />
        </G>
      );
    case "powerbank":
      return (
        <G>
          <Rect x="30" y="16" width="40" height="68" rx="7" {...stroke} />
          <Rect x="40" y="28" width="20" height="10" rx="2" {...stroke} />
          <Path d="M52 48 L44 62 L50 62 L48 74 L58 58 L52 58 Z" fill={c} stroke="none" />
        </G>
      );
    case "laptop":
      return (
        <G>
          <Rect x="26" y="26" width="48" height="32" rx="3" {...stroke} />
          <Path d="M18 68 L82 68 L76 58 L24 58 Z" {...stroke} />
        </G>
      );
    case "chair":
      return (
        <G>
          <Path d="M36 22 q-6 0 -6 8 L30 52 q0 6 6 6 L64 58 q6 0 6 -6 L70 30 q0 -8 -6 -8 Z" {...stroke} />
          <Line x1="50" y1="58" x2="50" y2="72" {...stroke} />
          <Path d="M36 72 L64 72" {...stroke} />
          <Line x1="42" y1="72" x2="38" y2="84" {...stroke} />
          <Line x1="58" y1="72" x2="62" y2="84" {...stroke} />
        </G>
      );
    case "vga":
      return (
        <G>
          <Rect x="20" y="34" width="60" height="34" rx="3" {...stroke} />
          <Circle cx="38" cy="51" r="9" {...stroke} />
          <Circle cx="62" cy="51" r="9" {...stroke} />
          <Line x1="30" y1="68" x2="30" y2="78" {...stroke} />
          <Line x1="70" y1="68" x2="70" y2="78" {...stroke} />
        </G>
      );
    case "mainboard":
      return (
        <G>
          <Rect x="22" y="22" width="56" height="56" rx="4" {...stroke} />
          <Rect x="30" y="30" width="18" height="18" rx="2" {...stroke} />
          <Line x1="58" y1="30" x2="70" y2="30" {...stroke} />
          <Line x1="58" y1="38" x2="70" y2="38" {...stroke} />
          <Line x1="58" y1="46" x2="70" y2="46" {...stroke} />
          <Line x1="30" y1="60" x2="70" y2="60" {...stroke} />
          <Line x1="30" y1="68" x2="62" y2="68" {...stroke} />
        </G>
      );
    case "phone":
      return (
        <G>
          <Rect x="34" y="14" width="32" height="72" rx="7" {...stroke} />
          <Line x1="45" y1="20" x2="55" y2="20" {...stroke} />
          <Circle cx="50" cy="78" r="2.5" fill={c} stroke="none" />
        </G>
      );
    case "monitor":
      return (
        <G>
          <Rect x="20" y="24" width="60" height="40" rx="3" {...stroke} />
          <Line x1="50" y1="64" x2="50" y2="74" {...stroke} />
          <Line x1="38" y1="76" x2="62" y2="76" {...stroke} />
        </G>
      );
    case "ssd":
      return (
        <G>
          <Rect x="26" y="30" width="48" height="40" rx="4" {...stroke} />
          <Line x1="34" y1="42" x2="58" y2="42" {...stroke} />
          <Line x1="34" y1="50" x2="50" y2="50" {...stroke} />
          <Circle cx="64" cy="52" r="4" {...stroke} />
        </G>
      );
    case "flower":
      return (
        <G>
          {[0, 72, 144, 216, 288].map((a) => {
            const r = (a * Math.PI) / 180;
            return (
              <Circle key={a} cx={50 + 14 * Math.sin(r)} cy={38 - 14 * Math.cos(r)} r="9" {...stroke} />
            );
          })}
          <Circle cx="50" cy="38" r="6" fill={c} stroke="none" />
          <Path d="M50 47 L50 82" {...stroke} />
          <Path d="M50 64 q10 -4 14 -12" {...stroke} />
          <Path d="M50 70 q-10 -4 -14 -12" {...stroke} />
        </G>
      );
    default:
      return (
        <G>
          <Path d="M50 20 L78 34 L78 66 L50 80 L22 66 L22 34 Z" {...stroke} />
          <Path d="M22 34 L50 48 L78 34 M50 48 L50 80" {...stroke} />
        </G>
      );
  }
}

export default function ProductThumb({ kind, style }) {
  const { bg, fg } = PALETTE[kind] || PALETTE.default;
  return (
    <View style={[{ backgroundColor: bg, borderRadius: radius.md, overflow: "hidden" }, style]}>
      <Svg width="100%" height="100%" viewBox="0 0 100 100">
        <Shape kind={kind} c={fg} />
      </Svg>
    </View>
  );
}
