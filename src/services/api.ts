import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG } from '@config/apiConfig';
import { ENV, DEFAULT_HEADERS, RETRY_CONFIG } from '@config/environment';

// Configuración de la instancia de Axios
const axiosConfig: AxiosRequestConfig = {
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  headers: DEFAULT_HEADERS,
  withCredentials: API_CONFIG.security.withCredentials,
};

// Crear instancia de Axios
export const api: AxiosInstance = axios.create(axiosConfig);

// Interceptor para agregar token de autenticación
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting auth token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as any;
    
    // Si el error es 401 y no hemos intentado renovar el token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Intentar renovar el token
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${API_CONFIG.baseURL}/auth/refresh`, {
            refreshToken
          });
          
          const { accessToken } = response.data;
          await AsyncStorage.setItem('authToken', accessToken);
          
          // Reintentar la petición original
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Si falla la renovación, redirigir al login
        console.error('Token refresh failed:', refreshError);
        // Aquí podrías redirigir al usuario al login
      }
    }
    
    return Promise.reject(error);
  }
);

// Función para configurar reintentos
export const configureRetries = (config: AxiosRequestConfig) => {
  return {
    ...config,
    retry: RETRY_CONFIG.maxRetries,
    retryDelay: RETRY_CONFIG.retryDelay,
    retryCondition: (error: AxiosError) => {
      return axios.isAxiosError(error) && 
             (error.response?.status && error.response.status >= 500 || error.response?.status === 429);
    },
  };
};

// Función para obtener configuración de caché
export const getCacheConfig = (ttl: number = ENV.CACHE_TTL) => {
  return {
    cache: {
      ttl,
      maxSize: ENV.CACHE_MAX_SIZE,
    },
  };
};

// Función para obtener configuración de logging
export const getLoggingConfig = (level: string = ENV.LOGGING_LEVEL) => {
  return {
    logging: {
      enabled: ENV.LOGGING_ENABLED,
      level,
    },
  };
};

// Función para obtener configuración de seguridad
export const getSecurityConfig = () => {
  return {
    security: {
      includeCredentials: ENV.INCLUDE_CREDENTIALS,
      withCredentials: ENV.WITH_CREDENTIALS,
    },
  };
};

// Función para obtener configuración de archivos
export const getFileConfig = () => {
  return {
    files: {
      maxSize: ENV.MAX_FILE_SIZE,
      allowedTypes: ENV.ALLOWED_FILE_TYPES,
      uploadTimeout: ENV.FILE_UPLOAD_TIMEOUT,
    },
  };
};

// Función para obtener configuración de geolocalización
export const getGeolocationConfig = () => {
  return {
    geolocation: {
      enableHighAccuracy: ENV.GEOLOCATION_HIGH_ACCURACY,
      timeout: ENV.GEOLOCATION_TIMEOUT,
      maximumAge: ENV.GEOLOCATION_MAX_AGE,
      maxDistance: ENV.GEOLOCATION_MAX_DISTANCE,
    },
  };
};

// Función para obtener configuración de notificaciones
export const getNotificationConfig = () => {
  return {
    notifications: {
      push: {
        supported: ENV.PUSH_NOTIFICATIONS_SUPPORTED,
      },
      inApp: {
        enabled: ENV.IN_APP_NOTIFICATIONS_ENABLED,
      },
    },
  };
};

// Función para obtener configuración de eventos
export const getEventConfig = () => {
  return {
    events: {
      maxDuration: ENV.MAX_EVENT_DURATION,
      minDuration: ENV.MIN_EVENT_DURATION,
      maxBudget: ENV.MAX_EVENT_BUDGET,
      minBudget: ENV.MIN_EVENT_BUDGET,
    },
  };
};

// Función para obtener configuración de chat
export const getChatConfig = () => {
  return {
    chat: {
      maxMessageLength: ENV.MAX_MESSAGE_LENGTH,
      typingTimeout: ENV.TYPING_TIMEOUT,
      messageRetention: ENV.MESSAGE_RETENTION,
    },
  };
};

// Función para obtener configuración de pagos
export const getPaymentConfig = () => {
  return {
    payments: {
      currency: ENV.PAYMENT_CURRENCY,
      minAmount: ENV.MIN_PAYMENT_AMOUNT,
      maxAmount: ENV.MAX_PAYMENT_AMOUNT,
      refundWindow: ENV.REFUND_WINDOW,
    },
  };
};

export default api; 