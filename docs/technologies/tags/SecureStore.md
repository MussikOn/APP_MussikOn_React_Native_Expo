# Uso de SecureStore en el Proyecto

## ¿De dónde viene?
- **Origen:** `expo-secure-store` (paquete de Expo)
- **Importación:**
  ```typescript
  import * as SecureStore from 'expo-secure-store';
  ```

## ¿Qué hace?
- Permite almacenar datos sensibles (tokens, contraseñas) de forma segura y cifrada en el dispositivo.
- Métodos: `setItemAsync`, `getItemAsync`, `deleteItemAsync`.

## ¿Cómo se usa?
```tsx
await SecureStore.setItemAsync('token', token);
const token = await SecureStore.getItemAsync('token');
await SecureStore.deleteItemAsync('token');
```

## Ejemplo de uso en el proyecto
```tsx
await SecureStore.setItemAsync('token', token, { keychainAccessible: SecureStore.WHEN_UNLOCKED });
```

## ¿Por qué se eligió?
- Es el estándar para almacenamiento seguro en Expo/React Native.
- Alternativas: AsyncStorage (no cifrado), Keychain/Keystore nativos (más complejos de usar). 