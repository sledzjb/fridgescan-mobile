import { generateId } from '../utils/id';

export type RecognizedItem = {
  id: string;
  name: string;
  category: string;
  confidence: number;
  qty: number;
  unit: string;
};

export type RecognitionOutcome =
  | { type: 'success'; items: RecognizedItem[] }
  | { type: 'empty' }
  | { type: 'error'; code: string };

const SCAN_DURATION_MS = 1800;

/** Dane 1:1 z sekcji „11. Rozpoznane produkty” w README (referencyjny prototyp). */
const MOCK_ITEMS: Omit<RecognizedItem, 'id'>[] = [
  { name: 'Jajka', category: 'Nabiał', confidence: 96, qty: 6, unit: 'szt' },
  { name: 'Feta', category: 'Nabiał', confidence: 91, qty: 150, unit: 'g' },
  { name: 'Mleko 3,2%', category: 'Nabiał', confidence: 90, qty: 1, unit: 'l' },
  { name: 'Szpinak', category: 'Warzywa', confidence: 64, qty: 200, unit: 'g' },
  { name: 'Pieczarki', category: 'Warzywa', confidence: 88, qty: 300, unit: 'g' },
  { name: 'Jogurt naturalny', category: 'Nabiał', confidence: 84, qty: 400, unit: 'g' },
];

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Nie ma prawdziwego backendu rozpoznawania zdjęć (poza zakresem tego projektu) —
 * symulujemy odpowiedź AI z tym samym czasem i danymi co prototyp HTML.
 * Wynik losowany, żeby dało się przejść przez wszystkie trzy stany błędów w UI.
 */
export async function mockRecognizeFridgePhoto(): Promise<RecognitionOutcome> {
  await delay(SCAN_DURATION_MS);

  const roll = Math.random();
  if (roll < 0.15) return { type: 'empty' };
  if (roll < 0.3) return { type: 'error', code: 'NETWORK_TIMEOUT' };
  return {
    type: 'success',
    items: MOCK_ITEMS.map((item) => ({ ...item, id: generateId() })),
  };
}

export { SCAN_DURATION_MS };
