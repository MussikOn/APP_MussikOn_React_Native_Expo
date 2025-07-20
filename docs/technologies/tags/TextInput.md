# Etiqueta <TextInput> en React Native

## ¿De dónde viene?
- **Origen:** `react-native`
- **Importación:**
  ```typescript
  import { TextInput } from 'react-native';
  ```

## ¿Qué hace?
- Permite la entrada de texto por parte del usuario.
- Soporta múltiples props: `value`, `onChangeText`, `secureTextEntry`, `keyboardType`, `placeholder`, etc.
- Puede ser usado para formularios, búsqueda, contraseñas, etc.

## ¿Cómo se usa?
```tsx
<TextInput
  value={text}
  onChangeText={setText}
  placeholder="Escribe aquí"
  style={{ borderWidth: 1, borderColor: '#ccc', padding: 8 }}
/>
```

## Ejemplo de uso en el proyecto
```tsx
<TextInput
  style={[s.input_register, emailError && { borderColor: 'red' }]}
  placeholder={t('login.email')}
  value={email}
  onChangeText={setEmail}
  keyboardType="email-address"
  autoCapitalize="none"
  editable={!loading}
/>
```

## ¿Por qué se eligió?
- Es el estándar para entrada de texto en React Native.
- Permite control total sobre el input y validaciones.
- Alternativas: `Input` personalizado (usado para estilos avanzados), pero internamente usa `<TextInput>`. 