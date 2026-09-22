import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

import { parseFavorites, toggleFavorite } from "@/utils/favorites";

const STORAGE_KEY = "pokedex.favorites";

type FavoritesContextValue = {
  favorites: number[];
  isFavorite: (id: number) => boolean;
  toggle: (id: number) => void;
};

const FavoritesContext = createContext<FavoritesContextValue>({
  favorites: [],
  isFavorite: () => false,
  toggle: () => {},
});

// Persistance simple : la liste d'identifiants favoris est relue au
// démarrage et réécrite à chaque bascule.
export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<number[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
      setFavorites(parseFavorites(stored));
    });
  }, []);

  function toggle(id: number) {
    const next = toggleFavorite(favorites, id);
    setFavorites(next);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  function isFavorite(id: number) {
    return favorites.includes(id);
  }

  return (
    <FavoritesContext.Provider value={{ favorites, isFavorite, toggle }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  return useContext(FavoritesContext);
}
