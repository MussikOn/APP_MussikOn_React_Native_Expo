# Arquitectura de Base de Datos

## Descripción General
Sistema de base de datos basado en Firebase Firestore con arquitectura NoSQL, optimizado para escalabilidad y consultas en tiempo real.

## Estado de Implementación
**100% Implementado** ✅

## Arquitectura

### Backend
- **Firebase Firestore**: Base de datos NoSQL principal
- **Firebase Authentication**: Sistema de autenticación
- **Firebase Storage**: Almacenamiento de archivos
- **Firebase Functions**: Funciones serverless

### Características
- **NoSQL**: Base de datos orientada a documentos
- **Tiempo real**: Sincronización automática
- **Escalabilidad**: Crecimiento automático
- **Seguridad**: Reglas de seguridad configurables

## Estructura de Colecciones

### Usuarios (users)
```typescript
interface User {
  id: string;                    // ID único del usuario
  email: string;                 // Email del usuario
  username: string;              // Nombre de usuario
  fullName: string;              // Nombre completo
  roll: 'user' | 'musician';     // Rol del usuario
  profilePicture?: string;       // URL de la imagen de perfil
  phone?: string;                // Número de teléfono
  location?: {                   // Ubicación del usuario
    address: string;
    city: string;
    country: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  preferences: {                 // Preferencias del usuario
    notifications: boolean;
    language: string;
    theme: 'light' | 'dark';
  };
  createdAt: Timestamp;          // Fecha de creación
  updatedAt: Timestamp;          // Fecha de última actualización
  isVerified: boolean;           // Usuario verificado
  isActive: boolean;             // Usuario activo
}
```

### Solicitudes de Músicos (musicianRequests)
```typescript
interface MusicianRequest {
  id: string;                    // ID único de la solicitud
  userId: string;                // ID del usuario que solicita
  title: string;                 // Título de la solicitud
  description: string;           // Descripción detallada
  genre: string;                 // Género musical requerido
  date: Timestamp;               // Fecha del evento
  location: {                    // Ubicación del evento
    address: string;
    city: string;
    country: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  budget: {                      // Presupuesto del evento
    min: number;
    max: number;
    currency: string;
  };
  duration: number;              // Duración en horas
  status: 'pending' | 'assigned' | 'completed' | 'cancelled';
  assignedMusicianId?: string;   // ID del músico asignado
  createdAt: Timestamp;          // Fecha de creación
  updatedAt: Timestamp;          // Fecha de última actualización
  tags: string[];                // Etiquetas para búsqueda
  isUrgent: boolean;             // Solicitud urgente
}
```

### Eventos (events)
```typescript
interface Event {
  id: string;                    // ID único del evento
  requestId: string;             // ID de la solicitud original
  userId: string;                // ID del usuario organizador
  musicianId: string;            // ID del músico asignado
  title: string;                 // Título del evento
  description: string;           // Descripción del evento
  date: Timestamp;               // Fecha del evento
  startTime: string;             // Hora de inicio
  endTime: string;               // Hora de finalización
  location: {                    // Ubicación del evento
    address: string;
    city: string;
    venue: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  payment: {                     // Información de pago
    amount: number;
    currency: string;
    status: 'pending' | 'paid' | 'refunded';
    paidAt?: Timestamp;
  };
  createdAt: Timestamp;          // Fecha de creación
  updatedAt: Timestamp;          // Fecha de última actualización
}
```

### Chat (conversations)
```typescript
interface Conversation {
  id: string;                    // ID único de la conversación
  participants: string[];        // IDs de los participantes
  lastMessage?: {                // Último mensaje
    id: string;
    text: string;
    senderId: string;
    timestamp: Timestamp;
  };
  unreadCount: {                 // Contador de mensajes no leídos
    [userId: string]: number;
  };
  createdAt: Timestamp;          // Fecha de creación
  updatedAt: Timestamp;          // Fecha de última actualización
  type: 'direct' | 'group';      // Tipo de conversación
  metadata?: {                   // Metadatos adicionales
    requestId?: string;
    eventId?: string;
  };
}
```

### Mensajes (messages)
```typescript
interface Message {
  id: string;                    // ID único del mensaje
  conversationId: string;        // ID de la conversación
  senderId: string;              // ID del remitente
  text: string;                  // Texto del mensaje
  type: 'text' | 'image' | 'file' | 'location';
  metadata?: {                   // Metadatos del mensaje
    fileName?: string;
    fileSize?: number;
    fileUrl?: string;
    location?: {
      latitude: number;
      longitude: number;
      address: string;
    };
  };
  readBy: string[];              // IDs de usuarios que han leído
  createdAt: Timestamp;          // Fecha de creación
  updatedAt: Timestamp;          // Fecha de última actualización
  isEdited: boolean;             // Mensaje editado
  editedAt?: Timestamp;          // Fecha de edición
}
```

### Notificaciones (notifications)
```typescript
interface Notification {
  id: string;                    // ID único de la notificación
  userId: string;                // ID del usuario destinatario
  type: 'request' | 'chat' | 'payment' | 'event' | 'system';
  title: string;                 // Título de la notificación
  message: string;               // Mensaje de la notificación
  data?: {                       // Datos adicionales
    requestId?: string;
    eventId?: string;
    messageId?: string;
    paymentId?: string;
  };
  read: boolean;                 // Notificación leída
  priority: 'low' | 'normal' | 'high';
  scheduledFor?: Timestamp;      // Programación de notificación
  createdAt: Timestamp;          // Fecha de creación
  updatedAt: Timestamp;          // Fecha de última actualización
}
```

### Pagos (payments)
```typescript
interface Payment {
  id: string;                    // ID único del pago
  userId: string;                // ID del usuario
  type: 'deposit' | 'withdraw' | 'earning' | 'fee';
  amount: number;                 // Monto del pago
  currency: string;              // Moneda del pago
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  method: 'bank_transfer' | 'card' | 'crypto';
  reference: string;             // Referencia del pago
  description: string;           // Descripción del pago
  metadata?: {                   // Metadatos adicionales
    bankAccountId?: string;
    transactionId?: string;
    fee?: number;
  };
  processedAt?: Timestamp;       // Fecha de procesamiento
  createdAt: Timestamp;          // Fecha de creación
  updatedAt: Timestamp;          // Fecha de última actualización
}
```

### Cuentas Bancarias (bankAccounts)
```typescript
interface BankAccount {
  id: string;                    // ID único de la cuenta
  userId: string;                // ID del usuario propietario
  accountNumber: string;         // Número de cuenta
  bankName: string;              // Nombre del banco
  accountType: 'checking' | 'savings';
  routingNumber: string;         // Número de ruta bancaria
  accountHolderName: string;     // Nombre del titular
  isDefault: boolean;            // Cuenta por defecto
  isVerified: boolean;           // Cuenta verificada
  createdAt: Timestamp;          // Fecha de creación
  updatedAt: Timestamp;          // Fecha de última actualización
}
```

### Reels (reels)
```typescript
interface Reel {
  id: string;                    // ID único del reel
  userId: string;                // ID del usuario creador
  videoUrl: string;              // URL del video
  thumbnailUrl: string;          // URL de la miniatura
  title: string;                 // Título del reel
  description: string;           // Descripción del reel
  genre: string;                 // Género musical
  duration: number;              // Duración en segundos
  likes: number;                 // Número de likes
  comments: number;              // Número de comentarios
  shares: number;                // Número de compartidos
  tags: string[];                // Etiquetas del reel
  music?: {                      // Música de fondo
    title: string;
    artist: string;
    url: string;
  };
  isPublic: boolean;             // Reel público
  createdAt: Timestamp;          // Fecha de creación
  updatedAt: Timestamp;          // Fecha de última actualización
}
```

## Reglas de Seguridad

### Reglas de Usuarios
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Usuarios pueden leer/editar solo su propio perfil
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow read: if request.auth != null; // Perfiles públicos
    }
  }
}
```

### Reglas de Solicitudes
```javascript
match /musicianRequests/{requestId} {
  allow read: if request.auth != null;
  allow create: if request.auth != null;
  allow update, delete: if request.auth != null && 
    (resource.data.userId == request.auth.uid || 
     resource.data.assignedMusicianId == request.auth.uid);
}
```

### Reglas de Chat
```javascript
match /conversations/{conversationId} {
  allow read, write: if request.auth != null && 
    request.auth.uid in resource.data.participants;
}

match /messages/{messageId} {
  allow read, write: if request.auth != null && 
    request.auth.uid in get(/databases/$(database)/documents/conversations/$(resource.data.conversationId)).data.participants;
}
```

## Índices y Consultas

### Índices Compuestos
```typescript
// Solicitudes por estado y fecha
musicianRequests: status (Ascending) + date (Descending)

// Eventos por usuario y estado
events: userId (Ascending) + status (Ascending)

// Mensajes por conversación y fecha
messages: conversationId (Ascending) + createdAt (Descending)

// Notificaciones por usuario y estado
notifications: userId (Ascending) + read (Ascending) + createdAt (Descending)
```

### Consultas Optimizadas
```typescript
// Solicitudes disponibles para músicos
const availableRequests = await firestore
  .collection('musicianRequests')
  .where('status', '==', 'pending')
  .where('date', '>', new Date())
  .orderBy('date', 'asc')
  .limit(20)
  .get();

// Eventos del usuario
const userEvents = await firestore
  .collection('events')
  .where('userId', '==', userId)
  .orderBy('date', 'desc')
  .get();

// Mensajes no leídos
const unreadMessages = await firestore
  .collection('notifications')
  .where('userId', '==', userId)
  .where('read', '==', false)
  .orderBy('createdAt', 'desc')
  .get();
```

## Backup y Recuperación

### Estrategia de Backup
- **Automático**: Backup diario automático
- **Manual**: Backup bajo demanda
- **Retención**: 30 días de backups
- **Verificación**: Validación de integridad

### Recuperación
- **Punto en tiempo**: Recuperación a momento específico
- **Colección completa**: Restauración de colección
- **Documento individual**: Recuperación de documento
- **Validación**: Verificación post-recuperación

## Performance y Escalabilidad

### Optimizaciones
- **Índices**: Índices compuestos para consultas frecuentes
- **Paginación**: Límites en consultas grandes
- **Cache**: Cache de consultas frecuentes
- **Batch operations**: Operaciones en lote

### Monitoreo
- **Métricas**: Tiempo de respuesta de consultas
- **Uso de recursos**: CPU, memoria, almacenamiento
- **Alertas**: Notificaciones de problemas
- **Dashboard**: Visualización de métricas

## Testing

### Unit Tests
- **Modelos**: Validación de esquemas
- **Consultas**: Lógica de consultas
- **Reglas**: Verificación de seguridad
- **Utilidades**: Funciones de base de datos

### Integration Tests
- **Operaciones CRUD**: Crear, leer, actualizar, eliminar
- **Consultas complejas**: Filtros y ordenamiento
- **Transacciones**: Operaciones atómicas
- **Reglas de seguridad**: Verificación de permisos

### Performance Tests
- **Carga**: Consultas con muchos documentos
- **Concurrencia**: Múltiples usuarios simultáneos
- **Escalabilidad**: Crecimiento de datos
- **Latencia**: Tiempo de respuesta

## Roadmap

- [ ] Migración a PostgreSQL para consultas complejas
- [ ] Cache con Redis
- [ ] Replicación geográfica
- [ ] Backup en la nube
- [ ] Analytics avanzados
- [ ] Machine learning para optimización
- [ ] Base de datos distribuida

## Archivos Relacionados

- `../app_mussikon_express/src/config/firebase.ts`
- `../app_mussikon_express/src/models/`
- `../app_mussikon_express/src/services/`
- `../app_mussikon_express/firestore.rules`
- `../app_mussikon_express/firestore.indexes.json`
