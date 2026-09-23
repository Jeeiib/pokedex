// Nettoyage des descriptions de Pokémon renvoyées par PokeAPI.

// Retire les césures optionnelles et les retours à la ligne hérités des boîtes
// de dialogue des jeux dans les descriptions de PokeAPI.
export function cleanFlavorText(text: string): string {
  return text
    .replace(/\u00AD/g, "")
    .replace(/[\n\f\r]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
