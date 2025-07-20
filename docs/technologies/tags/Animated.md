# Etiqueta <Animated.View> y <Animated.Text> en React Native

## ¿De dónde viene?
- **Origen:** `react-native`
- **Importación:**
  ```typescript
  import { Animated } from 'react-native';
  ```

## ¿Qué hace?
- Permite animar componentes visuales (View, Text, etc.) usando la API de animaciones de React Native.
- Soporta animaciones de opacidad, posición, escala, color, etc.

## ¿Cómo se usa?
```tsx
const fadeAnim = useRef(new Animated.Value(0)).current;

useEffect(() => {
  Animated.timing(fadeAnim, {
    toValue: 1,
    duration: 1000,
    useNativeDriver: true,
  }).start();
}, []);

return (
  <Animated.View style={{ opacity: fadeAnim }}>
    <Text>Animado</Text>
  </Animated.View>
);
```

## Ejemplo de uso en el proyecto
```tsx
<Animated.View style={[s.header, { opacity: fadeAnim }]}>...</Animated.View>
```

## ¿Por qué se eligió?
- Permite animaciones fluidas y nativas.
- Es el estándar en React Native para animaciones.
- Alternativas: librerías externas como `react-native-reanimated` (para animaciones más complejas). 