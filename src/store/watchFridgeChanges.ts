import { Product, useProductsStore } from './useProductsStore';
import { useGenerationCacheStore } from './useGenerationCacheStore';

/** Skład lodówki: które produkty i pod jakimi nazwami. Ilość, termin i tłumaczenie (nameEn) nie są zmianą składu. */
function fridgeSignature(products: Product[]): string {
  return products
    .map((p) => `${p.id}:${p.name}:${p.genericName ?? ''}`)
    .sort()
    .join('|');
}

/**
 * Gdy zmieni się zawartość lodówki (dodanie, usunięcie albo zmiana nazwy produktu), czyści zapisane
 * wyniki generatora, żeby „Generuj” nie zwracał propozycji zrobionych pod starą lodówkę.
 * Same przepisy (Wszystkie przepisy, ulubione) zostają. Wołać po wczytaniu sklepów; zwraca funkcję zatrzymującą nasłuch.
 */
export function watchFridgeChanges(): () => void {
  let lastSignature = fridgeSignature(useProductsStore.getState().products);

  return useProductsStore.subscribe((state) => {
    const signature = fridgeSignature(state.products);
    if (signature === lastSignature) return;
    lastSignature = signature;
    if (Object.keys(useGenerationCacheStore.getState().results).length > 0) {
      useGenerationCacheStore.setState({ results: {} });
    }
  });
}
