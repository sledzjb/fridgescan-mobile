import React from 'react';
import { Pressable, View, StyleSheet } from 'react-native';
import { AppText, RecipeThumb } from '../../components';
import { recipeLabel } from '../../constants/recipeLabels';
import { colors, radius, spacing, fontFamily } from '../../theme';
import { Recipe } from '../../data/recipes';

export type RecipeListRowProps = {
  recipe: Recipe;
  onPress: () => void;
};

export function RecipeListRow({ recipe, onPress }: RecipeListRowProps) {
  return (
    <Pressable style={styles.row} onPress={onPress}>
      <RecipeThumb imageUrl={recipe.imageUrl} iconSize={22} style={styles.thumb} />
      <View style={styles.body}>
        <AppText style={styles.title} numberOfLines={1}>
          {recipe.title}
        </AppText>
        <AppText variant="meta" color={colors.textMuted} style={styles.meta}>
          {`${recipe.time} · ${recipeLabel(recipe.meal)} · ${recipeLabel(recipe.difficulty)}`}
        </AppText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.space3,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  thumb: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: colors.primarySubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
  },
  title: {
    fontFamily: fontFamily.outfitSemiBold,
    fontSize: 14.5,
    color: colors.text,
  },
  meta: {
    marginTop: 3,
  },
});
