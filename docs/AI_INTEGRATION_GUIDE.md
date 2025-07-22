# Guía para Integración de API en APP_MussikOn

## Objetivo
Integrar nuevas APIs, endpoints y campos en la app sin romper el sistema de temas, la estructura visual ni la experiencia de usuario.

## Principios clave

1. **Sistema de temas centralizado**
   - Usa SIEMPRE `theme.colors`, `theme.gradients`, `theme.shadows` para todos los colores, fondos, bordes y sombras.
   - Genera los estilos con funciones `getStyles(theme, insets)` dentro de los componentes.
   - No uses colores hardcodeados ni estilos inline fuera del sistema de temas.

2. **Estructura visual y jerarquía**
   - Los headers de cada pantalla usan un `LinearGradient` y padding superior (`insets.top + X`).
   - El contenido principal nunca debe quedar debajo del header global.
   - Usa tarjetas, chips y botones con los estilos y componentes existentes.
   - Mantén los espaciados y paddings consistentes.

3. **Internacionalización (i18n)**
   - Todos los textos deben estar en el sistema de traducción (`t('key')`).
   - Si agregas campos nuevos, agrega las claves en los archivos de traducción (`es.json`, `en.json`).

4. **SafeArea y espaciado**
   - Usa `useSafeAreaInsets` para calcular el padding superior.
   - No dupliques paddings entre contenedores y headers.

5. **Nuevos campos de API**
   - Integra los datos en las tarjetas o formularios usando los componentes y estilos existentes.
   - Si necesitas mostrar información adicional, agrégala como un nuevo bloque visualmente separado, pero usando los mismos colores y bordes.

6. **No rompas la consistencia**
   - No uses colores, fuentes o paddings fuera del sistema de temas.
   - No cambies la jerarquía visual de headers, gradientes y contenido.

7. **Prueba visual y de tipado**
   - Ejecuta `npx tsc --noEmit` y revisa la app visualmente tras cada cambio.

## Ejemplo de integración

Si la API devuelve un nuevo campo `eventType` para los eventos:
- Agrega la visualización de `eventType` en la tarjeta de evento usando los estilos de los demás campos.
- Traduce el valor usando `t('events.type_' + eventType)`.
- Si es un campo importante, agrégalo como un chip o badge usando los colores del tema.

---

**Sigue esta guía para mantener la calidad visual y la experiencia de usuario en toda la app.** 