export const BASE_URL = "https://pokeapi.co/api/v2";

// PokeAPI n'expose les noms traduits en liste que par GraphQL. La seule
// alternative REST serait une requête par espèce, soit 1025 appels.
export const GRAPHQL_URL = "https://graphql.pokeapi.co/v1beta2";

// L'écran d'ouverture attend la fin de ces appels : un réseau qui accepte la
// connexion sans jamais répondre ne doit pas le laisser tourner indéfiniment.
const REQUEST_TIMEOUT_MS = 10_000;

// Borne l'attente sans changer la signature de l'appel `fetch` sous-jacent :
// un dépassement retombe sur le même message d'erreur qu'un échec réseau.
function withTimeout<T>(label: string, promise: Promise<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Appel ${label} en échec (délai dépassé)`));
    }, REQUEST_TIMEOUT_MS);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (cause) => {
        clearTimeout(timer);
        reject(cause);
      }
    );
  });
}

export async function apiFetch<T>(path: string): Promise<T> {
  const response = await withTimeout(path, fetch(`${BASE_URL}${path}`));
  if (!response.ok) {
    throw new Error(`Appel ${path} en échec (${response.status})`);
  }
  return response.json() as Promise<T>;
}

export async function graphqlFetch<T>(query: string): Promise<T> {
  const response = await withTimeout(
    "GraphQL",
    fetch(GRAPHQL_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    })
  );
  if (!response.ok) {
    throw new Error(`Appel GraphQL en échec (${response.status})`);
  }
  const payload = (await response.json()) as { data?: T; errors?: { message: string }[] };
  if (payload.errors?.length) {
    throw new Error(payload.errors[0].message);
  }
  return payload.data as T;
}
