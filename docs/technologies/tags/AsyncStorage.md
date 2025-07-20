# Uso de AsyncStorage en el Proyecto

## ¿De dónde viene?
- **Origen:** `@react-native-async-storage/async-storage` (dependencia externa)
- **Importación:**
  ```typescript
  import AsyncStorage from '@react-native-async-storage/async-storage';
  ```

## ¿Qué hace?
- Permite almacenar datos clave-valor de forma persistente en el dispositivo.
- Usado para guardar preferencias, tokens, configuraciones, etc.
- Métodos: `getItem`, `setItem`, `removeItem`, etc.

## ¿Cómo se usa?
```tsx
await AsyncStorage.setItem('user-language', 'es');
const lang = await AsyncStorage.getItem('user-language');
```

## Ejemplo de uso en el proyecto
```tsx
const savedLanguage = await AsyncStorage.getItem('user-language');
```

## ¿Por qué se eligió?
- Es el estándar para almacenamiento simple en React Native.
- Alternativas: SecureStore (para datos sensibles), MMKV (más rápido, pero menos estándar). 