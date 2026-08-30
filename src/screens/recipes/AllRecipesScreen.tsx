import React, { useState } from 'react';
import { View, ScrollView, Pressable, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Search } from 'lucide-react-native';
import { AppText, Chip } from '../../components';
import { colors, spacing, screenPaddingHorizontal } from '../../theme';
import { useProductsStore } from '../../store/useProductsStore';
import { RECIPES, Recipe } from '../../data/recipes';
import { matchRecipe } from '../../utils/recipeMatch';
import { RecipeListRow } from './RecipeListRow';
import { RecipesStackParamList } from '../../navigation/types';

type FilterKey = 'Wszystkie' | 'Śniadania' | 'Obiady' | 'Kolacje' | 'Na słodko' | 'Wegetariańskie';
const FILTERS: FilterKey[] = ['Wszystkie', 'Śniadania', 'Obiady', 'Kolacje', 'Na słodko', 'Wegetariańskie'];

function matchesFilter(recipe: Recipe, filter: FilterKey): boolean {
  switch (filter) {
    case 'Wszystkie':
      return true;
    case 'Śniadania':
      return recipe.meal === 'Śniadanie';
    case 'Obiady':
      return recipe.meal === 'Obiad';
    case 'Kolacje':
      return recipe.meal === 'Kolacja';
    case 'Na słodko':
      return recipe.taste === 'Na słodko';
    case 'Wegetariańskie':
      return recipe.vegetarian;
  }
}

type Props = NativeStackScreenProps<RecipesStackParamList, 'AllRecipes'>;

export function AllRecipesScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const products = useProductsStore((s) => s.products);
  const [filter, setFilter] = useState<FilterKey>('Wszystkie');

  const recipes = RECIPES.filter((r) => matchesFilter(r, filter));

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={{ paddingTop: insets.top + spacing.space6, paddingBottom: insets.bottom + spacing.space6 }}
    >
      <View style={styles.header}>
        <AppText variant="h1">Wszystkie przepisy</AppText>
        <AppText variant="meta" color={colors.mute} style={styles.meta}>
          842 przepisy · niezależnie od lodówki
        </AppText>

        <Pressable style={styles.searchField} onPress={() => navigation.navigate('SearchRecipes')}>
          <Search size={16} color={colors.mute} />
          <AppText style={styles.searchPlaceholder} color={colors.mute}>
            Szukaj przepisu lub składnika
          </AppText>
        </Pressable>

        <View style={styles.chips}>
          {FILTERS.map((f) => (
            <Chip key={f} label={f} state={filter === f ? 'filterActive' : 'default'} onPress={() => setFilter(f)} />
          ))}
        </View>
      </View>

      <View style={styles.list}>
        {recipes.map((recipe) => {
          const match = matchRecipe(recipe, products);
          return (
            <RecipeListRow
              key={recipe.id}
              recipe={recipe}
              matchPercent={match.matchPercent}
              onPress={() => navigation.navigate('RecipeDetail', { recipeId: recipe.id, from: 'recipes' })}
            />
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.surface,
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
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 14,
    paddingHorizontal: 15,
    paddingVertical: 15,
    marginTop: spacing.space5,
  },
  searchPlaceholder: {
    fontSize: 16,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.space2,
    marginTop: spacing.space4,
  },
  list: {
    marginTop: spacing.space5,
    marginHorizontal: screenPaddingHorizontal,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 18,
    overflow: 'hidden',
  },
});
