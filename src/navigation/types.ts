import { Product } from '../store/useProductsStore';
import { RecognizedItem } from '../services/gemini/types';
import { GeneratorFilters } from '../utils/recipeMatch';

export type RecipeDetailSource = 'generator' | 'recipes' | 'favorites';

export type OnboardingStackParamList = {
  Welcome: undefined;
  Name: undefined;
  Intro: undefined;
  NotificationsConsent: undefined;
};

export type FridgeStackParamList = {
  Fridge: { toastMessage?: string; undoProduct?: Product; undoIndex?: number } | undefined;
  AddProduct: { initialName?: string } | undefined;
  RecognizedProducts: { items: RecognizedItem[] };
  EditProduct: { productId: string };
};

// „Brak zgody na kamerę” to stan ekranu Scan (zależny od uprawnień), nie osobna trasa.
export type ScanStackParamList = {
  Scan: undefined;
  ScanNoResults: undefined;
  ScanError: { code: string } | undefined;
};

export type GeneratorStackParamList = {
  Generator: undefined;
  GeneratorLoading: { filters: GeneratorFilters };
  RecipeResults: { filters: GeneratorFilters; recipeIds: number[] };
  RecipeResultsEmpty: { filters: GeneratorFilters };
  RecipeDetail: { recipeId: number; from: RecipeDetailSource };
  UpdateFridgeSheet: { recipeId: number; from: RecipeDetailSource };
};

export type RecipesStackParamList = {
  AllRecipes: undefined;
  SearchRecipes: undefined;
  RecipeDetail: { recipeId: number; from: RecipeDetailSource };
  UpdateFridgeSheet: { recipeId: number; from: RecipeDetailSource };
};

export type FavoritesStackParamList = {
  Favorites: undefined;
  RecipeDetail: { recipeId: number; from: RecipeDetailSource };
  UpdateFridgeSheet: { recipeId: number; from: RecipeDetailSource };
};

export type MoreStackParamList = {
  More: undefined;
  History: undefined;
  Settings: undefined;
  ShoppingList: undefined;
  Help: undefined;
};

export type MainTabParamList = {
  FridgeTab: undefined;
  GeneratorTab: undefined;
  RecipesTab: undefined;
  FavoritesTab: undefined;
  MoreTab: undefined;
};

export type RootStackParamList = {
  Onboarding: undefined;
  MainTabs: undefined;
  Scan: undefined;
};
