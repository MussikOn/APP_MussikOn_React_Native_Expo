# 🎨 Theme System Migration Guide

## 📋 Overview

This guide explains how to migrate components from the old hardcoded color system to the new unified theme system that supports light and dark modes.

## 🔄 Migration Pattern

### Before (Old System)
```typescript
import { color_primary, text_primary, btn_primary } from '@styles/Styles';

const MyComponent = () => {
  return (
    <View style={{ backgroundColor: color_primary }}>
      <Text style={{ color: text_primary }}>Hello</Text>
      <TouchableOpacity style={{ backgroundColor: btn_primary }}>
        <Text>Button</Text>
      </TouchableOpacity>
    </View>
  );
};
```

### After (New Theme System)
```typescript
import { useLegacyColors } from '@hooks/useAppTheme';

const MyComponent = () => {
  const colors = useLegacyColors();
  
  return (
    <View style={{ backgroundColor: colors.color_primary }}>
      <Text style={{ color: colors.text_primary }}>Hello</Text>
      <TouchableOpacity style={{ backgroundColor: colors.btn_primary }}>
        <Text>Button</Text>
      </TouchableOpacity>
    </View>
  );
};
```

## 🛠️ Available Hooks

### 1. `useLegacyColors()` - For Backward Compatibility
Use this hook when migrating existing components that use the old color names:

```typescript
import { useLegacyColors } from '@hooks/useAppTheme';

const colors = useLegacyColors();

// Available legacy colors:
colors.color_primary        // Primary color
colors.color_secondary      // Secondary color
colors.color_white         // White color
colors.color_success       // Success color
colors.color_danger        // Danger color
colors.color_info          // Info color

// Button colors:
colors.btn_primary         // Primary button
colors.btn_secondary       // Secondary button
colors.btn_white          // White button
colors.btn_success        // Success button
colors.btn_danger         // Danger button
colors.btn_info           // Info button

// Background colors:
colors.bg_primary         // Primary background
colors.bg_secondary       // Secondary background
colors.bg_white          // White background
colors.bg_dark           // Dark background
colors.bg_success        // Success background
colors.bg_danger         // Danger background
colors.bg_info           // Info background

// Border colors:
colors.border_color_primary    // Primary border
colors.border_color_secondary  // Secondary border
colors.border_color_white     // White border
colors.border_color_success   // Success border
colors.border_color_danger    // Danger border
colors.border_color_info      // Info border

// Text colors:
colors.text_primary       // Primary text
colors.text_secondary     // Secondary text
colors.text_white        // White text
colors.text_success      // Success text
colors.text_danger       // Danger text
colors.text_info         // Info text
```

### 2. `useAppTheme()` - For Advanced Theme Usage
Use this hook for new components or when you need access to the full theme system:

```typescript
import { useAppTheme } from '@hooks/useAppTheme';

const { theme, colors, gradients, shadows, isDark, toggleTheme } = useAppTheme();

// Access theme colors:
colors.primary[500]       // Primary color
colors.secondary[500]     // Secondary color
colors.accent[500]        // Accent color
colors.success[500]       // Success color
colors.error[500]         // Error color
colors.warning[500]       // Warning color
colors.info[500]          // Info color

// Access background colors:
colors.background.primary // Primary background
colors.background.secondary // Secondary background
colors.background.card    // Card background

// Access text colors:
colors.text.primary       // Primary text
colors.text.secondary     // Secondary text
colors.text.tertiary      // Tertiary text
colors.text.inverse       // Inverse text

// Access gradients:
gradients.primary         // Primary gradient
gradients.secondary       // Secondary gradient
gradients.accent          // Accent gradient

// Access shadows:
shadows.small             // Small shadow
shadows.medium            // Medium shadow
shadows.large             // Large shadow
shadows.glow              // Glow shadow
```

## 📝 Migration Steps

### Step 1: Replace Imports
```typescript
// ❌ Old way
import { color_primary, text_primary, btn_primary } from '@styles/Styles';

// ✅ New way
import { useLegacyColors } from '@hooks/useAppTheme';
```

### Step 2: Add Hook to Component
```typescript
const MyComponent = () => {
  const colors = useLegacyColors(); // Add this line
  
  // ... rest of component
};
```

### Step 3: Replace Hardcoded Colors
```typescript
// ❌ Old way
<View style={{ backgroundColor: color_primary }}>
  <Text style={{ color: text_primary }}>Hello</Text>
</View>

// ✅ New way
<View style={{ backgroundColor: colors.color_primary }}>
  <Text style={{ color: colors.text_primary }}>Hello</Text>
</View>
```

### Step 4: Update StyleSheet (if needed)
```typescript
// ❌ Old way
const styles = StyleSheet.create({
  container: {
    backgroundColor: color_primary,
    borderColor: border_color_primary,
  },
  text: {
    color: text_primary,
  },
});

// ✅ New way
const MyComponent = () => {
  const colors = useLegacyColors();
  
  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.color_primary,
      borderColor: colors.border_color_primary,
    },
    text: {
      color: colors.text_primary,
    },
  });
  
  // ... rest of component
};
```

## 🎯 Components That Need Migration

The following components still need to be migrated:

1. **DateTimeSelector.tsx** ✅ (Already migrated)
2. **BottomMenu.tsx**
3. **FormAlert.tsx**
4. **SocketConnectButton.tsx**
5. **AlertModal.tsx**
6. **LocationPickerModal.tsx**
7. **RequestMusicianScreen.tsx**
8. **HomePage.tsx**
9. **StepBudget.tsx**
10. **StepDetails.tsx**
11. **StepLocation.tsx**
12. **StepSummary.tsx**
13. **Stepper.tsx**
14. **DataStepsShareMusicians.tsx**

## 🔧 Migration Checklist

For each component:

- [ ] Replace imports from `@styles/Styles` with `useLegacyColors` hook
- [ ] Add `const colors = useLegacyColors();` to component
- [ ] Replace all hardcoded color references with `colors.colorName`
- [ ] Test component in both light and dark modes
- [ ] Verify all colors are properly themed
- [ ] Remove unused imports from `@styles/Styles`

## 🎨 Theme Features

### Light Mode Colors
- Primary: `#667eea` (Blue)
- Secondary: `#d946ef` (Purple)
- Accent: `#f97316` (Orange)
- Success: `#22c55e` (Green)
- Error: `#ef4444` (Red)
- Warning: `#f59e0b` (Yellow)
- Info: `#0ea5e9` (Cyan)

### Dark Mode Colors
- Same color palette but with dark backgrounds
- Text colors automatically adjust for contrast
- Background colors switch to dark variants

### Gradients
- Primary: `['#667eea', '#764ba2']`
- Secondary: `['#f093fb', '#f5576c']`
- Accent: `['#4facfe', '#00f2fe']`
- Sunset: `['#fa709a', '#fee140']`
- Ocean: `['#667eea', '#764ba2', '#f093fb']`

### Shadows
- Small: Subtle elevation
- Medium: Standard elevation
- Large: Prominent elevation
- Glow: Colored glow effect

## 🚀 Benefits of the New System

1. **Consistent Colors**: All components use the same color palette
2. **Theme Support**: Automatic light/dark mode switching
3. **Maintainable**: Centralized color management
4. **Type Safe**: TypeScript support for all colors
5. **Extensible**: Easy to add new themes or colors
6. **Performance**: Colors are computed once and cached

## 🔍 Testing

After migrating a component:

1. Test in light mode
2. Test in dark mode
3. Verify all colors are visible and accessible
4. Check that the component looks consistent with the rest of the app
5. Test any interactive states (pressed, disabled, etc.)

## 📚 Additional Resources

- `src/contexts/ThemeContext.tsx` - Theme context implementation
- `src/theme/colors.ts` - Color definitions
- `src/theme/constants.ts` - Theme constants
- `src/hooks/useAppTheme.ts` - Theme hooks
- `src/styles/Styles.ts` - Legacy styles (deprecated)

## 🆘 Troubleshooting

### Common Issues

1. **Colors not updating**: Make sure you're using the hook correctly
2. **Type errors**: Check that you're importing the correct hook
3. **Performance issues**: Colors are cached, so this shouldn't be an issue
4. **Missing colors**: Add new colors to the theme system, not to Styles.ts

### Getting Help

If you encounter issues during migration:

1. Check the existing migrated components for examples
2. Refer to the ThemeContext implementation
3. Test with both light and dark modes
4. Ensure all color references are updated 