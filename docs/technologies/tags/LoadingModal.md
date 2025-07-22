# Componente <LoadingModal> en el Proyecto

## ¿De dónde viene?
- **Origen:** Componente personalizado (`src/components/ui/LoadingModal.tsx`)

## ¿Qué hace?
- Muestra un modal con indicador de carga y mensaje opcional.
- Props: `visible`, `title`, `message`, `progress`, `cancelable`, `onCancel`.

## ¿Cómo se usa?
```tsx
<LoadingModal visible={isLoading} title="Cargando" message="Por favor espera..." />
```

## Ejemplo de uso en el proyecto
```tsx
<LoadingModal visible={loading} message="Guardando cambios..." />
```

## ¿Por qué se eligió?
- Permite bloquear la UI durante operaciones críticas.
- Mejora la experiencia de usuario en procesos largos.
- Alternativas: `<Modal>` + `<ActivityIndicator>`, pero este componente es más completo y reutilizable. 