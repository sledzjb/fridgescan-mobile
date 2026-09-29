import { Meal, Taste, Difficulty, DietCategory } from '../data/recipes';

/** Polskie etykiety do wyświetlania. W kodzie i zapytaniach do API używamy angielskich identyfikatorów. */
export const RECIPE_LABELS: Record<Meal | Taste | Difficulty | DietCategory, string> = {
  breakfast: 'Śniadanie',
  lunch: 'Obiad',
  dinner: 'Kolacja',
  sweet: 'Na słodko',
  savory: 'Na słono',
  simple: 'Proste',
  complex: 'Złożone',
  vegan: 'Wegańskie',
  vegetarian: 'Wegetariańskie',
  gluten_free: 'Bezglutenowe',
  standard: 'Standardowa',
};

export function recipeLabel(value: keyof typeof RECIPE_LABELS): string {
  return RECIPE_LABELS[value] ?? value;
}

/** Polskie sformułowanie jednostki składnika (angielski identyfikator z API -> tekst w UI). */
export const INGREDIENT_UNIT_LABELS: Record<string, string> = {
  g: 'g',
  ml: 'ml',
  pcs: 'szt',
  tbsp: 'łyżka',
  tsp: 'łyżeczka',
  cup: 'szklanka',
  clove: 'ząbek',
  can: 'puszka',
  pack: 'opakowanie',
};
