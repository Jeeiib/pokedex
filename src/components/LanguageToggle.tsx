import { useTranslation } from "react-i18next";
import { AccessibilityInfo, Pressable, StyleSheet, Text } from "react-native";

import type { AppLanguage } from "@/constants/a11y";
import { typography } from "@/constants/theme";
import { setAppLanguage, useA11yLanguage } from "@/i18n";

export default function LanguageToggle() {
  const { t, i18n } = useTranslation();
  const a11yLanguage = useA11yLanguage();
  const current = i18n.language.startsWith("en") ? "en" : "fr";

  async function toggle() {
    const next: AppLanguage = current === "fr" ? "en" : "fr";
    await setAppLanguage(next);
    AccessibilityInfo.announceForAccessibility(t("language.announce"));
  }

  return (
    <Pressable
      onPress={toggle}
      hitSlop={12}
      accessibilityRole="button"
      accessibilityLabel={t("language.action")}
      accessibilityValue={{ text: current.toUpperCase() }}
      accessibilityLanguage={a11yLanguage}
    >
      <Text style={styles.label}>{current.toUpperCase()}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  label: {
    ...typography.subtitle2,
    color: "#FFFFFF",
  },
});
