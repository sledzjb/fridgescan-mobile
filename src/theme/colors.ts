export const colors = {
  // Primary - zieleń
  primary900: '#173404', // welcome overlay, karta Premium
  primary700: '#3B6D11', // CTA, aktywny stan, linki, tekst „masz"
  primary50: '#EAF3DE', // tło badge dopasowania, numery kroków

  // Secondary - koral
  secondary700: '#993C1D', // tekst na chipie terminu, akcje destrukcyjne
  secondary500: '#D85A30', // „Oznacz jako wykonane", aktywne serduszko
  secondary300: '#F0997B', // ramka niepewnego rozpoznania, link „Cofnij" w toaście
  secondary50: '#FAECE7', // tło chipa terminu ważności

  // Accent - turkus
  accent900: '#04342C', // tło ekranu skanowania, brak zgody na kamerę
  accent600: '#1D9E75', // główna akcja „Zrób zdjęcie"
  accent400: '#5DCAA5', // linia skanu, ramki rozpoznanych produktów

  // Neutral
  ink: '#2C2C2A', // tekst podstawowy, przyciski drugorzędne
  inkSoft: '#444441', // treść kroków przepisu
  mute: '#888780', // tekst pomocniczy, nieaktywna zakładka
  line: '#D3D1C7', // obramowania, separatory, tło steppera
  surface: '#F1EFE8', // tło ekranu
  white: '#FFFFFF', // tło kart, list i tab bara
} as const;

// Przezroczystości używane na ciemnych tłach (skan, brak zgody, welcome)
export const alpha = {
  whiteTile: 'rgba(255,255,255,.14)', // kafelek ikony na ciemnym tle
  whiteOutlineBorder: 'rgba(255,255,255,.28)', // ramka przycisku outline na ciemnym tle
  whiteText50: 'rgba(255,255,255,.5)',
  whiteText60: 'rgba(255,255,255,.6)',
  whiteText72: 'rgba(255,255,255,.72)',
  whiteText78: 'rgba(255,255,255,.78)',
  welcomeOverlay: 'rgba(20,20,19,.72)', // overlay na tle welcome screena
  sheetOverlay: 'rgba(44,44,42,.35)', // overlay pod bottom sheetem
} as const;

export type ColorToken = keyof typeof colors;
