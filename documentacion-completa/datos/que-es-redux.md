# 📊 ¿Qué es Redux?

## 🤔 ¿Qué es Redux?

**Redux** es como una "caja fuerte" gigante donde guardas toda la información importante de tu aplicación. Es una forma de manejar el **estado global** (datos que necesitan estar disponibles en toda la app).

## 🎯 ¿Por qué Redux?

### El Problema sin Redux:
```javascript
// Sin Redux - datos dispersos
function LoginScreen() {
    const [user, setUser] = useState(null);
    // ¿Cómo compartir user con otras pantallas?
}

function ProfileScreen() {
    const [user, setUser] = useState(null);
    // ¿Cómo obtener el mismo user?
}

function SettingsScreen() {
    const [user, setUser] = useState(null);
    // ¿Cómo sincronizar todos los users?
}
```

### La Solución con Redux:
```javascript
// Con Redux - datos centralizados
const store = {
    user: { name: "Juan", email: "juan@email.com" },
    theme: { mode: "dark" },
    notifications: []
};

// Todas las pantallas acceden al mismo store
function LoginScreen() {
    const user = useSelector(state => state.user);
}

function ProfileScreen() {
    const user = useSelector(state => state.user);
}

function SettingsScreen() {
    const user = useSelector(state => state.user);
}
```

## 🧠 Analogía Simple

Imagina que Redux es como una **biblioteca pública**:

### Sin Redux:
- Cada persona tiene sus propios libros en casa
- Es difícil compartir información
- Puede haber versiones diferentes de la misma información
- Es confuso y desorganizado

### Con Redux:
- Todos van a la misma biblioteca
- La información está centralizada
- Todos ven la misma información
- Es organizado y fácil de mantener

## 🏗️ Arquitectura de Redux

### Los 3 Principios de Redux:

1. **Single Source of Truth**: Una sola fuente de verdad
2. **State is Read-Only**: El estado es solo de lectura
3. **Changes are Made with Pure Functions**: Los cambios se hacen con funciones puras

### Flujo de Redux:
```
Action → Reducer → Store → Component
```

## 🔄 Conceptos Básicos de Redux

### 1. **Store** - El Almacén Central
```javascript
// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    language: languageReducer,
    notifications: notificationsReducer,
    app: appReducer,
    forms: formsReducer,
  },
});
```

### 2. **State** - El Estado
```javascript
// El estado es como un objeto gigante
const state = {
  auth: {
    user: { name: "Juan", email: "juan@email.com" },
    token: "abc123",
    loading: false
  },
  theme: {
    mode: "dark",
    colors: { primary: "#014aad" }
  },
  notifications: [
    { id: 1, message: "Nueva solicitud", read: false }
  ]
};
```

### 3. **Actions** - Las Acciones
```javascript
// src/store/slices/authSlice.ts
// Actions son como "órdenes" que le das al store
const loginAction = {
  type: 'auth/login',
  payload: {
    user: { name: "Juan", email: "juan@email.com" },
    token: "abc123"
  }
};

const logoutAction = {
  type: 'auth/logout',
  payload: null
};
```

### 4. **Reducers** - Los Procesadores
```javascript
// src/store/slices/authSlice.ts
const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'auth/login':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        loading: false
      };
    
    case 'auth/logout':
      return {
        ...state,
        user: null,
        token: null
      };
    
    default:
      return state;
  }
};
```

## 🎯 Redux Toolkit en MussikOn

### ¿Qué es Redux Toolkit?
Es una versión simplificada de Redux que hace todo más fácil.

### 1. **Crear un Slice**
```javascript
// src/store/slices/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
    }
  }
});

export const { setUser, setToken, setLoading, setError, logout } = authSlice.actions;
export default authSlice.reducer;
```

### 2. **Configurar el Store**
```javascript
// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import themeReducer from './slices/themeSlice';
import notificationsReducer from './slices/notificationsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    notifications: notificationsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### 3. **Proveer el Store**
```javascript
// src/app/App.tsx
import { Provider } from 'react-redux';
import { store } from '../store/store';

export default function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}
```

## 🔄 Usar Redux en Componentes

### 1. **useSelector** - Leer el Estado
```javascript
// src/screens/auth/Login.tsx
import { useSelector } from 'react-redux';
import { RootState } from '@store/store';

function LoginScreen() {
  // Leer datos del store
  const user = useSelector((state: RootState) => state.auth.user);
  const loading = useSelector((state: RootState) => state.auth.loading);
  const error = useSelector((state: RootState) => state.auth.error);

  return (
    <View>
      {loading && <Text>Cargando...</Text>}
      {error && <Text style={styles.error}>{error}</Text>}
      {user && <Text>Bienvenido, {user.name}</Text>}
    </View>
  );
}
```

### 2. **useDispatch** - Enviar Acciones
```javascript
// src/screens/auth/Login.tsx
import { useDispatch } from 'react-redux';
import { setUser, setToken, setLoading, setError } from '@store/slices/authSlice';

function LoginScreen() {
  const dispatch = useDispatch();

  const handleLogin = async (email: string, password: string) => {
    try {
      dispatch(setLoading(true));
      
      const response = await api.post('/auth/login', { email, password });
      
      dispatch(setUser(response.data.user));
      dispatch(setToken(response.data.token));
      dispatch(setError(null));
      
    } catch (error) {
      dispatch(setError('Error al iniciar sesión'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <View>
      <Button title="Entrar" onPress={() => handleLogin(email, password)} />
    </View>
  );
}
```

### 3. **Hooks Personalizados**
```javascript
// src/hooks/useAuth.ts
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@store/store';
import { setUser, setToken, logout } from '@store/slices/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, token, loading, error } = useSelector((state: RootState) => state.auth);

  const login = (userData: User, userToken: string) => {
    dispatch(setUser(userData));
    dispatch(setToken(userToken));
  };

  const logoutUser = () => {
    dispatch(logout());
  };

  return {
    user,
    token,
    loading,
    error,
    login,
    logout: logoutUser,
    isAuthenticated: !!user && !!token
  };
};
```

## 📊 Slices en MussikOn

### 1. **Auth Slice** - Autenticación
```javascript
// src/store/slices/authSlice.ts
interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
    }
  }
});
```

### 2. **Theme Slice** - Tema
```javascript
// src/store/slices/themeSlice.ts
interface ThemeState {
  mode: 'light' | 'dark';
  colors: ThemeColors;
}

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setMode: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.mode = action.payload;
    },
    toggleTheme: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
    }
  }
});
```

### 3. **Notifications Slice** - Notificaciones
```javascript
// src/store/slices/notificationsSlice.ts
interface NotificationsState {
  notifications: Notification[];
  unreadCount: number;
}

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications.unshift(action.payload);
      state.unreadCount += 1;
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification && !notification.read) {
        notification.read = true;
        state.unreadCount -= 1;
      }
    },
    clearNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
    }
  }
});
```

## 🔄 Middleware en Redux

### ¿Qué es el Middleware?
Son funciones que se ejecutan entre la acción y el reducer.

### 1. **Redux Thunk** - Acciones Asíncronas
```javascript
// src/store/slices/authSlice.ts
export const loginAsync = (email: string, password: string) => async (dispatch: AppDispatch) => {
  try {
    dispatch(setLoading(true));
    
    const response = await api.post('/auth/login', { email, password });
    
    dispatch(setUser(response.data.user));
    dispatch(setToken(response.data.token));
    
  } catch (error) {
    dispatch(setError('Error al iniciar sesión'));
  } finally {
    dispatch(setLoading(false));
  }
};

// Uso en componente
const dispatch = useDispatch();
dispatch(loginAsync(email, password));
```

### 2. **Redux Persist** - Persistir Estado
```javascript
// src/store/store.ts
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth', 'theme'] // Solo persistir estos slices
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    theme: themeReducer,
  },
});

export const persistor = persistStore(store);
```

## 🎯 Ventajas de Redux

### ✅ **Pros:**
1. **Estado centralizado**: Toda la información en un lugar
2. **Predecible**: Los cambios siguen un patrón claro
3. **Debugging fácil**: Herramientas de desarrollo excelentes
4. **Escalable**: Funciona bien en apps grandes
5. **Comunidad grande**: Mucha ayuda disponible

### ❌ **Contras:**
1. **Curva de aprendizaje**: Conceptos nuevos que aprender
2. **Boilerplate**: Más código para escribir
3. **Complejidad**: Puede ser excesivo para apps pequeñas
4. **Configuración**: Requiere setup inicial

## 🔧 Herramientas de Desarrollo

### 1. **Redux DevTools**
```javascript
// Configurar DevTools
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: process.env.NODE_ENV !== 'production',
});
```

### 2. **Logger Middleware**
```javascript
// src/store/middleware/logger.ts
const loggerMiddleware = (store) => (next) => (action) => {
  console.group(action.type);
  console.info('dispatching', action);
  const result = next(action);
  console.log('next state', store.getState());
  console.groupEnd();
  return result;
};
```

## 🎯 Resumen

1. **Store**: Almacén central de datos
2. **State**: Información de la aplicación
3. **Actions**: Órdenes para cambiar el estado
4. **Reducers**: Funciones que procesan las acciones
5. **useSelector**: Leer datos del store
6. **useDispatch**: Enviar acciones al store
7. **Slices**: Porciones organizadas del estado
8. **Middleware**: Funciones intermedias
9. **DevTools**: Herramientas de debugging
10. **Persist**: Guardar estado automáticamente

## ➡️ Siguiente Paso

Ahora que entiendes Redux, vamos a aprender sobre el **estado global** y cómo se organiza toda la información en MussikOn.

[Estado Global →](./estado-global.md) 