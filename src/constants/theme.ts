// Palette claire : valeurs du Figma.
export const lightTheme = {
  background: "#EFEFEF",
  surface: "#FFFFFF",
  textPrimary: "#1D1D1D",
  textSecondary: "#666666",
  border: "#E0E0E0",
  primary: "#DC0A2D",
  onPrimary: "#FFFFFF",
  // Le rouge d'identité ne donne que 3,24 en texte sur fond sombre, d'où un
  // jeton distinct du rouge de fond.
  primaryText: "#DC0A2D",
  // Voile des feuilles modales : assombrit le fond sans le masquer.
  scrim: "rgba(0, 0, 0, 0.4)",
};

export type Theme = typeof lightTheme;

// Palette sombre : le rouge d'identité reste le rouge du Figma sur les fonds,
// seul le rouge de texte est éclairci. Contrastes mesurés sur surface :
// textPrimary 15,29 / textSecondary 7,01 / primaryText 5,18.
export const darkTheme: Theme = {
  background: "#121212",
  surface: "#1E1E1E",
  textPrimary: "#F5F5F5",
  textSecondary: "#A8A8A8",
  border: "#4A4A4A",
  primary: "#DC0A2D",
  onPrimary: "#FFFFFF",
  // Le rouge du Figma ne donne que 3,27 sur la surface sombre, d'où ce rouge
  // clairci réservé au texte.
  primaryText: "#FF4D6A",
  // Voile des feuilles modales : assombrit le fond sans le masquer.
  scrim: "rgba(0, 0, 0, 0.4)",
};

export const fonts = {
  regular: "Poppins_400Regular",
  bold: "Poppins_700Bold",
};

// Relevé complet des styles de texte du Figma : `body2` n'a pas de lecteur
// actuellement, la table reste néanmoins le miroir exact de la maquette.
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
