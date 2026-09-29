import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type NotificationPrefs = {
  expiringSoon: boolean;
};

type SettingsState = {
  notifications: NotificationPrefs;
  hasHydrated: boolean;
  setNotificationPref: (key: keyof NotificationPrefs, value: boolean) => void;
  resetSettings: () => void;
};

const DEFAULT_NOTIFICATIONS: NotificationPrefs = {
  expiringSoon: true,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      notifications: DEFAULT_NOTIFICATIONS,
      hasHydrated: false,
      setNotificationPref: (key, value) =>
        set((state) => ({ notifications: { ...state.notifications, [key]: value } })),
      resetSettings: () => set({ notifications: DEFAULT_NOTIFICATIONS }),
    }),
    {
      name: '@fridgescan/settings',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ notifications: state.notifications }),
      onRehydrateStorage: () => () => {
        useSettingsStore.setState({ hasHydrated: true });
      },
    }
  )
);
