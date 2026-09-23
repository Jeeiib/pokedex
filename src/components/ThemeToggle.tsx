import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useTranslation } from "react-i18next";
import { AccessibilityInfo, Pressable } from "react-native";

import { iconSize, touchArea } from "@/constants/theme";
import { useTheme, type ThemeMode } from "@/contexts/ThemeProvider";
import { useA11yLanguage } from "@/i18n";

// Trois états : suivre le téléphone, forcer le clair, forcer le sombre.
const ORDER: ThemeMode[] = ["system", "light", "dark"];

export default function ThemeToggle() {
  const { t } = useTranslation();
  const { theme, mode, scheme, setMode } = useTheme();
  const a11yLanguage = useA11yLanguage();

  function cycle() {
    const next = ORDER[(ORDER.indexOf(mode) + 1) % ORDER.length];
    setMode(next);
    const announcement =
      next === "dark" || (next === "system" && scheme === "dark")
        ? t("theme.announceDark")
        : t("theme.announceLight");
    AccessibilityInfo.announceForAccessibility(announcement);
  }

  const icon = mode === "system" ? "brightness-auto" : scheme === "dark" ? "dark-mode" : "light-mode";

  return (
    <Pressable
      style={touchArea}
      onPress={cycle}
      accessibilityRole="button"
      accessibilityLabel={t("theme.action")}
      accessibilityValue={{ text: t(`theme.${mode}`) }}
      accessibilityLanguage={a11yLanguage}
    >
      <MaterialIcons name={icon} size={iconSize.md} color={theme.onPrimary} />
    </Pressable>
  );
}
