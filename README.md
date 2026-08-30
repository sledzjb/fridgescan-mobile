# Handoff: CoZLodówki (FridgeScan) — aplikacja mobilna React Native

## Overview

Aplikacja mobilna, która na podstawie jednego zdjęcia wnętrza lodówki rozpoznaje produkty i proponuje przepisy z tego, co użytkownik już ma. Bez konta i logowania — wszystkie dane trzymane lokalnie na telefonie. Interfejs w języku polskim.

Zakres tego handoffu: pełny przepływ aplikacji — onboarding, lodówka (lista produktów), skanowanie, korekta rozpoznania, generator przepisów z filtrami, szczegóły przepisu, ulubione, lista zakupów, historia, ustawienia z RODO — wraz ze wszystkimi stanami brzegowymi (pusto, brak zgody, błąd, ładowanie).

## About the Design Files

Pliki w folderze `design/` to **referencje designu wykonane w HTML** — działający prototyp pokazujący docelowy wygląd i zachowanie. **Nie jest to kod produkcyjny do skopiowania.**

Zadanie: **odtworzyć te ekrany w React Native** (Expo), używając wzorców i bibliotek docelowego projektu. Jeśli projekt jeszcze nie istnieje, rekomendowany stack:

- **Expo** (SDK bieżący) + TypeScript
- **@react-navigation/native** + `bottom-tabs` + `native-stack`
- **lucide-react-native** — ikony (nazwy 1:1 z prototypu, tabela poniżej)
- **expo-camera** — skanowanie, **expo-image-picker** — wybór z galerii
- **expo-sqlite** lub WatermelonDB — lokalna baza
- **expo-notifications** — powiadomienia o terminach ważności
- Style: `StyleSheet.create()` z plikiem `theme.ts` (albo NativeWind, jeśli zespół preferuje klasy)

Prototyp jest zbudowany jako jeden plik z przełącznikiem ekranów po lewej stronie — w prawdziwej aplikacji każdy ekran to osobny komponent w odpowiednim stacku (patrz **Mapa nawigacji**).

## Fidelity

**High-fidelity.** Kolory, typografia, odstępy i promienie są finalne i mają być odtworzone dokładnie. Wszystkie wartości są wypisane w sekcji **Design Tokens** i widoczne w trzech arkuszach specyfikacji na końcu prototypu (`Spec — tokeny i typografia`, `Spec — komponenty`, `Spec — nawigacja i ikony`).

Wyjątki, które developer dobiera sam:

- **Animacje i przejścia** — nie są wyspecyfikowane (świadoma decyzja). Użyj domyślnych przejść React Navigation; bottom sheety otwierają się z dołu.
- **Date picker** — w prototypie data ważności to pole tekstowe `DD.MM.RRRR` z presetami. W RN użyj natywnego pickera (`@react-native-community/datetimepicker`), zachowując presety jako chipy nad polem.
- **Safe area** — prototyp ma sztywny górny padding 64 px symulujący status bar. W RN użyj `useSafeAreaInsets()`.

## Design Tokens

### Kolory

Nazwy przeniesione 1:1 do `theme.ts`. **Żaden kolor poza tą listą nie występuje w designie.** Bez gradientów.

```ts
export const colors = {
  // Primary — zieleń
  primary900: '#173404', // welcome overlay, karta Premium
  primary700: '#3B6D11', // CTA, aktywny stan, linki, tekst „masz"
  primary50:  '#EAF3DE', // tło badge dopasowania, numery kroków

  // Secondary — koral
  secondary700: '#993C1D', // tekst na chipie terminu, akcje destrukcyjne
  secondary500: '#D85A30', // „Oznacz jako wykonane", aktywne serduszko
  secondary300: '#F0997B', // ramka niepewnego rozpoznania, link „Cofnij" w toaście
  secondary50:  '#FAECE7', // tło chipa terminu ważności

  // Accent — turkus
  accent900: '#04342C', // tło ekranu skanowania, brak zgody na kamerę
  accent600: '#1D9E75', // główna akcja „Zrób zdjęcie"
  accent400: '#5DCAA5', // linia skanu, ramki rozpoznanych produktów

  // Neutral
  ink:     '#2C2C2A', // tekst podstawowy, przyciski drugorzędne
  inkSoft: '#444441', // treść kroków przepisu
  mute:    '#888780', // tekst pomocniczy, nieaktywna zakładka
  line:    '#D3D1C7', // obramowania, separatory, tło steppera
  surface: '#F1EFE8', // tło ekranu
  white:   '#FFFFFF', // tło kart, list i tab bara
};
```

Reguły kontrastu: na `primary700`, `primary900`, `secondary500`, `secondary700`, `accent600`, `accent900`, `ink` → tekst biały. Na `primary50` → tekst `primary700`. Na `secondary50` → tekst `secondary700`. Na `surface`, `white`, `line` → tekst `ink` lub `mute`.

Przezroczystości używane na ciemnych tłach: `rgba(255,255,255,.14)` (kafelek ikony), `.28` (ramka przycisku outline), `.5`/`.6`/`.72` (tekst pomocniczy w trzech nasileniach). Overlay welcome screena: `rgba(20,20,19,.72)`. Overlay pod bottom sheetem: `rgba(44,44,42,.35)`.

### Typografia

Dwa kroje: **Outfit** (300–700) do interfejsu, **IBM Plex Mono** (400, 500) do metadanych, ilości, liczników i nagłówków sekcji.

| token | size | weight | line-height | letter-spacing | krój | użycie |
|---|---|---|---|---|---|---|
| display | 40 | 600 | 1.08 | −0.03em | Outfit | nazwa aplikacji na welcome |
| h1 | 27 | 600 | 1.15 | −0.02em | Outfit | nagłówek ekranu |
| h2 | 23 | 600 | 1.18 | −0.02em | Outfit | tytuł przepisu w szczegółach |
| h3 | 17 | 600 | 1.25 | 0 | Outfit | nagłówek karty Premium, bottom sheeta |
| bodyL | 15 | 400 | 1.55 | 0 | Outfit | opis pod nagłówkiem |
| body | 14 | 400 | 1.5 | 0 | Outfit | kroki przepisu, opisy pozycji |
| label | 14.5 | 600 | 1.2 | 0 | Outfit | nazwa produktu, etykieta wiersza |
| button | 15.5 | 600 | 1 | 0 | Outfit | tekst przycisku głównego |
| caption | 12.5 | 400 | 1.45 | 0 | Outfit | podpis pod etykietą |
| kicker | 11 | 500 | 1 | 0.14em | IBM Plex Mono | nagłówek sekcji, UPPERCASE |
| meta | 11 | 400 | 1 | 0 | IBM Plex Mono | ilości, czasy, liczniki |

Uwaga: w prototypie występują pośrednie rozmiary (13, 13.5, 15.5 px) — w RN zaokrąglij do najbliższego tokenu, chyba że wartość jest wypisana w opisie ekranu poniżej.

### Spacing

`space-1: 4` · `space-2: 8` · `space-3: 12` · `space-4: 16` · `space-5: 20` · `space-6: 24` · `space-7: 32` · `space-8: 44` · `space-9: 64`

Padding poziomy ekranu: **20** (formularze i onboarding: **24–26**). Górny padding treści: **64** (zastąp safe area + 20). Dolny: **24**.

### Radius

| token | px | użycie |
|---|---|---|
| sm | 9 | przyciski ilości −/+, małe kafelki |
| md | 13 | input w ustawieniach, przycisk w karcie |
| lg | 16 | karty list, przyciski w arkuszu |
| xl | 18 | karta przepisu, kontener listy |
| 2xl | 22 | slot na ilustrację w onboardingu |
| sheet | 26 | górne narożniki bottom sheeta |
| pill | 999 | chipy, badge, przełączniki, kropki |

Przyciski główne (CTA na dole ekranu): radius **17**.

### Cienie

Design jest **flat — bez cieni**. Hierarchia warstw budowana wyłącznie tłem i obramowaniem 1 px w kolorze `line`. Jedyny wyjątek: bottom sheet i toast odcinają się od tła przez overlay, nie przez cień.

## Biblioteka komponentów

Wszystkie stany są narysowane w arkuszu `Spec — komponenty` w prototypie.

### Button

| wariant | tło | tekst | radius | padding | użycie |
|---|---|---|---|---|---|
| primary | `primary700` | white, 15.5/600 | 17 | 16 | potwierdzenie, zapis |
| secondary | `ink` | white, 15.5/600 | 17 | 16 | akcja neutralna (generuj, udostępnij) |
| accent-action | `secondary500` | white, 15/600 | 16 | 15 | „Oznacz jako wykonane" — tylko w szczegółach przepisu |
| outline | brak, ramka 1 px `line` | `ink`, 14.5/500 | 16 | 15 | akcja drugorzędna obok primary |
| tertiary | brak | `primary700`, 14.5/500 | — | 14 | akcja tekstowa, min. wysokość dotyku 44 |
| disabled | `line` | `mute`, 15.5/600 | 17 | 16 | gdy formularz niekompletny |

Na ciemnym tle (skan, brak zgody) primary odwraca się: tło `white`, tekst `accent900`; outline ma ramkę `rgba(255,255,255,.28)` i tekst biały.

### Chip

Wysokość ~35 (padding 9/14), radius pill, tekst 13.

- **domyślny**: tło `white`, ramka 1 px `line`, tekst `ink` 500
- **wybrany**: tło `primary700`, ramka `primary700`, tekst white 600
- **filtr aktywny** (lista wszystkich przepisów): tło `ink`, tekst white
- **sugestia do dodania**: tło `white`, ramka **dashed** `line`, tekst `mute`, prefiks `+`

### Badge

- **dopasowanie**: tło `primary50`, tekst `primary700`, mono 11/500, padding 5/9, pill
- **termin ważności**: tło `secondary50`, tekst `secondary700`, Outfit 11/500, padding 4/9, pill. Bez letter-spacingu. Treść: `został 1 dzień` / `zostały 2 dni`
- **rozpoznane na skanie**: ramka 1.5 px `accent400`, tło `rgba(16,19,20,.55)`, tekst `accent400` mono 11, radius 9
- **niepewne rozpoznanie (< 70%)**: to samo, ale `secondary300`, treść ze znakiem zapytania: `szpinak? · 64%`

### Input

Tło `white`, ramka 1 px `line`, radius 14, padding 15, tekst 16/500 `ink`.

- **placeholder**: kolor `mute`, waga 400
- **focus**: ramka `primary700` (kolor tła i tekstu bez zmian)
- **na tle karty** (ustawienia): tło `surface`, radius 13, padding 13/14
- **pole numeryczne** (ilość): szerokość 88–96, `textAlign: center`, krój IBM Plex Mono

### Toggle / checkbox / stepper

- **Toggle**: 44 × 26, radius pill. Off: tor `line`, knob biały 20 × 20 przy `left: 3`. On: tor `primary700`, knob przy `left: 21`.
- **Checkbox**: 21 × 21, radius 6. Off: ramka 1.5 px `line`, brak tła. On: tło i ramka `primary700`, biały znak `✓` 12/500.
- **Stepper ilości**: dwa kwadraty 30 × 30, radius 9, tło `line`, znaki `−` / `+` 16/500. Między nimi wartość mono 12.5 o minimalnej szerokości 44. Krok: **1** dla `szt`, **50** dla `g` i `ml`, **0,5** dla `l`. Wartość nie schodzi poniżej 0.

### Wiersz listy i karta

Kontener: tło `white`, ramka 1 px `line`, radius 16–18, `overflow: hidden`.

Wiersz: padding 11–13 / 14, `flexDirection: row`, `gap: 12`, separator 1 px `line` na dole każdego wiersza (ostatni obcina `overflow: hidden` kontenera — w RN zamiast tego pomiń border na ostatnim elemencie).

Zawartość wiersza: miniatura 34–36 (radius 10) → nazwa (`label`) + meta pod nią (mono 11, `mute`) → wartość po prawej (mono 11.5, `mute`).

Miniatura produktu ma dwa stany: **zdjęcie** (tło `white`, obraz `contain`) albo **fallback** gdy brak zdjęcia (tło `primary50`, pierwsza litera nazwy, 13/600, `primary700`).

Na końcu listy bywa wiersz akcji: padding 13/14, tekst 14/500 `primary700`, prefiks `+`.

### Bottom sheet

Tło `white`, górne narożniki 26, padding 20/20/40. Na górze uchwyt: 36 × 4, radius pill, `line`, wyśrodkowany, margines dolny 18. Pod nim overlay `rgba(44,44,42,.35)` na całym ekranie — tapnięcie zamyka.

### Toast

Pozycja absolutna, `left/right: 16`, `bottom: 96` (nad tab barem). Tło `ink`, radius 15, padding 14/16. Ikona `check` biała 18 → tekst 13.5/500 biały → akcja `Cofnij` 12.5/500 w `secondary300`. Auto-ukrycie po **2400 ms**.

## Mapa nawigacji

| stack | ekrany | tab |
|---|---|---|
| Onboarding | welcome → name → intro (3 kroki) → zgoda na powiadomienia | poza tab barem, modal przy pierwszym uruchomieniu |
| Lodówka | fridge · fridge-empty · manual · found · edycja produktu (sheet) | Tab 1 — `refrigerator` |
| Skan | scan · brak zgody · brak wyników · błąd AI | pełnoekranowy modal nad Tabem 1 |
| Generator | generator → loading → results (lub results-empty) → detail | Tab 2 — `sparkles` |
| Przepisy | all · search · detail | Tab 3 — `book-open` |
| Ulubione | favorites (lub stan pusty) · detail | Tab 4 — `heart` |
| Więcej | more → history · settings · shopping | Tab 5 — `ellipsis` |

**Tab bar**: wysokość 80 (z safe area), tło `white`, górna krawędź 1 px `line`, padding górny 11. Ikona 23, odstęp 6, podpis 11/500. Aktywna zakładka: ikona `opacity: 1`, podpis `ink`. Nieaktywna: `opacity: .45`, podpis `mute`. Ukryty na: welcome, name, intro, zgoda na powiadomienia, scan, brak zgody na kamerę.

Zakładka „Więcej" podświetla się także na Historii, Ustawieniach i Liście zakupów. Ekran szczegółów przepisu podświetla tę zakładkę, z której został otwarty (wymaga zapamiętania `from`).

## Ikony — lucide-react-native

| element | ikona |
|---|---|
| Zakładka Lodówka | `refrigerator` |
| Zakładka Generator | `sparkles` |
| Zakładka Przepisy | `book-open` |
| Zakładka Ulubione | `heart` |
| Zakładka Więcej | `ellipsis` |
| Zrób zdjęcie | `camera` |
| Z galerii | `image` |
| Ręcznie | `pencil-line` |
| Powrót | `arrow-left` |
| Zamknij / usuń | `x` |
| Termin ważności | `calendar-clock` |
| Lista zakupów | `shopping-basket` |
| Powiadomienia | `bell` |
| Potwierdzenie | `check` |
| Rozwiń wiersz | `chevron-right` |
| Błąd / ostrzeżenie | `triangle-alert` |
| Brak sieci | `wifi-off` |

Rozmiary: 23 w tab barze, 21–22 w wierszach i przyciskach, 24–28 w kafelkach stanów pustych.

## Screens / Views

### 1. Welcome

**Cel**: pierwsze wrażenie i jedno kliknięcie w onboarding.

Pełnoekranowe zdjęcie (wnętrze lodówki / świeże warzywa, kadr pionowy 3:4) jako tło, na nim overlay `rgba(20,20,19,.72)`. Treść wyśrodkowana pionowo i poziomo: kafelek 86 × 86, radius 26, tło `rgba(255,255,255,.14)`, w środku prosty znak lodówki (prostokąt 34 × 44, ramka 2.5 px biała, radius 8, z poziomą kreską na wysokości 15 px). Pod nim `display` biały „FridgeScan", pod nim tekst 16/1.5 w `rgba(255,255,255,.78)`, max. szerokość 270, wyśrodkowany: „Zrób zdjęcie lodówki. Dostaniesz przepisy z tego, co już masz."

Na dole przycisk primary odwrócony: tło `white`, tekst `primary700` — **„Zaczynamy"**.

Padding: 64 / 28 / 44.

### 2. Imię

**Cel**: pobrać imię do personalizacji, wyjaśnić brak konta.

Tło `surface`. Strzałka powrotu (`←`, 13, `mute`) u góry. Treść wyśrodkowana pionowo: kicker `primary700` „ZANIM ZACZNIEMY" → h2 29/600 „Jak się do Ciebie zwracać?" → tekst 15/1.55 `mute`: „Tylko imię, żeby aplikacja mówiła do Ciebie po ludzku. Zapisujemy je lokalnie — nie zakładamy konta i nic nie wysyłamy na serwer." → input (radius 15, padding 16, tekst 17/500) z placeholderem „Twoje imię".

CTA primary na dole. Etykieta jest dynamiczna: przy pustym polu **„Dalej"**, po wpisaniu **„Cześć, {imię} — dalej"**.

### 3. Wprowadzenie (3 kroki)

**Cel**: wyjaśnić model działania w trzech ekranach.

Górny pasek: stepper wyśrodkowany (3 kropki 7 × 7, radius pill; aktywna rozszerza się do 20 × 7, kolor `primary700`, nieaktywne `line`), po prawej „Pomiń" (13/500, `mute`) prowadzące wprost do lodówki. Po lewej pusty element 60 px równoważący układ.

Treść wyśrodkowana pionowo: slot na ilustrację (wysokość 250, radius 22, `cover`) → kicker `primary700` „KROK N Z 3" → h2 27/600 → opis 15/1.55 `mute`.

Dolny pasek: „Cofnij" po lewej (14.5/500, `mute`; na pierwszym kroku wraca do ekranu imienia), po prawej przycisk `ink` radius 15, padding 14/26 — „Dalej", a na trzecim kroku „Zaczynajmy".

Treści:
1. **Zrób jedno zdjęcie** — „Otwórz lodówkę i zrób zdjęcie w aplikacji albo wybierz je z galerii. Nie musisz nic wpisywać."
2. **AI rozpoznaje produkty** — „W kilka sekund dostajesz listę. Możesz poprawić ilości, dodać pominięte i usunąć błędne pozycje."
3. **Gotujesz z tego, co masz** — „Wybierz rodzaj posiłku, smak i poziom trudności. Pokażemy przepisy, w których minimum 3 składniki już masz."

Ilustracje do dostarczenia (3 sztuki, kadr poziomy, proporcja ~3:2): telefon przed otwartą lodówką · lista rozpoznanych produktów · karty przepisów z dopasowaniem.

### 4. Zgoda na powiadomienia

**Cel**: uzasadnić prośbę o powiadomienia przed wywołaniem systemowego dialogu.

Tło `surface`, treść wyśrodkowana pionowo, padding 26. Kafelek 60 × 60 radius 19, tło `primary50`, ikona `bell` 26. h1 „Mamy Ci przypominać, co się psuje?" → tekst 15/1.55 `mute`: „Jedno powiadomienie, gdy coś w lodówce zbliża się do końca terminu. Bez tego łatwo przeoczyć jogurt."

Karta z trzema wierszami (ikona `check` 17 + etykieta 14/600 + opis 12/1.45 `mute`):
- Produkty tracące świeżość — 2 dni przed końcem terminu
- Pomysł na dziś — codziennie o 17:00, jedna propozycja
- Po ugotowaniu — przypomnienie o uzupełnieniu składników

Pod kartą tekst 12/1.5 `mute`: „Każde z nich wyłączysz osobno w Ustawieniach."

CTA primary **„Włącz powiadomienia"** (wywołuje systemowy dialog, potem toast „Powiadomienia włączone" i przejście do lodówki) + tertiary **„Nie teraz"**.

### 5. Lodówka

**Cel**: główny ekran — stan lodówki i punkt startu każdej akcji.

Nagłówek: kicker „CZEŚĆ, {IMIĘ}" → h1 „Lodówka" → meta „{N} produktów · ostatni skan dziś 18:12". Po prawej akcja tekstowa **„Edytuj" / „Gotowe"** (13/500, `primary700`) przełączająca tryb edycji.

**Trzy kafelki akcji** w rzędzie (`gap: 9`, każdy `flex: 1`, radius 16, padding 14): ikona 22 → etykieta 14.5/600 → opis 11.5/1.3. Pierwszy jest wyróżniony: tło `accent600`, treść biała, opis `rgba(255,255,255,.72)`, `scale(.985)` przy przyciśnięciu. Dwa pozostałe: tło `white`, ramka `line`, opis `mute`.
- Zrób zdjęcie / AI rozpozna produkty (`camera`)
- Z galerii / wybierz zdjęcie (`image`)
- Ręcznie / wpisz produkt (`pencil-line`)

**Sekcja „ZUŻYJ WKRÓTCE"**: karta z wierszami — miniatura 36, nazwa 14.5/600, pod nią badge terminu ważności, po prawej ilość. Widoczna tylko gdy coś ma termin ≤ 2 dni.

**Sekcja „WSZYSTKIE PRODUKTY"**: karta z wierszami — miniatura 34, nazwa, kategoria (mono 11, `mute`), po prawej ilość. Tapnięcie wiersza otwiera bottom sheet edycji. W trybie edycji ilość zastępuje stepper `− 150 g +` oraz `×` w kolorze `secondary700` usuwający produkt (z toastem). Na końcu wiersz akcji „+ Dodaj produkt ręcznie".

Na dole CTA secondary (`ink`) **„Generuj przepisy z tej lodówki"**.

Dane startowe (13 produktów): Jajka 6 szt (Nabiał), Mleko 3,2% 1 l, Masło 200 g, Feta 150 g, Jogurt naturalny 400 g, Szpinak 200 g (Warzywa), Brokuł 1 szt, Pieczarki 300 g, Jabłka 4 szt (Owoce), Makaron penne 500 g (Sypkie), Hummus z bakłażana 200 g, Ser żółty 200 g, Pierś z kurczaka 450 g (Mięso).

Wygasające: Jogurt naturalny „został 1 dzień", Szpinak „zostały 2 dni".

### 6. Lodówka — stan pusty

**Cel**: pierwsze uruchomienie — skierować do skanu.

Ten sam nagłówek, meta „pusto · brak skanów". Zamiast list karta z ramką **dashed** `line`, radius 20, padding 34/24, wyśrodkowana: kafelek 56 × 56 radius 17 tło `primary50` z ikoną `refrigerator` 26 → h3 „Twoja lodówka jest pusta" → tekst 13.5/1.5 `mute`: „Zrób jedno zdjęcie wnętrza — AI rozpozna produkty i od razu podpowie przepisy. Możesz też wpisać kilka rzeczy ręcznie." → przycisk `accent600` „Zrób zdjęcie lodówki" → tertiary „Dodam produkty ręcznie".

Pod kartą sekcja „ZACZNIJ OD PODSTAW" z chipami-sugestiami (wariant dashed): Ziemniaki, Cebula, Twaróg, Śmietana 30%, Pomidory, Ryż.

### 7. Dodaj produkt

**Cel**: ręczne dodanie produktu z kategorią, ilością i terminem.

Powrót „← Lodówka", h1 „Dodaj produkt". Sekcje oddzielone kickerami:

- **NAZWA** — input, placeholder „np. Pomidory"
- **KATEGORIA** — chipy (jeden wybór): Nabiał, Warzywa, Owoce, Mięso, Pieczywo, Sypkie, Przyprawy
- **ILOŚĆ** — pole numeryczne 96 px + chipy jednostek: szt, g, ml, l, opak.
- **DATA WAŻNOŚCI — OPCJONALNIE** — pole `DD.MM.RRRR` + chipy presetów: +2 dni, +5 dni, +tydzień, bez daty. Pod polem tekst 12/1.45 `mute`, zmienny: przy ustawionej dacie „Powiadomimy Cię 2 dni przed tą datą.", przy pustej „Bez daty produkt nie trafi do sekcji »Zużyj wkrótce«."
- **PODPOWIEDZI AI** — chipy (nieaktywne, poglądowe)

CTA primary „Dodaj do lodówki". **Walidacja**: przy pustej nazwie przycisk w stanie disabled (tło `line`, tekst `mute`) i nie reaguje. Po zapisie: powrót do lodówki + toast „Dodano »{nazwa}« do lodówki".

### 8. Edycja produktu (bottom sheet)

**Cel**: szybka korekta pozycji bez opuszczania listy.

Otwierany tapnięciem wiersza w lodówce; pola wypełnione danymi produktu. Nagłówek h3 „Edytuj produkt" + „Zamknij" po prawej (13.5/500, `mute`). Pola: nazwa (input) → KATEGORIA (chipy) → ILOŚĆ (pole + chipy jednostek) → DATA WAŻNOŚCI (pole).

Na dole: outline **„Usuń"** z tekstem `secondary700` (nie `flex`) + primary **„Zapisz"** (`flex: 1`). Oba zamykają sheet i pokazują toast.

### 9. Skan / aparat

**Cel**: zrobić zdjęcie i pokazać, że rozpoznawanie działa.

Pełny ekran, tło `accent900`. W prototypie podkład imituje widok kamery paskami `repeating-linear-gradient(135deg, #0F6E56 0 14px, #04342C 14px 28px)` — **w RN zastąp go podglądem `expo-camera`**.

Górny pasek (top 72, padding 20): kółko 34 × 34 `rgba(255,255,255,.14)` ze strzałką powrotu + kicker „SKAN LODÓWKI" w `rgba(255,255,255,.6)`.

W trakcie skanowania: pozioma linia 2 px (`linear-gradient(90deg, transparent, accent400, transparent)`) przesuwająca się w dół 260 px, 1.5 s, `ease-in-out`, `alternate`, w pętli. Wraz z nią pojawiają się badge rozpoznania w miejscach produktów: `jajka · 96%`, `feta · 91%` (accent400) i `szpinak? · 64%` (secondary300).

Dolny obszar (bottom 50): tekst 13/1.45 w `rgba(255,255,255,.72)`, max. 250, wyśrodkowany. Stan spoczynku: „Zrób zdjęcie lodówki, wybierz je z galerii albo dodaj produkty ręcznie". W trakcie: „Rozpoznaję produkty…".

Pod nim rząd (`gap: 26`): kwadrat 44 × 44 radius 11 (miniatura galerii) → **spust**: kółko 72 × 72, ramka 3 px `rgba(255,255,255,.9)`, w środku białe koło 56 × 56 → kwadrat 44 × 44 z `+` (dodawanie ręczne). Pod rzędem podpis 11.5 w `rgba(255,255,255,.5)`: „galeria · zdjęcie · ręcznie".

Po naciśnięciu spustu: stan skanowania trwa **1800 ms**, potem przejście na ekran rozpoznanych produktów. Powtórne naciśnięcie w trakcie jest ignorowane.

### 10. Brak zgody na kamerę

**Cel**: wyjaśnić blokadę i dać dwie drogi wyjścia.

Tło `accent900`, treść wyśrodkowana pionowo, padding 26. Kafelek 62 × 62 radius 19 `rgba(255,255,255,.13)` z białą ikoną `camera` 28. h1 biały „Aplikacja nie ma dostępu do kamery" → tekst 15/1.55 `rgba(255,255,255,.72)`: „Bez kamery nie zrobimy zdjęcia lodówki. Możesz włączyć dostęp w ustawieniach systemowych albo pracować bez skanowania."

Karta `rgba(255,255,255,.08)` radius 16: kicker „CO ROBIMY ZE ZDJĘCIEM" → „Wysyłamy je raz do rozpoznania i usuwamy po 24 godzinach. Nie zapisujemy go w galerii aplikacji."

Akcje: primary odwrócony „Otwórz ustawienia systemowe" (`Linking.openSettings()`) → outline biały „Dodaj produkty ręcznie" → tertiary `rgba(255,255,255,.6)` „Wróć do lodówki".

### 11. Rozpoznane produkty

**Cel**: korekta wyniku AI przed zapisem.

Powrót „← Skanuj ponownie", h1 „Rozpoznano 6 produktów", tekst 13.5/1.5 `mute`: „Popraw ilości, usuń błędne pozycje, dodaj to, czego AI nie zauważyła. Poprawki uczą model Twoich zwyczajów."

Karta z wierszami: miniatura 36 → nazwa 14.5/600 + meta „pewność 96%" (mono 11) → stepper `− 6 szt +` → `×`.

Pozycje o pewności < 70% mają meta w kolorze `secondary700` z dopiskiem „· potwierdź" oraz drugi rząd (wcięcie 48, margines górny 10) z dwoma chipami: **„Tak, to szpinak"** (tło `primary50`, tekst `primary700`) i **„Nie, usuń"** (tło `line`). Po potwierdzeniu rząd znika, a meta zmienia się na „potwierdzone przez Ciebie" w kolorze `mute`.

Na końcu wiersz akcji „+ Dodaj pominięty produkt". CTA primary **„Zapisz do lodówki"**.

Dane: Jajka 96% 6 szt · Feta 91% 150 g · Mleko 3,2% 90% 1 l · **Szpinak 64% 200 g (wymaga potwierdzenia)** · Pieczarki 88% 300 g · Jogurt naturalny 84% 400 g.

### 12. Skan bez wyników

**Cel**: nauczyć, jak zrobić lepsze zdjęcie.

Powrót „← Skanuj ponownie". Karta `white`, radius 20, padding 28/22: kafelek 52 × 52 radius 16 tło `secondary50` z ikoną `triangle-alert` 24 → tytuł 20/600 „Nie rozpoznaliśmy żadnego produktu" → tekst 13.5/1.5 `mute`: „Zdjęcie było zbyt ciemne albo produkty są zasłonięte. To zdarza się przy zamkniętych szufladach i folii."

Lista trzech wskazówek numerowanych mono `01`–`03` w `primary700`:
1. Otwórz drzwi szerzej i włącz światło w pomieszczeniu
2. Wyciągnij produkty z szuflad na widoczną półkę
3. Trzymaj telefon 40–60 cm od lodówki, bez zbliżenia

Akcje: `accent600` „Zrób nowe zdjęcie" → outline „Wpisz produkty ręcznie".

### 13. Błąd AI / brak sieci

**Cel**: nie zgubić zdjęcia i pokazać, co działa offline.

Karta wyśrodkowana: kafelek `secondary50` z ikoną `wifi-off` → tytuł 20/600 „Rozpoznawanie nie zadziałało" → tekst: „Brak połączenia z serwerem rozpoznawania. Zdjęcie zostało zapisane lokalnie — spróbujemy ponownie, gdy wróci internet." → blok techniczny (tło `surface`, radius 13, mono 11, `mute`): `błąd: NETWORK_TIMEOUT · 18:12:44` → primary „Spróbuj ponownie" → tertiary „Dodaj produkty ręcznie".

Pod kartą sekcja „CO DZIAŁA OFFLINE": „Lista produktów, ręczne dodawanie, ulubione przepisy i lista zakupów. Nie działa: rozpoznawanie zdjęć i generowanie nowych propozycji."

### 14. Generator przepisów

**Cel**: zebrać cztery preferencje przed dopasowaniem.

h1 „Generator przepisów", tekst 13.5/1.5 `mute`: „Wybierz preferencje. Pokażemy tylko przepisy, w których co najmniej 3 składniki masz w lodówce."

Cztery grupy (`gap: 18`), każda: kicker → rząd opcji. Opcje to szerokie pola (`flex: 1`, min. szerokość 88, padding 14/8, radius 15, tekst wyśrodkowany 13.5): niewybrana `white` + ramka `line` + waga 500, wybrana `primary700` + tekst biały + waga 600.

- **RODZAJ POSIŁKU**: Śniadanie / Obiad / Kolacja
- **PROFIL SMAKOWY**: Na słodko / Na słono
- **POZIOM TRUDNOŚCI**: Proste / Złożone — z notką 11.5/1.4 `mute`: „Proste = także dla dzieci. Złożone = więcej kroków i technik."
- **DLA KOGO**: Dla dzieci / Dla dorosłych

Karta „BAZA": „{N} w lodówce, 2 z nich kończą się w ciągu 2 dni. Damy im priorytet."

CTA primary „Generuj propozycje" + licznik po prawej (mono 11.5, `rgba(255,255,255,.6)`): „{N} pasuje". Przejście prowadzi przez ekran ładowania.

Domyślne wartości: Śniadanie · Na słono · Proste · Dla dzieci (daje 2 wyniki).

### 15. Ładowanie propozycji

**Cel**: pokazać postęp dopasowania.

h1 „Szukam przepisów", meta „dopasowuję 842 przepisy do 13 produktów…". Pasek postępu: tor 3 px `line` radius pill, wypełnienie 46% w `primary700` (w RN animuj w nieskończoność albo powiąż z realnym postępem).

Pięć skeletonów w kształcie karty przepisu: kontener `white` + ramka `line` radius 18 padding 13; miniatura 64 × 64 radius 14 w `surface`; trzy paski (13 px wysokości / 72% szerokości, 10 / 44%, 10 / 58%) radius pill w `surface`; badge 44 × 22 radius pill w prawym górnym rogu.

Czas trwania w prototypie: **1500 ms**, potem lista wyników.

### 16. Propozycje

**Cel**: wybrać przepis z dopasowanej listy.

Powrót „← Zmień preferencje", h1 „Propozycje", meta „{N} propozycji · min. 3 składniki z lodówki" (odmiana: 1 propozycja / 2–4 propozycje / 5+ propozycji). Pod nagłówkiem chipy z aktywnymi filtrami (nieklikalne, tylko informacja).

Karty przepisów (`gap: 10`, radius 18, padding 13): zdjęcie 64 × 64 radius 14 → tytuł 15.5/600 + rząd metadanych (mono 11, `mute`, oddzielone `·`): czas · trudność · „5 z 5 składników" + linia 12/1.35 `mute` „Zużywa szpinak, który kończy się za 2 dni" → badge dopasowania w prawym górnym rogu (`alignSelf: flex-start`).

### 17. Propozycje — brak wyników

Ten sam nagłówek z zerowym licznikiem i chipami filtrów. Karta dashed: „Nic nie pasuje do wszystkich czterech filtrów" → „Najbardziej ograniczające jest »Złożone« — po jego zdjęciu mamy 2 propozycje." → primary „Poluzuj »Złożone«" → tertiary „Dodaj produkty do lodówki".

Logika: policz, który z czterech filtrów po zdjęciu daje najwięcej wyników, i nazwij go w komunikacie oraz w etykiecie przycisku.

### 18. Szczegóły przepisu

**Cel**: ugotować i zaktualizować lodówkę.

Tło **`white`** (jedyny ekran główny bez `surface`). Powrót „← Wróć" wraca tam, skąd otwarto.

Nagłówek: zdjęcie 84 × 84 radius 18 + h2 tytuł + rząd metadanych (czas · trudność · profil smakowy). Pod nim pasek `primary50` radius 14, padding 12/14, tekst 12.5/1.45 `primary700` — informacja co przepis zużywa.

**WARTOŚCI ODŻYWCZE**: cztery pola w rzędzie (`flex: 1`, ramka `line`, radius 13, padding 11/8, wyśrodkowane): wartość 15/600 + jednostka mono 10.5 `mute`. Dla omletu: 312 kcal · 21 g białko · 22 g tłuszcz · 5 g węgl.

**SKŁADNIKI**: lista w kontenerze z ramką — nazwa 14/500 (`flex: 1`) · ilość mono 12 `mute` · status mono 11 o minimalnej szerokości 52, wyrównany do prawej: **„masz"** w `primary700`, **„brakuje"** w `secondary700`.

**PRZYGOTOWANIE**: kroki (`gap: 13`) — kółko 25 × 25 radius pill tło `primary50`, numer mono 11.5 `primary700` + tekst 14/1.5 w `inkSoft`.

Na dole rząd: **„Oznacz jako wykonane"** (accent-action, `flex: 1`) + kwadrat 54 px z ramką `line` radius 16 i serduszkiem 17 (`secondary500` gdy ulubione, `line` gdy nie).

### 19. Arkusz „Uaktualnić lodówkę?" (bottom sheet)

Otwierany przyciskiem „Oznacz jako wykonane".

h3 22/600 „Uaktualnić lodówkę?" → tekst 13/1.45 `mute` „Odejmiemy zużyte składniki. Możesz odznaczyć to, co zostało."

Lista składników oznaczonych „masz", każdy z checkboxem (domyślnie zaznaczony) i deltą po prawej: `− 3 szt`. Odznaczenie zmienia deltę na „bez zmian" i czyści checkbox.

Pod listą wiersz `surface` radius 16 z togglem: „Przypomnij o uzupełnieniu" + „Powiadomienie za 3 dni: jajka, szpinak, feta".

Na dole: outline „Nie teraz" (nie `flex`) + secondary (`ink`) „Zaktualizuj" (`flex: 1`), które zamyka sheet i wraca do lodówki.

### 20. Wszystkie przepisy

**Cel**: przeglądanie bazy niezależnie od lodówki.

h1 „Wszystkie przepisy", meta „842 przepisy · niezależnie od lodówki". Pole szukania (wygląda jak input, ale jest przyciskiem — tapnięcie otwiera ekran szukania). Chipy filtrów (wariant „filtr aktywny" w `ink`): Wszystkie, Śniadania, Obiady, Kolacje, Na słodko, Wegetariańskie.

Lista w jednym kontenerze: zdjęcie 52 × 52 radius 12 → tytuł 14.5/600 + meta „15 min · Śniadanie · Proste" → procent dopasowania po prawej (mono 12.5) w `primary700` gdy ≥ 85%, w `mute` poniżej.

### 21. Szukaj przepisu

**Cel**: znaleźć przepis po nazwie lub składniku.

Górny rząd: aktywny input (ramka `primary700`, `autoFocus`) + „Anuluj" (14/500, `mute`) czyszczące zapytanie. Pod nim licznik mono `mute`: „{N} wyników dla »{zapytanie}«" albo „Wpisz nazwę przepisu lub składnika" przy pustym polu.

Przy pustym zapytaniu: sekcja „OSTATNIO SZUKANE" z chipami: jajka, szpinak, na słodko, 20 min (tapnięcie wstawia frazę).

Wyniki: lista jak na ekranie wszystkich przepisów (bez procentu dopasowania). Szukanie obejmuje **tytuł i nazwy składników**, bez uwzględniania wielkości liter.

Brak wyników: karta dashed „Brak wyników" → „Sprawdź pisownię albo szukaj po składniku, nie po nazwie potrawy."

### 22. Ulubione

h1 „Ulubione", tekst „Zapisane przepisy działają też offline. Kolekcje i udostępnianie dojdą w kolejnej wersji."

Karty (radius 18, padding 13): zdjęcie 56 × 56 radius 13 → tytuł 15/600 + meta → serduszko 16 w `secondary500`.

**Stan pusty**: karta dashed z kafelkiem `secondary50` i ikoną `heart` → h3 „Nic tu jeszcze nie ma" → „Tapnij serduszko na ekranie przepisu — wróci tu razem ze składnikami i krokami, dostępny bez internetu." → primary „Znajdź pierwszy przepis".

### 23. Lista zakupów

**Cel**: zebrać brakujące składniki w jednym miejscu.

Powrót „← Więcej", h1 „Lista zakupów", meta „{N} z 5 do kupienia", opis: „Zebrane automatycznie z przepisów, w których brakowało Ci składników. Odhaczone znikną po zakupach."

Wiersze z checkboxem: nazwa 14.5/600 + „na: {tytuł przepisu}" (11.5/1.35, `mute`) + ilość po prawej. Po odhaczeniu nazwa dostaje `textDecoration: line-through` i kolor `mute`.

Na dole: secondary (`ink`) „Udostępnij listę" (`flex: 1`, pokazuje toast „Lista skopiowana do schowka") + outline „Dodaj pozycję".

Dane: Twaróg 200 g (Naleśniki z twarogiem i jabłkiem) · Śmietana 30% 200 ml (Makaron z kurczakiem i brokułem) · Ryż arborio 250 g (Risotto z pieczarkami) · Ciasto kruche 1 opak. (Tarta z porem i serem) · Szynka 100 g (Zapiekanka z jajkiem i szynką).

### 24. Historia

h1 „Historia", opis „Skany lodówki i wygenerowane listy z ostatnich 30 dni."

Timeline: kolumna 9 px z kropką 9 × 9 (kolor zależny od typu wpisu) i pionową linią 1 px `line` pod nią; obok karta radius 16 padding 13/14 — czas (mono 11, `mute`) → tytuł 14.5/600 → opis 12.5/1.45 `mute` → akcja 12.5/500 `primary700`.

Kolory kropek: skan `accent600`, generowanie `primary700`, wykonany przepis `secondary500`, starsze wpisy `line`.

### 25. Więcej

h1 „Więcej", lista wierszy (padding 16/15): etykieta 15/600 + opis 12/1.4 `mute` + `›` w `rgba(44,44,42,.35)`.

Pozycje: Lista zakupów (5 brakujących składników z przepisów) · Historia (Skany i wygenerowane listy) · Ustawienia i konto (Zgody RODO, powiadomienia, Premium) · Pomoc i kontakt (FAQ, zgłoś błędne rozpoznanie).

### 26. Ustawienia i konto

Powrót „← Więcej", h1 „Ustawienia i konto".

**Karta imienia**: kicker „IMIĘ" → input na tle `surface` → „Bez konta i logowania. Wszystko zapisane lokalnie na tym telefonie."

**Karta Premium**: tło `primary900`, radius 18, padding 17. Kicker w `rgba(255,255,255,.55)` „PREMIUM" → h3 biały „Nielimitowane skany i plan tygodniowy" → tekst 12.5/1.45 w `rgba(255,255,255,.62)` „Free: 3 skany dziennie. Premium: bez limitu, listy zakupów, eksport." → przycisk `white` z tekstem `ink` „Sprawdź Premium — 19 zł / mies."

**ZGODY RODO** (wiersze z togglem): Przetwarzanie zdjęć — „Zdjęcia lodówki są analizowane i usuwane po 24 h." (on) · Personalizacja przepisów — „Poprawki i oceny zostają na telefonie i dopasowują propozycje." (on) · Marketing i newsletter — „Wiadomości o nowych funkcjach i promocjach." (off)

**POWIADOMIENIA**: Produkty tracące świeżość — „Powiadomienie 2 dni przed końcem terminu." (on) · Przypomnienia o zakupach — „Po wykonaniu przepisu proponujemy uzupełnienie." (on) · Pomysł na dziś — „Codziennie o 17:00 jedna propozycja z lodówki." (off)

**DANE NA TELEFONIE**: rozmiar bazy „Lokalna baza (SQLite) — 4,2 MB", opis „12 produktów, 2 ulubione przepisy, 4 wpisy historii. Nic nie jest wysyłane na serwer — poza pojedynczym zdjęciem w chwili rozpoznawania." + dwa przyciski na tle `line` radius 12: „Eksportuj kopię", „Wyczyść lodówkę".

**Lista linków**: Pokaż wprowadzenie ponownie · Polityka prywatności · Regulamin · **Usuń wszystkie dane z telefonu** (tekst `secondary700`).

Stopka mono 11/1.5 `mute`: „FridgeScan 0.9.2 · bez konta · dane skanów przechowywane 30 dni lokalnie".

## Interactions & Behavior

### Nawigacja

- Welcome → Imię → Intro (3 kroki, z możliwością pominięcia) → Zgoda na powiadomienia → Lodówka. „Pomiń" w intro prowadzi wprost do lodówki.
- Trzy kafelki na ekranie lodówki: pierwsze dwa → Skan, trzeci → Dodaj produkt.
- Generator → Ładowanie (1500 ms) → Propozycje. Spust skanu → stan skanowania (1800 ms) → Rozpoznane produkty.
- Szczegóły przepisu pamiętają ekran źródłowy (`from`) i wracają tam przyciskiem „← Wróć"; tab bar podświetla zakładkę źródłową.

### Formularze

- **Dodaj produkt**: pole nazwy jest wymagane. Przy pustym → CTA disabled. Ilość i data opcjonalne; brak daty oznacza brak monitoringu terminu.
- **Stepper ilości**: parsuje wartość z jednostki (`150 g` → 150 + `g`), krok zależny od jednostki (1 / 50 / 0,5), dolna granica 0. Wynik formatowany z przecinkiem dziesiętnym po polsku (`0,5 l`).
- **Korekta rozpoznania**: pozycje < 70% pewności blokują nic, ale wyróżniają się kolorem i wymagają jawnego „Tak/Nie".

### Toast

Wywoływany przez: dodanie produktu, zapis edycji, usunięcie produktu (z lodówki i z arkusza edycji), włączenie powiadomień, udostępnienie listy zakupów. Auto-ukrycie po 2400 ms, jeden na raz (nowy zeruje licznik poprzedniego). Akcja „Cofnij" jest w designie — logikę cofania trzeba dopisać.

### Stany brzegowe — kiedy pokazywać

| stan | warunek |
|---|---|
| Lodówka pusta | brak produktów w bazie |
| Brak zgody na kamerę | `Camera.requestCameraPermissionsAsync()` odrzucone |
| Skan bez wyników | odpowiedź AI z zerową liczbą produktów |
| Błąd AI / brak sieci | timeout albo błąd sieci przy wysyłce zdjęcia |
| Ładowanie propozycji | trwa dopasowywanie |
| Propozycje — brak | zero przepisów spełniających wszystkie 4 filtry |
| Ulubione puste | brak zapisanych przepisów |
| Szukanie — brak wyników | zapytanie niepuste, zero trafień |

### Sekcja „Zużyj wkrótce"

Widoczna tylko gdy istnieje produkt z terminem ≤ 2 dni. Badge: `został 1 dzień` (liczba pojedyncza), `zostały 2 dni` (liczba mnoga) — obie w tym samym kolorze `secondary50` / `secondary700`.

## State Management

Prototyp trzyma cały stan w jednym komponencie. W RN rozdziel na kontekst/store (Zustand albo Context) + lokalny stan formularzy:

**Trwałe (SQLite / AsyncStorage)**
- `name` — imię użytkownika
- `products[]` — `{ id, name, category, qty, unit, expiryDate }`
- `favorites[]` — id przepisów
- `history[]` — wpisy z typem, czasem, opisem
- `consents{}`, `notifications{}` — trzy flagi każdy
- `shoppingList[]` — pozycje z odniesieniem do przepisu
- `onboardingDone`, `notificationsAsked`

**Sesyjne**
- `screen` / trasa nawigacji, `from` (skąd otwarto szczegóły)
- `introStep` (0–2)
- `editingMode` (tryb edycji listy lodówki)
- `scanning` (trwa rozpoznawanie)
- `scanResult[]` — rozpoznane pozycje z pewnością i flagą potwierdzenia
- `filters` — `{ meal, taste, difficulty, audience }`
- `searchQuery`
- `editSheet` — `{ open, productId, ...pola }`
- `toast` — `{ message, visible }`

**Dane zdalne**
- Rozpoznawanie zdjęcia: POST obrazu → lista `{ name, confidence, qty }`. Zdjęcie usuwane po 24 h (obiecane w zgodzie RODO — musi być prawdą).
- Baza przepisów: 842 pozycje; w prototypie 8 przykładowych z pełnymi danymi (składniki, kroki, makro). Dopasowanie liczone lokalnie: przepis kwalifikuje się, gdy ≥ 3 składniki są w lodówce; procent to udział posiadanych składników.

## Assets

- **`design/welcome-bg.png`** — zdjęcie tła welcome screena (do zastąpienia finalnym).
- **Ilustracje onboardingu** — 3 sztuki, jeszcze niedostarczone. Slot 250 px wysokości, radius 22, `cover`. Tematy w opisie ekranu 3.
- **Zdjęcia produktów** — w prototypie pobierane z TheMealDB (`themealdb.com/images/ingredients/<Nazwa>-Small.png`) po zmapowaniu nazw PL→EN. Fallback: pierwsza litera nazwy na tle `primary50`. **W produkcji potrzebny własny zestaw miniatur albo licencjonowane API** — TheMealDB to rozwiązanie prototypowe.
- **Zdjęcia potraw** — w prototypie LoremFlickr (placeholdery). Do zastąpienia realnymi zdjęciami z bazy przepisów.
- **Ikony** — `lucide-react-native`, nazwy w tabeli wyżej. Bez własnych ikon.
- **Fonty** — Outfit i IBM Plex Mono z Google Fonts (`expo-font` + `@expo-google-fonts/outfit`, `@expo-google-fonts/ibm-plex-mono`).

## Files

```
design/
  FridgeScan v2.dc.html   ← prototyp: 28 ekranów, przełącznik po lewej stronie
  support.js              ← runtime prototypu (nie przenosić do RN)
  ios-frame.jsx           ← ramka telefonu w prototypie (nie przenosić)
  image-slot.js           ← slot na zdjęcia w prototypie (nie przenosić)
  welcome-bg.png          ← tło welcome screena
```

Otwórz `FridgeScan v2.dc.html` w przeglądarce. Lista po lewej przełącza ekrany; trzy ostatnie pozycje to arkusze specyfikacji — tokeny i typografia, komponenty we wszystkich stanach, nawigacja i ikony. Warto je otworzyć obok kodu przy implementacji `theme.ts` i komponentów bazowych.

## Rekomendowana kolejność implementacji

1. `theme.ts` (kolory, typografia, spacing, radius) + fonty
2. Komponenty bazowe: Button (6 wariantów), Chip (4), Badge (4), Input (4 stany), Toggle, Checkbox, Stepper, ListRow, Card, BottomSheet, Toast
3. Nawigacja: tab bar + puste ekrany w każdym stacku
4. Onboarding (4 kroki) z zapisem imienia
5. Lodówka: lista z SQLite, tryb edycji, sheet edycji, formularz dodawania — plus stan pusty
6. Skan: `expo-camera`, obsługa zgody, wysyłka, ekran korekty — plus trzy stany błędów
7. Generator, ładowanie, propozycje, szczegóły przepisu, arkusz „Uaktualnić lodówkę?"
8. Przepisy, szukanie, ulubione, lista zakupów, historia
9. Ustawienia, RODO, powiadomienia (`expo-notifications`, harmonogram 2 dni przed terminem)
