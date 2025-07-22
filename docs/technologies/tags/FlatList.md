# Etiqueta <FlatList> en React Native

## ¿De dónde viene?
- **Origen:** `react-native`
- **Importación:**
  ```typescript
  import { FlatList } from 'react-native';
  ```

## ¿Qué hace?
- Renderiza listas grandes de datos de forma eficiente y optimizada.
- Soporta scroll, renderizado perezoso, y manejo de grandes volúmenes de datos.

## ¿Cómo se usa?
```tsx
<FlatList
  data={data}
  keyExtractor={item => item.id}
  renderItem={({ item }) => <Text>{item.nombre}</Text>}
/>
```

## Ejemplo de uso en el proyecto
```tsx
<FlatList
  data={users}
  keyExtractor={(item) => item.name?.toString() || item.userEmail}
  renderItem={({ item }) => (
    <View style={styles.card}>
      <Text style={styles.text}>{item.name}</Text>
    </View>
  )}
/>
```

## ¿Por qué se eligió?
- Es la mejor opción para listas grandes en React Native.
- Alternativas: `ScrollView` (no recomendado para listas largas), `SectionList` (listas agrupadas). 