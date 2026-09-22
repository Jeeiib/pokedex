// Palette claire : valeurs du Figma. La palette sombre arrive à la tâche 16,
// elle est dérivée puis vérifiée au contraste.
export const lightTheme = {
  background: "#EFEFEF",
  surface: "#FFFFFF",
  textPrimary: "#212121",
  textSecondary: "#666666",
  border: "#E0E0E0",
  primary: "#DC0A2D",
  onPrimary: "#FFFFFF",
  // Le rouge d'identité ne donne que 3,24 en texte sur fond sombre, d'où un
  // jeton distinct du rouge de fond.
  primaryText: "#DC0A2D",
};

export type Theme = typeof lightTheme;

export const fonts = {
  regular: "Roboto_400Regular",
  bold: "Roboto_700Bold",
};

export const typography = {
  headline: { fontFamily: fonts.bold, fontSize: 24, lineHeight: 32 },
  subtitle1: { fontFamily: fonts.bold, fontSize: 14, lineHeight: 16 },
  subtitle2: { fontFamily: fonts.bold, fontSize: 12, lineHeight: 16 },
  subtitle3: { fontFamily: fonts.bold, fontSize: 10, lineHeight: 16 },
  body1: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 16 },
  body2: { fontFamily: fonts.regular, fontSize: 12, lineHeight: 16 },
  body3: { fontFamily: fonts.regular, fontSize: 10, lineHeight: 16 },
  caption: { fontFamily: fonts.regular, fontSize: 8, lineHeight: 12 },
} as const;

export const elevation = {
  low: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  high: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.24,
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
