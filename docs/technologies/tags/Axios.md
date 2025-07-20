# Uso de Axios en el Proyecto

## ¿De dónde viene?
- **Origen:** `axios` (dependencia externa)
- **Importación:**
  ```typescript
  import axios from 'axios';
  ```

## ¿Qué hace?
- Permite hacer peticiones HTTP (GET, POST, PUT, DELETE, PATCH) de forma sencilla y robusta.
- Soporta interceptores, manejo de errores, timeouts, configuración global, etc.

## ¿Cómo se usa?
```tsx
const response = await axios.get('/api/endpoint');
```

## Ejemplo de uso en el proyecto
```tsx
const response = await api.get(url, config);
```

## ¿Por qué se eligió?
- Es el estándar para peticiones HTTP en JavaScript/TypeScript.
- Alternativas: fetch nativo (menos amigable), otras librerías HTTP. 