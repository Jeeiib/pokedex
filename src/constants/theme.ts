// Thèmes clair et sombre, échelle typographique et dimensions du design system
// partagés par tous les écrans.

import type { TextStyle } from "react-native";

export const lightTheme = {
  background: "#EFEFEF",
  surface: "#FFFFFF",
  textPrimary: "#1D1D1D",
  textSecondary: "#666666",
  border: "#E0E0E0",
  primary: "#DC0A2D",
  onPrimary: "#FFFFFF",
  primaryText: "#DC0A2D",
  scrim: "rgba(0, 0, 0, 0.4)",
};

export type Theme = typeof lightTheme;

export const darkTheme: Theme = {
  background: "#121212",
  surface: "#1E1E1E",
  textPrimary: "#F5F5F5",
  textSecondary: "#A8A8A8",
  border: "#4A4A4A",
  primary: "#DC0A2D",
  onPrimary: "#FFFFFF",
  primaryText: "#FF4D6A",
  scrim: "rgba(0, 0, 0, 0.4)",
};

const WEIGHT = {
  regular: "400",
  semibold: "600",
  bold: "700",
} as const;

const TABULAR = { fontVariant: ["tabular-nums"] } satisfies TextStyle;

export const typography = {
  appTitle: { fontSize: 28, lineHeight: 34, fontWeight: WEIGHT.bold },
  pokemonName: { fontSize: 34, lineHeight: 41, fontWeight: WEIGHT.bold },
  sectionTitle: { fontSize: 20, lineHeight: 25, fontWeight: WEIGHT.bold },
  body: { fontSize: 17, lineHeight: 22, fontWeight: WEIGHT.regular },
  bodyStrong: { fontSize: 17, lineHeight: 22, fontWeight: WEIGHT.semibold },
  cardName: { fontSize: 15, lineHeight: 20, fontWeight: WEIGHT.semibold },
  statLabel: { fontSize: 15, lineHeight: 20, fontWeight: WEIGHT.semibold },
  statValue: { fontSize: 15, lineHeight: 20, fontWeight: WEIGHT.regular, ...TABULAR },
  measureValue: { fontSize: 17, lineHeight: 22, fontWeight: WEIGHT.regular, ...TABULAR },
  chip: { fontSize: 13, lineHeight: 18, fontWeight: WEIGHT.semibold },
  caption: { fontSize: 13, lineHeight: 18, fontWeight: WEIGHT.regular },
  cardNumber: { fontSize: 11, lineHeight: 13, fontWeight: WEIGHT.regular, ...TABULAR },
  watermark: { fontSize: 160, lineHeight: 168, fontWeight: WEIGHT.bold, ...TABULAR },
} satisfies Record<string, TextStyle>;

export const iconSize = {
  sm: 20,
  md: 22,
  lg: 24,
  xl: 32,
} as const;

export const TOUCH_TARGET = 44;

export const circleButton = {
  width: TOUCH_TARGET,
  height: TOUCH_TARGET,
  borderRadius: TOUCH_TARGET / 2,
  alignItems: "center",
  justifyContent: "center",
} as const;

export const touchArea = {
  minWidth: TOUCH_TARGET,
  minHeight: TOUCH_TARGET,
  alignItems: "center",
  justifyContent: "center",
} as const;

export const elevation = {
  low: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  high: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
  },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;
