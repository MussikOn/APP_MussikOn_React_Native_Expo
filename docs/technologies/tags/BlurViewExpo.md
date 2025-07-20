# Componente <BlurView> (expo-blur) en el Proyecto

## ¿De dónde viene?
- **Origen:** `expo-blur` (paquete de Expo)
- **Importación:**
  ```typescript
  import { BlurView } from 'expo-blur';
  ```

## ¿Qué hace?
- Permite aplicar un efecto de desenfoque (blur) a vistas y fondos.
- Props: `intensity`, `tint`, `style`, etc.

## ¿Cómo se usa?
```tsx
<BlurView intensity={20} style={StyleSheet.absoluteFill} />
```

## Ejemplo de uso en el proyecto
```tsx
<BlurView intensity={20} style={StyleSheet.absoluteFill} />
```

## ¿Por qué se eligió?
- Permite efectos visuales modernos y nativos.
- Es el estándar en Expo para blur.
- Alternativas: `@react-native-community/blur` (para proyectos sin Expo), pero expo-blur es más sencillo y multiplataforma. 