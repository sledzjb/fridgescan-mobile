import { useRecipesStore } from './useRecipesStore';
import { useFavoritesStore } from './useFavoritesStore';
import { useHistoryStore } from './useHistoryStore';
import { useGenerationCacheStore } from './useGenerationCacheStore';
import { MAX_STORED_RECIPES, MAX_CACHED_RESULTS, MAX_CACHED_PHOTOS, MAX_HISTORY_ENTRIES } from '../constants/storage';

function lastEntries<T>(record: Record<string, T>, max: number): Record<string, T> {
  const entries = Object.entries(record);
  return entries.length <= max ? record : Object.fromEntries(entries.slice(entries.length - max));
}

/**
 * Przycina dane, które tylko rosną. Wołać dopiero po wczytaniu wszystkich sklepów - inaczej lista
 * ulubionych mogłaby być jeszcze pusta i przepisy ulubione zostałyby usunięte.
 * Zapisuje tylko to, co faktycznie się zmieniło.
 */
export function pruneStorage(): void {
  const favoriteIds = new Set(useFavoritesStore.getState().recipeIds);

  // Przepisy: ulubione zawsze, z reszty najnowsze (nowe są na początku listy).
  const { recipes } = useRecipesStore.getState();
  let keptOthers = 0;
  const keptRecipes = recipes.filter((r) => favoriteIds.has(r.id) || ++keptOthers <= MAX_STORED_RECIPES);
  if (keptRecipes.length !== recipes.length) useRecipesStore.setState({ recipes: keptRecipes });

  // Cache wyników: wyrzucamy wpisy wskazujące na usunięte przepisy, potem przycinamy do limitu.
  const existingIds = new Set(keptRecipes.map((r) => r.id));
  const { results, photos } = useGenerationCacheStore.getState();
  const validResults = Object.fromEntries(
    Object.entries(results).filter(([, ids]) => ids.every((id) => existingIds.has(id)))
  );
  const nextResults = lastEntries(validResults, MAX_CACHED_RESULTS);
  const nextPhotos = lastEntries(photos, MAX_CACHED_PHOTOS);
  if (Object.keys(nextResults).length !== Object.keys(results).length || nextPhotos !== photos) {
    useGenerationCacheStore.setState({ results: nextResults, photos: nextPhotos });
  }

  // Historia: najnowsze wpisy są na początku.
  const { entries } = useHistoryStore.getState();
  if (entries.length > MAX_HISTORY_ENTRIES) {
    useHistoryStore.setState({ entries: entries.slice(0, MAX_HISTORY_ENTRIES) });
  }
}
