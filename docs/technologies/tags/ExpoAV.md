# Uso de expo-av en el Proyecto

## ¿De dónde viene?
- **Origen:** `expo-av` (paquete de Expo)
- **Importación:**
  ```typescript
  import { Audio, Video } from 'expo-av';
  ```

## ¿Qué hace?
- Permite reproducir audio y video en la app.
- Métodos: `Audio.Sound.createAsync`, `Video` component, etc.

## ¿Cómo se usa?
```tsx
const { sound } = await Audio.Sound.createAsync(require('./assets/sound.mp3'));
await sound.playAsync();
```

## Ejemplo de uso en el proyecto
```tsx
const { sound } = await Audio.Sound.createAsync(require('../../assets/sounds/ping.mp3'));
await sound.playAsync();
```

## ¿Por qué se eligió?
- Permite integración sencilla de audio/video en Expo.
- Alternativas: librerías nativas, pero expo-av es más fácil de usar y compatible con Expo. 