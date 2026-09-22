import { useTranslation } from "react-i18next";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import ErrorMessage from "@/components/ErrorMessage";
import Loader from "@/components/Loader";
import PokedexHeader from "@/components/PokedexHeader";
import PokemonCard from "@/components/PokemonCard";
import { spacing, typography } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeProvider";
import { usePokemonIndex } from "@/hooks/usePokemonIndex";

// Mesures du fichier Figma : la surface blanche est posée à 4 des bords, son
// contenu à 12 de plus, ce qui place les cartes à 16 du bord de l'écran.
const SURFACE_INSET = 4;
const LIST_PADDING = 12;
const COLUMNS = 3;

export default function Index() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { data, loading, error, reload } = usePokemonIndex();

  return (
    <View style={[styles.screen, { backgroundColor: theme.primary }]}>
      <SafeAreaView edges={["top"]}>
        <PokedexHeader />
      </SafeAreaView>

      <View style={[styles.surface, { backgroundColor: theme.surface }]}>
        {loading ? <Loader /> : null}

        {!loading && error ? <ErrorMessage message={t("state.error")} onRetry={reload} /> : null}

        {!loading && !error ? (
          <FlatList
            data={data}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <PokemonCard id={item.id} name={item.name} />}
            numColumns={COLUMNS}
            columnWrapperStyle={styles.column}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            ListEmptyComponent={
              <Text style={[styles.empty, { color: theme.textSecondary }]}>{t("list.empty")}</Text>
            }
          />
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  surface: {
    flex: 1,
    margin: SURFACE_INSET,
    borderRadius: 8,
    paddingHorizontal: LIST_PADDING,
  },
  list: {
    gap: spacing.sm,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },
  column: {
    gap: spacing.sm,
  },
  empty: {
    ...typography.body1,
    textAlign: "center",
    paddingTop: spacing.xl,
  },
});
