import React, { useState } from 'react';
import { TextInput, TextInputProps, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { colors, radius, fontFamily } from '../theme';

export type InputVariant = 'default' | 'onCard' | 'numeric';

export type InputProps = TextInputProps & {
  variant?: InputVariant;
  containerStyle?: StyleProp<ViewStyle>;
};

export function Input({ variant = 'default', style, containerStyle, onFocus, onBlur, ...rest }: InputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <TextInput
      {...rest}
      onFocus={(e) => {
        setFocused(true);
        onFocus?.(e);
      }}
      onBlur={(e) => {
        setFocused(false);
        onBlur?.(e);
      }}
      placeholderTextColor={colors.mute}
      style={[
        styles.base,
        variant === 'onCard' && styles.onCard,
        variant === 'numeric' && styles.numeric,
        focused && styles.focused,
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 14,
    paddingHorizontal: 15,
    paddingVertical: 15,
    fontFamily: fontFamily.outfitMedium,
    fontSize: 16,
    color: colors.ink,
  },
  onCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingVertical: 13,
    paddingHorizontal: 14,
  },
  numeric: {
    width: 92,
    textAlign: 'center',
    fontFamily: fontFamily.plexMonoRegular,
  },
  focused: {
    borderColor: colors.primary700,
  },
});
