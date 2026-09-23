// Page plein écran d'une fiche Pokémon, avec artwork animé, statistiques de
// base et navigation vers la fiche précédente ou suivante.

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import Animated, {
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import CryButton from "@/components/CryButton";
import ErrorMessage from "@/components/ErrorMessage";
import FavoriteButton from "@/components/FavoriteButton";
import Loader from "@/components/Loader";
import StatBar from "@/components/StatBar";
import TypeBadge from "@/components/TypeBadge";
import { MOTION } from "@/constants/motion";
import { getTypeColors } from "@/constants/pokemonTypes";
import { iconSize, spacing, touchArea, typography } from "@/constants/theme";
import { useBoot } from "@/contexts/BootProvider";
import { useTheme } from "@/contexts/ThemeProvider";
import { usePokemonDetail } from "@/hooks/usePokemonDetail";
import { useA11yLanguage } from "@/i18n";
import { getArtworkUrl } from "@/utils/artworkUrl";
import { formatDecimal, toKilograms, toMeters } from "@/utils/formatMeasures";
import { formatPokemonId } from "@/utils/formatPokemonId";

const ARTWORK_SIZE = 200;
const IMAGE_ROW_HEIGHT = 144;
const CARD_PADDING_TOP = 56;
const WATERMARK_OPACITY = 0.14;

type PokemonPageProps = {
  id: number | null;
  active: boolean;
  canGoPrevious: boolean;
  canGoNext: boolean;
  onNavigate: (step: number) => void;
  onBack: () => void;
};

// Charge la fiche demandée, anime l'arrivée de l'artwork et le rebond du cri,
// et bascule entre chargement, erreur et contenu selon l'état de la requête.
export default function PokemonPage({
  id,
  active,
  canGoPrevious,
  canGoNext,
  onNavigate,
  onBack,
}: PokemonPageProps) {
  const { t, i18n } = useTranslation();
  const { theme, scheme } = useTheme();
  const a11yLanguage = useA11yLanguage();
  const { width } = useWindowDimensions();
  const { pokemon, species, loading, error, reload } = usePokemonDetail(id);
  const { markDataReady } = useBoot();

  useEffect(() => {
    if (!loading && active) {
      markDataReady();
    }
  }, [loading, active, markDataReady]);

  const artworkLift = useSharedValue<number>(MOTION.artwork.offset);
  const artworkScale = useSharedValue<number>(0.9);
  const cryBounce = useSharedValue<number>(0);
  const [cryCount, setCryCount] = useState(0);

  useEffect(() => {
    if (!pokemon) {
      return;
    }
    artworkLift.value = MOTION.artwork.offset;
    artworkScale.value = 0.9;
    artworkLift.value = withSpring(0, { ...MOTION.spring, reduceMotion: ReduceMotion.System });
    artworkScale.value = withSpring(1, { ...MOTION.spring, reduceMotion: ReduceMotion.System });
  }, [pokemon, artworkLift, artworkScale]);

  useEffect(() => {
    if (cryCount === 0) {
      return;
    }
    cryBounce.value = withSequence(
      withTiming(-MOTION.cry.offset, {
        duration: MOTION.cry.duration / 2,
        reduceMotion: ReduceMotion.System,
      }),
      withSpring(0, { ...MOTION.spring, reduceMotion: ReduceMotion.System })
    );
  }, [cryCount, cryBounce]);

  const artworkStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: artworkLift.value + cryBounce.value },
      { scale: artworkScale.value },
    ],
  }));

  const accent = getTypeColors(pokemon?.types[0] ?? "normal");
  const sectionColor = scheme === "dark" ? theme.textPrimary : accent.background;

  const hidden = !active;

  if (loading) {
    return (
      <SafeAreaView
        style={[styles.fallback, { width, backgroundColor: theme.background }]}
        accessibilityElementsHidden={hidden}
        importantForAccessibility={hidden ? "no-hide-descendants" : "auto"}
      >
        {active ? <StatusBar style={scheme === "dark" ? "light" : "dark"} /> : null}
        <Loader />
      </SafeAreaView>
    );
  }

  if (error || !pokemon || !species) {
    return (
      <SafeAreaView
        style={[styles.fallback, { width, backgroundColor: theme.background }]}
        accessibilityElementsHidden={hidden}
        importantForAccessibility={hidden ? "no-hide-descendants" : "auto"}
      >
        {active ? <StatusBar style={scheme === "dark" ? "light" : "dark"} /> : null}
        <ErrorMessage
          message={error === "notFound" ? t("state.notFound") : t("state.error")}
          onRetry={reload}
        />
        <Pressable
          style={styles.fallbackBack}
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel={t("detail.back")}
          accessibilityLanguage={a11yLanguage}
        >
          <Text style={[styles.fallbackBackLabel, { color: theme.primaryText }]}>
            {t("detail.back")}
          </Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <View
      style={[styles.screen, { width, backgroundColor: accent.background }]}
      accessibilityElementsHidden={hidden}
      importantForAccessibility={hidden ? "no-hide-descendants" : "auto"}
    >
      {active ? (
        <StatusBar style={accent.foreground === "#FFFFFF" ? "light" : "dark"} />
      ) : null}

      <Text
        style={[styles.watermark, { color: accent.foreground }]}
        pointerEvents="none"
        accessible={false}
        importantForAccessibility="no"
        numberOfLines={1}
      >
        {formatPokemonId(pokemon.id).replace("#", "")}
      </Text>

      <SafeAreaView edges={["top"]}>
        <View style={styles.title}>
          <Pressable
            style={touchArea}
            onPress={onBack}
            accessibilityRole="button"
            accessibilityLabel={t("detail.back")}
            accessibilityLanguage={a11yLanguage}
          >
            <MaterialIcons name="arrow-back" size={iconSize.xl} color={accent.foreground} />
          </Pressable>
          <Text
            style={[styles.name, { color: accent.foreground }]}
            numberOfLines={1}
            accessibilityRole="header"
            accessibilityLanguage={a11yLanguage}
          >
            {species.name}
          </Text>
          <CryButton
            slug={pokemon.slug}
            officialUrl={pokemon.cryUrl}
            name={species.name}
            color={accent.foreground}
            onPlay={() => setCryCount((current) => current + 1)}
          />
          <FavoriteButton
            key={pokemon.id}
            id={pokemon.id}
            name={species.name}
            color={accent.foreground}
          />
        </View>
      </SafeAreaView>

      <View style={styles.imageRow}>
        <Pressable
          style={touchArea}
          onPress={() => onNavigate(-1)}
          disabled={!canGoPrevious}
          accessibilityRole="button"
          accessibilityLabel={t("detail.previous")}
          accessibilityLanguage={a11yLanguage}
        >
          <MaterialIcons
            name="chevron-left"
            size={iconSize.lg}
            color={accent.foreground}
            style={!canGoPrevious ? styles.disabled : undefined}
          />
        </Pressable>

        <Pressable
          style={touchArea}
          onPress={() => onNavigate(1)}
          disabled={!canGoNext}
          accessibilityRole="button"
          accessibilityLabel={t("detail.next")}
          accessibilityLanguage={a11yLanguage}
        >
          <MaterialIcons
            name="chevron-right"
            size={iconSize.lg}
            color={accent.foreground}
            style={!canGoNext ? styles.disabled : undefined}
          />
        </Pressable>

        <View style={styles.artworkSlot} pointerEvents="none">
          <Animated.Image
            source={{ uri: getArtworkUrl(pokemon.id) }}
            style={[styles.artwork, artworkStyle]}
            resizeMode="contain"
            accessible={false}
            importantForAccessibility="no"
          />
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: theme.surface }]}>
        <ScrollView contentContainerStyle={styles.cardContent} showsVerticalScrollIndicator={false}>
          <View style={styles.types}>
            {pokemon.types.map((slug, index) => (
              <TypeBadge key={slug} slug={slug} label={t(`types.${slug}`)} index={index} />
            ))}
          </View>

          <Text style={[styles.section, { color: sectionColor }]}>{t("detail.about")}</Text>

          <View style={styles.attributes}>
            <View style={styles.attribute}>
              <View style={styles.attributeValueRow}>
                <MaterialIcons
                  name="monitor-weight"
                  size={iconSize.sm}
                  color={theme.textPrimary}
                  accessibilityElementsHidden
                  importantForAccessibility="no-hide-descendants"
                />
                <Text style={[styles.attributeValue, { color: theme.textPrimary }]}>
                  {formatDecimal(toKilograms(pokemon.weightHg), i18n.language)} {t("detail.weightUnit")}
                </Text>
              </View>
              <Text style={[styles.attributeLabel, { color: theme.textSecondary }]}>
                {t("detail.weight")}
              </Text>
            </View>

            <View style={[styles.attributeDivider, { backgroundColor: theme.border }]} />

            <View style={styles.attribute}>
              <View style={styles.attributeValueRow}>
                <MaterialIcons
                  name="straighten"
                  size={iconSize.sm}
                  color={theme.textPrimary}
                  accessibilityElementsHidden
                  importantForAccessibility="no-hide-descendants"
                />
                <Text style={[styles.attributeValue, { color: theme.textPrimary }]}>
                  {formatDecimal(toMeters(pokemon.heightDm), i18n.language)} {t("detail.heightUnit")}
                </Text>
              </View>
              <Text style={[styles.attributeLabel, { color: theme.textSecondary }]}>
                {t("detail.height")}
              </Text>
            </View>

            <View style={[styles.attributeDivider, { backgroundColor: theme.border }]} />

            <View style={styles.attribute}>
              <View style={styles.abilities}>
                {pokemon.abilities.map((ability) => (
                  <Text
                    key={ability}
                    style={[styles.attributeValue, styles.abilityValue, { color: theme.textPrimary }]}
                  >
                    {ability}
                  </Text>
                ))}
              </View>
              <Text style={[styles.attributeLabel, { color: theme.textSecondary }]}>
                {t("detail.abilities")}
              </Text>
            </View>
          </View>

          <Text
            style={[styles.description, { color: theme.textPrimary }]}
            accessibilityLanguage={a11yLanguage}
          >
            {species.description}
          </Text>

          <Text style={[styles.section, { color: sectionColor }]}>
            {t("detail.baseStats")}
          </Text>

          <View>
            {pokemon.stats.map((stat, index) => (
              <StatBar
                key={stat.slug}
                label={t(`stats.${stat.slug}`)}
                value={stat.value}
                color={accent.background}
                index={index}
              />
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  fallback: {
    flex: 1,
  },
  fallbackBack: {
    alignItems: "center",
    paddingBottom: spacing.lg,
  },
  fallbackBackLabel: {
    ...typography.sectionTitle,
  },
  watermark: {
    ...typography.watermark,
    position: "absolute",
    top: 108,
    right: -16,
    opacity: WATERMARK_OPACITY,
  },
  title: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingTop: 20,
    paddingBottom: spacing.lg,
    paddingHorizontal: 20,
  },
  name: {
    ...typography.pokemonName,
    flex: 1,
    textTransform: "capitalize",
  },
  imageRow: {
    height: IMAGE_ROW_HEIGHT,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: spacing.md,
    zIndex: 2,
  },
  disabled: {
    opacity: 0.3,
  },
  artworkSlot: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  artwork: {
    width: ARTWORK_SIZE,
    height: ARTWORK_SIZE,
  },
  card: {
    flex: 1,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    zIndex: 1,
  },
  cardContent: {
    paddingTop: CARD_PADDING_TOP,
    paddingBottom: 20,
    paddingHorizontal: 20,
    gap: spacing.md,
  },
  types: {
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing.md,
  },
  section: {
    ...typography.sectionTitle,
    textAlign: "center",
  },
  attributes: {
    flexDirection: "row",
  },
  attribute: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.xs,
  },
  attributeValueRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
  attributeValue: {
    ...typography.measureValue,
  },
  abilityValue: {
    textTransform: "capitalize",
  },
  abilities: {
    justifyContent: "center",
  },
  attributeLabel: {
    ...typography.caption,
    textAlign: "center",
  },
  attributeDivider: {
    width: StyleSheet.hairlineWidth,
    alignSelf: "stretch",
  },
  description: {
    ...typography.body,
  },
});
