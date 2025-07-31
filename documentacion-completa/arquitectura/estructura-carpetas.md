# 📁 Estructura de Carpetas - MussikOn

## 🎯 ¿Qué es la Estructura de Carpetas?

La **estructura de carpetas** es como el "plano" de tu aplicación. Es la forma en que organizamos todos los archivos para que sea fácil encontrar y mantener el código.

## 🏗️ Estructura General de MussikOn

```
APP_MussikOn_React_Native_Expo/
├── 📁 src/                    # Código fuente principal
├── 📁 assets/                 # Imágenes, sonidos, iconos
├── 📁 docs/                   # Documentación del proyecto
├── 📁 android/                # Configuración específica de Android
├── 📁 .expo/                  # Archivos temporales de Expo
├── 📁 node_modules/           # Librerías instaladas
├── 📄 package.json            # Configuración del proyecto
├── 📄 app.json               # Configuración de Expo
├── 📄 tsconfig.json          # Configuración de TypeScript
└── 📄 README.md              # Documentación principal
```

## 📁 Carpeta `src/` - El Corazón de la Aplicación

### Estructura de `src/`:
```
src/
├── 📁 app/                    # Punto de entrada de la app
├── 📁 components/             # Componentes reutilizables
├── 📁 screens/                # Pantallas de la aplicación
├── 📁 contexts/               # Contextos de React
├── 📁 hooks/                  # Hooks personalizados
├── 📁 services/               # Servicios y APIs
├── 📁 store/                  # Estado global (Redux)
├── 📁 theme/                  # Temas y estilos
├── 📁 i18n/                   # Internacionalización
├── 📁 utils/                  # Funciones utilitarias
├── 📁 config/                 # Configuraciones
├── 📁 appTypes/               # Tipos de TypeScript
└── 📁 styles/                 # Estilos globales
```

## 📁 Carpeta `src/app/` - Punto de Entrada

### ¿Qué contiene?
- **App.tsx**: El componente principal de la aplicación
- **navigation/**: Configuración de navegación

### Ejemplo de `App.tsx`:
```typescript
// src/app/App.tsx
export default function App() {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <LanguageProvider>
            <ThemeProvider>
              <UserProvider>
                <SidebarProvider>
                  <SocketProvider>
                    <AppContent />
                  </SocketProvider>
                </SidebarProvider>
              </UserProvider>
            </ThemeProvider>
          </LanguageProvider>
        </I18nextProvider>
      </Provider>
    </SafeAreaProvider>
  );
}
```

## 📁 Carpeta `src/components/` - Componentes Reutilizables

### Estructura:
```
components/
├── 📁 ui/                     # Componentes básicos de UI
│   ├── 📄 Button.tsx
│   ├── 📄 Input.tsx
│   ├── 📄 Card.tsx
│   └── 📁 buttons/
├── 📁 features/               # Componentes específicos
│   ├── 📁 Home/
│   ├── 📁 Profile/
│   └── 📁 pages/
└── 📄 FormProgress.tsx
```

### Ejemplo de Componente UI:
```typescript
// src/components/ui/Button.tsx
interface ButtonProps {
  title: string;
  onPress: () => void;
  style?: any;
}

export function Button({ title, onPress, style }: ButtonProps) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.button, style]}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
}
```

## 📁 Carpeta `src/screens/` - Pantallas de la Aplicación

### Estructura:
```
screens/
├── 📁 auth/                   # Autenticación
│   ├── 📄 Login.tsx
│   └── 📄 Register.tsx
├── 📁 dashboard/              # Panel principal
│   ├── 📄 Dashboard.tsx
│   └── 📄 HomeScreen.tsx
├── 📁 events/                 # Gestión de eventos
│   ├── 📄 AvailableRequestsScreen.tsx
│   ├── 📄 EditRequest.tsx
│   └── 📄 MyRequestsList.tsx
├── 📁 profile/                # Perfil de usuario
│   ├── 📄 Profile.tsx
│   └── 📄 ProfileSimple.tsx
├── 📁 chat/                   # Sistema de chat
│   ├── 📄 ChatListScreen.tsx
│   ├── 📄 ChatScreen.tsx
│   └── 📁 components/
├── 📁 settings/               # Configuración
│   └── 📄 SettingsScreen.tsx
└── 📁 notifications/          # Notificaciones
    └── 📄 NotificationsScreen.tsx
```

### Ejemplo de Pantalla:
```typescript
// src/screens/auth/Login.tsx
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    // Lógica de login
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>
      <Input 
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <Input 
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Entrar" onPress={handleLogin} />
    </View>
  );
}
```

## 📁 Carpeta `src/contexts/` - Contextos de React

### ¿Qué son los Contextos?
Son como "cajas" que contienen información que puede ser accedida por cualquier componente de la aplicación.

### Estructura:
```
contexts/
├── 📄 LanguageContext.tsx     # Idioma de la app
├── 📄 SidebarContext.tsx      # Estado del sidebar
├── 📄 SocketContext.tsx       # Conexión de sockets
├── 📄 ThemeContext.tsx        # Tema (claro/oscuro)
└── 📄 UserContext.tsx         # Información del usuario
```

### Ejemplo de Contexto:
```typescript
// src/contexts/UserContext.tsx
interface UserContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    // Lógica de login
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}
```

## 📁 Carpeta `src/hooks/` - Hooks Personalizados

### ¿Qué son los Hooks?
Son funciones que encapsulan lógica reutilizable.

### Estructura:
```
hooks/
├── 📄 useAppTheme.ts          # Hook para temas
├── 📄 useInitialNotifications.ts
├── 📄 useMusicianRequestSocket.ts
└── 📄 useSocket.tsx
```

### Ejemplo de Hook:
```typescript
// src/hooks/useSocket.tsx
export function useSocket(userEmail: string) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!userEmail) return;

    const socketInstance = io(getSocketUrl());
    
    socketInstance.on('connect', () => {
      setIsConnected(true);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [userEmail]);

  return { socket, isConnected };
}
```

## 📁 Carpeta `src/services/` - Servicios y APIs

### Estructura:
```
services/
├── 📄 api.ts                  # Configuración de API
├── 📄 chatService.ts          # Servicios de chat
├── 📄 musicianRequests.ts     # Servicios de solicitudes
├── 📄 notificationService.ts  # Servicios de notificaciones
└── 📄 requests.ts             # Servicios generales
```

### Ejemplo de Servicio:
```typescript
// src/services/api.ts
export const api = axios.create({
  baseURL: 'https://api.mussikon.com',
  timeout: 10000,
});

export const apiService = {
  async get<T>(url: string): Promise<ApiResponse<T>> {
    const response = await api.get(url);
    return response.data;
  },

  async post<T>(url: string, data: any): Promise<ApiResponse<T>> {
    const response = await api.post(url, data);
    return response.data;
  }
};
```

## 📁 Carpeta `src/store/` - Estado Global (Redux)

### Estructura:
```
store/
├── 📄 store.ts                # Configuración de Redux
└── 📁 slices/                 # Porciones del estado
    ├── 📄 appSlice.ts
    ├── 📄 authSlice.ts
    ├── 📄 formsSlice.ts
    ├── 📄 languageSlice.ts
    ├── 📄 notificationsSlice.ts
    └── 📄 themeSlice.ts
```

### Ejemplo de Slice:
```typescript
// src/store/slices/authSlice.ts
interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
    }
  }
});
```

## 📁 Carpeta `src/theme/` - Temas y Estilos

### Estructura:
```
theme/
├── 📄 index.ts                # Exportaciones principales
├── 📄 colors.ts               # Paleta de colores
├── 📄 constants.ts            # Constantes del tema
├── 📄 spacing.ts              # Espaciado y layout
├── 📄 theme.ts                # Configuración del tema
└── 📄 typography.ts           # Tipografías
```

### Ejemplo de Colores:
```typescript
// src/theme/colors.ts
export const colors = {
  primary: {
    50: '#e6f0fa',
    100: '#cce0f5',
    500: '#014aad', // Color principal
    900: '#001b47',
  },
  background: {
    primary: '#f1f1f1',
    secondary: '#ffffff',
    card: '#ffffff',
  },
  text: {
    primary: '#000000',
    secondary: '#014aad',
    tertiary: '#666666',
  }
};
```

## 📁 Carpeta `src/i18n/` - Internacionalización

### Estructura:
```
i18n/
├── 📄 index.ts                # Configuración de i18n
└── 📁 locales/                # Archivos de traducción
    ├── 📄 en.json             # Inglés
    └── 📄 es.json             # Español
```

### Ejemplo de Traducción:
```json
// src/i18n/locales/es.json
{
  "welcome": "¡Bienvenido a MussikOn!",
  "login": {
    "title": "Iniciar Sesión",
    "email": "Correo electrónico",
    "password": "Contraseña"
  }
}
```

## 📁 Carpeta `src/utils/` - Funciones Utilitarias

### Estructura:
```
utils/
├── 📄 auth.ts                 # Utilidades de autenticación
├── 📄 ENV.ts                  # Variables de entorno
├── 📄 functions.ts            # Funciones generales
├── 📄 socket.ts               # Utilidades de socket
└── 📄 testNotifications.ts    # Testing de notificaciones
```

### Ejemplo de Utilidad:
```typescript
// src/utils/functions.ts
export const getToken = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync('token');
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

export const deleteToken = async (): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync('token');
  } catch (error) {
    console.error('Error deleting token:', error);
  }
};
```

## 📁 Carpeta `src/config/` - Configuraciones

### Estructura:
```
config/
├── 📄 apiConfig.ts            # Configuración de API
└── 📄 environment.ts          # Variables de entorno
```

### Ejemplo de Configuración:
```typescript
// src/config/apiConfig.ts
export const getApiConfig = () => ({
  BASE_URL: 'https://api.mussikon.com',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3
});

export const getSocketUrl = () => 'wss://socket.mussikon.com';
```

## 📁 Carpeta `src/appTypes/` - Tipos de TypeScript

### Estructura:
```
appTypes/
└── 📄 DatasTypes.ts           # Tipos principales
```

### Ejemplo de Tipos:
```typescript
// src/appTypes/DatasTypes.ts
export interface User {
  id: string;
  name: string;
  lastName: string;
  userEmail: string;
  roll: 'organizador' | 'musico';
}

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Register: undefined;
  Dashboard: undefined;
};
```

## 📁 Carpeta `assets/` - Recursos de la Aplicación

### Estructura:
```
assets/
├── 📁 img/                    # Imágenes
├── 📁 lottie/                 # Animaciones Lottie
├── 📁 sounds/                 # Sonidos
├── 📁 svg/                    # Iconos SVG
├── 📄 3.png                   # Icono de la app
├── 📄 4.png                   # Icono adaptativo
├── 📄 Logo_app.png            # Logo principal
└── 📄 Logo_rounded_letter.png # Logo redondeado
```

## 📁 Carpeta `docs/` - Documentación

### Estructura:
```
docs/
├── 📁 architecture/            # Documentación de arquitectura
├── 📁 components/              # Documentación de componentes
├── 📁 features/                # Documentación de funcionalidades
├── 📁 project-status/          # Estado del proyecto
├── 📁 technologies/            # Documentación de tecnologías
└── 📄 README.md               # Documentación principal
```

## 🎯 Reglas de Organización

### 1. **Separación por Responsabilidad**
- Cada carpeta tiene una función específica
- Los archivos relacionados van juntos

### 2. **Nomenclatura Consistente**
- **Carpetas**: camelCase (ej: `userContext`)
- **Archivos**: PascalCase para componentes (ej: `UserProfile.tsx`)
- **Archivos**: camelCase para utilidades (ej: `apiConfig.ts`)

### 3. **Importaciones Organizadas**
```typescript
// 1. Librerías externas
import React from 'react';
import { View, Text } from 'react-native';

// 2. Librerías internas
import { useTheme } from '@hooks/useAppTheme';

// 3. Componentes
import Button from '@components/ui/Button';

// 4. Tipos
import { User } from '@appTypes/DatasTypes';
```

## 🔄 Flujo de Datos

### 1. **Entrada de Datos**
```
Usuario interactúa → Componente detecta → Hook procesa → Servicio envía → API responde
```

### 2. **Salida de Datos**
```
API responde → Servicio procesa → Store actualiza → Contexto notifica → Componente renderiza
```

## 🎯 Resumen

1. **src/app/**: Punto de entrada de la aplicación
2. **src/components/**: Componentes reutilizables
3. **src/screens/**: Pantallas de la aplicación
4. **src/contexts/**: Estado compartido
5. **src/hooks/**: Lógica reutilizable
6. **src/services/**: Comunicación con APIs
7. **src/store/**: Estado global
8. **src/theme/**: Estilos y temas
9. **src/i18n/**: Traducciones
10. **src/utils/**: Funciones utilitarias

## ➡️ Siguiente Paso

Ahora que entiendes la estructura de carpetas, vamos a aprender sobre la **configuración del proyecto** y cómo se organizan los archivos de configuración.

[Configuración del Proyecto →](./configuracion-proyecto.md) 