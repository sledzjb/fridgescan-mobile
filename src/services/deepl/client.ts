export type DeepLErrorCode = 'NO_API_KEY' | 'QUOTA_EXCEEDED' | 'NETWORK' | 'HTTP' | 'PARSE';

export class DeepLError extends Error {
  code: DeepLErrorCode;
  status?: number;

  constructor(code: DeepLErrorCode, message: string, status?: number) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

/** Klucze kont darmowych mają sufiks ":fx" i wymagają innego hosta niż konta Pro. */
function endpointFor(apiKey: string): string {
  return apiKey.endsWith(':fx') ? 'https://api-free.deepl.com/v2/translate' : 'https://api.deepl.com/v2/translate';
}

const MAX_TEXTS_PER_REQUEST = 50;

async function translateChunk(texts: string[], targetLang: string): Promise<string[]> {
  const apiKey = process.env.EXPO_PUBLIC_DEEPL_API_KEY;
  if (!apiKey) {
    throw new DeepLError('NO_API_KEY', 'Brak EXPO_PUBLIC_DEEPL_API_KEY w .env');
  }

  let response: Response;
  try {
    response = await fetch(endpointFor(apiKey), {
      method: 'POST',
      headers: {
        Authorization: `DeepL-Auth-Key ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: texts, target_lang: targetLang, source_lang: 'EN' }),
    });
  } catch (e) {
    throw new DeepLError('NETWORK', e instanceof Error ? e.message : 'Network error');
  }

  if (response.status === 456) {
    throw new DeepLError('QUOTA_EXCEEDED', 'Miesięczny limit znaków DeepL wyczerpany', 456);
  }
  if (!response.ok) {
    throw new DeepLError('HTTP', `DeepL HTTP ${response.status}`, response.status);
  }

  try {
    const data = (await response.json()) as { translations: { text: string }[] };
    return data.translations.map((t) => t.text);
  } catch (e) {
    throw new DeepLError('PARSE', e instanceof Error ? e.message : 'Failed to parse response');
  }
}

/** Tłumaczy dowolną liczbę tekstów zachowując kolejność - dzieli na porcje po 50 (limit DeepL na zapytanie). */
export async function translateTexts(texts: string[], targetLang: string): Promise<string[]> {
  if (texts.length === 0) return [];

  const results: string[] = [];
  for (let i = 0; i < texts.length; i += MAX_TEXTS_PER_REQUEST) {
    const chunk = texts.slice(i, i + MAX_TEXTS_PER_REQUEST);
    results.push(...(await translateChunk(chunk, targetLang)));
  }
  return results;
}
