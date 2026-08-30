import React from 'react';
import { Pressable, View, StyleSheet } from 'react-native';
import { ChefHat } from 'lucide-react-native';
import { AppText } from '../../components';
import { colors, radius, spacing, fontFamily } from '../../theme';
import { Recipe } from '../../data/recipes';

export type RecipeListRowProps = {
  recipe: Recipe;
  matchPercent?: number;
  onPress: () => void;
};

export function RecipeListRow({ recipe, matchPercent, onPress }: RecipeListRowProps) {
  return (
    <Pressable style={styles.row} onPress={onPress}>
      <View style={styles.thumb}>
        <ChefHat size={22} color={colors.primary700} strokeWidth={1.5} />
      </View>
      <View style={styles.body}>
        <AppText style={styles.title} numberOfLines={1}>
          {recipe.title}
        </AppText>
        <AppText variant="meta" color={colors.mute} style={styles.meta}>
          {`${recipe.time} · ${recipe.meal} · ${recipe.difficulty}`}
        </AppText>
      </View>
      {matchPercent !== undefined && (
        <AppText style={styles.percent} color={matchPercent >= 85 ? colors.primary700 : colors.mute}>
          {`${matchPercent}%`}
        </AppText>
      )}
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
    borderBottomColor: colors.line,
  },
  thumb: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: colors.primary50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
  },
  title: {
    fontFamily: fontFamily.outfitSemiBold,
    fontSize: 14.5,
    color: colors.ink,
  },
  meta: {
    marginTop: 3,
  },
  percent: {
    fontFamily: fontFamily.plexMonoRegular,
    fontSize: 12.5,
  },
});
