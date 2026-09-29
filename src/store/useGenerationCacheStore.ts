import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RecipeImageCredit } from '../data/recipes';

/** Zdjęcie z Pexels albo informacja, że Pexels nic nie znalazł (żeby nie pytać drugi raz o to samo). */
export type PhotoCacheEntry = { imageUrl: string; imageCredit: RecipeImageCredit } | { none: true };

type GenerationCacheState = {
  hasHydrated: boolean;
  /** Klucz (filtry + angielskie nazwy produktów) -> id przepisów zwróconych ostatnim generowaniem. */
  results: Record<string, number[]>;
  /** Fraza wyszukiwania zdjęcia (photoQuery) -> wynik z Pexels. */
  photos: Record<string, PhotoCacheEntry>;
  setResults: (key: string, recipeIds: number[]) => void;
  setPhoto: (query: string, entry: PhotoCacheEntry) => void;
};

export const useGenerationCacheStore = create<GenerationCacheState>()(
  persist(
    (set) => ({
      hasHydrated: false,
      results: {},
      photos: {},
      setResults: (key, recipeIds) => set((s) => ({ results: { ...s.results, [key]: recipeIds } })),
      setPhoto: (query, entry) => set((s) => ({ photos: { ...s.photos, [query]: entry } })),
    }),
    {
      name: '@fridgescan/generation-cache',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ results: state.results, photos: state.photos }),
      onRehydrateStorage: () => () => {
        useGenerationCacheStore.setState({ hasHydrated: true });
      },
    }
  )
);
