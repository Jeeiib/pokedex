import { formatPokemonId } from "@/utils/formatPokemonId";

describe("formatPokemonId", () => {
  it("pads to three digits like the mockup", () => {
    expect(formatPokemonId(1)).toBe("#001");
    expect(formatPokemonId(25)).toBe("#025");
    expect(formatPokemonId(151)).toBe("#151");
  });

  it("does not truncate four-digit numbers", () => {
    expect(formatPokemonId(1025)).toBe("#1025");
  });
});
