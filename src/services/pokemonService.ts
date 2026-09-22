import type {
  Pokemon,
  PokemonSpecies,
  PokemonSummary,
  PokemonTypeOption,
} from "@/types/pokemon";

import { apiFetch, graphqlFetch } from "./api";

// Les 1025 espèces numérotées du Pokédex. L'endpoint /pokemon en renvoie
// environ 1302, dont des formes alternatives sans numéro propre.
const SPECIES_COUNT = 1025;

const LANGUAGE_IDS: Record<string, number> = { fr: 5, en: 9 };

const ARTWORK_BASE =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork";

type NamedApiResource = { name: string; url: string };

function idFromUrl(url: string): number {
  const segments = url.split("/").filter(Boolean);
  return Number(segments[segments.length - 1]);
}

function languageId(language: string): number {
  return LANGUAGE_IDS[language.split("-")[0]] ?? LANGUAGE_IDS.fr;
}

// Index de référence de la liste : identifiant et slug anglais.
export async function getPokemonIndex(): Promise<PokemonSummary[]> {
  const payload = await apiFetch<{ results: NamedApiResource[] }>(
    `/pokemon-species?limit=${SPECIES_COUNT}`
  );
  return payload.results.map((entry) => {
    const id = idFromUrl(entry.url);
    return { id, slug: entry.name, name: entry.name };
  });
}

// Noms traduits des 1025 espèces, en une requête.
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

// Détail d'un Pokémon : types, mesures, talents, statistiques, cri.
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
    // L'ordre du tableau n'est pas garanti, le slot fait foi : le type
    // dominant donne la couleur de fond de la fiche.
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

// Espèce : nom traduit, catégorie et description dans la langue demandée.
export async function getPokemonSpecies(id: number, language: string): Promise<PokemonSpecies> {
  const code = language.split("-")[0];
  const payload = await apiFetch<{
    id: number;
    names: { name: string; language: NamedApiResource }[];
    genera: { genus: string; language: NamedApiResource }[];
    flavor_text_entries: { flavor_text: string; language: NamedApiResource }[];
  }>(`/pokemon-species/${id}`);

  const pick = <T extends { language: NamedApiResource }>(entries: T[]) =>
    entries.find((entry) => entry.language.name === code) ?? entries[0];

  return {
    id: payload.id,
    name: pick(payload.names)?.name ?? "",
    genus: pick(payload.genera)?.genus ?? "",
    description: pick(payload.flavor_text_entries)?.flavor_text ?? "",
  };
}

// Les 18 types de la maquette, avec leur nom traduit.
export async function getTypes(language: string): Promise<PokemonTypeOption[]> {
  const code = language.split("-")[0];
  const list = await apiFetch<{ results: NamedApiResource[] }>("/type");
  const details = await Promise.all(
    list.results.map((entry) =>
      apiFetch<{ name: string; names: { name: string; language: NamedApiResource }[] }>(
        `/type/${entry.name}`
      )
    )
  );
  return details.map((detail) => ({
    slug: detail.name,
    name:
      detail.names.find((entry) => entry.language.name === code)?.name ?? detail.name,
  }));
}

// Identifiants des Pokémon d'un type, bornés aux espèces numérotées.
export async function getPokemonIdsByType(slug: string): Promise<number[]> {
  const payload = await apiFetch<{ pokemon: { pokemon: NamedApiResource }[] }>(`/type/${slug}`);
  return payload.pokemon
    .map((entry) => idFromUrl(entry.pokemon.url))
    .filter((id) => id <= SPECIES_COUNT);
}

// Adresse du visuel officiel. Elle est déterministe, la lire dans la réponse
// de détail coûterait une requête par espèce.
export function getArtworkUrl(id: number): string {
  return `${ARTWORK_BASE}/${id}.png`;
}
