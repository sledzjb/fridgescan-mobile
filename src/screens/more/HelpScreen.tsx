import React from 'react';
import { View, ScrollView, Pressable, Linking, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, TriangleAlert } from 'lucide-react-native';
import { AppText, Button, Card } from '../../components';
import { colors, radius, spacing, screenPaddingHorizontal, fontFamily } from '../../theme';
import { MoreStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<MoreStackParamList, 'Help'>;

const SUPPORT_EMAIL = 'pomoc@fridgescan.app';

const FAQ = [
  {
    question: 'Jak działa rozpoznawanie zdjęć?',
    answer:
      'Robisz jedno zdjęcie wnętrza lodówki (albo wybierasz je z galerii), a AI rozpoznaje widoczne produkty wraz z przybliżoną ilością. Przed zapisaniem możesz poprawić, dodać lub usunąć dowolną pozycję.',
  },
  {
    question: 'Dlaczego niektóre produkty wymagają potwierdzenia?',
    answer:
      'Jeśli pewność rozpoznania jest niższa niż 70%, prosimy o szybkie potwierdzenie „Tak / Nie" przy tej pozycji. Twoje poprawki uczą model Twoich zwyczajów.',
  },
  {
    question: 'Czy muszę założyć konto?',
    answer:
      'Nie. FridgeScan działa bez konta i logowania - wszystkie dane (produkty, ulubione, historia) są zapisane lokalnie na Twoim telefonie.',
  },
  {
    question: 'Co się dzieje ze zdjęciem lodówki?',
    answer:
      'Zdjęcie jest wysyłane wyłącznie do rozpoznania produktów i usuwane w ciągu 24 godzin. Nie trafia do galerii aplikacji ani żadnej bazy zdjęć.',
  },
  {
    question: 'Dlaczego generator przepisów nic nie znajduje?',
    answer:
      'Pokazujemy tylko przepisy, w których masz co najmniej 3 składniki z lodówki. Spróbuj poluzować jeden z czterech filtrów albo dodać więcej produktów.',
  },
  {
    question: 'Jak wyłączyć powiadomienia?',
    answer:
      'W „Ustawieniach i koncie", w sekcji Powiadomienia, możesz wyłączyć każdy typ przypomnienia osobno - bez wpływu na resztę aplikacji.',
  },
];

export function HelpScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();

  const handleReport = () => {
    const subject = encodeURIComponent('Zgłoszenie błędnego rozpoznania - FridgeScan');
    const body = encodeURIComponent(
      'Opisz krótko, co zostało błędnie rozpoznane (np. nazwa produktu, ilość):\n\n'
    );
    Linking.openURL(`mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`).catch(() => {});
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing.space4, paddingBottom: insets.bottom + spacing.space6 }]}
    >
      <Pressable onPress={() => navigation.goBack()} style={styles.back} hitSlop={8}>
        <ArrowLeft size={16} color={colors.mute} />
        <AppText style={styles.backLabel} color={colors.mute}>
          Więcej
        </AppText>
      </Pressable>

      <AppText variant="h1" style={styles.title}>
        Pomoc i kontakt
      </AppText>
      <AppText variant="bodyL" color={colors.mute} style={styles.description}>
        Najczęstsze pytania o FridgeScan. Nie znalazłeś odpowiedzi? Zgłoś się do nas bezpośrednio.
      </AppText>

      <View style={styles.section}>
        <AppText variant="kicker" color={colors.mute} style={styles.sectionTitle}>
          FAQ
        </AppText>
        <Card>
          {FAQ.map((item, i) => (
            <View key={item.question} style={[styles.faqRow, i > 0 && styles.faqDivider]}>
              <AppText style={styles.question}>{item.question}</AppText>
              <AppText variant="body" color={colors.inkSoft} style={styles.answer}>
                {item.answer}
              </AppText>
            </View>
          ))}
        </Card>
      </View>

      <View style={styles.section}>
        <AppText variant="kicker" color={colors.mute} style={styles.sectionTitle}>
          ZGŁOŚ PROBLEM
        </AppText>
        <Card style={styles.reportCard} padding={0}>
          <View style={styles.reportCardInner}>
            <View style={styles.reportIconTile}>
              <TriangleAlert size={22} color={colors.secondary700} />
            </View>
            <AppText variant="label" style={styles.reportTitle}>
              Coś zostało źle rozpoznane?
            </AppText>
            <AppText variant="caption" color={colors.mute} style={styles.reportDescription}>
              Napisz do nas - otworzymy Twoją aplikację pocztową z gotowym tematem wiadomości na adres{' '}
              {SUPPORT_EMAIL}.
            </AppText>
            <Button label="Zgłoś błędne rozpoznanie" variant="outline" onPress={handleReport} style={styles.fullWidth} />
          </View>
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.surface,
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
    borderTopColor: colors.line,
  },
  question: {
    fontFamily: fontFamily.outfitSemiBold,
    fontSize: 14.5,
    color: colors.ink,
  },
  answer: {
    marginTop: spacing.space2,
    lineHeight: 20,
  },
  reportCard: {},
  reportCardInner: {
    padding: spacing.space5,
    alignItems: 'flex-start',
  },
  reportIconTile: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.secondary50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.space3,
  },
  reportTitle: {
    marginBottom: spacing.space2,
  },
  reportDescription: {
    lineHeight: 18,
    marginBottom: spacing.space4,
  },
  fullWidth: {
    width: '100%',
  },
});
