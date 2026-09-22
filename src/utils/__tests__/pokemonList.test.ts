import type { PokemonSummary } from "@/types/pokemon";
import {
  filterByIds,
  intersectIds,
  mergeNames,
  normalizeSearch,
  searchPokemons,
  sortPokemons,
} from "@/utils/pokemonList";

const index: PokemonSummary[] = [
  { id: 1, slug: "bulbasaur", name: "bulbasaur" },
  { id: 4, slug: "charmander", name: "charmander" },
  { id: 122, slug: "mr-mime", name: "mr-mime" },
  { id: 151, slug: "mew", name: "mew" },
];

describe("mergeNames", () => {
  it("replaces the slug with the translated name", () => {
    const names = new Map([
      [1, "Bulbizarre"],
      [4, "Salamèche"],
    ]);
    const merged = mergeNames(index, names);
    expect(merged[0].name).toBe("Bulbizarre");
    expect(merged[1].name).toBe("Salamèche");
  });

  // Une espèce absente de la table de noms doit garder son slug.
  it("keeps the slug when no translation exists", () => {
    const merged = mergeNames(index, new Map([[1, "Bulbizarre"]]));
    expect(merged[3].name).toBe("mew");
  });

  it("keeps the slug for every entry when the table is empty", () => {
    const merged = mergeNames(index, new Map());
    expect(merged.map((entry) => entry.name)).toEqual([
      "bulbasaur",
      "charmander",
      "mr-mime",
      "mew",
    ]);
  });

  it("never loses an entry", () => {
    expect(mergeNames(index, new Map())).toHaveLength(index.length);
  });
});

describe("normalizeSearch", () => {
  // La saisie est approximative : casse, espaces, accents.
  it("lowercases, trims and strips accents", () => {
    expect(normalizeSearch("  MEW ")).toBe("mew");
    expect(normalizeSearch("Salamèche")).toBe("salameche");
    expect(normalizeSearch("Pokémon")).toBe("pokemon");
  });
});

describe("searchPokemons", () => {
  const translated = mergeNames(index, new Map([[1, "Bulbizarre"]]));

  it("returns everything when the query is blank", () => {
    expect(searchPokemons(translated, "   ")).toHaveLength(4);
  });

  it("matches the translated name", () => {
    expect(searchPokemons(translated, "bulbi").map((entry) => entry.id)).toEqual([1]);
  });

  it("matches the english slug as well", () => {
    expect(searchPokemons(translated, "bulba").map((entry) => entry.id)).toEqual([1]);
  });

  it("ignores case and surrounding spaces", () => {
    expect(searchPokemons(translated, "  MEW ").map((entry) => entry.id)).toEqual([151]);
  });

  it("returns an empty list when nothing matches", () => {
    expect(searchPokemons(translated, "zzz")).toEqual([]);
  });
});

describe("sortPokemons", () => {
  const translated = mergeNames(index, new Map([[151, "Mew"]]));

  it("sorts by pokedex number", () => {
    expect(sortPokemons(translated, "number").map((entry) => entry.id)).toEqual([1, 4, 122, 151]);
  });

  it("sorts by displayed name", () => {
    expect(sortPokemons(translated, "name").map((entry) => entry.name)).toEqual([
      "bulbasaur",
      "charmander",
      "Mew",
      "mr-mime",
    ]);
  });

  it("does not mutate the input list", () => {
    const original = [...translated];
    sortPokemons(translated, "name");
    expect(translated).toEqual(original);
  });
});

describe("filterByIds", () => {
  it("returns the whole list when no filter is active", () => {
    expect(filterByIds(index, null)).toHaveLength(4);
  });

  it("keeps only the requested ids", () => {
    expect(filterByIds(index, [4, 151]).map((entry) => entry.id)).toEqual([4, 151]);
  });

  it("returns an empty list when the filter matches nothing", () => {
    expect(filterByIds(index, [9999])).toEqual([]);
  });
});

describe("intersectIds", () => {
  it("returns an empty list when there is no list to combine", () => {
    expect(intersectIds([])).toEqual([]);
  });

  it("returns the list as-is when there is only one", () => {
    expect(intersectIds([[4, 5, 6]])).toEqual([4, 5, 6]);
  });

  it("keeps only the ids present in every list", () => {
    expect(intersectIds([[4, 5, 6, 146], [6, 16, 17, 146]])).toEqual([6, 146]);
  });

  it("returns an empty list when the lists are disjoint", () => {
    expect(intersectIds([[1, 2], [3, 4]])).toEqual([]);
  });

  it("deduplicates ids repeated within a list", () => {
    expect(intersectIds([[1, 1, 2, 3], [1, 2]])).toEqual([1, 2]);
  });
});
