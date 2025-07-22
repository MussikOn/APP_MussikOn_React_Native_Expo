# Componente <LinearGradient> en React Native

## ¿De dónde viene?
- **Origen:** `expo-linear-gradient` (paquete de Expo)
- **Importación:**
  ```typescript
  import { LinearGradient } from 'expo-linear-gradient';
  ```

## ¿Qué hace?
- Permite renderizar fondos y elementos con gradientes lineales de colores.
- Soporta props como `colors`, `start`, `end`, `style`, etc.

## ¿Cómo se usa?
```tsx
<LinearGradient
  colors={['#667eea', '#764ba2', '#f093fb']}
  style={{ flex: 1 }}
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 1 }}
>
  <Text>Contenido</Text>
</LinearGradient>
```

## Ejemplo de uso en el proyecto
```tsx
<LinearGradient
  colors={['#667eea', '#764ba2', '#f093fb']}
  style={StyleSheet.absoluteFill}
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 1 }}
/>
```

## ¿Por qué se eligió?
- Permite gradientes nativos y de alto rendimiento.
- Es el estándar en Expo para gradientes.
- Alternativas: `react-native-linear-gradient` (para proyectos sin Expo). 