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
import { useFavorites } from "@/contexts/FavoritesProvider";
import { useA11yLanguage } from "@/i18n";

const ICON_SIZE = 24;

type FavoriteButtonProps = {
  id: number;
  name: string;
  color: string;
};

export default function FavoriteButton({ id, name, color }: FavoriteButtonProps) {
  const { t } = useTranslation();
  const { isFavorite, toggle } = useFavorites();
  const a11yLanguage = useA11yLanguage();
  const active = isFavorite(id);
  const scale = useSharedValue(1);
  const mounted = useRef(false);

  // Le rebond réagit à la bascule effective plutôt qu'à l'appui : la mutation
  // vit dans un effet, pas dans le gestionnaire, et ne joue pas au montage.
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
      onPress={press}
      hitSlop={12}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      accessibilityLabel={active ? t("favorites.remove", { name }) : t("favorites.add", { name })}
      accessibilityLanguage={a11yLanguage}
    >
      <Animated.View style={popStyle}>
        <MaterialIcons
          name={active ? "favorite" : "favorite-border"}
          size={ICON_SIZE}
          color={color}
        />
      </Animated.View>
    </Pressable>
  );
}
