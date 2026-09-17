import { Recipe } from '../../data/recipes';
import { translateTexts } from './client';

/**
 * Spoonacular zwraca tytuły/składniki/kroki po angielsku - tłumaczymy je na polski jednym
 * zbiorczym wywołaniem (zamiast osobno per przepis), żeby zminimalizować liczbę zapytań do DeepL.
 * Nie tłumaczymy jednostek składników (qty) - to krótkie skróty (g, ml, tbsp), zbyt zawodne dla
 * tłumacza ogólnego przeznaczenia, i nazwy dań/kategorie (meal/taste/difficulty/diet) - te są już
 * po polsku, wyliczone w mapRecipe.ts.
 */
export async function translateRecipes(recipes: Recipe[]): Promise<Recipe[]> {
  const texts: string[] = [];
  for (const recipe of recipes) {
    texts.push(recipe.title);
    for (const ingredient of recipe.ingredients) texts.push(ingredient.name);
    for (const step of recipe.steps) texts.push(step);
  }

  const translated = await translateTexts(texts, 'PL');

  let cursor = 0;
  const next = (): string => translated[cursor++];

  return recipes.map((recipe) => ({
    ...recipe,
    title: next(),
    ingredients: recipe.ingredients.map((ingredient) => ({ ...ingredient, name: next() })),
    steps: recipe.steps.map(() => next()),
  }));
}
