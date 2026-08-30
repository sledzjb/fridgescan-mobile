import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { AppText } from '../../components';
import { colors, spacing, screenPaddingHorizontal, fontFamily } from '../../theme';

type Props = {
  title: string;
  navigation: { goBack: () => void };
};

/** Treść (Regulamin, Polityka prywatności) jeszcze nie napisana — na razie tylko tytuł i powrót. */
export function EmptyLegalScreen({ title, navigation }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.screen, { paddingTop: insets.top + spacing.space4 }]}>
      <Pressable onPress={() => navigation.goBack()} style={styles.back} hitSlop={8}>
        <ArrowLeft size={16} color={colors.mute} />
        <AppText style={styles.backLabel} color={colors.mute}>
          Wstecz
        </AppText>
      </Pressable>
      <AppText variant="h1" style={styles.title}>
        {title}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.surface,
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
});
