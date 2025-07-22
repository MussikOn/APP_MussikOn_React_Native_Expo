# Componente <SlideButton> en el Proyecto

## ¿De dónde viene?
- **Origen:** Componente personalizado (`src/components/ui/buttons/SlideButton.tsx`)
- **Inspiración:** Botón de confirmación deslizante (slide to confirm)

## ¿Qué hace?
- Permite confirmar acciones importantes deslizando un botón.
- Props: `onActivate` (callback al completar el slide)

## ¿Cómo se usa?
```tsx
<SlideButton onActivate={handleConfirm} />
```

## Ejemplo de uso en el proyecto
```tsx
<SlideButton onActivate={handleDelete} />
```

## ¿Por qué se eligió?
- Mejora la UX para acciones críticas, evitando toques accidentales.
- Alternativas: botones normales, pero menos seguros para confirmaciones. 