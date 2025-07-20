# Componente <Input> en el Proyecto

## ¿De dónde viene?
- **Origen:** Componente personalizado (`src/components/ui/Input.tsx`)

## ¿Qué hace?
- Renderiza un campo de entrada de texto con validación, iconos y estilos avanzados.
- Props: `label`, `value`, `onChangeText`, `error`, `leftIcon`, `rightIcon`, `onRightIconPress`, `variant`, `containerStyle`, `labelStyle`, `inputStyle`, y todos los props de `TextInput`.

## ¿Cómo se usa?
```tsx
<Input label="Correo" value={email} onChangeText={setEmail} error={emailError} leftIcon="mail-outline" />
```

## Ejemplo de uso en el proyecto
```tsx
<Input
  label={t('login.email')}
  value={email}
  onChangeText={setEmail}
  error={emailError}
  leftIcon="mail-outline"
/>
```

## ¿Por qué se eligió?
- Permite validación y feedback visual inmediato.
- Facilita la reutilización y consistencia en formularios.
- Alternativas: `<TextInput>` directo, pero este componente agrega lógica y estilos propios. 