# Uso de Platform en React Native

## ¿De dónde viene?
- **Origen:** `react-native`
- **Importación:**
  ```typescript
  import { Platform } from 'react-native';
  ```

## ¿Qué hace?
- Permite detectar la plataforma (iOS, Android, Web) y condicionar el comportamiento o estilos.
- Props: `Platform.OS`, `Platform.select`, etc.

## ¿Cómo se usa?
```tsx
if (Platform.OS === 'ios') {
  // lógica específica para iOS
}
```

## Ejemplo de uso en el proyecto
```tsx
behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
```

## ¿Por qué se eligió?
- Permite adaptar la app a cada plataforma.
- Alternativas: lógica manual, pero esto es más propenso a errores y menos mantenible. 