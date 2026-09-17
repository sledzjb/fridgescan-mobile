import { CATEGORIES, UNITS } from '../../constants/fridge';
import { GeminiRecognizedItem } from './types';

export type GeminiErrorCode = 'NO_API_KEY' | 'QUOTA_EXCEEDED' | 'NETWORK' | 'HTTP' | 'PARSE';

export class GeminiError extends Error {
  code: GeminiErrorCode;
  status?: number;

  constructor(code: GeminiErrorCode, message: string, status?: number) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

const MODEL = 'gemini-3.5-flash';
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

const PROMPT =
  'To jest zdjęcie wnętrza lodówki lub szafki spożywczej. Wypisz każdy widoczny, pojedynczy produkt spożywczy ' +
  '(nie licz opakowań zbiorczych jako jednej sztuki na produkt w środku). Dla każdego oszacuj ilość i jednostkę. ' +
  'Jeśli produkt jest częściowo zasłonięty albo nie jesteś pewien co to jest, obniż confidence odpowiednio do ' +
  'pewności rozpoznania. Oprócz konkretnej nazwy (np. "Ser Gouda", "Jogurt Danone truskawkowy") podaj też ' +
  'nazwę rodzajową - taką, jakiej użyłby przepis kulinarny wymieniając składnik ogólnie, bez marki ani ' +
  'konkretnej odmiany (np. "Ser żółty", "Jogurt naturalny"). Jeśli produkt jest już ogólny, nazwa rodzajowa ' +
  'może być taka sama jak konkretna. Jeśli na zdjęciu nie widać żadnego jedzenia, zwróć pustą tablicę.';

const RESPONSE_SCHEMA = {
  type: 'ARRAY',
  items: {
    type: 'OBJECT',
    properties: {
      name: { type: 'STRING', description: 'Konkretna nazwa produktu po polsku, np. "Ser Gouda", "Mleko 3,2%"' },
      genericName: {
        type: 'STRING',
        description: 'Rodzajowa nazwa tego samego produktu, jakiej użyłby przepis, np. "Ser żółty", "Mleko"',
      },
      category: { type: 'STRING', enum: [...CATEGORIES] },
      qty: { type: 'NUMBER' },
      unit: { type: 'STRING', enum: [...UNITS] },
      confidence: { type: 'NUMBER', description: 'Pewność rozpoznania, liczba całkowita 0-100' },
    },
    required: ['name', 'genericName', 'category', 'qty', 'unit', 'confidence'],
  },
};

function isValidItem(item: unknown): item is GeminiRecognizedItem {
  if (!item || typeof item !== 'object') return false;
  const i = item as Record<string, unknown>;
  return (
    typeof i.name === 'string' &&
    i.name.trim().length > 0 &&
    typeof i.genericName === 'string' &&
    i.genericName.trim().length > 0 &&
    typeof i.category === 'string' &&
    (CATEGORIES as readonly string[]).includes(i.category) &&
    typeof i.qty === 'number' &&
    i.qty > 0 &&
    typeof i.unit === 'string' &&
    (UNITS as readonly string[]).includes(i.unit) &&
    typeof i.confidence === 'number'
  );
}

/** Na webie expo-image-picker/kamera bywa zwraca gotowy data URI zamiast surowego base64 - Gemini akceptuje tylko czyste dane. */
function stripDataUriPrefix(base64: string): string {
  return base64.replace(/^data:[^;]+;base64,/, '');
}

export async function recognizeFridgeImage(base64: string, mimeType: string): Promise<GeminiRecognizedItem[]> {
  const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
  if (!apiKey) {
    throw new GeminiError('NO_API_KEY', 'Brak EXPO_PUBLIC_GEMINI_API_KEY w .env');
  }

  const imageData = stripDataUriPrefix(base64);

  let response: Response;
  try {
    response = await fetch(`${ENDPOINT}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: PROMPT }, { inline_data: { mime_type: mimeType, data: imageData } }],
          },
        ],
        generationConfig: {
          response_mime_type: 'application/json',
          response_schema: RESPONSE_SCHEMA,
        },
      }),
    });
  } catch (e) {
    throw new GeminiError('NETWORK', e instanceof Error ? e.message : 'Network error');
  }

  if (response.status === 429) {
    throw new GeminiError('QUOTA_EXCEEDED', 'Dzienny limit zapytań Gemini wyczerpany', 429);
  }
  if (!response.ok) {
    throw new GeminiError('HTTP', `Gemini HTTP ${response.status}`, response.status);
  }

  let text: string;
  try {
    const data = await response.json();
    text = data.candidates[0].content.parts[0].text;
  } catch (e) {
    throw new GeminiError('PARSE', e instanceof Error ? e.message : 'Failed to parse response');
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch (e) {
    throw new GeminiError('PARSE', 'Model nie zwrócił poprawnego JSON-a');
  }

  if (!Array.isArray(parsed)) {
    throw new GeminiError('PARSE', 'Oczekiwano tablicy produktów');
  }

  // Odrzucamy pojedyncze wadliwe wpisy zamiast wywalać całą odpowiedź - jeden dziwny wpis
  // od modelu nie powinien zablokować reszty poprawnie rozpoznanych produktów.
  return parsed.filter(isValidItem).map((item) => ({ ...item, confidence: Math.round(item.confidence) }));
}
