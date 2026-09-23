// Carte de la liste qui montre l'artwork et le nom d'un Pokémon, avec lien vers
// sa fiche.

import { Link } from "expo-router";
import { useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { ReduceMotion, useAnimatedStyle, withTiming } from "react-native-reanimated";

import { MOTION } from "@/constants/motion";
import { elevation, spacing, typography } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeProvider";
import { useA11yLanguage } from "@/i18n";
import { getArtworkUrl } from "@/utils/artworkUrl";
import { formatPokemonId } from "@/utils/formatPokemonId";

const CARD_HEIGHT = 148;
const ARTWORK_SIZE = 88;

type PokemonCardProps = {
  id: number;
  name: string;
};

// Anime un léger tassement au toucher et ouvre la fiche du Pokémon au
// relâchement.
export default function PokemonCard({ id, name }: PokemonCardProps) {
  const { theme } = useTheme();
  const a11yLanguage = useA11yLanguage();
  const [pressed, setPressed] = useState(false);

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
            <Image
              source={{ uri: getArtworkUrl(id) }}
              style={styles.artwork}
              resizeMode="contain"
              accessible={false}
              importantForAccessibility="no"
            />

            <View style={styles.identity}>
              <Text
                style={[styles.name, { color: theme.textPrimary }]}
                numberOfLines={1}
                accessibilityElementsHidden
                importantForAccessibility="no-hide-descendants"
              >
                {name}
              </Text>
              <Text
                style={[styles.number, { color: theme.textSecondary }]}
                accessibilityElementsHidden
                importantForAccessibility="no-hide-descendants"
              >
                {formatPokemonId(id)}
              </Text>
            </View>
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
  surface: {
    flex: 1,
    borderRadius: 12,
  },
  card: {
    flex: 1,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    overflow: "hidden",
  },
  artwork: {
    width: ARTWORK_SIZE,
    height: ARTWORK_SIZE,
  },
  identity: {
    alignItems: "center",
  },
  name: {
    ...typography.cardName,
    textAlign: "center",
    textTransform: "capitalize",
  },
  number: {
    ...typography.cardNumber,
  },
});
