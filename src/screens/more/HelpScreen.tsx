import React from 'react';
import { View, ScrollView, Pressable, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BackArrow, AppText, Card } from '../../components';
import { colors, spacing, screenPaddingHorizontal, fontFamily } from '../../theme';
import { MoreStackParamList } from '../../navigation/types';
import { SUPPORTS_NOTIFICATIONS } from '../../services/notifications';

type Props = NativeStackScreenProps<MoreStackParamList, 'Help'>;

const FAQ = [
  {
    question: 'Jak działa rozpoznawanie zdjęć?',
    answer:
      'Robisz jedno zdjęcie wnętrza lodówki (albo wybierasz je z galerii). Zdjęcie trafia do modelu Gemini firmy Google, który zwraca listę widocznych produktów z przybliżoną ilością. Przed zapisaniem możesz poprawić, dodać lub usunąć dowolną pozycję.',
  },
  {
    question: 'Dlaczego niektóre produkty wymagają potwierdzenia?',
    answer:
      'Jeśli sam model oceni pewność rozpoznania poniżej 70%, prosimy o potwierdzenie „Tak / Nie" przy tej pozycji. Twoje poprawki dotyczą tylko tej listy - nie uczą modelu.',
  },
  {
    question: 'Czy muszę założyć konto?',
    answer:
      'Nie. Produkty, ulubione przepisy, wygenerowane przepisy i historia są zapisane wyłącznie na Twoim telefonie (albo w przeglądarce, jeśli używasz wersji webowej). Nie ma kopii zapasowej, więc odinstalowanie aplikacji albo wyczyszczenie jej danych usuwa je bezpowrotnie.',
  },
  {
    question: 'Co się dzieje ze zdjęciem lodówki?',
    answer:
      'Zdjęcie (w zmniejszonej jakości) jest wysyłane przez internet do Gemini API firmy Google i tam przetwarzane, żeby rozpoznać produkty. Aplikacja nie zapisuje go w galerii ani we własnych danych i nie wysyła nigdzie indziej; system może jedynie na krótko trzymać tymczasowy plik w pamięci podręcznej aplikacji. To, co dzieje się ze zdjęciem po stronie Google, zależy od warunków Google: aplikacja korzysta obecnie z bezpłatnego poziomu Gemini API, a według warunków Google dla usług bezpłatnych przesłane dane mogą być używane do ulepszania jej usług i mogą je czytać pracownicy Google. Google odradza wysyłanie tam danych osobistych, więc fotografuj tylko jedzenie - bez dokumentów, ludzi czy widocznych adresów. Aktualne warunki: ai.google.dev/gemini-api/terms.',
  },
  {
    question: 'Jakie dane opuszczają telefon?',
    answer:
      'Do Gemini (Google): zdjęcie lodówki przy rozpoznawaniu oraz nazwy Twoich produktów i wybrane filtry przy generowaniu przepisów (nazwy są też tłumaczone na angielski tym samym modelem). Do Pexels: angielskie nazwy produktów i krótkie frazy opisujące dania, żeby pobrać zdjęcia; zdjęcia produktów i dań pochodzą z pexels.com. Imię, ilości, terminy ważności, ulubione i historia zostają na telefonie. Zapytania do Gemini i Pexels przechodzą przez serwer pośredniczący aplikacji (Cloudflare), który tylko dodaje klucze API i niczego nie zapisuje.',
  },
  {
    question: 'Dlaczego generator przepisów nic nie znajduje?',
    answer:
      'Generator prosi o kilka przepisów pod wybrane filtry i produkty z lodówki. Jeśli nic się nie pojawia, sprawdź połączenie z internetem, spróbuj ponownie za chwilę albo zmień preferencje.',
  },
  // Powiadomienia działają tylko w aplikacji na telefon - na web pytanie jest pomijane.
  ...(SUPPORTS_NOTIFICATIONS
    ? [
        {
          question: 'Jak wyłączyć powiadomienia?',
          answer:
            'W „Ustawieniach i koncie", w sekcji Powiadomienia, wyłącz „Produkty tracące świeżość" - bez wpływu na resztę aplikacji.',
        },
      ]
    : []),
];

export function HelpScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing.space4, paddingBottom: insets.bottom + spacing.space6 }]}
    >
      <Pressable onPress={() => navigation.goBack()} style={styles.back} hitSlop={8}>
        <BackArrow />
        <AppText style={styles.backLabel} color={colors.textMuted}>
          Więcej
        </AppText>
      </Pressable>

      <AppText variant="h1" style={styles.title}>
        Pomoc
      </AppText>
      <AppText variant="bodyL" color={colors.textMuted} style={styles.description}>
        Najczęstsze pytania o FridgeScan.
      </AppText>

      <View style={styles.section}>
        <AppText variant="kicker" color={colors.textMuted} style={styles.sectionTitle}>
          FAQ
        </AppText>
        <Card>
          {FAQ.map((item, i) => (
            <View key={item.question} style={[styles.faqRow, i > 0 && styles.faqDivider]}>
              <AppText style={styles.question}>{item.question}</AppText>
              <AppText variant="body" color={colors.textSecondary} style={styles.answer}>
                {item.answer}
              </AppText>
            </View>
          ))}
        </Card>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: screenPaddingHorizontal,
  },
  back: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
  },
  backLabel: {
    fontFamily: fontFamily.outfitMedium,
    fontSize: 13,
  },
  title: {
    marginTop: spacing.space3,
  },
  description: {
    marginTop: spacing.space2,
  },
  section: {
    marginTop: spacing.space6,
  },
  sectionTitle: {
    marginBottom: spacing.space3,
  },
  faqRow: {
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  faqDivider: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  question: {
    fontFamily: fontFamily.outfitSemiBold,
    fontSize: 14.5,
    color: colors.text,
  },
  answer: {
    marginTop: spacing.space2,
    lineHeight: 20,
  },
});
