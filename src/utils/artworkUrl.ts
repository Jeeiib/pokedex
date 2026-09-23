// Adresse du visuel officiel d'un Pokémon, dérivée de son identifiant.

const ARTWORK_BASE =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork";

// Construit l'adresse du visuel officiel, déterministe à partir de
// l'identifiant, ce qui évite une requête de détail par espèce.
export function getArtworkUrl(id: number): string {
  return `${ARTWORK_BASE}/${id}.png`;
}
