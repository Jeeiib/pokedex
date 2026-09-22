import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";

import { spacing, typography } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeProvider";
import { useA11yLanguage } from "@/i18n";

import Pokeball from "./Pokeball";

// Mesures du fichier Figma : contenu à 16 du bord, titre de 32 de haut,
// pokéball de 24 à 16 du texte.
const BALL_SIZE = 24;

type PokedexHeaderProps = {
  children?: ReactNode;
};

export default function PokedexHeader({ children }: PokedexHeaderProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const a11yLanguage = useA11yLanguage();

  return (
    <View style={styles.header}>
      <View style={styles.titleRow}>
        <Pokeball size={BALL_SIZE} color={theme.onPrimary} />
        <Text
          style={[styles.title, { color: theme.onPrimary }]}
          accessibilityRole="header"
          accessibilityLanguage={a11yLanguage}
        >
          {t("app.title")}
        </Text>
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
    ...typography.headline,
  },
});
