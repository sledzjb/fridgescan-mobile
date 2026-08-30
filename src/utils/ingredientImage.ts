import { INGREDIENT_IMAGE_NAMES } from '../constants/ingredientImages';

function normalize(name: string): string {
  return name
    .toLowerCase()
    .replace(/\d+([.,]\d+)?\s*%?/g, '') // liczby, ilości, procenty (np. „3,2%”)
    .replace(/[()]/g, '')
    .trim();
}

function buildUrl(englishName: string): string {
  return `https://www.themealdb.com/images/ingredients/${encodeURIComponent(englishName)}-Small.png`;
}

/** Zwraca URL miniatury z TheMealDB dla polskiej nazwy produktu, albo null gdy brak dopasowania. */
export function getIngredientThumbnailUrl(productName: string): string | null {
  const normalized = normalize(productName);
  if (!normalized) return null;

  if (INGREDIENT_IMAGE_NAMES[normalized]) {
    return buildUrl(INGREDIENT_IMAGE_NAMES[normalized]);
  }

  const key = Object.keys(INGREDIENT_IMAGE_NAMES).find(
    (k) => normalized.includes(k) || k.includes(normalized)
  );
  return key ? buildUrl(INGREDIENT_IMAGE_NAMES[key]) : null;
}
