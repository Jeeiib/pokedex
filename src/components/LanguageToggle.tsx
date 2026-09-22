import { useTranslation } from "react-i18next";
import { AccessibilityInfo, Pressable, StyleSheet, Text } from "react-native";

import type { AppLanguage } from "@/constants/a11y";
import { touchArea, typography } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeProvider";
import { setAppLanguage, useA11yLanguage } from "@/i18n";

export default function LanguageToggle() {
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const a11yLanguage = useA11yLanguage();
  const current: AppLanguage = i18n.language.startsWith("en") ? "en" : "fr";

  async function toggle() {
    const next: AppLanguage = current === "fr" ? "en" : "fr";
    await setAppLanguage(next);
    AccessibilityInfo.announceForAccessibility(t("language.announce"));
  }

  return (
    <Pressable
      style={touchArea}
      onPress={toggle}
      accessibilityRole="button"
      accessibilityLabel={t("language.action")}
      accessibilityValue={{ text: current.toUpperCase() }}
      accessibilityLanguage={a11yLanguage}
    >
      <Text style={[styles.label, { color: theme.onPrimary }]}>{current.toUpperCase()}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  label: {
    ...typography.cardName,
  },
});
