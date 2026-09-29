import { CATEGORIES, ProductUnit } from '../constants/fridge';
import { useProductsStore } from '../store/useProductsStore';
import { ShoppingItem } from '../store/useShoppingListStore';

/**
 * Zamienia tekstową ilość z listy zakupów ("200 g", "1,5 kg", "2 szt", "do smaku") na liczbę i jednostkę
 * produktu. Jednostki spoza listy (łyżka, szczypta...) traktujemy jak 1 szt - ilość i tak można poprawić w lodówce.
 */
export function parseShoppingQty(text: string): { qty: number; unit: ProductUnit } {
  const match = text.trim().toLowerCase().match(/^(\d+(?:[.,]\d+)?)\s*([^\d\s]*)/);
  if (!match) return { qty: 1, unit: 'szt' };
  const value = parseFloat(match[1].replace(',', '.'));
  const unit = match[2];
  if (!Number.isFinite(value) || value <= 0) return { qty: 1, unit: 'szt' };
  if (unit === 'g' || unit === 'ml' || unit === 'l') return { qty: value, unit };
  if (unit === 'kg') return { qty: value * 1000, unit: 'g' };
  if (unit.startsWith('opak')) return { qty: value, unit: 'opak.' };
  if (unit === '' || unit.startsWith('szt')) return { qty: value, unit: 'szt' };
  return { qty: 1, unit: 'szt' };
}

/**
 * Przenosi kupione pozycje do lodówki. Jeśli w lodówce jest już produkt o tej samej nazwie i jednostce,
 * zwiększa jego ilość zamiast tworzyć duplikat. Nowe produkty dostają domyślną kategorię (do edycji w lodówce).
 */
export function moveShoppingItemsToFridge(items: ShoppingItem[]): void {
  const { addProduct, setQuantity } = useProductsStore.getState();
  items.forEach((item) => {
    const { qty, unit } = parseShoppingQty(item.qty);
    const name = item.name.trim();
    const target = name.toLowerCase();
    const existing = useProductsStore
      .getState()
      .products.find((p) => p.unit === unit && [p.name, p.genericName].some((n) => n?.trim().toLowerCase() === target));
    if (existing) {
      setQuantity(existing.id, existing.qty + qty);
      return;
    }
    addProduct({ name, category: CATEGORIES[0], qty, unit, expiryDate: null });
  });
}
