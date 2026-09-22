import { StyleSheet, Text, View } from "react-native";

import { getTypeColors } from "@/constants/pokemonTypes";
import { spacing, typography } from "@/constants/theme";
import { useA11yLanguage } from "@/i18n";

type TypeBadgeProps = {
  slug: string;
  label: string;
};

export default function TypeBadge({ slug, label }: TypeBadgeProps) {
  const colors = getTypeColors(slug);
  const a11yLanguage = useA11yLanguage();

  return (
    <View style={[styles.badge, { backgroundColor: colors.background }]}>
      <Text
        style={[styles.label, { color: colors.foreground }]}
        accessibilityLanguage={a11yLanguage}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 10,
    paddingVertical: 2,
    paddingHorizontal: spacing.sm,
  },
  label: {
    ...typography.subtitle3,
    textTransform: "capitalize",
  },
});
