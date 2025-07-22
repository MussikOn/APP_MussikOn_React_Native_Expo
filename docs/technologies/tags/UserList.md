# Componente <UserList> en el Proyecto

## ¿De dónde viene?
- **Origen:** Componente personalizado (`src/components/ui/UserList.tsx`)

## ¿Qué hace?
- Muestra una lista de usuarios con información relevante (nombre, email, rol, fechas).
- Props: `users`, `onUserPress`, `showStatus`, `showActions`, `loading`.

## ¿Cómo se usa?
```tsx
<UserList users={usuarios} />
```

## Ejemplo de uso en el proyecto
```tsx
<UserList />
```

## ¿Por qué se eligió?
- Permite mostrar información de usuarios de forma estructurada y reutilizable.
- Alternativas: `<FlatList>` directo, pero este componente encapsula la lógica y el diseño específico de usuarios. 