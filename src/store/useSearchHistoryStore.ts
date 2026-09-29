import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MAX_QUERIES = 8;

type SearchHistoryState = {
  /** Ostatnie wyszukiwania, najnowsze pierwsze. */
  queries: string[];
  addQuery: (query: string) => void;
  clearAll: () => void;
};

export const useSearchHistoryStore = create<SearchHistoryState>()(
  persist(
    (set) => ({
      queries: [],
      addQuery: (query) => {
        const trimmed = query.trim();
        if (!trimmed) return;
        set((state) => ({
          queries: [trimmed, ...state.queries.filter((q) => q.toLowerCase() !== trimmed.toLowerCase())].slice(0, MAX_QUERIES),
        }));
      },
      clearAll: () => set({ queries: [] }),
    }),
    {
      name: '@fridgescan/search-history',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
