# Componente `EventList`

## Descripción

`EventList` es un componente reutilizable que permite mostrar listas de eventos o solicitudes en diferentes modos:
- Pendientes
- Asignados/Agendados
- Todos
- Disponibles (para músicos)

## Integración
- Se usa en la pantalla `MyEventsList` para la gestión centralizada de solicitudes/eventos.
- Consume los endpoints REST `/events/my-pending`, `/events/my-assigned`, `/events/my-scheduled`, `/events/my-events`, `/events/available-requests`.
- Permite alternar entre tabs y filtrar por estado, instrumento, ubicación, etc.

## Props principales
- `mode`: determina el tipo de lista a mostrar.
- `onEventPress`: callback para acciones sobre un evento.

## Ejemplo de uso
```jsx
<EventList mode="my-pending" />
<EventList mode="my-assigned" />
<EventList mode="my-scheduled" />
<EventList mode="my-events" />
<EventList mode="available" />
```

## UI
- UI moderna, responsive y con feedback visual inmediato.
- Integración con el sistema de temas y navegación. 