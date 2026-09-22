import { getLocales } from "expo-localization";
import i18n from "i18next";
import { initReactI18next, useTranslation } from "react-i18next";

import { toA11yLanguage } from "@/constants/a11y";

import fr from "./locales/fr.json";

// L'anglais arrive à la tâche 17. La structure est déjà multilingue pour que
// l'ajout ne touche aucun composant.
const resources = {
  fr: { translation: fr },
};

const deviceLanguage = getLocales()[0]?.languageCode ?? "fr";

i18n.use(initReactI18next).init({
  resources,
  lng: deviceLanguage in resources ? deviceLanguage : "fr",
  fallbackLng: "fr",
  interpolation: { escapeValue: false },
});

// Étiquette de langue à passer à accessibilityLanguage, suit la langue active.
export function useA11yLanguage(): string {
  const { i18n: instance } = useTranslation();
  return toA11yLanguage(instance.language);
}

export default i18n;
