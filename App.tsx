import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAppFonts } from './src/theme';
import { WebPhoneFrame } from './src/WebPhoneFrame';
import { AppStateProvider, useAppState } from './src/store/AppStateContext';
import { useProductsStore } from './src/store/useProductsStore';
import { useFavoritesStore } from './src/store/useFavoritesStore';
import { useShoppingListStore } from './src/store/useShoppingListStore';
import { useHistoryStore } from './src/store/useHistoryStore';
import { useRecipesStore } from './src/store/useRecipesStore';
import { useGenerationCacheStore } from './src/store/useGenerationCacheStore';
import { pruneStorage } from './src/store/pruneStorage';
import { watchFridgeChanges } from './src/store/watchFridgeChanges';
import { RootNavigator } from './src/navigation/RootNavigator';
import { documentTitle } from './src/navigation/documentTitle';

SplashScreen.preventAutoHideAsync().catch(() => {});

function AppContent() {
  const [fontsLoaded, fontError] = useAppFonts();
  const { ready, onboardingDone } = useAppState();
  const productsHydrated = useProductsStore((s) => s.hasHydrated);
  const favoritesHydrated = useFavoritesStore((s) => s.hasHydrated);
  const shoppingListHydrated = useShoppingListStore((s) => s.hasHydrated);
  const historyHydrated = useHistoryStore((s) => s.hasHydrated);
  const recipesHydrated = useRecipesStore((s) => s.hasHydrated);
  const cacheHydrated = useGenerationCacheStore((s) => s.hasHydrated);
  const appReady =
    (fontsLoaded || !!fontError) &&
    ready &&
    productsHydrated &&
    favoritesHydrated &&
    shoppingListHydrated &&
    historyHydrated &&
    recipesHydrated &&
    cacheHydrated;

  useEffect(() => {
    if (appReady) {
      pruneStorage();
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [appReady]);

  useEffect(() => {
    if (!appReady) return;
    return watchFridgeChanges();
  }, [appReady]);

  if (!appReady) {
    return null;
  }

  return (
    <NavigationContainer documentTitle={documentTitle}>
        <RootNavigator initialRouteName={onboardingDone ? 'MainTabs' : 'Onboarding'} />
      <StatusBar style="dark" />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <WebPhoneFrame>
      <SafeAreaProvider style={styles.root}>
        <AppStateProvider>
          <AppContent />
        </AppStateProvider>
      </SafeAreaProvider>
    </WebPhoneFrame>
  );
}

const styles = StyleSheet.create({
  // react-native-web: bez jawnego width/height 100% korzeń zamontowany przez
  // AppRegistry nie zawsze dziedziczy wysokość z #root mimo flex:1 (patrz
  // https://github.com/necolas/react-native-web/issues/940) - to psuło pełnoekranowe
  // tło na Welcome.
  root: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});
