import React from 'react';
import { ArrowLeft } from 'lucide-react-native';
import { colors } from '../theme';

/** Strzałka linku „wstecz” w nagłówku ekranu. */
export function BackArrow({ size = 16 }: { size?: number }) {
  return <ArrowLeft size={size} color={colors.textMuted} />;
}
