// Validation de l'identifiant de Pokémon reçu depuis l'URL.

import { FIRST_SPECIES, LAST_SPECIES } from "@/constants/pokedex";

// Convertit le paramètre d'URL, qui peut valoir n'importe quoi, en identifiant
// valide ou en null pour que l'écran affiche une erreur plutôt que d'appeler
// l'API avec une valeur absurde.
export function parsePokemonId(param: string | string[] | undefined): number | null {
  const raw = Array.isArray(param) ? param[0] : param;
  if (raw === undefined || !/^\d+$/.test(raw)) {
    return null;
  }
  const id = Number(raw);
  if (id < FIRST_SPECIES || id > LAST_SPECIES) {
    return null;
  }
  return id;
}
