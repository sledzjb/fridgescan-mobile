import React from 'react';
import { View, ScrollView, Pressable, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, ChefHat } from 'lucide-react-native';
import { AppText, Badge, Chip } from '../../components';
import { colors, radius, spacing, screenPaddingHorizontal, fontFamily } from '../../theme';
import { useProductsStore } from '../../store/useProductsStore';
import { daysUntil } from '../../utils/date';
import { pluralizePl } from '../../utils/pluralize';
import { matchAllRecipes, filterRecipes, RecipeMatch } from '../../utils/recipeMatch';
import { GeneratorStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<GeneratorStackParamList, 'RecipeResults'>;

function usesExpiringSoonLine(match: RecipeMatch, products: ReturnType<typeof useProductsStore.getState>['products']): string | null {
  let best: { name: string; days: number } | null = null;
  match.ingredientStatuses
    .filter((i) => i.have)
    .forEach((ing) => {
      const target = ing.name.trim().toLowerCase();
      const product = products.find((p) => {
        const name = p.name.trim().toLowerCase();
        return name === target || name.includes(target) || target.includes(name);
      });
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
  const matches = matchAllRecipes(products);
  const results = filterRecipes(matches, route.params.filters);
  const { filters } = route.params;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing.space4, paddingBottom: insets.bottom + spacing.space6 }]}>
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
        {`${results.length} ${pluralizePl(results.length, ['propozycja', 'propozycje', 'propozycji'])} · min. 3 składniki z lodówki`}
      </AppText>

      <View style={styles.filterChips}>
        <Chip label={filters.meal} state="filterActive" />
        <Chip label={filters.taste} state="filterActive" />
        <Chip label={filters.difficulty} state="filterActive" />
        <Chip label={filters.audience} state="filterActive" />
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
              <View style={styles.thumb}>
                <ChefHat size={26} color={colors.primary700} strokeWidth={1.5} />
              </View>
              <View style={styles.cardBody}>
                <AppText style={styles.cardTitle}>{match.recipe.title}</AppText>
                <AppText variant="meta" color={colors.mute} style={styles.cardMeta}>
                  {`${match.recipe.time} · ${match.recipe.difficulty} · ${match.haveCount} z ${match.totalCount} składników`}
                </AppText>
                {usesLine && (
                  <AppText variant="caption" color={colors.mute} style={styles.usesLine}>
                    {usesLine}
                  </AppText>
                )}
              </View>
              <Badge label={`${match.matchPercent}%`} variant="match" style={styles.badge} />
            </Pressable>
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
  list: {
    marginTop: spacing.space5,
    gap: spacing.space3,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.space3,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.xl,
    padding: 13,
  },
  thumb: {
    width: 64,
    height: 64,
    borderRadius: 14,
    backgroundColor: colors.primary50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBody: {
    flex: 1,
  },
  cardTitle: {
    fontFamily: fontFamily.outfitSemiBold,
    fontSize: 15.5,
    color: colors.ink,
  },
  cardMeta: {
    marginTop: 4,
  },
  usesLine: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 16,
  },
  badge: {
    alignSelf: 'flex-start',
  },
});
