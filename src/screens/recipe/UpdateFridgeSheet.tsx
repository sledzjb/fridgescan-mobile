import React, { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { AppText, Button, Checkbox, Toggle, BottomSheet } from '../../components';
import { colors, spacing, fontFamily } from '../../theme';
import { useProductsStore, Product } from '../../store/useProductsStore';
import { useHistoryStore } from '../../store/useHistoryStore';
import { RECIPES } from '../../data/recipes';
import { matchRecipe } from '../../utils/recipeMatch';

export type UpdateFridgeSheetNavigation = {
  goBack: () => void;
  getParent: () => { navigate: (screen: string) => void } | undefined;
};

type Props = {
  navigation: UpdateFridgeSheetNavigation;
  route: { params: { recipeId: number; from: string } };
};

function findMatchingProduct(name: string, products: Product[]): Product | undefined {
  const target = name.trim().toLowerCase();
  return products.find((p) => {
    const pName = p.name.trim().toLowerCase();
    return pName === target || pName.includes(target) || target.includes(pName);
  });
}

export function UpdateFridgeSheet({ navigation, route }: Props) {
  const products = useProductsStore((s) => s.products);
  const setQuantity = useProductsStore((s) => s.setQuantity);
  const addHistoryEntry = useHistoryStore((s) => s.addEntry);

  const recipe = RECIPES.find((r) => r.id === route.params.recipeId);
  const match = useMemo(() => (recipe ? matchRecipe(recipe, products) : null), [recipe, products]);
  const haveIngredients = match ? match.ingredientStatuses.filter((i) => i.have) : [];

  const [checked, setChecked] = useState<Record<string, boolean>>(
    Object.fromEntries(haveIngredients.map((i) => [i.name, true]))
  );
  const [remind, setRemind] = useState(true);

  useEffect(() => {
    if (!recipe) {
      navigation.goBack();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recipe]);

  if (!recipe || !match) {
    return null;
  }

  const toggleChecked = (name: string) => setChecked((prev) => ({ ...prev, [name]: !prev[name] }));

  const checkedNames = haveIngredients.filter((i) => checked[i.name]).map((i) => i.name);

  const handleUpdate = () => {
    haveIngredients.forEach((ing) => {
      if (!checked[ing.name]) return;
      const product = findMatchingProduct(ing.name, products);
      if (!product) return;
      const usedQty = parseFloat(ing.qty.replace(',', '.')) || 0;
      setQuantity(product.id, Math.max(0, product.qty - usedQty));
    });
    addHistoryEntry({
      type: 'cooked',
      title: 'Wykonany przepis',
      description: `${recipe.title}. Lodówka zaktualizowana.`,
      actionLabel: 'Zobacz przepis',
      recipeId: recipe.id,
    });
    navigation.goBack();
    navigation.getParent()?.navigate('FridgeTab');
  };

  return (
    <BottomSheet visible onClose={navigation.goBack}>
      <AppText variant="h3">Uaktualnić lodówkę?</AppText>
      <AppText variant="caption" color={colors.mute} style={styles.description}>
        Odejmiemy zużyte składniki. Możesz odznaczyć to, co zostało.
      </AppText>

      <View style={styles.list}>
        {haveIngredients.map((ing, i) => (
          <View key={ing.name} style={[styles.row, i > 0 && styles.rowDivider]}>
            <Checkbox value={!!checked[ing.name]} onValueChange={() => toggleChecked(ing.name)} />
            <AppText variant="body" style={styles.rowName}>
              {ing.name}
            </AppText>
            <AppText style={styles.delta} color={colors.mute}>
              {checked[ing.name] ? `− ${ing.qty}` : 'bez zmian'}
            </AppText>
          </View>
        ))}
      </View>

      <View style={styles.reminderRow}>
        <View style={styles.reminderText}>
          <AppText variant="label">Przypomnij o uzupełnieniu</AppText>
          <AppText variant="caption" color={colors.mute} style={styles.reminderCaption}>
            {checkedNames.length > 0
              ? `Powiadomienie za 3 dni: ${checkedNames.join(', ')}`
              : 'Nie zaznaczono żadnych składników do uzupełnienia.'}
          </AppText>
        </View>
        <Toggle value={remind} onValueChange={setRemind} />
      </View>

      <View style={styles.actions}>
        <Button label="Nie teraz" variant="outline" onPress={navigation.goBack} style={styles.notNowButton} />
        <Button label="Zaktualizuj" variant="secondary" onPress={handleUpdate} style={styles.updateButton} />
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  description: {
    marginTop: spacing.space2,
  },
  list: {
    marginTop: spacing.space5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.space3,
    paddingVertical: spacing.space2,
  },
  rowDivider: {
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  rowName: {
    flex: 1,
  },
  delta: {
    fontFamily: fontFamily.plexMonoRegular,
    fontSize: 12,
  },
  reminderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.space3,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.space4,
    marginTop: spacing.space5,
  },
  reminderText: {
    flex: 1,
  },
  reminderCaption: {
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.space3,
    marginTop: spacing.space6,
  },
  notNowButton: {},
  updateButton: {
    flex: 1,
  },
});
