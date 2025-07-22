# Etiqueta <KeyboardAvoidingView> en React Native

## ¿De dónde viene?
- **Origen:** `react-native`
- **Importación:**
  ```typescript
  import { KeyboardAvoidingView } from 'react-native';
  ```

## ¿Qué hace?
- Ajusta automáticamente el layout para evitar que el teclado cubra los campos de entrada.
- Props: `behavior`, `style`, etc.

## ¿Cómo se usa?
```tsx
<KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
  <TextInput ... />
</KeyboardAvoidingView>
```

## Ejemplo de uso en el proyecto
```tsx
<KeyboardAvoidingView
  style={{ flex: 1, backgroundColor: color_white }}
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
>
  ...
</KeyboardAvoidingView>
```

## ¿Por qué se eligió?
- Mejora la experiencia de usuario en formularios.
- Alternativas: manejo manual del teclado, pero esto es más propenso a errores. 