# Componente <FAB> (Floating Action Button) en el Proyecto

## ¿De dónde viene?
- **Origen:** Componente personalizado del proyecto (`src/components/ui/FAB.tsx`)
- **Inspiración:** Patrón de Material Design para acciones flotantes

## ¿Qué hace?
- Renderiza un botón flotante sobre la interfaz, generalmente para acciones principales (crear, agregar, etc.).
- Soporta props como `label`, `onPress`, `onLongPress`.

## ¿Cómo se usa?
```tsx
<FAB label="Agregar" onPress={handleAdd} />
```

## Ejemplo de uso en el proyecto
```tsx
<FAB label="Nuevo Evento" onPress={handleNewEvent} />
```

## ¿Por qué se eligió?
- Permite accesibilidad rápida a acciones principales.
- Sigue patrones de diseño modernos.
- Alternativas: `react-native-paper` tiene un FAB, pero aquí se usa uno propio para personalización total. 