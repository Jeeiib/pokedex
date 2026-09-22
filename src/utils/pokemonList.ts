import type { PokemonSummary, SortMode } from "@/types/pokemon";

// Le nom traduit est un confort d'affichage : sans lui, le slug reste lisible.
export function mergeNames(
  index: PokemonSummary[],
  names: Map<number, string>
): PokemonSummary[] {
  return index.map((entry) => ({
    ...entry,
    name: names.get(entry.id) ?? entry.slug,
  }));
}

// La recherche doit tolérer la casse, les espaces et les accents.
export function normalizeSearch(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

export function searchPokemons(list: PokemonSummary[], query: string): PokemonSummary[] {
  const needle = normalizeSearch(query);
  if (needle === "") {
    return list;
  }
  return list.filter(
    (entry) =>
      normalizeSearch(entry.name).includes(needle) ||
      normalizeSearch(entry.slug).includes(needle)
  );
}

export function sortPokemons(list: PokemonSummary[], mode: SortMode): PokemonSummary[] {
  const sorted = [...list];
  if (mode === "name") {
    return sorted.sort((a, b) => a.name.localeCompare(b.name));
  }
  return sorted.sort((a, b) => a.id - b.id);
}

export function filterByIds(
  list: PokemonSummary[],
  ids: number[] | null
): PokemonSummary[] {
  if (ids === null) {
    return list;
  }
  const allowed = new Set(ids);
  return list.filter((entry) => allowed.has(entry.id));
}
