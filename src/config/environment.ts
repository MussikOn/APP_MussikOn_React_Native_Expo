// Configuración centralizada de URLs para diferentes entornos
// Importar configuración centralizada
import { API_CONFIG } from './apiConfig';

// Configuración del entorno
export const ENV = {
  // URLs de la API
  API_URL: API_CONFIG.baseURL,
  SOCKET_URL: API_CONFIG.socket.url,
  
  // Configuración de la API
  API_VERSION: API_CONFIG.version,
  API_TIMEOUT: API_CONFIG.timeout,
  API_RETRIES: API_CONFIG.retries,
  
  // Configuración de sockets
  SOCKET_RECONNECT_ATTEMPTS: API_CONFIG.socket.reconnectAttempts,
  SOCKET_RECONNECT_DELAY: API_CONFIG.socket.reconnectDelay,
  SOCKET_HEARTBEAT_INTERVAL: API_CONFIG.socket.heartbeatInterval,
  
  // Configuración de timeouts
  REQUEST_TIMEOUT: API_CONFIG.timeouts.request,
  RESPONSE_TIMEOUT: API_CONFIG.timeouts.response,
  UPLOAD_TIMEOUT: API_CONFIG.timeouts.upload,
  DOWNLOAD_TIMEOUT: API_CONFIG.timeouts.download,
  
  // Configuración de reintentos
  MAX_RETRIES: API_CONFIG.retry.attempts,
  RETRY_DELAY: API_CONFIG.retry.delay,
  RETRY_BACKOFF: API_CONFIG.retry.backoff,
  MAX_RETRY_DELAY: API_CONFIG.retry.maxDelay,
  
  // Configuración de caché
  CACHE_ENABLED: API_CONFIG.cache.enabled,
  CACHE_TTL: API_CONFIG.cache.ttl,
  CACHE_MAX_SIZE: API_CONFIG.cache.maxSize,
  
  // Configuración de logging
  LOGGING_ENABLED: API_CONFIG.logging.enabled,
  LOGGING_LEVEL: API_CONFIG.logging.level,
  
  // Configuración de seguridad
  INCLUDE_CREDENTIALS: API_CONFIG.security.includeCredentials,
  WITH_CREDENTIALS: API_CONFIG.security.withCredentials,
  
  // Configuración de archivos
  MAX_FILE_SIZE: API_CONFIG.files.maxSize,
  ALLOWED_FILE_TYPES: API_CONFIG.files.allowedTypes,
  FILE_UPLOAD_TIMEOUT: API_CONFIG.files.uploadTimeout,
  
  // Configuración de geolocalización
  GEOLOCATION_HIGH_ACCURACY: API_CONFIG.geolocation.enableHighAccuracy,
  GEOLOCATION_TIMEOUT: API_CONFIG.geolocation.timeout,
  GEOLOCATION_MAX_AGE: API_CONFIG.geolocation.maximumAge,
  GEOLOCATION_MAX_DISTANCE: API_CONFIG.geolocation.maxDistance,
  
  // Configuración de notificaciones
  PUSH_NOTIFICATIONS_SUPPORTED: API_CONFIG.notifications.push.supported,
  IN_APP_NOTIFICATIONS_ENABLED: API_CONFIG.notifications.inApp.enabled,
  
  // Configuración de eventos
  MAX_EVENT_DURATION: API_CONFIG.events.maxDuration,
  MIN_EVENT_DURATION: API_CONFIG.events.minDuration,
  MAX_EVENT_BUDGET: API_CONFIG.events.maxBudget,
  MIN_EVENT_BUDGET: API_CONFIG.events.minBudget,
  
  // Configuración de chat
  MAX_MESSAGE_LENGTH: API_CONFIG.chat.maxMessageLength,
  TYPING_TIMEOUT: API_CONFIG.chat.typingTimeout,
  MESSAGE_RETENTION: API_CONFIG.chat.messageRetention,
  
  // Configuración de pagos
  PAYMENT_CURRENCY: API_CONFIG.payments.currency,
  MIN_PAYMENT_AMOUNT: API_CONFIG.payments.minAmount,
  MAX_PAYMENT_AMOUNT: API_CONFIG.payments.maxAmount,
  REFUND_WINDOW: API_CONFIG.payments.refundWindow,
};

// Headers por defecto
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'User-Agent': 'MussikOn-Mobile/1.0.0',
};

// Configuración de reintentos
export const RETRY_CONFIG = {
  maxRetries: ENV.MAX_RETRIES,
  retryDelay: ENV.RETRY_DELAY,
  backoffMultiplier: ENV.RETRY_BACKOFF,
  maxDelay: ENV.MAX_RETRY_DELAY,
};

// Configuración de caché
export const CACHE_CONFIG = {
  enabled: ENV.CACHE_ENABLED,
  ttl: ENV.CACHE_TTL,
  maxSize: ENV.CACHE_MAX_SIZE,
};

// Configuración de sockets
export const SOCKET_CONFIG = {
  url: ENV.SOCKET_URL,
  reconnectAttempts: ENV.SOCKET_RECONNECT_ATTEMPTS,
  reconnectDelay: ENV.SOCKET_RECONNECT_DELAY,
  heartbeatInterval: ENV.SOCKET_HEARTBEAT_INTERVAL,
}; 