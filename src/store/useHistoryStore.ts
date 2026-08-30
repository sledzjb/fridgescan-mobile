import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateId } from '../utils/id';

export type HistoryEntryType = 'scan' | 'generation' | 'cooked';

export type HistoryEntry = {
  id: string;
  type: HistoryEntryType;
  timestamp: number;
  title: string;
  description: string;
  actionLabel: string;
  recipeId?: number;
};

type HistoryState = {
  entries: HistoryEntry[];
  hasHydrated: boolean;
  addEntry: (entry: Omit<HistoryEntry, 'id' | 'timestamp'>) => void;
  clearAll: () => void;
};

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set) => ({
      entries: [],
      hasHydrated: false,
      addEntry: (entry) => {
        set((state) => ({
          entries: [{ ...entry, id: generateId(), timestamp: Date.now() }, ...state.entries],
        }));
      },
      clearAll: () => set({ entries: [] }),
    }),
    {
      name: '@fridgescan/history',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ entries: state.entries }),
      onRehydrateStorage: () => () => {
        useHistoryStore.setState({ hasHydrated: true });
      },
    }
  )
);
