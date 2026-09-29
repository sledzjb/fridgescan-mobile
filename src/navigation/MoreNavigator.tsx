import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MoreScreen } from '../screens/more/MoreScreen';
import { HistoryScreen } from '../screens/more/HistoryScreen';
import { ShoppingListScreen } from '../screens/more/ShoppingListScreen';
import { SettingsScreen } from '../screens/more/SettingsScreen';
import { HelpScreen } from '../screens/more/HelpScreen';
import { MoreStackParamList } from './types';

const Stack = createNativeStackNavigator<MoreStackParamList>();

export function MoreNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="More" component={MoreScreen} />
      <Stack.Screen name="History" component={HistoryScreen} />
      <Stack.Screen name="ShoppingList" component={ShoppingListScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="Help" component={HelpScreen} />
    </Stack.Navigator>
  );
}
