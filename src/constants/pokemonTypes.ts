export const POKEMON_TYPES = {
  bug: { background: "#A7B723", foreground: "#1D1D1D" },
  dark: { background: "#75574C", foreground: "#FFFFFF" },
  dragon: { background: "#7037FF", foreground: "#FFFFFF" },
  electric: { background: "#F9CF30", foreground: "#1D1D1D" },
  fairy: { background: "#E69EAC", foreground: "#1D1D1D" },
  fighting: { background: "#C12239", foreground: "#FFFFFF" },
  fire: { background: "#F57D31", foreground: "#1D1D1D" },
  flying: { background: "#A891EC", foreground: "#1D1D1D" },
  ghost: { background: "#70559B", foreground: "#FFFFFF" },
  grass: { background: "#74CB48", foreground: "#1D1D1D" },
  ground: { background: "#DEC16B", foreground: "#1D1D1D" },
  ice: { background: "#9AD6DF", foreground: "#1D1D1D" },
  normal: { background: "#AAA67F", foreground: "#1D1D1D" },
  poison: { background: "#A43E9E", foreground: "#FFFFFF" },
  psychic: { background: "#FB5584", foreground: "#1D1D1D" },
  rock: { background: "#B69E31", foreground: "#1D1D1D" },
  steel: { background: "#B7B9D0", foreground: "#1D1D1D" },
  water: { background: "#6493EB", foreground: "#1D1D1D" },
} as const;

export type PokemonTypeSlug = keyof typeof POKEMON_TYPES;

export type TypeColors = {
  background: string;
  foreground: string;
};

export function getTypeColors(slug: string): TypeColors {
  return POKEMON_TYPES[slug as PokemonTypeSlug] ?? POKEMON_TYPES.normal;
}
