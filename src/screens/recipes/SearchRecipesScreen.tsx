import React, { useState } from 'react';
import { View, ScrollView, Pressable, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText, Input, Chip, Card } from '../../components';
import { colors, spacing, screenPaddingHorizontal, fontFamily } from '../../theme';
import { RECIPES } from '../../data/recipes';
import { pluralizePl } from '../../utils/pluralize';
import { RecipeListRow } from './RecipeListRow';
import { RecipesStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RecipesStackParamList, 'SearchRecipes'>;

const RECENT_SEARCHES = ['jajka', 'szpinak', 'na słodko', '20 min'];

function matchesQuery(recipe: (typeof RECIPES)[number], query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return false;
  if (recipe.title.toLowerCase().includes(q)) return true;
  return recipe.ingredients.some((i) => i.name.toLowerCase().includes(q));
}

export function SearchRecipesScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');

  const trimmed = query.trim();
  const results = trimmed ? RECIPES.filter((r) => matchesQuery(r, trimmed)) : [];

  return (
    <View style={[styles.screen, { paddingTop: insets.top + spacing.space4 }]}>
      <View style={styles.topRow}>
        <Input
          value={query}
          onChangeText={setQuery}
          placeholder="Szukaj przepisu lub składnika"
          autoFocus
          style={styles.input}
        />
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <AppText style={styles.cancel} color={colors.mute}>
            Anuluj
          </AppText>
        </Pressable>
      </View>

      <AppText variant="meta" color={colors.mute} style={styles.counter}>
        {trimmed
          ? `${results.length} ${pluralizePl(results.length, ['wynik', 'wyniki', 'wyników'])} dla »${trimmed}«`
          : 'Wpisz nazwę przepisu lub składnika'}
      </AppText>

      {!trimmed && (
        <View style={styles.recentSection}>
          <AppText variant="kicker" color={colors.mute} style={styles.recentTitle}>
            OSTATNIO SZUKANE
          </AppText>
          <View style={styles.recentChips}>
            {RECENT_SEARCHES.map((s) => (
              <Chip key={s} label={s} onPress={() => setQuery(s)} />
            ))}
          </View>
        </View>
      )}

      {trimmed && results.length === 0 && (
        <Card style={styles.emptyCard} radius={16} padding={0}>
          <View style={styles.emptyCardInner}>
            <AppText variant="h3">Brak wyników</AppText>
            <AppText variant="caption" color={colors.mute} style={styles.emptyDescription}>
              Sprawdź pisownię albo szukaj po składniku, nie po nazwie potrawy.
            </AppText>
          </View>
        </Card>
      )}

      {trimmed && results.length > 0 && (
        <ScrollView style={styles.resultsList}>
          {results.map((recipe) => (
            <RecipeListRow
              key={recipe.id}
              recipe={recipe}
              onPress={() => navigation.navigate('RecipeDetail', { recipeId: recipe.id, from: 'recipes' })}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.surface,
    paddingHorizontal: screenPaddingHorizontal,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.space3,
  },
  input: {
    flex: 1,
    borderColor: colors.primary700,
  },
  cancel: {
    fontFamily: fontFamily.outfitMedium,
    fontSize: 14,
  },
  counter: {
    marginTop: spacing.space3,
  },
  recentSection: {
    marginTop: spacing.space6,
  },
  recentTitle: {
    marginBottom: spacing.space3,
  },
  recentChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.space2,
  },
  emptyCard: {
    marginTop: spacing.space6,
    borderStyle: 'dashed',
  },
  emptyCardInner: {
    paddingVertical: 28,
    paddingHorizontal: 22,
    alignItems: 'center',
  },
  emptyDescription: {
    marginTop: spacing.space2,
    textAlign: 'center',
  },
  resultsList: {
    marginTop: spacing.space5,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 18,
  },
});
