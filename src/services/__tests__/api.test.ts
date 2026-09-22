import { apiFetch, graphqlFetch } from "@/services/api";

function mockFetch(response: Partial<Response> & { json?: () => Promise<unknown> }) {
  // globalThis plutôt que global : le tsconfig ne charge que les types jest,
  // pas les types node qui déclarent `global`.
  globalThis.fetch = jest.fn().mockResolvedValue(response) as unknown as typeof fetch;
}

describe("apiFetch", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("returns the parsed body when the response is ok", async () => {
    mockFetch({ ok: true, json: async () => ({ count: 1025 }) });
    await expect(apiFetch<{ count: number }>("/pokemon-species")).resolves.toEqual({ count: 1025 });
  });

  it("throws when the response is not ok", async () => {
    mockFetch({ ok: false, status: 404, json: async () => ({}) });
    await expect(apiFetch("/pokemon/99999")).rejects.toThrow("404");
  });

  it("builds the url from the base and the path", async () => {
    mockFetch({ ok: true, json: async () => ({}) });
    await apiFetch("/type/fire");
    expect(globalThis.fetch).toHaveBeenCalledWith("https://pokeapi.co/api/v2/type/fire");
  });
});

describe("graphqlFetch", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("returns the data field", async () => {
    mockFetch({ ok: true, json: async () => ({ data: { pokemonspeciesname: [] } }) });
    await expect(graphqlFetch("{ pokemonspeciesname { name } }")).resolves.toEqual({
      pokemonspeciesname: [],
    });
  });

  it("throws when the payload carries errors", async () => {
    mockFetch({
      ok: true,
      json: async () => ({ errors: [{ message: "field not found" }] }),
    });
    await expect(graphqlFetch("{ nope }")).rejects.toThrow("field not found");
  });
});
