import React, { useState, useEffect } from 'react';
import { View, ScrollView, Pressable, StyleSheet, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Search } from 'lucide-react-native';
import { AppText, Button, Card, Chip } from '../../components';
import { colors, spacing, screenPaddingHorizontal } from '../../theme';
import { useRecipesCatalog } from '../../store/useRecipesStore';
import { Recipe } from '../../data/recipes';
import { pluralizePl } from '../../utils/pluralize';
import { RecipeListRow } from './RecipeListRow';
import { RecipesStackParamList } from '../../navigation/types';

type FilterKey = 'Wszystkie' | 'Śniadania' | 'Obiady' | 'Kolacje' | 'Na słodko' | 'Wegetariańskie';
const FILTERS: FilterKey[] = ['Wszystkie', 'Śniadania', 'Obiady', 'Kolacje', 'Na słodko', 'Wegetariańskie'];

function matchesFilter(recipe: Recipe, filter: FilterKey): boolean {
  switch (filter) {
    case 'Wszystkie':
      return true;
    case 'Śniadania':
      return recipe.meal === 'breakfast';
    case 'Obiady':
      return recipe.meal === 'lunch';
    case 'Kolacje':
      return recipe.meal === 'dinner';
    case 'Na słodko':
      return recipe.taste === 'sweet';
    case 'Wegetariańskie':
      return recipe.vegetarian;
  }
}

type Props = NativeStackScreenProps<RecipesStackParamList, 'AllRecipes'>;

/** Cały (duży) katalog jest już w pamięci ze store'a - "infinite scroll" to tylko stopniowe
 * odsłanianie kolejnych porcji lokalnie, bez żadnych dodatkowych zapytań do API. */
const PAGE_SIZE = 20;
const LOAD_MORE_THRESHOLD_PX = 300;

export function AllRecipesScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { recipes: allRecipes } = useRecipesCatalog();
  const [filter, setFilter] = useState<FilterKey>('Wszystkie');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const filteredRecipes = allRecipes.filter((r) => matchesFilter(r, filter));
  const recipes = filteredRecipes.slice(0, visibleCount);

  const goToGenerator = () => navigation.getParent()?.navigate('GeneratorTab' as never);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [filter]);

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, layoutMeasurement, contentSize } = e.nativeEvent;
    const distanceFromBottom = contentSize.height - contentOffset.y - layoutMeasurement.height;
    if (distanceFromBottom < LOAD_MORE_THRESHOLD_PX && visibleCount < filteredRecipes.length) {
      setVisibleCount((c) => Math.min(c + PAGE_SIZE, filteredRecipes.length));
    }
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={{ paddingTop: insets.top + spacing.space6, paddingBottom: insets.bottom + spacing.space6 }}
      onScroll={handleScroll}
      scrollEventThrottle={100}
    >
      <View style={styles.header}>
        <AppText variant="h1">Wszystkie przepisy</AppText>

        {allRecipes.length > 0 && (
          <>
            <AppText variant="meta" color={colors.textMuted} style={styles.meta}>
              {`${allRecipes.length} ${pluralizePl(allRecipes.length, ['przepis', 'przepisy', 'przepisów'])} · wygenerowane w generatorze`}
            </AppText>

            <Pressable style={styles.searchField} onPress={() => navigation.navigate('SearchRecipes')}>
              <Search size={16} color={colors.textMuted} />
              <AppText style={styles.searchPlaceholder} color={colors.textMuted}>
                Szukaj przepisu lub składnika
              </AppText>
            </Pressable>

            <View style={styles.chips}>
              {FILTERS.map((f) => (
                <Chip key={f} label={f} state={filter === f ? 'filterActive' : 'default'} onPress={() => setFilter(f)} />
              ))}
            </View>
          </>
        )}
      </View>

      {allRecipes.length === 0 ? (
        <Card style={styles.emptyCard} radius={20} padding={0}>
          <View style={styles.emptyCardInner}>
            <AppText variant="h3" style={styles.emptyText}>
              Nie masz jeszcze przepisów
            </AppText>
            <AppText variant="caption" color={colors.textMuted} style={styles.emptyText}>
              Pojawią się tutaj po pierwszym wygenerowaniu propozycji w zakładce Generator.
            </AppText>
            <Button label="Przejdź do generatora" variant="primary" onPress={goToGenerator} style={styles.fullWidth} />
          </View>
        </Card>
      ) : filteredRecipes.length === 0 ? (
        <AppText variant="caption" color={colors.textMuted} style={styles.noneInFilter}>
          Brak przepisów w tej kategorii.
        </AppText>
      ) : (
        <View style={styles.list}>
          {recipes.map((recipe) => (
            <RecipeListRow
              key={recipe.id}
              recipe={recipe}
              onPress={() => navigation.navigate('RecipeDetail', { recipeId: recipe.id, from: 'recipes' })}
            />
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: screenPaddingHorizontal,
  },
  meta: {
    marginTop: spacing.space2,
  },
  searchField: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.space2,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 15,
    paddingVertical: 15,
    marginTop: spacing.space5,
  },
  searchPlaceholder: {
    fontSize: 16,
  },
  emptyCard: {
    marginTop: spacing.space6,
    marginHorizontal: screenPaddingHorizontal,
    borderStyle: 'dashed',
  },
  emptyCardInner: {
    paddingVertical: 34,
    paddingHorizontal: 24,
    alignItems: 'center',
    gap: spacing.space3,
  },
  emptyText: {
    textAlign: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  noneInFilter: {
    marginTop: spacing.space5,
    paddingHorizontal: screenPaddingHorizontal,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.space2,
    marginTop: spacing.space4,
  },
  banner: {
    marginTop: spacing.space4,
  },
  list: {
    marginTop: spacing.space5,
    marginHorizontal: screenPaddingHorizontal,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    overflow: 'hidden',
  },
});
