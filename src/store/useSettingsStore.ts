import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Consents = {
  photoProcessing: boolean;
  recipePersonalization: boolean;
  marketing: boolean;
};

export type NotificationPrefs = {
  expiringSoon: boolean;
  shoppingReminders: boolean;
  dailyIdea: boolean;
};

type SettingsState = {
  consents: Consents;
  notifications: NotificationPrefs;
  hasHydrated: boolean;
  setConsent: (key: keyof Consents, value: boolean) => void;
  setNotificationPref: (key: keyof NotificationPrefs, value: boolean) => void;
  resetSettings: () => void;
};

const DEFAULT_CONSENTS: Consents = {
  photoProcessing: true,
  recipePersonalization: true,
  marketing: false,
};

const DEFAULT_NOTIFICATIONS: NotificationPrefs = {
  expiringSoon: true,
  shoppingReminders: true,
  dailyIdea: false,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      consents: DEFAULT_CONSENTS,
      notifications: DEFAULT_NOTIFICATIONS,
      hasHydrated: false,
      setConsent: (key, value) => set((state) => ({ consents: { ...state.consents, [key]: value } })),
      setNotificationPref: (key, value) =>
        set((state) => ({ notifications: { ...state.notifications, [key]: value } })),
      resetSettings: () => set({ consents: DEFAULT_CONSENTS, notifications: DEFAULT_NOTIFICATIONS }),
    }),
    {
      name: '@fridgescan/settings',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ consents: state.consents, notifications: state.notifications }),
      onRehydrateStorage: () => () => {
        useSettingsStore.setState({ hasHydrated: true });
      },
    }
  )
);
