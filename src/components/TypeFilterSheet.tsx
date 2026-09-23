import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import Animated, {
  ReduceMotion,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { MOTION } from "@/constants/motion";
import { getTypeColors } from "@/constants/pokemonTypes";
import { iconSize, spacing, TOUCH_TARGET, typography } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeProvider";
import { useA11yLanguage } from "@/i18n";
import type { PokemonTypeOption } from "@/types/pokemon";

const COLUMNS = 3;
const SHEET_RADIUS = 16;
// La feuille laisse toujours voir un morceau de la liste, même quand la taille
// de texte du système fait grandir la grille.
const SHEET_MAX_RATIO = 0.88;

type TypeFilterSheetProps = {
  visible: boolean;
  types: PokemonTypeOption[];
  selected: string[];
  atLimit: boolean;
  resultCount: number;
  onToggle: (slug: string) => void;
  onClear: () => void;
  onClose: () => void;
};

export default function TypeFilterSheet({
  visible,
  types,
  selected,
  atLimit,
  resultCount,
  onToggle,
  onClear,
  onClose,
}: TypeFilterSheetProps) {
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const a11yLanguage = useA11yLanguage();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();

  // Le démontage attend la fin de l'animation de sortie : la modale se
  // retirerait sinon avant que le voile ait fini de s'effacer.
  const [rendered, setRendered] = useState(false);
  const [sheetHeight, setSheetHeight] = useState(0);
  const progress = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- le montage de la modale est piloté par la même animation que le voile, il n'a pas d'autre source.
      setRendered(true);
      progress.value = withTiming(1, {
        duration: MOTION.sheet.enter,
        reduceMotion: ReduceMotion.System,
      });
      return;
    }
    progress.value = withTiming(
      0,
      { duration: MOTION.sheet.exit, reduceMotion: ReduceMotion.System },
      (finished) => {
        if (finished) {
          runOnJS(setRendered)(false);
        }
      }
    );
  }, [visible, progress]);

  const scrimStyle = useAnimatedStyle(() => ({ opacity: progress.value }));

  // La feuille monte depuis le bas de l'écran. Avant sa première mesure, une
  // course par défaut tient lieu de hauteur.
  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: (1 - progress.value) * (sheetHeight || 480) }],
  }));

  // Les types arrivent dans l'ordre alphabétique de leurs identifiants
  // anglais, ce qui paraît désordonné une fois les noms traduits.
  const sorted = useMemo(
    () =>
      [...types].sort((left, right) =>
        t(`types.${left.slug}`).localeCompare(t(`types.${right.slug}`), i18n.language)
      ),
    [types, t, i18n.language]
  );

  const chipWidth = (width - spacing.md * 2 - spacing.sm * (COLUMNS - 1)) / COLUMNS;

  return (
    <Modal
      visible={rendered}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      {/* Le voile est un frère de la feuille, jamais son parent : un Pressable
          parent groupe tout son contenu en un seul élément et le rend
          inatteignable au lecteur d'écran. */}
      <View style={styles.container} accessibilityViewIsModal>
        <Animated.View style={[styles.backdrop, scrimStyle]}>
          <Pressable
            style={[styles.backdropFill, { backgroundColor: theme.scrim }]}
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel={t("state.close")}
            accessibilityLanguage={a11yLanguage}
          />
        </Animated.View>

        <Animated.View
          style={[
            styles.sheet,
            sheetStyle,
            {
              backgroundColor: theme.surface,
              paddingBottom: insets.bottom + spacing.md,
              maxHeight: height * SHEET_MAX_RATIO,
            },
          ]}
          onLayout={(event) => setSheetHeight(event.nativeEvent.layout.height)}
        >
          <View style={[styles.handle, { backgroundColor: theme.border }]} />

          <View style={styles.header}>
            <Text
              style={[styles.title, { color: theme.textPrimary }]}
              accessibilityRole="header"
              accessibilityLanguage={a11yLanguage}
            >
              {t("list.filterTitle")}
            </Text>
            <Pressable
              style={styles.done}
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel={t("state.done")}
              accessibilityLanguage={a11yLanguage}
            >
              <Text style={[styles.doneLabel, { color: theme.primaryText }]}>
                {t("state.done")}
              </Text>
            </Pressable>
          </View>

          <Text style={[styles.help, { color: theme.textSecondary }]}>
            {t("list.filterHelp")}
          </Text>

          <ScrollView
            style={styles.gridScroll}
            contentContainerStyle={styles.grid}
            showsVerticalScrollIndicator={false}
          >
            {sorted.map((type) => {
              const colors = getTypeColors(type.slug);
              const checked = selected.includes(type.slug);
              const blocked = atLimit && !checked;
              return (
                <Pressable
                  key={type.slug}
                  style={[
                    styles.chip,
                    { width: chipWidth },
                    checked
                      ? { backgroundColor: colors.background }
                      : { borderColor: theme.border, borderWidth: 1 },
                    blocked ? styles.chipBlocked : undefined,
                  ]}
                  onPress={() => onToggle(type.slug)}
                  disabled={blocked}
                  // iOS n'expose pas de trait « case à cocher » : un rôle
                  // checkbox retirerait aux puces leur nature de contrôle.
                  accessibilityRole="button"
                  accessibilityState={{ selected: checked, disabled: blocked }}
                  accessibilityLabel={t(`types.${type.slug}`)}
                  accessibilityLanguage={a11yLanguage}
                >
                  {checked ? (
                    <MaterialIcons name="check" size={iconSize.sm} color={colors.foreground} />
                  ) : (
                    <View style={[styles.dot, { backgroundColor: colors.background }]} />
                  )}
                  <Text
                    style={[
                      styles.chipLabel,
                      { color: checked ? colors.foreground : theme.textPrimary },
                    ]}
                  >
                    {t(`types.${type.slug}`)}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <View style={styles.footer}>
            <Pressable
              style={styles.clear}
              onPress={onClear}
              disabled={selected.length === 0}
              accessibilityRole="button"
              accessibilityState={{ disabled: selected.length === 0 }}
              accessibilityLabel={t("list.filterClearAll")}
              accessibilityLanguage={a11yLanguage}
            >
              <Text
                style={[
                  styles.clearLabel,
                  { color: selected.length === 0 ? theme.textSecondary : theme.primaryText },
                ]}
              >
                {t("list.filterClearAll")}
              </Text>
            </Pressable>
            <Text style={[styles.count, { color: theme.textSecondary }]}>
              {t("list.results", { count: resultCount })}
            </Text>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  backdropFill: {
    flex: 1,
  },
  sheet: {
    borderTopLeftRadius: SHEET_RADIUS,
    borderTopRightRadius: SHEET_RADIUS,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    gap: spacing.md,
  },
  handle: {
    width: 36,
    height: 5,
    borderRadius: 3,
    alignSelf: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  title: {
    ...typography.sectionTitle,
    flex: 1,
  },
  done: {
    minHeight: TOUCH_TARGET,
    justifyContent: "center",
    paddingHorizontal: spacing.xs,
  },
  doneLabel: {
    ...typography.bodyStrong,
  },
  help: {
    ...typography.caption,
    marginTop: -spacing.sm,
  },
  gridScroll: {
    flexGrow: 0,
    flexShrink: 1,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  chip: {
    minHeight: TOUCH_TARGET,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: TOUCH_TARGET / 2,
  },
  chipBlocked: {
    opacity: 0.5,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  chipLabel: {
    ...typography.chip,
    flexShrink: 1,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  clear: {
    minHeight: TOUCH_TARGET,
    justifyContent: "center",
    paddingHorizontal: spacing.xs,
  },
  clearLabel: {
    ...typography.body,
  },
  count: {
    ...typography.caption,
  },
});
