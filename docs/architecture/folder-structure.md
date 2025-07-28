# 📁 Estructura de Carpetas - MussikOn

<div align="center">

![MussikOn Logo](../../assets/Logo_app.png)

**Organización del Código**

[![React Native](https://img.shields.io/badge/React%20Native-0.79.5-blue.svg)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-53.0.0-black.svg)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue.svg)](https://www.typescriptlang.org/)
[![Structure](https://img.shields.io/badge/Structure-Organized-green.svg)](./folder-structure.md)

*Organización modular y escalable del código fuente*

</div>

---

## 🎯 **Descripción General**

La estructura de carpetas de **MussikOn** está diseñada siguiendo principios de **modularidad**, **escalabilidad** y **mantenibilidad**. Cada carpeta tiene una responsabilidad específica y está organizada de manera lógica para facilitar el desarrollo y mantenimiento del proyecto.

### 🎪 **Principios de Organización**

- **📦 Modularidad**: Cada carpeta tiene una responsabilidad específica
- **🔄 Reutilización**: Componentes y utilidades compartidas
- **📁 Escalabilidad**: Estructura que crece con el proyecto
- **🔍 Encontrabilidad**: Fácil localización de archivos
- **📝 Consistencia**: Patrones uniformes en toda la estructura

---

## 🏗️ **Estructura Completa**

### 📱 **Vista General del Proyecto**

```
APP_MussikOn_React_Native_Expo/
├── 📁 src/                          # Código fuente principal
│   ├── 📁 app/                      # Punto de entrada
│   ├── 📁 components/               # Componentes reutilizables
│   ├── 📁 screens/                  # Pantallas de la aplicación
│   ├── 📁 services/                 # Servicios y APIs
│   ├── 📁 contexts/                 # Contextos de React
│   ├── 📁 config/                   # Configuración centralizada
│   ├── 📁 hooks/                    # Hooks personalizados
│   ├── 📁 utils/                    # Utilidades y helpers
│   ├── 📁 types/                    # Definiciones de tipos
│   └── 📁 appTypes/                 # Tipos de la aplicación
├── 📁 assets/                       # Recursos estáticos
├── 📁 docs/                         # Documentación técnica
├── 📁 android/                      # Configuración Android
├── 📁 .expo/                        # Configuración Expo
├── 📁 node_modules/                 # Dependencias
└── 📄 Archivos de configuración
```

---

## 📁 **Estructura Detallada**

### 🚀 **Carpeta `src/` - Código Fuente Principal**

```
src/
├── 📁 app/                          # Punto de entrada de la aplicación
│   ├── 📄 App.tsx                   # Componente raíz con configuración global
│   └── 📄 AppContent.tsx            # Contenido principal de la app
│
├── 📁 components/                    # Componentes reutilizables
│   ├── 📁 ui/                       # Componentes de UI base
│   │   ├── 📄 Button.tsx            # Botones con variantes
│   │   ├── 📄 Input.tsx             # Campos de entrada
│   │   ├── 📄 Card.tsx              # Tarjetas contenedoras
│   │   ├── 📄 LoadingSpinner.tsx    # Indicadores de carga
│   │   ├── 📄 Modal.tsx             # Overlays modales
│   │   ├── 📄 Header.tsx            # Encabezados
│   │   └── 📄 index.ts              # Exportaciones
│   ├── 📁 forms/                    # Componentes de formularios
│   │   ├── 📄 FormInput.tsx         # Campos de formulario
│   │   ├── 📄 DateTimePicker.tsx    # Selector de fecha/hora
│   │   └── 📄 index.ts              # Exportaciones
│   ├── 📁 navigation/               # Componentes de navegación
│   │   ├── 📄 Sidebar.tsx           # Menú lateral
│   │   ├── 📄 TabBar.tsx            # Barra de pestañas
│   │   └── 📄 index.ts              # Exportaciones
│   └── 📄 index.ts                  # Exportaciones principales
│
├── 📁 screens/                      # Pantallas de la aplicación
│   ├── 📁 auth/                     # Autenticación
│   │   ├── 📄 LoginScreen.tsx       # Pantalla de login
│   │   ├── 📄 RegisterScreen.tsx    # Pantalla de registro
│   │   └── 📄 index.ts              # Exportaciones
│   ├── 📁 dashboard/                # Dashboard principal
│   │   ├── 📄 HomeScreen.tsx        # Pantalla principal para organizadores
│   │   ├── 📄 Dashboard.tsx         # Dashboard para músicos
│   │   └── 📄 index.ts              # Exportaciones
│   ├── 📁 events/                   # Gestión de solicitudes
│   │   ├── 📄 MyRequestsList.tsx    # Lista de mis solicitudes
│   │   ├── 📄 RequestDetail.tsx     # Detalles de solicitud
│   │   ├── 📄 ShareMusicianScreen.tsx # Compartir músico
│   │   └── 📄 index.ts              # Exportaciones
│   ├── 📁 notifications/            # Sistema de notificaciones
│   │   ├── 📄 NotificationsScreen.tsx # Pantalla de notificaciones
│   │   └── 📄 index.ts              # Exportaciones
│   └── 📄 index.ts                  # Exportaciones principales
│
├── 📁 services/                     # Servicios y APIs
│   ├── 📄 api.ts                    # Cliente HTTP centralizado
│   ├── 📄 requests.ts               # Servicios de solicitudes
│   ├── 📄 notificationService.ts    # Gestión de notificaciones
│   ├── 📄 authService.ts            # Servicios de autenticación
│   └── 📄 index.ts                  # Exportaciones
│
├── 📁 contexts/                     # Contextos de React
│   ├── 📄 ThemeContext.tsx          # Contexto de tema
│   ├── 📄 UserContext.tsx           # Contexto de usuario
│   ├── 📄 LanguageContext.tsx       # Contexto de idioma
│   ├── 📄 SidebarContext.tsx        # Contexto de sidebar
│   ├── 📄 SocketContext.tsx         # Contexto de Socket.IO
│   └── 📄 index.ts                  # Exportaciones
│
├── 📁 config/                       # Configuración centralizada
│   ├── 📄 apiConfig.ts              # Configuración de API
│   ├── 📄 environment.ts            # Variables de entorno
│   ├── 📄 navigation.ts             # Configuración de navegación
│   └── 📄 index.ts                  # Exportaciones
│
├── 📁 hooks/                        # Hooks personalizados
│   ├── 📄 useInitialNotifications.ts # Hook para notificaciones iniciales
│   ├── 📄 useRequestService.ts      # Hook para servicios de solicitudes
│   ├── 📄 useSocket.ts              # Hook para Socket.IO
│   ├── 📄 useAuth.ts                # Hook para autenticación
│   └── 📄 index.ts                  # Exportaciones
│
├── 📁 utils/                        # Utilidades y helpers
│   ├── 📄 functions.ts              # Funciones de token y utilidades
│   ├── 📄 testNotifications.ts      # Utilidades de testing
│   ├── 📄 socket.ts                 # Configuración de socket
│   ├── 📄 validation.ts             # Funciones de validación
│   ├── 📄 formatting.ts             # Funciones de formateo
│   └── 📄 index.ts                  # Exportaciones
│
├── 📁 types/                        # Definiciones de tipos TypeScript
│   ├── 📄 apiTypes.ts               # Tipos de API
│   ├── 📄 navigationTypes.ts        # Tipos de navegación
│   ├── 📄 componentTypes.ts         # Tipos de componentes
│   └── 📄 index.ts                  # Exportaciones
│
└── 📁 appTypes/                     # Tipos de la aplicación
    ├── 📄 DatasTypes.ts             # Tipos principales
    ├── 📄 userTypes.ts              # Tipos de usuario
    ├── 📄 requestTypes.ts           # Tipos de solicitudes
    └── 📄 index.ts                  # Exportaciones
```

---

## 📦 **Carpetas Específicas**

### 🎨 **Carpeta `components/` - Componentes Reutilizables**

#### **📁 `components/ui/` - Componentes de UI Base**
```typescript
// Estructura de un componente UI
components/ui/
├── 📄 Button.tsx                    # Botón con variantes
├── 📄 Input.tsx                     # Campo de entrada
├── 📄 Card.tsx                      # Tarjeta contenedora
├── 📄 LoadingSpinner.tsx            # Indicador de carga
├── 📄 Modal.tsx                     # Overlay modal
├── 📄 Header.tsx                    # Encabezado
└── 📄 index.ts                      # Exportaciones

// Ejemplo de exportación
export { default as Button } from './Button';
export { default as Input } from './Input';
export { default as Card } from './Card';
```

#### **📁 `components/forms/` - Componentes de Formularios**
```typescript
// Estructura de componentes de formularios
components/forms/
├── 📄 FormInput.tsx                 # Campo de formulario
├── 📄 DateTimePicker.tsx            # Selector de fecha/hora
├── 📄 FormValidation.tsx            # Validación de formularios
└── 📄 index.ts                      # Exportaciones
```

#### **📁 `components/navigation/` - Componentes de Navegación**
```typescript
// Estructura de componentes de navegación
components/navigation/
├── 📄 Sidebar.tsx                   # Menú lateral
├── 📄 TabBar.tsx                    # Barra de pestañas
├── 📄 Header.tsx                    # Encabezado de navegación
└── 📄 index.ts                      # Exportaciones
```

### 📱 **Carpeta `screens/` - Pantallas de la Aplicación**

#### **📁 `screens/auth/` - Autenticación**
```typescript
// Estructura de pantallas de autenticación
screens/auth/
├── 📄 LoginScreen.tsx               # Pantalla de login
├── 📄 RegisterScreen.tsx            # Pantalla de registro
├── 📄 ForgotPasswordScreen.tsx      # Recuperar contraseña
└── 📄 index.ts                      # Exportaciones
```

#### **📁 `screens/events/` - Gestión de Solicitudes**
```typescript
// Estructura de pantallas de eventos
screens/events/
├── 📄 MyRequestsList.tsx            # Lista de mis solicitudes
├── 📄 RequestDetail.tsx             # Detalles de solicitud
├── 📄 CreateRequestScreen.tsx       # Crear solicitud
├── 📄 EditRequestScreen.tsx         # Editar solicitud
└── 📄 index.ts                      # Exportaciones
```

### 🔧 **Carpeta `services/` - Servicios y APIs**

```typescript
// Estructura de servicios
services/
├── 📄 api.ts                        # Cliente HTTP centralizado
├── 📄 requests.ts                   # Servicios de solicitudes
├── 📄 notificationService.ts        # Gestión de notificaciones
├── 📄 authService.ts                # Servicios de autenticación
├── 📄 userService.ts                # Servicios de usuario
└── 📄 index.ts                      # Exportaciones
```

### 🌐 **Carpeta `contexts/` - Contextos de React**

```typescript
// Estructura de contextos
contexts/
├── 📄 ThemeContext.tsx              # Contexto de tema
├── 📄 UserContext.tsx               # Contexto de usuario
├── 📄 LanguageContext.tsx           # Contexto de idioma
├── 📄 SidebarContext.tsx            # Contexto de sidebar
├── 📄 SocketContext.tsx             # Contexto de Socket.IO
└── 📄 index.ts                      # Exportaciones
```

### ⚙️ **Carpeta `config/` - Configuración Centralizada**

```typescript
// Estructura de configuración
config/
├── 📄 apiConfig.ts                  # Configuración de API
├── 📄 environment.ts                # Variables de entorno
├── 📄 navigation.ts                 # Configuración de navegación
├── 📄 theme.ts                      # Configuración de temas
└── 📄 index.ts                      # Exportaciones
```

---

## 📁 **Carpetas de Recursos**

### 🎨 **Carpeta `assets/` - Recursos Estáticos**

```
assets/
├── 📁 img/                          # Imágenes
│   ├── 📄 Logo_app.png              # Logo principal
│   ├── 📄 Logo_rounded_letter.png   # Logo redondeado
│   └── 📄 Jefry_Astacio_perfil_example.jpg # Imagen de ejemplo
├── 📁 lottie/                       # Animaciones Lottie
│   ├── 📄 Connected_world.json      # Animación de conexión
│   ├── 📄 Loading.json              # Animación de carga
│   ├── 📄 Power.json                # Animación de poder
│   └── 📄 Radar.json                # Animación de radar
├── 📁 sounds/                       # Sonidos
│   └── 📄 ping.mp3                  # Sonido de notificación
└── 📁 svg/                          # Iconos SVG
    ├── 📄 Logo_App.svg              # Logo en SVG
    └── 📄 Logo.svg                  # Logo alternativo
```

### 📚 **Carpeta `docs/` - Documentación Técnica**

```
docs/
├── 📁 architecture/                 # Documentación de arquitectura
│   ├── 📄 README.md                 # Arquitectura general
│   ├── 📄 folder-structure.md       # Estructura de carpetas
│   ├── 📄 design-patterns.md        # Patrones de diseño
│   └── 📄 data-flow.md              # Flujo de datos
├── 📁 components/                   # Documentación de componentes
│   ├── 📄 ui-components.md          # Componentes UI
│   └── 📄 component-details.md      # Detalles de componentes
├── 📁 features/                     # Documentación de funcionalidades
│   ├── 📄 authentication.md         # Autenticación
│   └── 📄 events-management.md      # Gestión de eventos
├── 📁 technologies/                 # Documentación de tecnologías
│   ├── 📄 tech-stack.md             # Stack tecnológico
│   └── 📁 tags/                     # Tags de tecnologías
├── 📁 project-status/               # Estado del proyecto
│   ├── 📄 current-status.md         # Estado actual
│   ├── 📄 implemented-features.md   # Features implementadas
│   ├── 📄 pending-features.md       # Features pendientes
│   └── 📄 known-bugs.md             # Bugs conocidos
└── 📄 README.md                     # Documentación principal
```

---

## 🔧 **Archivos de Configuración**

### 📄 **Archivos de Configuración del Proyecto**

```
APP_MussikOn_React_Native_Expo/
├── 📄 package.json                  # Dependencias y scripts
├── 📄 app.json                      # Configuración de Expo
├── 📄 eas.json                      # Configuración de EAS Build
├── 📄 tsconfig.json                 # Configuración de TypeScript
├── 📄 babel.config.js               # Configuración de Babel
├── 📄 metro.config.js               # Configuración de Metro
├── 📄 .gitignore                    # Archivos ignorados por Git
├── 📄 .eslintrc.js                  # Configuración de ESLint
├── 📄 .prettierrc                   # Configuración de Prettier
└── 📄 README.md                     # Documentación principal
```

### 📱 **Configuración de Plataformas**

```
APP_MussikOn_React_Native_Expo/
├── 📁 android/                      # Configuración Android
│   ├── 📁 app/
│   ├── 📁 gradle/
│   └── 📄 build.gradle
├── 📁 ios/                          # Configuración iOS (si aplica)
└── 📁 .expo/                        # Configuración Expo
    ├── 📄 settings.json
    └── 📄 webpack.config.js
```

---

## 🎯 **Convenciones de Nomenclatura**

### 📝 **Archivos y Carpetas**

#### **✅ Convenciones Correctas**
```typescript
// Carpetas en camelCase
components/
├── ui/
├── forms/
└── navigation/

// Archivos en PascalCase para componentes
Button.tsx
LoginScreen.tsx
UserContext.tsx

// Archivos en camelCase para utilidades
apiConfig.ts
useAuth.ts
validation.ts

// Archivos en kebab-case para documentación
folder-structure.md
design-patterns.md
```

#### **❌ Convenciones Incorrectas**
```typescript
// Evitar
components/
├── UI/
├── Forms/
└── Navigation/

// Evitar
button.tsx
login-screen.tsx
user-context.tsx
```

### 🏷️ **Exportaciones**

#### **✅ Exportaciones Organizadas**
```typescript
// components/ui/index.ts
export { default as Button } from './Button';
export { default as Input } from './Input';
export { default as Card } from './Card';
export { default as LoadingSpinner } from './LoadingSpinner';

// screens/index.ts
export { default as LoginScreen } from './auth/LoginScreen';
export { default as HomeScreen } from './dashboard/HomeScreen';
export { default as MyRequestsList } from './events/MyRequestsList';
```

---

## 📊 **Métricas de Estructura**

### 📈 **Estadísticas del Proyecto**

- **📁 Carpetas Principales**: 12 carpetas en `src/`
- **📄 Archivos TypeScript**: 50+ archivos
- **🎨 Componentes**: 35+ componentes reutilizables
- **📱 Pantallas**: 20+ pantallas organizadas
- **🔧 Servicios**: 8+ servicios especializados
- **🌐 Contextos**: 4 contextos principales
- **📝 Hooks**: 5+ hooks personalizados

### 🎯 **Calidad de Organización**

- **📦 Modularidad**: 95% - Componentes bien separados
- **🔄 Reutilización**: 90% - Componentes reutilizables
- **📁 Escalabilidad**: 85% - Estructura que crece
- **🔍 Encontrabilidad**: 95% - Fácil localización
- **📝 Consistencia**: 90% - Patrones uniformes

---

## 🚀 **Mejores Prácticas**

### 📁 **1. Organización de Carpetas**

#### **✅ Estructura Recomendada**
```typescript
// Organizar por dominio
src/
├── components/           # Componentes reutilizables
├── screens/             # Pantallas por dominio
├── services/            # Servicios por funcionalidad
├── contexts/            # Contextos globales
└── utils/               # Utilidades compartidas
```

#### **❌ Estructura a Evitar**
```typescript
// Evitar organización plana
src/
├── Button.tsx
├── LoginScreen.tsx
├── apiService.ts
└── utils.ts
```

### 📝 **2. Nomenclatura de Archivos**

#### **✅ Nomenclatura Correcta**
```typescript
// Componentes en PascalCase
Button.tsx
LoginScreen.tsx
UserContext.tsx

// Utilidades en camelCase
apiConfig.ts
useAuth.ts
validation.ts

// Documentación en kebab-case
folder-structure.md
design-patterns.md
```

### 🔧 **3. Exportaciones**

#### **✅ Exportaciones Organizadas**
```typescript
// Archivo index.ts en cada carpeta
export { default as Button } from './Button';
export { default as Input } from './Input';
export { default as Card } from './Card';

// Importaciones limpias
import { Button, Input, Card } from '@/components/ui';
```

---

## 🔄 **Evolución de la Estructura**

### 📈 **Fases de Desarrollo**

#### **Fase 1: Estructura Básica ✅**
- ✅ Configuración inicial del proyecto
- ✅ Estructura de carpetas básica
- ✅ Componentes UI fundamentales
- ✅ Pantallas principales

#### **Fase 2: Modularización ✅**
- ✅ Separación por dominios
- ✅ Servicios especializados
- ✅ Contextos globales
- ✅ Hooks personalizados

#### **Fase 3: Optimización 🚧**
- 🔄 Lazy loading de componentes
- 🔄 Code splitting
- 🔄 Bundle optimization
- 🔄 Performance monitoring

---

<div align="center">

**📁 Estructura de Carpetas Organizada de MussikOn 📁**

*Última actualización: Diciembre 2024*  
**Mantenedor**: Equipo de Desarrollo MussikOn  
**Versión de Estructura**: 2.0.0  
**Estado**: Implementada y Documentada

</div> 