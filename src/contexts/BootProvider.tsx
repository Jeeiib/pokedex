// Contexte de démarrage : signale quand les données initiales sont prêtes pour
// piloter la sortie du splash animé.

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

type BootContextValue = {
  dataReady: boolean;
  markDataReady: () => void;
};

const BootContext = createContext<BootContextValue>({
  dataReady: false,
  markDataReady: () => {},
});

// Expose un drapeau passé à vrai une fois les données prêtes.
export function BootProvider({ children }: { children: ReactNode }) {
  const [dataReady, setDataReady] = useState(false);
  const markDataReady = useCallback(() => setDataReady(true), []);

  return (
    <BootContext.Provider value={{ dataReady, markDataReady }}>{children}</BootContext.Provider>
  );
}

// Donne accès au statut de préparation des données.
export function useBoot() {
  return useContext(BootContext);
}
