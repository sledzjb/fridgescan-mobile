import AsyncStorage from '@react-native-async-storage/async-storage';
import { todayIso, IsoDate } from '../../utils/date';
import { Recipe } from '../../data/recipes';
import { CATALOG_TTL_MS } from '../../constants/spoonacular';

const CATALOG_KEY = '@fridgescan/spoonacular-cache';
const QUOTA_KEY = '@fridgescan/spoonacular-quota';

type CachedCatalog = { recipes: Recipe[]; cachedAt: number };
type QuotaRecord = { date: IsoDate; quotaLeft: number };

export async function getCachedCatalog(): Promise<CachedCatalog | null> {
  const raw = await AsyncStorage.getItem(CATALOG_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as CachedCatalog;
  } catch {
    return null;
  }
}

export async function setCachedCatalog(recipes: Recipe[]): Promise<void> {
  const entry: CachedCatalog = { recipes, cachedAt: Date.now() };
  await AsyncStorage.setItem(CATALOG_KEY, JSON.stringify(entry));
}

export function isFresh(cachedAt: number, ttlMs: number = CATALOG_TTL_MS): boolean {
  return Date.now() - cachedAt < ttlMs;
}

/**
 * Spoonacular sam mówi ile punktów zostało (nagłówek X-Api-Quota-Left) - zapamiętujemy tylko
 * ostatnią znaną wartość razem z datą. Jeśli data się zmieniła, limit się zresetował u nich,
 * więc traktujemy zapisaną wartość jako nieaktualną i pozwalamy spróbować od nowa.
 */
export async function getLastKnownQuotaLeft(): Promise<number | null> {
  const raw = await AsyncStorage.getItem(QUOTA_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as QuotaRecord;
    return parsed.date === todayIso() ? parsed.quotaLeft : null;
  } catch {
    return null;
  }
}

export async function setLastKnownQuotaLeft(quotaLeft: number): Promise<void> {
  const record: QuotaRecord = { date: todayIso(), quotaLeft };
  await AsyncStorage.setItem(QUOTA_KEY, JSON.stringify(record));
}
