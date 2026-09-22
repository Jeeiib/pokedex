export type PokemonSummary = {
  id: number;
  slug: string;
  name: string;
};

export type PokemonStat = {
  slug: string;
  value: number;
};

export type Pokemon = {
  id: number;
  slug: string;
  types: string[];
  weightHg: number;
  heightDm: number;
  abilities: string[];
  stats: PokemonStat[];
  cryUrl: string | null;
};

export type PokemonSpecies = {
  id: number;
  name: string;
  description: string;
};

export type PokemonTypeOption = {
  slug: string;
};

export type SortMode = "number" | "name";
