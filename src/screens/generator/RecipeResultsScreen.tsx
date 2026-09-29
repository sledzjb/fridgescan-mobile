import React, { useState } from 'react';
import { View, ScrollView, Pressable, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BackArrow, AppText, Button, Chip, RecipeThumb } from '../../components';
import { recipeLabel } from '../../constants/recipeLabels';
import { colors, radius, spacing, screenPaddingHorizontal, fontFamily } from '../../theme';
import { useProductsStore } from '../../store/useProductsStore';
import { useRecipesCatalog } from '../../store/useRecipesStore';
import { daysUntil } from '../../utils/date';
import { pluralizePl } from '../../utils/pluralize';
import { matchRecipe, findProductForIngredient, RecipeMatch } from '../../utils/recipeMatch';
import { getRecipesForFilters } from '../../services/recipes/recipesService';
import { GeminiError } from '../../services/gemini/client';
import { describeError } from '../../utils/errorMessages';
import { GeneratorStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<GeneratorStackParamList, 'RecipeResults'>;

function usesExpiringSoonLine(match: RecipeMatch, products: ReturnType<typeof useProductsStore.getState>['products']): string | null {
  let best: { name: string; days: number } | null = null;
  match.ingredientStatuses
    .filter((i) => i.have)
    .forEach((ing) => {
      const product = findProductForIngredient(ing, products);
      if (product?.expiryDate) {
        const days = daysUntil(product.expiryDate);
        if (days <= 2 && (!best || days < best.days)) {
          best = { name: product.name, days };
        }
      }
    });
  if (!best) return null;
  const { name, days } = best as { name: string; days: number };
  const dayWord = pluralizePl(Math.max(days, 0), ['dzień', 'dni', 'dni']);
  return `Zużywa ${name}, który kończy się za ${days} ${dayWord}`;
}

export function RecipeResultsScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const products = useProductsStore((s) => s.products);
  const { recipes } = useRecipesCatalog();
  const { filters } = route.params;
  const [ids, setIds] = useState<number[]>(route.params.recipeIds);
  const [loadingMore, setLoadingMore] = useState(false);
  const [moreMessage, setMoreMessage] = useState<string | null>(null);
  // Kolejność jak w `ids`: pierwsza partia posortowana wg dopasowania, kolejne dopisywane na końcu.
  const results = ids
    .map((id) => recipes.find((r) => r.id === id))
    .filter((r): r is NonNullable<typeof r> => !!r)
    .map((r) => matchRecipe(r, products));

  const handleMore = async () => {
    if (loadingMore) return;
    setLoadingMore(true);
    setMoreMessage(null);
    try {
      const fresh = await getRecipesForFilters(products, filters, { existingIds: ids });
      if (fresh.length === 0) {
        setMoreMessage('Nie udało się znaleźć nowych przepisów. Spróbuj zmienić preferencje.');
      } else {
        const sorted = fresh
          .map((r) => matchRecipe(r, products))
          .sort((a, b) => b.matchPercent - a.matchPercent || b.haveCount - a.haveCount);
        setIds((prev) => [...prev, ...sorted.map((m) => m.recipe.id)]);
      }
    } catch (e) {
      const { title, description } = describeError(e instanceof GeminiError ? e.code : 'UNKNOWN');
      setMoreMessage(`${title}. ${description}`);
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing.space4, paddingBottom: insets.bottom + spacing.space6 }]}>
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
        {`${results.length} ${pluralizePl(results.length, ['propozycja', 'propozycje', 'propozycji'])}`}
      </AppText>

      <View style={styles.filterChips}>
        <Chip label={recipeLabel(filters.meal)} state="filterActive" />
        <Chip label={recipeLabel(filters.taste)} state="filterActive" />
        <Chip label={recipeLabel(filters.difficulty)} state="filterActive" />
        <Chip label={recipeLabel(filters.diet)} state="filterActive" />
      </View>

      <View style={styles.list}>
          {results.map((match) => {
            const usesLine = usesExpiringSoonLine(match, products);
            return (
              <Pressable
                key={match.recipe.id}
                style={styles.card}
                onPress={() => navigation.navigate('RecipeDetail', { recipeId: match.recipe.id, from: 'generator' })}
              >
                <RecipeThumb imageUrl={match.recipe.imageUrl} iconSize={26} style={styles.thumb} />
                <View style={styles.cardBody}>
                  <AppText style={styles.cardTitle}>{match.recipe.title}</AppText>
                  <AppText variant="meta" color={colors.textMuted} style={styles.cardMeta}>
                    {`${match.recipe.time} · ${recipeLabel(match.recipe.difficulty)} · ${match.haveCount} z ${match.totalCount} składników`}
                  </AppText>
                  {usesLine && (
                    <AppText variant="caption" color={colors.textMuted} style={styles.usesLine}>
                      {usesLine}
                    </AppText>
                  )}
                </View>
              </Pressable>
            );
          })}
        </View>

      {moreMessage && (
        <AppText variant="caption" color={colors.textMuted} style={styles.moreMessage}>
          {moreMessage}
        </AppText>
      )}
      <Button
        label={loadingMore ? 'Generuję…' : 'Generuj więcej'}
        variant="outline"
        disabled={loadingMore}
        onPress={handleMore}
        style={styles.regenerate}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
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
  regenerate: {
    marginTop: spacing.space4,
  },
  moreMessage: {
    marginTop: spacing.space4,
  },
  list: {
    marginTop: spacing.space5,
    gap: spacing.space3,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.space3,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.xl,
    padding: 13,
  },
  thumb: {
    width: 64,
    height: 64,
    borderRadius: 14,
    backgroundColor: colors.primarySubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBody: {
    flex: 1,
  },
  cardTitle: {
    fontFamily: fontFamily.outfitSemiBold,
    fontSize: 15.5,
    color: colors.text,
  },
  cardMeta: {
    marginTop: 4,
  },
  usesLine: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 16,
  },
});
