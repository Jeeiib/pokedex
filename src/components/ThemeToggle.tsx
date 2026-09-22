import { useTranslation } from "react-i18next";
import { AccessibilityInfo, Pressable, StyleSheet, Text } from "react-native";

import { typography } from "@/constants/theme";
import { useTheme, type ThemeMode } from "@/contexts/ThemeProvider";
import { useA11yLanguage } from "@/i18n";

// Trois etats : suivre le telephone, forcer le clair, forcer le sombre.
const ORDER: ThemeMode[] = ["system", "light", "dark"];

export default function ThemeToggle() {
  const { t } = useTranslation();
  const { mode, resolved, setMode } = useTheme();
  const a11yLanguage = useA11yLanguage();

  function cycle() {
    const next = ORDER[(ORDER.indexOf(mode) + 1) % ORDER.length];
    setMode(next);
    const announcement =
      next === "dark" || (next === "system" && resolved === "dark")
        ? t("theme.announceDark")
        : t("theme.announceLight");
    AccessibilityInfo.announceForAccessibility(announcement);
  }

  return (
    <Pressable
      onPress={cycle}
      hitSlop={12}
      accessibilityRole="button"
      accessibilityLabel={t("theme.action")}
      accessibilityValue={{ text: t(`theme.${mode === "system" ? "system" : mode}`) }}
      accessibilityLanguage={a11yLanguage}
    >
      <Text style={styles.icon}>{resolved === "dark" ? "☽" : "☀"}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  icon: {
    ...typography.subtitle1,
    color: "#FFFFFF",
  },
});
