// Vérifie que la fiche Pokémon reconstruite ordonne les types par emplacement
// et gère l'absence de cri.

import { getPokemonById } from "@/services/pokemonService";

// Remplace fetch par une réponse contrôlée le temps d'un test.
function mockFetch(response: Partial<Response> & { json?: () => Promise<unknown> }) {
  globalThis.fetch = jest.fn().mockResolvedValue(response) as unknown as typeof fetch;
}

describe("getPokemonById", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("orders the types by slot, not by array position", async () => {
    mockFetch({
      ok: true,
      json: async () => ({
        id: 1,
        name: "bulbasaur",
        weight: 69,
        height: 7,
        types: [
          { slot: 2, type: { name: "poison", url: "" } },
          { slot: 1, type: { name: "grass", url: "" } },
        ],
        abilities: [{ ability: { name: "overgrow", url: "" } }],
        stats: [{ base_stat: 45, stat: { name: "hp", url: "" } }],
        cries: { latest: "https://example.test/1.ogg" },
      }),
    });

    const pokemon = await getPokemonById(1);
    expect(pokemon.types).toEqual(["grass", "poison"]);
  });

  it("returns null when the api gives no cry", async () => {
    mockFetch({
      ok: true,
      json: async () => ({
        id: 1,
        name: "bulbasaur",
        weight: 69,
        height: 7,
        types: [{ slot: 1, type: { name: "grass", url: "" } }],
        abilities: [],
        stats: [],
      }),
    });

    const pokemon = await getPokemonById(1);
    expect(pokemon.cryUrl).toBeNull();
  });
});
