import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { colors, radius as radiusTokens } from '../theme';

export type CardProps = {
  children: React.ReactNode;
  radius?: number;
  padding?: number;
  style?: StyleProp<ViewStyle>;
};

export function Card({ children, radius = radiusTokens.xl, padding, style }: CardProps) {
  return (
    <View style={[styles.base, { borderRadius: radius, padding }, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.line,
    overflow: 'hidden',
  },
});
