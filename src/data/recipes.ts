export type Meal = 'Śniadanie' | 'Obiad' | 'Kolacja';
export type Taste = 'Na słodko' | 'Na słono';
export type Difficulty = 'Proste' | 'Złożone';
export type Audience = 'Dla dzieci' | 'Dla dorosłych';

export type NutrientRow = { value: string; unit: string };
export type RecipeIngredient = { name: string; qty: string };

export type Recipe = {
  id: number;
  title: string;
  meal: Meal;
  taste: Taste;
  difficulty: Difficulty;
  audience: Audience;
  time: string;
  vegetarian: boolean;
  nutrition: NutrientRow[];
  ingredients: RecipeIngredient[];
  steps: string[];
};

/** 1:1 z zestawem przykładowych przepisów w prototypie (design/FridgeScan v2.dc.html). */
export const RECIPES: Recipe[] = [
  {
    id: 1,
    title: 'Omlet ze szpinakiem i fetą',
    meal: 'Śniadanie',
    taste: 'Na słono',
    difficulty: 'Proste',
    audience: 'Dla dzieci',
    time: '15 min',
    vegetarian: true,
    nutrition: [
      { value: '312', unit: 'kcal' },
      { value: '21 g', unit: 'białko' },
      { value: '22 g', unit: 'tłuszcz' },
      { value: '5 g', unit: 'węgl.' },
    ],
    ingredients: [
      { name: 'Jajka', qty: '3 szt' },
      { name: 'Szpinak', qty: '100 g' },
      { name: 'Feta', qty: '60 g' },
      { name: 'Masło', qty: '15 g' },
      { name: 'Sól, pieprz', qty: 'do smaku' },
    ],
    steps: [
      'Rozgrzej masło na patelni na średnim ogniu.',
      'Wrzuć szpinak, smaż 2 minuty aż zwiędnie.',
      'Zalej roztrzepanymi jajkami, posyp pokruszoną fetą.',
      'Przykryj i smaż 4 minuty. Podawaj od razu.',
    ],
  },
  {
    id: 2,
    title: 'Jajecznica z pieczarkami',
    meal: 'Śniadanie',
    taste: 'Na słono',
    difficulty: 'Proste',
    audience: 'Dla dzieci',
    time: '12 min',
    vegetarian: true,
    nutrition: [
      { value: '286', unit: 'kcal' },
      { value: '19 g', unit: 'białko' },
      { value: '20 g', unit: 'tłuszcz' },
      { value: '4 g', unit: 'węgl.' },
    ],
    ingredients: [
      { name: 'Jajka', qty: '3 szt' },
      { name: 'Pieczarki', qty: '150 g' },
      { name: 'Masło', qty: '15 g' },
      { name: 'Szczypiorek', qty: 'garść' },
    ],
    steps: [
      'Pokrój pieczarki w plastry, podsmaż na maśle 5 minut.',
      'Wlej roztrzepane jajka, mieszaj na małym ogniu.',
      'Zdejmij z ognia, gdy jajka są jeszcze wilgotne.',
      'Posyp szczypiorkiem i dopraw.',
    ],
  },
  {
    id: 3,
    title: 'Naleśniki z twarogiem i jabłkiem',
    meal: 'Śniadanie',
    taste: 'Na słodko',
    difficulty: 'Proste',
    audience: 'Dla dzieci',
    time: '25 min',
    vegetarian: true,
    nutrition: [
      { value: '418', unit: 'kcal' },
      { value: '16 g', unit: 'białko' },
      { value: '13 g', unit: 'tłuszcz' },
      { value: '58 g', unit: 'węgl.' },
    ],
    ingredients: [
      { name: 'Mąka', qty: '200 g' },
      { name: 'Mleko', qty: '300 ml' },
      { name: 'Jajka', qty: '2 szt' },
      { name: 'Twaróg', qty: '200 g' },
      { name: 'Jabłko', qty: '1 szt' },
    ],
    steps: [
      'Zmiksuj mąkę, mleko i jajka na gładkie ciasto.',
      'Smaż cienkie naleśniki na rozgrzanej patelni.',
      'Zetrzyj jabłko, wymieszaj z twarogiem.',
      'Nałóż farsz, zwiń i posyp cynamonem.',
    ],
  },
  {
    id: 4,
    title: 'Makaron z kurczakiem i brokułem',
    meal: 'Obiad',
    taste: 'Na słono',
    difficulty: 'Proste',
    audience: 'Dla dzieci',
    time: '30 min',
    vegetarian: false,
    nutrition: [
      { value: '612', unit: 'kcal' },
      { value: '42 g', unit: 'białko' },
      { value: '18 g', unit: 'tłuszcz' },
      { value: '66 g', unit: 'węgl.' },
    ],
    ingredients: [
      { name: 'Makaron penne', qty: '250 g' },
      { name: 'Pierś z kurczaka', qty: '300 g' },
      { name: 'Brokuł', qty: '1 szt' },
      { name: 'Śmietana 30%', qty: '200 ml' },
      { name: 'Czosnek', qty: '2 ząbki' },
    ],
    steps: [
      'Ugotuj makaron al dente, dodając brokuł na ostatnie 4 minuty.',
      'Podsmaż pokrojonego kurczaka z czosnkiem.',
      'Dodaj śmietanę, gotuj 3 minuty.',
      'Połącz z makaronem i dopraw.',
    ],
  },
  {
    id: 5,
    title: 'Risotto z pieczarkami',
    meal: 'Obiad',
    taste: 'Na słono',
    difficulty: 'Złożone',
    audience: 'Dla dorosłych',
    time: '45 min',
    vegetarian: true,
    nutrition: [
      { value: '524', unit: 'kcal' },
      { value: '14 g', unit: 'białko' },
      { value: '19 g', unit: 'tłuszcz' },
      { value: '72 g', unit: 'węgl.' },
    ],
    ingredients: [
      { name: 'Ryż arborio', qty: '250 g' },
      { name: 'Pieczarki', qty: '300 g' },
      { name: 'Masło', qty: '40 g' },
      { name: 'Ser żółty', qty: '60 g' },
      { name: 'Bulion', qty: '1 l' },
    ],
    steps: [
      'Podsmaż pieczarki na maśle, odłóż.',
      'Zeszklij ryż, podlewaj bulionem porcjami.',
      'Mieszaj 18 minut, aż ryż będzie kremowy.',
      'Wmieszaj pieczarki i starty ser.',
    ],
  },
  {
    id: 6,
    title: 'Tarta z porem i serem',
    meal: 'Kolacja',
    taste: 'Na słono',
    difficulty: 'Złożone',
    audience: 'Dla dorosłych',
    time: '55 min',
    vegetarian: true,
    nutrition: [
      { value: '486', unit: 'kcal' },
      { value: '17 g', unit: 'białko' },
      { value: '32 g', unit: 'tłuszcz' },
      { value: '30 g', unit: 'węgl.' },
    ],
    ingredients: [
      { name: 'Ciasto kruche', qty: '1 opak.' },
      { name: 'Por', qty: '2 szt' },
      { name: 'Ser żółty', qty: '150 g' },
      { name: 'Jajka', qty: '3 szt' },
      { name: 'Śmietana', qty: '200 ml' },
    ],
    steps: [
      'Wyłóż formę ciastem, podpiecz 12 minut.',
      'Poddusz pora na maśle.',
      'Wymieszaj jajka ze śmietaną i serem.',
      'Wylej na ciasto, piecz 30 minut w 180°C.',
    ],
  },
  {
    id: 7,
    title: 'Zapiekanka z jajkiem i szynką',
    meal: 'Kolacja',
    taste: 'Na słono',
    difficulty: 'Proste',
    audience: 'Dla dzieci',
    time: '20 min',
    vegetarian: false,
    nutrition: [
      { value: '398', unit: 'kcal' },
      { value: '24 g', unit: 'białko' },
      { value: '21 g', unit: 'tłuszcz' },
      { value: '28 g', unit: 'węgl.' },
    ],
    ingredients: [
      { name: 'Pieczywo', qty: '4 kromki' },
      { name: 'Jajka', qty: '2 szt' },
      { name: 'Szynka', qty: '100 g' },
      { name: 'Ser żółty', qty: '80 g' },
      { name: 'Szczypiorek', qty: 'garść' },
    ],
    steps: [
      'Rozgrzej piekarnik do 200°C.',
      'Ułóż pieczywo, na nim szynkę i ser.',
      'Wbij jajko na środek każdej porcji.',
      'Piecz 12 minut, posyp szczypiorkiem.',
    ],
  },
  {
    id: 8,
    title: 'Ryż na mleku z jabłkiem',
    meal: 'Kolacja',
    taste: 'Na słodko',
    difficulty: 'Proste',
    audience: 'Dla dzieci',
    time: '20 min',
    vegetarian: true,
    nutrition: [
      { value: '342', unit: 'kcal' },
      { value: '11 g', unit: 'białko' },
      { value: '7 g', unit: 'tłuszcz' },
      { value: '58 g', unit: 'węgl.' },
    ],
    ingredients: [
      { name: 'Ryż', qty: '100 g' },
      { name: 'Mleko', qty: '500 ml' },
      { name: 'Jabłko', qty: '1 szt' },
      { name: 'Cynamon', qty: 'szczypta' },
      { name: 'Cukier', qty: '2 łyżki' },
    ],
    steps: [
      'Zagotuj mleko, wsyp ryż.',
      'Gotuj na małym ogniu 15 minut, mieszając.',
      'Zetrzyj jabłko, wmieszaj z cynamonem.',
      'Podawaj ciepłe, posypane cukrem.',
    ],
  },
];
