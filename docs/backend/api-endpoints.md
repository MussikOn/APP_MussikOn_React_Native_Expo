# Endpoints de API

## Descripción General
API RESTful completa con endpoints para todas las funcionalidades de la aplicación, incluyendo autenticación, solicitudes de músicos, chat, pagos y más.

## Estado de Implementación
**90% Implementado** ✅

## Arquitectura

### Backend
- **Node.js + Express**: Framework principal
- **TypeScript**: Tipado estático
- **Firebase**: Base de datos y autenticación
- **Socket.IO**: Comunicación en tiempo real

### Estructura
- **Routes**: Organización por funcionalidad
- **Middleware**: Validación y autenticación
- **Controllers**: Lógica de negocio
- **Models**: Esquemas de datos

## Endpoints Implementados

### Autenticación
```
POST   /auth/login              - Inicio de sesión
POST   /auth/register           - Registro de usuario
POST   /auth/logout             - Cierre de sesión
GET    /auth/me                 - Obtener usuario actual
POST   /auth/refresh            - Renovar token
POST   /auth/forgot-password    - Recuperar contraseña
POST   /auth/reset-password     - Restablecer contraseña
```

### Usuarios
```
GET    /users                   - Listar usuarios
GET    /users/:id               - Obtener usuario específico
PUT    /users/:id               - Actualizar usuario
DELETE /users/:id               - Eliminar usuario
GET    /users/:id/profile       - Obtener perfil público
PUT    /users/:id/profile       - Actualizar perfil
POST   /users/:id/avatar        - Subir avatar
GET    /users/search            - Buscar usuarios
```

### Solicitudes de Músicos
```
GET    /musician-requests              - Listar solicitudes
POST   /musician-requests              - Crear solicitud
GET    /musician-requests/:id          - Obtener solicitud
PUT    /musician-requests/:id          - Actualizar solicitud
DELETE /musician-requests/:id          - Eliminar solicitud
POST   /musician-requests/:id/accept   - Aceptar solicitud
POST   /musician-requests/:id/decline - Rechazar solicitud
POST   /musician-requests/:id/cancel  - Cancelar solicitud
POST   /musician-requests/:id/complete - Completar solicitud
```

### Eventos
```
GET    /events                   - Listar eventos
POST   /events                   - Crear evento
GET    /events/:id               - Obtener evento
PUT    /events/:id               - Actualizar evento
DELETE /events/:id               - Eliminar evento
GET    /events/available         - Eventos disponibles
GET    /events/pending           - Eventos pendientes
GET    /events/assigned          - Eventos asignados
GET    /events/completed         - Eventos completados
GET    /events/cancelled         - Eventos cancelados
```

### Chat
```
GET    /chat/conversations       - Listar conversaciones
GET    /chat/conversations/:id   - Obtener conversación
POST   /chat/conversations       - Crear conversación
GET    /chat/messages/:conversationId - Obtener mensajes
POST   /chat/messages            - Enviar mensaje
PUT    /chat/messages/:id/read   - Marcar como leído
DELETE /chat/messages/:id        - Eliminar mensaje
GET    /chat/users/online        - Usuarios conectados
```

### Notificaciones
```
GET    /notifications            - Listar notificaciones
PUT    /notifications/:id/read   - Marcar como leída
DELETE /notifications/:id        - Eliminar notificación
POST   /notifications/clear-all  - Limpiar todas
GET    /notifications/settings   - Obtener configuración
PUT    /notifications/settings   - Actualizar configuración
POST   /notifications/token      - Registrar token FCM
```

### Pagos
```
GET    /payments/balance         - Obtener saldo
POST   /payments/deposit         - Realizar depósito
POST   /payments/withdraw        - Realizar retiro
GET    /payments/history         - Historial de transacciones
GET    /payments/earnings        - Ganancias del músico
POST   /payments/bank-accounts   - Registrar cuenta bancaria
GET    /payments/bank-accounts   - Listar cuentas bancarias
PUT    /payments/bank-accounts/:id - Actualizar cuenta
DELETE /payments/bank-accounts/:id - Eliminar cuenta
```

### Mapas y Ubicación
```
GET    /maps/events              - Eventos en área
GET    /maps/musicians           - Músicos cercanos
GET    /maps/venues              - Venues disponibles
POST   /maps/geocode             - Geocodificar dirección
GET    /maps/route               - Calcular ruta
GET    /maps/distance            - Calcular distancia
GET    /maps/nearby              - Lugares cercanos
```

### Reels
```
GET    /reels                    - Listar reels
POST   /reels                    - Crear reel
GET    /reels/:id                - Obtener reel
PUT    /reels/:id                - Actualizar reel
DELETE /reels/:id                - Eliminar reel
POST   /reels/:id/like           - Dar like
POST   /reels/:id/comment        - Comentar
POST   /reels/:id/share          - Compartir
GET    /reels/:id/comments       - Obtener comentarios
```

## Autenticación y Autorización

### JWT Tokens
- **Access Token**: Token de acceso principal
- **Refresh Token**: Token para renovar acceso
- **Expiración**: Configurable por entorno
- **Renovación**: Automática antes de expirar

### Middleware de Autenticación
```typescript
const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token requerido' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Token inválido' });
  }
};
```

### Roles y Permisos
- **Usuario**: Acceso básico a funcionalidades
- **Músico**: Acceso completo + funcionalidades específicas
- **Admin**: Acceso administrativo completo
- **Verificación**: Middleware por ruta

## Validación de Datos

### Esquemas de Validación
```typescript
import Joi from 'joi';

const createRequestSchema = Joi.object({
  title: Joi.string().required().min(3).max(100),
  description: Joi.string().required().min(10).max(500),
  date: Joi.date().required().greater('now'),
  location: Joi.object({
    address: Joi.string().required(),
    city: Joi.string().required(),
    coordinates: Joi.object({
      latitude: Joi.number().required(),
      longitude: Joi.number().required()
    })
  }).required(),
  budget: Joi.number().required().min(0),
  genre: Joi.string().required()
});
```

### Middleware de Validación
```typescript
const validateRequest = (schema: Joi.Schema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: 'Datos inválidos',
        errors: error.details.map(detail => detail.message)
      });
    }
    next();
  };
};
```

## Manejo de Errores

### Estructura de Error
```typescript
interface ApiError {
  message: string;
  code: string;
  status: number;
  details?: any;
  timestamp: Date;
}
```

### Middleware de Errores
```typescript
const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', error);

  if (error.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Error de validación',
      errors: error.message
    });
  }

  if (error.name === 'UnauthorizedError') {
    return res.status(401).json({
      message: 'No autorizado'
    });
  }

  return res.status(500).json({
    message: 'Error interno del servidor'
  });
};
```

## Rate Limiting

### Configuración
```typescript
import rateLimit from 'express-rate-limit';

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por ventana
  message: 'Demasiadas requests desde esta IP',
  standardHeaders: true,
  legacyHeaders: false
});
```

### Aplicación
- **Global**: Aplicado a todas las rutas
- **Específico**: Límites por endpoint
- **Por usuario**: Límites por usuario autenticado
- **Por IP**: Límites por dirección IP

## Logging y Monitoreo

### Logging
- **Winston**: Logger principal
- **Niveles**: Error, Warn, Info, Debug
- **Formato**: JSON estructurado
- **Rotación**: Archivos por fecha/tamaño

### Monitoreo
- **Health checks**: Endpoints de estado
- **Métricas**: Performance y uso
- **Alertas**: Notificaciones automáticas
- **Dashboard**: Visualización de métricas

## Testing

### Unit Tests
- **Controllers**: Lógica de endpoints
- **Services**: Lógica de negocio
- **Models**: Validación de datos
- **Middleware**: Funcionalidad de middleware

### Integration Tests
- **Endpoints**: Pruebas de API completas
- **Base de datos**: Operaciones de BD
- **Autenticación**: Flujos de auth
- **Validación**: Esquemas de validación

### E2E Tests
- **Flujos completos**: Desde request hasta response
- **Autenticación**: Login y uso de tokens
- **Autorización**: Verificación de permisos
- **Performance**: Tiempo de respuesta

## Documentación

### Swagger/OpenAPI
- **Especificación**: Documentación automática
- **Ejemplos**: Requests y responses
- **Testing**: Interfaz de pruebas
- **Generación**: Código cliente automático

### Postman Collection
- **Colección**: Endpoints organizados
- **Variables**: Entorno configurado
- **Tests**: Pruebas automáticas
- **Documentación**: Descripción de cada endpoint

## Roadmap

- [ ] GraphQL API
- [ ] API versioning
- [ ] Cache con Redis
- [ ] Webhooks
- [ ] API analytics
- [ ] Rate limiting avanzado
- [ ] API gateway

## Archivos Relacionados

- `../app_mussikon_express/index.ts`
- `../app_mussikon_express/src/routes/`
- `../app_mussikon_express/src/controllers/`
- `../app_mussikon_express/src/middleware/`
- `../app_mussikon_express/src/models/`
- `../app_mussikon_express/src/services/`
- `../app_mussikon_express/src/utils/`
