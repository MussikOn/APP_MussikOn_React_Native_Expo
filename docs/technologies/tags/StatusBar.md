# Componente <StatusBar> en el Proyecto

## ¿De dónde viene?
- **Origen:** `expo-status-bar` (paquete de Expo)
- **Importación:**
  ```typescript
  import { StatusBar } from 'expo-status-bar';
  ```

## ¿Qué hace?
- Permite controlar el color, visibilidad y estilo de la barra de estado del sistema (iOS/Android).
- Props: `style`, `backgroundColor`, `translucent`, etc.

## ¿Cómo se usa?
```tsx
<StatusBar style="light" backgroundColor="transparent" translucent />
```

## Ejemplo de uso en el proyecto
```tsx
<StatusBar style="light" backgroundColor="transparent" translucent />
```

## ¿Por qué se eligió?
- Permite personalizar la experiencia visual de la app.
- Alternativas: `StatusBar` de React Native (menos integración con Expo). 