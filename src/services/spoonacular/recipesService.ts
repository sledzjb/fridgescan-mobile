import { Recipe, RECIPES } from '../../data/recipes';
import { spoonacularComplexSearch, SpoonacularError } from './client';
import { mapSpoonacularRecipes, hasUsableContent } from './mapRecipe';
import { getFixtureCatalog } from './fixtures';
import {
  getCachedCatalog,
  setCachedCatalog,
  isFresh,
  getLastKnownQuotaLeft,
  setLastKnownQuotaLeft,
} from './cache';
import { CATALOG_DISH_TYPES, RECIPES_PER_DISH_TYPE, QUOTA_SAFETY_BUFFER_POINTS } from '../../constants/spoonacular';
import { SpoonacularRecipe } from './types';
import { translateRecipes } from '../deepl/translateRecipes';

export type RecipeSource = 'live' | 'cache' | 'fixtures' | 'mock';
export type RecipeCatalogResult = { recipes: Recipe[]; source: RecipeSource };

function dedupeById(recipes: SpoonacularRecipe[]): SpoonacularRecipe[] {
  const seen = new Set<number>();
  return recipes.filter((r) => {
    if (seen.has(r.id)) return false;
    seen.add(r.id);
    return true;
  });
}

async function fetchLiveCatalog(): Promise<SpoonacularRecipe[]> {
  const results: SpoonacularRecipe[] = [];

  for (const type of CATALOG_DISH_TYPES) {
    try {
      const { data, quotaLeft } = await spoonacularComplexSearch({ type, number: RECIPES_PER_DISH_TYPE });
      results.push(...data.results.filter(hasUsableContent));

      if (quotaLeft !== null) {
        await setLastKnownQuotaLeft(quotaLeft);
        if (quotaLeft < QUOTA_SAFETY_BUFFER_POINTS) break; // resztę zapytań odpuszczamy - punkty na dziś się kończą
      }
    } catch (e) {
      if (e instanceof SpoonacularError && (e.code === 'NO_API_KEY' || e.code === 'QUOTA_EXCEEDED')) {
        throw e;
      }
      // Pojedyncza partycja padła (np. przejściowy błąd sieci) - kontynuujemy resztę,
      // częściowy katalog jest lepszy niż żaden.
    }
  }

  const deduped = dedupeById(results);
  if (deduped.length === 0) {
    throw new SpoonacularError('NETWORK', 'Żadna partycja complexSearch się nie powiodła');
  }
  return deduped;
}

export async function fetchRecipeCatalog(): Promise<RecipeCatalogResult> {
  if (process.env.EXPO_PUBLIC_USE_FIXTURES === 'true') {
    return { recipes: mapSpoonacularRecipes(getFixtureCatalog()), source: 'fixtures' };
  }

  const cached = await getCachedCatalog();
  if (cached && isFresh(cached.cachedAt)) {
    return { recipes: cached.recipes, source: 'cache' };
  }

  const lastKnownQuota = await getLastKnownQuotaLeft();
  if (lastKnownQuota !== null && lastKnownQuota < QUOTA_SAFETY_BUFFER_POINTS) {
    if (cached) return { recipes: cached.recipes, source: 'cache' };
    return { recipes: RECIPES, source: 'mock' };
  }

  try {
    const raw = await fetchLiveCatalog();
    const mapped = mapSpoonacularRecipes(raw);
    const recipes = await translateRecipes(mapped);
    await setCachedCatalog(recipes);
    return { recipes, source: 'live' };
  } catch {
    if (cached) return { recipes: cached.recipes, source: 'cache' };
    return { recipes: RECIPES, source: 'mock' };
  }
}
