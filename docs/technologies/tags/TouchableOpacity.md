# Etiqueta <TouchableOpacity> en React Native

## ¿De dónde viene?
- **Origen:** `react-native`
- **Importación:**
  ```typescript
  import { TouchableOpacity } from 'react-native';
  ```

## ¿Qué hace?
- Componente para crear áreas táctiles con feedback de opacidad al presionar.
- Usado para botones, enlaces y cualquier acción interactiva.

## ¿Cómo se usa?
```tsx
<TouchableOpacity onPress={handlePress} style={styles.button}>
  <Text>Presionar</Text>
</TouchableOpacity>
```

## Ejemplo de uso en el proyecto
```tsx
<TouchableOpacity style={[s.btn, s.btn_primary]} onPress={() => navigation.navigate("Home")}>...</TouchableOpacity>
```

## ¿Por qué se eligió?
- Proporciona feedback visual nativo.
- Es ligero y fácil de usar.
- Alternativas: `Pressable` (más flexible, pero menos usado para casos simples), `TouchableHighlight` (con feedback diferente). 