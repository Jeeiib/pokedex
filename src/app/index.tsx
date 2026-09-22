import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { AccessibilityInfo, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { useAnimatedScrollHandler, useSharedValue } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import ErrorMessage from "@/components/ErrorMessage";
import LanguageToggle from "@/components/LanguageToggle";
import Loader from "@/components/Loader";
import PokedexHeader from "@/components/PokedexHeader";
import PokemonCard from "@/components/PokemonCard";
import SearchBar from "@/components/SearchBar";
import SortMenu from "@/components/SortMenu";
import ThemeToggle from "@/components/ThemeToggle";
import TypeFilterModal from "@/components/TypeFilterModal";
import { spacing, typography } from "@/constants/theme";
import { useBoot } from "@/contexts/BootProvider";
import { useFavorites } from "@/contexts/FavoritesProvider";
import { useTheme } from "@/contexts/ThemeProvider";
import { usePokemonIndex } from "@/hooks/usePokemonIndex";
import { useTypeFilter } from "@/hooks/useTypeFilter";
import { useA11yLanguage } from "@/i18n";
import type { SortMode } from "@/types/pokemon";
import { filterByIds, searchPokemons, sortPokemons } from "@/utils/pokemonList";

// Mesures du fichier Figma : la surface blanche est posée à 4 des bords, son
// contenu à 12 de plus, ce qui place les cartes à 16 du bord de l'écran.
const SURFACE_INSET = 4;
const LIST_PADDING = 12;
const COLUMNS = 3;
const CIRCLE_SIZE = 32;
const ICON_FAVORITES = 16;

export default function Index() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const a11yLanguage = useA11yLanguage();
  const { data, loading, error, reload } = usePokemonIndex();
  const { types, selected, ids, select } = useTypeFilter();
  const { favorites } = useFavorites();
  const { markDataReady } = useBoot();

  const scrollY = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const [query, setQuery] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("number");
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  // Le filtre favoris prend le pas sur le filtre par type : les deux ne
  // sont pas censés s'intersecter dans l'interface.
  const visible = useMemo(() => {
    const scoped = favoritesOnly ? filterByIds(data, favorites) : filterByIds(data, ids);
    return sortPokemons(searchPokemons(scoped, query), sortMode);
  }, [data, favorites, favoritesOnly, ids, query, sortMode]);

  // Le nombre de résultats ne se lit que dans la liste elle-même : il doit
  // être annoncé aux lecteurs d'écran.
  useEffect(() => {
    if (query.trim() === "") {
      return;
    }
    AccessibilityInfo.announceForAccessibility(t("list.results", { count: visible.length }));
  }, [query, visible.length, t]);

  // L'ouverture attend les données, ou la première erreur : rien ne doit rester
  // coincé derrière l'écran de démarrage.
  useEffect(() => {
    if (!loading) {
      markDataReady();
    }
  }, [loading, markDataReady]);

  return (
    <View style={[styles.screen, { backgroundColor: theme.primary }]}>
      <SafeAreaView edges={["top"]}>
        <PokedexHeader
          scrollY={scrollY}
          actions={
            <>
              <LanguageToggle />
              <ThemeToggle />
            </>
          }
        >
          <View style={styles.controls}>
            <SearchBar value={query} onChangeText={setQuery} />
            <TypeFilterModal types={types} selected={selected} onSelect={select} />
            <Pressable
              style={[styles.circle, { backgroundColor: theme.surface }]}
              onPress={() => setFavoritesOnly((current) => !current)}
              accessibilityRole="button"
              accessibilityState={{ selected: favoritesOnly }}
              accessibilityLabel={t("list.favoritesOnly")}
              accessibilityLanguage={a11yLanguage}
            >
              <MaterialIcons
                name={favoritesOnly ? "favorite" : "favorite-border"}
                size={ICON_FAVORITES}
                color={theme.primaryText}
              />
            </Pressable>
            <SortMenu mode={sortMode} onChange={setSortMode} />
          </View>
        </PokedexHeader>
      </SafeAreaView>

      <View style={[styles.surface, { backgroundColor: theme.surface }]}>
        {loading ? <Loader /> : null}

        {!loading && error ? <ErrorMessage message={t("state.error")} onRetry={reload} /> : null}

        {!loading && !error ? (
          <Animated.FlatList
            data={visible}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <PokemonCard id={item.id} name={item.name} />}
            numColumns={COLUMNS}
            columnWrapperStyle={styles.column}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            onScroll={onScroll}
            scrollEventThrottle={16}
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
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
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
