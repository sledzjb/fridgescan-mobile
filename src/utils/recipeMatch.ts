import { Product } from '../store/useProductsStore';
import { Recipe, RecipeIngredient, Meal, Taste, Difficulty, DietCategory } from '../data/recipes';

export type GeneratorFilters = {
  meal: Meal;
  taste: Taste;
  difficulty: Difficulty;
  diet: DietCategory;
};

export const DEFAULT_FILTERS: GeneratorFilters = {
  meal: 'breakfast',
  taste: 'savory',
  difficulty: 'simple',
  diet: 'standard',
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

function normalize(name: string): string {
  return name.trim().toLowerCase();
}


/** Angielska nazwa produktu - jedyna wysyłana do API przepisów i używana do dopasowania. */
export function productEnglishName(p: Product): string {
  return p.nameEn || p.genericName || p.name;
}

/** Polska nazwa produktu do pokazania w przepisie - rodzajowa ("Ser żółty"), a nie konkretna ("Ser Gouda"). */
export function productRecipeName(p: Product): string {
  return p.genericName || p.name;
}

/**
 * Produkt z lodówki odpowiadający składnikowi. Gdy model wskazał fridgeItem, dopasowanie jest ścisłe
 * (po nazwie z lodówki); dla składników bez tej informacji zostaje dopasowanie po tekście.
 */
export function findProductForIngredient(ingredient: RecipeIngredient, products: Product[]): Product | undefined {
  if (ingredient.fridgeItem) {
    const target = normalize(ingredient.fridgeItem);
    return products.find((p) => normalize(productEnglishName(p)) === target);
  }
  const target = normalize(ingredient.name);
  return products.find((p) => {
    const names = [p.name, p.genericName].filter((n): n is string => !!n).map(normalize);
    return names.some((productName) => productName === target || productName.includes(target) || target.includes(productName));
  });
}

export function matchRecipe(recipe: Recipe, products: Product[]): RecipeMatch {
  const ingredientStatuses = recipe.ingredients.map((ing) => {
    const product = findProductForIngredient(ing, products);
    // Model potrafi przepisać do nazwy składnika angielską nazwę z lodówki ("Yellow cheese") -
    // dla składników z lodówki pokazujemy więc polską nazwę produktu (dotyczy też starszych, zapisanych przepisów).
    const name = product && ing.fridgeItem ? productRecipeName(product) : ing.name;
    return { ...ing, name, have: !!product };
  });
  const haveCount = ingredientStatuses.filter((i) => i.have).length;
  const totalCount = ingredientStatuses.length;
  return {
    recipe,
    ingredientStatuses,
    haveCount,
    totalCount,
    matchPercent: Math.round((haveCount / totalCount) * 100),
    qualifies: haveCount > 0,
  };
}
