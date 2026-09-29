import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Recipe } from '../data/recipes';

// Wersja 1 zapisywała polskie etykiety filtrów; wersja 2 - angielskie identyfikatory.
const LEGACY_VALUES: Record<string, string> = {
  Śniadanie: 'breakfast',
  Obiad: 'lunch',
  Kolacja: 'dinner',
  'Na słodko': 'sweet',
  'Na słono': 'savory',
  Proste: 'simple',
  Złożone: 'complex',
  Wegańskie: 'vegan',
  Wegetariańskie: 'vegetarian',
  Bezglutenowe: 'gluten_free',
  Standardowa: 'standard',
};
const migrateValue = (v: string) => LEGACY_VALUES[v] ?? v;

type RecipesState = {
  recipes: Recipe[];
  hasHydrated: boolean;
  addRecipes: (recipes: Recipe[]) => void;
};

/** Przepisy wygenerowane w generatorze. Trzymamy je po id, żeby działały szczegóły, ulubione i lista wszystkich przepisów. */
export const useRecipesStore = create<RecipesState>()(
  persist(
    (set) => ({
      recipes: [],
      hasHydrated: false,
      addRecipes: (incoming) =>
        set((state) => {
          const ids = new Set(incoming.map((r) => r.id));
          return { recipes: [...incoming, ...state.recipes.filter((r) => !ids.has(r.id))] };
        }),
    }),
    {
      name: '@fridgescan/recipes',
      storage: createJSONStorage(() => AsyncStorage),
      version: 2,
      migrate: (persisted) => {
        const state = persisted as { recipes?: Recipe[] };
        return {
          recipes: (state.recipes ?? []).map((r) => ({
            ...r,
            meal: migrateValue(r.meal) as Recipe['meal'],
            taste: migrateValue(r.taste) as Recipe['taste'],
            difficulty: migrateValue(r.difficulty) as Recipe['difficulty'],
            diet: migrateValue(r.diet) as Recipe['diet'],
          })),
        };
      },
      partialize: (state) => ({ recipes: state.recipes }),
      onRehydrateStorage: () => () => {
        useRecipesStore.setState({ hasHydrated: true });
      },
    }
  )
);

export function useRecipesCatalog() {
  const recipes = useRecipesStore((s) => s.recipes);
  const hasHydrated = useRecipesStore((s) => s.hasHydrated);
  return { recipes, hasHydrated };
}
