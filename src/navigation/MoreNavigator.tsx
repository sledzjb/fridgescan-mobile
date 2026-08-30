import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { EmptyLegalScreen } from '../screens/more/EmptyLegalScreen';
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
      <Stack.Screen name="PrivacyPolicy" options={{ presentation: 'modal' }}>
        {({ navigation }) => <EmptyLegalScreen title="Polityka prywatności" navigation={navigation} />}
      </Stack.Screen>
      <Stack.Screen name="TermsOfService" options={{ presentation: 'modal' }}>
        {({ navigation }) => <EmptyLegalScreen title="Regulamin" navigation={navigation} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
