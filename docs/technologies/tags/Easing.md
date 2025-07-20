# Uso de Easing en el Proyecto

## ¿De dónde viene?
- **Origen:** `react-native` (API Animated)
- **Importación:**
  ```typescript
  import { Easing } from 'react-native';
  ```

## ¿Qué hace?
- Permite definir funciones de aceleración/desaceleración para animaciones.
- Métodos: `Easing.linear`, `Easing.out`, `Easing.cubic`, etc.

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
- Permite animaciones más naturales y personalizadas.
- Alternativas: animaciones lineales (menos realistas), librerías externas para easing avanzado. 