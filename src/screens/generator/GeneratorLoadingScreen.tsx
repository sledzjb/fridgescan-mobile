import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '../../components';
import { colors, radius, spacing, screenPaddingHorizontal } from '../../theme';
import { useProductsStore } from '../../store/useProductsStore';
import { useHistoryStore } from '../../store/useHistoryStore';
import { matchAllRecipes, filterRecipes } from '../../utils/recipeMatch';
import { pluralizePl } from '../../utils/pluralize';
import { GeneratorStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<GeneratorStackParamList, 'GeneratorLoading'>;

const LOADING_DURATION_MS = 1500;

export function GeneratorLoadingScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const products = useProductsStore((s) => s.products);
  const addHistoryEntry = useHistoryStore((s) => s.addEntry);
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: LOADING_DURATION_MS,
      useNativeDriver: false,
    }).start();

    const timer = setTimeout(() => {
      const { filters } = route.params;
      const matches = matchAllRecipes(products);
      const results = filterRecipes(matches, filters);
      addHistoryEntry({
        type: 'generation',
        title: 'Generowanie propozycji',
        description: `${filters.meal} · ${filters.taste} · ${filters.difficulty} - ${results.length} ${pluralizePl(results.length, ['wynik', 'wyniki', 'wyników'])}.`,
        actionLabel: 'Powtórz z tymi filtrami',
      });
      if (results.length > 0) {
        navigation.replace('RecipeResults', { filters });
      } else {
        navigation.replace('RecipeResultsEmpty', { filters });
      }
    }, LOADING_DURATION_MS);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const widthPercent = progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '46%'] });

  return (
    <View style={[styles.screen, { paddingTop: insets.top + spacing.space6 }]}>
      <AppText variant="h1">Szukam przepisów</AppText>
      <AppText variant="meta" color={colors.mute} style={styles.meta}>
        {`dopasowuję 842 przepisy do ${products.length} ${pluralizePl(products.length, ['produktu', 'produktów', 'produktów'])}…`}
      </AppText>

      <View style={styles.progressTrack}>
        <Animated.View style={[styles.progressFill, { width: widthPercent }]} />
      </View>

      <View style={styles.skeletons}>
        {Array.from({ length: 5 }).map((_, i) => (
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
    backgroundColor: colors.surface,
    paddingHorizontal: screenPaddingHorizontal,
  },
  meta: {
    marginTop: spacing.space2,
  },
  progressTrack: {
    height: 3,
    borderRadius: radius.pill,
    backgroundColor: colors.line,
    marginTop: spacing.space6,
    overflow: 'hidden',
  },
  progressFill: {
    height: 3,
    borderRadius: radius.pill,
    backgroundColor: colors.primary700,
  },
  skeletons: {
    marginTop: spacing.space6,
    gap: spacing.space3,
  },
  skeletonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.space3,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.xl,
    padding: 13,
  },
  skeletonThumb: {
    width: 64,
    height: 64,
    borderRadius: 14,
    backgroundColor: colors.surface,
  },
  skeletonLines: {
    flex: 1,
    gap: 8,
  },
  skeletonLine: {
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
  },
  skeletonBadge: {
    width: 44,
    height: 22,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
  },
});
