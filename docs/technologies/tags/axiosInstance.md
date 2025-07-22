# Instancia Personalizada de Axios (api) en el Proyecto

## ¿De dónde viene?
- **Origen:** Definida en `src/services/api.ts`
- **Basada en:** `axios` (dependencia externa)

## ¿Qué hace?
- Crea una instancia de Axios con configuración global (baseURL, headers, interceptores, timeouts).
- Añade lógica para manejo de tokens, errores, reintentos, etc.

## ¿Cómo se usa?
```tsx
import { api } from '@services/api';
const response = await api.get('/ruta');
```

## Ejemplo de uso en el proyecto
```tsx
const response = await api.get(url, config);
```

## ¿Por qué se eligió?
- Permite centralizar la configuración y lógica de red.
- Facilita el mantenimiento y la seguridad.
- Alternativas: usar axios directamente (menos control), fetch nativo. 