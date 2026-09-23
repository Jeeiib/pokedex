// Conversion du poids et de la taille, exprimés par PokeAPI en hectogrammes et
// en décimètres.

// Convertit un poids exprimé en hectogrammes par PokeAPI en kilogrammes.
export function toKilograms(hectograms: number): number {
  return Math.round(hectograms) / 10;
}

// Convertit une taille exprimée en décimètres par PokeAPI en mètres.
export function toMeters(decimetres: number): number {
  return Math.round(decimetres) / 10;
}

// Met en forme une valeur décimale à une décimale selon la locale.
export function formatDecimal(value: number, locale: string): string {
  return value.toLocaleString(locale, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
}
