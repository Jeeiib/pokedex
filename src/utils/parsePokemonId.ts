const SPECIES_COUNT = 1025;

// Le paramètre vient de l'url, il peut valoir n'importe quoi. Retourne null
// plutôt que NaN pour que l'écran affiche une erreur au lieu d'appeler l'api.
export function parsePokemonId(param: string | string[] | undefined): number | null {
  const raw = Array.isArray(param) ? param[0] : param;
  if (raw === undefined || !/^\d+$/.test(raw)) {
    return null;
  }
  const id = Number(raw);
  if (id < 1 || id > SPECIES_COUNT) {
    return null;
  }
  return id;
}
