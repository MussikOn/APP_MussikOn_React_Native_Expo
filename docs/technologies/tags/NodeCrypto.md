# Uso de crypto de Node.js en el Proyecto

## ¿De dónde viene?
- **Origen:** Módulo nativo de Node.js
- **Importación:**
  ```typescript
  const crypto = require('crypto');
  // o
  import crypto from 'crypto';
  ```

## ¿Qué hace?
- Permite realizar operaciones criptográficas (hash, cifrado, generación de claves, etc.).
- Métodos: `createHash`, `randomBytes`, `createCipheriv`, etc.

## ¿Cómo se usa?
```js
const hash = crypto.createHash('sha256').update('mensaje').digest('hex');
```

## Ejemplo de uso en el proyecto
- (Agregar ejemplo si se encuentra en el código)

## ¿Por qué se eligió?
- Es el estándar para operaciones criptográficas en Node.js.
- Alternativas: librerías externas, pero crypto es nativo y seguro. 