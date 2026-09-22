export const BASE_URL = "https://pokeapi.co/api/v2";

// PokeAPI n'expose les noms traduits en liste que par GraphQL. La seule
// alternative REST serait une requête par espèce, soit 1025 appels.
export const GRAPHQL_URL = "https://graphql.pokeapi.co/v1beta2";

export async function apiFetch<T>(path: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`);
  if (!response.ok) {
    throw new Error(`Appel ${path} en échec (${response.status})`);
  }
  return response.json() as Promise<T>;
}

export async function graphqlFetch<T>(query: string): Promise<T> {
  const response = await fetch(GRAPHQL_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });
  if (!response.ok) {
    throw new Error(`Appel GraphQL en échec (${response.status})`);
  }
  const payload = (await response.json()) as { data?: T; errors?: { message: string }[] };
  if (payload.errors?.length) {
    throw new Error(payload.errors[0].message);
  }
  return payload.data as T;
}
