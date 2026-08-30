import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { OnboardingNavigator } from './OnboardingNavigator';
import { MainTabs } from './MainTabs';
import { ScanNavigator } from './ScanNavigator';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export type RootNavigatorProps = {
  initialRouteName: 'Onboarding' | 'MainTabs';
};

export function RootNavigator({ initialRouteName }: RootNavigatorProps) {
  return (
    <Stack.Navigator initialRouteName={initialRouteName} screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Onboarding" component={OnboardingNavigator} />
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="Scan" component={ScanNavigator} options={{ presentation: 'fullScreenModal' }} />
    </Stack.Navigator>
  );
}
