import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = '@fridgescan/gemini-exhausted-models';

type ExhaustedRecord = { date: string; models: string[] };

/** Dzienny limit Gemini resetuje się o północy czasu pacyficznego, nie lokalnego. */
function quotaDay(): string {
  const now = new Date();
  try {
    return now.toLocaleDateString('en-CA', { timeZone: 'America/Los_Angeles' });
  } catch {
    return new Date(now.getTime() - 8 * 3600 * 1000).toISOString().slice(0, 10);
  }
}

async function read(): Promise<ExhaustedRecord> {
  const empty = { date: quotaDay(), models: [] };
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return empty;
  try {
    const parsed = JSON.parse(raw) as ExhaustedRecord;
    return parsed.date === empty.date ? parsed : empty;
  } catch {
    return empty;
  }
}

export async function isModelExhaustedToday(model: string): Promise<boolean> {
  return (await read()).models.includes(model);
}

export async function markModelExhaustedToday(model: string): Promise<void> {
  const record = await read();
  if (record.models.includes(model)) return;
  await AsyncStorage.setItem(KEY, JSON.stringify({ ...record, models: [...record.models, model] }));
}

const DEAD_KEY = '@fridgescan/gemini-dead-models';
const DEAD_TTL_MS = 7 * 24 * 60 * 60 * 1000;

type DeadRecord = Record<string, number>;

async function readDead(): Promise<DeadRecord> {
  const raw = await AsyncStorage.getItem(DEAD_KEY);
  if (!raw) return {};
  try {
    return JSON.parse(raw) as DeadRecord;
  } catch {
    return {};
  }
}

/** Model, który API zgłosiło jako nieistniejący (404), pomijamy przez tydzień zamiast marnować na niego zapytanie za każdym razem. */
export async function isModelUnavailable(model: string): Promise<boolean> {
  const markedAt = (await readDead())[model];
  return markedAt !== undefined && Date.now() - markedAt < DEAD_TTL_MS;
}

export async function markModelUnavailable(model: string): Promise<void> {
  const dead = await readDead();
  await AsyncStorage.setItem(DEAD_KEY, JSON.stringify({ ...dead, [model]: Date.now() }));
}
