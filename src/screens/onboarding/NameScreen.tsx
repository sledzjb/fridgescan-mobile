import React, { useState } from 'react';
import { View, StyleSheet, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BackArrow, AppText, Button, Input } from '../../components';
import { colors, spacing, screenPaddingHorizontal, formPaddingHorizontal } from '../../theme';
import { useAppState } from '../../store/AppStateContext';
import { OnboardingStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'Name'>;

export function NameScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { name: savedName, setName } = useAppState();
  const [name, setLocalName] = useState(savedName);

  const trimmed = name.trim();

  const handleNext = () => {
    setName(trimmed);
    navigation.navigate('Intro');
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={{ paddingTop: insets.top + spacing.space4, paddingHorizontal: screenPaddingHorizontal }}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={12} style={styles.back}>
          <BackArrow size={18} />
        </Pressable>
      </View>

      <View style={[styles.content, { paddingHorizontal: formPaddingHorizontal }]}>
        <AppText variant="kicker" color={colors.primary}>
          ZANIM ZACZNIEMY
        </AppText>
        <AppText variant="h2" style={styles.title}>
          Jak się do Ciebie zwracać?
        </AppText>
        <AppText variant="bodyL" color={colors.textMuted} style={styles.description}>
          Tylko imię, żeby aplikacja mówiła do Ciebie po ludzku. Zapisujemy je lokalnie - nie zakładamy konta i nic
          nie wysyłamy na serwer.
        </AppText>
        <Input
          placeholder="Twoje imię"
          value={name}
          onChangeText={setLocalName}
          style={styles.input}
          autoFocus
        />
      </View>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.space6 }]}>
        <Button
          label={trimmed ? `Cześć, ${trimmed} - dalej` : 'Dalej'}
          variant="primary"
          disabled={!trimmed}
          onPress={handleNext}
          style={styles.fullWidth}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  back: {
    width: 32,
    height: 32,
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    marginTop: spacing.space3,
  },
  description: {
    marginTop: spacing.space3,
  },
  input: {
    marginTop: spacing.space6,
    fontSize: 17,
  },
  footer: {
    paddingHorizontal: formPaddingHorizontal,
  },
  fullWidth: {
    width: '100%',
  },
});
