import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
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
import Pokeball from "@/components/Pokeball";
import StatBar from "@/components/StatBar";
import TypeBadge from "@/components/TypeBadge";
import { MOTION } from "@/constants/motion";
import { FIRST_SPECIES, LAST_SPECIES } from "@/constants/pokedex";
import { getTypeColors } from "@/constants/pokemonTypes";
import { iconSize, spacing, typography } from "@/constants/theme";
import { useBoot } from "@/contexts/BootProvider";
import { useTheme } from "@/contexts/ThemeProvider";
import { usePokemonDetail } from "@/hooks/usePokemonDetail";
import { useA11yLanguage } from "@/i18n";
import { getArtworkUrl } from "@/utils/artworkUrl";
import { formatDecimal, toKilograms, toMeters } from "@/utils/formatMeasures";
import { formatPokemonId } from "@/utils/formatPokemonId";
import { parsePokemonId } from "@/utils/parsePokemonId";

// Mesures du fichier Figma : bandeau de 76, cadre d'image de 144 traversé par
// un artwork de 200 qui déborde de 56 sur la carte, pokéball de 208 en
// filigrane, carte arrondie à 8 avec 56 de padding haut.
const ARTWORK_SIZE = 200;
const IMAGE_ROW_HEIGHT = 144;
const CARD_PADDING_TOP = 56;
const WATERMARK_SIZE = 208;
const WATERMARK_OPACITY = 0.1;

export default function PokemonDetail() {
  const { id: rawId } = useLocalSearchParams<{ id: string }>();
  const id = parsePokemonId(rawId);
  const { t, i18n } = useTranslation();
  const { theme, scheme } = useTheme();
  const a11yLanguage = useA11yLanguage();
  const { pokemon, species, loading, error, reload } = usePokemonDetail(id);
  const { markDataReady } = useBoot();

  // Une ouverture directe sur une fiche ne monte pas l'écran liste : c'est
  // elle qui doit alors libérer l'écran de démarrage.
  useEffect(() => {
    if (!loading) {
      markDataReady();
    }
  }, [loading, markDataReady]);

  // Deux mouvements qui s'additionnent : l'arrivée de l'artwork et le rebond
  // du cri. Les séparer garde chaque valeur partagée dans un seul effet.
  const artworkLift = useSharedValue<number>(MOTION.artwork.offset);
  const artworkScale = useSharedValue<number>(0.9);
  const cryBounce = useSharedValue<number>(0);
  const [cryCount, setCryCount] = useState(0);

  // L'artwork arrive quand les données sont là, pas au montage de l'écran.
  useEffect(() => {
    if (!pokemon) {
      return;
    }
    artworkLift.value = MOTION.artwork.offset;
    artworkScale.value = 0.9;
    artworkLift.value = withSpring(0, { ...MOTION.spring, reduceMotion: ReduceMotion.System });
    artworkScale.value = withSpring(1, { ...MOTION.spring, reduceMotion: ReduceMotion.System });
  }, [pokemon, artworkLift, artworkScale]);

  // Un bond court accompagne le cri : le geste produit un effet visible. Le
  // compteur sert de déclencheur, le compilateur React interdisant de toucher
  // une valeur partagée ailleurs que dans un effet.
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

  // Le type du slot 1 donne la couleur de toute la fiche.
  const accent = getTypeColors(pokemon?.types[0] ?? "normal");
  // Une teinte de type foncée ne donne que 2,49 de contraste sur la surface
  // sombre : les titres de section passent au texte du thème, les aplats de
  // type restent inchangés.
  const sectionColor = scheme === "dark" ? theme.textPrimary : accent.background;

  // Navigation conditionnelle : on vérifie la borne avant de bouger, d'où la
  // forme impérative plutôt qu'un lien. `replace` évite d'empiler les fiches.
  function goToNeighbour(step: number) {
    if (id === null) {
      return;
    }
    const target = id + step;
    if (target < FIRST_SPECIES || target > LAST_SPECIES) {
      return;
    }
    router.replace({ pathname: "/pokemon/[id]", params: { id: String(target) } });
  }

  function goBack() {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace("/");
  }

  if (loading) {
    return (
      <SafeAreaView style={[styles.fallback, { backgroundColor: theme.background }]}>
        <StatusBar style={scheme === "dark" ? "light" : "dark"} />
        <Loader />
      </SafeAreaView>
    );
  }

  if (error || !pokemon || !species) {
    return (
      <SafeAreaView style={[styles.fallback, { backgroundColor: theme.background }]}>
        <StatusBar style={scheme === "dark" ? "light" : "dark"} />
        <ErrorMessage
          message={error === "notFound" ? t("state.notFound") : t("state.error")}
          onRetry={reload}
        />
        <Pressable
          style={styles.fallbackBack}
          onPress={goBack}
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

  const canGoPrevious = id !== null && id > FIRST_SPECIES;
  const canGoNext = id !== null && id < LAST_SPECIES;

  return (
    <View style={[styles.screen, { backgroundColor: accent.background }]}>
      {/* Le haut de l'écran est peint par la couleur du type : la barre d'état
          suit la couleur de texte que la table du type a validée. */}
      <StatusBar style={accent.foreground === "#FFFFFF" ? "light" : "dark"} />

      <View style={styles.watermark} pointerEvents="none">
        <Pokeball size={WATERMARK_SIZE} color={accent.foreground} opacity={WATERMARK_OPACITY} />
      </View>

      <SafeAreaView edges={["top"]}>
        <View style={styles.title}>
          <Pressable
            onPress={goBack}
            hitSlop={8}
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
          <Text style={[styles.number, { color: accent.foreground }]}>
            {formatPokemonId(pokemon.id)}
          </Text>
        </View>
      </SafeAreaView>

      <View style={styles.imageRow}>
        <Pressable
          onPress={() => goToNeighbour(-1)}
          disabled={!canGoPrevious}
          hitSlop={12}
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
          onPress={() => goToNeighbour(1)}
          disabled={!canGoNext}
          hitSlop={12}
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

        <Animated.Image
          source={{ uri: getArtworkUrl(pokemon.id) }}
          style={[styles.artwork, artworkStyle]}
          resizeMode="contain"
          accessible={false}
          importantForAccessibility="no"
        />
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
                <MaterialIcons name="straighten" size={iconSize.sm} color={theme.textPrimary} />
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
                    style={[styles.attributeValue, { color: theme.textPrimary }]}
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
    padding: 4,
  },
  fallback: {
    flex: 1,
  },
  fallbackBack: {
    alignItems: "center",
    paddingBottom: spacing.lg,
  },
  fallbackBackLabel: {
    ...typography.subtitle1,
  },
  watermark: {
    position: "absolute",
    top: 8,
    right: 8,
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
    ...typography.headline,
    flex: 1,
    textTransform: "capitalize",
  },
  number: {
    ...typography.subtitle2,
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
  artwork: {
    position: "absolute",
    alignSelf: "center",
    top: 0,
    width: ARTWORK_SIZE,
    height: ARTWORK_SIZE,
  },
  card: {
    flex: 1,
    borderRadius: 8,
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
    ...typography.subtitle1,
    textAlign: "center",
  },
  attributes: {
    flexDirection: "row",
  },
  attribute: {
    flex: 1,
    alignItems: "center",
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
    ...typography.body3,
    textTransform: "capitalize",
  },
  abilities: {
    height: 32,
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
    ...typography.body3,
    textAlign: "justify",
  },
});
