import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AllRecipesScreen } from '../screens/recipes/AllRecipesScreen';
import { SearchRecipesScreen } from '../screens/recipes/SearchRecipesScreen';
import { RecipeDetailScreen } from '../screens/recipe/RecipeDetailScreen';
import { UpdateFridgeSheet } from '../screens/recipe/UpdateFridgeSheet';
import { RecipesStackParamList } from './types';

const Stack = createNativeStackNavigator<RecipesStackParamList>();

export function RecipesNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AllRecipes" component={AllRecipesScreen} />
      <Stack.Screen name="SearchRecipes" component={SearchRecipesScreen} options={{ presentation: 'modal' }} />
      <Stack.Screen name="RecipeDetail" component={RecipeDetailScreen} />
      <Stack.Screen
        name="UpdateFridgeSheet"
        component={UpdateFridgeSheet}
        options={{ presentation: 'transparentModal', animation: 'fade' }}
      />
    </Stack.Navigator>
  );
}
