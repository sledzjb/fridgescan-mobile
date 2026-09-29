import React from 'react';
import { View, ScrollView, Pressable, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Heart } from 'lucide-react-native';
import { AppText, Button, Card, RecipeThumb } from '../../components';
import { recipeLabel } from '../../constants/recipeLabels';
import { colors, radius, spacing, screenPaddingHorizontal, fontFamily } from '../../theme';
import { useFavoritesStore } from '../../store/useFavoritesStore';
import { useRecipesCatalog } from '../../store/useRecipesStore';
import { FavoritesStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<FavoritesStackParamList, 'Favorites'>;

export function FavoritesScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const recipeIds = useFavoritesStore((s) => s.recipeIds);
  const toggleFavorite = useFavoritesStore((s) => s.toggleFavorite);
  const { recipes } = useRecipesCatalog();

  const favoriteRecipes = recipes.filter((r) => recipeIds.includes(r.id));

  const goToGenerator = () => navigation.getParent()?.navigate('GeneratorTab' as never);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={{ paddingTop: insets.top + spacing.space6, paddingBottom: insets.bottom + spacing.space6 }}
    >
      <View style={styles.header}>
        <AppText variant="h1">Ulubione</AppText>
        <AppText variant="bodyL" color={colors.textMuted} style={styles.description}>
          Zapisane przepisy działają też offline. Kolekcje i udostępnianie dojdą w kolejnej wersji.
        </AppText>
      </View>

      {favoriteRecipes.length === 0 ? (
        <Card style={styles.emptyCard} radius={20} padding={0}>
          <View style={styles.emptyCardInner}>
            <View style={styles.emptyIconTile}>
              <Heart size={26} color={colors.onSecondary} />
            </View>
            <AppText variant="h3" style={styles.emptyTitle}>
              Nic tu jeszcze nie ma
            </AppText>
            <AppText variant="caption" color={colors.textMuted} style={styles.emptyDescription}>
              Tapnij serduszko na ekranie przepisu - wróci tu razem ze składnikami i krokami, dostępny bez
              internetu.
            </AppText>
            <Button label="Wygeneruj pierwszy przepis" variant="primary" onPress={goToGenerator} style={styles.fullWidth} />
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
              <RecipeThumb imageUrl={recipe.imageUrl} iconSize={24} style={styles.thumb} />
              <View style={styles.cardBody}>
                <AppText style={styles.cardTitle}>{recipe.title}</AppText>
                <AppText variant="meta" color={colors.textMuted} style={styles.cardMeta}>
                  {`${recipe.time} · ${recipeLabel(recipe.meal)} · ${recipeLabel(recipe.difficulty)}`}
                </AppText>
              </View>
              <Pressable onPress={() => toggleFavorite(recipe.id)} hitSlop={8}>
                <Heart size={16} color={colors.secondaryStrong} fill={colors.secondaryStrong} />
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
    backgroundColor: colors.background,
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
    backgroundColor: colors.secondary,
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
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.xl,
    padding: 13,
  },
  thumb: {
    width: 56,
    height: 56,
    borderRadius: 13,
    backgroundColor: colors.primarySubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBody: {
    flex: 1,
  },
  cardTitle: {
    fontFamily: fontFamily.outfitSemiBold,
    fontSize: 15,
    color: colors.text,
  },
  cardMeta: {
    marginTop: 3,
  },
});
