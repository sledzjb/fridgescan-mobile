import { Category } from '../../constants/fridge';
import { ProductUnit } from '../../constants/fridge';

export type GeminiRecognizedItem = {
  name: string;
  /**
   * Rodzajowa nazwa produktu (np. "Ser żółty" dla "Ser Gouda") - używana do dopasowywania do
   * składników przepisów, które zwykle nazywają produkty ogólnie, nie konkretną marką/odmianą.
   */
  genericName: string;
  category: Category;
  qty: number;
  unit: ProductUnit;
  /** Pewność rozpoznania 0-100, szacowana przez model (nie realna statystyka jak w klasycznym CV). */
  confidence: number;
};
