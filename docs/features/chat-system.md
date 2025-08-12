# Sistema de Chat

## Descripción General
Sistema de chat en tiempo real implementado con Socket.IO para comunicación entre usuarios y músicos.

## Estado de Implementación
**70% Implementado** ⚠️

## Arquitectura

### Frontend
- **Comunicación**: Socket.IO client con hooks personalizados
- **Estado**: Redux para gestión de mensajes y conversaciones
- **UI**: Componentes de chat con diseño moderno
- **Notificaciones**: Push notifications para mensajes nuevos

### Backend
- **WebSocket**: Socket.IO server con eventos en tiempo real
- **Base de datos**: Firebase Firestore para persistencia
- **Eventos**: Sistema de eventos para mensajes y estados

## Componentes Implementados

### Pantallas
- `ChatListScreen.tsx` - Lista de conversaciones activas
- `ChatScreen.tsx` - Interfaz de chat individual

### Hooks
- `useSocket` - Conexión y gestión de Socket.IO
- `useMusicianRequestSocket` - Eventos específicos para solicitudes

### Componentes UI
- `ChatBubble` - Mensajes individuales
- `ChatInput` - Entrada de texto con funcionalidades
- `ConversationItem` - Elemento de lista de conversaciones

## Funcionalidades Implementadas

### ✅ Completadas
- Lista de conversaciones
- Interfaz de chat básica
- Conexión Socket.IO
- Estructura de mensajes
- Navegación entre chats

### ⚠️ Parcialmente Implementadas
- Envío de mensajes en tiempo real
- Notificaciones push
- Historial de mensajes
- Estados de lectura

### ❌ Pendientes
- Archivos multimedia
- Emojis y reacciones
- Búsqueda de mensajes
- Chat grupal

## Flujo de Chat

1. **Inicio de Conversación**
   - Usuario selecciona chat desde lista
   - Carga de historial de mensajes
   - Conexión Socket.IO para chat específico

2. **Envío de Mensaje**
   - Usuario escribe mensaje
   - Validación de contenido
   - Envío vía Socket.IO
   - Actualización de UI en tiempo real

3. **Recepción de Mensaje**
   - Escucha de eventos Socket.IO
   - Actualización de estado local
   - Notificación push (si app en background)
   - Actualización de lista de conversaciones

## Estructura de Datos

### Mensaje
```typescript
interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  read: boolean;
  type: 'text' | 'image' | 'file';
}
```

### Conversación
```typescript
interface Conversation {
  id: string;
  participants: string[];
  lastMessage: Message;
  unreadCount: number;
  updatedAt: Date;
}
```

## Eventos Socket.IO

### Cliente → Servidor
- `send_message` - Enviar mensaje
- `mark_read` - Marcar mensaje como leído
- `typing_start` - Usuario escribiendo
- `typing_stop` - Usuario dejó de escribir

### Servidor → Cliente
- `new_message` - Nuevo mensaje recibido
- `message_delivered` - Confirmación de entrega
- `user_typing` - Usuario escribiendo
- `user_online` - Usuario conectado

## API Endpoints

### Chat
- `GET /chat/conversations` - Obtener conversaciones del usuario
- `GET /chat/messages/:conversationId` - Obtener mensajes de conversación
- `POST /chat/messages` - Enviar mensaje
- `PUT /chat/messages/:id/read` - Marcar mensaje como leído

### Usuarios
- `GET /users/online` - Obtener usuarios conectados
- `GET /users/:id/status` - Obtener estado de usuario

## Estados de Conexión

- **Conectado**: Socket.IO activo
- **Desconectado**: Sin conexión WebSocket
- **Reconectando**: Intento de reconexión automática
- **Error**: Problemas de conexión

## Manejo de Errores

- **Conexión perdida**: Reconexión automática
- **Mensajes fallidos**: Reintento automático
- **Offline**: Almacenamiento local con sincronización
- **Rate limiting**: Control de spam

## Notificaciones

- **Push notifications**: Para mensajes nuevos
- **Local notifications**: Cuando app está activa
- **Badge count**: Contador de mensajes no leídos
- **Sonidos**: Alertas audibles configurables

## Performance

- **Lazy loading**: Carga progresiva de mensajes
- **Paginación**: Límite de mensajes por carga
- **Cache**: Almacenamiento local de conversaciones
- **Optimización**: Debounce para eventos de escritura

## Testing

- **Unit tests**: Hooks y utilidades
- **Integration tests**: Flujos de chat
- **E2E tests**: Conversaciones completas
- **Performance tests**: Carga de mensajes

## Roadmap

- [ ] Archivos multimedia (imágenes, documentos)
- [ ] Emojis y reacciones
- [ ] Búsqueda de mensajes
- [ ] Chat grupal
- [ ] Mensajes de voz
- [ ] Encriptación end-to-end

## Archivos Relacionados

- `src/screens/chat/ChatListScreen.tsx`
- `src/screens/chat/ChatScreen.tsx`
- `src/hooks/useSocket.ts`
- `src/hooks/useMusicianRequestSocket.ts`
- `src/components/chat/`
- `src/store/slices/chatSlice.ts`
- `src/services/chatService.ts`
