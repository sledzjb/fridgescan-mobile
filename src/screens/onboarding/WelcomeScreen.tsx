import React from 'react';
import { ImageBackground, View, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Refrigerator } from 'lucide-react-native';
import { AppText, Button } from '../../components';
import { colors, alpha, spacing, typography } from '../../theme';
import { OnboardingStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'Welcome'>;

export function WelcomeScreen({ navigation }: Props) {
  return (
    <ImageBackground
      source={require('../../../assets/welcome-bg.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay} />
      <View style={styles.content}>
        <View style={styles.tile}>
          <Refrigerator size={34} color={colors.white} strokeWidth={2.5} />
        </View>
        <AppText style={styles.display}>FridgeScan</AppText>
        <AppText style={styles.subtitle}>
          Zrób zdjęcie lodówki. Dostaniesz przepisy z tego, co już masz.
        </AppText>
      </View>
      <View style={styles.footer}>
        <Button label="Zaczynamy" variant="primary" inverted onPress={() => navigation.navigate('Name')} />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: alpha.welcomeOverlay,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  tile: {
    width: 86,
    height: 86,
    borderRadius: 26,
    backgroundColor: alpha.whiteTile,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.space5,
  },
  display: {
    ...typography.display,
    color: colors.white,
  },
  subtitle: {
    marginTop: spacing.space3,
    fontSize: 16,
    lineHeight: 24,
    color: alpha.whiteText78,
    textAlign: 'center',
    maxWidth: 270,
  },
  footer: {
    paddingHorizontal: 28,
    paddingBottom: 44,
  },
});
