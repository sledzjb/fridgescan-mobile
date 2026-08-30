import React, { useState } from 'react';
import { View, Image, Pressable, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CommonActions } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '../../components';
import { colors, radius, spacing, screenPaddingHorizontal, fontFamily } from '../../theme';
import { useAppState } from '../../store/AppStateContext';
import { OnboardingStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'Intro'>;

type Step = { image: number; title: string; description: string };

const STEPS: Step[] = [
  {
    image: require('../../../assets/intro-1.webp'),
    title: 'Zrób jedno zdjęcie',
    description: 'Otwórz lodówkę i zrób zdjęcie w aplikacji albo wybierz je z galerii. Nie musisz nic wpisywać.',
  },
  {
    image: require('../../../assets/intro-2.webp'),
    title: 'AI rozpoznaje produkty',
    description:
      'W kilka sekund dostajesz listę. Możesz poprawić ilości, dodać pominięte i usunąć błędne pozycje.',
  },
  {
    image: require('../../../assets/intro-3.webp'),
    title: 'Gotujesz z tego, co masz',
    description:
      'Wybierz rodzaj posiłku, smak i poziom trudności. Pokażemy przepisy, w których minimum 3 składniki już masz.',
  },
];

export function IntroScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { completeOnboarding } = useAppState();
  const [step, setStep] = useState(0);

  const isLast = step === STEPS.length - 1;
  const current = STEPS[step];

  const goToFridge = () => {
    completeOnboarding();
    navigation.getParent()?.dispatch(
      CommonActions.reset({ index: 0, routes: [{ name: 'MainTabs' }] })
    );
  };

  const handleBack = () => {
    if (step === 0) {
      navigation.goBack();
    } else {
      setStep((s) => s - 1);
    }
  };

  const handleNext = () => {
    if (isLast) {
      navigation.navigate('NotificationsConsent');
    } else {
      setStep((s) => s + 1);
    }
  };

  return (
    <View style={[styles.screen, { paddingTop: insets.top + spacing.space4 }]}>
      <View style={styles.topBar}>
        <View style={styles.spacer} />
        <View style={styles.dots}>
          {STEPS.map((_, i) => (
            <View key={i} style={[styles.dot, i === step && styles.dotActive]} />
          ))}
        </View>
        <Pressable onPress={goToFridge} hitSlop={8}>
          <AppText style={styles.skip} color={colors.mute}>
            Pomiń
          </AppText>
        </Pressable>
      </View>

      <View style={styles.content}>
        <Image source={current.image} style={styles.illustration} resizeMode="cover" />
        <AppText variant="kicker" color={colors.primary700} style={styles.kicker}>
          {`KROK ${step + 1} Z ${STEPS.length}`}
        </AppText>
        <AppText variant="h2" style={styles.title}>
          {current.title}
        </AppText>
        <AppText variant="bodyL" color={colors.mute} style={styles.description}>
          {current.description}
        </AppText>
      </View>

      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + spacing.space5 }]}>
        <Pressable onPress={handleBack} hitSlop={8}>
          <AppText style={styles.back} color={colors.mute}>
            Cofnij
          </AppText>
        </Pressable>
        <Pressable onPress={handleNext} style={styles.nextButton}>
          <AppText style={styles.nextLabel} color={colors.white}>
            {isLast ? 'Zaczynajmy' : 'Dalej'}
          </AppText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.surface,
    paddingHorizontal: screenPaddingHorizontal,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  spacer: {
    width: 60,
  },
  dots: {
    flexDirection: 'row',
    gap: 6,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: radius.pill,
    backgroundColor: colors.line,
  },
  dotActive: {
    width: 20,
    backgroundColor: colors.primary700,
  },
  skip: {
    fontFamily: fontFamily.outfitMedium,
    fontSize: 13,
    width: 60,
    textAlign: 'right',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  illustration: {
    width: '100%',
    height: 250,
    borderRadius: radius.xxl,
    backgroundColor: colors.primary50,
    marginBottom: spacing.space6,
    overflow: 'hidden',
  },
  kicker: {
    marginBottom: spacing.space2,
  },
  title: {},
  description: {
    marginTop: spacing.space3,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  back: {
    fontFamily: fontFamily.outfitMedium,
    fontSize: 14.5,
  },
  nextButton: {
    backgroundColor: colors.ink,
    borderRadius: 15,
    paddingVertical: 14,
    paddingHorizontal: 26,
  },
  nextLabel: {
    fontFamily: fontFamily.outfitSemiBold,
    fontSize: 15.5,
  },
});
