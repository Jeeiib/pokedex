// Adresse audio du cri d'un Pokémon.

const USE_OFFICIAL_CRY = false;

const SHOWDOWN_BASE = "https://play.pokemonshowdown.com/audio/cries";

// La source de repli colle les slugs : mr-mime devient mrmime.
export function toShowdownSlug(slug: string): string {
  return slug.replace(/-/g, "");
}

// Choisit la source du cri, en repli sur Pokémon Showdown puisque PokeAPI ne
// sert que de l'Ogg Vorbis, qu'iOS ne décode pas.
export function resolveCryUrl(slug: string, officialUrl: string | null): string | null {
  if (USE_OFFICIAL_CRY && officialUrl) {
    return officialUrl;
  }
  if (slug === "") {
    return officialUrl;
  }
  return `${SHOWDOWN_BASE}/${toShowdownSlug(slug)}.mp3`;
}
