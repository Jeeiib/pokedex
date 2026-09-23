import { useCallback, useEffect, useState } from "react";

import { POKEMON_TYPES } from "@/constants/pokemonTypes";
import { getPokemonIdsByType } from "@/services/pokemonService";
import type { PokemonTypeOption } from "@/types/pokemon";
import { intersectIds } from "@/utils/pokemonList";

// La liste des types est locale : ce sont les 18 de la maquette, et leur nom
// affiché vient des traductions, pas de l'api.
const TYPES: PokemonTypeOption[] = Object.keys(POKEMON_TYPES).map((slug) => ({ slug }));

export const MAX_TYPES = 2;

export function useTypeFilter() {
  const [selected, setSelected] = useState<string[]>([]);
  const [ids, setIds] = useState<number[] | null>(null);

  useEffect(() => {
    if (selected.length === 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- même motif que usePokemonIndex : pas de requête à annuler ici, la garde plus bas suffit pour le reste.
      setIds(null);
      return;
    }
    // Passer vite d'une sélection à l'autre ne doit pas laisser la réponse la
    // plus lente décider du filtre affiché.
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
      // Référence inchangée : React ignore la mise à jour, pas de requête
      // pour un type qui ne sera pas retenu.
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
