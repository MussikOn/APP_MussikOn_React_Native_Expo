// Configuración centralizada para API y sockets
// Alineada completamente con el backend Express
export const API_CONFIG = {
  // URL base para todas las APIs
  BASE_URL: process.env.EXPO_PUBLIC_API_URL || 'http://192.168.54.68:3001', // Corregido al puerto correcto del backend
  
  // Endpoints de la API - ALINEADOS CON BACKEND
  ENDPOINTS: {
    // Autenticación
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH_TOKEN: '/auth/refresh',
    GOOGLE_AUTH: '/auth/google',
    
    // Usuarios
    PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile',
    
    // Solicitudes de Músicos - ALINEADO CON BACKEND REAL
    MUSICIAN_REQUESTS: '/musician-requests',
    MY_MUSICIAN_REQUESTS: '/musician-requests/my-requests',
    // CORREGIDO: Usar el endpoint real del backend
    AVAILABLE_MUSICIAN_REQUESTS: '/search/musician-requests',
    ASSIGNED_MUSICIAN_REQUESTS: '/musician-requests/assigned',
    // CORREGIDO: Estos endpoints no existen en el backend, usar actualización directa
    ACCEPT_MUSICIAN_REQUEST: '/musician-requests', // Se usará PUT para cambiar status
    CANCEL_MUSICIAN_REQUEST: '/musician-requests', // Se usará PUT para cambiar status
    COMPLETE_MUSICIAN_REQUEST: '/musician-requests/:requestId/complete',
    MUSICIAN_REQUEST_STATUS: '/musician-requests/:id/status',
    MUSICIAN_REQUEST_STATS: '/musician-requests/stats',
    SEARCH_MUSICIAN_REQUESTS: '/search/musician-requests',
    
    // Eventos (DESHABILITADOS - Solo para referencia)
    EVENTS: '/events',
    MY_EVENTS: '/events/my-events',
    CREATE_EVENT: '/events',
    UPDATE_EVENT: '/events/:id',
    DELETE_EVENT: '/events/:id',
    
    // Chat
    CONVERSATIONS: '/conversations',
    MESSAGES: '/conversations/:conversationId/messages',
    SEND_MESSAGE: '/conversations/:conversationId/messages',
    
    // Notificaciones
    NOTIFICATIONS: '/notifications',
    MARK_READ: '/notifications/:id/read',
    MARK_ALL_READ: '/notifications/mark-all-read',
    
    // Sistema de Pagos - COMPLETO ALINEADO CON BACKEND
    PAYMENT_BALANCE: '/payment-system/my-balance',
    PAYMENT_STATISTICS: '/payment-system/statistics',
    
    // Cuentas Bancarias
    BANK_ACCOUNTS: '/bank-accounts/my-accounts',
    BANK_ACCOUNT_REGISTER: '/bank-accounts/register',
    BANK_ACCOUNT_UPDATE: '/bank-accounts/:id',
    BANK_ACCOUNT_DELETE: '/bank-accounts/:id',
    BANK_ACCOUNT_SET_DEFAULT: '/bank-accounts/:id/set-default',
    
    // Depósitos
    DEPOSIT: '/payment-system/deposit',
    DEPOSIT_HISTORY: '/payment-system/my-deposits',
    DEPOSIT_BY_ID: '/payment-system/deposits/:id',
    
    // Pagos de Eventos
    PAY_MUSICIAN: '/events/:eventId/pay-musician',
    EVENT_PAYMENTS: '/payments/event-payments',
    CALCULATE_COMMISSION: '/payments/calculate-commission',
    
    // Ganancias de Músicos
    MUSICIAN_EARNINGS: '/musicians/earnings',
    AVAILABLE_EARNINGS: '/musicians/available-earnings',
    WITHDRAW_EARNINGS: '/musicians/withdraw-earnings',
    
    // Solicitudes de Retiro
    WITHDRAWAL_REQUESTS: '/payments/withdrawals',
    WITHDRAWAL_REQUEST_BY_ID: '/payments/withdrawals/:id',
    CANCEL_WITHDRAWAL: '/payments/withdrawals/:id/cancel',
    
    // Historial de Transacciones
    TRANSACTION_HISTORY: '/payments/transactions',
    
    // Reportes
    INCOME_REPORT: '/payments/income-report',
    EXPENSE_REPORT: '/payments/expense-report',
    
    // Notificaciones de Pagos
    PAYMENT_NOTIFICATIONS_SUBSCRIBE: '/payments/notifications/subscribe',
    PAYMENT_NOTIFICATIONS_UNSUBSCRIBE: '/payments/notifications/unsubscribe',
    
    // Búsqueda y Filtros
    SEARCH: '/search',
    ADVANCED_SEARCH: '/search/advanced',
    
    // Geolocalización
    NEARBY_MUSICIANS: '/geolocation/nearby-musicians',
    UPDATE_LOCATION: '/geolocation/update-location',
    
    // Imágenes
    UPLOAD_IMAGE: '/images/upload',
    DELETE_IMAGE: '/images/:id',
    
    // Push Notifications
    PUSH_TOKEN: '/push-notifications/token',
    PUSH_SUBSCRIBE: '/push-notifications/subscribe',
    PUSH_UNSUBSCRIBE: '/push-notifications/unsubscribe',
  },
  
  // Configuración de timeout
  TIMEOUT: 15000, // 15 segundos para operaciones complejas
  
  // Headers por defecto
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'User-Agent': 'MussikOn-Mobile-App/1.0',
  },
  
  // Configuración de reintentos
  RETRY_CONFIG: {
    maxRetries: 3,
    retryDelay: 1000, // 1 segundo
    backoffMultiplier: 2, // Multiplicador exponencial
  },
  
  // Configuración de caché
  CACHE_CONFIG: {
    enabled: true,
    maxAge: 5 * 60 * 1000, // 5 minutos
    maxSize: 50, // Máximo 50 elementos en caché
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