import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { getAbilityNames, getPokemonById, getPokemonSpecies } from "@/services/pokemonService";
import type { Pokemon, PokemonSpecies } from "@/types/pokemon";
import { cleanFlavorText } from "@/utils/cleanFlavorText";

// Détail et espèce d'un Pokémon. Un identifiant nul ne déclenche aucun appel.
export function usePokemonDetail(id: number | null) {
  const { i18n } = useTranslation();
  const language = i18n.language;

  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [species, setSpecies] = useState<PokemonSpecies | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [attempt, setAttempt] = useState(0);

  const reload = useCallback(() => {
    setAttempt((current) => current + 1);
  }, []);

  useEffect(() => {
    // Garde contre les réponses obsolètes : changer de langue ou recharger
    // pendant une requête en vol laisse la précédente arriver, et sans ce
    // drapeau elle écraserait les données les plus récentes.
    let ignore = false;

    async function run() {
      if (id === null) {
        setPokemon(null);
        setSpecies(null);
        setError("notFound");
        setLoading(false);
        return;
      }
      setError(null);
      try {
        const [detail, speciesDetail] = await Promise.all([
          getPokemonById(id),
          getPokemonSpecies(id, language),
        ]);
        // Les talents se traduisent en une requête chacun : un échec laisse
        // leur nom anglais plutôt que de priver la fiche de ses données.
        const abilityNames = await getAbilityNames(detail.abilities, language).catch(
          () => new Map<string, string>()
        );
        if (!ignore) {
          setPokemon({
            ...detail,
            abilities: detail.abilities.map((slug) => abilityNames.get(slug) ?? slug),
          });
          setSpecies({
            ...speciesDetail,
            description: cleanFlavorText(speciesDetail.description),
          });
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
  }, [id, language, attempt]);

  return { pokemon, species, loading, error, reload };
}
