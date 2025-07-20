# Etiqueta <ActivityIndicator> en React Native

## ¿De dónde viene?
- **Origen:** `react-native`
- **Importación:**
  ```typescript
  import { ActivityIndicator } from 'react-native';
  ```

## ¿Qué hace?
- Muestra un spinner de carga nativo.
- Props: `size`, `color`, `style`.

## ¿Cómo se usa?
```tsx
<ActivityIndicator size="large" color="#004aad" />
```

## Ejemplo de uso en el proyecto
```tsx
{loading ? <ActivityIndicator color={btn_white} /> : <Text style={s.btnText}>{t('login.button')}</Text>}
```

## ¿Por qué se eligió?
- Es el estándar para feedback de carga en React Native.
- Alternativas: spinners personalizados, pero este es nativo y eficiente. 