import { useTheme } from '@contexts/ThemeContext';
import { themeConstants, legacyColors } from '@theme/constants';

/**
 * Hook that provides easy access to theme colors and constants
 * This replaces the old hardcoded colors from Styles.ts
 */
export const useAppTheme = () => {
  const { theme, mode, setMode, toggleTheme, isDark } = useTheme();

  // Get current theme colors
  const colors = theme.colors;
  const gradients = theme.gradients;
  const shadows = theme.shadows;

  // Legacy color mappings for backward compatibility
  const legacy = {
    // Old color names from Styles.ts
    color_primary: colors.primary[500],
    color_primary_gradient: `rgba(${colors.primary[500]}, 0.6)`,
    color_secondary: colors.secondary[500],
    color_white: colors.text.inverse,
    color_success: colors.success[500],
    color_danger: colors.error[500],
    color_info: colors.info[500],
    
    // Button colors
    btn_primary: colors.primary[500],
    btn_secondary: colors.secondary[500],
    btn_white: colors.text.inverse,
    btn_success: colors.success[500],
    btn_danger: colors.error[500],
    btn_info: colors.info[500],
    
    // Background colors
    bg_primary: colors.primary[500],
    bg_secondary: colors.secondary[500],
    bg_white: colors.text.inverse,
    bg_dark: colors.background.primary,
    bg_success: colors.success[500],
    bg_danger: colors.error[500],
    bg_info: colors.info[500],
    
    // Border colors
    border_color_primary: colors.primary[500],
    border_color_secondary: colors.secondary[500],
    border_color_white: colors.text.inverse,
    border_color_success: colors.success[500],
    border_color_danger: colors.error[500],
    border_color_info: colors.info[500],
    
    // Text colors
    text_primary: colors.text.primary,
    text_secondary: colors.text.secondary,
    text_white: colors.text.inverse,
    text_success: colors.success[500],
    text_danger: colors.error[500],
    text_info: colors.info[500],
  };

  return {
    // Current theme
    theme,
    mode,
    setMode,
    toggleTheme,
    isDark,
    
    // Colors
    colors,
    gradients,
    shadows,
    
    // Legacy colors for backward compatibility
    legacy,
    
    // Theme constants
    constants: themeConstants,
  };
};

/**
 * Hook that provides only the legacy color names for backward compatibility
 * Use this when migrating old components that use the old color names
 */
export const useLegacyColors = () => {
  const { theme } = useTheme();
  const colors = theme.colors;

  return {
    // Old color names from Styles.ts
    color_primary: colors.primary[500],
    color_primary_gradient: `rgba(${colors.primary[500]}, 0.6)`,
    color_secondary: colors.secondary[500],
    color_white: colors.text.inverse,
    color_success: colors.success[500],
    color_danger: colors.error[500],
    color_info: colors.info[500],
    
    // Button colors
    btn_primary: colors.primary[500],
    btn_secondary: colors.secondary[500],
    btn_white: colors.text.inverse,
    btn_success: colors.success[500],
    btn_danger: colors.error[500],
    btn_info: colors.info[500],
    
    // Background colors
    bg_primary: colors.primary[500],
    bg_secondary: colors.secondary[500],
    bg_white: colors.text.inverse,
    bg_dark: colors.background.primary,
    bg_success: colors.success[500],
    bg_danger: colors.error[500],
    bg_info: colors.info[500],
    
    // Border colors
    border_color_primary: colors.primary[500],
    border_color_secondary: colors.secondary[500],
    border_color_white: colors.text.inverse,
    border_color_success: colors.success[500],
    border_color_danger: colors.error[500],
    border_color_info: colors.info[500],
    
    // Text colors
    text_primary: colors.text.primary,
    text_secondary: colors.text.secondary,
    text_white: colors.text.inverse,
    text_success: colors.success[500],
    text_danger: colors.error[500],
    text_info: colors.info[500],
  };
}; 