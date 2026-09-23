// Vérifie la conversion du poids et de la taille renvoyés par l'api et leur
// formatage décimal selon la locale.

import { formatDecimal, toKilograms, toMeters } from "@/utils/formatMeasures";

describe("toKilograms", () => {
  it("converts the hectograms returned by the api", () => {
    expect(toKilograms(69)).toBe(6.9);
    expect(toKilograms(4)).toBe(0.4);
    expect(toKilograms(9999)).toBe(999.9);
  });
});

describe("toMeters", () => {
  it("converts the decimetres returned by the api", () => {
    expect(toMeters(7)).toBe(0.7);
    expect(toMeters(17)).toBe(1.7);
    expect(toMeters(100)).toBe(10);
  });
});

describe("formatDecimal", () => {
  it("uses the decimal separator of the locale", () => {
    expect(formatDecimal(6.9, "fr-FR")).toBe("6,9");
    expect(formatDecimal(6.9, "en-US")).toBe("6.9");
  });

  it("always shows one decimal", () => {
    expect(formatDecimal(10, "fr-FR")).toBe("10,0");
  });
});
