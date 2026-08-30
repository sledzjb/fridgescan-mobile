export const spacing = {
  space1: 4,
  space2: 8,
  space3: 12,
  space4: 16,
  space5: 20,
  space6: 24,
  space7: 32,
  space8: 44,
  space9: 64,
} as const;

// Padding poziomy ekranu: 20 (formularze i onboarding: 24–26)
export const screenPaddingHorizontal = 20;
export const formPaddingHorizontal = 24;
// Górny padding treści: 64 (zastąp safe area + 20). Dolny: 24.
export const contentPaddingTop = 64;
export const contentPaddingBottom = 24;

export type SpacingToken = keyof typeof spacing;
