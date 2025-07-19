// Configuración centralizada de URLs para diferentes entornos
export interface Environment {
  API_URL: string;
  SOCKET_URL: string;
  ENVIRONMENT: 'development' | 'production' | 'staging';
}

// Configuraciones por entorno
const environments: Record<string, Environment> = {
  development: {
    API_URL: 'http://192.168.54.40:1000',
    SOCKET_URL: 'http://192.168.54.40:1000', // Mismo servidor que API
    ENVIRONMENT: 'development',
  },
  production: {
    API_URL: 'https://server2-o3im.onrender.com',
    SOCKET_URL: 'https://server2-o3im.onrender.com',
    ENVIRONMENT: 'production',
  },
  staging: {
    API_URL: 'http://192.168.100.65:10000',
    SOCKET_URL: 'http://192.168.100.65:10000',
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

// Headers comunes
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
};

// Timeouts
export const API_TIMEOUT = 10000; // 10 segundos
export const SOCKET_TIMEOUT = 5000; // 5 segundos

// Configuración de reintentos
export const MAX_RETRIES = 3;
export const RETRY_DELAY = 1000; // 1 segundo

console.log(`🌍 Entorno actual: ${config.ENVIRONMENT}`);
console.log(`🔗 API URL: ${config.API_URL}`);
console.log(`🔌 Socket URL: ${config.SOCKET_URL}`); 