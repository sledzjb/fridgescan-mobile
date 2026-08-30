import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IsoDate } from '../utils/date';
import { generateId } from '../utils/id';

export type Product = {
  id: string;
  name: string;
  category: string;
  qty: number;
  unit: string;
  expiryDate: IsoDate | null;
  /** Id zaplanowanego powiadomienia o kończącym się terminie (expo-notifications), jeśli jakieś jest aktywne. */
  notificationId?: string | null;
};

export type NewProduct = Omit<Product, 'id'>;

type ProductsState = {
  products: Product[];
  hasHydrated: boolean;
  addProduct: (product: NewProduct) => Product;
  updateProduct: (id: string, patch: Partial<NewProduct>) => void;
  removeProduct: (id: string) => { product: Product; index: number } | null;
  restoreProduct: (product: Product, index: number) => void;
  setQuantity: (id: string, qty: number) => void;
  clearAll: () => void;
};

export const useProductsStore = create<ProductsState>()(
  persist(
    (set, get) => ({
      products: [],
      hasHydrated: false,

      addProduct: (product) => {
        const newProduct: Product = { ...product, id: generateId() };
        set((state) => ({ products: [...state.products, newProduct] }));
        return newProduct;
      },

      updateProduct: (id, patch) => {
        set((state) => ({
          products: state.products.map((p) => (p.id === id ? { ...p, ...patch } : p)),
        }));
      },

      removeProduct: (id) => {
        const index = get().products.findIndex((p) => p.id === id);
        if (index === -1) return null;
        const product = get().products[index];
        set((state) => ({ products: state.products.filter((p) => p.id !== id) }));
        return { product, index };
      },

      restoreProduct: (product, index) => {
        set((state) => {
          const next = [...state.products];
          next.splice(Math.min(index, next.length), 0, product);
          return { products: next };
        });
      },

      setQuantity: (id, qty) => {
        set((state) => ({
          products: state.products.map((p) => (p.id === id ? { ...p, qty: Math.max(0, qty) } : p)),
        }));
      },

      clearAll: () => set({ products: [] }),
    }),
    {
      name: '@fridgescan/products',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ products: state.products }),
      onRehydrateStorage: () => () => {
        useProductsStore.setState({ hasHydrated: true });
      },
    }
  )
);
