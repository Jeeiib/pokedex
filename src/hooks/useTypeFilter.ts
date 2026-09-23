// Filtre par type : jusqu'à deux types sélectionnables parmi les 18 de la
// maquette, noms traduits localement.

import { useCallback, useEffect, useState } from "react";
import { POKEMON_TYPES } from "@/constants/pokemonTypes";
import { getPokemonIdsByType } from "@/services/pokemonService";
import type { PokemonTypeOption } from "@/types/pokemon";
import { intersectIds } from "@/utils/pokemonList";

const TYPES: PokemonTypeOption[] = Object.keys(POKEMON_TYPES).map((slug) => ({ slug }));

export const MAX_TYPES = 2;

// Croise les identifiants renvoyés pour chaque type sélectionné et ignore les
// réponses d'une sélection périmée.
export function useTypeFilter() {
  const [selected, setSelected] = useState<string[]>([]);
  const [ids, setIds] = useState<number[] | null>(null);

  useEffect(() => {
    if (selected.length === 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- même motif que usePokemonIndex : pas de requête à annuler ici, la garde plus bas suffit pour le reste.
      setIds(null);
      return;
    }
    let ignore = false;
    Promise.all(selected.map((slug) => getPokemonIdsByType(slug)))
      .then((results) => {
        if (!ignore) {
          setIds(intersectIds(results));
        }
      })
      .catch(() => {
        if (!ignore) {
          setIds([]);
        }
      });
    return () => {
      ignore = true;
    };
  }, [selected]);

  const toggle = useCallback((slug: string) => {
    setSelected((current) => {
      if (current.includes(slug)) {
        return current.filter((entry) => entry !== slug);
      }
      if (current.length >= MAX_TYPES) {
        return current;
      }
      return [...current, slug];
    });
  }, []);

  const clear = useCallback(() => {
    setSelected([]);
  }, []);

  return { types: TYPES, selected, ids, toggle, clear, atLimit: selected.length >= MAX_TYPES };
}
