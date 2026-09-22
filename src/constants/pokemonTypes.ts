// Fonds relevés dans le Figma. La couleur de texte n'est pas celle de la
// maquette : le blanc y tombe à 1,50 sur Electric, donc chaque type porte
// le texte qui passe WCAG AA sur son propre fond.
export const POKEMON_TYPES = {
  bug: { background: "#A7B723", foreground: "#212121" },
  dark: { background: "#75574C", foreground: "#FFFFFF" },
  dragon: { background: "#7037FF", foreground: "#FFFFFF" },
  electric: { background: "#F9CF30", foreground: "#212121" },
  fairy: { background: "#E69EAC", foreground: "#212121" },
  fighting: { background: "#C12239", foreground: "#FFFFFF" },
  fire: { background: "#F57D31", foreground: "#212121" },
  flying: { background: "#A891EC", foreground: "#212121" },
  ghost: { background: "#70559B", foreground: "#FFFFFF" },
  grass: { background: "#74CB48", foreground: "#212121" },
  ground: { background: "#DEC16B", foreground: "#212121" },
  ice: { background: "#9AD6DF", foreground: "#212121" },
  normal: { background: "#AAA67F", foreground: "#212121" },
  poison: { background: "#A43E9E", foreground: "#FFFFFF" },
  psychic: { background: "#FB5584", foreground: "#212121" },
  rock: { background: "#B69E31", foreground: "#212121" },
  steel: { background: "#B7B9D0", foreground: "#212121" },
  water: { background: "#6493EB", foreground: "#212121" },
} as const;

export type PokemonTypeSlug = keyof typeof POKEMON_TYPES;

export type TypeColors = {
  background: string;
  foreground: string;
};

export function getTypeColors(slug: string): TypeColors {
  return POKEMON_TYPES[slug as PokemonTypeSlug] ?? POKEMON_TYPES.normal;
}
