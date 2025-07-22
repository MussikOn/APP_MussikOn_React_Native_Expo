# Etiqueta <SectionList> en React Native

## ¿De dónde viene?
- **Origen:** `react-native`
- **Importación:**
  ```typescript
  import { SectionList } from 'react-native';
  ```

## ¿Qué hace?
- Renderiza listas agrupadas por secciones, optimizadas para grandes volúmenes de datos.
- Props: `sections`, `renderItem`, `renderSectionHeader`, `keyExtractor`, etc.

## ¿Cómo se usa?
```tsx
<SectionList
  sections={DATA}
  keyExtractor={(item, index) => item + index}
  renderItem={({ item }) => <Text>{item}</Text>}
  renderSectionHeader={({ section: { title } }) => (
    <Text style={{ fontWeight: 'bold' }}>{title}</Text>
  )}
/>
```

## Ejemplo de uso en el proyecto
- (Agregar ejemplo si se encuentra en el código)

## ¿Por qué se eligió?
- Es el estándar para listas agrupadas en React Native.
- Alternativas: `FlatList` (no soporta secciones), `ScrollView` (no recomendado para listas grandes). 