# 🛠️ Guías de Desarrollo - MussikOn

## 📋 Tabla de Contenidos

- [🎯 Introducción](#-introducción)
- [🏗️ Arquitectura del Proyecto](#️-arquitectura-del-proyecto)
- [🔧 Configuración del Entorno](#-configuración-del-entorno)
- [📱 Estructura de Componentes](#-estructura-de-componentes)
- [🎨 Sistema de Diseño](#-sistema-de-diseño)
- [🔌 Patrones de Comunicación](#-patrones-de-comunicación)
- [📊 Gestión de Estado](#-gestión-de-estado)
- [🌐 Configuración de API](#-configuración-de-api)
- [🔐 Seguridad y Autenticación](#-seguridad-y-autenticación)
- [🧪 Testing y Calidad](#-testing-y-calidad)
- [📦 Build y Deploy](#-build-y-deploy)
- [🐛 Debugging y Troubleshooting](#-debugging-y-troubleshooting)
- [📚 Recursos y Referencias](#-recursos-y-referencias)

---

## 🎯 Introducción

Este documento proporciona guías completas para el desarrollo de la aplicación MussikOn. Incluye estándares de código, patrones arquitectónicos, mejores prácticas y herramientas de desarrollo.

### 🎪 Objetivos del Desarrollo

- **Consistencia**: Código uniforme y mantenible
- **Escalabilidad**: Arquitectura que crece con el proyecto
- **Performance**: Optimización continua
- **Calidad**: Testing y validación rigurosa
- **Colaboración**: Estándares para trabajo en equipo

---

## 🏗️ Arquitectura del Proyecto

### 📱 **Estructura de Directorios**

```
src/
├── app/                    # Punto de entrada de la aplicación
│   ├── App.tsx            # Componente raíz
│   └── AppContent.tsx     # Contenido principal
├── components/             # Componentes reutilizables
│   ├── ui/                # Componentes de UI base
│   │   ├── Button.tsx     # Botones con variantes
│   │   ├── Input.tsx      # Campos de entrada
│   │   ├── Card.tsx       # Tarjetas contenedoras
│   │   └── LoadingSpinner.tsx # Indicadores de carga
│   ├── forms/             # Componentes de formularios
│   └── navigation/        # Componentes de navegación
├── screens/               # Pantallas de la aplicación
│   ├── auth/              # Autenticación
│   │   ├── LoginScreen.tsx
│   │   └── RegisterScreen.tsx
│   ├── dashboard/         # Dashboard principal
│   │   ├── HomeScreen.tsx # Para organizadores
│   │   └── Dashboard.tsx  # Para músicos
│   ├── events/            # Gestión de solicitudes
│   │   ├── MyRequestsList.tsx
│   │   ├── RequestDetail.tsx
│   │   └── ShareMusicianScreen.tsx
│   └── notifications/     # Sistema de notificaciones
│       └── NotificationsScreen.tsx
├── services/              # Servicios y APIs
│   ├── api.ts             # Cliente HTTP centralizado
│   ├── requests.ts        # Servicios de solicitudes
│   └── notificationService.ts # Gestión de notificaciones
├── contexts/              # Contextos de React
│   ├── ThemeContext.tsx   # Contexto de tema
│   ├── UserContext.tsx    # Contexto de usuario
│   ├── LanguageContext.tsx # Contexto de idioma
│   ├── SidebarContext.tsx # Contexto de sidebar
│   └── SocketContext.tsx  # Contexto de Socket.IO
├── config/                # Configuración centralizada
│   ├── apiConfig.ts       # Configuración de API
│   └── environment.ts     # Variables de entorno
├── hooks/                 # Hooks personalizados
│   ├── useInitialNotifications.ts
│   └── useRequestService.ts
├── utils/                 # Utilidades y helpers
│   ├── functions.ts       # Funciones de token
│   ├── testNotifications.ts # Utilidades de testing
│   └── socket.ts          # Configuración de socket
├── types/                 # Definiciones de tipos TypeScript
│   └── apiTypes.ts        # Tipos de API
└── appTypes/              # Tipos de la aplicación
    └── DatasTypes.ts      # Tipos principales
```

### 🎯 **Principios Arquitectónicos**

#### **1. Separación de Responsabilidades**
- ✅ **Screens**: Solo lógica de presentación
- ✅ **Services**: Lógica de negocio y API
- ✅ **Components**: Reutilización y composición
- ✅ **Contexts**: Estado global compartido

#### **2. Configuración Centralizada**
- ✅ **apiConfig.ts**: Todos los endpoints en un lugar
- ✅ **environment.ts**: Variables por entorno
- ✅ **Tipos TypeScript**: Definiciones centralizadas

#### **3. Patrón de Servicios**
```typescript
// Ejemplo de servicio centralizado
export const requestService = {
  async createRequest(data: CreateRequestData): Promise<ApiResponse<Request>> {
    return apiService.post(API_CONFIG.ENDPOINTS.CREATE_REQUEST, data);
  },
  // ... más métodos
};
```

---

## 🔧 Configuración del Entorno

### 📋 **Requisitos del Sistema**

#### **Software Requerido**
```bash
# Node.js (v16 o superior)
node --version  # >= 16.0.0

# npm o yarn
npm --version   # >= 8.0.0

# Expo CLI
npm install -g @expo/cli

# Git
git --version
```

#### **Herramientas de Desarrollo**
```bash
# ESLint para linting
npm install -g eslint

# Prettier para formateo
npm install -g prettier

# TypeScript
npm install -g typescript
```

### 🚀 **Configuración Inicial**

#### **1. Clonar y Configurar**
```bash
# Clonar repositorio
git clone https://github.com/MussikOn/APP_MussikOn_React_Native_Expo.git
cd APP_MussikOn_React_Native_Expo

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
```

#### **2. Configurar Variables de Entorno**
```bash
# .env
API_URL=http://192.168.100.101:3001
SOCKET_URL=http://192.168.100.101:3001
ENVIRONMENT=development
```

#### **3. Configurar Backend**
```bash
# Navegar al backend
cd ../app_mussikon_express

# Instalar dependencias
npm install

# Iniciar servidor
npm run dev
```

### 🔧 **Scripts de Desarrollo**

#### **Scripts Principales**
```bash
# Desarrollo
npm start              # Iniciar servidor de desarrollo
npm run android        # Ejecutar en Android
npm run ios           # Ejecutar en iOS
npm run web           # Ejecutar en web

# Testing
npm test              # Ejecutar tests
npm run test:watch    # Tests en modo watch
npm run test:coverage # Coverage de tests

# Linting y Formateo
npm run lint          # Ejecutar ESLint
npm run lint:fix      # Corregir errores de linting
npm run format        # Formatear código con Prettier

# TypeScript
npx tsc --noEmit      # Verificar tipos sin compilar
```

---

## 📱 Estructura de Componentes

### 🎨 **Jerarquía de Componentes**

#### **1. Componentes Base (UI)**
```typescript
// src/components/ui/Button.tsx
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'outline';
  size: 'small' | 'medium' | 'large';
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
}
```

#### **2. Componentes de Formularios**
```typescript
// src/components/forms/FormInput.tsx
interface FormInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  placeholder?: string;
  secureTextEntry?: boolean;
}
```

#### **3. Componentes de Navegación**
```typescript
// src/components/navigation/Header.tsx
interface HeaderProps {
  title: string;
  showBack?: boolean;
  onBackPress?: () => void;
  rightComponent?: React.ReactNode;
}
```

### 🎯 **Patrones de Componentes**

#### **1. Componente Funcional con Hooks**
```typescript
import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '@contexts/ThemeContext';
import { useTranslation } from 'react-i18next';

interface MyComponentProps {
  title: string;
  onPress: () => void;
}

const MyComponent: React.FC<MyComponentProps> = ({ title, onPress }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Lógica de inicialización
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
      <Text style={[styles.title, { color: theme.colors.text.primary }]}>
        {t(title)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default MyComponent;
```

#### **2. Componente con Context**
```typescript
import React, { useContext } from 'react';
import { UserContext } from '@contexts/UserContext';
import { ThemeContext } from '@contexts/ThemeContext';

const ProfileComponent: React.FC = () => {
  const { user, updateUser } = useContext(UserContext);
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <View>
      <Text>{user?.userEmail}</Text>
      <Button onPress={toggleTheme}>
        Cambiar Tema
      </Button>
    </View>
  );
};
```

---

## 🎨 Sistema de Diseño

### 🎨 **Paleta de Colores**

#### **Colores Principales**
```typescript
// src/theme/colors.ts
export const colors = {
  primary: {
    50: '#e3f2fd',
    100: '#bbdefb',
    500: '#014aad',    // Azul principal
    600: '#013e94',    // Azul oscuro
    700: '#012b6b',
  },
  secondary: {
    50: '#f5f5f5',
    100: '#eeeeee',
    500: '#444444',    // Gris medio
    900: '#000000',    // Negro puro
  },
  accent: {
    50: '#e1f5fe',
    100: '#b3e5fc',
    500: '#1aa3ff',    // Azul claro
    600: '#0099e6',
  },
  success: {
    50: '#e8f5e8',
    500: '#4caf50',
    600: '#388e3c',
  },
  warning: {
    50: '#fff8e1',
    500: '#ff9800',
    600: '#f57c00',
  },
  error: {
    50: '#ffebee',
    500: '#f44336',
    600: '#d32f2f',
  },
};
```

#### **Temas Claro y Oscuro**
```typescript
export const lightTheme = {
  colors: {
    background: {
      primary: '#ffffff',
      secondary: '#f5f5f5',
      card: '#ffffff',
    },
    text: {
      primary: '#000000',
      secondary: '#666666',
      tertiary: '#999999',
    },
    border: {
      primary: '#e0e0e0',
      secondary: '#f0f0f0',
    },
  },
};

export const darkTheme = {
  colors: {
    background: {
      primary: '#121212',
      secondary: '#1e1e1e',
      card: '#2d2d2d',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b0b0b0',
      tertiary: '#808080',
    },
    border: {
      primary: '#404040',
      secondary: '#303030',
    },
  },
};
```

### 📐 **Tipografía**

#### **Escala de Tipografía**
```typescript
export const typography = {
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },
  weights: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
};
```

#### **Uso en Componentes**
```typescript
const styles = StyleSheet.create({
  title: {
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.weights.bold,
    lineHeight: typography.sizes['2xl'] * typography.lineHeights.tight,
  },
  body: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.normal,
    lineHeight: typography.sizes.md * typography.lineHeights.normal,
  },
});
```

### 📏 **Espaciado y Layout**

#### **Sistema de Espaciado**
```typescript
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
};
```

#### **Uso en Componentes**
```typescript
const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  section: {
    marginVertical: spacing.xl,
  },
});
```

---

## 🔌 Patrones de Comunicación

### 🌐 **Configuración de API**

#### **Cliente HTTP Centralizado**
```typescript
// src/services/api.ts
export const apiService = {
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return retryRequest(async () => {
      const response = await api.get(url, config);
      return response.data;
    });
  },
  
  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return retryRequest(async () => {
      const response = await api.post(url, data, config);
      return response.data;
    });
  },
  // ... más métodos
};
```

#### **Configuración de Endpoints**
```typescript
// src/config/apiConfig.ts
export const API_CONFIG = {
  BASE_URL: 'http://192.168.100.101:3001',
  ENDPOINTS: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    EVENTS: '/events',
    MY_EVENTS: '/events/my-events',
    // ... más endpoints
  },
  TIMEOUT: 10000,
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
  },
  RETRY_CONFIG: {
    maxRetries: 3,
    retryDelay: 1000,
  },
};
```

### 🔌 **Socket.IO para Tiempo Real**

#### **Configuración del Contexto**
```typescript
// src/contexts/SocketContext.tsx
export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    if (!user?.userEmail) return;

    const socketInstance = io(getSocketUrl(), getSocketConnectionOptions());
    const socketEvents = getSocketEvents();

    // Eventos de conexión
    socketInstance.on('connect', () => {
      console.log('🔌 Socket.IO conectado');
      setIsConnected(true);
      
      socketInstance.emit(socketEvents.AUTHENTICATE, {
        userEmail: user.userEmail,
        userId: user.userEmail,
      });
    });

    // Eventos de notificaciones
    socketInstance.on(socketEvents.REQUEST_CANCELLED, async (data: any) => {
      console.log('📢 Notificación: Solicitud cancelada', data);
      
      const notification = notificationService.createNotificationFromServer(
        data,
        user.userEmail,
        'request_cancelled'
      );
      
      await notificationService.saveNotification(notification);
      Alert.alert(notification.title, notification.message);
    });

    return () => {
      socketInstance.disconnect();
    };
  }, [user?.userEmail]);

  return (
    <SocketContext.Provider value={{ isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
```

---

## 📊 Gestión de Estado

### 🎯 **Patrones de Estado**

#### **1. Context API para Estado Global**
```typescript
// src/contexts/UserContext.tsx
interface UserContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await authService.login(email, password);
      const token = response.data.token;
      
      await saveToken(token);
      setUser(response.data.user);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await deleteToken();
      setUser(null);
    } catch (error) {
      console.error('Error al hacer logout:', error);
    }
  };

  const updateUser = (userData: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...userData } : null);
  };

  return (
    <UserContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};
```

#### **2. Hooks Personalizados para Estado Local**
```typescript
// src/hooks/useRequestService.ts
export const useRequestService = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const executeRequest = async <T>(
    requestFn: () => Promise<ApiResponse<T>>
  ): Promise<ApiResponse<T> | null> => {
    setLoading(true);
    setError(null);

    try {
      const result = await requestFn();
      return result;
    } catch (err: any) {
      const errorMessage = err.message || 'Error desconocido';
      setError(errorMessage);
      console.error('Error en request service:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    executeRequest,
  };
};
```

#### **3. Estado Local con useState**
```typescript
const MyComponent: React.FC = () => {
  const [data, setData] = useState<MyData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.get('/my-endpoint');
      setData(response.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View>
      {loading && <LoadingSpinner />}
      {error && <ErrorMessage message={error} />}
      {data.map(item => (
        <DataItem key={item.id} item={item} />
      ))}
    </View>
  );
};
```

---

## 🌐 Configuración de API

### 🎯 **Estructura de Configuración**

#### **1. Configuración Principal**
```typescript
// src/config/apiConfig.ts
export const API_CONFIG = {
  BASE_URL: 'http://192.168.100.101:3001',
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
  TIMEOUT: 10000,
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  RETRY_CONFIG: {
    maxRetries: 3,
    retryDelay: 1000,
  },
};
```

#### **2. Configuración de Socket.IO**
```typescript
export const SOCKET_CONFIG = {
  SOCKET_URL: 'http://192.168.100.101:3001',
  CONNECTION_OPTIONS: {
    transports: ['websocket', 'polling'],
    autoConnect: true,
    timeout: 10000,
    forceNew: true,
  },
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
```

#### **3. Funciones Helper**
```typescript
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
```

### 🔧 **Uso en Servicios**

#### **Servicio de Solicitudes**
```typescript
// src/services/requests.ts
import { getApiUrl, API_CONFIG } from '../config/apiConfig';

export const requestService = {
  async createRequest(requestData: CreateRequestData): Promise<ApiResponse<Request>> {
    return apiService.post(API_CONFIG.ENDPOINTS.CREATE_REQUEST, requestData);
  },

  async getMyPendingRequests(): Promise<ApiResponse<Request[]>> {
    return apiService.get(API_CONFIG.ENDPOINTS.MY_PENDING);
  },

  async cancelRequest(requestId: string): Promise<ApiResponse<void>> {
    try {
      const url = API_CONFIG.ENDPOINTS.CANCEL_REQUEST.replace(':requestId', requestId);
      return await apiService.patch(url);
    } catch (error: any) {
      console.log('PATCH falló, intentando actualizar estado...');
      const url = API_CONFIG.ENDPOINTS.REQUEST_DETAIL.replace(':eventId', requestId);
      return await apiService.patch(url, { status: 'cancelled' });
    }
  },

  async getRequestById(requestId: string): Promise<ApiResponse<Request>> {
    const url = API_CONFIG.ENDPOINTS.REQUEST_DETAIL.replace(':eventId', requestId);
    return apiService.get(url);
  },
};
```

---

## 🔐 Seguridad y Autenticación

### 🎯 **Gestión de Tokens JWT**

#### **1. Almacenamiento Seguro**
```typescript
// src/utils/functions.ts
import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

export const saveToken = async (token: string): Promise<void> => {
  try {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  } catch (error) {
    console.error('Error al guardar token:', error);
  }
};

export const getToken = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  } catch (error) {
    console.error('Error al obtener token:', error);
    return null;
  }
};

export const deleteToken = async (): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.error('Error al eliminar token:', error);
  }
};
```

#### **2. Interceptores de API**
```typescript
// src/services/api.ts
const createApiInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: apiConfig.BASE_URL,
    timeout: getApiTimeout(),
    headers: getDefaultHeaders(),
  });

  // Interceptor para agregar token a todas las peticiones
  instance.interceptors.request.use(
    async (config) => {
      try {
        const token = await getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      } catch (error) {
        console.error('Error en interceptor de request:', error);
        return config;
      }
    },
    (error) => {
      console.error('Error en interceptor de request:', error);
      return Promise.reject(error);
    }
  );

  // Interceptor para manejar respuestas y errores
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`);
      return response;
    },
    async (error: AxiosError) => {
      const originalRequest = error.config as any;
      
      console.error(`❌ ${error.config?.method?.toUpperCase()} ${error.config?.url} - ${error.response?.status}`);

      // Si el token expiró (401), intentar logout
      if (error.response?.status === 401) {
        try {
          await deleteToken();
          store.dispatch(logout());
          console.log('🔐 Token expirado, usuario deslogueado');
        } catch (logoutError) {
          console.error('Error al hacer logout:', logoutError);
        }
      }

      // Crear error personalizado
      const apiError = new ApiError(
        (error.response?.data as any)?.message || error.message || 'Error de conexión',
        error.response?.status,
        error.code
      );

      return Promise.reject(apiError);
    }
  );

  return instance;
};
```

### 🔐 **Validación de Roles**

#### **1. Middleware de Autenticación**
```typescript
// src/utils/auth.ts
export const requireAuth = (navigation: any) => {
  const { user } = useUser();
  
  useEffect(() => {
    if (!user) {
      navigation.replace('Login');
    }
  }, [user, navigation]);
};

export const requireRole = (requiredRole: 'eventCreator' | 'musico', navigation: any) => {
  const { user } = useUser();
  
  useEffect(() => {
    if (!user) {
      navigation.replace('Login');
      return;
    }
    
    if (user.roll !== requiredRole) {
      navigation.replace('Home');
    }
  }, [user, navigation, requiredRole]);
};
```

#### **2. Uso en Pantallas**
```typescript
// src/screens/events/MyRequestsList.tsx
const MyRequestsList: React.FC<MyRequestsListProps> = ({ navigation }) => {
  const { user } = useUser();
  
  // Verificar autenticación
  useEffect(() => {
    if (!user) {
      navigation.replace('Login');
      return;
    }
  }, [user, navigation]);

  const isOrg = user?.roll === 'eventCreator';
  const tabs = isOrg ? TABS_ORG : TABS_MUSIC;
  
  // ... resto del componente
};
```

---

## 🧪 Testing y Calidad

### 🎯 **Estrategias de Testing**

#### **1. Unit Tests con Jest**
```typescript
// src/services/__tests__/api.test.ts
import { apiService } from '../api';
import { API_CONFIG } from '../../config/apiConfig';

describe('API Service', () => {
  beforeEach(() => {
    // Mock de axios
    jest.clearAllMocks();
  });

  test('should make GET request successfully', async () => {
    const mockResponse = { data: { success: true, data: [] } };
    jest.spyOn(axios, 'get').mockResolvedValue(mockResponse);

    const result = await apiService.get('/test-endpoint');

    expect(result).toEqual(mockResponse.data);
    expect(axios.get).toHaveBeenCalledWith('/test-endpoint', undefined);
  });

  test('should handle API errors', async () => {
    const mockError = new Error('Network error');
    jest.spyOn(axios, 'get').mockRejectedValue(mockError);

    await expect(apiService.get('/test-endpoint')).rejects.toThrow('Network error');
  });
});
```

#### **2. Component Tests con React Native Testing Library**
```typescript
// src/components/ui/__tests__/Button.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Button from '../Button';

describe('Button Component', () => {
  test('should render correctly', () => {
    const { getByText } = render(
      <Button onPress={() => {}} variant="primary">
        Test Button
      </Button>
    );
    
    expect(getByText('Test Button')).toBeTruthy();
  });

  test('should call onPress when pressed', () => {
    const mockOnPress = jest.fn();
    const { getByText } = render(
      <Button onPress={mockOnPress} variant="primary">
        Test Button
      </Button>
    );
    
    fireEvent.press(getByText('Test Button'));
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  test('should be disabled when disabled prop is true', () => {
    const mockOnPress = jest.fn();
    const { getByText } = render(
      <Button onPress={mockOnPress} variant="primary" disabled>
        Test Button
      </Button>
    );

    fireEvent.press(getByText('Test Button'));
    expect(mockOnPress).not.toHaveBeenCalled();
  });
});
```

#### **3. Integration Tests**
```typescript
// src/screens/__tests__/LoginScreen.test.tsx
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { UserProvider } from '../../contexts/UserContext';
import LoginScreen from '../auth/LoginScreen';

describe('LoginScreen Integration', () => {
  test('should login successfully with valid credentials', async () => {
    const mockNavigation = { navigate: jest.fn() };
    
    const { getByPlaceholderText, getByText } = render(
      <UserProvider>
        <LoginScreen navigation={mockNavigation} />
      </UserProvider>
    );

    const emailInput = getByPlaceholderText('Email');
    const passwordInput = getByPlaceholderText('Contraseña');
    const loginButton = getByText('Iniciar Sesión');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(mockNavigation.navigate).toHaveBeenCalledWith('Home');
    });
  });
});
```

### 🔧 **Configuración de Testing**

#### **Jest Configuration**
```json
// jest.config.js
module.exports = {
  preset: 'react-native',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|expo|@expo|@react-navigation)/)',
  ],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  testMatch: [
    '**/__tests__/**/*.(ts|tsx|js)',
    '**/?(*.)+(spec|test).(ts|tsx|js)',
  ],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/setupTests.ts',
  ],
};
```

#### **Setup de Tests**
```typescript
// src/setupTests.ts
import '@testing-library/jest-native/extend-expect';

// Mock de AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock de Expo SecureStore
jest.mock('expo-secure-store', () => ({
  setItemAsync: jest.fn(),
  getItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

// Mock de Socket.IO
jest.mock('socket.io-client', () => ({
  io: jest.fn(() => ({
    on: jest.fn(),
    emit: jest.fn(),
    disconnect: jest.fn(),
  })),
}));
```

---

## 📦 Build y Deploy

### 🚀 **Configuración de EAS Build**

#### **1. Configuración de EAS**
```json
// eas.json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "env": {
        "ENVIRONMENT": "development"
      }
    },
    "preview": {
      "distribution": "internal",
      "env": {
        "ENVIRONMENT": "staging"
      }
    },
    "production": {
      "env": {
        "ENVIRONMENT": "production"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

#### **2. Scripts de Build**
```bash
# Build para desarrollo
eas build --platform android --profile development
eas build --platform ios --profile development

# Build para preview
eas build --platform android --profile preview
eas build --platform ios --profile preview

# Build para producción
eas build --platform android --profile production
eas build --platform ios --profile production
```

### 🔧 **Configuración de App.json**
```json
// app.json
{
  "expo": {
    "name": "MussikOn",
    "slug": "mussikon-app",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "automatic",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#014aad"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.mussikon.app"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#014aad"
      },
      "package": "com.mussikon.app"
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "plugins": [
      "expo-secure-store",
      "expo-localization"
    ]
  }
}
```

---

## 🐛 Debugging y Troubleshooting

### 🔍 **Herramientas de Debugging**

#### **1. React Native Debugger**
```bash
# Instalar React Native Debugger
npm install -g react-native-debugger

# Ejecutar
react-native-debugger
```

#### **2. Flipper (Recomendado)**
```bash
# Instalar Flipper
# Descargar desde https://fbflipper.com/

# Configurar en el proyecto
npm install --save-dev flipper-plugin-react-native-performance
```

#### **3. Logs y Console**
```typescript
// src/utils/logger.ts
export const logger = {
  info: (message: string, data?: any) => {
    console.log(`ℹ️ ${message}`, data);
  },
  warn: (message: string, data?: any) => {
    console.warn(`⚠️ ${message}`, data);
  },
  error: (message: string, error?: any) => {
    console.error(`❌ ${message}`, error);
  },
  debug: (message: string, data?: any) => {
    if (__DEV__) {
      console.log(`🔍 ${message}`, data);
    }
  },
};
```

### 🐛 **Problemas Comunes y Soluciones**

#### **1. Problemas de Navegación**
```typescript
// Error: "The action 'NAVIGATE' was not handled"
// Solución: Verificar que la pantalla esté registrada en el Stack Navigator

// En App.tsx
<Stack.Screen name="MyRequestsList" component={MyRequestsList} />
<Stack.Screen name="RequestDetail" component={RequestDetail} />
<Stack.Screen name="Notifications" component={NotificationsScreen} />
```

#### **2. Problemas de Socket.IO**
```typescript
// Error: Socket no se conecta
// Solución: Verificar URL y configuración

// En SocketContext.tsx
const socketInstance = io(getSocketUrl(), getSocketConnectionOptions());

// Verificar que la URL sea correcta
console.log('Socket URL:', getSocketUrl());
```

#### **3. Problemas de API**
```typescript
// Error: 404 en endpoints
// Solución: Verificar configuración centralizada

// En apiConfig.ts
export const API_CONFIG = {
  BASE_URL: 'http://192.168.100.101:3001', // Verificar esta URL
  ENDPOINTS: {
    // Verificar que los endpoints existan
  },
};
```

#### **4. Problemas de Performance**
```typescript
// Lista lenta con muchos elementos
// Solución: Usar FlatList con optimizaciones

<FlatList
  data={items}
  renderItem={renderItem}
  keyExtractor={(item) => item.id}
  getItemLayout={(data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  })}
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
  windowSize={10}
/>
```

---

## 📚 Recursos y Referencias

### 📖 **Documentación Oficial**
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/docs/getting-started)
- [Socket.IO Client](https://socket.io/docs/v4/client-api/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### 🛠️ **Herramientas de Desarrollo**
- [React Native Debugger](https://github.com/jhen0409/react-native-debugger)
- [Flipper](https://fbflipper.com/)
- [React Native Performance](https://shopify.github.io/react-native-performance/)
- [React Native Flipper](https://github.com/facebook/flipper)

### 🎨 **Recursos de Diseño**
- [React Native Elements](https://reactnativeelements.com/)
- [Expo Vector Icons](https://expo.github.io/vector-icons/)
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)

### 🧪 **Testing**
- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Detox](https://wix.github.io/Detox/)

### 📦 **Build y Deploy**
- [EAS Build](https://docs.expo.dev/build/introduction/)
- [EAS Submit](https://docs.expo.dev/submit/introduction/)
- [App Store Connect](https://developer.apple.com/app-store-connect/)
- [Google Play Console](https://play.google.com/console/)

---

<div align="center">

**🎵 Desarrollado con ❤️ para la comunidad musical 🎵**

*Última actualización: Diciembre 2024*

</div> 