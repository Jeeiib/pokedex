import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useColorScheme } from "react-native";

import { darkTheme, lightTheme, type Theme } from "@/constants/theme";

export type ThemeMode = "light" | "dark" | "system";

const STORAGE_KEY = "pokedex.themeMode";

type ThemeContextValue = {
  theme: Theme;
  mode: ThemeMode;
  // Schéma effectivement appliqué, réglage système résolu compris : les
  // composants qui adaptent une couleur sans passer par un jeton le lisent.
  scheme: "light" | "dark";
  setMode: (mode: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextValue>({
  theme: lightTheme,
  mode: "system",
  scheme: "light",
  setMode: () => {},
});

function isMode(value: string | null): value is ThemeMode {
  return value === "light" || value === "dark" || value === "system";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme();
  const [mode, setModeState] = useState<ThemeMode>("system");

  // Le mode stocké est appliqué dès sa lecture. Le rendu ne l'attend pas :
  // l'écran de démarrage couvre encore ces quelques millisecondes.
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
      if (isMode(stored)) {
        setModeState(stored);
      }
    });
  }, []);

  function setMode(next: ThemeMode) {
    setModeState(next);
    AsyncStorage.setItem(STORAGE_KEY, next);
  }

  // useColorScheme peut renvoyer "unspecified" (RN recent) en plus de null :
  // seul "dark" bascule le theme, tout le reste retombe sur le clair.
  const scheme = mode === "system" ? (systemScheme === "dark" ? "dark" : "light") : mode;
  const theme = scheme === "dark" ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, mode, scheme, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
