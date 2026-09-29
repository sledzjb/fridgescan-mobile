// Paleta oparta na 4 pastelach: #A1CAE2, #ECDAF0, #C0D79C, #FFFCAB. `palette` to surowe skale odcieni -
// w komponentach używamy wyłącznie tokenów semantycznych z `colors`.
// Zasady: każde tło X łączymy z tekstem onX; pastele nigdy nie mają białego tekstu; jeden przycisk `primary` na ekran;
// textMuted tylko dla podpisów, placeholderów i metadanych; wszystkie pary tekst/tło spełniają WCAG AA.
export const palette = {
  blue: { 50: '#F1F8FC', 100: '#DDEDF6', 300: '#A1CAE2', 500: '#6BA8CC', 700: '#2F6A8C', 900: '#183A4F' },
  lavender: { 50: '#FBF6FC', 100: '#ECDAF0', 300: '#D5B4DE', 500: '#B084BF', 700: '#744A84', 900: '#3F2549' },
  green: { 50: '#F5F9EE', 100: '#DEEBC9', 300: '#C0D79C', 500: '#8DB05A', 700: '#4E6B28', 900: '#2A3A14' },
  yellow: { 50: '#FFFEE9', 100: '#FFFCAB', 300: '#F7EE72', 500: '#E0CC3A', 700: '#7D6E0C', 900: '#433A05' },
  coral: { 50: '#FDF0EF', 100: '#F9DAD7', 300: '#F2B8B3', 500: '#E07A70', 700: '#A63A31', 900: '#4A1E1A' },
  neutral: { 0: '#FFFFFF', 50: '#F7F9FA', 100: '#EDF1F4', 300: '#CCD5DC', 500: '#7C8A95', 700: '#45545F', 900: '#1C2730', 950: '#121A21' },
} as const;

// Tokeny semantyczne (motyw jasny - jedyny w aplikacji)
const semantic = {
  background: '#F7F9FA', // tło ekranu
  surface: '#FFFFFF', // karty, listy, arkusze, tab bar
  surfaceRaised: '#FFFFFF',
  border: '#CCD5DC',
  borderSubtle: '#EDF1F4', // separatory i wypełnienia wewnątrz kart (pola, skeletony)
  text: '#1C2730',
  textSecondary: '#45545F',
  textMuted: '#7C8A95',
  textOnStrong: '#FFFFFF', // tekst/ikona na mocnych kolorach (successStrong, secondaryStrong...)

  primary: '#2F6A8C', // główny przycisk, linki, stan aktywny
  primaryHover: '#183A4F',
  onPrimary: '#FFFFFF',
  primarySoft: '#A1CAE2', // przycisk drugorzędny
  onPrimarySoft: '#183A4F',
  primarySubtle: '#F1F8FC', // tła miniatur, numerów kroków, badge dopasowania
  focusRing: '#6BA8CC',

  secondary: '#ECDAF0',
  onSecondary: '#744A84',
  secondaryStrong: '#744A84', // ulubione (serduszko)

  success: '#C0D79C',
  onSuccess: '#2A3A14',
  successStrong: '#4E6B28', // „masz", „na liście"

  warning: '#FFFCAB', // chip terminu ważności
  onWarning: '#433A05',
  warningStrong: '#7D6E0C', // niepewne rozpoznanie
  highlight: '#FFFCAB',

  error: '#A63A31', // usuwanie, akcje destrukcyjne
  onError: '#FFFFFF',
  errorSoft: '#FDF0EF',
  onErrorSoft: '#A63A31',

  // Odwrócona powierzchnia (toast) - spoza palety, wyprowadzona z text/background
  inverse: '#1C2730',
  onInverse: '#FFFFFF',
  inverseAccent: '#D5B4DE', // link „Cofnij" w toaście
} as const;

export const colors = {
  ...semantic,

  // Ekran aparatu i welcome (zdjęcie w tle) są zawsze ciemne.
  camera: palette.blue[900], // tło ekranu skanowania i braku zgody na kamerę
  onCamera: palette.neutral[0], // tekst i ikony na ekranie aparatu / zdjęciu welcome
  cameraAccent: palette.blue[300], // linia skanu
  toggleKnob: palette.neutral[0], // gałka przełącznika
};

// Przezroczystości używane na ciemnych tłach (skan, brak zgody, welcome)
export const alpha = {
  whiteTile: 'rgba(255,255,255,.14)', // kafelek ikony na ciemnym tle
  whiteOutlineBorder: 'rgba(255,255,255,.28)', // ramka przycisku outline na ciemnym tle
  whiteText50: 'rgba(255,255,255,.5)',
  whiteText60: 'rgba(255,255,255,.6)',
  whiteText72: 'rgba(255,255,255,.72)',
  whiteText78: 'rgba(255,255,255,.78)',
  welcomeOverlay: 'rgba(20,20,19,.72)', // overlay na tle welcome screena
  sheetOverlay: 'rgba(28,39,48,.45)', // overlay pod bottom sheetem
} as const;

export type ColorToken = keyof typeof colors;
