/**
 * Mapowanie polskich nazw produktów na angielskie nazwy składników w TheMealDB
 * (https://www.themealdb.com/images/ingredients/<Nazwa>-Small.png). Prototypowe
 * rozwiązanie - jak w oryginalnym designie (patrz sekcja „Assets” w README).
 * Tylko potwierdzone, istniejące w bazie pozycje; reszta korzysta z fallbacku
 * (pierwsza litera nazwy na tle primary50).
 */
export const INGREDIENT_IMAGE_NAMES: Record<string, string> = {
  jajka: 'Eggs',
  jajko: 'Eggs',
  szpinak: 'Spinach',
  feta: 'Feta',
  masło: 'Butter',
  pieczarki: 'Mushrooms',
  szczypiorek: 'Chives',
  mąka: 'Flour',
  mleko: 'Milk',
  jabłko: 'Apples',
  jabłka: 'Apples',
  'makaron penne': 'Penne Rigate',
  makaron: 'Penne Rigate',
  'pierś z kurczaka': 'Chicken Breast',
  kurczak: 'Chicken Breast',
  brokuł: 'Broccoli',
  brokuły: 'Broccoli',
  śmietana: 'Double Cream',
  czosnek: 'Garlic',
  'ser żółty': 'Cheddar Cheese',
  ser: 'Cheddar Cheese',
  bulion: 'Chicken Stock',
  'ciasto kruche': 'Shortcrust Pastry',
  por: 'Leek',
  pieczywo: 'Bread',
  chleb: 'Bread',
  szynka: 'Ham',
  ryż: 'Rice',
  cynamon: 'Cinnamon',
  cukier: 'Sugar',
  ziemniaki: 'Potatoes',
  ziemniak: 'Potatoes',
  cebula: 'Onion',
  pomidory: 'Tomatoes',
  pomidor: 'Tomatoes',
  'jogurt naturalny': 'Yogurt',
  jogurt: 'Yogurt',
  sól: 'Salt',
  pieprz: 'Pepper',
};
