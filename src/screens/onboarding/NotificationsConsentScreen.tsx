import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CommonActions } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Bell, Check } from 'lucide-react-native';
import { AppText, Button, Card } from '../../components';
import { colors, spacing, fontFamily } from '../../theme';
import { useAppState } from '../../store/AppStateContext';
import { OnboardingStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'NotificationsConsent'>;

const ROWS = [
  {
    label: 'Produkty tracące świeżość',
    description: '2 dni przed końcem terminu',
  },
  {
    label: 'Pomysł na dziś',
    description: 'codziennie o 17:00, jedna propozycja',
  },
  {
    label: 'Po ugotowaniu',
    description: 'przypomnienie o uzupełnieniu składników',
  },
];

export function NotificationsConsentScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { completeOnboarding, setNotificationsAsked } = useAppState();

  const goToFridge = () => {
    completeOnboarding();
    navigation.getParent()?.dispatch(
      CommonActions.reset({ index: 0, routes: [{ name: 'MainTabs' }] })
    );
  };

  // Rzeczywiste wywołanie systemowego dialogu (expo-notifications) i toast
  // potwierdzenia dochodzą w kroku 9 — tu zapisujemy tylko, że użytkownik
  // podjął decyzję, żeby ekran nie pojawiał się ponownie.
  const handleEnable = () => {
    setNotificationsAsked(true);
    goToFridge();
  };

  const handleSkip = () => {
    setNotificationsAsked(true);
    goToFridge();
  };

  return (
    <View style={[styles.screen, { paddingTop: insets.top + spacing.space6, paddingBottom: insets.bottom + spacing.space5 }]}>
      <View style={styles.content}>
        <View style={styles.tile}>
          <Bell size={26} color={colors.primary700} />
        </View>
        <AppText variant="h1">Mamy Ci przypominać, co się psuje?</AppText>
        <AppText variant="bodyL" color={colors.mute} style={styles.description}>
          Jedno powiadomienie, gdy coś w lodówce zbliża się do końca terminu. Bez tego łatwo przeoczyć jogurt.
        </AppText>

        <Card style={styles.card} padding={spacing.space4}>
          {ROWS.map((row, i) => (
            <View key={row.label} style={[styles.row, i > 0 && styles.rowSpacing]}>
              <Check size={17} color={colors.primary700} />
              <View style={styles.rowText}>
                <AppText style={styles.rowLabel}>{row.label}</AppText>
                <AppText variant="caption" color={colors.mute}>
                  {row.description}
                </AppText>
              </View>
            </View>
          ))}
        </Card>

        <AppText variant="caption" color={colors.mute} style={styles.note}>
          Każde z nich wyłączysz osobno w Ustawieniach.
        </AppText>
      </View>

      <View style={styles.footer}>
        <Button label="Włącz powiadomienia" variant="primary" onPress={handleEnable} style={styles.fullWidth} />
        <Button label="Nie teraz" variant="tertiary" onPress={handleSkip} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.surface,
    paddingHorizontal: 26,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  tile: {
    width: 60,
    height: 60,
    borderRadius: 19,
    backgroundColor: colors.primary50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.space5,
  },
  description: {
    marginTop: spacing.space3,
  },
  card: {
    marginTop: spacing.space6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.space3,
  },
  rowSpacing: {
    marginTop: spacing.space3,
  },
  rowText: {
    flex: 1,
  },
  rowLabel: {
    fontFamily: fontFamily.outfitSemiBold,
    fontSize: 14,
    color: colors.ink,
  },
  note: {
    marginTop: spacing.space3,
  },
  footer: {
    gap: spacing.space2,
    alignItems: 'center',
  },
  fullWidth: {
    width: '100%',
  },
});
