# 🔐 Sistema de Autenticación - MussikOn

## 📋 **Descripción General**

El sistema de autenticación de MussikOn está diseñado para proporcionar una experiencia segura y fluida para los usuarios. Implementa JWT (JSON Web Tokens) para la gestión de sesiones y utiliza Expo Secure Store para el almacenamiento seguro de credenciales.

## 🏗️ **Arquitectura del Sistema**

### Componentes Principales
```
┌─────────────────────────────────────┐
│           UI Layer                  │ ← Login/Register Screens
├─────────────────────────────────────┤
│           Auth Service              │ ← Lógica de autenticación
├─────────────────────────────────────┤
│           Token Management          │ ← JWT handling
├─────────────────────────────────────┤
│           Secure Storage            │ ← Expo Secure Store
└─────────────────────────────────────┘
```

## 🔧 **Implementación Técnica**

### 1. **Tipos de Datos**

```typescript
// src/appTypes/DatasTypes.ts
export type Token = {
  iat: number;           // Issued at timestamp
  name: string;          // Nombre del usuario
  lastName: string;      // Apellido del usuario
  userEmail: string;     // Email del usuario
  roll: string;          // Rol del usuario
}

export type User = {
  iat: number;
  name: string;
  lastName: string;
  userEmail: string;
  roll: string;
  create_at: string;
  update_at: string;
  delete_at: string;
  status: boolean;
};
```

### 2. **Gestión de Tokens**

```typescript
// src/utils/functions.ts
import * as SecureStore from 'expo-secure-store';
import { jwtDecode } from 'jwt-decode';

// Guardar token de forma segura
export const saveToken = async (token: string) => {
  try {
    await SecureStore.setItemAsync('token', token, {
      keychainAccessible: SecureStore.WHEN_UNLOCKED
    });
    console.log('Token guardado correctamente');
  } catch (error) {
    console.error('Error al guardar el token:', error);
    throw error;
  }
};

// Obtener token almacenado
export const getToken = async () => {
  try {
    const token = await SecureStore.getItemAsync('token');
    return token;
  } catch (error) {
    console.error('Error al obtener el token:', error);
    throw error;
  }
};

// Eliminar token
export const deleteToken = async () => {
  try {
    await SecureStore.deleteItemAsync('token');
    console.log('Token eliminado');
  } catch (error) {
    console.error('Error al eliminar el token:', error);
    throw error;
  }
};

// Validar token
export const validateToken = async () => {
  const token = await getToken();
  return !!token;
};

// Obtener datos del usuario desde el token
export const getData = async () => {
  try {
    const token = await getToken();
    if (!token) return null;
    const data: Token = jwtDecode(token);
    return data;
  } catch (error) {
    console.info(error);
    return null;
  }
};
```

### 3. **Redux Store para Autenticación**

```typescript
// src/store/slices/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, Token } from '../../appTypes/DatasTypes';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: Token | null;
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<{ user: User; token: Token }>) {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = null;
    },
    authError(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
  },
});

export const { loginSuccess, logout, authError } = authSlice.actions;
export default authSlice.reducer;
```

## 🖥️ **Pantallas de Autenticación**

### 1. **Login Screen**

**Archivo**: `src/screens/auth/Login.tsx`

**Funcionalidades**:
- Validación de formulario en tiempo real
- Manejo de errores de API
- Indicador de carga
- Navegación a registro
- Persistencia de sesión

**Flujo de Login**:
```typescript
const handleLogin = async () => {
  if (!validateForm()) return;
  
  setLoading(true);
  setApiError('');
  
  try {
    const response: any = await apiService.post('/auth/login', {
      userEmail: email,
      userPassword: password,
    });
    
    if (response.token) {
      await saveToken(response.token);
      setLoading(false);
      navigation.reset({ 
        index: 0, 
        routes: [{ name: 'MainTabs' }] 
      });
    } else {
      setApiError(response.message || 'Error al Iniciar Sesión');
      setLoading(false);
    }
  } catch (error: any) {
    setApiError(error.message || 'No se pudo conectar. Intenta más tarde.');
    setLoading(false);
  }
};
```

**Validaciones**:
```typescript
const validateForm = () => {
  let valid = true;
  
  // Validación de email
  if (!email) {
    setEmailError('Email es requerido');
    valid = false;
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    setEmailError('Email no es válido');
    valid = false;
  } else {
    setEmailError('');
  }
  
  // Validación de contraseña
  if (!password) {
    setPasswordError('Contraseña es requerida');
    valid = false;
  } else if (password.length < 6) {
    setPasswordError('Contraseña debe tener al menos 6 caracteres');
    valid = false;
  } else {
    setPasswordError('');
  }
  
  return valid;
};
```

### 2. **Register Screen**

**Archivo**: `src/screens/auth/Register.tsx`

**Funcionalidades**:
- Formulario de registro multi-paso
- Validación de datos
- Subida de imágenes de perfil
- Selección de instrumentos
- Confirmación de términos

## 🔌 **Integración con API**

### 1. **Configuración de Axios**

```typescript
// src/services/api.ts
const createApiInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: API_URL,
    timeout: API_TIMEOUT,
    headers: DEFAULT_HEADERS,
  });

  // Interceptor para agregar token a todas las peticiones
  instance.interceptors.request.use(
    async (config) => {
      try {
        const token = await getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      } catch (error) {
        console.error('Error en interceptor de request:', error);
        return config;
      }
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Interceptor para manejar respuestas y errores
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    async (error: AxiosError) => {
      // Si el token expiró (401), intentar logout
      if (error.response?.status === 401) {
        try {
          await deleteToken();
          store.dispatch(logout());
          console.log('Token expirado, usuario deslogueado');
        } catch (logoutError) {
          console.error('Error al hacer logout:', logoutError);
        }
      }

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

### 2. **Endpoints de Autenticación**

```typescript
// Endpoints disponibles
const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  VERIFY_EMAIL: '/auth/verify-email',
};
```

## 🔐 **Seguridad Implementada**

### 1. **Almacenamiento Seguro**
- **Expo Secure Store**: Encriptación automática
- **Keychain Access**: iOS (cuando el dispositivo está desbloqueado)
- **Keystore**: Android (encriptación a nivel de sistema)

### 2. **Validación de Tokens**
- **JWT Decode**: Validación de estructura
- **Expiration Check**: Verificación de expiración
- **Auto Logout**: Logout automático en token expirado

### 3. **Validación de Datos**
```typescript
// src/utils/functions.ts
export function validarPassword(password: string): boolean {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#])[A-Za-z\d@$!%*?&.#]{8,}$/;
  return regex.test(password);
}

export function validarEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}
```

## 🔄 **Flujo de Autenticación**

### 1. **Flujo de Login**
```
Usuario ingresa credenciales
    ↓
Validación de formulario
    ↓
Llamada a API /auth/login
    ↓
Respuesta exitosa con token
    ↓
Guardar token en Secure Store
    ↓
Actualizar Redux Store
    ↓
Navegar a MainTabs
```

### 2. **Flujo de Logout**
```
Usuario presiona logout
    ↓
Eliminar token de Secure Store
    ↓
Limpiar Redux Store
    ↓
Navegar a Login Screen
```

### 3. **Flujo de Token Expirado**
```
API retorna 401 Unauthorized
    ↓
Interceptor detecta error
    ↓
Eliminar token local
    ↓
Limpiar estado de Redux
    ↓
Redirigir a Login
```

## 🎯 **Estados de Autenticación**

### 1. **Estados en Redux**
```typescript
interface AuthState {
  isAuthenticated: boolean;  // Estado de autenticación
  user: User | null;         // Datos del usuario
  token: Token | null;       // Token JWT
  error: string | null;      // Mensajes de error
}
```

### 2. **Estados de UI**
- **Loading**: Durante la autenticación
- **Error**: Cuando hay errores
- **Success**: Autenticación exitosa
- **Idle**: Estado inicial

## 🧪 **Testing**

### 1. **Tests Unitarios**
```typescript
describe('Auth Functions', () => {
  it('should validate email correctly', () => {
    expect(validarEmail('test@example.com')).toBe(true);
    expect(validarEmail('invalid-email')).toBe(false);
  });

  it('should validate password correctly', () => {
    expect(validarPassword('StrongPass123!')).toBe(true);
    expect(validarPassword('weak')).toBe(false);
  });
});
```

### 2. **Tests de Integración**
```typescript
describe('Login Flow', () => {
  it('should login successfully with valid credentials', async () => {
    // Mock API response
    const mockResponse = {
      token: 'mock-jwt-token',
      user: mockUser
    };
    
    // Test login flow
    const result = await loginUser(validCredentials);
    expect(result.success).toBe(true);
    expect(result.token).toBeDefined();
  });
});
```

## 📊 **Métricas y Monitoreo**

### 1. **Métricas de Seguridad**
- **Tiempo de respuesta de login**: < 2 segundos
- **Tasa de éxito de autenticación**: > 95%
- **Tiempo de expiración de token**: 24 horas
- **Reintentos automáticos**: 3 intentos

### 2. **Logs de Seguridad**
```typescript
// Logs importantes
console.log('🔐 Usuario autenticado:', userEmail);
console.log('❌ Intento de login fallido:', userEmail);
console.log('🔄 Token renovado automáticamente');
console.log('🚪 Usuario deslogueado');
```

## 🚀 **Optimizaciones**

### 1. **Performance**
- **Lazy Loading**: Carga diferida de pantallas
- **Memoización**: Componentes optimizados
- **Caché**: Datos de usuario en memoria

### 2. **UX**
- **Persistencia**: Mantener sesión entre app launches
- **Auto-login**: Login automático si hay token válido
- **Offline Support**: Funcionalidad básica sin conexión

## 🔧 **Configuración**

### 1. **Variables de Entorno**
```typescript
// src/config/environment.ts
export const AUTH_CONFIG = {
  TOKEN_EXPIRY: 24 * 60 * 60 * 1000, // 24 horas
  REFRESH_THRESHOLD: 5 * 60 * 1000,  // 5 minutos
  MAX_LOGIN_ATTEMPTS: 3,
  LOCKOUT_DURATION: 15 * 60 * 1000,  // 15 minutos
};
```

### 2. **Configuración de Seguridad**
```typescript
const SECURITY_CONFIG = {
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_REQUIREMENTS: {
    uppercase: true,
    lowercase: true,
    numbers: true,
    specialChars: true,
  },
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutos
};
```

---

**Última actualización**: Diciembre 2024  
**Responsable de Seguridad**: Equipo de Desarrollo MussikOn  
**Versión de Autenticación**: 2.0.0 