import React from 'react';
import { Platform, View, StyleSheet } from 'react-native';

const PHONE_MAX_WIDTH = 480;

/**
 * Na web wymusza wąską, wyśrodkowaną kolumnę w rozmiarze telefonu zamiast
 * rozciągania aplikacji na całe okno przeglądarki. Na natywnych platformach
 * to zwykły no-op - telefon i tak renderuje na pełnym ekranie.
 */
export function WebPhoneFrame({ children }: { children: React.ReactNode }) {
  if (Platform.OS !== 'web') {
    return <>{children}</>;
  }

  return (
    <View style={styles.backdrop}>
      <View style={styles.phone}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1E1D19',
  },
  phone: {
    width: '100%',
    maxWidth: PHONE_MAX_WIDTH,
    height: '100%',
    overflow: 'hidden',
    boxShadow: '0 0 0 1px rgba(255,255,255,0.08), 0 30px 80px rgba(0,0,0,0.55)',
  },
});
