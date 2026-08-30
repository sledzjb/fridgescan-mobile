import React from 'react';
import { Pressable, StyleSheet, ViewStyle, StyleProp, GestureResponderEvent } from 'react-native';
import { AppText } from './AppText';
import { colors, alpha, radius, ctaRadius, spacing } from '../theme';

export type ButtonVariant = 'primary' | 'secondary' | 'accentAction' | 'outline' | 'tertiary';

export type ButtonProps = {
  label: string;
  onPress?: (event: GestureResponderEvent) => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  /** Odwraca primary/outline dla ciemnych teł (skan, brak zgody na kamerę). */
  inverted?: boolean;
  icon?: React.ReactNode;
  /** Nadpisuje domyślny kolor tekstu wariantu (np. "Usuń" w secondary700 na outline). */
  textColor?: string;
  style?: StyleProp<ViewStyle>;
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  inverted = false,
  icon,
  textColor,
  style,
}: ButtonProps) {
  const { container, text } = getVariantStyle(variant, disabled, inverted);
  const resolvedColor = disabled ? text.color : textColor ?? text.color;

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        container,
        pressed && !disabled && styles.pressed,
        style,
      ]}
    >
      {icon}
      <AppText variant="button" color={resolvedColor as string} style={[text, icon ? styles.textWithIcon : undefined]}>
        {label}
      </AppText>
    </Pressable>
  );
}

function getVariantStyle(variant: ButtonVariant, disabled: boolean, inverted: boolean) {
  if (disabled) {
    return {
      container: { backgroundColor: colors.line, borderRadius: ctaRadius, paddingVertical: 16 },
      text: { color: colors.mute },
    };
  }

  switch (variant) {
    case 'primary':
      return inverted
        ? {
            container: { backgroundColor: colors.white, borderRadius: ctaRadius, paddingVertical: 16 },
            text: { color: colors.accent900 },
          }
        : {
            container: { backgroundColor: colors.primary700, borderRadius: ctaRadius, paddingVertical: 16 },
            text: { color: colors.white },
          };
    case 'secondary':
      return {
        container: { backgroundColor: colors.ink, borderRadius: ctaRadius, paddingVertical: 16 },
        text: { color: colors.white },
      };
    case 'accentAction':
      return {
        container: { backgroundColor: colors.secondary500, borderRadius: radius.lg, paddingVertical: 15 },
        text: { color: colors.white, fontSize: 15 },
      };
    case 'outline':
      return inverted
        ? {
            container: {
              backgroundColor: 'transparent',
              borderRadius: radius.lg,
              paddingVertical: 15,
              borderWidth: 1,
              borderColor: alpha.whiteOutlineBorder,
            },
            text: { color: colors.white, fontSize: 14.5 },
          }
        : {
            container: {
              backgroundColor: 'transparent',
              borderRadius: radius.lg,
              paddingVertical: 15,
              borderWidth: 1,
              borderColor: colors.line,
            },
            text: { color: colors.ink, fontSize: 14.5 },
          };
    case 'tertiary':
      return {
        container: { backgroundColor: 'transparent', paddingVertical: 14, minHeight: 44 },
        text: { color: colors.primary700, fontSize: 14.5 },
      };
  }
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.space4,
  },
  pressed: {
    opacity: 0.85,
  },
  textWithIcon: {
    marginLeft: spacing.space2,
  },
});
