/**
 * Modele Gemini w kolejności prób. Przy wyczerpanym dziennym limicie (429) albo niedostępności (503)
 * aplikacja przechodzi do następnego. Przetestowane realnym zapytaniem generatora (schema + JSON).
 * Limity RPD (darmowy tier, wg panelu AI Studio): lite 500/dobę, pozostałe 20/dobę.
 */
export const GEMINI_MODELS = [
  'gemini-3.5-flash-lite',
  'gemini-3.1-flash-lite',
  'gemini-3.7-flash',
  'gemini-3.6-flash',
  'gemini-3.5-flash',
  'gemini-3-flash-preview',
] as const;

/** Limit czasu jednego modelu i łączny limit całego łańcucha (najwolniejszy sprawdzony model odpowiadał w ok. 12 s). */
export const GEMINI_REQUEST_TIMEOUT_MS = 20000;
export const GEMINI_TOTAL_TIMEOUT_MS = 45000;
