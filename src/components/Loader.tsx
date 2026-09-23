// Indicateur de chargement plein écran, centré et accessible.

import { useTranslation } from "react-i18next";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import { spacing } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeProvider";
import { useA11yLanguage } from "@/i18n";

// Affiche une roue de chargement dont le libellé accessible suit la langue
// courante.
export default function Loader() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const a11yLanguage = useA11yLanguage();

  return (
    <View style={styles.container}>
      <ActivityIndicator
        size="large"
        color={theme.primary}
        accessibilityLabel={t("state.loading")}
        accessibilityLanguage={a11yLanguage}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.lg,
  },
});
