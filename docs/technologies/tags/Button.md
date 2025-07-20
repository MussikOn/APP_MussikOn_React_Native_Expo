# Componente <Button> en el Proyecto

## ¿De dónde viene?
- **Origen:** Componente personalizado del proyecto (`src/components/ui/Button.tsx`)
- **Inspiración:** Botón estándar de UI, adaptado a estilos propios

## ¿Qué hace?
- Renderiza un botón con variantes: primary, secondary, outline, success, danger.
- Props: `title`, `onPress`, `type`, `loading`, `disabled`, `icon`, `iconPosition`, `style`, `textStyle`.

## ¿Cómo se usa?
```tsx
<Button title="Guardar" onPress={handleSave} type="primary" />
```

## Ejemplo de uso en el proyecto
```tsx
<Button
  title="Iniciar Sesión"
  onPress={handleLogin}
  type="primary"
  loading={isLoading}
  icon="log-in-outline"
/>
```

## ¿Por qué se eligió?
- Permite personalización total de estilos y comportamiento.
- Facilita la reutilización y consistencia visual.
- Alternativas: `<TouchableOpacity>` directo, o librerías externas como `react-native-paper` Button. 