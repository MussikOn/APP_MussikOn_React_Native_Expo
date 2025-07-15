export const spacing = {
  // Base spacing units
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

// Spacing presets for common use cases
export const layout = {
  // Container spacing
  container: {
    padding: spacing.md,
    margin: spacing.sm,
  },
  
  // Section spacing
  section: {
    marginVertical: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  
  // Card spacing
  card: {
    padding: spacing.md,
    margin: spacing.sm,
    borderRadius: 12,
  },
  
  // Button spacing
  button: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    marginVertical: spacing.xs,
  },
  
  // Input spacing
  input: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    marginVertical: spacing.xs,
  },
  
  // List item spacing
  listItem: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  
  // Header spacing
  header: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  
  // Footer spacing
  footer: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  
  // Modal spacing
  modal: {
    padding: spacing.lg,
    margin: spacing.md,
  },
  
  // Screen spacing
  screen: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
  },
};

// Border radius presets
export const borderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  '3xl': 24,
  full: 9999,
};

// Z-index presets
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

export default spacing; 