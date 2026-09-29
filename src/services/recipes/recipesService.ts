import { Recipe } from '../../data/recipes';
import { Product } from '../../store/useProductsStore';
import { useRecipesStore } from '../../store/useRecipesStore';
import { useGenerationCacheStore } from '../../store/useGenerationCacheStore';
import { GeneratorFilters, productEnglishName } from '../../utils/recipeMatch';
import { generateRecipesFromIngredients } from '../gemini/generateRecipes';
import { searchFoodPhoto } from '../pexels/searchFoodPhoto';
import { ensureEnglishNames } from './ensureEnglishNames';
import { RECIPE_GENERATION_COUNT } from '../../constants/recipes';

const MAX_EXCLUDED_TITLES = 40;

function normalizeTitle(title: string): string {
  return title.trim().toLowerCase().replace(/\s+/g, ' ');
}

/** Ten sam zestaw filtrów i produktów (po angielskich nazwach) daje ten sam klucz. */
function cacheKey(products: Product[], filters: GeneratorFilters): string {
  const names = [...new Set(products.map((p) => productEnglishName(p).trim().toLowerCase()))].sort();
  return `${filters.meal}|${filters.taste}|${filters.difficulty}|${filters.diet}|${names.join(',')}`;
}

/**
 * Propozycje pod wybrane filtry. Bez `existingIds` zwraca zapisany wynik dla tych samych filtrów i produktów
 * (bez zapytania do Gemini). Z `existingIds` („Generuj więcej”) zawsze prosi Gemini o nowe przepisy, pomijając
 * już pokazane, i zwraca tylko te nowe; w cache zapisuje starą i nową listę razem.
 * Gemini zwraca teksty dla użytkownika od razu po polsku. Rzuca GeminiError.
 */
export async function getRecipesForFilters(
  products: Product[],
  filters: GeneratorFilters,
  options: { existingIds?: number[] } = {}
): Promise<Recipe[]> {
  const withEnglishNames = await ensureEnglishNames(products);
  const key = cacheKey(withEnglishNames, filters);
  const { recipes: known, addRecipes } = useRecipesStore.getState();
  const cache = useGenerationCacheStore.getState();

  if (!options.existingIds) {
    const cachedIds = cache.results[key];
    if (cachedIds?.length) {
      const cached = cachedIds.map((id) => known.find((r) => r.id === id));
      if (cached.every((r): r is Recipe => !!r)) {
        return cached;
      }
    }
  }

  const sameFilters = known.filter(
    (r) => r.meal === filters.meal && r.taste === filters.taste && r.difficulty === filters.difficulty && r.diet === filters.diet
  );
  // Najpierw tytuły już pokazane w tym widoku, potem pozostałe z tymi filtrami.
  const shownIds = new Set(options.existingIds ?? []);
  const shown = known.filter((r) => shownIds.has(r.id));
  const others = sameFilters.filter((r) => !shownIds.has(r.id));
  const excludeTitles = [...shown, ...others].slice(0, MAX_EXCLUDED_TITLES).map((r) => r.title);
  const knownTitles = new Set(known.map((r) => normalizeTitle(r.title)));

  const generated = await generateRecipesFromIngredients(withEnglishNames, filters, RECIPE_GENERATION_COUNT, excludeTitles);
  // Gemini bywa mimo prośby powtarza tytuły - nie wpuszczamy przepisów, które już mamy.
  const fresh = generated.filter((g) => !knownTitles.has(normalizeTitle(g.recipe.title)));
  const photos = await Promise.all(fresh.map((g) => searchFoodPhoto(g.photoQuery)));
  const recipes = fresh.map((g, i) => (photos[i] ? { ...g.recipe, ...photos[i] } : g.recipe));

  addRecipes(recipes);
  if (recipes.length > 0) cache.setResults(key, [...(options.existingIds ?? []), ...recipes.map((r) => r.id)]);
  return recipes;
}
