// Thay thế toàn bộ class Tailwind của bản web.
// RN không có CSS — mọi giá trị màu/khoảng cách phải là token JS.

export const colors = {
  primary: "#c026d3",       // fuchsia-600
  primaryDark: "#a21caf",   // fuchsia-700
  gradientFrom: "#a21caf",  // fuchsia-700
  gradientTo: "#6b21a8",    // purple-800
  primarySoft: "#fdf4ff",   // fuchsia-50
  primaryBadgeBg: "#fae8ff",
  primaryBadgeText: "#a21caf",

  bg: "#f1f5f9",            // slate-100
  surface: "#ffffff",
  border: "#e2e8f0",        // slate-200
  borderStrong: "#cbd5e1",  // slate-300

  text: "#1e293b",          // slate-800
  textMuted: "#64748b",     // slate-500
  textFaint: "#94a3b8",     // slate-400
  onDark: "#ffffff",

  dark: "#0f172a",          // slate-900
  darkSurface: "#1e293b",   // slate-800

  success: "#059669",
  successBg: "#d1fae5",
  successText: "#047857",
  danger: "#dc2626",
  dangerBg: "#fee2e2",
  dangerText: "#b91c1c",
  warnBg: "#fef3c7",
  warnText: "#b45309",
  infoBg: "#dbeafe",
  infoText: "#1d4ed8",

  overlay: "rgba(0,0,0,0.5)",
  skeleton: "#f1f5f9",
};

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24 };

export const radius = { sm: 6, md: 8, lg: 12, xl: 16, pill: 999 };

export const font = {
  xs: 11,
  sm: 13,
  base: 14,
  md: 16,
  lg: 18,
  xl: 22,
  xxl: 28,
};

// RN dùng shadow (iOS) + elevation (Android) — không có box-shadow
export const shadow = {
  card: {
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  header: {
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 6,
  },
};
