declare namespace NodeJS {
  interface ProcessEnv {
    /** Adres proxy z kluczami API (Cloudflare Worker z katalogu worker/), np. https://fridgescan-api.<konto>.workers.dev */
    EXPO_PUBLIC_API_URL?: string;
  }
}
