import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, StyleSheet, Text } from "react-native";

import { getTypeColors } from "@/constants/pokemonTypes";
import { spacing, TOUCH_TARGET, typography } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeProvider";
import { useA11yLanguage } from "@/i18n";
import type { PokemonTypeOption } from "@/types/pokemon";

type TypeFilterBarProps = {
  types: PokemonTypeOption[];
  selected: string | null;
  onSelect: (slug: string | null) => void;
};

// Le filtre est visible au lieu d'être caché derrière une feuille : on voit
// d'un coup d'œil quel type est actif, et le changer coûte un seul appui.
export default function TypeFilterBar({ types, selected, onSelect }: TypeFilterBarProps) {
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const a11yLanguage = useA11yLanguage();

  // Les types arrivent dans l'ordre alphabétique de leurs identifiants
  // anglais, ce qui paraît désordonné une fois les noms traduits.
  const sorted = useMemo(
    () =>
      [...types].sort((left, right) =>
        t(`types.${left.slug}`).localeCompare(t(`types.${right.slug}`), i18n.language)
      ),
    [types, t, i18n.language]
  );

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
      accessibilityLabel={t("list.filterTitle")}
      accessibilityLanguage={a11yLanguage}
    >
      <Pressable
        style={[
          styles.chip,
          selected === null
            ? { backgroundColor: theme.onPrimary }
            : { borderColor: theme.onPrimary, borderWidth: 1 },
        ]}
        onPress={() => onSelect(null)}
        accessibilityRole="button"
        accessibilityState={{ selected: selected === null }}
        accessibilityLabel={t("list.filterClear")}
        accessibilityLanguage={a11yLanguage}
      >
        <Text
          style={[
            styles.label,
            { color: selected === null ? theme.primaryText : theme.onPrimary },
          ]}
        >
          {t("list.filterAll")}
        </Text>
      </Pressable>

      {sorted.map((type) => {
        const colors = getTypeColors(type.slug);
        const active = selected === type.slug;
        return (
          <Pressable
            key={type.slug}
            style={[
              styles.chip,
              { backgroundColor: colors.background },
              active ? { borderColor: theme.onPrimary, borderWidth: 2 } : undefined,
            ]}
            onPress={() => onSelect(active ? null : type.slug)}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            accessibilityLabel={t(`types.${type.slug}`)}
            accessibilityLanguage={a11yLanguage}
          >
            <Text style={[styles.label, { color: colors.foreground }]}>
              {t(`types.${type.slug}`)}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    alignItems: "center",
  },
  chip: {
    height: TOUCH_TARGET,
    justifyContent: "center",
    paddingHorizontal: 14,
    borderRadius: TOUCH_TARGET / 2,
  },
  label: {
    ...typography.chip,
  },
});
