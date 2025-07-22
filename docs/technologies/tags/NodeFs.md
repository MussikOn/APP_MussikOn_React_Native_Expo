# Uso de fs de Node.js en el Proyecto

## ¿De dónde viene?
- **Origen:** Módulo nativo de Node.js
- **Importación:**
  ```typescript
  const fs = require('fs');
  // o
  import fs from 'fs';
  ```

## ¿Qué hace?
- Permite leer, escribir y manipular archivos y directorios en el sistema de archivos.
- Métodos: `readFile`, `writeFile`, `readdir`, `existsSync`, etc.

## ¿Cómo se usa?
```js
fs.readFile('archivo.txt', 'utf8', (err, data) => {
  if (err) throw err;
  console.log(data);
});
```

## Ejemplo de uso en el proyecto
- (Agregar ejemplo si se encuentra en el código)

## ¿Por qué se eligió?
- Es el estándar para manipulación de archivos en Node.js.
- Alternativas: librerías externas, pero fs es nativo y eficiente. 