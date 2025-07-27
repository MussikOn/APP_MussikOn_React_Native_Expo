# 🎨 Componentes UI - MussikOn

## 📋 **Descripción General**

Los componentes UI de MussikOn están diseñados siguiendo los principios de **Design System** y **Atomic Design**. Cada componente es reutilizable, accesible y mantiene consistencia visual en toda la aplicación.

## 🏗️ **Arquitectura de Componentes**

### Estructura de Carpetas
```
src/components/ui/
├── Button.tsx              # Botones principales
├── Input.tsx               # Campos de entrada
├── Card.tsx                # Tarjetas contenedoras
├── Header.tsx              # Encabezados de pantalla
├── LoadingSpinner.tsx      # Indicadores de carga
├── LoadingModal.tsx        # Modales de carga
├── FAB.tsx                 # Botón de acción flotante
├── BottomNavigation.tsx    # Navegación inferior
├── BottomMenu.tsx          # Menú inferior
├── LanguageSelector.tsx    # Selector de idioma
├── DateTimeSelector.tsx    # Selector de fecha/hora
├── UserList.tsx            # Lista de usuarios
├── Logo.tsx                # Logo de la aplicación
├── NotificationSnackbar.tsx # Notificaciones
├── buttons/                # Variantes de botones
│   ├── OutlineButton.tsx   # Botón con borde
│   └── SlideButton.tsx     # Botón deslizante
└── styles/                 # Estilos animados
    └── AnimatedBackground.tsx # Fondo animado
```

## 🔘 **Componentes de Botones**

### Button.tsx
**Propósito**: Componente principal de botón con múltiples variantes.

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

**Variantes**:
- **Primary**: Botón principal con color de marca
- **Secondary**: Botón secundario con color gris
- **Outline**: Botón con borde y fondo transparente
- **Success**: Botón para acciones exitosas (verde)
- **Danger**: Botón para acciones peligrosas (rojo)

**Ejemplo de Uso**:
```typescript
<Button
  title="Iniciar Sesión"
  onPress={handleLogin}
  type="primary"
  loading={isLoading}
  icon="log-in-outline"
/>
```

### OutlineButton.tsx
**Propósito**: Botón con estilo outline para acciones secundarias.

**Características**:
- Borde visible con color primario
- Fondo transparente
- Texto en color primario
- Hover effect con opacidad

### SlideButton.tsx
**Propósito**: Botón deslizante para confirmaciones importantes.

**Características**:
- Animación de deslizamiento
- Feedback táctil
- Indicador de progreso
- Confirmación visual

## 📝 **Componentes de Entrada**

### Input.tsx
**Propósito**: Campo de entrada de texto con validación integrada.

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
  autoCorrect?: boolean;
  multiline?: boolean;              // Campo de múltiples líneas
  numberOfLines?: number;           // Número de líneas
  style?: ViewStyle;                // Estilos personalizados
  containerStyle?: ViewStyle;       // Estilos del contenedor
}
```

**Características**:
- Validación en tiempo real
- Estados de error visuales
- Soporte para campos de contraseña
- Iconos de acción (limpiar, mostrar/ocultar)
- Animaciones suaves

**Ejemplo de Uso**:
```typescript
<Input
  label="Email"
  placeholder="Ingresa tu email"
  value={email}
  onChangeText={setEmail}
  error={emailError}
  keyboardType="email-address"
  autoCapitalize="none"
/>
```

## 🃏 **Componentes de Contenedores**

### Card.tsx
**Propósito**: Tarjeta contenedora para agrupar contenido relacionado.

**Props**:
```typescript
interface CardProps {
  children: React.ReactNode;        // Contenido de la tarjeta
  style?: ViewStyle;                // Estilos personalizados
  padding?: number;                 // Padding interno
  margin?: number;                  // Margen externo
  elevation?: number;               // Elevación (Android)
  shadowColor?: string;             // Color de sombra
  shadowOffset?: { width: number; height: number };
  shadowOpacity?: number;           // Opacidad de sombra
  shadowRadius?: number;            // Radio de sombra
  borderRadius?: number;            // Radio de borde
  backgroundColor?: string;         // Color de fondo
}
```

**Características**:
- Sombras consistentes
- Bordes redondeados
- Padding configurable
- Colores adaptables al tema

**Ejemplo de Uso**:
```typescript
<Card padding={16} elevation={4}>
  <Text>Contenido de la tarjeta</Text>
</Card>
```

## 📱 **Componentes de Navegación**

### Header.tsx
**Propósito**: Encabezado de pantalla con navegación y acciones.

**Props**:
```typescript
interface HeaderProps {
  title?: string;                   // Título del header
  leftComponent?: React.ReactNode;  // Componente izquierdo
  rightComponent?: React.ReactNode; // Componente derecho
  transparent?: boolean;            // Header transparente
  style?: ViewStyle;                // Estilos personalizados
  showBackButton?: boolean;         // Mostrar botón de atrás
  onBackPress?: () => void;        // Función de atrás
}
```

**Características**:
- Fondo con blur effect
- Botones de navegación
- Título centrado
- Acciones personalizables

### BottomNavigation.tsx
**Propósito**: Navegación inferior con tabs.

**Props**:
```typescript
interface BottomNavigationProps {
  tabs: TabItem[];                  // Lista de tabs
  activeTab: string;                // Tab activo
  onTabPress: (tabId: string) => void;
  style?: ViewStyle;                // Estilos personalizados
}
```

**Características**:
- Iconos animados
- Indicador de tab activo
- Badges para notificaciones
- Transiciones suaves

### BottomMenu.tsx
**Propósito**: Menú inferior con opciones adicionales.

**Características**:
- Opciones contextuales
- Animaciones de entrada/salida
- Acciones rápidas
- Integración con FAB

## 🔄 **Componentes de Estado**

### LoadingSpinner.tsx
**Propósito**: Indicador de carga con animación.

**Props**:
```typescript
interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;                   // Color del spinner
  style?: ViewStyle;                // Estilos personalizados
  text?: string;                    // Texto de carga
  showText?: boolean;               // Mostrar texto
}
```

**Características**:
- Animación de rotación
- Tamaños predefinidos
- Colores adaptables
- Texto opcional

### LoadingModal.tsx
**Propósito**: Modal de carga para operaciones largas.

**Props**:
```typescript
interface LoadingModalProps {
  visible: boolean;                 // Estado visible
  message?: string;                 // Mensaje de carga
  onCancel?: () => void;           // Función de cancelar
  cancelable?: boolean;             // Permitir cancelar
}
```

**Características**:
- Overlay semi-transparente
- Spinner centrado
- Mensaje personalizable
- Opción de cancelar

## 🎨 **Componentes Especializados**

### Logo.tsx
**Propósito**: Logo de la aplicación con diferentes variantes.

**Props**:
```typescript
interface LogoProps {
  size?: number;                    // Tamaño del logo
  showText?: boolean;               // Mostrar texto
  variant?: 'default' | 'minimal';  // Variante del logo
  style?: ViewStyle;                // Estilos personalizados
}
```

**Características**:
- SVG vectorial escalable
- Colores adaptables al tema
- Variantes con/sin texto
- Animaciones de entrada

### NotificationSnackbar.tsx
**Propósito**: Notificaciones tipo snackbar.

**Props**:
```typescript
interface NotificationSnackbarProps {
  visible: boolean;                 // Estado visible
  message: string;                  // Mensaje
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;                // Duración en ms
  onDismiss?: () => void;          // Función de cerrar
  action?: {                       // Acción opcional
    label: string;
    onPress: () => void;
  };
}
```

**Características**:
- Posicionamiento automático
- Colores por tipo
- Animaciones de entrada/salida
- Acciones personalizables

### LanguageSelector.tsx
**Propósito**: Selector de idioma con interfaz moderna.

**Props**:
```typescript
interface LanguageSelectorProps {
  currentLanguage: string;          // Idioma actual
  onLanguageChange: (lang: string) => void;
  languages: Language[];            // Idiomas disponibles
  style?: ViewStyle;                // Estilos personalizados
}
```

**Características**:
- Lista de idiomas disponibles
- Banderas de países
- Animaciones de selección
- Persistencia de preferencia

### DateTimeSelector.tsx
**Propósito**: Selector de fecha y hora.

**Props**:
```typescript
interface DateTimeSelectorProps {
  value: Date;                      // Fecha seleccionada
  onValueChange: (date: Date) => void;
  mode?: 'date' | 'time' | 'datetime';
  minimumDate?: Date;               // Fecha mínima
  maximumDate?: Date;               // Fecha máxima
  style?: ViewStyle;                // Estilos personalizados
}
```

**Características**:
- Selector nativo por plataforma
- Validación de fechas
- Formato localizado
- Integración con calendario

### UserList.tsx
**Propósito**: Lista de usuarios con avatares.

**Props**:
```typescript
interface UserListProps {
  users: User[];                    // Lista de usuarios
  onUserPress?: (user: User) => void;
  showStatus?: boolean;             // Mostrar estado online
  showActions?: boolean;            // Mostrar acciones
  style?: ViewStyle;                // Estilos personalizados
}
```

**Características**:
- Avatares circulares
- Estados online/offline
- Acciones contextuales
- Scroll optimizado

## 🎭 **Componentes Animados**

### AnimatedBackground.tsx
**Propósito**: Fondo animado para pantallas.

**Características**:
- Gradientes animados
- Partículas flotantes
- Efectos de parallax
- Performance optimizada

### FAB.tsx
**Propósito**: Botón de acción flotante.

**Props**:
```typescript
interface FABProps {
  onPress: () => void;              // Función de callback
  icon: string;                     // Icono
  style?: ViewStyle;                // Estilos personalizados
  color?: string;                   // Color del FAB
  size?: number;                    // Tamaño
  visible?: boolean;                // Estado visible
}
```

**Características**:
- Posicionamiento flotante
- Animaciones de entrada/salida
- Elevación dinámica
- Integración con scroll

## 🎨 **Sistema de Temas**

### Integración con Tema
Todos los componentes están integrados con el sistema de temas:

```typescript
// Uso del tema en componentes
const { theme } = useTheme();

<View style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
  <Text style={[styles.text, { color: theme.colors.text.primary }]}>
    Contenido
  </Text>
</View>
```

### Colores del Tema
```typescript
// Paleta de colores oficial
const colors = {
  primary: {
    500: '#014aad',    // Azul principal
    600: '#013e94',    // Azul oscuro
    400: '#3385d7',    // Azul claro
  },
  secondary: {
    500: '#444444',    // Gris medio
    900: '#000000',    // Negro puro
  },
  accent: {
    500: '#1aa3ff',    // Azul claro
  }
};
```

## ♿ **Accesibilidad**

### Implementación de Accesibilidad
Todos los componentes incluyen soporte para accesibilidad:

```typescript
// Ejemplo de accesibilidad en botón
<TouchableOpacity
  accessible={true}
  accessibilityLabel="Botón de inicio de sesión"
  accessibilityRole="button"
  accessibilityHint="Presiona para iniciar sesión"
  onPress={handleLogin}
>
  <Text>Iniciar Sesión</Text>
</TouchableOpacity>
```

### Características de Accesibilidad
- **Labels descriptivos**: Textos claros para screen readers
- **Roles semánticos**: Roles apropiados para cada elemento
- **Hints contextuales**: Información adicional para usuarios
- **Contraste adecuado**: Colores con contraste suficiente
- **Tamaños de toque**: Áreas de toque mínimas de 44x44px

## 📱 **Responsive Design**

### Adaptación a Diferentes Pantallas
Los componentes se adaptan automáticamente a diferentes tamaños:

```typescript
// Uso de dimensiones responsivas
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    padding: width > 768 ? 24 : 16, // Tablet vs móvil
    fontSize: width > 768 ? 18 : 16,
  }
});
```

### Breakpoints
- **Móvil**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🧪 **Testing**

### Tests de Componentes
```typescript
// __tests__/components/Button.test.tsx
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '../Button';

describe('Button Component', () => {
  it('renders correctly with title', () => {
    const { getByText } = render(
      <Button title="Test Button" onPress={() => {}} />
    );
    
    expect(getByText('Test Button')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <Button title="Test Button" onPress={onPress} />
    );
    
    fireEvent.press(getByText('Test Button'));
    expect(onPress).toHaveBeenCalled();
  });

  it('shows loading state', () => {
    const { getByTestId } = render(
      <Button title="Test Button" onPress={() => {}} loading={true} />
    );
    
    expect(getByTestId('loading-spinner')).toBeTruthy();
  });
});
```

## 📚 **Documentación de Uso**

### Guías de Implementación
1. **Importar componente**: `import { Button } from '@components/ui/Button';`
2. **Usar props básicas**: `title`, `onPress`
3. **Personalizar estilo**: `style`, `type`
4. **Agregar funcionalidad**: `loading`, `disabled`, `icon`

### Mejores Prácticas
- Usar tipos predefinidos para consistencia
- Implementar accesibilidad en todos los componentes
- Mantener performance con memoización cuando sea necesario
- Documentar props complejas
- Probar todos los estados del componente

## 🔄 **Mantenimiento**

### Actualizaciones de Componentes
- **Versiones**: Control de versiones semántico
- **Breaking Changes**: Documentados claramente
- **Migración**: Guías de migración para cambios importantes
- **Deprecación**: Avisos de deprecación con tiempo suficiente

### Performance
- **Memoización**: React.memo para componentes pesados
- **Lazy Loading**: Carga diferida de componentes complejos
- **Optimización**: Re-renders optimizados
- **Bundle Size**: Tamaño de bundle controlado

---

**Última actualización**: Diciembre 2024  
**Versión de componentes**: 2.0.0  
**Estado**: Implementado y documentado 