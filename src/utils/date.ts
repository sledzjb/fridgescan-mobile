/** Daty produktów trzymane wewnętrznie jako 'YYYY-MM-DD' (bez czasu, unikamy problemów ze strefami). */
export type IsoDate = string;

function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

export function todayIso(): IsoDate {
  const d = new Date();
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

export function addDaysIso(days: number, from: IsoDate = todayIso()): IsoDate {
  const [y, m, d] = from.split('-').map(Number);
  const date = new Date(y, m - 1, d + days);
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

/** 'YYYY-MM-DD' -> 'DD.MM.RRRR' (format polski, do wyświetlania). */
export function formatIsoToPl(iso: IsoDate): string {
  const [y, m, d] = iso.split('-');
  return `${d}.${m}.${y}`;
}

/** 'DD.MM.RRRR' -> 'YYYY-MM-DD', albo null gdy tekst nie jest poprawną datą. */
export function parsePlToIso(pl: string): IsoDate | null {
  const match = pl.trim().match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
  if (!match) return null;
  const [, dStr, mStr, yStr] = match;
  const d = Number(dStr);
  const m = Number(mStr);
  const y = Number(yStr);
  const date = new Date(y, m - 1, d);
  if (date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d) return null;
  return `${y}-${pad2(m)}-${pad2(d)}`;
}

/** Liczba pełnych dni do daty (może być ujemna, gdy termin minął). */
export function daysUntil(iso: IsoDate): number {
  const [y, m, d] = iso.split('-').map(Number);
  const target = new Date(y, m - 1, d).getTime();
  const [ty, tm, td] = todayIso().split('-').map(Number);
  const today = new Date(ty, tm - 1, td).getTime();
  return Math.round((target - today) / (1000 * 60 * 60 * 24));
}

/** „został 1 dzień” / „zostały N dni” / „termin minął” - treść badge terminu ważności. */
export function expiryLabel(iso: IsoDate): string {
  const days = daysUntil(iso);
  if (days < 0) return 'termin minął';
  if (days === 0) return 'kończy się dziś';
  if (days === 1) return 'został 1 dzień';
  return `zostały ${days} dni`;
}
