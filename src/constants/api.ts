/**
 * Adres proxy (Cloudflare Worker z katalogu worker/), które trzyma klucze Gemini i Pexels po stronie serwera.
 * Aplikacja nie ma żadnych kluczy API - tylko ten adres.
 */
export const API_URL = (process.env.EXPO_PUBLIC_API_URL ?? '').replace(/\/+$/, '');

/** Treść odpowiedzi 429 od samego proxy (limit na adres IP) - odróżnia ją od limitów Google. */
export const PROXY_RATE_LIMIT_MARKER = 'FRIDGESCAN_RATE_LIMIT';
