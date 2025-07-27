# 📝 Documentación Detallada de Componentes - MussikOn

## 🎯 **Descripción General**

Esta documentación proporciona detalles técnicos específicos de cada componente del proyecto MussikOn, incluyendo su propósito, implementación, props, estados y ejemplos de uso.

## 🏗️ **Componentes de Navegación**

### MainTabs.tsx
**Archivo**: `src/components/navigation/MainTabs.tsx`

**Propósito**: Componente principal de navegación que maneja la navegación por tabs según el rol del usuario.

**Props**:
```typescript
interface MainTabsProps {
  user: Token;  // Usuario autenticado con información de rol
}
```

**Funcionalidades**:
- Navegación condicional por roles (eventCreator vs musico)
- Sidebar integrado con MainSidebar
- Bottom navigation con tabs dinámicos
- Gestión de estado de pantalla activa
- Wrapper con header personalizado

**Estados**:
```typescript
const [sidebarVisible, setSidebarVisible] = useState(false);
const [activeScreen, setActiveScreen] = useState('Inicio');
```

**Lógica de Roles**:
```typescript
const isOrganizador = user.roll === "eventCreator";
const isMusico = user.roll === "musico";

// Tabs diferentes según el rol
const getAvailableTabs = () => {
  if (isOrganizador) {
    return [
      { name: 'Inicio', icon: 'home' },
      { name: 'Crear Solicitud', icon: 'add-circle' },
      { name: 'Mis Solicitudes', icon: 'list' },
      { name: 'Perfil', icon: 'person' },
      { name: 'Configuracion', icon: 'settings' },
    ];
  } else {
    return [
      { name: 'Inicio', icon: 'home' },
      { name: 'Mis Solicitudes', icon: 'list' },
      { name: 'Agenda', icon: 'calendar' },
      { name: 'Historial', icon: 'time' },
      { name: 'Configuracion', icon: 'settings' },
    ];
  }
};
```

**Ejemplo de Uso**:
```typescript
<MainTabs user={authenticatedUser} />
```

## 🎨 **Componentes UI Principales**

### Button.tsx
**Archivo**: `src/components/ui/Button.tsx`

**Propósito**: Componente de botón reutilizable con múltiples variantes y estados.

**Props**:
```typescript
interface ButtonProps {
  title: string;                    // Texto del botón
  onPress: () => void;             // Función de callback
  type?: 'primary' | 'secondary' | 'outline' | 'success' | 'danger';
  loading?: boolean;                // Estado de carga
  disabled?: boolean;               // Estado deshabilitado
  icon?: string;                    // Icono (Ionicons)
  iconPosition?: 'left' | 'right'; // Posición del icono
  style?: ViewStyle;                // Estilos personalizados
  textStyle?: TextStyle;            // Estilos del texto
}
```

**Variantes de Estilo**:
```typescript
const getButtonStyle = () => {
  const baseStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    minHeight: 48,
    elevation: 2,
    shadowColor: color_primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  };

  switch (type) {
    case 'primary':
      return { ...baseStyle, backgroundColor: btn_primary };
    case 'secondary':
      return { ...baseStyle, backgroundColor: color_secondary };
    case 'outline':
      return {
        ...baseStyle,
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: color_primary,
      };
    case 'success':
      return { ...baseStyle, backgroundColor: btn_success };
    case 'danger':
      return { ...baseStyle, backgroundColor: btn_danger };
    default:
      return baseStyle;
  }
};
```

**Estados de Carga**:
```typescript
{loading ? (
  <ActivityIndicator size="small" color={getIconColor()} />
) : (
  <>
    {icon && iconPosition === 'left' && (
      <Ionicons name={icon as any} size={20} color={getIconColor()} />
    )}
    <Text style={[getTextStyle(), textStyle]}>{title}</Text>
    {icon && iconPosition === 'right' && (
      <Ionicons name={icon as any} size={20} color={getIconColor()} />
    )}
  </>
)}
```

### Input.tsx
**Archivo**: `src/components/ui/Input.tsx`

**Propósito**: Campo de entrada de texto con validación integrada y estados de error.

**Props**:
```typescript
interface InputProps {
  label?: string;                   // Etiqueta del campo
  placeholder?: string;             // Texto de placeholder
  value: string;                    // Valor del campo
  onChangeText: (text: string) => void;
  error?: string;                   // Mensaje de error
  secureTextEntry?: boolean;        // Campo de contraseña
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  editable?: boolean;               // Estado editable
  multiline?: boolean;              // Campo multilínea
  numberOfLines?: number;           // Número de líneas
  leftIcon?: string;                // Icono izquierdo
  rightIcon?: string;               // Icono derecho
  onRightIconPress?: () => void;    // Acción del icono derecho
}
```

**Estados de Error**:
```typescript
const inputStyle = [
  styles.input,
  error && styles.inputError,
  disabled && styles.inputDisabled,
  multiline && styles.inputMultiline,
];
```

**Validación en Tiempo Real**:
```typescript
const handleTextChange = (text: string) => {
  onChangeText(text);
  
  // Validación en tiempo real
  if (error && text.length > 0) {
    // Limpiar error si el usuario empieza a escribir
    onErrorChange?.('');
  }
};
```

### Card.tsx
**Archivo**: `src/components/ui/Card.tsx`

**Propósito**: Contenedor de contenido con estilo de tarjeta y sombras.

**Props**:
```typescript
interface CardProps {
  children: ReactNode;              // Contenido de la tarjeta
  style?: ViewStyle;                // Estilos personalizados
  onPress?: () => void;             // Acción al presionar
  disabled?: boolean;               // Estado deshabilitado
  elevation?: number;                // Elevación de la sombra
  borderRadius?: number;             // Radio de borde
  padding?: number;                 // Padding interno
}
```

**Estilos Dinámicos**:
```typescript
const cardStyle = [
  styles.card,
  {
    elevation: elevation || 2,
    borderRadius: borderRadius || 12,
    padding: padding || 16,
  },
  style,
];
```

## 📱 **Pantallas de Autenticación**

### Login.tsx
**Archivo**: `src/screens/auth/Login.tsx`

**Propósito**: Pantalla de inicio de sesión con validación y manejo de errores.

**Estados Locales**:
```typescript
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [showPassword, setShowPassword] = useState(false);
const [emailError, setEmailError] = useState('');
const [passwordError, setPasswordError] = useState('');
const [loading, setLoading] = useState(false);
const [apiError, setApiError] = useState('');
```

**Validación de Formulario**:
```typescript
const validateForm = () => {
  let valid = true;
  
  // Validación de email
  if (!email) {
    setEmailError(t('login.email') + ' ' + t('login.required'));
    valid = false;
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    setEmailError(t('login.email') + ' ' + t('login.invalid'));
    valid = false;
  } else {
    setEmailError('');
  }
  
  // Validación de contraseña
  if (!password) {
    setPasswordError(t('login.password') + ' ' + t('login.required'));
    valid = false;
  } else if (password.length < 6) {
    setPasswordError(t('login.password') + ' ' + t('login.min_length'));
    valid = false;
  } else {
    setPasswordError('');
  }
  
  return valid;
};
```

**Flujo de Autenticación**:
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
      setApiError(response.message || t('login.error'));
      setLoading(false);
    }
  } catch (error: any) {
    setApiError(error.message || t('login.connection_error'));
    setLoading(false);
  }
};
```

## 🔧 **Componentes de Servicios**

### api.ts
**Archivo**: `src/services/api.ts`

**Propósito**: Cliente HTTP configurado con interceptores y manejo de errores.

**Configuración Base**:
```typescript
const createApiInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: API_URL,
    timeout: API_TIMEOUT,
    headers: DEFAULT_HEADERS,
  });
  
  return instance;
};
```

**Interceptor de Request**:
```typescript
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
```

**Interceptor de Response**:
```typescript
instance.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`);
    return response;
  },
  async (error: AxiosError) => {
    console.error(`❌ ${error.config?.method?.toUpperCase()} ${error.config?.url} - ${error.response?.status}`);

    // Manejo de token expirado
    if (error.response?.status === 401) {
      try {
        await deleteToken();
        store.dispatch(logout());
        console.log('🔐 Token expirado, usuario deslogueado');
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
```

## 🗄️ **Componentes de Estado**

### authSlice.ts
**Archivo**: `src/store/slices/authSlice.ts`

**Propósito**: Slice de Redux para gestión del estado de autenticación.

**Estado Inicial**:
```typescript
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
```

**Reducers**:
```typescript
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
```

## 🌍 **Componentes de Internacionalización**

### LanguageContext.tsx
**Archivo**: `src/contexts/LanguageContext.tsx`

**Propósito**: Contexto de React para gestión de idiomas.

**Interfaz del Contexto**:
```typescript
interface LanguageContextType {
  currentLanguage: string;
  changeLanguage: (language: string) => Promise<void>;
  availableLanguages: Array<{ code: string; name: string; nativeName: string }>;
}
```

**Idiomas Disponibles**:
```typescript
export const availableLanguages = [
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'en', name: 'English', nativeName: 'English' },
];
```

**Hook Personalizado**:
```typescript
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
```

## 🎨 **Componentes de Tema**

### theme.ts
**Archivo**: `src/theme/theme.ts`

**Propósito**: Configuración de temas claro y oscuro.

**Interfaz del Tema**:
```typescript
export interface AppTheme {
  dark: boolean;
  colors: {
    primary: string;
    info: string;
    background: string;
    card: string;
    text: string;
    secondaryText: string;
    border: string;
    notification: string;
    success: string;
    danger: string;
    white: string;
  };
}
```

**Tema Claro**:
```typescript
export const lightTheme: AppTheme = {
  dark: false,
  colors: {
    ...commonColors,
    background: '#F5F5F7',
    card: '#FFFFFF',
    text: '#121212',
    secondaryText: '#666666',
    border: '#EAEAEA',
    notification: commonColors.primary,
  },
};
```

**Tema Oscuro**:
```typescript
export const darkTheme: AppTheme = {
  dark: true,
  colors: {
    ...commonColors,
    background: '#121212',
    card: '#1E1E1E',
    text: '#FFFFFF',
    secondaryText: '#A9A9A9',
    border: '#2C2C2C',
    notification: commonColors.info,
  },
};
```

## 🔧 **Componentes de Utilidades**

### functions.ts
**Archivo**: `src/utils/functions.ts`

**Propósito**: Funciones de utilidad para gestión de tokens y validaciones.

**Gestión de Tokens**:
```typescript
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

export const getToken = async () => {
  try {
    const token = await SecureStore.getItemAsync('token');
    return token;
  } catch (error) {
    console.error('Error al obtener el token:', error);
    throw error;
  }
};

export const deleteToken = async () => {
  try {
    await SecureStore.deleteItemAsync('token');
    console.log('Token eliminado');
  } catch (error) {
    console.error('Error al eliminar el token:', error);
    throw error;
  }
};
```

**Validaciones**:
```typescript
export function validarPassword(password: string): boolean {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#])[A-Za-z\d@$!%*?&.#]{8,}$/;
  return regex.test(password);
}

export function validarEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}
```

## 📊 **Patrones de Diseño Implementados**

### 1. **Container/Presentational Pattern**
```typescript
// Container Component
const EventListContainer = () => {
  const events = useAppSelector(state => state.events.list);
  const dispatch = useAppDispatch();
  
  return <EventList events={events} onEventPress={handleEventPress} />;
};

// Presentational Component
const EventList = ({ events, onEventPress }) => {
  return (
    <FlatList
      data={events}
      renderItem={({ item }) => <EventCard event={item} onPress={onEventPress} />}
    />
  );
};
```

### 2. **Custom Hooks Pattern**
```typescript
export const useAuth = () => {
  const { isAuthenticated, user } = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();
  
  const login = async (credentials) => {
    // Lógica de login
  };
  
  const logout = () => {
    dispatch(logout());
  };
  
  return { isAuthenticated, user, login, logout };
};
```

### 3. **Service Layer Pattern**
```typescript
export const eventService = {
  async getEvents() {
    return apiService.get('/events');
  },
  
  async createEvent(eventData) {
    return apiService.post('/events', eventData);
  }
};
```

## 🧪 **Testing de Componentes**

### Ejemplo de Test para Button
```typescript
describe('Button Component', () => {
  it('should render with correct title', () => {
    render(<Button title="Test Button" onPress={jest.fn()} />);
    expect(screen.getByText('Test Button')).toBeInTheDocument();
  });

  it('should call onPress when pressed', () => {
    const onPress = jest.fn();
    render(<Button title="Test" onPress={onPress} />);
    fireEvent.press(screen.getByText('Test'));
    expect(onPress).toHaveBeenCalled();
  });

  it('should show loading state', () => {
    render(<Button title="Test" onPress={jest.fn()} loading={true} />);
    expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();
  });
});
```

### Ejemplo de Test para Input
```typescript
describe('Input Component', () => {
  it('should update value when text changes', () => {
    const onChangeText = jest.fn();
    render(<Input value="" onChangeText={onChangeText} />);
    
    fireEvent.changeText(screen.getByTestId('input'), 'test');
    expect(onChangeText).toHaveBeenCalledWith('test');
  });

  it('should show error message', () => {
    render(<Input value="" onChangeText={jest.fn()} error="Error message" />);
    expect(screen.getByText('Error message')).toBeInTheDocument();
  });
});
```

---

**Última actualización**: Diciembre 2024  
**Documentador**: Equipo de Desarrollo MussikOn  
**Versión de Documentación**: 1.0.0 