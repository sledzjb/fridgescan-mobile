import React from 'react';
import { Pressable, View, StyleSheet } from 'react-native';
import { AppText } from './AppText';
import { colors, fontFamily } from '../theme';
import { stepForUnit, formatQuantity, Unit } from '../utils/quantity';

export type StepperProps = {
  value: number;
  unit: Unit;
  onChange: (value: number) => void;
  disabled?: boolean;
};

export function Stepper({ value, unit, onChange, disabled }: StepperProps) {
  const step = stepForUnit(unit);

  const decrement = () => onChange(Math.max(0, Math.round((value - step) * 100) / 100));
  const increment = () => onChange(Math.round((value + step) * 100) / 100);

  return (
    <View style={styles.row}>
      <Pressable
        onPress={decrement}
        disabled={disabled || value <= 0}
        style={[styles.square, (disabled || value <= 0) && styles.squareDisabled]}
      >
        <AppText style={styles.sign}>−</AppText>
      </Pressable>
      <AppText style={styles.value}>{formatQuantity(value, unit)}</AppText>
      <Pressable onPress={increment} disabled={disabled} style={[styles.square, disabled && styles.squareDisabled]}>
        <AppText style={styles.sign}>+</AppText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  square: {
    width: 30,
    height: 30,
    borderRadius: 9,
    backgroundColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  squareDisabled: {
    opacity: 0.5,
  },
  sign: {
    fontFamily: fontFamily.outfitMedium,
    fontSize: 16,
    color: colors.ink,
  },
  value: {
    fontFamily: fontFamily.plexMonoRegular,
    fontSize: 12.5,
    color: colors.ink,
    minWidth: 44,
    textAlign: 'center',
  },
});
