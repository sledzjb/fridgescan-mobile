import { useEffect } from 'react';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Recipe } from '../data/recipes';
import { fetchRecipeCatalog, RecipeSource } from '../services/spoonacular/recipesService';

type RecipesState = {
  recipes: Recipe[];
  source: RecipeSource | null;
  lastFetchedAt: number | null;
  isLoading: boolean;
  error: string | null;
  hasHydrated: boolean;
  fetchRecipes: () => Promise<void>;
};

let inFlightFetch: Promise<void> | null = null;

export const useRecipesStore = create<RecipesState>()(
  persist(
    (set) => ({
      recipes: [],
      source: null,
      lastFetchedAt: null,
      isLoading: false,
      error: null,
      hasHydrated: false,

      fetchRecipes: () => {
        if (inFlightFetch) return inFlightFetch;

        set({ isLoading: true, error: null });
        inFlightFetch = fetchRecipeCatalog()
          .then(({ recipes, source }) => {
            set({ recipes, source, lastFetchedAt: Date.now(), isLoading: false });
          })
          .catch((e) => {
            set({ isLoading: false, error: e instanceof Error ? e.message : 'Nieznany błąd' });
          })
          .finally(() => {
            inFlightFetch = null;
          });
        return inFlightFetch;
      },
    }),
    {
      name: '@fridgescan/recipes',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ recipes: state.recipes, source: state.source, lastFetchedAt: state.lastFetchedAt }),
      onRehydrateStorage: () => () => {
        useRecipesStore.setState({ hasHydrated: true });
      },
    }
  )
);

/**
 * Ekrany przepisów wołają ten hook zamiast czytać useRecipesStore bezpośrednio - dzięki temu
 * pobranie katalogu jest leniwe (dopiero gdy ktoś faktycznie wejdzie na taki ekran), a nie przy
 * każdym starcie aplikacji. fetchRecipes() samo sprawdza świeżość cache'u i limit punktów, więc
 * wywołanie go z wielu ekranów jednocześnie jest bezpieczne i tanie, gdy dane są już aktualne.
 */
export function useRecipesCatalog() {
  const recipes = useRecipesStore((s) => s.recipes);
  const source = useRecipesStore((s) => s.source);
  const isLoading = useRecipesStore((s) => s.isLoading);
  const hasHydrated = useRecipesStore((s) => s.hasHydrated);

  useEffect(() => {
    if (hasHydrated) {
      useRecipesStore.getState().fetchRecipes();
    }
  }, [hasHydrated]);

  return { recipes, source, isLoading, hasHydrated };
}
