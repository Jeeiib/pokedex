import { Link } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useState } from "react";
import Animated, { ReduceMotion, useAnimatedStyle, withTiming } from "react-native-reanimated";

import { MOTION } from "@/constants/motion";
import { elevation, spacing, typography } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeProvider";
import { useA11yLanguage } from "@/i18n";
import { getArtworkUrl } from "@/utils/artworkUrl";
import { formatPokemonId } from "@/utils/formatPokemonId";

// Mesures du fichier Figma : carte de 104x108, artwork de 72 posé en absolu
// qui recouvre le socle du nom, lequel réserve 24 de padding haut pour lui.
const CARD_HEIGHT = 108;
const ARTWORK_SIZE = 72;
const ARTWORK_TOP = 16;
const NAME_PADDING_TOP = 24;

type PokemonCardProps = {
  id: number;
  name: string;
};

export default function PokemonCard({ id, name }: PokemonCardProps) {
  const { theme } = useTheme();
  const a11yLanguage = useA11yLanguage();
  const [pressed, setPressed] = useState(false);

  // L'animation est déclarée dans le style plutôt que poussée dans une valeur
  // partagée : le compilateur React interdit de muter celle-ci hors d'un effet.
  const pressStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: withTiming(pressed ? MOTION.press.scale : 1, {
          duration: MOTION.press.duration,
          reduceMotion: ReduceMotion.System,
        }),
      },
    ],
  }));

  return (
    <Link href={{ pathname: "/pokemon/[id]", params: { id: String(id) } }} asChild>
      <Pressable
        style={styles.pressable}
        onPressIn={() => setPressed(true)}
        onPressOut={() => setPressed(false)}
        accessibilityRole="link"
        accessibilityLabel={`${name}, ${formatPokemonId(id)}`}
        accessibilityLanguage={a11yLanguage}
      >
        <Animated.View
          style={[styles.surface, elevation.low, pressStyle, { backgroundColor: theme.surface }]}
        >
          <View style={styles.card}>
            <View style={styles.numberRow}>
              <Text style={[styles.number, { color: theme.textSecondary }]}>
                {formatPokemonId(id)}
              </Text>
            </View>

            <View style={[styles.nameBlock, { backgroundColor: theme.background }]}>
              <Text
                style={[styles.name, { color: theme.textPrimary }]}
                numberOfLines={1}
                accessibilityElementsHidden
                importantForAccessibility="no-hide-descendants"
              >
                {name}
              </Text>
            </View>

            <Image
              source={{ uri: getArtworkUrl(id) }}
              style={styles.artwork}
              resizeMode="contain"
              accessible={false}
              importantForAccessibility="no"
            />
          </View>
        </Animated.View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  pressable: {
    flex: 1,
    height: CARD_HEIGHT,
  },
  // L'ombre vit sur la vue animée, au-dessus du rognage : sur iOS,
  // `overflow: hidden` rogne l'ombre du même élément et la fait disparaître.
  surface: {
    flex: 1,
    borderRadius: 8,
  },
  card: {
    flex: 1,
    borderRadius: 8,
    justifyContent: "space-between",
    overflow: "hidden",
  },
  numberRow: {
    alignItems: "flex-end",
    paddingTop: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  number: {
    ...typography.caption,
  },
  nameBlock: {
    borderRadius: 7,
    paddingTop: NAME_PADDING_TOP,
    paddingBottom: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  name: {
    ...typography.body3,
    textAlign: "center",
    textTransform: "capitalize",
  },
  artwork: {
    position: "absolute",
    alignSelf: "center",
    top: ARTWORK_TOP,
    width: ARTWORK_SIZE,
    height: ARTWORK_SIZE,
  },
});
