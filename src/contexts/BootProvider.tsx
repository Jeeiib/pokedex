import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

type BootContextValue = {
  dataReady: boolean;
  markDataReady: () => void;
};

const BootContext = createContext<BootContextValue>({
  dataReady: false,
  markDataReady: () => {},
});

// L'écran d'ouverture attend que la liste ait ses données. La rotation de la
// Pokéball sert d'indicateur de chargement plutôt que d'ajouter une attente.
export function BootProvider({ children }: { children: ReactNode }) {
  const [dataReady, setDataReady] = useState(false);
  const markDataReady = useCallback(() => setDataReady(true), []);

  return (
    <BootContext.Provider value={{ dataReady, markDataReady }}>{children}</BootContext.Provider>
  );
}

export function useBoot() {
  return useContext(BootContext);
}
