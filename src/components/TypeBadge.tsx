import { StyleSheet, Text } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { MOTION } from "@/constants/motion";
import { getTypeColors } from "@/constants/pokemonTypes";
import { spacing, typography } from "@/constants/theme";
import { useA11yLanguage } from "@/i18n";

type TypeBadgeProps = {
  slug: string;
  label: string;
  // Rang de la puce dans la fiche, qui décale son entrée. Les puces ne vivent
  // pas dans une liste recyclée : une animation d'entrée y est sans danger.
  index?: number;
};

export default function TypeBadge({ slug, label, index = 0 }: TypeBadgeProps) {
  const colors = getTypeColors(slug);
  const a11yLanguage = useA11yLanguage();

  return (
    <Animated.View
      entering={FadeInDown.delay(index * MOTION.badge.stagger).duration(MOTION.badge.duration)}
      style={[styles.badge, { backgroundColor: colors.background }]}
    >
      <Text
        style={[styles.label, { color: colors.foreground }]}
        accessibilityLanguage={a11yLanguage}
      >
        {label}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 10,
    paddingVertical: 2,
    paddingHorizontal: spacing.sm,
  },
  label: {
    ...typography.chip,
    textTransform: "capitalize",
  },
});
