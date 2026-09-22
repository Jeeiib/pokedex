import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  type SharedValue,
} from "react-native-reanimated";

import { spacing, typography } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeProvider";
import { useA11yLanguage } from "@/i18n";

import Pokeball from "./Pokeball";

// Mesures du fichier Figma : contenu à 16 du bord, titre de 32 de haut,
// pokéball de 24 à 16 du texte.
const BALL_SIZE = 24;
const COMPACT_AT = 80;
const TITLE_SIZE = [typography.appTitle.fontSize, 22];
const TITLE_LINE = [typography.appTitle.lineHeight, 28];

type PokedexHeaderProps = {
  scrollY: SharedValue<number>;
  // Réglages posés à droite du titre : ils ne filtrent rien et n'ont pas leur
  // place dans la ligne des contrôles de liste.
  actions?: ReactNode;
  children?: ReactNode;
};

export default function PokedexHeader({ scrollY, actions, children }: PokedexHeaderProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const a11yLanguage = useA11yLanguage();

  // Le titre se réduit sur les 80 premiers pixels de défilement, puis se tient.
  const titleStyle = useAnimatedStyle(() => ({
    fontSize: interpolate(scrollY.value, [0, COMPACT_AT], TITLE_SIZE, Extrapolation.CLAMP),
    lineHeight: interpolate(scrollY.value, [0, COMPACT_AT], TITLE_LINE, Extrapolation.CLAMP),
  }));

  return (
    <View style={styles.header}>
      <View style={styles.titleRow}>
        <Pokeball size={BALL_SIZE} color={theme.onPrimary} />
        <Animated.Text
          style={[styles.title, titleStyle, { color: theme.onPrimary }]}
          accessibilityRole="header"
          accessibilityLanguage={a11yLanguage}
        >
          {t("app.title")}
        </Animated.Text>
        {actions ? <View style={styles.actions}>{actions}</View> : null}
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    gap: spacing.sm,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    height: 32,
  },
  title: {
    fontWeight: typography.appTitle.fontWeight,
    flex: 1,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
});
