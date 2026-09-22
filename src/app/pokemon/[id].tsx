import { Link, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { spacing, typography } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeProvider";
import { useA11yLanguage } from "@/i18n";
import { formatPokemonId } from "@/utils/formatPokemonId";

// Écran provisoire : la tâche 12 le remplace par la fiche complète. Il vérifie
// dès à présent que le paramètre de route arrive bien.
export default function PokemonDetail() {
  const { id: rawId } = useLocalSearchParams<{ id: string }>();
  const id = Number(rawId);
  const { t } = useTranslation();
  const { theme } = useTheme();
  const a11yLanguage = useA11yLanguage();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        <Text
          style={[styles.value, { color: theme.textPrimary }]}
          accessibilityLanguage={a11yLanguage}
        >
          {Number.isInteger(id) ? formatPokemonId(id) : t("state.notFound")}
        </Text>
        <Link href="/" style={[styles.back, { color: theme.primaryText }]}>
          {t("detail.back")}
        </Link>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.md,
  },
  value: {
    ...typography.headline,
  },
  back: {
    ...typography.subtitle1,
  },
});
