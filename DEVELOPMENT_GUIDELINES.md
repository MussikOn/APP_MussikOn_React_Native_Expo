# 🛠️ Guías de Desarrollo - MusikOn

> **Versión:** 3.0.0 - Reinicio Completo  
> **Estado:** Base Limpia - Listo para Desarrollo  
> **Última Actualización:** Diciembre 2024

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

Este documento proporciona guías completas para el desarrollo de la aplicación **MusikOn Mobile App** desde su estado actual de base limpia. Incluye estándares de código, patrones arquitectónicos, mejores prácticas y herramientas de desarrollo.

### 🎪 Objetivos del Desarrollo

- **Consistencia**: Código uniforme y mantenible
- **Escalabilidad**: Arquitectura que crece con el proyecto
- **Performance**: Optimización continua
- **Calidad**: Testing y validación rigurosa
- **Colaboración**: Estándares para trabajo en equipo

---

## 🏗️ Arquitectura del Proyecto

### 📱 **Estructura de Directorios Actual**

```
APP_MussikOn_React_Native_Expo/
├── src/
│   ├── app/
│   │   └── App.tsx                      // ✅ Pantalla básica
│   ├── appTypes/                        // ✅ Tipos básicos
│   ├── controllers/                     // ✅ Controladores
│   └── styles/                         // ✅ Estilos básicos
├── assets/                             // ✅ Recursos
├── docs/                               // ✅ Documentación
├── START.md                            // ✅ Guía de implementación
├── README.md                           // ✅ Documentación principal
├── ESTADO_ACTUAL_PROYECTO.md           // ✅ Estado actual
└── package.json                        // ✅ Dependencias
```

### 📱 **Estructura de Directorios Objetivo**

```
src/
├── app/                    # Punto de entrada de la aplicación
│   └── App.tsx            # ✅ Componente raíz (ya existe)
├── navigation/             # ❌ Sistema de navegación (por implementar)
│   ├── AppNavigator.tsx   # Navegador principal
│   ├── AuthNavigator.tsx  # Navegador de autenticación
│   └── MainNavigator.tsx  # Navegador principal (post-login)
├── screens/               # ❌ Pantallas de la aplicación (por implementar)
│   ├── auth/              # Autenticación
│   │   ├── LoginScreen.tsx
│   │   ├── RegisterScreen.tsx
│   │   └── WelcomeScreen.tsx
│   ├── dashboard/         # Dashboard principal
│   │   ├── HomeScreen.tsx # Para organizadores
│   │   └── Dashboard.tsx  # Para músicos
│   ├── requests/          # Gestión de solicitudes
│   │   ├── CreateRequestScreen.tsx
│   │   ├── RequestDetailScreen.tsx
│   │   ├── AvailableRequestsScreen.tsx
│   │   └── MyRequestsScreen.tsx
│   ├── payments/          # Sistema de pagos
│   │   ├── BalanceScreen.tsx
│   │   ├── DepositScreen.tsx
│   │   └── TransactionHistoryScreen.tsx
│   └── profile/           # Gestión de perfiles
│       └── ProfileScreen.tsx
├── components/            # ❌ Componentes reutilizables (por implementar)
│   ├── ui/                # Componentes de UI base
│   │   ├── Button.tsx     # Botones con variantes
│   │   ├── Input.tsx      # Campos de entrada
│   │   ├── Card.tsx       # Tarjetas contenedoras
│   │   └── LoadingSpinner.tsx # Indicadores de carga
│   ├── requests/          # Componentes de solicitudes
│   │   ├── RequestCard.tsx
│   │   ├── RequestForm.tsx
│   │   └── RequestFilters.tsx
│   └── payments/          # Componentes de pagos
│       ├── PaymentCard.tsx
│       └── DepositForm.tsx
├── store/                 # ❌ Gestión de estado (por implementar)
│   ├── store.ts           # Configuración Redux
│   └── slices/
│       ├── authSlice.ts   # Estado de autenticación
│       ├── userSlice.ts   # Estado de usuario
│       ├── requestsSlice.ts # Estado de solicitudes
│       └── paymentsSlice.ts # Estado de pagos
├── services/              # ❌ Servicios y APIs (por implementar)
│   ├── api.ts             # Cliente HTTP centralizado
│   ├── authService.ts     # Servicios de autenticación
│   ├── requestService.ts  # Servicios de solicitudes
│   ├── paymentService.ts  # Servicios de pagos
│   └── storageService.ts  # Almacenamiento local
├── theme/                 # ❌ Sistema de temas (por implementar)
│   ├── colors.ts          # Paleta de colores
│   ├── typography.ts      # Tipografías
│   ├── spacing.ts         # Espaciado
│   ├── shadows.ts         # Sombras
│   └── index.ts           # Exportaciones
├── utils/                 # ❌ Utilidades y helpers (por implementar)
│   ├── validation.ts      # Validaciones
│   ├── formatters.ts      # Formateadores
│   └── constants.ts       # Constantes
├── types/                 # ❌ Definiciones de tipos (por implementar)
│   ├── navigation.ts      # Tipos de navegación
│   ├── api.ts             # Tipos de API
│   └── common.ts          # Tipos comunes
└── hooks/                 # ❌ Hooks personalizados (por implementar)
    ├── useAuth.ts         # Hook de autenticación
    ├── useRequests.ts     # Hook de solicitudes
    └── usePayments.ts     # Hook de pagos
```

### 🎯 **Principios Arquitectónicos**

#### **1. Separación de Responsabilidades**
- ✅ **Screens**: Solo lógica de presentación
- ✅ **Services**: Lógica de negocio y API
- ✅ **Components**: Reutilización y composición
- ✅ **Store**: Estado global centralizado

#### **2. Configuración Centralizada**
- ✅ **theme/**: Sistema de temas unificado
- ✅ **services/**: APIs centralizadas
- ✅ **types/**: Tipos TypeScript organizados

#### **3. Componentes Reutilizables**
- ✅ **ui/**: Componentes base universales
- ✅ **requests/**: Componentes específicos de solicitudes
- ✅ **payments/**: Componentes específicos de pagos

---

## 🔧 Configuración del Entorno

### **Prerrequisitos**
```bash
# Node.js (v16 o superior)
node --version

# npm o yarn
npm --version

# Expo CLI
npm install -g @expo/cli

# Git
git --version
```

### **Instalación del Proyecto**
```bash
# Clonar repositorio
git clone [URL_DEL_REPOSITORIO]
cd APP_MussikOn_React_Native_Expo

# Instalar dependencias
npm install

# Verificar tipos TypeScript
npm run typecheck

# Iniciar desarrollo
npm start
```

### **Dependencias Principales**
```json
{
  "expo": "^53.0.0",
  "react": "18.3.1",
  "react-native": "0.79.5",
  "typescript": "^5.8.3"
}
```

### **Scripts Disponibles**
```json
{
  "start": "expo start",
  "build": "expo build",
  "typecheck": "npx tsc --noEmit"
}
```

---

## 📱 Estructura de Componentes

### **Convenciones de Nomenclatura**

#### **Archivos y Carpetas**
```typescript
// ✅ Correcto
src/screens/auth/LoginScreen.tsx
src/components/ui/Button.tsx
src/services/authService.ts

// ❌ Incorrecto
src/screens/auth/loginScreen.tsx
src/components/ui/button.tsx
src/services/auth-service.ts
```

#### **Componentes**
```typescript
// ✅ Correcto
export const LoginScreen: React.FC = () => { /* ... */ };
export const Button: React.FC<ButtonProps> = ({ children, ...props }) => { /* ... */ };

// ❌ Incorrecto
export const loginScreen = () => { /* ... */ };
export const button = ({ children, ...props }) => { /* ... */ };
```

#### **Tipos e Interfaces**
```typescript
// ✅ Correcto
export interface User {
  id: string;
  name: string;
  email: string;
}

export type AuthState = 'idle' | 'loading' | 'success' | 'error';

// ❌ Incorrecto
export interface user {
  id: string;
  name: string;
  email: string;
}
```

### **Estructura de Componentes**

#### **Componente Básico**
```typescript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme';

interface ComponentProps {
  title: string;
  onPress?: () => void;
}

export const Component: React.FC<ComponentProps> = ({ title, onPress }) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
});
```

#### **Componente con Hooks**
```typescript
import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../theme';

export const UserProfile: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { user, logout } = useAuth();
  const { theme } = useTheme();

  useEffect(() => {
    // Lógica de inicialización
  }, []);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <Text>{user?.name}</Text>
    </View>
  );
};
```

---

## 🎨 Sistema de Diseño

### **Paleta de Colores (OBLIGATORIA)**

```typescript
// src/theme/colors.ts
export const COLORS = {
  // Colores principales
  primary: '#014aad',      // Azul principal
  secondary: '#5ebeee',    // Azul claro
  accent: '#ff8c8c',       // Rojo suave
  success: '#a2d6b0',      // Verde suave
  
  // Colores de texto
  text: '#000000',         // Negro
  textSecondary: '#757575', // Gris
  
  // Colores de fondo
  background: '#18375d',   // Azul oscuro
  surface: '#ffffff',      // Blanco
  
  // Estados
  error: '#ff8c8c',        // Rojo suave
  warning: '#FFB74D',      // Naranja
  info: '#64B5F6',         // Azul info
  
  // Gradientes
  gradients: {
    primary: ['#014aad', '#18375d'],
    secondary: ['#5ebeee', '#014aad'],
    success: ['#a2d6b0', '#4CAF50'],
    error: ['#ff8c8c', '#F44336'],
  }
};
```

### **Tipografía**

```typescript
// src/theme/typography.ts
export const TYPOGRAPHY = {
  fonts: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
  },
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  weights: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
};
```

### **Espaciado**

```typescript
// src/theme/spacing.ts
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};
```

### **Sombras**

```typescript
// src/theme/shadows.ts
export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6.27,
    elevation: 8,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
};
```

---

## 🔌 Patrones de Comunicación

### **API Client Centralizado**

```typescript
// src/services/api.ts
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { API_CONFIG } from '../config/apiConfig';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: API_CONFIG.DEFAULT_HEADERS,
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Agregar token de autenticación
        const token = this.getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        // Manejar errores de autenticación
        if (error.response?.status === 401) {
          this.handleUnauthorized();
        }
        return Promise.reject(error);
      }
    );
  }

  private getAuthToken(): string | null {
    // Obtener token del almacenamiento
    return null; // Implementar
  }

  private handleUnauthorized() {
    // Redirigir a login
  }

  // Métodos HTTP
  async get<T>(url: string, params?: any): Promise<T> {
    const response: AxiosResponse<T> = await this.client.get(url, { params });
    return response.data;
  }

  async post<T>(url: string, data?: any): Promise<T> {
    const response: AxiosResponse<T> = await this.client.post(url, data);
    return response.data;
  }

  async put<T>(url: string, data?: any): Promise<T> {
    const response: AxiosResponse<T> = await this.client.put(url, data);
    return response.data;
  }

  async delete<T>(url: string): Promise<T> {
    const response: AxiosResponse<T> = await this.client.delete(url);
    return response.data;
  }
}

export const apiClient = new ApiClient();
```

### **Servicios Específicos**

```typescript
// src/services/authService.ts
import { apiClient } from './api';
import { LoginData, RegisterData, User } from '../types/auth';

export class AuthService {
  async login(data: LoginData): Promise<User> {
    return apiClient.post<User>('/auth/login', data);
  }

  async register(data: RegisterData): Promise<User> {
    return apiClient.post<User>('/auth/register', data);
  }

  async logout(): Promise<void> {
    return apiClient.post<void>('/auth/logout');
  }

  async getCurrentUser(): Promise<User> {
    return apiClient.get<User>('/auth/me');
  }
}

export const authService = new AuthService();
```

---

## 📊 Gestión de Estado

### **Redux Toolkit Setup**

```typescript
// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import requestsReducer from './slices/requestsSlice';
import paymentsReducer from './slices/paymentsSlice';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth', 'user'], // Solo persistir auth y user
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    user: userReducer,
    requests: requestsReducer,
    payments: paymentsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### **Slice de Autenticación**

```typescript
// src/store/slices/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authService } from '../../services/authService';
import { LoginData, RegisterData, User } from '../../types/auth';

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async (data: LoginData, { rejectWithValue }) => {
    try {
      const response = await authService.login(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error de login');
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (data: RegisterData, { rejectWithValue }) => {
    try {
      const response = await authService.register(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error de registro');
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error de logout');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.token = action.payload.token;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
      });
  },
});

export const { clearError, setToken } = authSlice.actions;
export default authSlice.reducer;
```

### **Hooks Personalizados**

```typescript
// src/hooks/useAuth.ts
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { login, register, logout, clearError } from '../store/slices/authSlice';
import { LoginData, RegisterData } from '../types/auth';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, token, loading, error } = useSelector((state: RootState) => state.auth);

  const handleLogin = async (data: LoginData) => {
    return dispatch(login(data));
  };

  const handleRegister = async (data: RegisterData) => {
    return dispatch(register(data));
  };

  const handleLogout = async () => {
    return dispatch(logout());
  };

  const handleClearError = () => {
    dispatch(clearError());
  };

  return {
    user,
    token,
    loading,
    error,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    clearError: handleClearError,
    isAuthenticated: !!token,
  };
};
```

---

## 🌐 Configuración de API

### **Configuración Centralizada**

```typescript
// src/config/apiConfig.ts
export const API_CONFIG = {
  BASE_URL: process.env.EXPO_PUBLIC_API_URL || 'http://192.168.100.101:3001',
  TIMEOUT: 10000,
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
  },
  RETRY_CONFIG: {
    maxRetries: 3,
    retryDelay: 1000,
  },
  ENDPOINTS: {
    // Autenticación
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      LOGOUT: '/auth/logout',
      ME: '/auth/me',
    },
    // Solicitudes
    REQUESTS: {
      CREATE: '/events/request-musician',
      GET_MY_PENDING: '/events/my-pending',
      GET_MY_ASSIGNED: '/events/my-assigned',
      GET_AVAILABLE: '/events/available-requests',
      ACCEPT: '/events/:eventId/accept',
      CANCEL: '/events/:requestId/cancel',
      COMPLETE: '/events/:requestId/complete',
      DELETE: '/events/:requestId',
    },
    // Pagos
    PAYMENTS: {
      BALANCE: '/payments/my-balance',
      DEPOSIT: '/payments/deposit',
      DEPOSITS: '/payments/my-deposits',
      WITHDRAW: '/musicians/withdraw-earnings',
    },
  },
};
```

### **Variables de Entorno**

```bash
# .env
EXPO_PUBLIC_API_URL=http://192.168.100.101:3001
EXPO_PUBLIC_SOCKET_URL=http://192.168.100.101:3001
```

---

## 🔐 Seguridad y Autenticación

### **Manejo de Tokens**

```typescript
// src/services/storageService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  THEME: 'theme',
  LANGUAGE: 'language',
} as const;

export class StorageService {
  // Token
  async setToken(token: string): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  }

  async getToken(): Promise<string | null> {
    return AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  }

  async removeToken(): Promise<void> {
    await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  }

  // User Data
  async setUserData(user: any): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
  }

  async getUserData(): Promise<any | null> {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
    return data ? JSON.parse(data) : null;
  }

  async removeUserData(): Promise<void> {
    await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
  }

  // Theme
  async setTheme(theme: 'light' | 'dark'): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.THEME, theme);
  }

  async getTheme(): Promise<'light' | 'dark' | null> {
    return AsyncStorage.getItem(STORAGE_KEYS.THEME) as Promise<'light' | 'dark' | null>;
  }

  // Language
  async setLanguage(language: 'es' | 'en'): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.LANGUAGE, language);
  }

  async getLanguage(): Promise<'es' | 'en' | null> {
    return AsyncStorage.getItem(STORAGE_KEYS.LANGUAGE) as Promise<'es' | 'en' | null>;
  }

  // Clear all
  async clearAll(): Promise<void> {
    await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
  }
}

export const storageService = new StorageService();
```

### **Validación de Formularios**

```typescript
// src/utils/validation.ts
export const VALIDATION_RULES = {
  email: {
    required: 'El email es requerido',
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: 'Email inválido',
    },
  },
  password: {
    required: 'La contraseña es requerida',
    minLength: {
      value: 6,
      message: 'La contraseña debe tener al menos 6 caracteres',
    },
  },
  name: {
    required: 'El nombre es requerido',
    minLength: {
      value: 2,
      message: 'El nombre debe tener al menos 2 caracteres',
    },
  },
  phone: {
    pattern: {
      value: /^\+?[\d\s-()]+$/,
      message: 'Número de teléfono inválido',
    },
  },
};

export const validateField = (value: string, rules: any): string | null => {
  if (rules.required && !value) {
    return rules.required;
  }

  if (rules.minLength && value.length < rules.minLength.value) {
    return rules.minLength.message;
  }

  if (rules.pattern && !rules.pattern.value.test(value)) {
    return rules.pattern.message;
  }

  return null;
};
```

---

## 🧪 Testing y Calidad

### **Estructura de Tests**

```
__tests__/
├── components/
│   ├── ui/
│   │   ├── Button.test.tsx
│   │   └── Input.test.tsx
│   └── requests/
│       └── RequestCard.test.tsx
├── screens/
│   ├── auth/
│   │   ├── LoginScreen.test.tsx
│   │   └── RegisterScreen.test.tsx
│   └── requests/
│       └── CreateRequestScreen.test.tsx
├── services/
│   ├── api.test.ts
│   └── authService.test.ts
├── store/
│   └── slices/
│       └── authSlice.test.ts
└── utils/
    └── validation.test.ts
```

### **Configuración de Jest**

```json
// jest.config.js
module.exports = {
  preset: 'jest-expo',
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)',
  ],
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{ts,tsx}',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
```

### **Ejemplo de Test**

```typescript
// __tests__/components/ui/Button.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '../../../src/components/ui/Button';

describe('Button Component', () => {
  it('renders correctly with title', () => {
    const { getByText } = render(<Button title="Test Button" onPress={() => {}} />);
    expect(getByText('Test Button')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(<Button title="Test Button" onPress={onPressMock} />);
    
    fireEvent.press(getByText('Test Button'));
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('shows loading state', () => {
    const { getByTestId } = render(
      <Button title="Test Button" onPress={() => {}} loading={true} />
    );
    expect(getByTestId('button-loading')).toBeTruthy();
  });
});
```

---

## 📦 Build y Deploy

### **Configuración de EAS Build**

```json
// eas.json
{
  "cli": {
    "version": ">= 5.9.1"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {
      "autoIncrement": true
    }
  },
  "submit": {
    "production": {}
  }
}
```

### **Scripts de Build**

```json
// package.json
{
  "scripts": {
    "build:android": "eas build --platform android",
    "build:ios": "eas build --platform ios",
    "build:all": "eas build --platform all",
    "submit:android": "eas submit --platform android",
    "submit:ios": "eas submit --platform ios"
  }
}
```

---

## 🐛 Debugging y Troubleshooting

### **Logging Centralizado**

```typescript
// src/utils/logger.ts
enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

class Logger {
  private isDevelopment = __DEV__;

  private log(level: LogLevel, message: string, data?: any) {
    if (this.isDevelopment) {
      const timestamp = new Date().toISOString();
      const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
      
      switch (level) {
        case LogLevel.DEBUG:
          console.debug(logMessage, data);
          break;
        case LogLevel.INFO:
          console.info(logMessage, data);
          break;
        case LogLevel.WARN:
          console.warn(logMessage, data);
          break;
        case LogLevel.ERROR:
          console.error(logMessage, data);
          break;
      }
    }
  }

  debug(message: string, data?: any) {
    this.log(LogLevel.DEBUG, message, data);
  }

  info(message: string, data?: any) {
    this.log(LogLevel.INFO, message, data);
  }

  warn(message: string, data?: any) {
    this.log(LogLevel.WARN, message, data);
  }

  error(message: string, data?: any) {
    this.log(LogLevel.ERROR, message, data);
  }
}

export const logger = new Logger();
```

### **Manejo de Errores**

```typescript
// src/utils/errorHandler.ts
import { logger } from './logger';

export class ErrorHandler {
  static handle(error: any, context?: string) {
    const errorMessage = error?.message || 'Error desconocido';
    const errorStack = error?.stack;
    
    logger.error(`Error en ${context || 'aplicación'}: ${errorMessage}`, {
      stack: errorStack,
      context,
      timestamp: new Date().toISOString(),
    });

    // Aquí se puede agregar lógica para enviar errores a servicios externos
    // como Sentry, Crashlytics, etc.
  }

  static async handleAsync<T>(
    promise: Promise<T>,
    context?: string
  ): Promise<T | null> {
    try {
      return await promise;
    } catch (error) {
      this.handle(error, context);
      return null;
    }
  }
}
```

---

## 📚 Recursos y Referencias

### **Documentación Oficial**
- [React Native](https://reactnative.dev/docs/getting-started)
- [Expo](https://docs.expo.dev/)
- [TypeScript](https://www.typescriptlang.org/docs/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [React Navigation](https://reactnavigation.org/docs/getting-started)

### **Herramientas de Desarrollo**
- [Expo DevTools](https://docs.expo.dev/workflow/expo-dev-tools/)
- [React Native Debugger](https://github.com/jhen0409/react-native-debugger)
- [Flipper](https://fbflipper.com/)

### **Librerías Recomendadas**
- [React Native Elements](https://reactnativeelements.com/)
- [React Native Vector Icons](https://github.com/oblador/react-native-vector-icons)
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)
- [React Native Safe Area Context](https://github.com/th3rdwave/react-native-safe-area-context)

### **Patrones y Mejores Prácticas**
- [React Native Performance](https://reactnative.dev/docs/performance)
- [React Native Security](https://reactnative.dev/docs/security)
- [React Native Testing](https://reactnative.dev/docs/testing)

---

## 🎯 **Próximos Pasos**

### **Fase 1: Infraestructura (Semana 1)**
1. ✅ Configurar navegación básica
2. ✅ Crear sistema de temas
3. ✅ Implementar gestión de estado
4. ✅ Crear componentes UI básicos

### **Fase 2: Autenticación (Semana 1)**
1. ✅ Pantallas de autenticación
2. ✅ Servicios de autenticación
3. ✅ Navegación protegida

### **Fase 3: Funcionalidades Core (Semanas 2-3)**
1. ✅ Sistema de solicitudes
2. ✅ Sistema de pagos
3. ✅ Chat y notificaciones

---

**¡El proyecto está listo para implementar siguiendo estas guías de desarrollo!** 🚀 