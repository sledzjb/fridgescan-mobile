import React, { useEffect, useRef, useState } from 'react';
import { View, Animated, Easing, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText, Button, RecipesUnavailable } from '../../components';
import { colors, radius, spacing, screenPaddingHorizontal } from '../../theme';
import { useProductsStore } from '../../store/useProductsStore';
import { useHistoryStore } from '../../store/useHistoryStore';
import { getRecipesForFilters } from '../../services/recipes/recipesService';
import { matchRecipe } from '../../utils/recipeMatch';
import { recipeLabel } from '../../constants/recipeLabels';
import { RECIPE_GENERATION_COUNT } from '../../constants/recipes';
import { pluralizePl } from '../../utils/pluralize';
import { describeError } from '../../utils/errorMessages';
import { GeminiError } from '../../services/gemini/client';
import { GeneratorStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<GeneratorStackParamList, 'GeneratorLoading'>;

const PROGRESS_DURATION_MS = 12000;

export function GeneratorLoadingScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const products = useProductsStore((s) => s.products);
  const addHistoryEntry = useHistoryStore((s) => s.addEntry);
  const progress = useRef(new Animated.Value(0)).current;
  const [attempt, setAttempt] = useState(0);
  const [errorCode, setErrorCode] = useState<string | null>(null);

  useEffect(() => {
    const { filters } = route.params;
    let cancelled = false;
    setErrorCode(null);
    progress.setValue(0);
    Animated.timing(progress, {
      toValue: 1,
      duration: PROGRESS_DURATION_MS,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();

    getRecipesForFilters(products, filters)
      .then((generated) => {
        if (cancelled) return;
        const results = generated
          .map((recipe) => matchRecipe(recipe, products))
          .sort((a, b) => b.matchPercent - a.matchPercent || b.haveCount - a.haveCount);
        addHistoryEntry({
          type: 'generation',
          title: 'Generowanie propozycji',
          description: `${recipeLabel(filters.meal)} · ${recipeLabel(filters.taste)} · ${recipeLabel(filters.difficulty)} - ${results.length} ${pluralizePl(results.length, ['wynik', 'wyniki', 'wyników'])}.`,
          actionLabel: 'Powtórz z tymi filtrami',
        });
        if (results.length > 0) {
          navigation.replace('RecipeResults', { filters, recipeIds: results.map((m) => m.recipe.id) });
        } else {
          navigation.replace('RecipeResultsEmpty', { filters });
        }
      })
      .catch((e) => {
        if (cancelled) return;
        progress.stopAnimation();
        setErrorCode(e instanceof GeminiError ? e.code : 'UNKNOWN');
      });

    return () => {
      cancelled = true;
      progress.stopAnimation();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attempt]);

  const widthPercent = progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '90%'] });

  if (errorCode) {
    const { title, description } = describeError(errorCode);
    return (
      <View style={[styles.screen, { paddingTop: insets.top + spacing.space6 }]}>
        <AppText variant="h1">Szukam przepisów</AppText>
        <View style={styles.errorWrap}>
          <RecipesUnavailable title={title} description={description} />
          <Button label="Spróbuj ponownie" variant="primary" onPress={() => setAttempt((n) => n + 1)} />
          <Button label="Zmień preferencje" variant="tertiary" onPress={() => navigation.goBack()} />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.screen, { paddingTop: insets.top + spacing.space6 }]}>
      <AppText variant="h1">Szukam przepisów</AppText>
      <AppText variant="meta" color={colors.textMuted} style={styles.meta}>
        {`generuję przepisy z ${products.length} ${pluralizePl(products.length, ['produktu', 'produktów', 'produktów'])} z lodówki…`}
      </AppText>

      <View style={styles.progressTrack}>
        <Animated.View style={[styles.progressFill, { width: widthPercent }]} />
      </View>

      <View style={styles.skeletons}>
        {Array.from({ length: RECIPE_GENERATION_COUNT }).map((_, i) => (
          <View key={i} style={styles.skeletonCard}>
            <View style={styles.skeletonThumb} />
            <View style={styles.skeletonLines}>
              <View style={[styles.skeletonLine, { width: '72%', height: 13 }]} />
              <View style={[styles.skeletonLine, { width: '44%', height: 10 }]} />
              <View style={[styles.skeletonLine, { width: '58%', height: 10 }]} />
            </View>
            <View style={styles.skeletonBadge} />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: screenPaddingHorizontal,
  },
  meta: {
    marginTop: spacing.space2,
  },
  errorWrap: {
    marginTop: spacing.space6,
    gap: spacing.space3,
  },
  progressTrack: {
    height: 3,
    borderRadius: radius.pill,
    backgroundColor: colors.border,
    marginTop: spacing.space6,
    overflow: 'hidden',
  },
  progressFill: {
    height: 3,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
  },
  skeletons: {
    marginTop: spacing.space6,
    gap: spacing.space3,
  },
  skeletonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.space3,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.xl,
    padding: 13,
  },
  skeletonThumb: {
    width: 64,
    height: 64,
    borderRadius: 14,
    backgroundColor: colors.borderSubtle,
  },
  skeletonLines: {
    flex: 1,
    gap: 8,
  },
  skeletonLine: {
    borderRadius: radius.pill,
    backgroundColor: colors.borderSubtle,
  },
  skeletonBadge: {
    width: 44,
    height: 22,
    borderRadius: radius.pill,
    backgroundColor: colors.borderSubtle,
  },
});
