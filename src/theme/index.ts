export { colors, gradients, shadows } from './colors';
export { typography, textStyles } from './typography';
export { spacing, layout, borderRadius, zIndex } from './spacing';

// Theme object for easy access
export const theme = {
  colors: require('./colors').colors,
  gradients: require('./colors').gradients,
  shadows: require('./colors').shadows,
  typography: require('./typography').typography,
  textStyles: require('./typography').textStyles,
  spacing: require('./spacing').spacing,
  layout: require('./spacing').layout,
  borderRadius: require('./spacing').borderRadius,
  zIndex: require('./spacing').zIndex,
};

export default theme; 