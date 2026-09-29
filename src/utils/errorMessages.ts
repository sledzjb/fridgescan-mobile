export type ErrorMessage = { title: string; description: string; offline?: boolean };

/** Komunikaty dla użytkownika według kodu błędu (GeminiErrorCode albo kod z ekranu skanowania). */
export function describeError(code: string): ErrorMessage {
  switch (code) {
    case 'NETWORK':
      return { title: 'Brak połączenia', description: 'Sprawdź internet i spróbuj ponownie.', offline: true };
    case 'TIMEOUT':
      return { title: 'Serwer nie odpowiedział na czas', description: 'Spróbuj ponownie za chwilę.', offline: true };
    case 'QUOTA_EXCEEDED':
      return {
        title: 'Dzienny limit wyczerpany',
        description: 'Wszystkie modele wykorzystały dzisiejszy limit zapytań. Limit odnawia się rano, spróbuj później.',
      };
    case 'RATE_LIMITED':
    case 'PROXY_RATE_LIMITED':
      return { title: 'Za dużo zapytań naraz', description: 'Poczekaj minutę i spróbuj ponownie.' };
    case 'UNAVAILABLE':
      return { title: 'Serwery są przeciążone', description: 'Chwilowo nie odpowiadają. Spróbuj ponownie za moment.' };
    case 'MODEL_NOT_FOUND':
      return { title: 'Modele są niedostępne', description: 'Żaden ze skonfigurowanych modeli już nie istnieje. Zaktualizuj listę w konfiguracji aplikacji.' };
    case 'NOT_CONFIGURED':
      return { title: 'Brak adresu serwera', description: 'Aplikacja nie ma skonfigurowanego adresu API (EXPO_PUBLIC_API_URL).' };
    case 'PARSE':
      return { title: 'Nietypowa odpowiedź', description: 'Model zwrócił dane w złym formacie. Spróbuj ponownie.' };
    case 'HTTP':
      return { title: 'Błąd usługi', description: 'Usługa odrzuciła zapytanie. Spróbuj ponownie później.' };
    case 'CAPTURE_FAILED':
      return { title: 'Nie udało się zrobić zdjęcia', description: 'Spróbuj ponownie.' };
    default:
      return { title: 'Coś poszło nie tak', description: 'Spróbuj ponownie za chwilę.' };
  }
}
