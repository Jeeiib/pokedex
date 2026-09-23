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
  const [attempt, setAttempt] = useState(0);

  const reload = useCallback(() => {
    setAttempt((current) => current + 1);
  }, []);

  useEffect(() => {
    // Un changement de langue pendant une requête en vol laisse la précédente
    // arriver : sans ce drapeau, elle écraserait les données les plus récentes.
    let ignore = false;

    async function run() {
      setError(null);
      try {
        const index = await getPokemonIndex();
        // Seule dégradation silencieuse de l'application : si la table de noms
        // tombe, la liste s'affiche avec les slugs plutôt que de bloquer.
        const names = await getNames(language).catch(() => new Map<number, string>());
        if (!ignore) {
          setData(mergeNames(index, names));
        }
      } catch (cause) {
        if (!ignore) {
          setError(cause instanceof Error ? cause.message : String(cause));
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    run();

    return () => {
      ignore = true;
    };
  }, [language, attempt]);

  return { data, loading, error, reload };
}
