// Mise en forme du numéro de Pokédex.

// Numéro de Pokédex sur trois chiffres, comme la maquette : #001, #025.
export function formatPokemonId(id: number): string {
  return `#${String(id).padStart(3, "0")}`;
}
