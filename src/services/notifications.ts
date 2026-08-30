import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { IsoDate } from '../utils/date';

/**
 * Zaplanowane powiadomienia lokalne nie są wspierane na web (react-native-web) -
 * cały moduł jest no-opem na tej platformie zamiast udawać, że coś zaplanował.
 */
const SUPPORTS_NOTIFICATIONS = Platform.OS !== 'web';

export async function requestNotificationPermission(): Promise<boolean> {
  if (!SUPPORTS_NOTIFICATIONS) return false;
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  if (!current.canAskAgain) return false;
  const result = await Notifications.requestPermissionsAsync();
  return result.granted;
}

export async function hasNotificationPermission(): Promise<boolean> {
  if (!SUPPORTS_NOTIFICATIONS) return false;
  const current = await Notifications.getPermissionsAsync();
  return current.granted;
}

/** Planuje powiadomienie o godz. 9:00 dwa dni przed podaną datą ważności (ISO). Zwraca id albo null, gdy nie zaplanowano. */
export async function scheduleExpiryNotification(productName: string, expiryDate: IsoDate): Promise<string | null> {
  if (!SUPPORTS_NOTIFICATIONS) return null;

  const granted = await hasNotificationPermission();
  if (!granted) return null;

  const [y, m, d] = expiryDate.split('-').map(Number);
  const triggerDate = new Date(y, m - 1, d - 2, 9, 0, 0);
  if (triggerDate.getTime() <= Date.now()) return null;

  try {
    return await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Kończy się termin ważności',
        body: `${productName} - sprawdź, zanim się zepsuje.`,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: triggerDate,
      },
    });
  } catch {
    return null;
  }
}

export async function cancelNotification(identifier: string | null | undefined): Promise<void> {
  if (!SUPPORTS_NOTIFICATIONS || !identifier) return;
  try {
    await Notifications.cancelScheduledNotificationAsync(identifier);
  } catch {
    // Powiadomienie mogło już wygasnąć/zostać odpalone - nic wtedy nie robimy.
  }
}

export async function cancelAllNotifications(): Promise<void> {
  if (!SUPPORTS_NOTIFICATIONS) return;
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch {
    // j.w.
  }
}

/** Anuluje stare powiadomienie produktu (jeśli było) i planuje nowe, gdy ma sens. Zwraca nowe id albo null. */
export async function syncProductExpiryNotification(
  previousNotificationId: string | null | undefined,
  productName: string,
  expiryDate: IsoDate | null,
  notificationsEnabled: boolean
): Promise<string | null> {
  await cancelNotification(previousNotificationId);
  if (!notificationsEnabled || !expiryDate) return null;
  return scheduleExpiryNotification(productName, expiryDate);
}
