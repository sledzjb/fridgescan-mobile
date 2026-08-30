import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  name: '@fridgescan/name',
  onboardingDone: '@fridgescan/onboardingDone',
  notificationsAsked: '@fridgescan/notificationsAsked',
} as const;

type AppState = {
  /** false dopóki wartości nie zostaną odczytane z AsyncStorage. */
  ready: boolean;
  name: string;
  onboardingDone: boolean;
  notificationsAsked: boolean;
  setName: (name: string) => void;
  completeOnboarding: () => void;
  setNotificationsAsked: (asked: boolean) => void;
};

const AppStateContext = createContext<AppState | undefined>(undefined);

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [name, setNameState] = useState('');
  const [onboardingDone, setOnboardingDone] = useState(false);
  const [notificationsAsked, setNotificationsAskedState] = useState(false);

  useEffect(() => {
    (async () => {
      const entries = await AsyncStorage.multiGet([
        STORAGE_KEYS.name,
        STORAGE_KEYS.onboardingDone,
        STORAGE_KEYS.notificationsAsked,
      ]);
      const values = Object.fromEntries(entries);
      if (values[STORAGE_KEYS.name]) setNameState(values[STORAGE_KEYS.name] as string);
      setOnboardingDone(values[STORAGE_KEYS.onboardingDone] === '1');
      setNotificationsAskedState(values[STORAGE_KEYS.notificationsAsked] === '1');
      setReady(true);
    })();
  }, []);

  const setName = useCallback((value: string) => {
    setNameState(value);
    AsyncStorage.setItem(STORAGE_KEYS.name, value).catch(() => {});
  }, []);

  const completeOnboarding = useCallback(() => {
    setOnboardingDone(true);
    AsyncStorage.setItem(STORAGE_KEYS.onboardingDone, '1').catch(() => {});
  }, []);

  const setNotificationsAsked = useCallback((asked: boolean) => {
    setNotificationsAskedState(asked);
    AsyncStorage.setItem(STORAGE_KEYS.notificationsAsked, asked ? '1' : '0').catch(() => {});
  }, []);

  return (
    <AppStateContext.Provider
      value={{ ready, name, onboardingDone, notificationsAsked, setName, completeOnboarding, setNotificationsAsked }}
    >
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider');
  return ctx;
}
