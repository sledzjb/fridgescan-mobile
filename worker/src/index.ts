import { GEMINI_MODELS } from '../../src/constants/gemini';

/**
 * Proxy FridgeScan: trzyma klucze Gemini i Pexels po stronie serwera, żeby nie trafiały do aplikacji.
 * Przepuszcza tylko to, czego aplikacja potrzebuje:
 *   POST /gemini/:model  -> Gemini generateContent (tylko modele z GEMINI_MODELS)
 *   GET  /photos?query=  -> Pexels search (1 zdjęcie, poziome)
 * Odpowiedzi Google (status i treść) są przekazywane bez zmian - aplikacja rozpoznaje po nich limity dzienne/minutowe.
 */

interface RateLimiter {
  limit(options: { key: string }): Promise<{ success: boolean }>;
}

export interface Env {
  GEMINI_API_KEY: string;
  PEXELS_API_KEY: string;
  /** Lista originów (przecinki), z których przeglądarka może wołać proxy, np. "https://sledzjb.github.io". */
  ALLOWED_ORIGINS: string;
  GEMINI_LIMITER: RateLimiter;
  PHOTO_LIMITER: RateLimiter;
}

/** Znacznik w treści 429 - aplikacja odróżnia po nim limit proxy od limitów Google i nie próbuje kolejnych modeli. */
const PROXY_RATE_LIMIT_MARKER = 'FRIDGESCAN_RATE_LIMIT';
/** Zdjęcie lodówki jako base64 z webu potrafi mieć kilka MB - większych zapytań nie przepuszczamy. */
const MAX_BODY_BYTES = 12 * 1024 * 1024;

const ALLOWED_MODELS = new Set<string>(GEMINI_MODELS);

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get('Origin');
    const allowedOrigins = env.ALLOWED_ORIGINS.split(',').map((o) => o.trim());
    // Brak Origin = aplikacja natywna (albo skrypt); z przeglądarki wpuszczamy tylko nasze strony.
    if (origin && !allowedOrigins.includes(origin)) {
      return new Response('Origin not allowed', { status: 403 });
    }
    const cors = corsHeaders(origin);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors });
    }

    const url = new URL(request.url);
    const clientIp = request.headers.get('CF-Connecting-IP') ?? 'unknown';

    try {
      const geminiMatch = url.pathname.match(/^\/gemini\/([\w.-]+)$/);
      if (geminiMatch && request.method === 'POST') {
        return withCors(await handleGemini(request, env, geminiMatch[1], clientIp), cors);
      }
      if (url.pathname === '/photos' && request.method === 'GET') {
        return withCors(await handlePhotos(url, env, clientIp), cors);
      }
      return withCors(new Response('Not found', { status: 404 }), cors);
    } catch {
      return withCors(new Response('Upstream error', { status: 502 }), cors);
    }
  },
};

async function handleGemini(request: Request, env: Env, model: string, clientIp: string): Promise<Response> {
  if (!ALLOWED_MODELS.has(model)) {
    return new Response('Model not allowed', { status: 404 });
  }
  if (Number(request.headers.get('Content-Length') ?? 0) > MAX_BODY_BYTES) {
    return new Response('Request too large', { status: 413 });
  }
  const { success } = await env.GEMINI_LIMITER.limit({ key: clientIp });
  if (!success) {
    return new Response(PROXY_RATE_LIMIT_MARKER, { status: 429 });
  }

  const body = await request.arrayBuffer();
  if (body.byteLength > MAX_BODY_BYTES) {
    return new Response('Request too large', { status: 413 });
  }

  const upstream = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': env.GEMINI_API_KEY },
    body,
  });
  return new Response(upstream.body, {
    status: upstream.status,
    headers: { 'Content-Type': upstream.headers.get('Content-Type') ?? 'application/json' },
  });
}

async function handlePhotos(url: URL, env: Env, clientIp: string): Promise<Response> {
  const query = url.searchParams.get('query')?.trim();
  if (!query || query.length > 100) {
    return new Response('Missing or too long query', { status: 400 });
  }
  const { success } = await env.PHOTO_LIMITER.limit({ key: clientIp });
  if (!success) {
    return new Response(PROXY_RATE_LIMIT_MARKER, { status: 429 });
  }

  const pexelsUrl = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`;
  const upstream = await fetch(pexelsUrl, { headers: { Authorization: env.PEXELS_API_KEY } });
  return new Response(upstream.body, {
    status: upstream.status,
    headers: { 'Content-Type': upstream.headers.get('Content-Type') ?? 'application/json' },
  });
}

function corsHeaders(origin: string | null): Record<string, string> {
  if (!origin) return {};
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
}

function withCors(response: Response, cors: Record<string, string>): Response {
  const headers = new Headers(response.headers);
  for (const [key, value] of Object.entries(cors)) headers.set(key, value);
  return new Response(response.body, { status: response.status, headers });
}
