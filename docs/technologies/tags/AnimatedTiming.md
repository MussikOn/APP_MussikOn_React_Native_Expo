# Uso de Animated.timing en el Proyecto

## ¿De dónde viene?
- **Origen:** `react-native` (API Animated)
- **Importación:**
  ```typescript
  import { Animated } from 'react-native';
  ```

## ¿Qué hace?
- Permite crear animaciones temporizadas (timing) para valores animados.
- Props: `toValue`, `duration`, `easing`, `useNativeDriver`, etc.

## ¿Cómo se usa?
```tsx
Animated.timing(fadeAnim, {
  toValue: 1,
  duration: 1000,
  easing: Easing.out(Easing.cubic),
  useNativeDriver: true,
}).start();
```

## Ejemplo de uso en el proyecto
```tsx
Animated.timing(fadeAnim, {
  toValue: 1,
  duration: 1000,
  easing: Easing.out(Easing.cubic),
  useNativeDriver: true,
}).start();
```

## ¿Por qué se eligió?
- Permite animaciones controladas por tiempo.
- Alternativas: `Animated.spring` (para animaciones de resorte), librerías externas para animaciones más complejas. 