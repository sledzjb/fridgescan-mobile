import { Product } from '../store/useProductsStore';
import { Recipe, RecipeIngredient, Meal, Taste, Difficulty, DietCategory } from '../data/recipes';

export type GeneratorFilters = {
  meal: Meal;
  taste: Taste;
  difficulty: Difficulty;
  diet: DietCategory;
};

export const DEFAULT_FILTERS: GeneratorFilters = {
  meal: 'Śniadanie',
  taste: 'Na słono',
  difficulty: 'Proste',
  diet: 'Standardowa',
};

const FILTER_OPTIONS: { [K in keyof GeneratorFilters]: GeneratorFilters[K][] } = {
  meal: ['Śniadanie', 'Obiad', 'Kolacja'],
  taste: ['Na słodko', 'Na słono'],
  difficulty: ['Proste', 'Złożone'],
  diet: ['Wegańskie', 'Wegetariańskie', 'Bezglutenowe', 'Standardowa'],
};

export type IngredientStatus = RecipeIngredient & { have: boolean };

export type RecipeMatch = {
  recipe: Recipe;
  ingredientStatuses: IngredientStatus[];
  haveCount: number;
  totalCount: number;
  matchPercent: number;
  qualifies: boolean;
};

/** Przepis kwalifikuje się, gdy co najmniej tyle składników jest w lodówce. */
const QUALIFY_THRESHOLD = 3;

function normalize(name: string): string {
  return name.trim().toLowerCase();
}

function ingredientInFridge(ingredientName: string, products: Product[]): boolean {
  const target = normalize(ingredientName);
  return products.some((p) => {
    const names = [p.name, p.genericName].filter((n): n is string => !!n).map(normalize);
    return names.some((productName) => productName === target || productName.includes(target) || target.includes(productName));
  });
}

export function matchRecipe(recipe: Recipe, products: Product[]): RecipeMatch {
  const ingredientStatuses = recipe.ingredients.map((ing) => ({
    ...ing,
    have: ingredientInFridge(ing.name, products),
  }));
  const haveCount = ingredientStatuses.filter((i) => i.have).length;
  const totalCount = ingredientStatuses.length;
  return {
    recipe,
    ingredientStatuses,
    haveCount,
    totalCount,
    matchPercent: Math.round((haveCount / totalCount) * 100),
    qualifies: haveCount >= QUALIFY_THRESHOLD,
  };
}

export function matchAllRecipes(recipes: Recipe[], products: Product[]): RecipeMatch[] {
  return recipes.map((r) => matchRecipe(r, products));
}

function matchesFilters(recipe: Recipe, filters: GeneratorFilters): boolean {
  return (
    recipe.meal === filters.meal &&
    recipe.taste === filters.taste &&
    recipe.difficulty === filters.difficulty &&
    recipe.diet === filters.diet
  );
}

export function filterRecipes(matches: RecipeMatch[], filters: GeneratorFilters): RecipeMatch[] {
  return matches.filter((m) => m.qualifies && matchesFilters(m.recipe, filters));
}

export type LoosestFilterSuggestion = {
  key: keyof GeneratorFilters;
  currentValue: string;
  suggestedValue: string;
  resultCount: number;
};

/**
 * Który z czterech filtrów, po zmianie na najkorzystniejszą alternatywną wartość
 * (pozostałe trzy bez zmian), daje najwięcej wyników. Używane na ekranie „Propozycje - brak wyników”.
 */
export function findLoosestFilter(matches: RecipeMatch[], filters: GeneratorFilters): LoosestFilterSuggestion | null {
  let best: LoosestFilterSuggestion | null = null;

  (Object.keys(FILTER_OPTIONS) as (keyof GeneratorFilters)[]).forEach((key) => {
    FILTER_OPTIONS[key].forEach((value) => {
      if (value === filters[key]) return;
      const trialFilters = { ...filters, [key]: value };
      const count = matches.filter((m) => m.qualifies && matchesFilters(m.recipe, trialFilters)).length;
      if (!best || count > best.resultCount) {
        best = { key, currentValue: filters[key], suggestedValue: value, resultCount: count };
      }
    });
  });

  return best;
}
