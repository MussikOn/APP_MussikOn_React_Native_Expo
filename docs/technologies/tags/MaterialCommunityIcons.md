# Componente <MaterialCommunityIcons> en el Proyecto

## ¿De dónde viene?
- **Origen:** `@expo/vector-icons` (paquete de Expo)
- **Importación:**
  ```typescript
  import { MaterialCommunityIcons } from '@expo/vector-icons';
  ```

## ¿Qué hace?
- Permite renderizar iconos de la librería Material Community Icons en la app.
- Props: `name`, `size`, `color`, `style`.

## ¿Cómo se usa?
```tsx
<MaterialCommunityIcons name="guitar-electric" size={32} color="#004aad" />
```

## Ejemplo de uso en el proyecto
```tsx
<MaterialCommunityIcons name="guitar-electric" size={32} color="#004aad" />
```

## ¿Por qué se eligió?
- Proporciona iconos adicionales y específicos para música y utilidades.
- Alternativas: Ionicons, imágenes personalizadas. 