import { generateId } from '../../utils/id';
import { mockRecognizeFridgePhoto, RecognitionOutcome } from '../mockRecognition';
import { recognizeFridgeImage, GeminiError } from './client';

export type CapturedPhoto = { base64: string; mimeType: string };

/**
 * W przeciwieństwie do katalogu przepisów - tu NIE ma cichego fallbacku na fikcyjne dane przy
 * błędzie. Pokazanie zmyślonych "rozpoznanych produktów" jako wyniku analizy realnego zdjęcia
 * użytkownika byłoby wprowadzające w błąd. Błąd Gemini kończy się ekranem błędu (już istnieje
 * w UI), nie podstawionymi danymi.
 */
export async function recognizeFridgePhoto(photo: CapturedPhoto): Promise<RecognitionOutcome> {
  if (process.env.EXPO_PUBLIC_USE_FIXTURES === 'true') {
    return mockRecognizeFridgePhoto();
  }

  try {
    const items = await recognizeFridgeImage(photo.base64, photo.mimeType);
    if (items.length === 0) {
      return { type: 'empty' };
    }
    return {
      type: 'success',
      items: items.map((item) => ({ ...item, id: generateId() })),
    };
  } catch (e) {
    const code = e instanceof GeminiError ? e.code : 'NETWORK';
    return { type: 'error', code };
  }
}
