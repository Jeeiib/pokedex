import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { POKEMON_TYPES } from "@/constants/pokemonTypes";
import { getPokemonIdsByType, getTypes } from "@/services/pokemonService";
import type { PokemonTypeOption } from "@/types/pokemon";

const ALLOWED = Object.keys(POKEMON_TYPES);

// Types disponibles et identifiants du type sélectionné. ids vaut null quand
// aucun filtre n'est actif, ce que filterByIds interprète comme tout garder.
export function useTypeFilter() {
  const { i18n } = useTranslation();
  const language = i18n.language;

  const [types, setTypes] = useState<PokemonTypeOption[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [ids, setIds] = useState<number[] | null>(null);

  useEffect(() => {
    let ignore = false;
    // Un échec ici prive du filtre mais ne casse pas la liste.
    getTypes(language, ALLOWED)
      .then((result) => {
        if (!ignore) {
          setTypes(result);
        }
      })
      .catch(() => {
        if (!ignore) {
          setTypes([]);
        }
      });
    return () => {
      ignore = true;
    };
  }, [language]);

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

  return { types, selected, ids, select };
}
