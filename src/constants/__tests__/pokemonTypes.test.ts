// Vérifie que la table des dix-huit types Pokémon respecte les couleurs de la
// maquette et un contraste conforme aux normes WCAG AA.

import { POKEMON_TYPES, getTypeColors } from "@/constants/pokemonTypes";

// Luminance relative d'une couleur, au sens du calcul de contraste WCAG.
function luminance(hex: string) {
  const channels = [1, 3, 5]
    .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

// Rapport de contraste entre deux couleurs, de 1 à 21.
function contrast(a: string, b: string) {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
}

describe("POKEMON_TYPES", () => {
  it("covers the 18 types", () => {
    expect(Object.keys(POKEMON_TYPES)).toHaveLength(18);
  });

  it("keeps the background colors from the mockup", () => {
    expect(POKEMON_TYPES.electric.background).toBe("#F9CF30");
    expect(POKEMON_TYPES.water.background).toBe("#6493EB");
    expect(POKEMON_TYPES.dark.background).toBe("#75574C");
  });

  it("meets WCAG AA on every type", () => {
    for (const colors of Object.values(POKEMON_TYPES)) {
      expect(contrast(colors.background, colors.foreground)).toBeGreaterThanOrEqual(4.5);
    }
  });

  it("uses dark text on light types", () => {
    expect(POKEMON_TYPES.electric.foreground).toBe("#1D1D1D");
    expect(POKEMON_TYPES.ice.foreground).toBe("#1D1D1D");
  });

  it("uses white text on dark types", () => {
    expect(POKEMON_TYPES.ghost.foreground).toBe("#FFFFFF");
    expect(POKEMON_TYPES.dragon.foreground).toBe("#FFFFFF");
  });
});

describe("getTypeColors", () => {
  it("returns the colors of the requested type", () => {
    expect(getTypeColors("fire")).toEqual({ background: "#F57D31", foreground: "#1D1D1D" });
  });

  it("falls back to normal for an unknown type", () => {
    expect(getTypeColors("chocolate")).toEqual(POKEMON_TYPES.normal);
  });
});
