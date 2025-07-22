# Uso de expo-location en el Proyecto

## ¿De dónde viene?
- **Origen:** `expo-location` (paquete de Expo)
- **Importación:**
  ```typescript
  import * as Location from 'expo-location';
  ```

## ¿Qué hace?
- Permite acceder a la ubicación del dispositivo (GPS) y gestionar permisos de localización.
- Métodos: `getCurrentPositionAsync`, `requestForegroundPermissionsAsync`, etc.

## ¿Cómo se usa?
```tsx
const { status } = await Location.requestForegroundPermissionsAsync();
const location = await Location.getCurrentPositionAsync({});
```

## Ejemplo de uso en el proyecto
```tsx
const location = await Location.getCurrentPositionAsync();
```

## ¿Por qué se eligió?
- Permite integración sencilla y multiplataforma para geolocalización.
- Alternativas: APIs nativas, pero expo-location es más fácil de usar y compatible con Expo. 