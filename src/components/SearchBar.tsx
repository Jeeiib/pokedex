import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useTranslation } from "react-i18next";
import { StyleSheet, TextInput, View } from "react-native";

import { iconSize, spacing, TOUCH_TARGET, typography } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeProvider";
import { useA11yLanguage } from "@/i18n";

// Mesures du fichier Figma : hauteur 32, rayon 16, retrait 12 à gauche et 16 à
// droite, icône de 16 à 8 du champ.

type SearchBarProps = {
  value: string;
  onChangeText: (value: string) => void;
};

export default function SearchBar({ value, onChangeText }: SearchBarProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const a11yLanguage = useA11yLanguage();

  return (
    <View style={[styles.container, { backgroundColor: theme.surface }]}>
      <MaterialIcons name="search" size={iconSize.sm} color={theme.primary} />
      <TextInput
        style={[styles.input, { color: theme.textPrimary }]}
        value={value}
        onChangeText={onChangeText}
        placeholder={t("list.searchPlaceholder")}
        placeholderTextColor={theme.textSecondary}
        autoCorrect={false}
        autoCapitalize="none"
        returnKeyType="search"
        accessibilityLabel={t("list.searchPlaceholder")}
        accessibilityLanguage={a11yLanguage}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    height: TOUCH_TARGET,
    borderRadius: TOUCH_TARGET / 2,
    paddingLeft: 12,
    paddingRight: spacing.md,
  },
  input: {
    ...typography.body1,
    flex: 1,
    // Le champ occupe toute la hauteur : viser la pilule suffit, sans avoir à
    // toucher précisément la ligne de texte.
    alignSelf: "stretch",
    padding: 0,
  },
});
