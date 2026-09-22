const ARTWORK_BASE =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork";

// Adresse du visuel officiel. Elle est déterministe, la lire dans la réponse
// de détail coûterait une requête par espèce.
export function getArtworkUrl(id: number): string {
  return `${ARTWORK_BASE}/${id}.png`;
}
