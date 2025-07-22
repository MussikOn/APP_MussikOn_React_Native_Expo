# Uso de jwtDecode en el Proyecto

## ¿De dónde viene?
- **Origen:** `jwt-decode` (dependencia externa)
- **Importación:**
  ```typescript
  import { jwtDecode } from 'jwt-decode';
  ```

## ¿Qué hace?
- Permite decodificar tokens JWT para extraer información (payload) sin necesidad de la clave secreta.

## ¿Cómo se usa?
```tsx
const data = jwtDecode(token);
```

## Ejemplo de uso en el proyecto
```tsx
const data: Token = jwtDecode(token!);
```

## ¿Por qué se eligió?
- Permite obtener datos del usuario autenticado de forma sencilla.
- Alternativas: decodificación manual (más propensa a errores), otras librerías de JWT. 