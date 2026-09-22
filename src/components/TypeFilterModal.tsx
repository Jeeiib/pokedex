import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { getTypeColors } from "@/constants/pokemonTypes";
import { elevation, spacing, typography } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeProvider";
import { useA11yLanguage } from "@/i18n";
import type { PokemonTypeOption } from "@/types/pokemon";

const ICON_SIZE = 16;

type TypeFilterModalProps = {
  types: PokemonTypeOption[];
  selected: string | null;
  onSelect: (slug: string | null) => void;
};

export default function TypeFilterModal({ types, selected, onSelect }: TypeFilterModalProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const a11yLanguage = useA11yLanguage();
  const [open, setOpen] = useState(false);

  function choose(slug: string | null) {
    onSelect(slug);
    setOpen(false);
  }

  return (
    <>
      <Pressable
        style={[
          styles.trigger,
          { backgroundColor: selected ? getTypeColors(selected).background : theme.surface },
        ]}
        onPress={() => setOpen(true)}
        accessibilityRole="button"
        accessibilityLabel={t("list.filterAction")}
        accessibilityValue={{ text: selected ? t(`types.${selected}`) : t("list.filterClear") }}
        accessibilityLanguage={a11yLanguage}
      >
        <MaterialIcons
          name="filter-list"
          size={ICON_SIZE}
          color={selected ? getTypeColors(selected).foreground : theme.primaryText}
        />
      </Pressable>

      <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <View style={[styles.sheet, elevation.high, { backgroundColor: theme.surface }]}>
            <Text
              style={[styles.sheetTitle, { color: theme.textPrimary }]}
              accessibilityRole="header"
              accessibilityLanguage={a11yLanguage}
            >
              {t("list.filterTitle")}
            </Text>

            <ScrollView contentContainerStyle={styles.options}>
              <Pressable
                style={[styles.clear, { borderColor: theme.border }]}
                onPress={() => choose(null)}
                accessibilityRole="button"
                accessibilityState={{ selected: selected === null }}
                accessibilityLabel={t("list.filterClear")}
                accessibilityLanguage={a11yLanguage}
              >
                <Text style={[styles.clearLabel, { color: theme.textPrimary }]}>
                  {t("list.filterClear")}
                </Text>
              </Pressable>

              {types.map((type) => {
                const colors = getTypeColors(type.slug);
                // Le nom vient de la traduction locale, jamais du slug brut
                // ni du nom renvoyé par l'API.
                const label = t(`types.${type.slug}`);
                return (
                  <Pressable
                    key={type.slug}
                    style={[
                      styles.option,
                      { backgroundColor: colors.background },
                      selected === type.slug
                        ? [styles.optionSelected, { borderColor: colors.foreground }]
                        : undefined,
                    ]}
                    onPress={() => choose(type.slug)}
                    accessibilityRole="button"
                    accessibilityState={{ selected: selected === type.slug }}
                    accessibilityLabel={label}
                    accessibilityLanguage={a11yLanguage}
                  >
                    <Text style={[styles.optionLabel, { color: colors.foreground }]}>{label}</Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "flex-end",
  },
  sheet: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: spacing.lg,
    gap: spacing.md,
    maxHeight: "70%",
  },
  sheetTitle: {
    ...typography.subtitle1,
  },
  options: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  clear: {
    borderRadius: 10,
    borderWidth: 1,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  clearLabel: {
    ...typography.subtitle3,
  },
  option: {
    borderRadius: 10,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  optionSelected: {
    borderWidth: 2,
  },
  optionLabel: {
    ...typography.subtitle3,
  },
});
