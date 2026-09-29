import React from 'react';
import { View, Pressable, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { AppText } from './AppText';
import { colors, radius, fontFamily } from '../theme';

export type ChipState = 'default' | 'selected' | 'filterActive' | 'suggestion';

export type ChipProps = {
  label: string;
  state?: ChipState;
  onPress?: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function Chip({ label, state = 'default', onPress, disabled, style }: ChipProps) {
  const { container, textColor, border, dashed, weight } = getStateStyle(state);

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        container,
        border && { borderWidth: 1, borderColor: border, borderStyle: dashed ? 'dashed' : 'solid' },
        pressed && styles.pressed,
        style,
      ]}
    >
      <AppText style={[styles.text, { fontFamily: weight }]} color={textColor}>
        {state === 'suggestion' ? `+ ${label}` : label}
      </AppText>
    </Pressable>
  );
}

function getStateStyle(state: ChipState) {
  switch (state) {
    case 'selected':
      return {
        container: { backgroundColor: colors.primary },
        textColor: colors.onPrimary,
        border: colors.primary,
        dashed: false,
        weight: fontFamily.outfitSemiBold,
      };
    case 'filterActive':
      return {
        container: { backgroundColor: colors.inverse },
        textColor: colors.onInverse,
        border: undefined,
        dashed: false,
        weight: fontFamily.outfitSemiBold,
      };
    case 'suggestion':
      return {
        container: { backgroundColor: colors.background },
        textColor: colors.textMuted,
        border: colors.border,
        dashed: true,
        weight: fontFamily.outfitMedium,
      };
    case 'default':
    default:
      return {
        container: { backgroundColor: colors.background },
        textColor: colors.text,
        border: colors.border,
        dashed: false,
        weight: fontFamily.outfitMedium,
      };
  }
}

const styles = StyleSheet.create({
  base: {
    height: 35,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.8,
  },
  text: {
    fontSize: 13,
    lineHeight: 16,
  },
});
