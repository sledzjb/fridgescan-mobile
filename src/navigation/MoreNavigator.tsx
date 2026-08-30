import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PlaceholderScreen } from '../screens/PlaceholderScreen';
import { MoreScreen } from '../screens/more/MoreScreen';
import { HistoryScreen } from '../screens/more/HistoryScreen';
import { ShoppingListScreen } from '../screens/more/ShoppingListScreen';
import { MoreStackParamList } from './types';

const Stack = createNativeStackNavigator<MoreStackParamList>();

export function MoreNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="More" component={MoreScreen} />
      <Stack.Screen name="History" component={HistoryScreen} />
      <Stack.Screen name="ShoppingList" component={ShoppingListScreen} />
      <Stack.Screen name="Settings">
        {() => <PlaceholderScreen title="Ustawienia i konto" stackName="WIĘCEJ" />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
