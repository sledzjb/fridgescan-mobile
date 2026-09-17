import { SpoonacularComplexSearchResponse } from './types';

export type SpoonacularErrorCode = 'NO_API_KEY' | 'QUOTA_EXCEEDED' | 'NETWORK' | 'HTTP' | 'PARSE';

export class SpoonacularError extends Error {
  code: SpoonacularErrorCode;
  status?: number;

  constructor(code: SpoonacularErrorCode, message: string, status?: number) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

const BASE_URL = 'https://api.spoonacular.com/recipes/complexSearch';

export type SpoonacularSearchResult = {
  data: SpoonacularComplexSearchResponse;
  /** Realna pozostała pula punktów po tym zapytaniu (z nagłówka X-Api-Quota-Left), jeśli API ją zwróciło. */
  quotaLeft: number | null;
};

export async function spoonacularComplexSearch(params: {
  type: string;
  number: number;
}): Promise<SpoonacularSearchResult> {
  const apiKey = process.env.EXPO_PUBLIC_SPOONACULAR_API_KEY;
  if (!apiKey) {
    throw new SpoonacularError('NO_API_KEY', 'Brak EXPO_PUBLIC_SPOONACULAR_API_KEY w .env');
  }

  const url = new URL(BASE_URL);
  url.searchParams.set('apiKey', apiKey);
  url.searchParams.set('type', params.type);
  url.searchParams.set('number', String(params.number));
  url.searchParams.set('addRecipeInformation', 'true');
  url.searchParams.set('addRecipeNutrition', 'true');
  url.searchParams.set('instructionsRequired', 'true');

  let response: Response;
  try {
    response = await fetch(url.toString());
  } catch (e) {
    throw new SpoonacularError('NETWORK', e instanceof Error ? e.message : 'Network error');
  }

  if (response.status === 402) {
    throw new SpoonacularError('QUOTA_EXCEEDED', 'Dzienny limit zapytań Spoonacular wyczerpany', 402);
  }
  if (!response.ok) {
    throw new SpoonacularError('HTTP', `Spoonacular HTTP ${response.status}`, response.status);
  }

  const quotaLeftHeader = response.headers.get('x-api-quota-left');
  const quotaLeft = quotaLeftHeader !== null ? Number(quotaLeftHeader) : null;

  try {
    const data = (await response.json()) as SpoonacularComplexSearchResponse;
    return { data, quotaLeft: Number.isFinite(quotaLeft) ? quotaLeft : null };
  } catch (e) {
    throw new SpoonacularError('PARSE', e instanceof Error ? e.message : 'Failed to parse response');
  }
}
