// La maquette affiche les statistiques sur trois chiffres : 045, 049, 065.
export function formatStatValue(value: number): string {
  return String(Math.max(0, Math.round(value))).padStart(3, "0");
}
