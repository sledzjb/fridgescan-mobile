import { Category } from '../../constants/fridge';
import { ProductUnit } from '../../constants/fridge';

export type GeminiRecognizedItem = {
  name: string;
  /**
   * Rodzajowa nazwa produktu (np. "Ser żółty" dla "Ser Gouda") - używana do dopasowywania do
   * składników przepisów, które zwykle nazywają produkty ogólnie, nie konkretną marką/odmianą.
   */
  genericName: string;
  /** Ta sama nazwa rodzajowa po angielsku (np. "Yellow cheese") - wysyłana do API przepisów. */
  nameEn: string;
  category: Category;
  qty: number;
  unit: ProductUnit;
  /** Pewność rozpoznania 0-100, szacowana przez model (nie realna statystyka jak w klasycznym CV). */
  confidence: number;
};

/** Produkt rozpoznany ze zdjęcia, gotowy do edycji na ekranie potwierdzenia. */
export type RecognizedItem = {
  id: string;
  name: string;
  /** Rodzajowa nazwa (np. "Ser żółty" dla "Ser Gouda"). */
  genericName?: string;
  /** Ta sama nazwa rodzajowa po angielsku - wysyłana do API przepisów i do wyszukiwania zdjęć. */
  nameEn?: string;
  category: string;
  confidence: number;
  qty: number;
  unit: string;
};

export type RecognitionOutcome =
  | { type: 'success'; items: RecognizedItem[] }
  | { type: 'empty' }
  | { type: 'error'; code: string };
