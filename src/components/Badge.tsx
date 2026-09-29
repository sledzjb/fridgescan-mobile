import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { AppText } from './AppText';
import { colors, radius, fontFamily } from '../theme';

export type BadgeVariant = 'expiry';

export type BadgeProps = {
  label: string;
  variant: BadgeVariant;
  style?: StyleProp<ViewStyle>;
};

/** Mała etykieta przy produkcie - obecnie tylko termin ważności („został 1 dzień”). */
export function Badge({ label, style }: BadgeProps) {
  return (
    <View style={[styles.base, styles.expiry, style]}>
      <AppText style={[styles.text, { color: colors.onWarning }]}>{label}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.pill,
    alignSelf: 'flex-start',
  },
  expiry: {
    backgroundColor: colors.warning,
    paddingVertical: 4,
    paddingHorizontal: 9,
  },
  text: {
    fontFamily: fontFamily.outfitMedium,
    fontSize: 11,
    lineHeight: 13,
    letterSpacing: 0,
  },
});
