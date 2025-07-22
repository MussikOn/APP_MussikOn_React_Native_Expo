# Modernización de Temas, i18n y UI/UX

## Cambios realizados

### 1. Sistema de Temas Centralizado
- Todos los colores, fondos, gradientes y bordes usan `theme.colors` y `theme.gradients`.
- Los estilos dinámicos se generan con funciones `getStyles(theme, insets)` dentro de los componentes.
- El diseño es consistente en modo claro/oscuro y adaptable a nuevos colores.

### 2. Internacionalización (i18n)
- Todos los textos visibles usan el sistema de traducción `i18next` (`t('key')`).
- Traducciones completas en español e inglés.
- Claves organizadas por pantalla y función.

### 3. Navegación y Header
- Header superior minimalista, sin textos, solo íconos.
- Botón de menú/sidebar sticky y siempre visible en Home.
- Botón de retroceso en todas las pantallas que no son Home.
- Uso de `useSafeAreaInsets` para respetar la barra de estado.

### 4. Sidebar y Rutas
- Dashboard solo visible para músicos.
- Home es la pantalla de entrada tras login.
- El menú lateral muestra rutas válidas según el rol.
- El botón de "Agenda" (eventos) aparece para músicos y event creators.

### 5. Pantalla de Inicio (Home)
- Header con gradiente y padding superior.
- Acciones rápidas, estadísticas y CTA bien espaciados.
- Diseño moderno y responsivo.

### 6. Pantalla de Eventos (Agenda)
- Header con gradiente, padding superior y separación visual.
- Barra de búsqueda compacta y elegante.
- Filtros tipo chip, scroll horizontal y feedback visual.
- Tarjetas de evento limpias, con sombra, bordes redondeados y jerarquía visual.
- Empty state amigable y bien espaciado.
- Espaciados y paddings consistentes.

### 7. SafeArea y Espaciado
- El padding superior se maneja solo en el header visual de cada pantalla.
- El contenido nunca queda oculto bajo el header global.

### 8. Tipado y buenas prácticas
- Todo el código compila sin errores (`npx tsc --noEmit`).
- Los estilos y props usan los tipos correctos.

## Recomendaciones para futuras integraciones
- **Siempre usa el sistema de temas:** No uses colores hardcodeados. Usa `theme.colors`, `theme.gradients` y genera estilos con funciones.
- **Traduce todos los textos:** Usa `t('key')` para todos los textos visibles.
- **Mantén la jerarquía visual:** Usa gradientes y paddings en los headers, separa visualmente el contenido.
- **SafeArea:** Usa `useSafeAreaInsets` para respetar la barra de estado.
- **Nuevos campos/componentes:** Si agregas campos de API, intégralos en las tarjetas o formularios usando los estilos y componentes existentes.
- **No modifiques el layout base:** Si necesitas agregar secciones, sigue el patrón de espaciado y gradientes de las pantallas actuales.
- **Revisa la documentación y los archivos de estilos antes de modificar o agregar pantallas.**

---

# Guía para IA: Integración de API sin perder el estilo visual

1. **Estudia el sistema de temas:**
   - Todos los colores y fondos se obtienen de `theme.colors` y `theme.gradients`.
   - Los estilos se generan con funciones `getStyles(theme, insets)`.

2. **Respeta la estructura visual:**
   - Los headers usan gradientes y paddings superiores.
   - El contenido principal nunca debe quedar debajo del header global.
   - Usa tarjetas, chips y botones con los estilos existentes.

3. **Internacionalización:**
   - Todos los textos deben estar en el sistema de traducción (`t('key')`).
   - Si agregas campos nuevos, agrega las claves en los archivos de traducción.

4. **SafeArea y espaciado:**
   - Usa `useSafeAreaInsets` para calcular el padding superior.
   - No dupliques paddings entre contenedores y headers.

5. **Nuevos campos de API:**
   - Integra los datos en las tarjetas o formularios usando los componentes y estilos existentes.
   - Si necesitas mostrar información adicional, agrégala como un nuevo bloque visualmente separado, pero usando los mismos colores y bordes.

6. **No rompas la consistencia:**
   - No uses colores, fuentes o paddings fuera del sistema de temas.
   - No cambies la jerarquía visual de headers, gradientes y contenido.

7. **Prueba visual y de tipado:**
   - Ejecuta `npx tsc --noEmit` y revisa la app visualmente tras cada cambio.

---

**Con esta guía, cualquier desarrollador o IA puede integrar nuevas APIs y campos sin perder el estilo visual ni la experiencia de usuario lograda.** 