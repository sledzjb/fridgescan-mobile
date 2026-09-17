import { SpoonacularRecipe } from './types';

/**
 * Dane do trybu deweloperskiego (EXPO_PUBLIC_USE_FIXTURES=true) - pozwalają iterować nad UI
 * bez zużywania limitów Spoonacular i DeepL. Struktura zgodna z realną odpowiedzią Spoonacular
 * complexSearch (addRecipeInformation+addRecipeNutrition), ale treść jest ręcznie spisana, nie
 * nagrana z żywego API - nie mamy klucza w tym środowisku. Tytuły/składniki/kroki są od razu
 * po polsku (tryb fixture pomija tłumaczenie DeepL), dishTypes/diets zostają po angielsku, bo
 * to na nich opiera się mapRecipe.ts przy wyliczaniu meal/taste/difficulty/diet.
 */
const FIXTURE_RECIPES: SpoonacularRecipe[] = [
  {
    id: 101,
    title: 'Puszyste placki z syropem klonowym',
    image: 'https://img.spoonacular.com/recipes/101-556x370.jpg',
    readyInMinutes: 20,
    servings: 4,
    vegetarian: true,
    vegan: false,
    glutenFree: false,
    dishTypes: ['breakfast', 'brunch'],
    diets: ['vegetarian'],
    extendedIngredients: [
      { id: 1, name: 'mąka', original: '2 cups all-purpose flour', amount: 2, unit: 'szklanki' },
      { id: 2, name: 'mleko', original: '1.5 cups milk', amount: 1.5, unit: 'szklanki' },
      { id: 3, name: 'jajka', original: '2 eggs', amount: 2, unit: '' },
      { id: 4, name: 'cukier', original: '2 tbsp sugar', amount: 2, unit: 'łyżki' },
      { id: 5, name: 'proszek do pieczenia', original: '1 tbsp baking powder', amount: 1, unit: 'łyżka' },
    ],
    analyzedInstructions: [
      {
        name: '',
        steps: [
          { number: 1, step: 'Wymieszaj mąkę, cukier i proszek do pieczenia.' },
          { number: 2, step: 'Dodaj mleko i jajka, mieszaj do uzyskania gładkiej masy.' },
          { number: 3, step: 'Smaż porcje ciasta na rozgrzanej patelni aż pojawią się bąbelki.' },
          { number: 4, step: 'Przewróć i smaż do zarumienienia. Podawaj z syropem klonowym.' },
        ],
      },
    ],
    nutrition: {
      nutrients: [
        { name: 'Calories', amount: 320, unit: 'kcal' },
        { name: 'Protein', amount: 10, unit: 'g' },
        { name: 'Fat', amount: 6, unit: 'g' },
        { name: 'Carbohydrates', amount: 55, unit: 'g' },
      ],
    },
  },
  {
    id: 102,
    title: 'Tost z awokado i jajkiem w koszulce',
    image: 'https://img.spoonacular.com/recipes/102-556x370.jpg',
    readyInMinutes: 15,
    servings: 2,
    vegetarian: true,
    vegan: false,
    glutenFree: false,
    dishTypes: ['breakfast', 'morning meal'],
    diets: ['vegetarian'],
    extendedIngredients: [
      { id: 6, name: 'chleb na zakwasie', original: '2 slices sourdough bread', amount: 2, unit: 'kromki' },
      { id: 7, name: 'awokado', original: '1 ripe avocado', amount: 1, unit: '' },
      { id: 8, name: 'jajka', original: '2 eggs', amount: 2, unit: '' },
      { id: 9, name: 'sok z cytryny', original: '1 tsp lemon juice', amount: 1, unit: 'łyżeczka' },
    ],
    analyzedInstructions: [
      {
        name: '',
        steps: [
          { number: 1, step: 'Opiecz kromki chleba w tosterze.' },
          { number: 2, step: 'Rozgnieć awokado z sokiem z cytryny, solą i pieprzem.' },
          { number: 3, step: 'Gotuj jajka w koszulce we wrzątku przez 3 minuty.' },
          { number: 4, step: 'Posmaruj tosty awokado i połóż na wierzchu jajko.' },
        ],
      },
    ],
    nutrition: {
      nutrients: [
        { name: 'Calories', amount: 290, unit: 'kcal' },
        { name: 'Protein', amount: 13, unit: 'g' },
        { name: 'Fat', amount: 18, unit: 'g' },
        { name: 'Carbohydrates', amount: 22, unit: 'g' },
      ],
    },
  },
  {
    id: 201,
    title: 'Kremowy makaron z kurczakiem i brokułem',
    image: 'https://img.spoonacular.com/recipes/201-556x370.jpg',
    readyInMinutes: 35,
    servings: 4,
    vegetarian: false,
    vegan: false,
    glutenFree: false,
    dishTypes: ['main course', 'dinner', 'lunch'],
    diets: [],
    extendedIngredients: [
      { id: 10, name: 'makaron penne', original: '300g penne pasta', amount: 300, unit: 'g' },
      { id: 11, name: 'pierś z kurczaka', original: '400g chicken breast', amount: 400, unit: 'g' },
      { id: 12, name: 'brokuł', original: '1 head broccoli', amount: 1, unit: '' },
      { id: 13, name: 'śmietana kremówka', original: '200ml heavy cream', amount: 200, unit: 'ml' },
      { id: 14, name: 'czosnek', original: '2 cloves garlic', amount: 2, unit: 'ząbki' },
    ],
    analyzedInstructions: [
      {
        name: '',
        steps: [
          { number: 1, step: 'Ugotuj makaron według instrukcji na opakowaniu, dodając brokuł na ostatnie 4 minuty.' },
          { number: 2, step: 'Podsmaż pokrojonego kurczaka z czosnkiem, aż się usmaży.' },
          { number: 3, step: 'Dodaj śmietanę, gotuj 3 minuty.' },
          { number: 4, step: 'Połącz z makaronem i brokułem, dopraw i podawaj.' },
        ],
      },
    ],
    nutrition: {
      nutrients: [
        { name: 'Calories', amount: 610, unit: 'kcal' },
        { name: 'Protein', amount: 40, unit: 'g' },
        { name: 'Fat', amount: 20, unit: 'g' },
        { name: 'Carbohydrates', amount: 65, unit: 'g' },
      ],
    },
  },
  {
    id: 202,
    title: 'Wegetariańskie risotto z pieczarkami',
    image: 'https://img.spoonacular.com/recipes/202-556x370.jpg',
    readyInMinutes: 45,
    servings: 4,
    vegetarian: true,
    vegan: false,
    glutenFree: true,
    dishTypes: ['main course', 'dinner'],
    diets: ['vegetarian', 'gluten free'],
    extendedIngredients: [
      { id: 15, name: 'ryż arborio', original: '300g arborio rice', amount: 300, unit: 'g' },
      { id: 16, name: 'pieczarki', original: '300g mushrooms', amount: 300, unit: 'g' },
      { id: 17, name: 'bulion warzywny', original: '1L vegetable stock', amount: 1, unit: 'l' },
      { id: 18, name: 'parmezan', original: '60g parmesan', amount: 60, unit: 'g' },
      { id: 19, name: 'masło', original: '40g butter', amount: 40, unit: 'g' },
    ],
    analyzedInstructions: [
      {
        name: '',
        steps: [
          { number: 1, step: 'Podsmaż pieczarki na maśle, odłóż na bok.' },
          { number: 2, step: 'Zeszklij ryż, stopniowo podlewaj bulionem, ciągle mieszając.' },
          { number: 3, step: 'Gotuj 18 minut, aż będzie kremowe.' },
          { number: 4, step: 'Wmieszaj pieczarki i parmezan przed podaniem.' },
        ],
      },
    ],
    nutrition: {
      nutrients: [
        { name: 'Calories', amount: 520, unit: 'kcal' },
        { name: 'Protein', amount: 14, unit: 'g' },
        { name: 'Fat', amount: 18, unit: 'g' },
        { name: 'Carbohydrates', amount: 70, unit: 'g' },
      ],
    },
  },
  {
    id: 301,
    title: 'Klasyczny sernik nowojorski',
    image: 'https://img.spoonacular.com/recipes/301-556x370.jpg',
    readyInMinutes: 90,
    servings: 8,
    vegetarian: true,
    vegan: false,
    glutenFree: false,
    dishTypes: ['dessert'],
    diets: ['vegetarian'],
    extendedIngredients: [
      { id: 20, name: 'serek śmietankowy', original: '600g cream cheese', amount: 600, unit: 'g' },
      { id: 21, name: 'cukier', original: '150g sugar', amount: 150, unit: 'g' },
      { id: 22, name: 'jajka', original: '3 eggs', amount: 3, unit: '' },
      { id: 23, name: 'herbatniki', original: '200g graham crackers', amount: 200, unit: 'g' },
      { id: 24, name: 'masło', original: '80g melted butter', amount: 80, unit: 'g' },
    ],
    analyzedInstructions: [
      {
        name: '',
        steps: [
          { number: 1, step: 'Zmiksuj pokruszone herbatniki z masłem, wyłóż nimi tortownicę.' },
          { number: 2, step: 'Zmiksuj serek śmietankowy z cukrem na gładką masę.' },
          { number: 3, step: 'Dodawaj jajka jedno po drugim, delikatnie mieszając.' },
          { number: 4, step: 'Wylej na spód i piecz w 160°C przez 55 minut.' },
        ],
      },
    ],
    nutrition: {
      nutrients: [
        { name: 'Calories', amount: 410, unit: 'kcal' },
        { name: 'Protein', amount: 7, unit: 'g' },
        { name: 'Fat', amount: 28, unit: 'g' },
        { name: 'Carbohydrates', amount: 34, unit: 'g' },
      ],
    },
  },
  {
    id: 302,
    title: 'Ciasto czekoladowe z płynnym środkiem',
    image: 'https://img.spoonacular.com/recipes/302-556x370.jpg',
    readyInMinutes: 25,
    servings: 4,
    vegetarian: true,
    vegan: false,
    glutenFree: false,
    dishTypes: ['dessert'],
    diets: ['vegetarian'],
    extendedIngredients: [
      { id: 25, name: 'gorzka czekolada', original: '150g dark chocolate', amount: 150, unit: 'g' },
      { id: 26, name: 'masło', original: '150g butter', amount: 150, unit: 'g' },
      { id: 27, name: 'jajka', original: '3 eggs', amount: 3, unit: '' },
      { id: 28, name: 'cukier', original: '100g sugar', amount: 100, unit: 'g' },
      { id: 29, name: 'mąka', original: '50g flour', amount: 50, unit: 'g' },
    ],
    analyzedInstructions: [
      {
        name: '',
        steps: [
          { number: 1, step: 'Roztop razem czekoladę i masło.' },
          { number: 2, step: 'Ubij jajka z cukrem, wmieszaj do czekolady.' },
          { number: 3, step: 'Wmieszaj mąkę, przelej do foremek.' },
          { number: 4, step: 'Piecz w 200°C przez 10-12 minut, aż brzegi się zetną, a środek zostanie płynny.' },
        ],
      },
    ],
    nutrition: {
      nutrients: [
        { name: 'Calories', amount: 480, unit: 'kcal' },
        { name: 'Protein', amount: 6, unit: 'g' },
        { name: 'Fat', amount: 32, unit: 'g' },
        { name: 'Carbohydrates', amount: 42, unit: 'g' },
      ],
    },
  },
  {
    id: 401,
    title: 'Miska z komosą ryżową i pieczonymi warzywami',
    image: 'https://img.spoonacular.com/recipes/401-556x370.jpg',
    readyInMinutes: 40,
    servings: 3,
    vegetarian: true,
    vegan: true,
    glutenFree: true,
    dishTypes: ['side dish', 'lunch', 'main course'],
    diets: ['vegan', 'vegetarian', 'gluten free'],
    extendedIngredients: [
      { id: 30, name: 'komosa ryżowa', original: '200g quinoa', amount: 200, unit: 'g' },
      { id: 31, name: 'cukinia', original: '1 zucchini', amount: 1, unit: '' },
      { id: 32, name: 'papryka', original: '2 bell peppers', amount: 2, unit: '' },
      { id: 33, name: 'oliwa z oliwek', original: '3 tbsp olive oil', amount: 3, unit: 'łyżki' },
      { id: 34, name: 'ciecierzyca', original: '1 can chickpeas', amount: 1, unit: 'puszka' },
    ],
    analyzedInstructions: [
      {
        name: '',
        steps: [
          { number: 1, step: 'Ugotuj komosę ryżową według instrukcji na opakowaniu.' },
          { number: 2, step: 'Wymieszaj pokrojone warzywa i ciecierzycę z oliwą.' },
          { number: 3, step: 'Piecz w 200°C przez 25 minut.' },
          { number: 4, step: 'Połącz z komosą ryżową i dopraw do smaku.' },
        ],
      },
    ],
    nutrition: {
      nutrients: [
        { name: 'Calories', amount: 380, unit: 'kcal' },
        { name: 'Protein', amount: 13, unit: 'g' },
        { name: 'Fat', amount: 14, unit: 'g' },
        { name: 'Carbohydrates', amount: 52, unit: 'g' },
      ],
    },
  },
  {
    id: 402,
    title: 'Grillowany łosoś z masłem cytrynowym',
    image: 'https://img.spoonacular.com/recipes/402-556x370.jpg',
    readyInMinutes: 25,
    servings: 2,
    vegetarian: false,
    vegan: false,
    glutenFree: true,
    dishTypes: ['main course', 'dinner'],
    diets: ['gluten free', 'pescatarian'],
    extendedIngredients: [
      { id: 35, name: 'filet z łososia', original: '2 salmon fillets', amount: 2, unit: '' },
      { id: 36, name: 'masło', original: '40g butter', amount: 40, unit: 'g' },
      { id: 37, name: 'cytryna', original: '1 lemon', amount: 1, unit: '' },
      { id: 38, name: 'czosnek', original: '2 cloves garlic', amount: 2, unit: 'ząbki' },
    ],
    analyzedInstructions: [
      {
        name: '',
        steps: [
          { number: 1, step: 'Dopraw łososia solą i pieprzem.' },
          { number: 2, step: 'Grilluj skórą do dołu przez 4 minuty, przewróć i grilluj kolejne 3 minuty.' },
          { number: 3, step: 'Roztop masło z czosnkiem i sokiem z cytryny.' },
          { number: 4, step: 'Polej łososia i podawaj.' },
        ],
      },
    ],
    nutrition: {
      nutrients: [
        { name: 'Calories', amount: 390, unit: 'kcal' },
        { name: 'Protein', amount: 34, unit: 'g' },
        { name: 'Fat', amount: 26, unit: 'g' },
        { name: 'Carbohydrates', amount: 3, unit: 'g' },
      ],
    },
  },
];

export function getFixtureCatalog(): SpoonacularRecipe[] {
  return FIXTURE_RECIPES;
}
