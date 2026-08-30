import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { AppText, Button, Card, Chip } from '../../components';
import { colors, spacing, screenPaddingHorizontal, fontFamily } from '../../theme';
import { useProductsStore } from '../../store/useProductsStore';
import { pluralizePl } from '../../utils/pluralize';
import { matchAllRecipes, findLoosestFilter } from '../../utils/recipeMatch';
import { GeneratorStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<GeneratorStackParamList, 'RecipeResultsEmpty'>;

export function RecipeResultsEmptyScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const products = useProductsStore((s) => s.products);
  const { filters } = route.params;
  const matches = matchAllRecipes(products);
  const suggestion = findLoosestFilter(matches, filters);

  const openFridge = () => navigation.getParent()?.navigate('FridgeTab' as never);

  const applySuggestion = () => {
    if (!suggestion) return;
    const nextFilters = { ...filters, [suggestion.key]: suggestion.suggestedValue };
    if (suggestion.resultCount > 0) {
      navigation.replace('RecipeResults', { filters: nextFilters });
    } else {
      navigation.replace('RecipeResultsEmpty', { filters: nextFilters });
    }
  };

  return (
    <View style={[styles.screen, { paddingTop: insets.top + spacing.space4 }]}>
      <Pressable onPress={() => navigation.goBack()} style={styles.back} hitSlop={8}>
        <ArrowLeft size={16} color={colors.mute} />
        <AppText style={styles.backLabel} color={colors.mute}>
          Zmień preferencje
        </AppText>
      </Pressable>

      <AppText variant="h1" style={styles.title}>
        Propozycje
      </AppText>
      <AppText variant="meta" color={colors.mute} style={styles.meta}>
        {`0 ${pluralizePl(0, ['propozycja', 'propozycje', 'propozycji'])} · min. 3 składniki z lodówki`}
      </AppText>

      <View style={styles.filterChips}>
        <Chip label={filters.meal} state="filterActive" />
        <Chip label={filters.taste} state="filterActive" />
        <Chip label={filters.difficulty} state="filterActive" />
        <Chip label={filters.audience} state="filterActive" />
      </View>

      <Card style={styles.card} radius={20} padding={0}>
        <View style={styles.cardInner}>
          <AppText variant="h3">Nic nie pasuje do wszystkich czterech filtrów</AppText>
          {suggestion && (
            <AppText variant="caption" color={colors.mute} style={styles.suggestionText}>
              {`Najbardziej ograniczające jest »${suggestion.currentValue}« — po jego zdjęciu mamy ${suggestion.resultCount} ${pluralizePl(
                suggestion.resultCount,
                ['propozycję', 'propozycje', 'propozycji']
              )}.`}
            </AppText>
          )}
          {suggestion && (
            <Button
              label={`Poluzuj »${suggestion.currentValue}«`}
              variant="primary"
              onPress={applySuggestion}
              style={styles.fullWidth}
            />
          )}
          <Button label="Dodaj produkty do lodówki" variant="tertiary" onPress={openFridge} />
        </View>
      </Card>
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
  meta: {
    marginTop: spacing.space2,
  },
  filterChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.space2,
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
