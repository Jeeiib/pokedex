// Bouton en cœur qui bascule le statut favori d'un Pokémon et l'annonce au
// lecteur d'écran.

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { AccessibilityInfo, Pressable } from "react-native";
import Animated, {
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { MOTION } from "@/constants/motion";
import { iconSize, touchArea } from "@/constants/theme";
import { useFavorites } from "@/contexts/FavoritesProvider";
import { useA11yLanguage } from "@/i18n";

type FavoriteButtonProps = {
  id: number;
  name: string;
  color: string;
};

// Fait rebondir l'icône seulement quand le statut favori change réellement,
// jamais lors du premier montage.
export default function FavoriteButton({ id, name, color }: FavoriteButtonProps) {
  const { t } = useTranslation();
  const { isFavorite, toggle } = useFavorites();
  const a11yLanguage = useA11yLanguage();
  const active = isFavorite(id);
  const scale = useSharedValue(1);
  const mounted = useRef(false);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    scale.value = withSequence(
      withTiming(MOTION.favorite.scale, {
        duration: MOTION.favorite.duration / 2,
        reduceMotion: ReduceMotion.System,
      }),
      withSpring(1, { ...MOTION.spring, reduceMotion: ReduceMotion.System })
    );
  }, [active, scale]);

  const popStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  function press() {
    toggle(id);
    AccessibilityInfo.announceForAccessibility(
      active ? t("favorites.announceRemoved", { name }) : t("favorites.announceAdded", { name })
    );
  }

  return (
    <Pressable
      style={touchArea}
      onPress={press}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      accessibilityLabel={active ? t("favorites.remove", { name }) : t("favorites.add", { name })}
      accessibilityLanguage={a11yLanguage}
    >
      <Animated.View style={popStyle}>
        <MaterialIcons
          name={active ? "favorite" : "favorite-border"}
          size={iconSize.lg}
          color={color}
        />
      </Animated.View>
    </Pressable>
  );
}
