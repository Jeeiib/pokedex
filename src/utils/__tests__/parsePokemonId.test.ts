import { parsePokemonId } from "@/utils/parsePokemonId";

describe("parsePokemonId", () => {
  it("accepts a valid pokedex number", () => {
    expect(parsePokemonId("1")).toBe(1);
    expect(parsePokemonId("1025")).toBe(1025);
  });

  // Couvre le point 1 du Review Focus : un identifiant absurde dans l'url.
  it("rejects a non numeric parameter", () => {
    expect(parsePokemonId("abc")).toBeNull();
    expect(parsePokemonId("12abc")).toBeNull();
  });

  it("rejects numbers outside the pokedex", () => {
    expect(parsePokemonId("0")).toBeNull();
    expect(parsePokemonId("-4")).toBeNull();
    expect(parsePokemonId("1026")).toBeNull();
    expect(parsePokemonId("99999")).toBeNull();
  });

  it("rejects a decimal number", () => {
    expect(parsePokemonId("1.5")).toBeNull();
  });

  it("rejects a missing parameter", () => {
    expect(parsePokemonId(undefined)).toBeNull();
    expect(parsePokemonId("")).toBeNull();
  });

  it("takes the first value when the router gives an array", () => {
    expect(parsePokemonId(["25", "26"])).toBe(25);
  });
});
