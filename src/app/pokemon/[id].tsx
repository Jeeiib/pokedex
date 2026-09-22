import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useRef, useState } from "react";
import {
  FlatList,
  StyleSheet,
  useWindowDimensions,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from "react-native";

import PokemonPage from "@/components/PokemonPage";
import { FIRST_SPECIES, LAST_SPECIES } from "@/constants/pokedex";
import { parsePokemonId } from "@/utils/parsePokemonId";

// Les espèces sont posées côte à côte dans une liste horizontale paginée : on
// passe d'une fiche à l'autre au doigt, et l'écran glisse dans le sens du
// geste. Seules trois pages sont montées à la fois.
const IDS = Array.from(
  { length: LAST_SPECIES - FIRST_SPECIES + 1 },
  (_, index) => FIRST_SPECIES + index
);

function goBack() {
  if (router.canGoBack()) {
    router.back();
    return;
  }
  router.replace("/");
}

export default function PokemonDetail() {
  const { id: rawId } = useLocalSearchParams<{ id: string }>();
  const requestedId = parsePokemonId(rawId);
  const { width } = useWindowDimensions();
  const listRef = useRef<FlatList<number>>(null);
  const [currentId, setCurrentId] = useState(requestedId ?? FIRST_SPECIES);

  // L'adresse suit la fiche affichée : revenir en arrière, puis rouvrir la
  // liste, doit retrouver le Pokémon qu'on regardait.
  const show = useCallback((id: number) => {
    setCurrentId(id);
    router.setParams({ id: String(id) });
  }, []);

  const onMomentumScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const index = Math.round(event.nativeEvent.contentOffset.x / width);
      const id = IDS[index];
      if (id !== undefined) {
        show(id);
      }
    },
    [width, show]
  );

  // Les flèches restent la seule façon de changer de fiche au lecteur d'écran,
  // qui ne peut pas balayer : elles déclenchent le même défilement.
  const goToNeighbour = useCallback(
    (step: number) => {
      const target = currentId + step;
      if (target < FIRST_SPECIES || target > LAST_SPECIES) {
        return;
      }
      listRef.current?.scrollToIndex({ index: target - FIRST_SPECIES, animated: true });
      show(target);
    },
    [currentId, show]
  );

  const renderItem = useCallback(
    ({ item }: { item: number }) => (
      <PokemonPage
        id={item}
        active={item === currentId}
        canGoPrevious={item > FIRST_SPECIES}
        canGoNext={item < LAST_SPECIES}
        onNavigate={goToNeighbour}
        onBack={goBack}
      />
    ),
    [currentId, goToNeighbour]
  );

  // Un numéro absent de la Pokédex n'a pas de place dans la liste : la fiche
  // seule affiche alors son erreur.
  if (requestedId === null) {
    return (
      <PokemonPage
        id={null}
        active
        canGoPrevious={false}
        canGoNext={false}
        onNavigate={() => {}}
        onBack={goBack}
      />
    );
  }

  return (
    <FlatList
      ref={listRef}
      style={styles.pager}
      data={IDS}
      extraData={currentId}
      renderItem={renderItem}
      keyExtractor={(item) => String(item)}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      initialScrollIndex={requestedId - FIRST_SPECIES}
      getItemLayout={(_, index) => ({ length: width, offset: width * index, index })}
      initialNumToRender={1}
      maxToRenderPerBatch={1}
      windowSize={3}
      onMomentumScrollEnd={onMomentumScrollEnd}
    />
  );
}

const styles = StyleSheet.create({
  pager: {
    flex: 1,
  },
});
