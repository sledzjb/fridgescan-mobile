import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAppFonts } from './src/theme';
import { AppStateProvider, useAppState } from './src/store/AppStateContext';
import { useProductsStore } from './src/store/useProductsStore';
import { useFavoritesStore } from './src/store/useFavoritesStore';
import { useShoppingListStore } from './src/store/useShoppingListStore';
import { useHistoryStore } from './src/store/useHistoryStore';
import { RootNavigator } from './src/navigation/RootNavigator';

SplashScreen.preventAutoHideAsync().catch(() => {});

function AppContent() {
  const [fontsLoaded, fontError] = useAppFonts();
  const { ready, onboardingDone } = useAppState();
  const productsHydrated = useProductsStore((s) => s.hasHydrated);
  const favoritesHydrated = useFavoritesStore((s) => s.hasHydrated);
  const shoppingListHydrated = useShoppingListStore((s) => s.hasHydrated);
  const historyHydrated = useHistoryStore((s) => s.hasHydrated);
  const appReady =
    (fontsLoaded || !!fontError) &&
    ready &&
    productsHydrated &&
    favoritesHydrated &&
    shoppingListHydrated &&
    historyHydrated;

  useEffect(() => {
    if (appReady) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [appReady]);

  if (!appReady) {
    return null;
  }

  return (
    <NavigationContainer>
      <RootNavigator initialRouteName={onboardingDone ? 'MainTabs' : 'Onboarding'} />
      <StatusBar style="dark" />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppStateProvider>
        <AppContent />
      </AppStateProvider>
    </SafeAreaProvider>
  );
}
