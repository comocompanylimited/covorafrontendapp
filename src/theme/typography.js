import { Platform } from 'react-native';

export const FontFamily = {
  // Serif - for headlines and luxury feel
  serif: Platform.select({ ios: 'Georgia', android: 'serif', default: 'Georgia' }),

  // Sans-serif - for body and UI
  sans: Platform.select({ ios: 'Helvetica Neue', android: 'sans-serif', default: 'System' }),
  sansLight: Platform.select({ ios: 'Helvetica Neue', android: 'sans-serif-light', default: 'System' }),
  sansMedium: Platform.select({ ios: 'Helvetica Neue', android: 'sans-serif-medium', default: 'System' }),
  sansBold: Platform.select({ ios: 'Helvetica Neue', android: 'sans-serif', default: 'System' }),
};

export const FontSize = {
  xs: 10,
  sm: 12,
  base: 14,
  md: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 28,
  '4xl': 32,
  '5xl': 38,
  '6xl': 46,
};

export const FontWeight = {
  thin: '100',
  light: '300',
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  heavy: '800',
  black: '900',
};

export const LineHeight = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.75,
  loose: 2,
};

export const LetterSpacing = {
  tighter: -0.5,
  tight: -0.25,
  normal: 0,
  wide: 0.5,
  wider: 1,
  widest: 2,
  ultra: 4,
};

// Pre-built text styles
export const TextStyles = {
  // Display
  displayLarge: {
    fontFamily: FontFamily.serif,
    fontSize: FontSize['6xl'],
    fontWeight: FontWeight.regular,
    letterSpacing: LetterSpacing.tight,
    lineHeight: FontSize['6xl'] * LineHeight.tight,
  },
  displayMedium: {
    fontFamily: FontFamily.serif,
    fontSize: FontSize['5xl'],
    fontWeight: FontWeight.regular,
    letterSpacing: LetterSpacing.tight,
    lineHeight: FontSize['5xl'] * LineHeight.tight,
  },
  displaySmall: {
    fontFamily: FontFamily.serif,
    fontSize: FontSize['4xl'],
    fontWeight: FontWeight.regular,
    letterSpacing: LetterSpacing.tight,
    lineHeight: FontSize['4xl'] * LineHeight.tight,
  },

  // Headlines
  h1: {
    fontFamily: FontFamily.serif,
    fontSize: FontSize['3xl'],
    fontWeight: FontWeight.regular,
    letterSpacing: LetterSpacing.tight,
    lineHeight: FontSize['3xl'] * LineHeight.tight,
  },
  h2: {
    fontFamily: FontFamily.serif,
    fontSize: FontSize['2xl'],
    fontWeight: FontWeight.regular,
    letterSpacing: LetterSpacing.tight,
    lineHeight: FontSize['2xl'] * LineHeight.tight,
  },
  h3: {
    fontFamily: FontFamily.serif,
    fontSize: FontSize.xl,
    fontWeight: FontWeight.regular,
    letterSpacing: LetterSpacing.normal,
    lineHeight: FontSize.xl * LineHeight.normal,
  },

  // Subtitles
  subtitle1: {
    fontFamily: FontFamily.sansMedium,
    fontSize: FontSize.md,
    fontWeight: FontWeight.medium,
    letterSpacing: LetterSpacing.wide,
    lineHeight: FontSize.md * LineHeight.normal,
  },
  subtitle2: {
    fontFamily: FontFamily.sansMedium,
    fontSize: FontSize.base,
    fontWeight: FontWeight.medium,
    letterSpacing: LetterSpacing.wider,
    lineHeight: FontSize.base * LineHeight.normal,
  },

  // Body
  body1: {
    fontFamily: FontFamily.sans,
    fontSize: FontSize.base,
    fontWeight: FontWeight.regular,
    letterSpacing: LetterSpacing.normal,
    lineHeight: FontSize.base * LineHeight.relaxed,
  },
  body2: {
    fontFamily: FontFamily.sans,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.regular,
    letterSpacing: LetterSpacing.normal,
    lineHeight: FontSize.sm * LineHeight.relaxed,
  },

  // Labels
  label: {
    fontFamily: FontFamily.sansMedium,
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
    letterSpacing: LetterSpacing.ultra,
    textTransform: 'uppercase',
    lineHeight: FontSize.xs * LineHeight.normal,
  },
  labelMd: {
    fontFamily: FontFamily.sansMedium,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    letterSpacing: LetterSpacing.widest,
    textTransform: 'uppercase',
    lineHeight: FontSize.sm * LineHeight.normal,
  },

  // Button
  button: {
    fontFamily: FontFamily.sansMedium,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    letterSpacing: LetterSpacing.widest,
    textTransform: 'uppercase',
  },
  buttonLg: {
    fontFamily: FontFamily.sansMedium,
    fontSize: FontSize.base,
    fontWeight: FontWeight.medium,
    letterSpacing: LetterSpacing.widest,
    textTransform: 'uppercase',
  },

  // Caption
  caption: {
    fontFamily: FontFamily.sans,
    fontSize: FontSize.xs,
    fontWeight: FontWeight.regular,
    letterSpacing: LetterSpacing.wide,
    lineHeight: FontSize.xs * LineHeight.relaxed,
  },

  // Price
  price: {
    fontFamily: FontFamily.sansMedium,
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    letterSpacing: LetterSpacing.normal,
  },
  priceLg: {
    fontFamily: FontFamily.sansMedium,
    fontSize: FontSize.xl,
    fontWeight: FontWeight.semibold,
    letterSpacing: LetterSpacing.normal,
  },

  // Logo / Brand
  brand: {
    fontFamily: FontFamily.serif,
    fontSize: FontSize['3xl'],
    fontWeight: FontWeight.regular,
    letterSpacing: LetterSpacing.ultra,
    textTransform: 'uppercase',
  },
};

export default TextStyles;
