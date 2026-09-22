// Étiquettes BCP-47 pour accessibilityLanguage. VoiceOver prononce selon la
// langue déclarée, elle doit donc suivre la langue active de l'application.
export const A11Y_LANGUAGES = {
  fr: "fr-FR",
  en: "en-US",
} as const;

export type AppLanguage = keyof typeof A11Y_LANGUAGES;

export function toA11yLanguage(language: string): string {
  const base = language.split("-")[0] as AppLanguage;
  return A11Y_LANGUAGES[base] ?? A11Y_LANGUAGES.fr;
}
