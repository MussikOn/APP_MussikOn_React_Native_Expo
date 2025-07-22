# Componente <BottomMenu> en el Proyecto

## ¿De dónde viene?
- **Origen:** Componente personalizado (`src/components/ui/BottomMenu.tsx`)

## ¿Qué hace?
- Renderiza un menú inferior expandible con opciones configurables.
- Props: (según implementación) opciones, onSelect, visible, etc.

## ¿Cómo se usa?
```tsx
<BottomMenu visible={menuVisible} onSelect={handleSelect} />
```

## Ejemplo de uso en el proyecto
```tsx
<BottomMenu visible={showMenu} onSelect={handleMenuSelect} />
```

## ¿Por qué se eligió?
- Permite accesibilidad rápida a acciones secundarias.
- Alternativas: menús contextuales nativos, pero este permite personalización visual y lógica propia. 