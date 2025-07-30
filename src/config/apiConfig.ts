// Configuración centralizada para API y sockets
// Solo editar aquí para cambiar la URL base

export const API_CONFIG = {
  // URL base para todas las APIs
  BASE_URL: 'http://192.168.54.39:3001',
  
  // Endpoints de la API
  ENDPOINTS: {
    // Autenticación
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH_TOKEN: '/auth/refresh',
    
    // Usuarios
    PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile',
    
    // Eventos/Solicitudes
    EVENTS: '/events',
    MY_EVENTS: '/events/my-events',
    MY_PENDING: '/events/my-pending',
    MY_ASSIGNED: '/events/my-assigned',
    MY_COMPLETED: '/events/my-completed',
    MY_CANCELLED: '/events/my-cancelled',
    MY_SCHEDULED: '/events/my-scheduled',
    MY_PAST_PERFORMANCES: '/events/my-past-performances',
    AVAILABLE_REQUESTS: '/events/available-requests',
    CREATE_REQUEST: '/events/request-musician',
    ACCEPT_REQUEST: '/events/:eventId/accept',
    CANCEL_REQUEST: '/events/:requestId/cancel',
    COMPLETE_REQUEST: '/events/:requestId/complete',
    DELETE_REQUEST: '/events/:requestId',
    REQUEST_DETAIL: '/events/:eventId',
    
    // Chat
    CONVERSATIONS: '/conversations',
    MESSAGES: '/conversations/:conversationId/messages',
    
    // Notificaciones
    NOTIFICATIONS: '/notifications',
  },
  
  // Configuración de timeout
  TIMEOUT: 10000, // 10 segundos
  
  // Headers por defecto
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  
  // Configuración de reintentos
  RETRY_CONFIG: {
    maxRetries: 3,
    retryDelay: 1000, // 1 segundo
  },
};

// Configuración de Socket.IO
export const SOCKET_CONFIG = {
  // URL del servidor Socket.IO (misma que la API)
  SOCKET_URL: API_CONFIG.BASE_URL,
  
  // Configuración de conexión
  CONNECTION_OPTIONS: {
    transports: ['websocket', 'polling'],
    autoConnect: true,
    timeout: 10000,
    forceNew: true,
  },
  
  // Eventos de Socket.IO
  EVENTS: {
    // Autenticación
    AUTHENTICATE: 'authenticate',
    REGISTER: 'register',
    
    // Notificaciones
    REQUEST_CANCELLED: 'request_cancelled',
    REQUEST_CANCELLED_BY_MUSICIAN: 'request_cancelled_by_musician',
    REQUEST_DELETED: 'request_deleted',
    MUSICIAN_ACCEPTED: 'musician_accepted',
    
    // Chat
    MESSAGE_SENT: 'message_sent',
    MESSAGE_RECEIVED: 'message_received',
    TYPING_START: 'typing_start',
    TYPING_STOP: 'typing_stop',
    
    // Conexión
    CONNECT: 'connect',
    DISCONNECT: 'disconnect',
    CONNECT_ERROR: 'connect_error',
  },
};

// Función para obtener URL completa de un endpoint
export const getApiUrl = (endpoint: string, params?: Record<string, string>): string => {
  let url = `${API_CONFIG.BASE_URL}${endpoint}`;
  
  // Reemplazar parámetros en la URL
  if (params) {
    Object.keys(params).forEach(key => {
      url = url.replace(`:${key}`, params[key]);
    });
  }
  
  return url;
};

// Función para obtener URL de Socket.IO
export const getSocketUrl = (): string => {
  return SOCKET_CONFIG.SOCKET_URL;
};

// Función para obtener configuración de conexión de Socket.IO
export const getSocketConnectionOptions = () => {
  return SOCKET_CONFIG.CONNECTION_OPTIONS;
};

// Función para obtener eventos de Socket.IO
export const getSocketEvents = () => {
  return SOCKET_CONFIG.EVENTS;
};

// Función para obtener configuración de API
export const getApiConfig = () => {
  return API_CONFIG;
};

// Función para obtener configuración de timeout
export const getApiTimeout = (): number => {
  return API_CONFIG.TIMEOUT;
};

// Función para obtener headers por defecto
export const getDefaultHeaders = () => {
  return API_CONFIG.DEFAULT_HEADERS;
};

// Función para obtener configuración de reintentos
export const getRetryConfig = () => {
  return API_CONFIG.RETRY_CONFIG;
}; 