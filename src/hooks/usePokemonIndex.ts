import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { getNames, getPokemonIndex } from "@/services/pokemonService";
import type { PokemonSummary } from "@/types/pokemon";
import { mergeNames } from "@/utils/pokemonList";

// Index des 1025 espèces, noms dans la langue active. Recharge au changement
// de langue.
export function usePokemonIndex() {
  const { i18n } = useTranslation();
  const language = i18n.language;

  const [data, setData] = useState<PokemonSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const index = await getPokemonIndex();
      // Seule dégradation silencieuse de l'application : si la table de noms
      // tombe, la liste s'affiche avec les slugs plutôt que de bloquer.
      const names = await getNames(language).catch(() => new Map<number, string>());
      setData(mergeNames(index, names));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause));
    } finally {
      setLoading(false);
    }
  }, [language]);

  useEffect(() => {
    // Chargement initial du hook de données, rechargement exposé via `reload` :
    // le schéma de fetch en effet documenté par React, que la règle signale
    // par principe quel que soit le cas d'usage.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  return { data, loading, error, reload: load };
}
