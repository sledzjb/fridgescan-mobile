import React, { useEffect } from 'react';
import { View, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, ChefHat, Heart } from 'lucide-react-native';
import { AppText, Button } from '../../components';
import { colors, radius, spacing, screenPaddingHorizontal, fontFamily } from '../../theme';
import { useProductsStore } from '../../store/useProductsStore';
import { useFavoritesStore } from '../../store/useFavoritesStore';
import { useShoppingListStore } from '../../store/useShoppingListStore';
import { RECIPES } from '../../data/recipes';
import { matchRecipe } from '../../utils/recipeMatch';
import { daysUntil } from '../../utils/date';
import { pluralizePl } from '../../utils/pluralize';

export type RecipeDetailNavigation = {
  goBack: () => void;
  navigate: (screen: 'UpdateFridgeSheet', params: { recipeId: number; from: string }) => void;
};

type Props = {
  navigation: RecipeDetailNavigation;
  route: { params: { recipeId: number; from: string } };
};

export function RecipeDetailScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const products = useProductsStore((s) => s.products);
  const isFavorite = useFavoritesStore((s) => s.isFavorite(route.params.recipeId));
  const toggleFavorite = useFavoritesStore((s) => s.toggleFavorite);
  const addShoppingItemIfMissing = useShoppingListStore((s) => s.addIfMissing);

  const recipe = RECIPES.find((r) => r.id === route.params.recipeId);
  const match = recipe ? matchRecipe(recipe, products) : null;

  useEffect(() => {
    if (!recipe) {
      navigation.goBack();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recipe]);

  useEffect(() => {
    if (!recipe || !match) return;
    match.ingredientStatuses
      .filter((ing) => !ing.have)
      .forEach((ing) => addShoppingItemIfMissing(ing.name, ing.qty, recipe.title));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recipe?.id, match?.haveCount]);

  if (!recipe || !match) {
    return null;
  }

  const expiringUsed = match.ingredientStatuses
    .filter((i) => i.have)
    .map((i) => {
      const target = i.name.trim().toLowerCase();
      const product = products.find((p) => {
        const name = p.name.trim().toLowerCase();
        return name === target || name.includes(target) || target.includes(name);
      });
      return product?.expiryDate ? { name: product.name, days: daysUntil(product.expiryDate) } : null;
    })
    .filter((x): x is { name: string; days: number } => !!x && x.days <= 2)
    .sort((a, b) => a.days - b.days)[0];

  const usesText = expiringUsed
    ? `Zużywa ${expiringUsed.name}, który kończy się za ${expiringUsed.days} ${pluralizePl(Math.max(expiringUsed.days, 0), ['dzień', 'dni', 'dni'])}`
    : `${match.haveCount} z ${match.totalCount} składników już masz w lodówce`;

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing.space4, paddingBottom: insets.bottom + spacing.space6 }]}
    >
      <Pressable onPress={() => navigation.goBack()} style={styles.back} hitSlop={8}>
        <ArrowLeft size={16} color={colors.mute} />
        <AppText style={styles.backLabel} color={colors.mute}>
          Wróć
        </AppText>
      </Pressable>

      <View style={styles.header}>
        <View style={styles.thumb}>
          <ChefHat size={32} color={colors.primary700} strokeWidth={1.5} />
        </View>
        <View style={styles.headerText}>
          <AppText variant="h2">{recipe.title}</AppText>
          <AppText variant="meta" color={colors.mute} style={styles.headerMeta}>
            {`${recipe.time} · ${recipe.difficulty} · ${recipe.taste}`}
          </AppText>
        </View>
      </View>

      <View style={styles.usesBanner}>
        <AppText style={styles.usesText} color={colors.primary700}>
          {usesText}
        </AppText>
      </View>

      <Section title="WARTOŚCI ODŻYWCZE">
        <View style={styles.nutritionRow}>
          {recipe.nutrition.map((n) => (
            <View key={n.unit} style={styles.nutritionBox}>
              <AppText style={styles.nutritionValue}>{n.value}</AppText>
              <AppText style={styles.nutritionUnit} color={colors.mute}>
                {n.unit}
              </AppText>
            </View>
          ))}
        </View>
      </Section>

      <Section title="SKŁADNIKI">
        <View style={styles.ingredientsCard}>
          {match.ingredientStatuses.map((ing, i) => (
            <View key={ing.name} style={[styles.ingredientRow, i > 0 && styles.ingredientDivider]}>
              <AppText variant="body" style={styles.ingredientName}>
                {ing.name}
              </AppText>
              <AppText variant="meta" color={colors.mute} style={styles.ingredientQty}>
                {ing.qty}
              </AppText>
              <AppText
                style={styles.ingredientStatus}
                color={ing.have ? colors.primary700 : colors.secondary700}
              >
                {ing.have ? 'masz' : 'brakuje'}
              </AppText>
            </View>
          ))}
        </View>
      </Section>

      <Section title="PRZYGOTOWANIE">
        <View style={styles.steps}>
          {recipe.steps.map((step, i) => (
            <View key={i} style={styles.stepRow}>
              <View style={styles.stepNumber}>
                <AppText style={styles.stepNumberText} color={colors.primary700}>
                  {i + 1}
                </AppText>
              </View>
              <AppText variant="body" color={colors.inkSoft} style={styles.stepText}>
                {step}
              </AppText>
            </View>
          ))}
        </View>
      </Section>

      <View style={styles.actions}>
        <Button
          label="Oznacz jako wykonane"
          variant="accentAction"
          onPress={() => navigation.navigate('UpdateFridgeSheet', { recipeId: recipe.id, from: route.params.from })}
          style={styles.doneButton}
        />
        <Pressable style={styles.favoriteButton} onPress={() => toggleFavorite(recipe.id)}>
          <Heart size={17} color={isFavorite ? colors.secondary500 : colors.line} fill={isFavorite ? colors.secondary500 : 'none'} />
        </Pressable>
      </View>
    </ScrollView>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <AppText variant="kicker" color={colors.mute} style={styles.sectionTitle}>
        {title}
      </AppText>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.white,
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
  header: {
    flexDirection: 'row',
    gap: spacing.space3,
    marginTop: spacing.space4,
    alignItems: 'center',
  },
  thumb: {
    width: 84,
    height: 84,
    borderRadius: radius.xl,
    backgroundColor: colors.primary50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
  },
  headerMeta: {
    marginTop: spacing.space2,
  },
  usesBanner: {
    backgroundColor: colors.primary50,
    borderRadius: radius.md,
    padding: spacing.space3,
    marginTop: spacing.space5,
  },
  usesText: {
    fontFamily: fontFamily.outfitRegular,
    fontSize: 12.5,
    lineHeight: 18,
  },
  section: {
    marginTop: spacing.space6,
  },
  sectionTitle: {
    marginBottom: spacing.space3,
  },
  nutritionRow: {
    flexDirection: 'row',
    gap: spacing.space2,
  },
  nutritionBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.md,
    paddingVertical: 11,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  nutritionValue: {
    fontFamily: fontFamily.outfitSemiBold,
    fontSize: 15,
    color: colors.ink,
  },
  nutritionUnit: {
    fontFamily: fontFamily.plexMonoRegular,
    fontSize: 10.5,
    marginTop: 2,
  },
  ingredientsCard: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.lg,
    paddingHorizontal: 14,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: spacing.space2,
  },
  ingredientDivider: {
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  ingredientName: {
    flex: 1,
    fontFamily: fontFamily.outfitMedium,
    fontSize: 14,
  },
  ingredientQty: {
    fontSize: 12,
  },
  ingredientStatus: {
    fontFamily: fontFamily.plexMonoRegular,
    fontSize: 11,
    minWidth: 52,
    textAlign: 'right',
  },
  steps: {
    gap: spacing.space4,
  },
  stepRow: {
    flexDirection: 'row',
    gap: spacing.space3,
  },
  stepNumber: {
    width: 25,
    height: 25,
    borderRadius: radius.pill,
    backgroundColor: colors.primary50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    fontFamily: fontFamily.plexMonoRegular,
    fontSize: 11.5,
  },
  stepText: {
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.space3,
    marginTop: spacing.space7,
    alignItems: 'center',
  },
  doneButton: {
    flex: 1,
  },
  favoriteButton: {
    width: 54,
    height: 54,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
