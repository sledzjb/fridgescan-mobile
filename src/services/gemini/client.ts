import { CATEGORIES, UNITS } from '../../constants/fridge';
import { GEMINI_MODELS, GEMINI_REQUEST_TIMEOUT_MS, GEMINI_TOTAL_TIMEOUT_MS } from '../../constants/gemini';
import { API_URL, PROXY_RATE_LIMIT_MARKER } from '../../constants/api';
import { GeminiRecognizedItem } from './types';
import { isModelExhaustedToday, markModelExhaustedToday, isModelUnavailable, markModelUnavailable } from './quota';

export type GeminiErrorCode =
  | 'NOT_CONFIGURED'
  | 'QUOTA_EXCEEDED'
  | 'RATE_LIMITED'
  | 'PROXY_RATE_LIMITED'
  | 'UNAVAILABLE'
  | 'MODEL_NOT_FOUND'
  | 'TIMEOUT'
  | 'NETWORK'
  | 'HTTP'
  | 'PARSE';

export class GeminiError extends Error {
  code: GeminiErrorCode;
  status?: number;

  constructor(code: GeminiErrorCode, message: string, status?: number) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

async function requestModel(model: string, body: object, timeoutMs: number): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  let response: Response;
  try {
    // Proxy (worker/) dokleja klucz i przekazuje odpowiedź Google bez zmian.
    response = await fetch(`${API_URL}/gemini/${model}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
  } catch (e) {
    if (controller.signal.aborted) throw new GeminiError('TIMEOUT', `${model}: przekroczono czas oczekiwania`);
    throw new GeminiError('NETWORK', e instanceof Error ? e.message : 'Network error');
  } finally {
    clearTimeout(timer);
  }

  if (response.status === 429) {
    // Limit na dobę (PerDay) wyłącza model do resetu; limit na minutę tylko każe spróbować inny model.
    const detail = await response.text().catch(() => '');
    if (detail.includes(PROXY_RATE_LIMIT_MARKER)) {
      throw new GeminiError('PROXY_RATE_LIMITED', 'Limit zapytań proxy dla tego urządzenia', 429);
    }
    if (detail.includes('PerDay')) {
      throw new GeminiError('QUOTA_EXCEEDED', `${model}: dzienny limit wyczerpany`, 429);
    }
    throw new GeminiError('RATE_LIMITED', `${model}: limit na minutę`, 429);
  }
  if (response.status === 404) {
    throw new GeminiError('MODEL_NOT_FOUND', `${model}: model niedostępny`, 404);
  }
  if (response.status >= 500) {
    throw new GeminiError('UNAVAILABLE', `${model}: HTTP ${response.status}`, response.status);
  }
  if (!response.ok) {
    throw new GeminiError('HTTP', `${model}: HTTP ${response.status}`, response.status);
  }

  try {
    const data = await response.json();
    const parts: { text?: unknown; thought?: boolean }[] = data.candidates[0].content.parts;
    const part = parts.find((p) => typeof p.text === 'string' && !p.thought);
    return (part as { text: string }).text;
  } catch (e) {
    throw new GeminiError('PARSE', e instanceof Error ? e.message : 'Failed to parse response');
  }
}

/**
 * Wysyła zapytanie do kolejnych modeli z GEMINI_MODELS, aż któryś odpowie. Model z wyczerpanym
 * dziennym limitem jest pomijany do resetu. Brak sieci, brak adresu proxy i limit proxy przerywają od razu - inny model tego nie naprawi.
 * Cały łańcuch ma łączny limit czasu, żeby kilka wolnych modeli z rzędu nie trzymało użytkownika minutami.
 */
export type FallbackOptions = { requestTimeoutMs?: number; totalTimeoutMs?: number };

const MIN_ATTEMPT_MS = 2000;

export async function generateContentWithFallback(body: object, options: FallbackOptions = {}): Promise<string> {
  const { requestTimeoutMs = GEMINI_REQUEST_TIMEOUT_MS, totalTimeoutMs = GEMINI_TOTAL_TIMEOUT_MS } = options;
  const deadline = Date.now() + totalTimeoutMs;
  if (!API_URL) {
    throw new GeminiError('NOT_CONFIGURED', 'Brak EXPO_PUBLIC_API_URL w .env');
  }

  let lastError: GeminiError | null = null;
  for (const model of GEMINI_MODELS) {
    const remaining = deadline - Date.now();
    if (remaining < MIN_ATTEMPT_MS) {
      lastError = new GeminiError('TIMEOUT', 'Przekroczono łączny czas oczekiwania na modele');
      break;
    }
    if (await isModelUnavailable(model)) continue;
    if (await isModelExhaustedToday(model)) {
      lastError ??= new GeminiError('QUOTA_EXCEEDED', `${model}: dzienny limit wyczerpany`, 429);
      continue;
    }
    try {
      const text = await requestModel(model, body, Math.min(requestTimeoutMs, remaining));
      return text;
    } catch (e) {
      if (!(e instanceof GeminiError) || e.code === 'NETWORK' || e.code === 'PROXY_RATE_LIMITED') throw e;
      if (e.code === 'QUOTA_EXCEEDED') await markModelExhaustedToday(model);
      if (e.code === 'MODEL_NOT_FOUND') await markModelUnavailable(model);
      lastError = e;
    }
  }
  throw lastError ?? new GeminiError('UNAVAILABLE', 'Brak dostępnych modeli Gemini');
}

const PROMPT =
  'This is a photo of the inside of a fridge or a pantry. List every visible individual food product ' +
  '(do not count multipacks as one item instead of the products inside). Estimate quantity and unit for each. ' +
  'If a product is partly hidden or you are unsure what it is, lower confidence accordingly. Besides the ' +
  'specific name (e.g. "Ser Gouda", "Jogurt Danone truskawkowy") also give a generic name - the one a cooking ' +
  'recipe would use for the ingredient, without brand or variety (e.g. "Ser żółty", "Jogurt naturalny") - and ' +
  'the same generic name in English as nameEn. If the product is already generic, the generic name may equal ' +
  'the specific one. name and genericName are shown to a Polish user, so write them in Polish. ' +
  'If no food is visible in the photo, return an empty array.';

const RESPONSE_SCHEMA = {
  type: 'ARRAY',
  items: {
    type: 'OBJECT',
    properties: {
      name: { type: 'STRING', description: 'Specific product name in Polish, e.g. "Ser Gouda", "Mleko 3,2%"' },
      genericName: {
        type: 'STRING',
        description: 'Generic name of the same product in Polish, as a recipe would use it, e.g. "Ser żółty", "Mleko"',
      },
      nameEn: {
        type: 'STRING',
        description: 'The same generic name in English, as a recipe would call the ingredient, e.g. "Yellow cheese", "Milk"',
      },
      category: { type: 'STRING', enum: [...CATEGORIES] },
      qty: { type: 'NUMBER' },
      unit: { type: 'STRING', enum: [...UNITS] },
      confidence: { type: 'NUMBER', description: 'Recognition confidence, integer 0-100' },
    },
    required: ['name', 'genericName', 'nameEn', 'category', 'qty', 'unit', 'confidence'],
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
    typeof i.nameEn === 'string' &&
    i.nameEn.trim().length > 0 &&
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
  const imageData = stripDataUriPrefix(base64);

  const text = await generateContentWithFallback({
    contents: [
      {
        parts: [{ text: PROMPT }, { inline_data: { mime_type: mimeType, data: imageData } }],
      },
    ],
    generationConfig: {
      response_mime_type: 'application/json',
      response_schema: RESPONSE_SCHEMA,
    },
  }, { requestTimeoutMs: 30000, totalTimeoutMs: 60000 });

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
