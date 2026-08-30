import { TextStyle } from 'react-native';
import { fontFamily } from './fonts';

type TypographyToken = TextStyle & { fontFamily: string };

// Rozmiary, wagi, line-height i letter-spacing 1:1 z tabeli typografii w README.
// line-height i letter-spacing przeliczone z wartości em/multiplier na px.
export const typography = {
  display: {
    fontFamily: fontFamily.outfitSemiBold,
    fontSize: 40,
    lineHeight: 43,
    letterSpacing: -1.2,
  },
  h1: {
    fontFamily: fontFamily.outfitSemiBold,
    fontSize: 27,
    lineHeight: 31,
    letterSpacing: -0.54,
  },
  h2: {
    fontFamily: fontFamily.outfitSemiBold,
    fontSize: 23,
    lineHeight: 27,
    letterSpacing: -0.46,
  },
  h3: {
    fontFamily: fontFamily.outfitSemiBold,
    fontSize: 17,
    lineHeight: 21,
    letterSpacing: 0,
  },
  bodyL: {
    fontFamily: fontFamily.outfitRegular,
    fontSize: 15,
    lineHeight: 23,
    letterSpacing: 0,
  },
  body: {
    fontFamily: fontFamily.outfitRegular,
    fontSize: 14,
    lineHeight: 21,
    letterSpacing: 0,
  },
  label: {
    fontFamily: fontFamily.outfitSemiBold,
    fontSize: 14.5,
    lineHeight: 17,
    letterSpacing: 0,
  },
  button: {
    fontFamily: fontFamily.outfitSemiBold,
    fontSize: 15.5,
    lineHeight: 19,
    letterSpacing: 0,
  },
  caption: {
    fontFamily: fontFamily.outfitRegular,
    fontSize: 12.5,
    lineHeight: 18,
    letterSpacing: 0,
  },
  kicker: {
    fontFamily: fontFamily.plexMonoMedium,
    fontSize: 11,
    lineHeight: 11,
    letterSpacing: 1.54,
    textTransform: 'uppercase',
  },
  meta: {
    fontFamily: fontFamily.plexMonoRegular,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 0,
  },
} satisfies Record<string, TypographyToken>;

export type TypographyVariant = keyof typeof typography;
