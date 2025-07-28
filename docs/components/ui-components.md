# 🎨 Componentes UI - MussikOn

## 📋 Tabla de Contenidos

- [🎯 Descripción General](#-descripción-general)
- [🔧 Componentes Base](#-componentes-base)
- [📱 Componentes de Formularios](#-componentes-de-formularios)
- [🎨 Componentes de Navegación](#-componentes-de-navegación)
- [🔔 Componentes de Notificaciones](#-componentes-de-notificaciones)
- [📊 Componentes de Datos](#-componentes-de-datos)
- [🎭 Componentes de Feedback](#-componentes-de-feedback)
- [📐 Sistema de Diseño](#-sistema-de-diseño)
- [🎨 Guías de Uso](#-guías-de-uso)

---

## 🎯 Descripción General

Los componentes UI de MussikOn están diseñados para ser **reutilizables**, **consistentes** y **accesibles**. Todos los componentes siguen el sistema de diseño unificado y soportan temas claro/oscuro.

### 🎪 Principios de Diseño

- ✅ **Consistencia**: Mismos patrones en toda la app
- ✅ **Reutilización**: Componentes modulares
- ✅ **Accesibilidad**: Soporte para lectores de pantalla
- ✅ **Performance**: Optimizados para renderizado
- ✅ **Temas**: Soporte para claro/oscuro

---

## 🔧 Componentes Base

### 🎨 **Button Component**

```typescript
// src/components/ui/Button.tsx
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'outline' | 'danger';
  size: 'small' | 'medium' | 'large';
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  onPress,
  disabled = false,
  loading = false,
  children,
}) => {
  const { theme } = useTheme();
  
  const buttonStyles = [
    styles.button,
    styles[variant],
    styles[size],
    disabled && styles.disabled,
  ];

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator size="small" color="#fff" />
      ) : (
        <Text style={[styles.text, styles[`${variant}Text`]]}>
          {children}
        </Text>
      )}
    </TouchableOpacity>
  );
};
```

#### **Variantes Disponibles**
- **Primary**: Azul principal para acciones principales
- **Secondary**: Gris para acciones secundarias
- **Outline**: Borde con fondo transparente
- **Danger**: Rojo para acciones destructivas

### 📝 **Input Component**

```typescript
// src/components/ui/Input.tsx
interface InputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
}

const Input: React.FC<InputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
}) => {
  const { theme } = useTheme();
  
  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.label, { color: theme.colors.text.primary }]}>
          {label}
        </Text>
      )}
      <TextInput
        style={[
          styles.input,
          { 
            borderColor: error ? theme.colors.error[500] : theme.colors.border.primary,
            color: theme.colors.text.primary,
          },
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.text.tertiary}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
      />
      {error && (
        <Text style={[styles.errorText, { color: theme.colors.error[500] }]}>
          {error}
        </Text>
      )}
    </View>
  );
};
```

### 🃏 **Card Component**

```typescript
// src/components/ui/Card.tsx
interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  disabled?: boolean;
}

const Card: React.FC<CardProps> = ({ children, style, onPress, disabled }) => {
  const { theme } = useTheme();
  
  const cardStyles = [
    styles.card,
    {
      backgroundColor: theme.colors.background.card,
      borderColor: theme.colors.border.primary,
      shadowColor: theme.colors.primary[500],
    },
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity
        style={cardStyles}
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.8}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={cardStyles}>{children}</View>;
};
```

---

## 📱 Componentes de Formularios

### 📋 **FormInput Component**

```typescript
// src/components/forms/FormInput.tsx
interface FormInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  multiline?: boolean;
  numberOfLines?: number;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  value,
  onChangeText,
  error,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  multiline = false,
  numberOfLines = 1,
}) => {
  const { theme } = useTheme();
  
  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: theme.colors.text.primary }]}>
        {label}
      </Text>
      <TextInput
        style={[
          styles.input,
          multiline && styles.multiline,
          {
            borderColor: error ? theme.colors.error[500] : theme.colors.border.primary,
            color: theme.colors.text.primary,
          },
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.text.tertiary}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        multiline={multiline}
        numberOfLines={numberOfLines}
      />
      {error && (
        <Text style={[styles.errorText, { color: theme.colors.error[500] }]}>
          {error}
        </Text>
      )}
    </View>
  );
};
```

### 📅 **DateTimePicker Component**

```typescript
// src/components/forms/DateTimePicker.tsx
interface DateTimePickerProps {
  label: string;
  value: Date;
  onChange: (date: Date) => void;
  mode: 'date' | 'time';
  error?: string;
}

const DateTimePicker: React.FC<DateTimePickerProps> = ({
  label,
  value,
  onChange,
  mode,
  error,
}) => {
  const { theme } = useTheme();
  const [showPicker, setShowPicker] = useState(false);

  const handlePress = () => {
    setShowPicker(true);
  };

  const handleConfirm = (event: any, selectedDate?: Date) => {
    setShowPicker(false);
    if (selectedDate) {
      onChange(selectedDate);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: theme.colors.text.primary }]}>
        {label}
      </Text>
      <TouchableOpacity
        style={[
          styles.pickerButton,
          {
            borderColor: error ? theme.colors.error[500] : theme.colors.border.primary,
          },
        ]}
        onPress={handlePress}
      >
        <Text style={[styles.pickerText, { color: theme.colors.text.primary }]}>
          {mode === 'date' 
            ? value.toLocaleDateString('es-ES')
            : value.toLocaleTimeString('es-ES', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })
          }
        </Text>
        <Ionicons 
          name="calendar" 
          size={20} 
          color={theme.colors.text.secondary} 
        />
      </TouchableOpacity>
      {error && (
        <Text style={[styles.errorText, { color: theme.colors.error[500] }]}>
          {error}
        </Text>
      )}
      {showPicker && (
        <DateTimePickerModal
          value={value}
          mode={mode}
          isVisible={showPicker}
          onConfirm={handleConfirm}
          onCancel={() => setShowPicker(false)}
        />
      )}
    </View>
  );
};
```

---

## 🎨 Componentes de Navegación

### 📱 **Header Component**

```typescript
// src/components/navigation/Header.tsx
interface HeaderProps {
  title: string;
  showBack?: boolean;
  onBackPress?: () => void;
  rightComponent?: React.ReactNode;
  subtitle?: string;
}

const Header: React.FC<HeaderProps> = ({
  title,
  showBack = false,
  onBackPress,
  rightComponent,
  subtitle,
}) => {
  const { theme } = useTheme();
  const navigation = useNavigation();

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      navigation.goBack();
    }
  };

  return (
    <View style={[styles.header, { backgroundColor: theme.colors.background.card }]}>
      <View style={styles.leftContainer}>
        {showBack && (
          <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
            <Ionicons 
              name="arrow-back" 
              size={24} 
              color={theme.colors.text.primary} 
            />
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.centerContainer}>
        <Text style={[styles.title, { color: theme.colors.text.primary }]}>
          {title}
        </Text>
        {subtitle && (
          <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>
            {subtitle}
          </Text>
        )}
      </View>
      
      <View style={styles.rightContainer}>
        {rightComponent}
      </View>
    </View>
  );
};
```

### 🔔 **FloatingNotificationButton Component**

```typescript
// src/components/ui/FloatingNotificationButton.tsx
interface FloatingNotificationButtonProps {
  onPress: () => void;
}

const FloatingNotificationButton: React.FC<FloatingNotificationButtonProps> = ({ onPress }) => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [unreadCount, setUnreadCount] = useState(0);
  const [pulseAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    loadUnreadCount();
  }, []);

  useEffect(() => {
    if (unreadCount > 0) {
      startPulseAnimation();
    }
  }, [unreadCount]);

  const loadUnreadCount = async () => {
    try {
      const unreadNotifications = await notificationService.getUnreadNotifications();
      setUnreadCount(unreadNotifications.length);
    } catch (error) {
      console.error('Error al cargar notificaciones:', error);
    }
  };

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  return (
    <Animated.View style={[
      styles.container,
      {
        transform: [{ scale: pulseAnim }],
        top: insets.top + 10,
      }
    ]}>
      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor: unreadCount > 0 
              ? theme.colors.primary[500] 
              : theme.colors.background.card,
            borderColor: theme.colors.border.primary,
          }
        ]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <Ionicons 
          name="notifications" 
          size={18}
          color={unreadCount > 0 ? "#fff" : theme.colors.text.secondary} 
        />
        {unreadCount > 0 && (
          <View style={[styles.badge, { backgroundColor: theme.colors.error[500] }]}>
            <Text style={styles.badgeText}>
              {unreadCount > 99 ? '99+' : unreadCount.toString()}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};
```

---

## 🔔 Componentes de Notificaciones

### 📢 **NotificationItem Component**

```typescript
// src/components/notifications/NotificationItem.tsx
interface NotificationItemProps {
  notification: Notification;
    onPress: () => void;
  onDelete: () => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onPress,
  onDelete,
}) => {
  const { theme } = useTheme();

  const getNotificationIcon = () => {
    switch (notification.type) {
      case 'request_cancelled':
        return 'close-circle';
      case 'request_cancelled_by_musician':
        return 'musical-notes';
      case 'request_deleted':
        return 'trash';
      case 'musician_accepted':
        return 'checkmark-circle';
      default:
        return 'notifications';
    }
  };

  const getNotificationColor = () => {
    switch (notification.type) {
      case 'request_cancelled':
      case 'request_cancelled_by_musician':
      case 'request_deleted':
        return theme.colors.error[500];
      case 'musician_accepted':
        return theme.colors.success[500];
      default:
        return theme.colors.primary[500];
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.background.card,
          borderColor: theme.colors.border.primary,
        },
        !notification.read && styles.unread,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.iconContainer}>
        <Ionicons 
          name={getNotificationIcon() as any} 
          size={24} 
          color={getNotificationColor()} 
        />
      </View>
      
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.colors.text.primary }]}>
          {notification.title}
        </Text>
        <Text style={[styles.message, { color: theme.colors.text.secondary }]}>
          {notification.message}
        </Text>
        <Text style={[styles.timestamp, { color: theme.colors.text.tertiary }]}>
          {new Date(notification.timestamp).toLocaleString('es-ES')}
        </Text>
      </View>
      
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={(e) => {
          e.stopPropagation();
          onDelete();
        }}
      >
        <Ionicons 
          name="close" 
          size={20} 
          color={theme.colors.text.tertiary} 
        />
      </TouchableOpacity>
      
      <Ionicons 
        name="chevron-forward" 
        size={20} 
        color={theme.colors.text.tertiary} 
        style={styles.chevron}
      />
    </TouchableOpacity>
  );
};
```

---

## 📊 Componentes de Datos

### 📋 **RequestCard Component**

```typescript
// src/components/requests/RequestCard.tsx
interface RequestCardProps {
  request: Request;
  onPress: () => void;
  onMenuPress: () => void;
  showMenu?: boolean;
}

const RequestCard: React.FC<RequestCardProps> = ({
  request,
  onPress,
  onMenuPress,
  showMenu = false,
}) => {
  const { theme } = useTheme();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending_musician':
        return theme.colors.warning[500];
      case 'musician_assigned':
        return theme.colors.success[500];
      case 'completed':
        return theme.colors.accent[500];
      case 'cancelled':
      case 'musician_cancelled':
        return theme.colors.error[500];
      default:
        return theme.colors.text.secondary;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending_musician':
        return 'Pendiente';
      case 'musician_assigned':
        return 'Asignado';
      case 'completed':
        return 'Completado';
      case 'cancelled':
        return 'Cancelado';
      case 'musician_cancelled':
        return 'Cancelado por Músico';
      default:
        return 'Desconocido';
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.background.card,
          borderColor: theme.colors.border.primary,
          shadowColor: theme.colors.primary[500],
        },
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text.primary }]}>
          {request.name}
        </Text>
        <View style={styles.headerRight}>
          <View style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(request.status) }
          ]}>
            <Text style={styles.statusText}>
              {getStatusText(request.status)}
            </Text>
          </View>
          {showMenu && (
            <TouchableOpacity onPress={onMenuPress} style={styles.menuButton}>
              <Ionicons 
                name="ellipsis-vertical" 
                size={22} 
                color={theme.colors.text.secondary} 
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Details */}
      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Ionicons name="calendar" size={16} color={theme.colors.primary[500]} />
          <Text style={[styles.detailText, { color: theme.colors.text.secondary }]}>
            {new Date(request.date).toLocaleDateString('es-ES')} - {request.time}
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <Ionicons name="location" size={16} color={theme.colors.primary[500]} />
          <Text style={[styles.detailText, { color: theme.colors.text.secondary }]}>
            {request.location.address}
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <Ionicons name="musical-notes" size={16} color={theme.colors.primary[500]} />
          <Text style={[styles.detailText, { color: theme.colors.text.secondary }]}>
            {request.instrument}
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <Ionicons name="cash" size={16} color={theme.colors.primary[500]} />
          <Text style={[styles.detailText, { color: theme.colors.text.secondary }]}>
            ${request.budget.toLocaleString()}
          </Text>
        </View>
      </View>

      {/* Comments */}
      {request.comments && (
        <View style={styles.comments}>
          <Ionicons name="chatbubble-outline" size={16} color={theme.colors.primary[500]} />
          <Text style={[styles.commentText, { color: theme.colors.text.secondary }]}>
            {request.comments}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};
```

---

## 🎭 Componentes de Feedback

### ⏳ **LoadingSpinner Component**

```typescript
// src/components/ui/LoadingSpinner.tsx
interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  color?: string;
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'large',
  color,
  text,
}) => {
  const { theme } = useTheme();
  const spinnerColor = color || theme.colors.primary[500];

  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={spinnerColor} />
      {text && (
        <Text style={[styles.text, { color: theme.colors.text.secondary }]}>
          {text}
        </Text>
      )}
    </View>
  );
};
```

### ❌ **ErrorMessage Component**

```typescript
// src/components/ui/ErrorMessage.tsx
interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <Ionicons 
        name="alert-circle" 
        size={48} 
        color={theme.colors.error[500]} 
      />
      <Text style={[styles.message, { color: theme.colors.text.primary }]}>
        {message}
      </Text>
      {onRetry && (
        <Button variant="primary" onPress={onRetry}>
          Reintentar
        </Button>
      )}
    </View>
  );
};
```

### ✅ **SuccessMessage Component**

```typescript
// src/components/ui/SuccessMessage.tsx
interface SuccessMessageProps {
  message: string;
  onContinue?: () => void;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({ message, onContinue }) => {
const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <Ionicons 
        name="checkmark-circle" 
        size={48} 
        color={theme.colors.success[500]} 
      />
      <Text style={[styles.message, { color: theme.colors.text.primary }]}>
        {message}
  </Text>
      {onContinue && (
        <Button variant="primary" onPress={onContinue}>
          Continuar
        </Button>
      )}
</View>
  );
};
```

---

## 📐 Sistema de Diseño

### 🎨 **Paleta de Colores**

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

### 📏 **Espaciado**

```typescript
// src/theme/spacing.ts
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

### 📐 **Tipografía**

```typescript
// src/theme/typography.ts
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

---

## 🎨 Guías de Uso

### 📋 **Mejores Prácticas**

#### **1. Uso de Temas**
```typescript
// ✅ Correcto
const { theme } = useTheme();
<View style={{ backgroundColor: theme.colors.background.primary }}>

// ❌ Incorrecto
<View style={{ backgroundColor: '#ffffff' }}>
```

#### **2. Accesibilidad**
```typescript
// ✅ Correcto
<TouchableOpacity
  accessible={true}
  accessibilityLabel="Botón de inicio de sesión"
  accessibilityRole="button"
  accessibilityHint="Presiona para iniciar sesión"
  onPress={handleLogin}
>

// ❌ Incorrecto
<TouchableOpacity onPress={handleLogin}>
```

#### **3. Performance**
```typescript
// ✅ Correcto
const MemoizedComponent = React.memo(MyComponent);

// ✅ Correcto
const memoizedValue = useMemo(() => expensiveCalculation(data), [data]);

// ✅ Correcto
const memoizedCallback = useCallback(() => handlePress(id), [id]);
```

### 🎯 **Patrones de Componentes**

#### **1. Componente con Props Opcionales**
```typescript
interface MyComponentProps {
  title: string;
  subtitle?: string;
  onPress?: () => void;
  disabled?: boolean;
}

const MyComponent: React.FC<MyComponentProps> = ({
  title,
  subtitle,
  onPress,
  disabled = false,
}) => {
  // Implementación
};
```

#### **2. Componente con Children**
```typescript
interface ContainerProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

const Container: React.FC<ContainerProps> = ({ children, style }) => {
  return <View style={[styles.container, style]}>{children}</View>;
};
```

#### **3. Componente con Context**
```typescript
const MyComponent: React.FC = () => {
  const { theme } = useTheme();
  const { user } = useUser();
  const { t } = useTranslation();

  return (
    <View style={{ backgroundColor: theme.colors.background.primary }}>
      <Text>{t('welcome')} {user?.userName}</Text>
    </View>
  );
};
```

---

<div align="center">

**🎨 Componentes UI Optimizados para MussikOn 🎨**

*Última actualización: Diciembre 2024*

</div> 