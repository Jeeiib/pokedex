import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { circleButton, iconSize, typography } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeProvider";
import { useA11yLanguage } from "@/i18n";

type TypeFilterButtonProps = {
  count: number;
  onPress: () => void;
};

export default function TypeFilterButton({ count, onPress }: TypeFilterButtonProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const a11yLanguage = useA11yLanguage();
  const active = count > 0;

  return (
    <Pressable
      style={[circleButton, { backgroundColor: active ? theme.textPrimary : theme.surface }]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      accessibilityLabel={t("list.filterAction")}
      accessibilityValue={active ? { text: t("list.filterCount", { count }) } : undefined}
      accessibilityLanguage={a11yLanguage}
    >
      <MaterialIcons
        name="filter-list"
        size={iconSize.md}
        color={active ? theme.surface : theme.primary}
      />
      {active ? (
        // Le badge double la couleur du bouton : un état porté par la seule
        // teinte échappe aux daltonismes.
        <View
          style={[styles.badge, { backgroundColor: theme.surface, borderColor: theme.textPrimary }]}
          accessible={false}
          importantForAccessibility="no"
        >
          <Text style={[styles.badgeLabel, { color: theme.textPrimary }]}>{count}</Text>
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: "absolute",
    top: 0,
    right: 0,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  badgeLabel: {
    ...typography.cardNumber,
    fontWeight: "700",
  },
});
