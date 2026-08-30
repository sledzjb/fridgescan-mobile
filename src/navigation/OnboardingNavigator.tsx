import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { WelcomeScreen } from '../screens/onboarding/WelcomeScreen';
import { NameScreen } from '../screens/onboarding/NameScreen';
import { IntroScreen } from '../screens/onboarding/IntroScreen';
import { NotificationsConsentScreen } from '../screens/onboarding/NotificationsConsentScreen';
import { OnboardingStackParamList } from './types';

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

export function OnboardingNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Name" component={NameScreen} />
      <Stack.Screen name="Intro" component={IntroScreen} />
      <Stack.Screen name="NotificationsConsent" component={NotificationsConsentScreen} />
    </Stack.Navigator>
  );
}
