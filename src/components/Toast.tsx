import React, { useEffect } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Check } from 'lucide-react-native';
import { AppText } from './AppText';
import { colors, spacing, fontFamily } from '../theme';

const AUTO_HIDE_MS = 2400;

export type ToastProps = {
  visible: boolean;
  message: string;
  actionLabel?: string;
  onActionPress?: () => void;
  onHide: () => void;
};

export function Toast({ visible, message, actionLabel, onActionPress, onHide }: ToastProps) {
  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(onHide, AUTO_HIDE_MS);
    return () => clearTimeout(timer);
  }, [visible, message, onHide]);

  if (!visible) return null;

  return (
    <View style={styles.toast}>
      <Check size={18} color={colors.white} />
      <AppText variant="body" color={colors.white} style={styles.message} numberOfLines={2}>
        {message}
      </AppText>
      {actionLabel && (
        <Pressable onPress={onActionPress}>
          <AppText style={styles.action} color={colors.secondary300}>
            {actionLabel}
          </AppText>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 96,
    backgroundColor: colors.ink,
    borderRadius: 15,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.space2,
  },
  message: {
    flex: 1,
    fontSize: 13.5,
  },
  action: {
    fontSize: 12.5,
    fontFamily: fontFamily.outfitMedium,
  },
});
