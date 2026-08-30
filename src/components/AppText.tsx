import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { colors, typography, TypographyVariant } from '../theme';

export type AppTextProps = TextProps & {
  variant?: TypographyVariant;
  color?: string;
};

export function AppText({ variant = 'body', color = colors.ink, style, ...rest }: AppTextProps) {
  return <Text style={[styles.base, typography[variant], { color }, style]} {...rest} />;
}

const styles = StyleSheet.create({
  base: {
    color: colors.ink,
  },
});
