# Uso de path de Node.js en el Proyecto

## ¿De dónde viene?
- **Origen:** Módulo nativo de Node.js
- **Importación:**
  ```typescript
  const path = require('path');
  // o
  import path from 'path';
  ```

## ¿Qué hace?
- Permite manipular rutas de archivos y directorios de forma multiplataforma.
- Métodos: `join`, `resolve`, `basename`, `dirname`, etc.

## ¿Cómo se usa?
```js
const fullPath = path.join(__dirname, 'archivo.txt');
```

## Ejemplo de uso en el proyecto
- (Agregar ejemplo si se encuentra en el código)

## ¿Por qué se eligió?
- Es el estándar para manipulación de rutas en Node.js.
- Alternativas: concatenación manual de strings (menos seguro y multiplataforma). 