import { Recipe, MEALS, TASTES, DIFFICULTIES, DIET_CATEGORIES } from '../../data/recipes';
import { Product } from '../../store/useProductsStore';
import { INGREDIENT_UNIT_LABELS } from '../../constants/recipeLabels';
import { GeneratorFilters, productEnglishName, productRecipeName } from '../../utils/recipeMatch';
import { GeminiError, generateContentWithFallback } from './client';

const UNITS = Object.keys(INGREDIENT_UNIT_LABELS);

const RESPONSE_SCHEMA = {
  type: 'ARRAY',
  items: {
    type: 'OBJECT',
    properties: {
      title: { type: 'STRING' },
      photoQuery: { type: 'STRING' },
      meal: { type: 'STRING', enum: [...MEALS] },
      taste: { type: 'STRING', enum: [...TASTES] },
      difficulty: { type: 'STRING', enum: [...DIFFICULTIES] },
      diet: { type: 'STRING', enum: [...DIET_CATEGORIES] },
      timeMinutes: { type: 'NUMBER' },
      vegetarian: { type: 'BOOLEAN' },
      caloriesKcal: { type: 'NUMBER' },
      proteinG: { type: 'NUMBER' },
      fatG: { type: 'NUMBER' },
      carbsG: { type: 'NUMBER' },
      ingredients: {
        type: 'ARRAY',
        items: {
          type: 'OBJECT',
          properties: {
            name: { type: 'STRING' },
            amount: { type: 'NUMBER' },
            unit: { type: 'STRING', enum: UNITS },
            fridgeItem: { type: 'STRING' },
          },
          required: ['name', 'amount', 'unit', 'fridgeItem'],
        },
      },
      steps: {
        type: 'ARRAY',
        items: { type: 'STRING' },
      },
    },
    required: [
      'title',
      'photoQuery',
      'meal',
      'taste',
      'difficulty',
      'diet',
      'timeMinutes',
      'vegetarian',
      'caloriesKcal',
      'proteinG',
      'fatG',
      'carbsG',
      'ingredients',
      'steps',
    ],
  },
};

type GeneratedRecipeRaw = {
  title: string;
  photoQuery: string;
  meal: string;
  taste: string;
  difficulty: string;
  diet: string;
  timeMinutes: number;
  vegetarian: boolean;
  caloriesKcal: number;
  proteinG: number;
  fatG: number;
  carbsG: number;
  ingredients: { name: string; amount: number; unit: string; fridgeItem?: string }[];
  steps: string[];
};

function buildPrompt(products: Product[], filters: GeneratorFilters, count: number, excludeTitles: string[]): string {
  const fridgeList = products
    .map(productEnglishName)
    .filter((name, i, arr) => arr.indexOf(name) === i)
    .join(', ');

  return (
    `You are a recipe generator for a "what can I cook with what's in my fridge" app. ` +
    `Current fridge inventory: ${fridgeList || '(empty - suggest generally useful recipes)'}. ` +
    `Generate exactly ${count} distinct, realistic recipes. Every recipe must have meal "${filters.meal}", ` +
    `taste "${filters.taste}", difficulty "${filters.difficulty}" and diet "${filters.diet}" - these are the ` +
    `user's filters and all four must match exactly. ` +
    `Build each recipe around the fridge inventory: every recipe MUST use at least one product from the ` +
    `inventory as a real ingredient, and as many as fit the dish. If a fridge item does not fit the requested ` +
    `diet, do not use it. You may add any other ingredients needed to make a proper dish, including common ` +
    `pantry staples (salt, pepper, oil, butter, flour, sugar, garlic), even if the fridge has only one product. ` +
    `For every ingredient set fridgeItem: if the ingredient is a product from the inventory, copy that ` +
    `inventory name exactly as written above (do not translate or change it); otherwise use an empty string. ` +
    `The ingredient name itself must always be in Polish, also for inventory products (e.g. name "Ser żółty" ` +
    `with fridgeItem "Yellow cheese"). ` +
    `Nutrition values should be a reasonable per-serving estimate. Write title, ingredient names and steps ` +
    `in Polish (fridgeItem, meal, taste, difficulty, diet and unit stay exactly as specified, never translated). ` +
    `For photoQuery give a short English search phrase (2-4 words) ` +
    `describing how the finished dish looks, e.g. "cheese omelette". Do not repeat the same dish twice.` +
    (excludeTitles.length > 0
      ? ` These dishes were already suggested to the user, so do not suggest them or close variants of them: ${JSON.stringify(excludeTitles)}.`
      : '')
  );
}

/** Przepis wraz z frazą do wyszukania zdjęcia (po angielsku, przed tłumaczeniem). */
export type GeneratedRecipe = { recipe: Recipe; photoQuery: string };

function isValidRaw(item: unknown): item is GeneratedRecipeRaw {
  if (!item || typeof item !== 'object') return false;
  const r = item as Record<string, unknown>;
  return (
    typeof r.title === 'string' &&
    r.title.trim().length > 0 &&
    typeof r.photoQuery === 'string' &&
    typeof r.meal === 'string' &&
    (MEALS as readonly string[]).includes(r.meal) &&
    typeof r.taste === 'string' &&
    (TASTES as readonly string[]).includes(r.taste) &&
    typeof r.difficulty === 'string' &&
    (DIFFICULTIES as readonly string[]).includes(r.difficulty) &&
    typeof r.diet === 'string' &&
    (DIET_CATEGORIES as readonly string[]).includes(r.diet) &&
    typeof r.timeMinutes === 'number' &&
    typeof r.vegetarian === 'boolean' &&
    typeof r.caloriesKcal === 'number' &&
    typeof r.proteinG === 'number' &&
    typeof r.fatG === 'number' &&
    typeof r.carbsG === 'number' &&
    Array.isArray(r.ingredients) &&
    r.ingredients.length > 0 &&
    Array.isArray(r.steps) &&
    r.steps.length > 0
  );
}

function mapRaw(raw: GeneratedRecipeRaw, id: number, filters: GeneratorFilters, fridgeProducts: Map<string, Product>): Recipe {
  return {
    id,
    title: raw.title,
    meal: filters.meal,
    taste: filters.taste,
    difficulty: filters.difficulty,
    diet: filters.diet,
    time: `${Math.round(raw.timeMinutes)} min`,
    vegetarian: raw.vegetarian,
    nutrition: [
      { value: String(Math.round(raw.caloriesKcal)), unit: 'kcal' },
      { value: String(Math.round(raw.proteinG)), unit: 'białko' },
      { value: String(Math.round(raw.fatG)), unit: 'tłuszcz' },
      { value: String(Math.round(raw.carbsG)), unit: 'węgl.' },
    ],
    ingredients: raw.ingredients.map((ing) => {
      // Tylko nazwa faktycznie istniejąca w lodówce - halucynacje modelu ignorujemy.
      const product = fridgeProducts.get((ing.fridgeItem ?? '').trim().toLowerCase());
      return {
        // Dla produktów z lodówki nie ufamy nazwie od modelu - bywa po angielsku, skopiowana z listy lodówki.
        name: product ? productRecipeName(product) : ing.name,
        qty: `${Math.round(ing.amount * 10) / 10} ${INGREDIENT_UNIT_LABELS[ing.unit] ?? ing.unit}`.trim(),
        fridgeItem: product ? productEnglishName(product) : undefined,
      };
    }),
    steps: raw.steps,
  };
}

export async function generateRecipesFromIngredients(
  products: Product[],
  filters: GeneratorFilters,
  count: number,
  excludeTitles: string[] = []
): Promise<GeneratedRecipe[]> {
  const text = await generateContentWithFallback({
    contents: [{ parts: [{ text: buildPrompt(products, filters, count, excludeTitles) }] }],
    generationConfig: {
      response_mime_type: 'application/json',
      response_schema: RESPONSE_SCHEMA,
    },
  });

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new GeminiError('PARSE', 'Model nie zwrócił poprawnego JSON-a');
  }

  if (!Array.isArray(parsed)) {
    throw new GeminiError('PARSE', 'Oczekiwano tablicy przepisów');
  }

  const valid = parsed.filter(isValidRaw);
  if (valid.length === 0) {
    throw new GeminiError('PARSE', 'Żaden wygenerowany przepis nie miał poprawnego kształtu');
  }

  const fridgeProducts = new Map(products.map((p) => [productEnglishName(p).trim().toLowerCase(), p]));
  const baseId = Date.now();
  const recipes = valid.map((raw, i) => ({ recipe: mapRaw(raw, baseId + i, filters, fridgeProducts), photoQuery: raw.photoQuery.trim() || raw.title }));

  // Przepis bez ani jednego produktu z lodówki nie ma sensu w tej aplikacji - odrzucamy go.
  const usable = fridgeProducts.size === 0 ? recipes : recipes.filter((g) => g.recipe.ingredients.some((ing) => ing.fridgeItem));
  return usable.slice(0, count);
}
