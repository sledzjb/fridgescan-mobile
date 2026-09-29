import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Check } from 'lucide-react-native';
import { colors } from '../theme';

export type CheckboxProps = {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
};

export function Checkbox({ value, onValueChange, disabled }: CheckboxProps) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked: value, disabled }}
      onPress={() => !disabled && onValueChange(!value)}
      disabled={disabled}
      style={[styles.base, value ? styles.checked : styles.unchecked, disabled && styles.disabled]}
    >
      {value && <Check size={12} strokeWidth={3} color={colors.onPrimary} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    width: 21,
    height: 21,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unchecked: {
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: 'transparent',
  },
  checked: {
    borderWidth: 1.5,
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  disabled: {
    opacity: 0.5,
  },
});
