import { RecipeImageCredit } from '../../data/recipes';
import { useGenerationCacheStore } from '../../store/useGenerationCacheStore';
import { API_URL } from '../../constants/api';

const REQUEST_TIMEOUT_MS = 8000;

export type FoodPhoto = { imageUrl: string; imageCredit: RecipeImageCredit };

const inFlight = new Map<string, Promise<FoodPhoto | null>>();
/** Frazy, które w tej sesji zakończyły się błędem - nie ponawiamy ich przy każdym renderze listy. */
const failedThisSession = new Set<string>();

/**
 * Zdjęcie poglądowe do przepisu albo produktu (nie dokładnie to samo). Nigdy nie rzuca - brak adresu proxy, błąd sieci
 * albo brak wyników oznaczają po prostu brak zdjęcia i UI pokazuje ikonę zastępczą.
 * Wyniki (także „brak zdjęcia”) są cache'owane po frazie, żeby nie pytać Pexels o to samo drugi raz.
 * Błędy (sieć, HTTP) nie trafiają do cache - następnym razem spróbujemy ponownie.
 */
export function searchFoodPhoto(query: string): Promise<FoodPhoto | null> {
  const cacheKey = query.trim().toLowerCase();
  if (!cacheKey) return Promise.resolve(null);

  const cached = useGenerationCacheStore.getState().photos[cacheKey];
  if (cached) return Promise.resolve('none' in cached ? null : cached);
  if (failedThisSession.has(cacheKey)) return Promise.resolve(null);

  // Kilka wierszy z tą samą frazą naraz (np. lista lodówki) daje jedno zapytanie.
  const pending = inFlight.get(cacheKey);
  if (pending) return pending;

  const request = fetchPhoto(cacheKey).finally(() => inFlight.delete(cacheKey));
  inFlight.set(cacheKey, request);
  return request;
}

async function fetchPhoto(cacheKey: string): Promise<FoodPhoto | null> {
  if (!API_URL) return null;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    // Proxy (worker/) dokleja klucz Pexels i ustawia per_page=1, orientation=landscape.
    const url = `${API_URL}/photos?query=${encodeURIComponent(`${cacheKey} food`)}`;
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) {
      failedThisSession.add(cacheKey);
      return null;
    }
    const data = await response.json();
    const photo = data.photos?.[0];
    if (!photo?.src?.medium) {
      useGenerationCacheStore.getState().setPhoto(cacheKey, { none: true });
      return null;
    }
    const result: FoodPhoto = {
      imageUrl: photo.src.medium,
      imageCredit: { photographer: photo.photographer, url: photo.url },
    };
    useGenerationCacheStore.getState().setPhoto(cacheKey, result);
    return result;
  } catch {
    failedThisSession.add(cacheKey);
    return null;
  } finally {
    clearTimeout(timer);
  }
}
