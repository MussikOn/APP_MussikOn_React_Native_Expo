import { colors, gradients, shadows } from './colors';

// Theme constants for easy access
export const themeConstants = {
  // Primary colors
  primary: colors.primary[500],
  primaryLight: colors.primary[100],
  primaryDark: colors.primary[700],
  
  // Secondary colors
  secondary: colors.secondary[900], // Negro puro
  secondaryLight: colors.secondary[50], // #f1f1f1
  secondaryDark: colors.secondary[700],
  
  // Accent colors
  accent: colors.accent[500],
  accentLight: colors.accent[100],
  accentDark: colors.accent[700],
  
  // Neutral colors
  neutral: colors.neutral[500],
  neutralLight: colors.neutral[100],
  neutralDark: colors.neutral[700],
  
  // Semantic colors
  success: colors.success[500],
  successLight: colors.success[100],
  successDark: colors.success[700],
  
  warning: colors.warning[500],
  warningLight: colors.warning[100],
  warningDark: colors.warning[700],
  
  error: colors.error[500],
  errorLight: colors.error[100],
  errorDark: colors.error[700],
  
  info: colors.primary[500],
  infoLight: colors.primary[100],
  infoDark: colors.primary[700],
  
  // Background colors
  background: colors.background.primary,
  backgroundSecondary: colors.background.secondary,
  backgroundTertiary: colors.background.tertiary,
  backgroundCard: colors.background.card,
  backgroundOverlay: colors.background.overlay,
  
  // Text colors
  textPrimary: colors.text.primary,
  textSecondary: colors.text.secondary,
  textTertiary: colors.text.tertiary,
  textInverse: colors.text.inverse,
  
  // Border colors
  borderPrimary: colors.border.primary,
  borderSecondary: colors.border.secondary,
  borderAccent: colors.border.accent,
  
  // Gradients
  gradients,
  
  // Shadows
  shadows,
};

// Legacy color mappings for backward compatibility
export const legacyColors = {
  // Old color names from Styles.ts
  color_primary: colors.primary[500],
  color_primary_gradient: `rgba(1, 74, 173, 0.6)`,
  color_secondary: colors.secondary[900], // Negro puro
  color_white: colors.text.inverse,
  color_success: colors.success[500],
  color_danger: colors.error[500],
  color_info: colors.primary[500],
  
  // Button colors
  btn_primary: colors.primary[500],
  btn_secondary: colors.secondary[900],
  btn_white: colors.text.inverse,
  btn_success: colors.success[500],
  btn_danger: colors.error[500],
  btn_info: colors.primary[500],
  
  // Background colors
  bg_primary: colors.primary[500],
  bg_secondary: colors.secondary[900],
  bg_white: colors.text.inverse,
  bg_dark: colors.secondary[900],
  bg_success: colors.success[500],
  bg_danger: colors.error[500],
  bg_info: colors.primary[500],
  
  // Border colors
  border_color_primary: colors.primary[500],
  border_color_secondary: colors.secondary[900],
  border_color_white: colors.text.inverse,
  border_color_success: colors.success[500],
  border_color_danger: colors.error[500],
  border_color_info: colors.primary[500],
  
  // Text colors
  text_primary: colors.text.primary,
  text_secondary: colors.text.secondary,
  text_white: colors.text.inverse,
  text_success: colors.success[500],
  text_danger: colors.error[500],
  text_info: colors.primary[500],
};

// Spacing constants
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
  '4xl': 96,
  '5xl': 128,
  '6xl': 192,
};

// Border radius constants
export const borderRadius = {
  none: 0,
  sm: 2,
  md: 4,
  lg: 8,
  xl: 12,
  '2xl': 16,
  '3xl': 24,
  full: 9999,
};

// Typography constants
export const typography = {
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
    '6xl': 60,
  },
  fontWeight: {
    thin: '100',
    extralight: '200',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },
  lineHeight: {
    none: 1,
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },
};

// Z-index constants
export const zIndex = {
  hide: -1,
  auto: 'auto',
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  skipLink: 1600,
  toast: 1700,
  tooltip: 1800,
};

// Layout constants
export const layout = {
  maxWidth: {
    none: 'none',
    xs: '20rem',
    sm: '24rem',
    md: '28rem',
    lg: '32rem',
    xl: '36rem',
    '2xl': '42rem',
    '3xl': '48rem',
    '4xl': '56rem',
    '5xl': '64rem',
    '6xl': '72rem',
    '7xl': '80rem',
    full: '100%',
    min: 'min-content',
    max: 'max-content',
    fit: 'fit-content',
  },
  minHeight: {
    0: 0,
    full: '100%',
    screen: '100vh',
    min: 'min-content',
    max: 'max-content',
    fit: 'fit-content',
  },
};

// Export all constants
export default {
  themeConstants,
  legacyColors,
  spacing,
  borderRadius,
  typography,
  zIndex,
  layout,
}; 