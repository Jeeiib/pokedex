// Contexte de thème : clair, sombre ou système, avec persistance du choix dans
// le stockage local.

import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useColorScheme } from "react-native";

import { darkTheme, lightTheme, type Theme } from "@/constants/theme";

export type ThemeMode = "light" | "dark" | "system";

const STORAGE_KEY = "pokedex.themeMode";

type ThemeContextValue = {
  theme: Theme;
  mode: ThemeMode;
  scheme: "light" | "dark";
  setMode: (mode: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextValue>({
  theme: lightTheme,
  mode: "system",
  scheme: "light",
  setMode: () => {},
});

// Vérifie qu'une valeur lue du stockage correspond bien à un mode de thème
// valide.
function isMode(value: string | null): value is ThemeMode {
  return value === "light" || value === "dark" || value === "system";
}

// Résout le thème effectif entre le mode choisi et celui du système, et
// persiste le choix.
export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme();
  const [mode, setModeState] = useState<ThemeMode>("system");

  useEffect(() => {
    let ignore = false;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (!ignore && isMode(stored)) {
          setModeState(stored);
        }
      })
      .catch(() => {});
    return () => {
      ignore = true;
    };
  }, []);

  function setMode(next: ThemeMode) {
    setModeState(next);
    AsyncStorage.setItem(STORAGE_KEY, next).catch(() => {});
  }

  const scheme = mode === "system" ? (systemScheme === "dark" ? "dark" : "light") : mode;
  const theme = scheme === "dark" ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, mode, scheme, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Donne accès au thème courant, au mode et à leur mise à jour.
export function useTheme() {
  return useContext(ThemeContext);
}
