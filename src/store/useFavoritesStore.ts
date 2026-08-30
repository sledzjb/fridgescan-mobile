import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

type FavoritesState = {
  recipeIds: number[];
  hasHydrated: boolean;
  isFavorite: (id: number) => boolean;
  toggleFavorite: (id: number) => void;
};

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      recipeIds: [],
      hasHydrated: false,
      isFavorite: (id) => get().recipeIds.includes(id),
      toggleFavorite: (id) => {
        set((state) => ({
          recipeIds: state.recipeIds.includes(id)
            ? state.recipeIds.filter((r) => r !== id)
            : [...state.recipeIds, id],
        }));
      },
    }),
    {
      name: '@fridgescan/favorites',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ recipeIds: state.recipeIds }),
      onRehydrateStorage: () => () => {
        useFavoritesStore.setState({ hasHydrated: true });
      },
    }
  )
);
