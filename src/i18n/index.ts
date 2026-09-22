import AsyncStorage from "@react-native-async-storage/async-storage";
import { getLocales } from "expo-localization";
import i18n from "i18next";
import { initReactI18next, useTranslation } from "react-i18next";

import { toA11yLanguage, type AppLanguage } from "@/constants/a11y";

import en from "./locales/en.json";
import fr from "./locales/fr.json";

const STORAGE_KEY = "pokedex.language";

const resources = {
  fr: { translation: fr },
  en: { translation: en },
};

const deviceLanguage = getLocales()[0]?.languageCode ?? "fr";

// Faux positif du plugin sur l'export par défaut d'i18next, qui porte aussi
// un export nommé `use`.
// eslint-disable-next-line import/no-named-as-default-member
i18n.use(initReactI18next).init({
  resources,
  lng: deviceLanguage in resources ? deviceLanguage : "fr",
  fallbackLng: "fr",
  interpolation: { escapeValue: false },
});

// Un choix explicite prime sur la langue du téléphone, y compris après
// redémarrage.
AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
  if (stored === "fr" || stored === "en") {
    // eslint-disable-next-line import/no-named-as-default-member -- même faux positif que le i18n.use plus haut
    i18n.changeLanguage(stored);
  }
});

export async function setAppLanguage(language: AppLanguage): Promise<void> {
  // eslint-disable-next-line import/no-named-as-default-member -- même faux positif que le i18n.use plus haut
  await i18n.changeLanguage(language);
  await AsyncStorage.setItem(STORAGE_KEY, language);
}

// Étiquette de langue à passer à accessibilityLanguage, suit la langue active.
export function useA11yLanguage(): string {
  const { i18n: instance } = useTranslation();
  return toA11yLanguage(instance.language);
}

export default i18n;
