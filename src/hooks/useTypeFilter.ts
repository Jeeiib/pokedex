import { useCallback, useEffect, useState } from "react";

import { POKEMON_TYPES } from "@/constants/pokemonTypes";
import { getPokemonIdsByType } from "@/services/pokemonService";
import type { PokemonTypeOption } from "@/types/pokemon";

// La liste des types est locale : ce sont les 18 de la maquette, et leur nom
// affiché vient des traductions, pas de l'api.
const TYPES: PokemonTypeOption[] = Object.keys(POKEMON_TYPES).map((slug) => ({ slug }));

// Types disponibles et identifiants du type sélectionné. ids vaut null quand
// aucun filtre n'est actif, ce que filterByIds interprète comme tout garder.
export function useTypeFilter() {
  const [selected, setSelected] = useState<string | null>(null);
  const [ids, setIds] = useState<number[] | null>(null);

  useEffect(() => {
    if (selected === null) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- même motif que usePokemonIndex : pas de requête à annuler ici, la garde plus bas suffit pour le reste.
      setIds(null);
      return;
    }
    // Même garde : passer vite d'un type à l'autre ne doit pas laisser la
    // réponse la plus lente décider du filtre affiché.
    let ignore = false;
    getPokemonIdsByType(selected)
      .then((result) => {
        if (!ignore) {
          setIds(result);
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

  const select = useCallback((slug: string | null) => {
    setSelected(slug);
  }, []);

  return { types: TYPES, selected, ids, select };
}
