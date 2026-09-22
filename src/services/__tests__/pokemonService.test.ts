import { getPokemonById } from "@/services/pokemonService";

// globalThis plutôt que global : le tsconfig ne charge que les types jest,
// pas les types node qui déclarent `global` (voir api.test.ts).
function mockFetch(response: Partial<Response> & { json?: () => Promise<unknown> }) {
  globalThis.fetch = jest.fn().mockResolvedValue(response) as unknown as typeof fetch;
}

describe("getPokemonById", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  // L'ordre du tableau types n'est pas garanti par l'api, et le premier type
  // donne la couleur de fond de la fiche.
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
