import { Product, useProductsStore } from '../../store/useProductsStore';
import { generateContentWithFallback } from '../gemini/client';

const SCHEMA = { type: 'ARRAY', items: { type: 'STRING' } };

/**
 * Uzupełnia Product.nameEn dla produktów, które go nie mają (dodane ręcznie, edytowane, sprzed tej funkcji).
 * Jedno zapytanie na wszystkie brakujące nazwy; wynik jest zapisywany w produkcie, więc każda nazwa
 * jest tłumaczona raz. Błąd tłumaczenia nie blokuje generowania - produkt użyje wtedy swojej nazwy.
 */
export async function ensureEnglishNames(products: Product[]): Promise<Product[]> {
  const missing = products.filter((p) => !p.nameEn);
  if (missing.length === 0) return products;

  try {
    const names = missing.map((p) => p.genericName || p.name);
    const text = await generateContentWithFallback({
      contents: [
        {
          parts: [
            {
              text:
                `Translate these grocery product names into short generic English ingredient names, the way a ` +
                `recipe would list them (no brands, no varieties), e.g. "Ser Gouda" -> "Yellow cheese". ` +
                `Return a JSON array of exactly ${names.length} strings in the same order. Names: ${JSON.stringify(names)}`,
            },
          ],
        },
      ],
      generationConfig: { response_mime_type: 'application/json', response_schema: SCHEMA },
    }, { requestTimeoutMs: 12000, totalTimeoutMs: 15000 });

    const parsed: unknown = JSON.parse(text);
    if (!Array.isArray(parsed) || parsed.length !== missing.length || parsed.some((n) => typeof n !== 'string' || !n.trim())) {
      return products;
    }

    const translated = new Map(missing.map((p, i) => [p.id, (parsed[i] as string).trim()]));
    const { updateProduct } = useProductsStore.getState();
    translated.forEach((nameEn, id) => updateProduct(id, { nameEn }));
    return products.map((p) => (translated.has(p.id) ? { ...p, nameEn: translated.get(p.id) } : p));
  } catch {
    return products;
  }
}
