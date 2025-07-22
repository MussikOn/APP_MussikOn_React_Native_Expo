# Etiqueta <View> en React Native

## ¿De dónde viene?
- **Origen:** `react-native`
- **Importación:**
  ```typescript
  import { View } from 'react-native';
  ```

## ¿Qué hace?
- Es el contenedor principal para layout y agrupación de otros componentes.
- Similar a `<div>` en web, pero optimizado para móviles.
- Permite aplicar estilos, flexbox, y manejar eventos de usuario.

## ¿Cómo se usa?
```tsx
<View style={{ flex: 1, padding: 16 }}>
  <Text>Contenido</Text>
</View>
```

## Ejemplo de uso en el proyecto
```tsx
<View style={styles.container}>
  {children}
  <Text style={styles.title}>{t('home.names')}</Text>
</View>
```

## ¿Por qué se eligió?
- Es el estándar para layout en React Native.
- Permite flexibilidad y control total del diseño.
- Alternativas como `<div>` no existen en React Native. 