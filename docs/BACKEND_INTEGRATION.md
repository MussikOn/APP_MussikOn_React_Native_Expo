# 🔌 Integración con Backend - MussikOn

## 🎯 **Descripción General**

El backend de MussikOn está desarrollado en **Node.js + Express + TypeScript** y proporciona una API REST completa para la gestión de usuarios, eventos, solicitudes de músicos y comunicación en tiempo real.

## 🏗️ **Arquitectura del Backend**

### **Tecnologías Utilizadas**
- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **TypeScript** - Tipado estático
- **Firebase Firestore** - Base de datos NoSQL
- **JWT** - Autenticación con tokens
- **Socket.IO** - Comunicación en tiempo real
- **AWS S3** - Almacenamiento de archivos
- **Nodemailer** - Envío de emails
- **bcrypt** - Hash de contraseñas

### **Estructura del Proyecto**
```
APP_MussikOn_Express/
├── src/
│   ├── routes/           # Rutas de la API
│   ├── controllers/      # Controladores de lógica
│   ├── models/          # Modelos de datos
│   ├── middleware/      # Middlewares personalizados
│   ├── utils/           # Utilidades y helpers
│   └── sockets/         # Configuración de Socket.IO
├── docs/                # Documentación del backend
└── index.ts             # Punto de entrada
```

## 🔐 **Sistema de Autenticación**

### **Endpoints de Autenticación**
- `POST /auth/register` - Registro de usuario
- `POST /auth/login` - Login de usuario
- `GET /auth/verify` - Verificar token
- `PUT /auth/update/:userEmail` - Actualizar perfil
- `DELETE /auth/delete` - Eliminar usuario

### **Roles de Usuario**
- **musico** - Músicos que ofrecen servicios
- **eventCreator** - Organizadores de eventos
- **usuario** - Usuario básico
- **adminJunior** - Administrador junior
- **adminMidLevel** - Administrador medio
- **adminSenior** - Administrador senior
- **superAdmin** - Super administrador

### **Seguridad**
- **JWT tokens** con expiración configurable
- **Validación de roles** en cada endpoint
- **Sanitización de inputs** para prevenir inyecciones
- **Rate limiting** para prevenir abuso
- **CORS configurado** para producción

## 🎵 **Sistema de Solicitudes de Músicos**

### **Endpoints de Solicitudes (usando /events/)**
- `POST /events/request-musician` - Crear solicitud de músico
- `GET /events/my-pending` - Solicitudes pendientes del organizador
- `GET /events/my-assigned` - Solicitudes asignadas del organizador
- `GET /events/my-completed` - Solicitudes completadas del organizador
- `GET /events/my-events` - Todas las solicitudes del usuario
- `GET /events/available-requests` - Solicitudes disponibles para músicos
- `GET /events/my-scheduled` - Solicitudes agendadas del músico
- `GET /events/my-past-performances` - Historial de actuaciones del músico
- `GET /events/:id` - Obtener solicitud por ID
- `PUT /events/:id` - Actualizar solicitud
- `DELETE /events/:id` - Eliminar solicitud
- `PATCH /events/:id/cancel` - Cancelar solicitud
- `PATCH /events/:id/complete` - Completar solicitud
- `POST /events/:id/accept` - Aceptar solicitud

### **Estados de Solicitudes**
- **pending_musician** - Esperando asignación de músico
- **assigned** - Músico asignado
- **completed** - Solicitud completada
- **cancelled** - Solicitud cancelada

## 🎼 **Solicitudes de Músicos**

### **Endpoints de Solicitudes**
- `POST /musician-requests` - Crear solicitud ✅
- `GET /musician-requests/:id` - Obtener solicitud por ID ✅
- `PUT /musician-requests/:id` - Actualizar solicitud ✅
- `DELETE /musician-requests/:id` - Eliminar solicitud ✅
- `GET /musician-requests/:id/status` - Consultar estado ✅
- `POST /musician-requests/accept` - Aceptar solicitud ✅
- `POST /musician-requests/cancel` - Cancelar solicitud ✅

### **Estados de Solicitudes**
- **pendiente** - Esperando aceptación
- **asignada** - Músico asignado
- **cancelada** - Solicitud cancelada
- **completada** - Solicitud completada
- **no_asignada** - No se encontró músico

### **Tipos de Eventos**
- **concierto** - Conciertos y presentaciones
- **boda** - Bodas y ceremonias
- **culto** - Servicios religiosos
- **evento_corporativo** - Eventos empresariales
- **festival** - Festivales musicales
- **fiesta_privada** - Fiestas privadas
- **graduacion** - Graduaciones
- **cumpleanos** - Cumpleaños
- **otro** - Otros tipos de eventos

### **Instrumentos Soportados**
- **guitarra** - Guitarra acústica/eléctrica
- **piano** - Piano y teclados
- **bajo** - Bajo eléctrico
- **bateria** - Batería y percusión
- **saxofon** - Saxofón
- **trompeta** - Trompeta
- **violin** - Violín
- **canto** - Voz y canto
- **teclado** - Teclados electrónicos
- **flauta** - Flauta
- **otro** - Otros instrumentos

## 🖼️ **Gestión de Imágenes**

### **Endpoints de Imágenes**
- `POST /imgs/upload` - Subir imagen
- `GET /imgs/:id` - Obtener imagen
- `DELETE /imgs/:id` - Eliminar imagen
- `GET /imgs/getUrl/:key` - Obtener URL firmada

### **Características**
- **Almacenamiento seguro** en AWS S3 (idriveE2)
- **URLs firmadas** con expiración
- **Metadatos personalizables** para cada imagen
- **Optimización automática** de imágenes
- **Múltiples formatos** soportados

## 🔧 **Sistema de Administración**

### **Endpoints de Administración**
- `GET /admin/users` - Gestión de usuarios
- `GET /admin/events` - Gestión de eventos
- `GET /admin/musician-requests` - Gestión de solicitudes
- `GET /admin/images` - Gestión de imágenes

### **Funcionalidades Administrativas**
- **Panel de control** centralizado
- **Gestión de usuarios** con roles granulares
- **Monitoreo de eventos** y solicitudes
- **Estadísticas** en tiempo real
- **Acceso restringido** por permisos

## 🔌 **Socket.IO - Comunicación en Tiempo Real**

### **Eventos de Usuario**
```javascript
// Usuario conectado
socket.emit('user_connected', {
  userId: 'user_123',
  name: 'Juan Pérez',
  timestamp: '2024-01-15T10:30:00Z'
});

// Usuario desconectado
socket.emit('user_disconnected', {
  userId: 'user_123',
  timestamp: '2024-01-15T11:30:00Z'
});
```

### **Eventos de Eventos**
```javascript
// Nuevo evento creado
socket.emit('event_created', {
  id: 'event_123',
  eventName: 'Boda de María y Juan',
  eventType: 'boda',
  instrument: 'piano',
  location: 'Salón de Eventos ABC',
  date: '2024-12-25',
  budget: 50000,
  createdAt: '2024-01-15T10:30:00Z'
});

// Estado de evento cambiado
socket.emit('event_status_changed', {
  id: 'event_123',
  oldStatus: 'pending_musician',
  newStatus: 'musician_assigned',
  assignedMusicianId: 'musician_456',
  changedAt: '2024-01-15T12:30:00Z'
});
```

### **Eventos de Solicitudes**
```javascript
// Nueva solicitud de músico
socket.emit('new_event_request', {
  id: 'request_123456',
  userId: 'user_789',
  eventType: 'boda',
  instrument: 'piano',
  location: 'Salón de Eventos ABC',
  date: '2024-12-25',
  budget: 50000,
  createdAt: '2024-01-15T10:30:00Z'
});

// Músico aceptó solicitud
socket.emit('musician_accepted', {
  requestId: 'request_123456',
  musician: {
    id: 'musician_456',
    name: 'Carlos Rodríguez',
    instrument: 'piano'
  },
  assignedAt: '2024-01-15T12:00:00Z'
});
```

## 📊 **Configuración del Cliente**

### **Variables de Entorno**
```typescript
// src/config/environment.ts
export const API_URL = "http://localhost:1000";
export const SOCKET_URL = "ws://localhost:1000";
```

### **Configuración de Axios**
```typescript
// src/services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token
api.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
```

### **Configuración de Socket.IO**
```typescript
// src/utils/socket.ts
import io from 'socket.io-client';

const socket = io(SOCKET_URL, {
  auth: {
    token: 'YOUR_JWT_TOKEN'
  },
  transports: ['websocket', 'polling']
});

socket.on('connect', () => {
  console.log('Conectado al servidor');
});

socket.on('disconnect', () => {
  console.log('Desconectado del servidor');
});
```

## 🔒 **Seguridad y Validación**

### **Autenticación**
- **JWT tokens** con expiración de 24 horas
- **Refresh tokens** próximamente
- **Validación de roles** en cada endpoint
- **Middleware de autenticación** implementado

### **Validación de Datos**
- **Sanitización de inputs** para prevenir inyecciones
- **Validación de tipos** con TypeScript
- **Límites de tamaño** para archivos
- **Validación de formatos** (email, fecha, etc.)

### **Rate Limiting**
- **Límites por usuario** y por IP
- **Protección contra spam** y abuso
- **Timeouts configurables** por endpoint
- **Logs de seguridad** implementados

## 📈 **Performance y Escalabilidad**

### **Optimizaciones Implementadas**
- **Compresión de respuestas** con gzip
- **Caché de consultas** frecuentes
- **Optimización de consultas** a Firestore
- **CDN para imágenes** con AWS S3

### **Monitoreo**
- **Logs estructurados** para debugging
- **Métricas de rendimiento** en tiempo real
- **Health checks** implementados
- **Alertas automáticas** para errores

## 🧪 **Testing**

### **Endpoints de Prueba**
- `GET /test` - Verificar que el servidor funciona
- `GET /test/token-info` - Verificar estructura del token
- `GET /test/generate-token` - Generar token de prueba
- `GET /test/musician-requests` - Datos de prueba para solicitudes

### **Documentación Interactiva**
- **Swagger UI**: `http://localhost:1000/api-docs`
- **Redoc**: `http://localhost:1000/redoc`
- **Documentación completa** con ejemplos

## 🚀 **Despliegue**

### **Configuración de Producción**
- **Variables de entorno** configuradas
- **CORS** configurado para dominios específicos
- **Rate limiting** activado
- **Logs de seguridad** habilitados

### **URLs de Acceso**
- **API Base**: `http://localhost:1000`
- **Swagger UI**: `http://localhost:1000/api-docs`
- **Redoc**: `http://localhost:1000/redoc`
- **Página de inicio**: `http://localhost:1000/`

## 📞 **Soporte y Mantenimiento**

### **Documentación**
- **README completo** y actualizado
- **Documentación técnica** detallada
- **Guías de integración** frontend
- **Ejemplos de código** incluidos

### **Soporte Técnico**
- **Issues de GitHub** para bugs
- **Discussions** para preguntas
- **Email** para consultas urgentes
- **Documentación interactiva** disponible

---

**Última actualización**: Diciembre 2024  
**Versión del backend**: 1.0.0  
**Estado**: Producción - CRUD completo implementado 