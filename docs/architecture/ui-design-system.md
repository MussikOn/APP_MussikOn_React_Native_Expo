# Sistema de Diseño UI

## Descripción General
Sistema de diseño completo y consistente con tema claro/oscuro, componentes reutilizables, tipografía escalable y paleta de colores unificada.

## Estado de Implementación
**100% Implementado** ✅

## Arquitectura

### Frontend
- **Tema**: Sistema de temas claro/oscuro
- **Componentes**: Biblioteca de componentes reutilizables
- **Tipografía**: Sistema de fuentes escalable
- **Colores**: Paleta de colores consistente

### Configuración
- **Theme Provider**: Context para gestión de temas
- **Configuración**: Archivos de configuración centralizados
- **Persistencia**: Preferencias guardadas localmente
- **Adaptación**: Cambio automático según sistema

## Componentes Implementados

### Sistema de Temas
- `theme/index.ts` - Configuración principal de temas
- `ThemeContext.tsx` - Context para gestión de temas
- `useTheme.ts` - Hook para acceso al tema

### Componentes Base
- `Buttons/` - Botones con variantes y estados
- `Cards/` - Tarjetas y contenedores
- `Inputs/` - Campos de entrada y formularios
- `Headers/` - Encabezados y barras de título
- `Modals/` - Modales y diálogos
- `Spinners/` - Indicadores de carga
- `Logos/` - Logotipos y marcas

### Utilidades
- `colors.ts` - Paleta de colores
- `typography.ts` - Sistema de tipografía
- `spacing.ts` - Sistema de espaciado
- `shadows.ts` - Sistema de sombras

## Sistema de Temas

### Tema Claro
```typescript
interface LightTheme {
  colors: {
    primary: ColorPalette;
    secondary: ColorPalette;
    tertiary: ColorPalette;
    success: ColorPalette;
    warning: ColorPalette;
    error: ColorPalette;
    neutral: ColorPalette;
    background: {
      primary: string;
      secondary: string;
      card: string;
      overlay: string;
    };
    text: {
      primary: string;
      secondary: string;
      disabled: string;
      inverse: string;
    };
    border: {
      primary: string;
      secondary: string;
      focus: string;
    };
  };
  typography: TypographySystem;
  spacing: SpacingSystem;
  shadows: ShadowSystem;
  borderRadius: BorderRadiusSystem;
}
```

### Tema Oscuro
```typescript
interface DarkTheme {
  colors: {
    // Misma estructura que tema claro
    // Colores adaptados para modo oscuro
  };
  // Resto de propiedades adaptadas
}
```

## Paleta de Colores

### Colores Primarios
- **500**: Color principal de la marca
- **400**: Variante más clara
- **600**: Variante más oscura
- **300**: Color de acento claro
- **700**: Color de acento oscuro

### Colores Semánticos
- **Success**: Verde para acciones exitosas
- **Warning**: Amarillo para advertencias
- **Error**: Rojo para errores
- **Info**: Azul para información

### Colores de Fondo
- **Primary**: Fondo principal de la app
- **Secondary**: Fondo de tarjetas y contenedores
- **Card**: Fondo de elementos elevados
- **Overlay**: Fondo de modales y overlays

## Sistema de Tipografía

### Escalas de Tamaño
```typescript
interface TypographySystem {
  sizes: {
    xs: number;    // 12px
    sm: number;    // 14px
    base: number;  // 16px
    lg: number;    // 18px
    xl: number;    // 20px
    '2xl': number; // 24px
    '3xl': number; // 30px
    '4xl': number; // 36px
  };
  weights: {
    normal: string;  // 400
    medium: string;  // 500
    semibold: string; // 600
    bold: string;    // 700
  };
  lineHeights: {
    tight: number;   // 1.25
    normal: number;  // 1.5
    relaxed: number; // 1.75
  };
}
```

### Familias de Fuentes
- **Primary**: Fuente principal de la app
- **Secondary**: Fuente para títulos
- **Monospace**: Fuente para código y datos

## Sistema de Espaciado

### Escala de Espaciado
```typescript
interface SpacingSystem {
  xs: number;    // 4px
  sm: number;    // 8px
  md: number;    // 16px
  lg: number;    // 24px
  xl: number;    // 32px
  '2xl': number; // 48px
  '3xl': number; // 64px
}
```

### Aplicación
- **Padding**: Espaciado interno de componentes
- **Margin**: Espaciado entre componentes
- **Gap**: Espaciado en layouts flexbox/grid
- **Borders**: Grosor de bordes

## Sistema de Sombras

### Niveles de Elevación
```typescript
interface ShadowSystem {
  sm: string;    // Sombra sutil
  md: string;    // Sombra media
  lg: string;    // Sombra grande
  xl: string;    // Sombra extra grande
  inner: string; // Sombra interna
}
```

### Uso
- **Cards**: Elevación de tarjetas
- **Buttons**: Estados de botones
- **Modals**: Elevación de modales
- **Navigation**: Barras de navegación

## Componentes Base

### Botones
- **Variantes**: Primary, Secondary, Tertiary, Ghost
- **Tamaños**: Small, Medium, Large
- **Estados**: Default, Hover, Active, Disabled
- **Iconos**: Con/sin iconos, posicionamiento

### Tarjetas
- **Tipos**: Default, Elevated, Interactive
- **Contenido**: Header, Body, Footer
- **Acciones**: Botones, enlaces, opciones
- **Estados**: Loading, Error, Empty

### Campos de Entrada
- **Tipos**: Text, Email, Password, Number
- **Estados**: Default, Focus, Error, Success
- **Validación**: Mensajes de error en tiempo real
- **Accesorios**: Labels, placeholders, iconos

### Modales
- **Tipos**: Alert, Confirm, Form, Custom
- **Tamaños**: Small, Medium, Large, Full
- **Posicionamiento**: Center, Top, Bottom
- **Animaciones**: Entrada, salida, transiciones

## Responsive Design

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Adaptaciones
- **Layout**: Cambios en estructura
- **Tipografía**: Tamaños adaptativos
- **Espaciado**: Márgenes responsivos
- **Componentes**: Variantes por dispositivo

## Accesibilidad

### Contraste
- **WCAG AA**: Cumplimiento de estándares
- **Colores**: Contraste mínimo 4.5:1
- **Estados**: Estados claramente diferenciados

### Navegación
- **Teclado**: Navegación completa por teclado
- **Screen readers**: Etiquetas y descripciones
- **Focus**: Indicadores de foco visibles

### Interacciones
- **Touch targets**: Mínimo 44x44px
- **Gestos**: Alternativas para gestos complejos
- **Feedback**: Respuesta visual y háptica

## Performance

### Optimización
- **Memoización**: Componentes optimizados
- **Lazy loading**: Carga bajo demanda
- **Bundle splitting**: División de código
- **Tree shaking**: Eliminación de código no usado

### Métricas
- **First Paint**: Tiempo hasta primer pixel
- **First Contentful Paint**: Tiempo hasta primer contenido
- **Largest Contentful Paint**: Tiempo hasta contenido principal
- **Cumulative Layout Shift**: Estabilidad visual

## Testing

### Visual Testing
- **Screenshots**: Comparación de pantallas
- **Regresión**: Detección de cambios visuales
- **Cross-browser**: Compatibilidad entre navegadores
- **Responsive**: Pruebas en diferentes dispositivos

### Component Testing
- **Unit tests**: Lógica de componentes
- **Integration tests**: Interacción entre componentes
- **Accessibility tests**: Cumplimiento de estándares
- **Performance tests**: Rendimiento de componentes

## Roadmap

- [ ] Sistema de iconos unificado
- [ ] Animaciones y transiciones
- [ ] Componentes avanzados (DataTable, Charts)
- [ ] Tema personalizable por usuario
- [ ] Modo de alto contraste
- [ ] Componentes adaptativos por contexto
- [ ] Sistema de grid avanzado

## Archivos Relacionados

- `src/theme/index.ts`
- `src/theme/colors.ts`
- `src/theme/typography.ts`
- `src/theme/spacing.ts`
- `src/theme/shadows.ts`
- `src/contexts/ThemeContext.tsx`
- `src/hooks/useTheme.ts`
- `src/components/ui/`
- `src/components/features/`
- `src/utils/themeUtils.ts`
