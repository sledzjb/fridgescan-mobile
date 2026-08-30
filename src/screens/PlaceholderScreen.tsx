import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation, useNavigationState } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText, Button } from '../components';
import { colors, spacing, screenPaddingHorizontal } from '../theme';

export type PlaceholderExtraAction = {
  label: string;
  onPress: () => void;
};

export type PlaceholderScreenProps = {
  title: string;
  stackName: string;
  /** Skróty poza bieżącym stackiem (np. „Pomiń” z onboardingu do aplikacji, „Otwórz skan”). */
  extraActions?: PlaceholderExtraAction[];
};

/** Zaślepka ekranu na czas budowy szkieletu nawigacji (krok 3) - treść dochodzi w kolejnych krokach. */
export function PlaceholderScreen({ title, stackName, extraActions }: PlaceholderScreenProps) {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const state = useNavigationState((s) => s);

  const nextRouteName = state.index < state.routeNames.length - 1 ? state.routeNames[state.index + 1] : undefined;
  const canGoBack = navigation.canGoBack();

  return (
    <View style={[styles.screen, { paddingTop: insets.top + spacing.space6 }]}>
      <AppText variant="kicker" color={colors.primary700}>
        {stackName}
      </AppText>
      <AppText variant="h1" style={styles.title}>
        {title}
      </AppText>

      <View style={styles.actions}>
        {nextRouteName && (
          <Button
            label={`Dalej: ${nextRouteName} →`}
            variant="secondary"
            onPress={() => navigation.navigate(nextRouteName as never)}
          />
        )}
        {canGoBack && <Button label="← Wstecz" variant="outline" onPress={() => navigation.goBack()} />}
        {extraActions?.map((action) => (
          <Button key={action.label} label={action.label} variant="tertiary" onPress={action.onPress} />
        ))}
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
  title: {
    marginTop: spacing.space2,
  },
  actions: {
    marginTop: spacing.space6,
    gap: spacing.space3,
    alignItems: 'flex-start',
  },
});
