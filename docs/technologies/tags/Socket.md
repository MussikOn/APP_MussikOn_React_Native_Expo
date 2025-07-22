# Uso de Sockets en el Proyecto

## ¿De dónde viene?
- **Origen:** `socket.io-client` (dependencia externa)
- **Importación:**
  ```typescript
  import { io } from 'socket.io-client';
  ```
- **Hook personalizado:** `src/hooks/useSocket.tsx`

## ¿Qué hace?
- Permite comunicación en tiempo real entre cliente y servidor.
- Usado para chat, notificaciones, actualizaciones en vivo.

## ¿Cómo se usa?
```tsx
const socket = io(SOCKET_URL);
socket.on('connect', () => { ... });
socket.emit('evento', data);
```

## Ejemplo de uso en el proyecto
```tsx
import { socket } from '@utils/socket';

useEffect(() => {
  socket.on('mensaje', handleMensaje);
  return () => socket.off('mensaje', handleMensaje);
}, []);
```

## ¿Por qué se eligió?
- Permite comunicación bidireccional y en tiempo real.
- Alternativas: WebSockets nativos (más bajo nivel), polling HTTP (menos eficiente). 