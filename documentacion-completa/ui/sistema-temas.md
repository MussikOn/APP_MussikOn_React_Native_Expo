# 🎨 Sistema de Temas - MussikOn

## 🤔 ¿Qué es un Sistema de Temas?

Un **sistema de temas** es como un "traje" que se puede cambiar en tu aplicación. Te permite cambiar entre modo claro y oscuro, o incluso crear temas personalizados.

## 🎯 ¿Por qué un Sistema de Temas?

### Ventajas:
- **Accesibilidad**: Algunos usuarios prefieren modo oscuro
- **Experiencia personalizada**: Cada usuario puede elegir su preferencia
- **Ahorro de batería**: El modo oscuro ahorra batería en pantallas OLED
- **Menos fatiga visual**: Diferentes condiciones de luz requieren diferentes temas

## 🧠 Analogía Simple

Imagina que tienes una casa:

### Sin Sistema de Temas:
- La casa siempre se ve igual
- No puedes cambiar los colores
- Es aburrido y no se adapta a tus preferencias

### Con Sistema de Temas:
- Puedes cambiar entre "modo día" y "modo noche"
- Los colores se adaptan automáticamente
- Cada habitación puede tener su propio estilo
- Es dinámico y personalizable

## 🏗️ Arquitectura del Sistema de Temas en MussikOn

### 1. **ThemeContext** - El Cerebro del Sistema
```typescript
// src/contexts/ThemeContext.tsx
interface ThemeContextType {
  theme: Theme;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
```

### 2. **ThemeProvider** - El Proveedor
```typescript
// src/contexts/ThemeContext.tsx
export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>('light');
  const [theme, setTheme] = useState<Theme>(lightTheme);

  const updateTheme = () => {
    if (mode === 'dark') {
      setTheme(darkTheme);
    } else {
      setTheme(lightTheme);
    }
  };

  const toggleTheme = () => {
    setMode(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{
      theme,
      mode,
      setMode,
      toggleTheme,
      isDark: theme.mode === 'dark',
    }}>
      {children}
    </ThemeContext.Provider>
  );
};
```

## 🎨 Definición de Temas

### 1. **Tema Claro (Light Theme)**
```typescript
// src/contexts/ThemeContext.tsx
const lightTheme: Theme = {
  mode: 'light',
  colors: {
    primary: {
      50: '#e6f0fa',
      100: '#cce0f5',
      200: '#99c2eb',
      300: '#66a3e1',
      400: '#3385d7',
      500: '#014aad', // Color principal
      600: '#013e94',
      700: '#01337a',
      800: '#012760',
      900: '#001b47',
    },
    background: {
      primary: '#f1f1f1', // Fondo claro principal
      secondary: '#ffffff',
      tertiary: '#e5e5e5',
      card: '#ffffff',
      overlay: 'rgba(1, 74, 173, 0.08)',
    },
    text: {
      primary: '#000000', // Negro puro
      secondary: '#014aad', // Azul principal
      tertiary: '#666666',
      inverse: '#ffffff',
    },
    border: {
      primary: '#014aad',
      secondary: '#cccccc',
      accent: '#1aa3ff',
    },
  },
  gradients: {
    primary: ['#014aad', '#00334d'],
    secondary: ['#f1f1f1', '#014aad'],
    accent: ['#1aa3ff', '#014aad'],
  },
  shadows: {
    small: {
      shadowColor: '#014aad',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 2,
    },
  },
};
```

### 2. **Tema Oscuro (Dark Theme)**
```typescript
// src/contexts/ThemeContext.tsx
const darkTheme: Theme = {
  mode: 'dark',
  colors: {
    ...require('../theme/colors').colors,
    background: {
      primary: '#000000', // Negro puro
      secondary: '#111111',
      tertiary: '#222222',
      card: '#1a1a1a',
      overlay: 'rgba(1, 74, 173, 0.18)',
    },
    text: {
      primary: '#f1f1f1', // Blanco sucio
      secondary: '#1aa3ff', // Azul claro
      tertiary: '#cccccc',
      inverse: '#000000',
    },
    border: {
      primary: '#014aad',
      secondary: '#333333',
      accent: '#1aa3ff',
    },
  },
  gradients: require('../theme/colors').gradients,
  shadows: require('../theme/colors').shadows,
};
```

## 🎨 Paleta de Colores

### 1. **Colores Primarios (Azul)**
```typescript
// src/theme/colors.ts
export const colors = {
  primary: {
    50: '#e6f0fa',   // Muy claro
    100: '#cce0f5',  // Claro
    200: '#99c2eb',  // Medio claro
    300: '#66a3e1',  // Medio
    400: '#3385d7',  // Medio oscuro
    500: '#014aad',  // Principal
    600: '#013e94',  // Oscuro
    700: '#01337a',  // Muy oscuro
    800: '#012760',  // Extremadamente oscuro
    900: '#001b47',  // Casi negro
  },
};
```

### 2. **Colores Secundarios (Grises)**
```typescript
secondary: {
  50: '#f1f1f1',   // Blanco sucio
  100: '#e2e2e2',  // Gris muy claro
  200: '#cccccc',  // Gris claro
  300: '#b3b3b3',  // Gris medio
  400: '#8c8c8c',  // Gris medio oscuro
  500: '#444444',  // Gris oscuro
  600: '#222222',  // Gris muy oscuro
  700: '#111111',  // Casi negro
  800: '#080808',  // Negro suave
  900: '#000000',  // Negro puro
},
```

### 3. **Colores Semánticos**
```typescript
success: {
  500: '#23cd73',  // Verde para éxito
},
warning: {
  500: '#ffbf00',  // Amarillo para advertencias
},
error: {
  500: '#eb2323',  // Rojo para errores
},
```

## 🎨 Gradientes

### ¿Qué son los Gradientes?
Son transiciones suaves entre colores que crean efectos visuales atractivos.

### Gradientes en MussikOn:
```typescript
// src/theme/colors.ts
export const gradients = {
  primary: ['#014aad', '#00334d'] as const,      // Azul a azul oscuro
  secondary: ['#f1f1f1', '#014aad'] as const,   // Blanco a azul
  accent: ['#1aa3ff', '#014aad'] as const,       // Azul claro a azul
  sunset: ['#014aad', '#f1f1f1'] as const,       // Azul a blanco
  ocean: ['#014aad', '#1aa3ff', '#f1f1f1'] as const, // Azul a azul claro a blanco
  fire: ['#eb2323', '#ffbf00', '#014aad'] as const,   // Rojo a amarillo a azul
  cool: ['#e6f4ff', '#f1f1f1'] as const,        // Azul muy claro a blanco
  warm: ['#fff3cc', '#f1f1f1'] as const,        // Amarillo claro a blanco
  dark: ['#000000', '#014aad'] as const,         // Negro a azul
  light: ['#ffffff', '#f1f1f1'] as const,        // Blanco a blanco sucio
};
```

## 🎨 Sombras

### ¿Qué son las Sombras?
Son efectos que dan profundidad y elevación a los elementos.

### Sombras en MussikOn:
```typescript
// src/theme/colors.ts
export const shadows = {
  small: {
    shadowColor: '#014aad',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#014aad',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: '#014aad',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 8,
  },
  glow: {
    shadowColor: '#1aa3ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 5,
  },
};
```

## 🔄 Uso del Tema en Componentes

### 1. **Hook useTheme**
```typescript
// En cualquier componente
import { useTheme } from '@contexts/ThemeContext';

function MiComponente() {
  const { theme, isDark, toggleTheme } = useTheme();

  return (
    <View style={{ backgroundColor: theme.colors.background.primary }}>
      <Text style={{ color: theme.colors.text.primary }}>
        Hola Mundo
      </Text>
      <Button title="Cambiar Tema" onPress={toggleTheme} />
    </View>
  );
}
```

### 2. **Estilos con Tema**
```typescript
// src/components/ui/Button.tsx
import { useTheme } from '@contexts/ThemeContext';

export function Button({ title, onPress, style }: ButtonProps) {
  const { theme } = useTheme();

  const buttonStyles = {
    backgroundColor: theme.colors.primary[500],
    padding: 12,
    borderRadius: 8,
    ...theme.shadows.small,
  };

  const textStyles = {
    color: theme.colors.text.inverse,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center' as const,
  };

  return (
    <TouchableOpacity onPress={onPress} style={[buttonStyles, style]}>
      <Text style={textStyles}>{title}</Text>
    </TouchableOpacity>
  );
}
```

### 3. **Gradientes con Tema**
```typescript
// src/components/ui/styles/AnimatedBackground.tsx
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@contexts/ThemeContext';

export function AnimatedBackground() {
  const { theme } = useTheme();

  return (
    <LinearGradient
      colors={theme.gradients.primary}
      style={StyleSheet.absoluteFill}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    />
  );
}
```

## 🎨 Componentes con Tema

### 1. **Card Component**
```typescript
// src/components/ui/Card.tsx
import { useTheme } from '@contexts/ThemeContext';

export function Card({ children, style }: CardProps) {
  const { theme } = useTheme();

  const cardStyles = {
    backgroundColor: theme.colors.background.card,
    borderRadius: 12,
    padding: 16,
    margin: 8,
    ...theme.shadows.medium,
  };

  return (
    <View style={[cardStyles, style]}>
      {children}
    </View>
  );
}
```

### 2. **Input Component**
```typescript
// src/components/ui/Input.tsx
import { useTheme } from '@contexts/ThemeContext';

export function Input({ placeholder, value, onChangeText, ...props }: InputProps) {
  const { theme } = useTheme();

  const inputStyles = {
    backgroundColor: theme.colors.background.secondary,
    borderColor: theme.colors.border.secondary,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: theme.colors.text.primary,
  };

  return (
    <TextInput
      style={inputStyles}
      placeholder={placeholder}
      placeholderTextColor={theme.colors.text.tertiary}
      value={value}
      onChangeText={onChangeText}
      {...props}
    />
  );
}
```

## 🎨 Pantallas con Tema

### 1. **Login Screen**
```typescript
// src/screens/auth/Login.tsx
import { useTheme } from '@contexts/ThemeContext';

export default function Login() {
  const { theme } = useTheme();

  const containerStyles = {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
    padding: 20,
    justifyContent: 'center',
  };

  const titleStyles = {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    textAlign: 'center' as const,
    marginBottom: 30,
  };

  return (
    <View style={containerStyles}>
      <Text style={titleStyles}>Iniciar Sesión</Text>
      <Input placeholder="Email" />
      <Input placeholder="Contraseña" secureTextEntry />
      <Button title="Entrar" onPress={handleLogin} />
    </View>
  );
}
```

### 2. **Dashboard Screen**
```typescript
// src/screens/dashboard/Dashboard.tsx
import { useTheme } from '@contexts/ThemeContext';

export default function Dashboard() {
  const { theme, isDark } = useTheme();

  const headerStyles = {
    backgroundColor: theme.colors.background.card,
    padding: 20,
    ...theme.shadows.small,
  };

  const statusStyles = {
    backgroundColor: isDark ? theme.colors.secondary[700] : theme.colors.primary[100],
    padding: 10,
    borderRadius: 8,
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background.primary }}>
      <View style={headerStyles}>
        <Text style={{ color: theme.colors.text.primary, fontSize: 18 }}>
          Panel de Control
        </Text>
      </View>
      <View style={statusStyles}>
        <Text style={{ color: theme.colors.text.primary }}>
          Estado: {isDark ? 'Modo Oscuro' : 'Modo Claro'}
        </Text>
      </View>
    </View>
  );
}
```

## 🔄 Cambio de Tema

### 1. **Toggle Button**
```typescript
// En cualquier componente
import { useTheme } from '@contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

function ThemeToggle() {
  const { theme, isDark, toggleTheme } = useTheme();

  return (
    <TouchableOpacity onPress={toggleTheme} style={styles.toggleButton}>
      <Ionicons 
        name={isDark ? 'sunny' : 'moon'} 
        size={24} 
        color={theme.colors.text.primary} 
      />
    </TouchableOpacity>
  );
}
```

### 2. **Settings Screen**
```typescript
// src/screens/settings/SettingsScreen.tsx
import { useTheme } from '@contexts/ThemeContext';

export default function SettingsScreen() {
  const { theme, mode, setMode } = useTheme();

  const themeOptions = [
    { label: 'Claro', value: 'light' },
    { label: 'Oscuro', value: 'dark' },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background.primary }}>
      <Text style={{ color: theme.colors.text.primary, fontSize: 18 }}>
        Configuración de Tema
      </Text>
      
      {themeOptions.map((option) => (
        <TouchableOpacity
          key={option.value}
          onPress={() => setMode(option.value as ThemeMode)}
          style={{
            backgroundColor: mode === option.value 
              ? theme.colors.primary[500] 
              : theme.colors.background.card,
            padding: 15,
            margin: 5,
            borderRadius: 8,
          }}
        >
          <Text style={{
            color: mode === option.value 
              ? theme.colors.text.inverse 
              : theme.colors.text.primary,
          }}>
            {option.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
```

## 💾 Persistencia del Tema

### ¿Cómo se Guarda la Preferencia?
```typescript
// src/contexts/ThemeContext.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>('light');

  // Cargar tema guardado al iniciar
  useEffect(() => {
    loadThemeMode();
  }, []);

  const loadThemeMode = async () => {
    try {
      const savedMode = await AsyncStorage.getItem('themeMode');
      if (savedMode && ['light', 'dark', 'auto'].includes(savedMode)) {
        setMode(savedMode as ThemeMode);
      }
    } catch (error) {
      console.error('Error loading theme mode:', error);
    }
  };

  // Guardar tema cuando cambie
  useEffect(() => {
    saveThemeMode();
  }, [mode]);

  const saveThemeMode = async () => {
    try {
      await AsyncStorage.setItem('themeMode', mode);
    } catch (error) {
      console.error('Error saving theme mode:', error);
    }
  };
};
```

## 🎨 Temas Personalizados

### ¿Cómo Crear un Tema Personalizado?
```typescript
// src/theme/customTheme.ts
export const customTheme: Theme = {
  mode: 'custom',
  colors: {
    primary: {
      500: '#FF6B6B', // Rojo coral
    },
    background: {
      primary: '#2C3E50', // Azul oscuro
      secondary: '#34495E',
      card: '#ECF0F1',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#FF6B6B',
      tertiary: '#BDC3C7',
    },
  },
  gradients: {
    primary: ['#FF6B6B', '#4ECDC4'],
    secondary: ['#2C3E50', '#34495E'],
  },
  shadows: {
    small: {
      shadowColor: '#FF6B6B',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
  },
};
```

## 🎯 Resumen

1. **ThemeContext**: Maneja el estado del tema
2. **ThemeProvider**: Proporciona el tema a toda la app
3. **Colores**: Paleta organizada por categorías
4. **Gradientes**: Transiciones suaves entre colores
5. **Sombras**: Efectos de profundidad
6. **Persistencia**: El tema se guarda automáticamente
7. **Personalización**: Puedes crear temas propios

## ➡️ Siguiente Paso

Ahora que entiendes el sistema de temas, vamos a aprender sobre los **componentes de UI** y cómo se construyen las interfaces de usuario.

[Componentes de UI →](./componentes-ui.md) 