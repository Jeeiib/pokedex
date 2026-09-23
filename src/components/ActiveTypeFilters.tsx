import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { getTypeColors } from "@/constants/pokemonTypes";
import { iconSize, spacing, TOUCH_TARGET, typography } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeProvider";
import { useA11yLanguage } from "@/i18n";

type ActiveTypeFiltersProps = {
  selected: string[];
  resultCount: number;
  onRemove: (slug: string) => void;
};

export default function ActiveTypeFilters({
  selected,
  resultCount,
  onRemove,
}: ActiveTypeFiltersProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const a11yLanguage = useA11yLanguage();

  if (selected.length === 0) {
    return null;
  }

  return (
    <View style={styles.row}>
      {selected.map((slug) => {
        const colors = getTypeColors(slug);
        return (
          <Pressable
            key={slug}
            style={[styles.chip, { backgroundColor: colors.background }]}
            onPress={() => onRemove(slug)}
            accessibilityRole="button"
            accessibilityLabel={t("list.filterRemove", { type: t(`types.${slug}`) })}
            accessibilityLanguage={a11yLanguage}
          >
            <Text style={[styles.label, { color: colors.foreground }]}>
              {t(`types.${slug}`)}
            </Text>
            <MaterialIcons name="close" size={iconSize.sm} color={colors.foreground} />
          </Pressable>
        );
      })}
      <Text style={[styles.count, { color: theme.textSecondary }]}>
        {t("list.results", { count: resultCount })}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingTop: spacing.md,
  },
  chip: {
    height: TOUCH_TARGET,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingLeft: 14,
    paddingRight: spacing.sm,
    borderRadius: TOUCH_TARGET / 2,
  },
  label: {
    ...typography.chip,
  },
  count: {
    ...typography.caption,
    flex: 1,
    textAlign: "right",
  },
});
