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

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<number[]>([]);

  useEffect(() => {
    let ignore = false;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (!ignore) {
          setFavorites(parseFavorites(stored));
        }
      })
      // Un stockage illisible laisse la liste vide, il ne casse pas l'ouverture.
      .catch(() => {});
    return () => {
      ignore = true;
    };
  }, []);

  function toggle(id: number) {
    setFavorites((current) => {
      const next = toggleFavorite(current, id);
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
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
