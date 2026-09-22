// PokeAPI exprime le poids en hectogrammes et la taille en décimètres.
export function toKilograms(hectograms: number): number {
  return Math.round(hectograms) / 10;
}

export function toMeters(decimetres: number): number {
  return Math.round(decimetres) / 10;
}

export function formatDecimal(value: number, locale: string): string {
  return value.toLocaleString(locale, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
}
