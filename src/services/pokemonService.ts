// Appelle PokeAPI et met en forme ses réponses dans les types du domaine.

import { LAST_SPECIES } from "@/constants/pokedex";
import type { Pokemon, PokemonSpecies, PokemonSummary } from "@/types/pokemon";

import { apiFetch, graphqlFetch } from "./api";

const LANGUAGE_IDS: Record<string, number> = { fr: 5, en: 9 };

type NamedApiResource = { name: string; url: string };

// Extrait l'identifiant numérique porté par l'URL d'une ressource PokeAPI, par
// exemple `.../pokemon/25/`.
function idFromUrl(url: string): number {
  const segments = url.split("/").filter(Boolean);
  return Number(segments[segments.length - 1]);
}

// Convertit un code de langue façon fr-FR en identifiant numérique attendu par
// l'API GraphQL, avec repli sur le français.
function languageId(language: string): number {
  return LANGUAGE_IDS[language.split("-")[0]] ?? LANGUAGE_IDS.fr;
}

// Récupère la liste complète des espèces, sans les noms traduits.
export async function getPokemonIndex(): Promise<PokemonSummary[]> {
  const payload = await apiFetch<{ results: NamedApiResource[] }>(
    `/pokemon-species?limit=${LAST_SPECIES}`
  );
  return payload.results.map((entry) => {
    const id = idFromUrl(entry.url);
    return { id, slug: entry.name, name: entry.name };
  });
}

// Récupère les noms traduits des 1025 espèces en une seule requête GraphQL.
export async function getNames(language: string): Promise<Map<number, string>> {
  const query = `{
    pokemonspeciesname(where: { language_id: { _eq: ${languageId(language)} } }) {
      name
      pokemon_species_id
    }
  }`;
  const payload = await graphqlFetch<{
    pokemonspeciesname: { name: string; pokemon_species_id: number }[];
  }>(query);
  return new Map(payload.pokemonspeciesname.map((row) => [row.pokemon_species_id, row.name]));
}

// Récupère le détail d'un Pokémon et trie ses types par slot plutôt que par
// l'ordre du tableau, qui n'est pas garanti : le type dominant donne la couleur
// de fond de la fiche.
export async function getPokemonById(id: number): Promise<Pokemon> {
  const payload = await apiFetch<{
    id: number;
    name: string;
    weight: number;
    height: number;
    types: { slot: number; type: NamedApiResource }[];
    abilities: { ability: NamedApiResource }[];
    stats: { base_stat: number; stat: NamedApiResource }[];
    cries?: { latest?: string };
  }>(`/pokemon/${id}`);

  return {
    id: payload.id,
    slug: payload.name,
    types: [...payload.types].sort((a, b) => a.slot - b.slot).map((entry) => entry.type.name),
    weightHg: payload.weight,
    heightDm: payload.height,
    abilities: payload.abilities.map((entry) => entry.ability.name),
    stats: payload.stats.map((entry) => ({
      slug: entry.stat.name,
      value: entry.base_stat,
    })),
    cryUrl: payload.cries?.latest ?? null,
  };
}

// Récupère le nom et la description d'une espèce, en repliant sur l'anglais
// plutôt que sur la première langue du tableau, où PokeAPI place le japonais en
// tête.
export async function getPokemonSpecies(id: number, language: string): Promise<PokemonSpecies> {
  const code = language.split("-")[0];
  const payload = await apiFetch<{
    id: number;
    names: { name: string; language: NamedApiResource }[];
    flavor_text_entries: { flavor_text: string; language: NamedApiResource }[];
  }>(`/pokemon-species/${id}`);

  const pick = <T extends { language: NamedApiResource }>(entries: T[]) =>
    entries.find((entry) => entry.language.name === code) ??
    entries.find((entry) => entry.language.name === "en") ??
    entries[0];

  return {
    id: payload.id,
    name: pick(payload.names)?.name ?? "",
    description: pick(payload.flavor_text_entries)?.flavor_text ?? "",
  };
}

// Récupère les noms traduits des talents, absents de la fiche Pokémon et
// disponibles uniquement via une requête par talent sur /ability.
export async function getAbilityNames(
  slugs: string[],
  language: string
): Promise<Map<string, string>> {
  const code = language.split("-")[0];
  const details = await Promise.all(
    slugs.map((slug) =>
      apiFetch<{ name: string; names: { name: string; language: NamedApiResource }[] }>(
        `/ability/${slug}`
      )
    )
  );
  return new Map(
    details.map((detail) => [
      detail.name,
      detail.names.find((entry) => entry.language.name === code)?.name ?? detail.name,
    ])
  );
}

// Récupère les identifiants des Pokémon d'un type donné, en écartant les
// espèces hors numérotation.
export async function getPokemonIdsByType(slug: string): Promise<number[]> {
  const payload = await apiFetch<{ pokemon: { pokemon: NamedApiResource }[] }>(`/type/${slug}`);
  return payload.pokemon
    .map((entry) => idFromUrl(entry.pokemon.url))
    .filter((id) => id <= LAST_SPECIES);
}
