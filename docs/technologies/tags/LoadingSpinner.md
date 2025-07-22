# Componente <LoadingSpinner> en el Proyecto

## ¿De dónde viene?
- **Origen:** Componente personalizado (`src/components/ui/LoadingSpinner.tsx`)
- **Inspiración:** Indicador de carga estándar (spinner)

## ¿Qué hace?
- Muestra un spinner animado para indicar que una operación está en curso.
- Props: `size`, `color`, `text`, `overlay`.

## ¿Cómo se usa?
```tsx
<LoadingSpinner size="large" color="#004aad" text="Cargando..." />
```

## Ejemplo de uso en el proyecto
```tsx
{loading && <LoadingSpinner text="Cargando datos..." />}
```

## ¿Por qué se eligió?
- Permite feedback visual inmediato al usuario.
- Personalizable y reutilizable.
- Alternativas: `<ActivityIndicator>` de React Native, pero este permite más personalización. 