// Liste des identifiants de Pokémon favoris et sa sérialisation.

// Ajoute ou retire un identifiant de la liste des favoris selon sa présence.
export function toggleFavorite(list: number[], id: number): number[] {
  return list.includes(id) ? list.filter((entry) => entry !== id) : [...list, id];
}

// Relit la liste des favoris depuis le stockage, en renvoyant une liste vide si
// le contenu est absent ou invalide plutôt que de faire planter le démarrage.
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
