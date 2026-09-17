import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppText } from './AppText';
import { colors, radius, spacing, fontFamily } from '../theme';

/** Widoczne wyłącznie gdy useRecipesStore().source === 'mock' - realne/cache'owane dane nie pokazują banera. */
export function MockDataBanner() {
  return (
    <View style={styles.banner}>
      <AppText style={styles.text} color={colors.secondary700}>
        Pokazujemy przykładowe przepisy — źródło danych chwilowo niedostępne.
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: colors.secondary50,
    borderRadius: radius.md,
    padding: spacing.space3,
  },
  text: {
    fontFamily: fontFamily.outfitRegular,
    fontSize: 12.5,
    lineHeight: 18,
  },
});
