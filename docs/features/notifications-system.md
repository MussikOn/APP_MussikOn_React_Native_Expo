# Sistema de Notificaciones

## Descripción General
Sistema completo de notificaciones push y locales para mantener informados a los usuarios sobre eventos, solicitudes y actualizaciones importantes.

## Estado de Implementación
**100% Implementado** ✅

## Arquitectura

### Frontend
- **Push Notifications**: Expo Notifications con gestión de tokens
- **Local Notifications**: Notificaciones en-app con Expo Haptics
- **Estado**: Redux para gestión de notificaciones
- **UI**: Pantalla dedicada con filtros y gestión

### Backend
- **Firebase Cloud Messaging**: Envío de notificaciones push
- **Webhooks**: Notificaciones automáticas por eventos
- **Base de datos**: Firebase Firestore para historial
- **Scheduling**: Notificaciones programadas

## Componentes Implementados

### Pantallas
- `NotificationsScreen.tsx` - Pantalla principal de notificaciones
- `NotificationItem.tsx` - Elemento individual de notificación

### Servicios
- `NotificationService.ts` - Gestión centralizada de notificaciones
- `PushNotificationService.ts` - Servicio de notificaciones push
- `LocalNotificationService.ts` - Servicio de notificaciones locales

### Hooks
- `useNotifications` - Hook personalizado para notificaciones
- `usePushNotifications` - Gestión de permisos y tokens

## Funcionalidades Implementadas

### ✅ Completadas
- Notificaciones push con Firebase
- Notificaciones locales en-app
- Pantalla de gestión de notificaciones
- Filtros por tipo y estado
- Historial completo de notificaciones
- Gestión de permisos
- Tokens de dispositivo
- Categorización por tipo

### ✅ Configuración
- Permisos de notificaciones
- Configuración de canales (Android)
- Gestión de tokens FCM
- Configuración de sonidos y vibración

## Tipos de Notificaciones

### Solicitudes de Músicos
- **Nueva solicitud**: Usuario solicita músico
- **Solicitud aceptada**: Músico acepta solicitud
- **Solicitud cancelada**: Usuario cancela solicitud
- **Solicitud completada**: Evento finalizado

### Chat y Mensajes
- **Nuevo mensaje**: Mensaje recibido en chat
- **Usuario escribiendo**: Indicador de escritura
- **Mensaje leído**: Confirmación de lectura

### Pagos y Transacciones
- **Depósito exitoso**: Confirmación de depósito
- **Retiro procesado**: Confirmación de retiro
- **Pago recibido**: Notificación de pago
- **Saldo actualizado**: Cambio en saldo

### Eventos y Calendario
- **Evento próximo**: Recordatorio de evento
- **Cambio de horario**: Modificación de evento
- **Evento cancelado**: Cancelación de evento

### Sistema y Mantenimiento
- **Actualización disponible**: Nueva versión de app
- **Mantenimiento**: Servicios temporales
- **Seguridad**: Alertas de seguridad

## Flujo de Notificaciones

### 1. Generación
- Evento ocurre en backend
- Sistema determina destinatarios
- Creación de notificación en base de datos
- Envío vía FCM si es push

### 2. Entrega
- FCM entrega a dispositivos
- App recibe notificación
- Procesamiento según tipo
- Almacenamiento local

### 3. Visualización
- Usuario abre app
- Carga de notificaciones
- Filtrado por preferencias
- Marca como leída

## Estructura de Datos

### Notificación
```typescript
interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  read: boolean;
  createdAt: Date;
  scheduledFor?: Date;
  priority: 'low' | 'normal' | 'high';
}
```

### Configuración de Usuario
```typescript
interface NotificationSettings {
  userId: string;
  pushEnabled: boolean;
  localEnabled: boolean;
  types: {
    requests: boolean;
    chat: boolean;
    payments: boolean;
    events: boolean;
    system: boolean;
  };
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
}
```

## API Endpoints

### Notificaciones
- `GET /notifications` - Obtener notificaciones del usuario
- `PUT /notifications/:id/read` - Marcar como leída
- `PUT /notifications/:id/unread` - Marcar como no leída
- `DELETE /notifications/:id` - Eliminar notificación
- `POST /notifications/clear-all` - Limpiar todas las notificaciones

### Configuración
- `GET /notifications/settings` - Obtener configuración
- `PUT /notifications/settings` - Actualizar configuración
- `POST /notifications/token` - Registrar token de dispositivo

## Permisos y Configuración

### Android
- **Canales**: Categorías de notificaciones
- **Importancia**: Niveles de prioridad
- **Sonidos**: Personalización por canal
- **Vibración**: Patrones configurables

### iOS
- **Autorización**: Solicitud de permisos
- **Tipos**: Alertas, badges, sonidos
- **Configuración**: Ajustes del sistema

## Gestión de Tokens

### Registro
- App solicita permisos
- Generación de token FCM
- Envío a backend
- Almacenamiento en base de datos

### Actualización
- Token expira o cambia
- Generación de nuevo token
- Actualización en backend
- Sincronización con dispositivos

### Limpieza
- Usuario desinstala app
- Logout de usuario
- Eliminación de token
- Limpieza de suscripciones

## Filtros y Búsqueda

### Por Tipo
- Solicitudes de músicos
- Chat y mensajes
- Pagos y transacciones
- Eventos y calendario
- Sistema y mantenimiento

### Por Estado
- No leídas
- Leídas
- Archiviadas
- Todas

### Por Fecha
- Hoy
- Esta semana
- Este mes
- Personalizado

## Performance

### Optimización
- **Lazy loading**: Carga progresiva de notificaciones
- **Paginación**: Límite por página
- **Cache**: Almacenamiento local
- **Debounce**: Reducción de actualizaciones

### Límites
- **Notificaciones**: Máximo por usuario
- **Historial**: Retención configurable
- **Push**: Rate limiting por usuario
- **Almacenamiento**: Límite de espacio local

## Manejo de Errores

### Permisos
- **Denegados**: Instrucciones de configuración
- **Restringidos**: Notificación al usuario
- **Cambios**: Detección automática

### Entrega
- **FCM fallido**: Reintento automático
- **Token inválido**: Renovación automática
- **Dispositivo offline**: Cola de notificaciones

### App
- **Error de carga**: Reintento con backoff
- **Datos corruptos**: Limpieza y recarga
- **Sin conexión**: Modo offline

## Testing

### Unit Tests
- **Servicios**: Lógica de notificaciones
- **Hooks**: Gestión de estado
- **Utilidades**: Formateo y validación

### Integration Tests
- **FCM**: Envío de notificaciones push
- **Backend**: Generación automática
- **Frontend**: Recepción y procesamiento

### E2E Tests
- **Flujos completos**: Desde generación hasta visualización
- **Permisos**: Solicitud y gestión
- **Configuración**: Cambios de preferencias

## Roadmap

- [ ] Notificaciones programadas avanzadas
- [ ] Notificaciones enriquecidas (imágenes, botones)
- [ ] Notificaciones de grupo
- [ ] Análisis de engagement
- [ ] A/B testing de notificaciones
- [ ] Integración con calendario
- [ ] Notificaciones de proximidad

## Archivos Relacionados

- `src/screens/notifications/NotificationsScreen.tsx`
- `src/services/NotificationService.ts`
- `src/services/PushNotificationService.ts`
- `src/services/LocalNotificationService.ts`
- `src/hooks/useNotifications.ts`
- `src/hooks/usePushNotifications.ts`
- `src/store/slices/notificationSlice.ts`
- `src/components/notifications/`
- `app.config.js` (configuración de FCM)
