import { Link } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import { elevation, spacing, typography } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeProvider";
import { useA11yLanguage } from "@/i18n";
import { getArtworkUrl } from "@/services/pokemonService";
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

  return (
    <Link href={`/pokemon/${id}`} asChild>
      <Pressable
        style={styles.pressable}
        accessibilityRole="link"
        accessibilityLabel={`${name}, ${formatPokemonId(id)}`}
        accessibilityLanguage={a11yLanguage}
      >
        <View style={[styles.card, elevation.low, { backgroundColor: theme.surface }]}>
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
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  pressable: {
    flex: 1,
  },
  card: {
    height: CARD_HEIGHT,
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
