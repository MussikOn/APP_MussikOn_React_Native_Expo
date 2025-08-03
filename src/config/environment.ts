// Configuración centralizada de URLs para diferentes entornos
// Importar configuración centralizada
import { API_CONFIG, SOCKET_CONFIG } from './apiConfig';

export interface Environment {
  API_URL: string;
  SOCKET_URL: string;
  ENVIRONMENT: 'development' | 'production' | 'staging';
}

// Configuraciones por entorno usando la configuración centralizada
const environments: Record<string, Environment> = {
  development: {
    API_URL: API_CONFIG.BASE_URL,
    SOCKET_URL: SOCKET_CONFIG.SOCKET_URL,
    ENVIRONMENT: 'development',
  },
  production: {
    API_URL: API_CONFIG.BASE_URL,
    SOCKET_URL: SOCKET_CONFIG.SOCKET_URL,
    ENVIRONMENT: 'production',
  },
  staging: {
    API_URL: 'http://192.168.100.101:3001', // Mantener staging separado
    SOCKET_URL: 'http://192.168.100.101:3001',
    ENVIRONMENT: 'staging',
  },
};

// Determinar el entorno actual
const getCurrentEnvironment = (): Environment => {
  // En desarrollo, usar development por defecto
  // En producción, usar production
  const isDevelopment = __DEV__;
  
  if (isDevelopment) {
    return environments.development;
  }
  
  return environments.production;
};

export const config = getCurrentEnvironment();

// URLs específicas para uso directo
export const API_URL = config.API_URL;
export const SOCKET_URL = config.SOCKET_URL;

// Headers comunes (usar configuración centralizada)
export const DEFAULT_HEADERS = API_CONFIG.DEFAULT_HEADERS;

// Timeouts (usar configuración centralizada)
export const API_TIMEOUT = API_CONFIG.TIMEOUT;
export const SOCKET_TIMEOUT = 5000; // 5 segundos

// Configuración de reintentos (usar configuración centralizada)
export const MAX_RETRIES = API_CONFIG.RETRY_CONFIG.maxRetries;
export const RETRY_DELAY = API_CONFIG.RETRY_CONFIG.retryDelay;

console.log(`🌍 Entorno actual: ${config.ENVIRONMENT}`);
console.log(`🔗 API URL: ${config.API_URL}`);
console.log(`🔌 Socket URL: ${config.SOCKET_URL}`); 