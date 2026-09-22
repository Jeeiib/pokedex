import { createContext, useContext, type ReactNode } from "react";

import { lightTheme, type Theme } from "@/constants/theme";

type ThemeContextValue = {
  theme: Theme;
};

const ThemeContext = createContext<ThemeContextValue>({ theme: lightTheme });

// Un seul thème pour l'instant. La tâche 16 ajoute la palette sombre, le mode
// et la persistance, sans changer la façon dont les composants lisent le thème.
export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <ThemeContext.Provider value={{ theme: lightTheme }}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
