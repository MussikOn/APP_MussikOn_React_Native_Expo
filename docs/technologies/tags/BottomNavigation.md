# Componente <BottomNavigation> en el Proyecto

## ¿De dónde viene?
- **Origen:** Componente personalizado (`src/components/ui/BottomNavigation.tsx`)

## ¿Qué hace?
- Renderiza una barra de navegación inferior con tabs, iconos y transiciones.
- Props: `tabs`, `activeTab`, `onTabPress`, `showLabels`.

## ¿Cómo se usa?
```tsx
<BottomNavigation tabs={tabs} activeTab={activeTab} onTabPress={setActiveTab} />
```

## Ejemplo de uso en el proyecto
```tsx
<BottomNavigation tabs={tabList} activeTab={currentTab} onTabPress={handleTabPress} />
```

## ¿Por qué se eligió?
- Permite navegación intuitiva y visual en la parte inferior de la app.
- Alternativas: `@react-navigation/bottom-tabs`, pero este componente permite personalización total. 