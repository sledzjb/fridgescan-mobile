import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BackArrow, AppText, Button, Card, Chip } from '../../components';
import { recipeLabel } from '../../constants/recipeLabels';
import { colors, spacing, screenPaddingHorizontal, fontFamily } from '../../theme';
import { pluralizePl } from '../../utils/pluralize';
import { GeneratorStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<GeneratorStackParamList, 'RecipeResultsEmpty'>;

export function RecipeResultsEmptyScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const { filters } = route.params;

  const openFridge = () => navigation.getParent()?.navigate('FridgeTab' as never);

  return (
    <View style={[styles.screen, { paddingTop: insets.top + spacing.space4 }]}>
      <Pressable onPress={() => navigation.goBack()} style={styles.back} hitSlop={8}>
        <BackArrow />
        <AppText style={styles.backLabel} color={colors.textMuted}>
          Zmień preferencje
        </AppText>
      </Pressable>

      <AppText variant="h1" style={styles.title}>
        Propozycje
      </AppText>
      <AppText variant="meta" color={colors.textMuted} style={styles.meta}>
        {`0 ${pluralizePl(0, ['propozycja', 'propozycje', 'propozycji'])} · `}
      </AppText>

      <View style={styles.filterChips}>
        <Chip label={recipeLabel(filters.meal)} state="filterActive" />
        <Chip label={recipeLabel(filters.taste)} state="filterActive" />
        <Chip label={recipeLabel(filters.difficulty)} state="filterActive" />
        <Chip label={recipeLabel(filters.diet)} state="filterActive" />
      </View>

      <Card style={styles.card} radius={20} padding={0}>
        <View style={styles.cardInner}>
          <AppText variant="h3">Nie udało się wygenerować przepisów</AppText>
          <AppText variant="caption" color={colors.textMuted} style={styles.suggestionText}>
            Spróbuj zmienić preferencje albo dodaj więcej produktów do lodówki.
          </AppText>
          <Button
            label="Zmień preferencje"
            variant="primary"
            onPress={() => navigation.goBack()}
            style={styles.fullWidth}
          />
          <Button label="Dodaj produkty do lodówki" variant="tertiary" onPress={openFridge} />
        </View>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
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
  meta: {
    marginTop: spacing.space2,
  },
  filterChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.space2,
    marginTop: spacing.space4,
  },
  banner: {
    marginTop: spacing.space4,
  },
  card: {
    marginTop: spacing.space6,
    borderStyle: 'dashed',
  },
  cardInner: {
    paddingVertical: 28,
    paddingHorizontal: 22,
    gap: spacing.space3,
    alignItems: 'stretch',
  },
  suggestionText: {
    lineHeight: 19,
  },
  fullWidth: {
    width: '100%',
  },
});
