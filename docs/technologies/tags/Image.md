# Etiqueta <Image> en React Native

## ¿De dónde viene?
- **Origen:** `react-native`
- **Importación:**
  ```typescript
  import { Image } from 'react-native';
  ```

## ¿Qué hace?
- Permite mostrar imágenes locales o remotas en la app.
- Soporta props como `source`, `style`, `resizeMode`, etc.

## ¿Cómo se usa?
```tsx
<Image source={require('./logo.png')} style={{ width: 100, height: 100 }} />
<Image source={{ uri: 'https://ejemplo.com/imagen.jpg' }} style={{ width: 100, height: 100 }} />
```

## Ejemplo de uso en el proyecto
```tsx
<Image source={require("../../../assets/4.png")} style={s.logo}/>
```

## ¿Por qué se eligió?
- Es el estándar para imágenes en React Native.
- Permite optimización y caching nativo.
- Alternativas: librerías como `FastImage` (para caching avanzado). 