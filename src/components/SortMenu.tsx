import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

import { circleButton, elevation, iconSize, spacing, typography } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeProvider";
import { useA11yLanguage } from "@/i18n";
import type { SortMode } from "@/types/pokemon";

const MODES: SortMode[] = ["number", "name"];

// L'icône du bouton reprend celle de la maquette : le dièse pour le tri par
// numéro, le format de texte pour le tri par nom.
const MODE_ICONS: Record<SortMode, "tag" | "text-format"> = {
  number: "tag",
  name: "text-format",
};

type SortMenuProps = {
  mode: SortMode;
  onChange: (mode: SortMode) => void;
};

export default function SortMenu({ mode, onChange }: SortMenuProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const a11yLanguage = useA11yLanguage();
  const [open, setOpen] = useState(false);

  function select(next: SortMode) {
    onChange(next);
    setOpen(false);
  }

  function labelFor(option: SortMode) {
    return option === "number" ? t("list.sortByNumber") : t("list.sortByName");
  }

  return (
    <>
      <Pressable
        style={[circleButton, { backgroundColor: theme.surface }]}
        onPress={() => setOpen(true)}
        accessibilityRole="button"
        accessibilityLabel={t("list.sortAction")}
        accessibilityValue={{ text: labelFor(mode) }}
        accessibilityLanguage={a11yLanguage}
      >
        <MaterialIcons name={MODE_ICONS[mode]} size={iconSize.sm} color={theme.primary} />
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        {/* Le voile est un frère de la carte, jamais son parent : un Pressable
            parent groupe tout son contenu en un seul élément et le rend
            inatteignable au lecteur d'écran. */}
        <View style={styles.container} accessibilityViewIsModal>
          <Pressable
            style={[styles.backdrop, { backgroundColor: theme.scrim }]}
            onPress={() => setOpen(false)}
            accessibilityRole="button"
            accessibilityLabel={t("state.close")}
            accessibilityLanguage={a11yLanguage}
          />
          <View style={[styles.card, elevation.high, { backgroundColor: theme.primary }]}>
            <View style={styles.cardTitle}>
              <Text
                style={[styles.cardTitleLabel, { color: theme.onPrimary }]}
                accessibilityRole="header"
                accessibilityLanguage={a11yLanguage}
              >
                {t("list.sortTitle")}
              </Text>
            </View>

            <View style={[styles.options, { backgroundColor: theme.surface }]}>
              {MODES.map((option) => (
                <Pressable
                  key={option}
                  style={styles.option}
                  onPress={() => select(option)}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: mode === option }}
                  accessibilityLabel={labelFor(option)}
                  accessibilityLanguage={a11yLanguage}
                >
                  <View style={[styles.radio, { borderColor: theme.primary }]}>
                    {mode === option ? (
                      <View style={[styles.radioDot, { backgroundColor: theme.primary }]} />
                    ) : null}
                  </View>
                  <Text style={[styles.optionLabel, { color: theme.textPrimary }]}>
                    {labelFor(option)}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "flex-end",
    paddingTop: 104,
    paddingRight: spacing.md,
  },
  backdrop: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  card: {
    borderRadius: 12,
    paddingHorizontal: spacing.xs,
    paddingBottom: spacing.xs,
  },
  cardTitle: {
    paddingHorizontal: 20,
    paddingVertical: spacing.md,
  },
  cardTitleLabel: {
    ...typography.subtitle2,
  },
  options: {
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  radio: {
    width: iconSize.sm,
    height: iconSize.sm,
    borderRadius: iconSize.sm / 2,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  optionLabel: {
    ...typography.body3,
  },
});
