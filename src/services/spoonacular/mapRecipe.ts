import { Recipe, Meal, Taste, Difficulty, DietCategory } from '../../data/recipes';
import { SpoonacularRecipe } from './types';

const SWEET_DISH_TYPES = ['dessert'];
const BREAKFAST_DISH_TYPES = ['breakfast', 'morning meal', 'brunch'];

function mapMeal(dishTypes: string[]): Meal {
  if (dishTypes.some((t) => BREAKFAST_DISH_TYPES.includes(t))) return 'Śniadanie';
  // Spoonacular nie rozróżnia obiadu od kolacji - rozdzielamy po id, żeby rozkład był stabilny i w miarę równy.
  return 'Obiad';
}

function mapTaste(dishTypes: string[]): Taste {
  return dishTypes.some((t) => SWEET_DISH_TYPES.includes(t)) ? 'Na słodko' : 'Na słono';
}

function mapDifficulty(readyInMinutes: number, ingredientCount: number, stepCount: number): Difficulty {
  const isSimple = readyInMinutes <= 30 && ingredientCount <= 7 && stepCount <= 5;
  return isSimple ? 'Proste' : 'Złożone';
}

function mapDiet(recipe: SpoonacularRecipe): DietCategory {
  if (recipe.vegan) return 'Wegańskie';
  if (recipe.vegetarian) return 'Wegetariańskie';
  if (recipe.glutenFree) return 'Bezglutenowe';
  return 'Standardowa';
}

function mapNutrition(recipe: SpoonacularRecipe): Recipe['nutrition'] {
  const nutrients = recipe.nutrition?.nutrients ?? [];
  const pick = (name: string) => nutrients.find((n) => n.name === name);
  const rows: { key: string; unit: string }[] = [
    { key: 'Calories', unit: 'kcal' },
    { key: 'Protein', unit: 'białko' },
    { key: 'Fat', unit: 'tłuszcz' },
    { key: 'Carbohydrates', unit: 'węgl.' },
  ];
  return rows
    .map(({ key, unit }) => {
      const nutrient = pick(key);
      if (!nutrient) return null;
      return { value: String(Math.round(nutrient.amount)), unit };
    })
    .filter((row): row is { value: string; unit: string } => row !== null);
}

export function mapSpoonacularRecipe(raw: SpoonacularRecipe): Recipe {
  const steps = raw.analyzedInstructions?.[0]?.steps ?? [];
  const ingredients = raw.extendedIngredients ?? [];
  // Obiad vs Kolacja to nasza własna konwencja (Spoonacular tego nie rozróżnia) - dzielimy po parzystości id.
  const meal = mapMeal(raw.dishTypes);
  const finalMeal = meal === 'Obiad' && raw.id % 2 === 0 ? 'Kolacja' : meal;

  return {
    id: raw.id,
    title: raw.title,
    meal: finalMeal,
    taste: mapTaste(raw.dishTypes),
    difficulty: mapDifficulty(raw.readyInMinutes, ingredients.length, steps.length),
    diet: mapDiet(raw),
    time: `${raw.readyInMinutes} min`,
    vegetarian: raw.vegetarian,
    nutrition: mapNutrition(raw),
    ingredients: ingredients.map((ing) => ({
      name: ing.name,
      qty: `${Math.round(ing.amount * 10) / 10} ${ing.unit}`.trim(),
    })),
    steps: steps.map((s) => s.step),
  };
}

/** Przepis bez składników albo bez kroków jest bezużyteczny dla dopasowywania do lodówki - odrzucamy go, zamiast pokazywać pustą kartę. */
export function hasUsableContent(raw: SpoonacularRecipe): boolean {
  return (raw.extendedIngredients?.length ?? 0) > 0 && (raw.analyzedInstructions?.[0]?.steps?.length ?? 0) > 0;
}

export function mapSpoonacularRecipes(raw: SpoonacularRecipe[]): Recipe[] {
  return raw.map(mapSpoonacularRecipe);
}
