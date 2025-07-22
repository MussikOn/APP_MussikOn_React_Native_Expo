# Uso de expo-image-picker en el Proyecto

## ¿De dónde viene?
- **Origen:** `expo-image-picker` (paquete de Expo)
- **Importación:**
  ```typescript
  import * as ImagePicker from 'expo-image-picker';
  ```

## ¿Qué hace?
- Permite seleccionar imágenes y videos desde la galería o la cámara del dispositivo.
- Métodos: `launchCameraAsync`, `launchImageLibraryAsync`, etc.

## ¿Cómo se usa?
```tsx
const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images });
```

## Ejemplo de uso en el proyecto
```tsx
const result = await ImagePicker.launchCameraAsync();
```

## ¿Por qué se eligió?
- Permite integración sencilla y multiplataforma para selección de imágenes.
- Alternativas: librerías nativas, pero expo-image-picker es más fácil de usar y compatible con Expo. 