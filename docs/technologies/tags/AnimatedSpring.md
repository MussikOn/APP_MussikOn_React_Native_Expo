# Uso de Animated.spring en el Proyecto

## ¿De dónde viene?
- **Origen:** `react-native` (API Animated)
- **Importación:**
  ```typescript
  import { Animated } from 'react-native';
  ```

## ¿Qué hace?
- Permite crear animaciones de tipo resorte (spring) para valores animados.
- Props: `toValue`, `tension`, `friction`, `useNativeDriver`, etc.

## ¿Cómo se usa?
```tsx
Animated.spring(scaleAnim, {
  toValue: 1,
  tension: 50,
  friction: 7,
  useNativeDriver: true,
}).start();
```

## Ejemplo de uso en el proyecto
```tsx
Animated.spring(scaleAnim, {
  toValue: 1,
  tension: 50,
  friction: 7,
  useNativeDriver: true,
}).start();
```

## ¿Por qué se eligió?
- Permite animaciones suaves y naturales.
- Alternativas: `Animated.timing` (para animaciones lineales), librerías externas para animaciones más complejas. 