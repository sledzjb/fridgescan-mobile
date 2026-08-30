import React from 'react';
import { View, ScrollView, Pressable, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChefHat, Heart } from 'lucide-react-native';
import { AppText, Button, Card } from '../../components';
import { colors, radius, spacing, screenPaddingHorizontal, fontFamily } from '../../theme';
import { useFavoritesStore } from '../../store/useFavoritesStore';
import { RECIPES } from '../../data/recipes';
import { FavoritesStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<FavoritesStackParamList, 'Favorites'>;

export function FavoritesScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const recipeIds = useFavoritesStore((s) => s.recipeIds);
  const toggleFavorite = useFavoritesStore((s) => s.toggleFavorite);

  const favoriteRecipes = RECIPES.filter((r) => recipeIds.includes(r.id));

  const goToRecipes = () => navigation.getParent()?.navigate('RecipesTab' as never);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={{ paddingTop: insets.top + spacing.space6, paddingBottom: insets.bottom + spacing.space6 }}
    >
      <View style={styles.header}>
        <AppText variant="h1">Ulubione</AppText>
        <AppText variant="bodyL" color={colors.mute} style={styles.description}>
          Zapisane przepisy działają też offline. Kolekcje i udostępnianie dojdą w kolejnej wersji.
        </AppText>
      </View>

      {favoriteRecipes.length === 0 ? (
        <Card style={styles.emptyCard} radius={20} padding={0}>
          <View style={styles.emptyCardInner}>
            <View style={styles.emptyIconTile}>
              <Heart size={26} color={colors.secondary700} />
            </View>
            <AppText variant="h3" style={styles.emptyTitle}>
              Nic tu jeszcze nie ma
            </AppText>
            <AppText variant="caption" color={colors.mute} style={styles.emptyDescription}>
              Tapnij serduszko na ekranie przepisu — wróci tu razem ze składnikami i krokami, dostępny bez
              internetu.
            </AppText>
            <Button label="Znajdź pierwszy przepis" variant="primary" onPress={goToRecipes} style={styles.fullWidth} />
          </View>
        </Card>
      ) : (
        <View style={styles.list}>
          {favoriteRecipes.map((recipe) => (
            <Pressable
              key={recipe.id}
              style={styles.card}
              onPress={() => navigation.navigate('RecipeDetail', { recipeId: recipe.id, from: 'favorites' })}
            >
              <View style={styles.thumb}>
                <ChefHat size={24} color={colors.primary700} strokeWidth={1.5} />
              </View>
              <View style={styles.cardBody}>
                <AppText style={styles.cardTitle}>{recipe.title}</AppText>
                <AppText variant="meta" color={colors.mute} style={styles.cardMeta}>
                  {`${recipe.time} · ${recipe.meal} · ${recipe.difficulty}`}
                </AppText>
              </View>
              <Pressable onPress={() => toggleFavorite(recipe.id)} hitSlop={8}>
                <Heart size={16} color={colors.secondary500} fill={colors.secondary500} />
              </Pressable>
            </Pressable>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  header: {
    paddingHorizontal: screenPaddingHorizontal,
  },
  description: {
    marginTop: spacing.space2,
  },
  emptyCard: {
    marginTop: spacing.space6,
    marginHorizontal: screenPaddingHorizontal,
    borderStyle: 'dashed',
  },
  emptyCardInner: {
    paddingVertical: 34,
    paddingHorizontal: 24,
    alignItems: 'center',
    gap: spacing.space3,
  },
  emptyIconTile: {
    width: 56,
    height: 56,
    borderRadius: 17,
    backgroundColor: colors.secondary50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.space2,
  },
  emptyTitle: {
    textAlign: 'center',
  },
  emptyDescription: {
    textAlign: 'center',
    marginBottom: spacing.space2,
  },
  fullWidth: {
    width: '100%',
  },
  list: {
    marginTop: spacing.space5,
    paddingHorizontal: screenPaddingHorizontal,
    gap: spacing.space3,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.space3,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.xl,
    padding: 13,
  },
  thumb: {
    width: 56,
    height: 56,
    borderRadius: 13,
    backgroundColor: colors.primary50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBody: {
    flex: 1,
  },
  cardTitle: {
    fontFamily: fontFamily.outfitSemiBold,
    fontSize: 15,
    color: colors.ink,
  },
  cardMeta: {
    marginTop: 3,
  },
});
