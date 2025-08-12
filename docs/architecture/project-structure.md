# 📁 Estructura del Proyecto - MussikOn

## 🎯 **Descripción General**

Esta documentación describe la estructura real del proyecto MussikOn, basada en un análisis exhaustivo del código implementado. La estructura está organizada de manera modular y sigue las mejores prácticas de React Native.

## 🏗️ **Estructura de Carpetas Principal**

```
APP_MussikOn_React_Native_Expo/
├── 📱 src/                           # Código fuente principal
│   ├── 🏠 app/                       # Configuración principal de la app
│   ├── 🧩 components/                # Componentes reutilizables
│   ├── 📱 screens/                   # Pantallas de la aplicación
│   ├── 🔧 config/                    # Configuración centralizada
│   ├── 🌐 contexts/                  # Contextos de React
│   ├── 🗄️ store/                     # Estado global (Redux)
│   ├── 🎨 theme/                     # Sistema de temas y estilos
│   ├── 🌍 i18n/                      # Internacionalización
│   ├── 🔌 services/                  # Servicios de API
│   ├── 🪝 hooks/                     # Hooks personalizados
│   ├── 🛠️ utils/                     # Utilidades y helpers
│   └── 📝 appTypes/                  # Tipos TypeScript
├── 📚 docs/                          # Documentación técnica organizada
├── 🎨 assets/                        # Recursos estáticos
├── 📦 package.json                   # Dependencias del proyecto
└── ⚙️ archivos de configuración      # Configuración de build y entorno
```

## 📱 **Estructura Detallada del Código Fuente**

### **🏠 src/app/**
```
app/
├── App.tsx                           # Componente raíz con navegación
└── navigation/
    └── index.ts                      # Configuración de navegación
```

**Propósito**: Configuración principal de la aplicación, incluyendo el punto de entrada y la navegación principal.

### **🧩 src/components/**
```
components/
├── 🎨 ui/                           # Componentes de UI base
│   ├── Button.tsx                    # Botones personalizables
│   ├── Card.tsx                      # Tarjetas con variantes
│   ├── Input.tsx                     # Campos de entrada
│   ├── Header.tsx                    # Encabezados de pantalla
│   ├── Logo.tsx                      # Logo SVG personalizable
│   ├── LoadingSpinner.tsx            # Indicadores de carga
│   ├── Modal.tsx                     # Modales y overlays
│   └── styles/
│       └── AnimatedBackground.tsx    # Fondo animado
├── 📝 forms/                         # Componentes de formularios
│   ├── MusicianRequestForm.tsx       # Formulario principal
│   └── steps/                        # Pasos del formulario
├── 🧭 navigation/                    # Componentes de navegación
│   ├── MainTabs.tsx                  # Navegación por pestañas
│   └── BottomMenu.tsx                # Menú inferior
└── 🎯 features/                      # Componentes específicos de features
    ├── Home/                         # Componentes del dashboard
    ├── event/                        # Componentes de eventos
    ├── Profile/                      # Componentes de perfil
    ├── Maps/                         # Componentes de mapas
    ├── reels/                        # Componentes de reels
    └── solicitudMusico/              # Componentes de solicitudes
```

**Propósito**: Componentes reutilizables organizados por funcionalidad y tipo.

### **📱 src/screens/**
```
screens/
├── 🔐 auth/                          # Autenticación
│   ├── Login.tsx                     # Pantalla de login
│   └── Register.tsx                  # Pantalla de registro
├── 🏠 dashboard/                     # Dashboard principal
│   ├── HomeScreen.tsx                # Pantalla de inicio
│   └── Dashboard.tsx                 # Dashboard para músicos
├── 📅 events/                        # Gestión de eventos
│   ├── AvailableRequestsScreen.tsx   # Solicitudes disponibles
│   ├── MyRequestsList.tsx            # Mis solicitudes
│   ├── RequestDetail.tsx             # Detalles de solicitud
│   ├── EditRequest.tsx               # Editar solicitud
│   └── ShareMusicianScreen.tsx       # Compartir músico
├── 🔔 notifications/                 # Sistema de notificaciones
│   └── NotificationsScreen.tsx       # Gestión de notificaciones
├── 💳 payments/                      # Sistema de pagos
│   ├── PaymentBalance.tsx            # Balance de pagos
│   ├── BankAccounts.tsx              # Cuentas bancarias
│   ├── Deposit.tsx                   # Depósitos
│   ├── Withdraw.tsx                  # Retiros
│   ├── PaymentHistory.tsx            # Historial de pagos
│   ├── BankAccountRegister.tsx       # Registrar cuenta
│   ├── MusicianEarnings.tsx          # Ganancias de músicos
│   └── WithdrawEarnings.tsx          # Retirar ganancias
├── 💬 chat/                          # Sistema de chat
│   ├── ChatListScreen.tsx            # Lista de conversaciones
│   ├── ChatScreen.tsx                # Conversación individual
│   └── components/                   # Componentes de chat
├── 👤 profile/                       # Perfil de usuario
│   ├── Profile.tsx                   # Perfil principal
│   └── ProfileSimple.tsx             # Perfil simplificado
└── ⚙️ settings/                      # Configuraciones
    └── SettingsScreen.tsx            # Pantalla de configuración
```

**Propósito**: Pantallas principales de la aplicación organizadas por módulo funcional.

### **🔧 src/config/**
```
config/
├── apiConfig.ts                      # Configuración de API centralizada
└── environment.ts                    # Variables de entorno
```

**Propósito**: Configuración centralizada de la aplicación, incluyendo endpoints de API y variables de entorno.

### **🌐 src/contexts/**
```
contexts/
├── UserContext.tsx                   # Gestión de usuario
├── ThemeContext.tsx                  # Gestión de temas
├── SocketContext.tsx                 # Gestión de sockets
├── LanguageContext.tsx               # Gestión de idiomas
└── SidebarContext.tsx                # Gestión de sidebar
```

**Propósito**: Contextos de React para gestión de estado global de la aplicación.

### **🗄️ src/store/**
```
store/
├── store.ts                          # Configuración de Redux store
└── slices/                           # Slices de Redux
    ├── appSlice.ts                   # Estado de la aplicación
    ├── authSlice.ts                  # Estado de autenticación
    ├── formsSlice.ts                 # Estado de formularios
    ├── languageSlice.ts              # Estado de idioma
    ├── notificationsSlice.ts         # Estado de notificaciones
    └── themeSlice.ts                 # Estado del tema
```

**Propósito**: Gestión de estado global usando Redux Toolkit.

### **🎨 src/theme/**
```
theme/
├── colors.ts                         # Paleta de colores
├── typography.ts                     # Tipografía
├── spacing.ts                        # Espaciado y layout
├── constants.ts                      # Constantes del tema
└── index.ts                          # Exportaciones del tema
```

**Propósito**: Sistema de temas y estilos centralizado.

### **🌍 src/i18n/**
```
i18n/
├── index.ts                          # Configuración i18n
└── locales/                          # Archivos de traducción
    ├── en.json                       # Traducciones en inglés
    └── es.json                       # Traducciones en español
```

**Propósito**: Sistema de internacionalización con soporte para múltiples idiomas.

### **🔌 src/services/**
```
services/
├── api.ts                            # Cliente HTTP principal
├── musicianRequests.ts               # Servicios de solicitudes
├── notificationService.ts            # Servicios de notificaciones
├── paymentService.ts                 # Servicios de pagos
├── chatService.ts                    # Servicios de chat
└── pushNotificationService.ts        # Servicios de notificaciones push
```

**Propósito**: Servicios de API y lógica de negocio.

### **🪝 src/hooks/**
```
hooks/
├── useAppTheme.ts                    # Hook de tema
├── useSocket.tsx                     # Hook de socket
├── useMusicianRequestSocket.tsx      # Hook de solicitudes
├── useInitialNotifications.ts        # Hook de notificaciones iniciales
└── usePushNotifications.ts           # Hook de notificaciones push
```

**Propósito**: Hooks personalizados para lógica reutilizable.

### **🛠️ src/utils/**
```
utils/
├── functions.ts                      # Funciones auxiliares
├── auth.ts                           # Utilidades de autenticación
├── socket.ts                         # Utilidades de socket
├── validationSchemas.ts              # Esquemas de validación
├── ENV.ts                            # Configuración de entorno
└── testNotifications.ts              # Utilidades de testing
```

**Propósito**: Utilidades y helpers generales.

### **📝 src/appTypes/**
```
appTypes/
└── DatasTypes.ts                     # Definiciones de tipos TypeScript
```

**Propósito**: Tipos TypeScript centralizados para toda la aplicación.

## 🎯 **Principios de Organización**

### **1. Separación de Responsabilidades**
- **Componentes**: Solo lógica de presentación
- **Servicios**: Lógica de negocio y API
- **Hooks**: Lógica reutilizable
- **Contextos**: Estado compartido
- **Store**: Estado global

### **2. Modularidad**
- Cada feature tiene su propia carpeta
- Componentes reutilizables en carpetas separadas
- Importaciones claras y organizadas

### **3. Escalabilidad**
- Estructura que permite agregar nuevas features
- Patrones consistentes en toda la aplicación
- Fácil navegación y mantenimiento

### **4. Convenciones de Nomenclatura**
- **Archivos**: PascalCase para componentes, camelCase para utilidades
- **Carpetas**: kebab-case para features, camelCase para utilidades
- **Componentes**: Sufijo descriptivo (Screen, Modal, Button)

## 🔍 **Análisis de Dependencias**

### **Dependencias Principales**
- **React Native**: 0.79.5
- **Expo**: 53.0.0
- **TypeScript**: 5.8.3
- **React Navigation**: 7.x
- **Redux Toolkit**: 2.8.2
- **Socket.IO**: 4.8.1
- **Axios**: 1.3.6

### **Dependencias de Desarrollo**
- **ESLint**: Linting de código
- **Prettier**: Formateo automático
- **Jest**: Testing unitario
- **TypeScript**: Compilador y tipado

## 📊 **Métricas de la Estructura**

- **Total de Archivos**: 80+ archivos TypeScript
- **Componentes**: 40+ componentes React
- **Pantallas**: 25+ pantallas principales
- **Servicios**: 10+ servicios de API
- **Hooks**: 8+ hooks personalizados
- **Contextos**: 5 contextos principales

## 🚀 **Recomendaciones de Mejora**

### **Corto Plazo**
1. **Consolidar tipos**: Mover tipos comunes a `appTypes/`
2. **Optimizar imports**: Usar barrel exports para componentes
3. **Documentar componentes**: Agregar JSDoc a componentes principales

### **Mediano Plazo**
1. **Implementar lazy loading**: Para pantallas no críticas
2. **Agregar tests**: Tests unitarios para componentes
3. **Optimizar bundle**: Análisis de dependencias

### **Largo Plazo**
1. **Micro-frontends**: Separar features en módulos independientes
2. **Monorepo**: Estructura para múltiples aplicaciones
3. **CI/CD**: Automatización de build y deploy

---

## 📞 **Contacto**

- **Desarrollador Principal**: Jefry Agustin Astacio Sanchez
- **Email**: astaciosanchezjefryagustin@gmail.com
- **GitHub**: [@MussikOn](https://github.com/MussikOn)

---

<div align="center">

**🎵 MussikOn - Estructura del Proyecto Organizada 🎵**

*Una arquitectura sólida para una aplicación innovadora*

</div>
