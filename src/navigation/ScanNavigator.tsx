import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ScanScreen } from '../screens/scan/ScanScreen';
import { ScanNoResultsScreen } from '../screens/scan/ScanNoResultsScreen';
import { ScanErrorScreen } from '../screens/scan/ScanErrorScreen';
import { ScanStackParamList } from './types';

const Stack = createNativeStackNavigator<ScanStackParamList>();

export function ScanNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Scan" component={ScanScreen} />
      <Stack.Screen name="ScanNoResults" component={ScanNoResultsScreen} />
      <Stack.Screen name="ScanError" component={ScanErrorScreen} />
    </Stack.Navigator>
  );
}
