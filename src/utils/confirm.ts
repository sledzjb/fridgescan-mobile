import { Alert, Platform } from 'react-native';

/**
 * Potwierdzenie akcji destrukcyjnej. Alert.alert w react-native-web jest pustą funkcją (nic nie pokazuje
 * i nie wywołuje przycisków), więc w przeglądarce używamy natywnego window.confirm.
 */
export function confirmDestructive({
  title,
  message,
  confirmLabel,
  onConfirm,
}: {
  title: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => void;
}): void {
  if (Platform.OS === 'web') {
    if (window.confirm(`${title}\n\n${message}`)) onConfirm();
    return;
  }
  Alert.alert(title, message, [
    { text: 'Anuluj', style: 'cancel' },
    { text: confirmLabel, style: 'destructive', onPress: onConfirm },
  ]);
}
