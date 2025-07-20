# Componente <Ionicons> en el Proyecto

## ¿De dónde viene?
- **Origen:** `@expo/vector-icons` (paquete de Expo)
- **Importación:**
  ```typescript
  import { Ionicons } from '@expo/vector-icons';
  ```

## ¿Qué hace?
- Permite renderizar iconos de la librería Ionicons en la app.
- Props: `name`, `size`, `color`, `style`.

## ¿Cómo se usa?
```tsx
<Ionicons name="musical-notes" size={32} color="#004aad" />
```

## Ejemplo de uso en el proyecto
```tsx
<Ionicons name="notifications-outline" size={24} color="#ffffff" />
```

## ¿Por qué se eligió?
- Proporciona una amplia variedad de iconos modernos y consistentes.
- Integración sencilla con Expo y React Native.
- Alternativas: `react-native-vector-icons` (más genérico), imágenes personalizadas (menos flexible). 