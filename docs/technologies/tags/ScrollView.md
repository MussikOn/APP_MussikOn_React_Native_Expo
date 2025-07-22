# Etiqueta <ScrollView> en React Native

## ¿De dónde viene?
- **Origen:** `react-native`
- **Importación:**
  ```typescript
  import { ScrollView } from 'react-native';
  ```

## ¿Qué hace?
- Permite crear contenedores con scroll vertical u horizontal.
- Útil para listas cortas, formularios largos o contenido que excede la pantalla.

## ¿Cómo se usa?
```tsx
<ScrollView style={{ flex: 1 }}>
  <Text>Elemento 1</Text>
  <Text>Elemento 2</Text>
</ScrollView>
```

## Ejemplo de uso en el proyecto
```tsx
<ScrollView style={[s.container_child_scrollView]}>...</ScrollView>
```

## ¿Por qué se eligió?
- Es el estándar para scroll en React Native.
- Alternativas: `FlatList` (para listas grandes y optimizadas), `SectionList` (listas agrupadas). 