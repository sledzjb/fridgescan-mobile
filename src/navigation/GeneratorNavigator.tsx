import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GeneratorScreen } from '../screens/generator/GeneratorScreen';
import { GeneratorLoadingScreen } from '../screens/generator/GeneratorLoadingScreen';
import { RecipeResultsScreen } from '../screens/generator/RecipeResultsScreen';
import { RecipeResultsEmptyScreen } from '../screens/generator/RecipeResultsEmptyScreen';
import { RecipeDetailScreen } from '../screens/recipe/RecipeDetailScreen';
import { UpdateFridgeSheet } from '../screens/recipe/UpdateFridgeSheet';
import { GeneratorStackParamList } from './types';

const Stack = createNativeStackNavigator<GeneratorStackParamList>();

export function GeneratorNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Generator" component={GeneratorScreen} />
      <Stack.Screen name="GeneratorLoading" component={GeneratorLoadingScreen} />
      <Stack.Screen name="RecipeResults" component={RecipeResultsScreen} />
      <Stack.Screen name="RecipeResultsEmpty" component={RecipeResultsEmptyScreen} />
      <Stack.Screen name="RecipeDetail" component={RecipeDetailScreen} />
      <Stack.Screen
        name="UpdateFridgeSheet"
        component={UpdateFridgeSheet}
        options={{ presentation: 'transparentModal', animation: 'fade' }}
      />
    </Stack.Navigator>
  );
}
