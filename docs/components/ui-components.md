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
  editable?: boolean;               // Estado editable
  multiline?: boolean;              // Campo multilínea
  numberOfLines?: number;           // Número de líneas
  leftIcon?: string;                // Icono izquierdo
  rightIcon?: string;               // Icono derecho
  onRightIconPress?: () => void;    // Acción del icono derecho
}
```

**Características**:
- Validación en tiempo real
- Estados de error visuales
- Iconos opcionales
- Soporte para campos de contraseña
- Auto-capitalización configurable

**Ejemplo de Uso**:
```typescript
<Input
  label="Correo Electrónico"
  placeholder="tu@email.com"
  value={email}
  onChangeText={setEmail}
  error={emailError}
  keyboardType="email-address"
  leftIcon="mail-outline"
/>
```

## 🃏 **Componentes de Contenido**

### Card.tsx
**Propósito**: Contenedor de contenido con estilo de tarjeta.

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

**Características**:
- Sombras configurables
- Bordes redondeados
- Estados de presión
- Padding personalizable

### UserList.tsx
**Propósito**: Lista de usuarios con avatares y información.

**Props**:
```typescript
interface UserListProps {
  users: User[];                    // Lista de usuarios
  onUserPress?: (user: User) => void;
  showStatus?: boolean;              // Mostrar estado online
  showActions?: boolean;             // Mostrar acciones
  loading?: boolean;                 // Estado de carga
}
```

**Características**:
- Avatares circulares
- Estados online/offline
- Acciones contextuales
- Carga lazy de imágenes

## 📱 **Componentes de Navegación**

### Header.tsx
**Propósito**: Encabezado de pantalla con navegación y acciones.

**Props**:
```typescript
interface HeaderProps {
  title?: string;                   // Título del header
  leftComponent?: ReactNode;        // Componente izquierdo
  rightComponent?: ReactNode;       // Componente derecho
  transparent?: boolean;             // Fondo transparente
  showBackButton?: boolean;         // Mostrar botón atrás
  onBackPress?: () => void;         // Acción del botón atrás
}
```

**Características**:
- Fondo con blur effect
- Navegación automática
- Componentes personalizables
- Safe area handling

### BottomNavigation.tsx
**Propósito**: Navegación inferior con tabs.

**Props**:
```typescript
interface BottomNavigationProps {
  tabs: Tab[];                      // Lista de tabs
  activeTab: string;                // Tab activo
  onTabPress: (tab: string) => void;
  showLabels?: boolean;              // Mostrar etiquetas
}
```

**Características**:
- Iconos animados
- Indicador de tab activo
- Transiciones suaves
- Badges para notificaciones

### BottomMenu.tsx
**Propósito**: Menú inferior expandible.

**Características**:
- Animación de expansión
- Opciones configurables
- Feedback táctil
- Cierre automático

## ⏳ **Componentes de Carga**

### LoadingSpinner.tsx
**Propósito**: Indicador de carga con animación.

**Props**:
```typescript
interface LoadingSpinnerProps {
  size?: 'small' | 'large';         // Tamaño del spinner
  color?: string;                    // Color del spinner
  text?: string;                     // Texto de carga
  overlay?: boolean;                 // Fondo overlay
}
```

**Características**:
- Animación de rotación
- Texto opcional
- Overlay configurable
- Colores personalizables

### LoadingModal.tsx
**Propósito**: Modal de carga para operaciones largas.

**Props**:
```typescript
interface LoadingModalProps {
  visible: boolean;                  // Visibilidad del modal
  title?: string;                    // Título del modal
  message?: string;                  // Mensaje descriptivo
  progress?: number;                 // Progreso (0-100)
  cancelable?: boolean;              // Permite cancelar
  onCancel?: () => void;             // Acción de cancelar
}
```

**Características**:
- Indicador de progreso
- Mensajes dinámicos
- Opción de cancelación
- Bloqueo de interacciones

## 🎯 **Componentes de Acción**

### FAB.tsx
**Propósito**: Botón de acción flotante.

**Props**:
```typescript
interface FABProps {
  onPress: () => void;              // Acción del botón
  icon: string;                      // Icono del botón
  color?: string;                    // Color del botón
  size?: number;                     // Tamaño del botón
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}
```

**Características**:
- Posicionamiento configurable
- Animación de entrada
- Elevación automática
- Safe area handling

## 🌍 **Componentes de Configuración**

### LanguageSelector.tsx
**Propósito**: Selector de idioma con banderas.

**Props**:
```typescript
interface LanguageSelectorProps {
  currentLanguage: string;           // Idioma actual
  onLanguageChange: (lang: string) => void;
  languages: Language[];             // Idiomas disponibles
  showFlags?: boolean;               // Mostrar banderas
}
```

**Características**:
- Banderas de países
- Animación de selección
- Persistencia de preferencias
- Detección automática

### DateTimeSelector.tsx
**Propósito**: Selector de fecha y hora.

**Props**:
```typescript
interface DateTimeSelectorProps {
  value: Date;                       // Fecha/hora seleccionada
  onChange: (date: Date) => void;    // Callback de cambio
  mode?: 'date' | 'time' | 'datetime';
  minimumDate?: Date;                // Fecha mínima
  maximumDate?: Date;                // Fecha máxima
  format?: string;                   // Formato de fecha
}
```

**Características**:
- Selector nativo
- Validación de rangos
- Formatos personalizables
- Modo date/time/datetime

## 🎨 **Componentes de Estilo**

### AnimatedBackground.tsx
**Propósito**: Fondo animado con gradientes.

**Características**:
- Gradientes animados
- Colores dinámicos
- Performance optimizada
- Configuración de temas

## 📊 **Estados y Variantes**

### Estados de Componentes
1. **Default**: Estado normal
2. **Pressed**: Estado al presionar
3. **Disabled**: Estado deshabilitado
4. **Loading**: Estado de carga
5. **Error**: Estado de error
6. **Success**: Estado exitoso

### Variantes de Tamaño
- **Small**: Componentes pequeños
- **Medium**: Tamaño estándar
- **Large**: Componentes grandes
- **Custom**: Tamaño personalizado

## 🎯 **Accesibilidad**

### Características Implementadas
- **Screen Reader Support**: Labels y descripciones
- **Keyboard Navigation**: Navegación por teclado
- **High Contrast**: Soporte para alto contraste
- **Font Scaling**: Escalado de fuentes
- **Touch Targets**: Tamaños mínimos de 44px

## 🧪 **Testing**

### Estrategia de Testing
```typescript
// Ejemplo de test para Button
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
});
```

## 📈 **Performance**

### Optimizaciones Implementadas
- **React.memo**: Memoización de componentes
- **useMemo**: Memoización de cálculos
- **useCallback**: Memoización de funciones
- **Lazy Loading**: Carga diferida de iconos

### Métricas Objetivo
- **Render Time**: < 16ms por componente
- **Memory Usage**: < 50MB para componentes UI
- **Bundle Size**: < 100KB para librería de componentes

---

**Última actualización**: Diciembre 2024  
**Diseñador UI**: Equipo de Desarrollo MussikOn  
**Versión de Componentes**: 1.0.0 