import { DocumentTitleOptions } from '@react-navigation/native';

const APP_NAME = 'FridgeScan';

/** Tytuły ekranów w karcie przeglądarki (web). Ekran może nadpisać tytuł przez navigation.setOptions({ title }). */
const SCREEN_TITLES: Record<string, string> = {
  // Zakładki - przy pierwszym wejściu zagnieżdżony stos nie ma jeszcze stanu, więc aktywną trasą jest sama zakładka.
  FridgeTab: 'Lodówka',
  GeneratorTab: 'Generator przepisów',
  RecipesTab: 'Przepisy',
  FavoritesTab: 'Ulubione',
  MoreTab: 'Więcej',
  Name: 'Twoje imię',
  Intro: 'Jak to działa',
  NotificationsConsent: 'Powiadomienia',
  Fridge: 'Lodówka',
  AddProduct: 'Dodaj produkt',
  RecognizedProducts: 'Rozpoznane produkty',
  EditProduct: 'Edytuj produkt',
  Generator: 'Generator przepisów',
  GeneratorLoading: 'Generuję przepisy',
  RecipeResults: 'Propozycje przepisów',
  RecipeResultsEmpty: 'Brak propozycji',
  AllRecipes: 'Przepisy',
  SearchRecipes: 'Szukaj przepisów',
  RecipeDetail: 'Przepis',
  UpdateFridgeSheet: 'Oznacz jako wykonane',
  Favorites: 'Ulubione',
  More: 'Więcej',
  History: 'Historia',
  ShoppingList: 'Lista zakupów',
  Settings: 'Ustawienia i konto',
  Help: 'Pomoc',
  Scan: 'Skan lodówki',
  ScanNoResults: 'Nic nie rozpoznano',
  ScanError: 'Błąd skanu',
};

/** „{Tytuł ekranu} - FridgeScan”; ekran powitalny i nieznane trasy to samo „FridgeScan”. */
export const documentTitle: DocumentTitleOptions = {
  formatter: (options, route) => {
    const title = (options?.title as string | undefined) ?? (route ? SCREEN_TITLES[route.name] : undefined);
    return title ? `${title} - ${APP_NAME}` : APP_NAME;
  },
};
