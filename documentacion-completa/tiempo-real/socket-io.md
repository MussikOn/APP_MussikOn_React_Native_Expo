# 🌐 Socket.IO - Comunicación en Tiempo Real

## 🤔 ¿Qué es Socket.IO?

**Socket.IO** es una librería que permite la comunicación en **tiempo real** entre el cliente (tu app) y el servidor. Es como tener una "línea telefónica" siempre abierta entre tu teléfono y el servidor.

## 🎯 ¿Por qué Socket.IO?

### El Problema sin Socket.IO:
```javascript
// Sin Socket.IO - comunicación lenta
function verificarNuevasSolicitudes() {
    // Tienes que preguntar constantemente
    setInterval(() => {
        fetch('/api/solicitudes')
            .then(response => response.json())
            .then(data => {
                if (data.nuevasSolicitudes) {
                    mostrarNotificacion();
                }
            });
    }, 5000); // Cada 5 segundos
}
```

### La Solución con Socket.IO:
```javascript
// Con Socket.IO - comunicación instantánea
socket.on('nueva_solicitud', (data) => {
    // Recibes notificación inmediatamente
    mostrarNotificacion(data);
});
```

## 🧠 Analogía Simple

Imagina Socket.IO como un **walkie-talkie**:

### Sin Socket.IO:
- Tienes que llamar al servidor cada vez que quieres saber algo
- Es lento y consume mucha batería
- Puedes perder información importante

### Con Socket.IO:
- Tienes una conexión siempre abierta
- El servidor te avisa inmediatamente cuando pasa algo
- Es rápido y eficiente

## 🏗️ Arquitectura de Socket.IO

### Flujo de Comunicación:
```
Cliente (App) ←→ Socket.IO ←→ Servidor
```

### Eventos de Socket.IO:
1. **Conexión**: Cliente se conecta al servidor
2. **Desconexión**: Cliente se desconecta del servidor
3. **Emisión**: Enviar mensaje al servidor
4. **Escucha**: Recibir mensaje del servidor

## 🔧 Configuración de Socket.IO en MussikOn

### 1. **Configuración del Cliente**
```javascript
// src/contexts/SocketContext.tsx
import { io, Socket } from 'socket.io-client';

export const SocketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    if (!user?.userEmail) return;

    // Crear conexión Socket.IO
    const socketInstance = io(getSocketUrl(), {
      transports: ['websocket'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    // Eventos de conexión
    socketInstance.on('connect', () => {
      console.log('🔌 Socket.IO conectado');
      setIsConnected(true);
      
      // Autenticar el usuario con el servidor
      socketInstance.emit('authenticate', {
        userEmail: user.userEmail,
        userId: user.userEmail,
      });
    });

    socketInstance.on('disconnect', () => {
      console.log('🔌 Socket.IO desconectado');
      setIsConnected(false);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [user?.userEmail]);
};
```

### 2. **Configuración del Servidor**
```javascript
// En el servidor (Node.js)
const io = require('socket.io')(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('Usuario conectado:', socket.id);

  // Autenticar usuario
  socket.on('authenticate', (data) => {
    socket.userEmail = data.userEmail;
    socket.join(data.userEmail); // Unirse a sala personal
    console.log('Usuario autenticado:', data.userEmail);
  });

  // Manejar desconexión
  socket.on('disconnect', () => {
    console.log('Usuario desconectado:', socket.id);
  });
});
```

## 🔄 Eventos en Socket.IO

### 1. **Eventos de Conexión**
```javascript
// src/contexts/SocketContext.tsx
socketInstance.on('connect', () => {
  console.log('🔌 Conectado al servidor');
  setIsConnected(true);
});

socketInstance.on('disconnect', () => {
  console.log('🔌 Desconectado del servidor');
  setIsConnected(false);
});

socketInstance.on('connect_error', (error) => {
  console.error('❌ Error de conexión:', error);
  setIsConnected(false);
});
```

### 2. **Eventos de Negocio**
```javascript
// Evento de solicitud cancelada por organizador
socketInstance.on('request_cancelled', async (data) => {
  console.log('📢 Solicitud cancelada:', data);
  
  // Crear notificación
  const notification = notificationService.createNotificationFromServer(
    data, 
    user.userEmail, 
    'request_cancelled'
  );

  // Guardar notificación
  await notificationService.saveNotification(notification);
  
  // Mostrar alerta
  Alert.alert(
    'Solicitud Cancelada',
    `El organizador ha cancelado la solicitud "${data.event?.eventName}"`
  );
});

// Evento de músico aceptado
socketInstance.on('musician_accepted', async (data) => {
  console.log('📢 Músico aceptó la solicitud:', data);
  
  const notification = notificationService.createNotificationFromServer(
    data, 
    user.userEmail, 
    'musician_accepted'
  );

  await notificationService.saveNotification(notification);
  
  Alert.alert(
    '¡Músico Aceptó tu Solicitud!',
    `${data.musician?.name} ha aceptado tu solicitud "${data.event?.eventName}"`
  );
});

// Evento de nueva solicitud (para músicos)
socketInstance.on('new_event_request', async (data) => {
  console.log('📢 Nueva solicitud recibida:', data);
  
  // Solo mostrar a músicos
  if (user.roll === 'musico') {
    const notification = notificationService.createNotificationFromServer(
      data, 
      user.userEmail, 
      'new_event_request'
    );

    await notificationService.saveNotification(notification);
    
    Alert.alert(
      '¡Nueva Solicitud Disponible!',
      `Nueva solicitud de ${data.eventType} - ${data.instrument} - $${data.budget}`,
      [
        {
          text: 'Ver Solicitudes',
          onPress: () => {
            // Navegar a la pantalla de solicitudes
          },
        },
        {
          text: 'Cerrar',
          style: 'cancel',
        },
      ]
    );
  }
});
```

## 📡 Emitir Eventos

### 1. **Emitir desde el Cliente**
```javascript
// src/services/musicianRequests.ts
export const emitRequestCancelled = (socket: Socket, requestId: string) => {
  socket.emit('request_cancelled', {
    requestId,
    timestamp: new Date().toISOString(),
  });
};

export const emitMusicianAccepted = (socket: Socket, requestId: string, musicianId: string) => {
  socket.emit('musician_accepted', {
    requestId,
    musicianId,
    timestamp: new Date().toISOString(),
  });
};

export const emitNewRequest = (socket: Socket, requestData: any) => {
  socket.emit('new_event_request', {
    ...requestData,
    timestamp: new Date().toISOString(),
  });
};
```

### 2. **Emitir desde el Servidor**
```javascript
// En el servidor
// Notificar a todos los músicos sobre nueva solicitud
io.emit('new_event_request', {
  eventType: 'Boda',
  instrument: 'Guitarra',
  budget: 300,
  location: 'Madrid',
  eventName: 'Boda de María y Juan'
});

// Notificar a un usuario específico
io.to(userEmail).emit('request_cancelled', {
  eventName: 'Boda de María y Juan',
  reason: 'Cambio de fecha'
});
```

## 🔄 Manejo de Estados de Conexión

### 1. **Hook Personalizado para Socket**
```javascript
// src/hooks/useSocket.tsx
export const useSocket = () => {
  const { socket, isConnected } = useContext(SocketContext);
  
  const emitEvent = useCallback((eventName: string, data: any) => {
    if (socket && isConnected) {
      socket.emit(eventName, data);
    } else {
      console.warn('Socket no conectado');
    }
  }, [socket, isConnected]);

  const listenToEvent = useCallback((eventName: string, callback: (data: any) => void) => {
    if (socket) {
      socket.on(eventName, callback);
      
      // Cleanup
      return () => {
        socket.off(eventName, callback);
      };
    }
  }, [socket]);

  return {
    socket,
    isConnected,
    emitEvent,
    listenToEvent,
  };
};
```

### 2. **Componente de Estado de Conexión**
```javascript
// src/components/ui/SocketStatusIndicator.tsx
import { useSocket } from '@contexts/SocketContext';

export const SocketStatusIndicator = () => {
  const { isConnected } = useSocket();

  return (
    <View style={styles.container}>
      <View style={[
        styles.indicator, 
        { backgroundColor: isConnected ? '#23cd73' : '#eb2323' }
      ]} />
      <Text style={styles.text}>
        {isConnected ? 'Conectado' : 'Desconectado'}
      </Text>
    </View>
  );
};
```

## 🔒 Autenticación con Socket.IO

### 1. **Autenticación en el Cliente**
```javascript
// src/contexts/SocketContext.tsx
socketInstance.on('connect', () => {
  // Autenticar inmediatamente después de conectar
  socketInstance.emit('authenticate', {
    userEmail: user.userEmail,
    userId: user.userEmail,
    token: await getToken(), // Token JWT
  });
});

// Escuchar respuesta de autenticación
socketInstance.on('authenticated', (data) => {
  console.log('✅ Usuario autenticado:', data);
});

socketInstance.on('authentication_error', (error) => {
  console.error('❌ Error de autenticación:', error);
  // Manejar error de autenticación
});
```

### 2. **Autenticación en el Servidor**
```javascript
// En el servidor
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    socket.userId = decoded.userId;
    socket.userEmail = decoded.userEmail;
    
    next();
  } catch (error) {
    next(new Error('Authentication error'));
  }
});

io.on('connection', (socket) => {
  console.log('Usuario autenticado conectado:', socket.userEmail);
  
  // Unirse a sala personal
  socket.join(socket.userEmail);
  
  // Unirse a sala de músicos si es músico
  if (socket.userRole === 'musico') {
    socket.join('musicians');
  }
});
```

## 📱 Salas (Rooms) en Socket.IO

### ¿Qué son las Salas?
Son como "grupos de chat" donde puedes enviar mensajes a usuarios específicos.

### 1. **Salas Personales**
```javascript
// En el servidor
socket.on('authenticate', (data) => {
  // Cada usuario tiene su propia sala
  socket.join(data.userEmail);
});

// Enviar mensaje a usuario específico
io.to('juan@email.com').emit('private_message', {
  message: 'Hola Juan, tienes una nueva solicitud'
});
```

### 2. **Salas por Rol**
```javascript
// En el servidor
socket.on('authenticate', (data) => {
  // Sala para todos los músicos
  if (data.role === 'musico') {
    socket.join('musicians');
  }
  
  // Sala para todos los organizadores
  if (data.role === 'organizador') {
    socket.join('organizers');
  }
});

// Notificar a todos los músicos
io.to('musicians').emit('new_event_request', {
  eventType: 'Boda',
  instrument: 'Guitarra',
  budget: 300
});
```

## 🔄 Reconexión Automática

### 1. **Configuración de Reconexión**
```javascript
// src/contexts/SocketContext.tsx
const socketInstance = io(getSocketUrl(), {
  transports: ['websocket'],
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 20000,
});

// Eventos de reconexión
socketInstance.on('reconnect', (attemptNumber) => {
  console.log('🔄 Reconectado después de', attemptNumber, 'intentos');
});

socketInstance.on('reconnect_attempt', (attemptNumber) => {
  console.log('🔄 Intento de reconexión:', attemptNumber);
});

socketInstance.on('reconnect_error', (error) => {
  console.error('❌ Error de reconexión:', error);
});

socketInstance.on('reconnect_failed', () => {
  console.error('❌ Falló la reconexión');
});
```

### 2. **Manejo de Estado de Reconexión**
```javascript
// src/contexts/SocketContext.tsx
const [reconnectionAttempts, setReconnectionAttempts] = useState(0);

socketInstance.on('reconnect_attempt', (attemptNumber) => {
  setReconnectionAttempts(attemptNumber);
});

socketInstance.on('reconnect', () => {
  setReconnectionAttempts(0);
  // Reautenticar después de reconectar
  socketInstance.emit('authenticate', {
    userEmail: user.userEmail,
    userId: user.userEmail,
  });
});
```

## 🎯 Casos de Uso en MussikOn

### 1. **Notificaciones en Tiempo Real**
```javascript
// Cuando un organizador cancela una solicitud
export const cancelRequest = async (requestId: string) => {
  try {
    // Actualizar en base de datos
    await api.delete(`/requests/${requestId}`);
    
    // Notificar a músicos en tiempo real
    socket.emit('request_cancelled', {
      requestId,
      timestamp: new Date().toISOString(),
    });
    
  } catch (error) {
    console.error('Error cancelando solicitud:', error);
  }
};
```

### 2. **Chat en Tiempo Real**
```javascript
// Enviar mensaje
export const sendMessage = (conversationId: string, message: string) => {
  socket.emit('send_message', {
    conversationId,
    message,
    timestamp: new Date().toISOString(),
  });
};

// Recibir mensaje
socket.on('new_message', (data) => {
  // Actualizar chat en tiempo real
  updateChatMessages(data);
});
```

### 3. **Estado de Conexión de Músicos**
```javascript
// Músico se conecta/desconecta
socket.on('musician_online', (musicianId) => {
  updateMusicianStatus(musicianId, 'online');
});

socket.on('musician_offline', (musicianId) => {
  updateMusicianStatus(musicianId, 'offline');
});
```

## 🎯 Ventajas de Socket.IO

### ✅ **Pros:**
1. **Comunicación instantánea**: Sin delays
2. **Bidireccional**: Cliente y servidor pueden enviar mensajes
3. **Reconexión automática**: Se reconecta si se pierde la conexión
4. **Salas**: Enviar mensajes a grupos específicos
5. **Escalable**: Funciona bien con muchos usuarios

### ❌ **Contras:**
1. **Complejidad**: Más difícil de implementar que HTTP
2. **Recursos**: Consume más batería y datos
3. **Debugging**: Más difícil de debuggear
4. **Servidor**: Requiere servidor compatible

## 🎯 Resumen

1. **Socket.IO**: Comunicación en tiempo real
2. **Conexión**: Línea siempre abierta con el servidor
3. **Eventos**: Enviar y recibir mensajes instantáneos
4. **Autenticación**: Verificar identidad del usuario
5. **Salas**: Grupos para mensajes específicos
6. **Reconexión**: Se reconecta automáticamente
7. **Notificaciones**: Alertas instantáneas
8. **Chat**: Mensajería en tiempo real
9. **Estado**: Saber quién está conectado
10. **Escalabilidad**: Funciona con muchos usuarios

## ➡️ Siguiente Paso

Ahora que entiendes Socket.IO, vamos a aprender sobre los **eventos en tiempo real** y cómo se manejan las notificaciones instantáneas en MussikOn.

[Eventos en Tiempo Real →](./eventos-tiempo-real.md) 