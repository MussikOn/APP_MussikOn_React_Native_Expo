# Uso de os de Node.js en el Proyecto

## ¿De dónde viene?
- **Origen:** Módulo nativo de Node.js
- **Importación:**
  ```typescript
  const os = require('os');
  // o
  import os from 'os';
  ```

## ¿Qué hace?
- Permite obtener información del sistema operativo (CPU, memoria, plataforma, etc.).
- Métodos: `os.platform()`, `os.cpus()`, `os.totalmem()`, etc.

## ¿Cómo se usa?
```js
console.log(os.platform());
```

## Ejemplo de uso en el proyecto
- (Agregar ejemplo si se encuentra en el código)

## ¿Por qué se eligió?
- Es el estándar para obtener información del sistema en Node.js.
- Alternativas: librerías externas, pero os es nativo y eficiente. 