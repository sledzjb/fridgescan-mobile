// Wartości są angielskimi identyfikatorami (idą do API i są zapisywane); polskie etykiety tylko w UI - patrz recipeLabels.ts.
export type Meal = 'breakfast' | 'lunch' | 'dinner';
export type Taste = 'sweet' | 'savory';
export type Difficulty = 'simple' | 'complex';
export type DietCategory = 'vegan' | 'vegetarian' | 'gluten_free' | 'standard';

export const MEALS: Meal[] = ['breakfast', 'lunch', 'dinner'];
export const TASTES: Taste[] = ['sweet', 'savory'];
export const DIFFICULTIES: Difficulty[] = ['simple', 'complex'];
export const DIET_CATEGORIES: DietCategory[] = ['vegan', 'vegetarian', 'gluten_free', 'standard'];

export type NutrientRow = { value: string; unit: string };
/** fridgeItem: angielska nazwa produktu z lodówki (Product.nameEn), jeśli ten składnik to ten produkt. */
export type RecipeIngredient = { name: string; qty: string; fridgeItem?: string };

export type RecipeImageCredit = { photographer: string; url: string };

export type Recipe = {
  id: number;
  title: string;
  meal: Meal;
  taste: Taste;
  difficulty: Difficulty;
  diet: DietCategory;
  time: string;
  vegetarian: boolean;
  nutrition: NutrientRow[];
  ingredients: RecipeIngredient[];
  steps: string[];
  imageUrl?: string;
  imageCredit?: RecipeImageCredit;
};
