# Etiqueta <Text> en React Native

## ¿De dónde viene?
- **Origen:** `react-native`
- **Importación:**
  ```typescript
  import { Text } from 'react-native';
  ```

## ¿Qué hace?
- Es el componente principal para mostrar texto en aplicaciones React Native.
- Permite renderizar texto plano, aplicar estilos, anidar otros componentes `<Text>`, y manejar eventos de usuario.

## ¿Cómo se usa?
```tsx
<Text style={{ fontSize: 18, color: '#004aad' }}>Hola, mundo</Text>
```
- Puede recibir estilos, children, y props como `numberOfLines`, `onPress`, etc.

## Ejemplo de uso en el proyecto
```tsx
<Text style={styles.title}>{t('home.welcome_message')}</Text>
<Text style={styles.text}>{item.name}</Text>
```

## ¿Por qué se eligió?
- Es el estándar en React Native para texto.
- Permite compatibilidad multiplataforma (iOS, Android, Web).
- Soporta accesibilidad y estilos avanzados.
- Alternativas como `<span>` o `<p>` no existen en React Native. 