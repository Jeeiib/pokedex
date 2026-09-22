export function toggleFavorite(list: number[], id: number): number[] {
  return list.includes(id) ? list.filter((entry) => entry !== id) : [...list, id];
}

// Le contenu du stockage n'est pas fiable : une lecture ratée vaut mieux
// qu'un plantage au démarrage.
export function parseFavorites(raw: string | null): number[] {
  if (raw === null) {
    return [];
  }
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter((entry): entry is number => typeof entry === "number");
  } catch {
    return [];
  }
}
