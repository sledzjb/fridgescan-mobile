import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { AppText } from './AppText';
import { colors, radius, fontFamily } from '../theme';

export type BadgeVariant = 'match' | 'expiry' | 'recognized' | 'uncertain';

export type BadgeProps = {
  label: string;
  variant: BadgeVariant;
  style?: StyleProp<ViewStyle>;
};

export function Badge({ label, variant, style }: BadgeProps) {
  switch (variant) {
    case 'match':
      return (
        <View style={[styles.base, { backgroundColor: colors.primary50, paddingVertical: 5, paddingHorizontal: 9 }, style]}>
          <AppText style={[styles.mono, { color: colors.primary700 }]}>{label}</AppText>
        </View>
      );
    case 'expiry':
      return (
        <View style={[styles.base, { backgroundColor: colors.secondary50, paddingVertical: 4, paddingHorizontal: 9 }, style]}>
          <AppText style={[styles.outfit, { color: colors.secondary700 }]}>{label}</AppText>
        </View>
      );
    case 'recognized':
      return (
        <View
          style={[
            styles.base,
            {
              backgroundColor: 'rgba(16,19,20,.55)',
              borderWidth: 1.5,
              borderColor: colors.accent400,
              borderRadius: radius.sm,
              paddingVertical: 4,
              paddingHorizontal: 8,
            },
            style,
          ]}
        >
          <AppText style={[styles.mono, { color: colors.accent400 }]}>{label}</AppText>
        </View>
      );
    case 'uncertain':
      return (
        <View
          style={[
            styles.base,
            {
              backgroundColor: 'rgba(16,19,20,.55)',
              borderWidth: 1.5,
              borderColor: colors.secondary300,
              borderRadius: radius.sm,
              paddingVertical: 4,
              paddingHorizontal: 8,
            },
            style,
          ]}
        >
          <AppText style={[styles.mono, { color: colors.secondary300 }]}>{label}</AppText>
        </View>
      );
  }
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.pill,
    alignSelf: 'flex-start',
  },
  mono: {
    fontFamily: fontFamily.plexMonoMedium,
    fontSize: 11,
    lineHeight: 13,
    letterSpacing: 0,
  },
  outfit: {
    fontFamily: fontFamily.outfitMedium,
    fontSize: 11,
    lineHeight: 13,
    letterSpacing: 0,
  },
});
