import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateId } from '../utils/id';

export type ShoppingItem = {
  id: string;
  name: string;
  qty: string;
  recipeName: string | null;
  checked: boolean;
};

type ShoppingListState = {
  items: ShoppingItem[];
  hasHydrated: boolean;
  /** Dodaje pozycję, jeśli nie ma jeszcze produktu o tej nazwie (niezaznaczonego) na liście. */
  addIfMissing: (name: string, qty: string, recipeName: string | null) => void;
  addManual: (name: string, qty: string) => void;
  toggleChecked: (id: string) => void;
  removeItem: (id: string) => void;
  /** Usuwa pozycje odhaczone w poprzedniej wizycie na ekranie. */
  purgeChecked: () => void;
};

export const useShoppingListStore = create<ShoppingListState>()(
  persist(
    (set, get) => ({
      items: [],
      hasHydrated: false,

      addIfMissing: (name, qty, recipeName) => {
        const target = name.trim().toLowerCase();
        const exists = get().items.some((i) => i.name.trim().toLowerCase() === target);
        if (exists) return;
        set((state) => ({
          items: [...state.items, { id: generateId(), name, qty, recipeName, checked: false }],
        }));
      },

      addManual: (name, qty) => {
        set((state) => ({
          items: [...state.items, { id: generateId(), name, qty, recipeName: null, checked: false }],
        }));
      },

      toggleChecked: (id) => {
        set((state) => ({
          items: state.items.map((i) => (i.id === id ? { ...i, checked: !i.checked } : i)),
        }));
      },

      removeItem: (id) => {
        set((state) => ({ items: state.items.filter((i) => i.id !== id) }));
      },

      purgeChecked: () => {
        set((state) => ({ items: state.items.filter((i) => !i.checked) }));
      },
    }),
    {
      name: '@fridgescan/shopping-list',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ items: state.items }),
      onRehydrateStorage: () => () => {
        useShoppingListStore.setState({ hasHydrated: true });
      },
    }
  )
);
