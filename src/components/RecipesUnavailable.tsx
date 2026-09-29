import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppText } from './AppText';
import { Card } from './Card';
import { colors, spacing } from '../theme';

type Props = { title?: string; description?: string };

export function RecipesUnavailable({
  title = 'Generator przepisów jest chwilowo niedostępny',
  description = 'Spróbuj ponownie za jakiś czas.',
}: Props) {
  return (
    <Card style={styles.card} radius={20} padding={0}>
      <View style={styles.inner}>
        <AppText variant="h3" style={styles.title}>
          {title}
        </AppText>
        <AppText variant="caption" color={colors.textMuted} style={styles.description}>
          {description}
        </AppText>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    borderStyle: 'dashed',
  },
  inner: {
    paddingVertical: 28,
    paddingHorizontal: 22,
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
  },
  description: {
    marginTop: spacing.space2,
    textAlign: 'center',
  },
});
