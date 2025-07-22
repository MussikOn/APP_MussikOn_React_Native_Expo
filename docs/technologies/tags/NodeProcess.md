# Uso de process de Node.js en el Proyecto

## ¿De dónde viene?
- **Origen:** Módulo global de Node.js
- **Importación:**
  ```js
  // No requiere importación, está disponible globalmente
  ```

## ¿Qué hace?
- Permite acceder a información y controlar el proceso actual de Node.js.
- Propiedades: `process.env`, `process.argv`, `process.exit`, etc.

## ¿Cómo se usa?
```js
console.log(process.env.NODE_ENV);
```

## Ejemplo de uso en el proyecto
- (Agregar ejemplo si se encuentra en el código)

## ¿Por qué se eligió?
- Es el estándar para acceder a variables de entorno y argumentos en Node.js.
- Alternativas: librerías externas, pero process es nativo y universal. 