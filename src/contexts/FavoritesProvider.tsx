// Contexte des favoris : mémorise les identifiants marqués et les persiste dans
// le stockage local.

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

// Charge les favoris au démarrage et les réécrit à chaque bascule.
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

// Donne accès à la liste des favoris et à leur bascule.
export function useFavorites() {
  return useContext(FavoritesContext);
}
