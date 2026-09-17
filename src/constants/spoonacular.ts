/**
 * Darmowy tier Spoonacular liczy limit w punktach, nie w liczbie zapytań - jedno zapytanie
 * complexSearch z addRecipeInformation+addRecipeNutrition kosztuje ~1 + 0.085 * liczba_wyników
 * punktów (zmierzone empirycznie: number=10 -> 1.85 pkt). Dzienny limit to 50 punktów.
 * Realną wartość bierzemy z nagłówka X-Api-Quota-Left zwracanego przez Spoonacular przy
 * każdej odpowiedzi - nie zgadujemy kosztu z góry.
 */
export const QUOTA_SAFETY_BUFFER_POINTS = 5;

/** Katalog przepisów zmienia się rzadko - długi TTL oszczędza dzienny limit punktów. */
export const CATALOG_TTL_MS = 14 * 24 * 60 * 60 * 1000;

/**
 * Jedno zapytanie complexSearch na typ dania. number=50 kosztuje ~5.25 pkt/zapytanie,
 * czyli ~21 pkt za pełne odświeżenie (4 typy) - wygodny zapas pod przewijanie "Wszystkich
 * przepisów", a i tak płacimy to raz na CATALOG_TTL_MS, nie przy każdym scrollu użytkownika.
 */
export const CATALOG_DISH_TYPES = ['breakfast', 'main course', 'side dish', 'dessert'] as const;

export const RECIPES_PER_DISH_TYPE = 50;
