// Langues gérées par le Pokédex et leur étiquette BCP-47 attendue par VoiceOver
// pour l'accessibilité.

export const A11Y_LANGUAGES = {
  fr: "fr-FR",
  en: "en-US",
} as const;

export type AppLanguage = keyof typeof A11Y_LANGUAGES;

// Convertit la langue de l'appareil en étiquette BCP-47 connue, avec repli sur
// le français si elle n'est pas supportée.
export function toA11yLanguage(language: string): string {
  const base = language.split("-")[0] as AppLanguage;
  return A11Y_LANGUAGES[base] ?? A11Y_LANGUAGES.fr;
}
