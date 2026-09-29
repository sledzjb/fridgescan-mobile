import React, { useEffect } from 'react';
import { View, ScrollView, Pressable, Linking, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Check, Heart, Plus } from 'lucide-react-native';
import { BackArrow, AppText, Button, RecipeThumb, Toast, useToast } from '../../components';
import { recipeLabel } from '../../constants/recipeLabels';
import { colors, radius, spacing, screenPaddingHorizontal, fontFamily } from '../../theme';
import { useProductsStore } from '../../store/useProductsStore';
import { useFavoritesStore } from '../../store/useFavoritesStore';
import { useShoppingListStore } from '../../store/useShoppingListStore';
import { useRecipesCatalog } from '../../store/useRecipesStore';
import { matchRecipe, findProductForIngredient } from '../../utils/recipeMatch';
import { daysUntil } from '../../utils/date';
import { pluralizePl } from '../../utils/pluralize';

export type RecipeDetailNavigation = {
  goBack: () => void;
  navigate: (screen: 'UpdateFridgeSheet', params: { recipeId: number; from: string }) => void;
  setOptions: (options: { title?: string }) => void;
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
  const addToShoppingList = useShoppingListStore((s) => s.addIfMissing);
  const removeFromShoppingList = useShoppingListStore((s) => s.removeItem);
  const shoppingItems = useShoppingListStore((s) => s.items);
  const toast = useToast();
  const { recipes, hasHydrated: recipesHydrated } = useRecipesCatalog();

  const recipe = recipes.find((r) => r.id === route.params.recipeId);
  const match = recipe ? matchRecipe(recipe, products) : null;
  const stillResolving = !recipe && !recipesHydrated;

  // Tytuł karty przeglądarki: nazwa przepisu zamiast ogólnego „Przepis”.
  useEffect(() => {
    if (recipe) navigation.setOptions({ title: recipe.title });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recipe?.title]);

  useEffect(() => {
    if (!recipe && !stillResolving) {
      navigation.goBack();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recipe, stillResolving]);

  if (!recipe || !match) {
    return null;
  }

  const expiringUsed = match.ingredientStatuses
    .filter((i) => i.have)
    .map((i) => {
      const product = findProductForIngredient(i, products);
      return product?.expiryDate ? { name: product.name, days: daysUntil(product.expiryDate) } : null;
    })
    .filter((x): x is { name: string; days: number } => !!x && x.days <= 2)
    .sort((a, b) => a.days - b.days)[0];

  const findOnShoppingList = (name: string) =>
    shoppingItems.find((i) => !i.checked && i.name.trim().toLowerCase() === name.trim().toLowerCase());

  const toggleShoppingItem = (name: string, qty: string) => {
    const existing = findOnShoppingList(name);
    if (existing) {
      removeFromShoppingList(existing.id);
      toast.show(`Usunięto „${name}” z listy zakupów`);
    } else {
      addToShoppingList(name, qty, recipe.title);
      toast.show(`Dodano „${name}” do listy zakupów`);
    }
  };

  const usesText = expiringUsed
    ? `Zużywa ${expiringUsed.name}, który kończy się za ${expiringUsed.days} ${pluralizePl(Math.max(expiringUsed.days, 0), ['dzień', 'dni', 'dni'])}`
    : `${match.haveCount} z ${match.totalCount} składników już masz w lodówce`;

  return (
      <View style={styles.screen}>
        <ScrollView
          style={styles.screen}
          contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing.space4, paddingBottom: insets.bottom + spacing.space6 }]}
        >
          <Pressable onPress={() => navigation.goBack()} style={styles.back} hitSlop={8}>
            <BackArrow />
            <AppText style={styles.backLabel} color={colors.textMuted}>
              Wróć
            </AppText>
          </Pressable>

          <View style={styles.header}>
            <RecipeThumb imageUrl={recipe.imageUrl} iconSize={32} style={styles.thumb} />
            <View style={styles.headerText}>
              <AppText variant="h2">{recipe.title}</AppText>
              <AppText variant="meta" color={colors.textMuted} style={styles.headerMeta}>
                {`${recipe.time} · ${recipeLabel(recipe.difficulty)} · ${recipeLabel(recipe.taste)}`}
              </AppText>
            </View>
          </View>

          {recipe.imageCredit && (
            <Pressable onPress={() => Linking.openURL(recipe.imageCredit!.url)} hitSlop={8} style={styles.credit}>
              <AppText variant="caption" color={colors.textMuted}>
                {`Zdjęcie poglądowe: ${recipe.imageCredit.photographer} / Pexels`}
              </AppText>
            </Pressable>
          )}

          <View style={styles.usesBanner}>
            <AppText style={styles.usesText} color={colors.primary}>
              {usesText}
            </AppText>
          </View>

          <Section title="WARTOŚCI ODŻYWCZE">
            <View style={styles.nutritionRow}>
              {recipe.nutrition.map((n) => (
                <View key={n.unit} style={styles.nutritionBox}>
                  <AppText style={styles.nutritionValue}>{n.value}</AppText>
                  <AppText style={styles.nutritionUnit} color={colors.textMuted}>
                    {n.unit}
                  </AppText>
                </View>
              ))}
            </View>
          </Section>

          <Section title="SKŁADNIKI">
            <View style={styles.ingredientsCard}>
              {match.ingredientStatuses.map((ing, i) => {
                const onList = !ing.have && !!findOnShoppingList(ing.name);
                return (
                  <View key={ing.name} style={[styles.ingredientRow, i > 0 && styles.ingredientDivider]}>
                    <AppText variant="body" style={styles.ingredientName}>
                      {ing.name}
                    </AppText>
                    <AppText variant="meta" color={colors.textMuted} style={styles.ingredientQty}>
                      {ing.qty}
                    </AppText>
                    <AppText
                      style={styles.ingredientStatus}
                      color={ing.have ? colors.successStrong : colors.primary}
                    >
                      {ing.have ? 'masz' : onList ? 'na liście' : 'brakuje'}
                    </AppText>
                    {ing.have ? (
                      <View style={styles.shoppingTogglePlaceholder} />
                    ) : (
                      <Pressable
                        onPress={() => toggleShoppingItem(ing.name, ing.qty)}
                        hitSlop={8}
                        style={[styles.shoppingToggle, onList && styles.shoppingToggleActive]}
                        accessibilityLabel={onList ? `Usuń ${ing.name} z listy zakupów` : `Dodaj ${ing.name} do listy zakupów`}
                      >
                        {onList ? <Check size={14} color={colors.textOnStrong} /> : <Plus size={14} color={colors.primary} />}
                      </Pressable>
                    )}
                  </View>
                );
              })}
            </View>
          </Section>

          <Section title="PRZYGOTOWANIE">
            <View style={styles.steps}>
              {recipe.steps.map((step, i) => (
                <View key={i} style={styles.stepRow}>
                  <View style={styles.stepNumber}>
                    <AppText style={styles.stepNumberText} color={colors.primary}>
                      {i + 1}
                    </AppText>
                  </View>
                  <AppText variant="body" color={colors.textSecondary} style={styles.stepText}>
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
              <Heart size={17} color={isFavorite ? colors.secondaryStrong : colors.border} fill={isFavorite ? colors.secondaryStrong : 'none'} />
            </Pressable>
          </View>
        </ScrollView>

        <Toast visible={toast.visible} message={toast.message} onHide={toast.hide} />
      </View>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <AppText variant="kicker" color={colors.textMuted} style={styles.sectionTitle}>
        {title}
      </AppText>
      {children}
    </View>
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
    backgroundColor: colors.primarySubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  credit: {
    marginTop: spacing.space2,
    alignSelf: 'flex-start',
  },
  headerText: {
    flex: 1,
  },
  headerMeta: {
    marginTop: spacing.space2,
  },
  usesBanner: {
    backgroundColor: colors.primarySubtle,
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
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingVertical: 11,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  nutritionValue: {
    fontFamily: fontFamily.outfitSemiBold,
    fontSize: 15,
    color: colors.text,
  },
  nutritionUnit: {
    fontFamily: fontFamily.plexMonoRegular,
    fontSize: 10.5,
    marginTop: 2,
  },
  ingredientsCard: {
    borderWidth: 1,
    borderColor: colors.border,
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
    borderTopColor: colors.border,
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
  shoppingToggle: {
    width: 26,
    height: 26,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shoppingTogglePlaceholder: {
    width: 26,
  },
  shoppingToggleActive: {
    backgroundColor: colors.successStrong,
    borderColor: colors.successStrong,
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
    backgroundColor: colors.primarySubtle,
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
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
