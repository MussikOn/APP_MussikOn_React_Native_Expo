# Etiqueta <Pressable> en React Native

## ¿De dónde viene?
- **Origen:** `react-native`
- **Importación:**
  ```typescript
  import { Pressable } from 'react-native';
  ```

## ¿Qué hace?
- Permite crear áreas táctiles con control total sobre los estados de interacción (pressed, hovered, focused).
- Más flexible que `TouchableOpacity` para animaciones y feedback personalizado.

## ¿Cómo se usa?
```tsx
<Pressable onPress={handlePress} style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
  <Text>Presionar</Text>
</Pressable>
```

## Ejemplo de uso en el proyecto
```tsx
<Pressable style={styles.iconButton} onPress={onLeftPress}>
  <Ionicons name={leftIcon} size={24} color={textColor} />
</Pressable>
```

## ¿Por qué se eligió?
- Permite animaciones y feedback más avanzados.
- Es el recomendado por React Native para nuevos desarrollos interactivos.
- Alternativas: `TouchableOpacity` (más simple), `TouchableHighlight`. 