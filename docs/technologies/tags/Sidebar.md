# Componente <Sidebar> en el Proyecto

## ¿De dónde viene?
- **Origen:** Componente personalizado (`src/components/features/pages/Sidebar/MainSidebar.tsx`)

## ¿Qué hace?
- Renderiza un menú lateral (drawer) con opciones de navegación y acciones.
- Props: `isVisible`, `user`, `onClose`, `onNavigate`.

## ¿Cómo se usa?
```tsx
<MainSidebar isVisible={sidebarVisible} user={user} onClose={closeSidebar} onNavigate={handleNavigate} />
```

## Ejemplo de uso en el proyecto
```tsx
<MainSidebar
  isVisible={sidebarVisible}
  user={user}
  onClose={() => setSidebarVisible(false)}
  onNavigate={handleSidebarNavigate}
/>
```

## ¿Por qué se eligió?
- Permite navegación lateral moderna y accesible.
- Alternativas: `@react-navigation/drawer`, pero este componente permite personalización total y lógica propia. 