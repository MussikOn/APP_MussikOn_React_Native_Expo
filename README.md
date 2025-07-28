# 🎵 MussikOn - Plataforma de Conectividad Musical

<div align="center">

![MussikOn Logo](assets/Logo_app.png)

**Conectando Músicos y Organizadores de Eventos Musicales**

[![React Native](https://img.shields.io/badge/React%20Native-0.79.5-blue.svg)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-53.0.0-black.svg)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md)

*Desarrollado con ❤️ para la comunidad musical*

</div>

---

## 📋 Tabla de Contenidos

- [🎯 Descripción del Proyecto](#-descripción-del-proyecto)
- [🚀 Características Principales](#-características-principales)
- [🏗️ Arquitectura del Sistema](#️-arquitectura-del-sistema)
- [🛠️ Tecnologías Utilizadas](#️-tecnologías-utilizadas)
- [📱 Funcionalidades por Rol](#-funcionalidades-por-rol)
- [🔧 Configuración del Proyecto](#-configuración-del-proyecto)
- [📦 Instalación y Configuración](#-instalación-y-configuración)
- [🎨 Sistema de Temas y UI/UX](#-sistema-de-temas-y-uiux)
- [🔌 Sistema de Notificaciones](#-sistema-de-notificaciones)
- [🌐 Configuración de API Centralizada](#-configuración-de-api-centralizada)
- [📊 Estado del Proyecto](#-estado-del-proyecto)
- [🐛 Problemas Conocidos](#-problemas-conocidos)
- [🔮 Roadmap y Mejoras Futuras](#-roadmap-y-mejoras-futuras)
- [🤝 Contribución](#-contribución)
- [📄 Licencia](#-licencia)

---

## 🎯 Descripción del Proyecto

**MussikOn** es una plataforma móvil innovadora que conecta organizadores de eventos con músicos profesionales. La aplicación facilita la gestión completa del ciclo de vida de las solicitudes musicales, desde la creación hasta la finalización, con un sistema de notificaciones en tiempo real y una interfaz de usuario moderna e intuitiva.

### 🎪 Propósito Principal

- **Conectar**: Organizadores de eventos con músicos profesionales
- **Gestionar**: Solicitudes musicales de manera eficiente
- **Comunicar**: Notificaciones en tiempo real
- **Optimizar**: Flujo de trabajo para ambos roles

---

## 🚀 Características Principales

### 🎵 **Gestión de Solicitudes Musicales**
- ✅ Creación de solicitudes con detalles completos
- ✅ Filtrado y búsqueda avanzada
- ✅ Estados de solicitud (Pendiente, Asignado, Completado, Cancelado)
- ✅ Gestión de comentarios y requisitos especiales

### 🔔 **Sistema de Notificaciones Avanzado**
- ✅ Notificaciones en tiempo real con Socket.IO
- ✅ Notificaciones persistentes con AsyncStorage
- ✅ Botón flotante de notificaciones en el header
- ✅ Pantalla dedicada de notificaciones
- ✅ Navegación directa a detalles desde notificaciones

### 🎨 **Interfaz de Usuario Moderna**
- ✅ Sistema de temas claro/oscuro
- ✅ Diseño responsivo y accesible
- ✅ Animaciones fluidas y feedback táctil
- ✅ Componentes reutilizables y consistentes

### 🌐 **Configuración Centralizada**
- ✅ API endpoints centralizados
- ✅ Configuración de Socket.IO unificada
- ✅ Gestión de entornos (Development, Production, Staging)
- ✅ Un solo punto de cambio para URLs

### 🔐 **Autenticación y Seguridad**
- ✅ JWT Token management
- ✅ Persistencia de sesión
- ✅ Validación de roles (Organizador/Músico)
- ✅ Interceptores de API para manejo de errores

---

## 🏗️ Arquitectura del Sistema

### 📱 **Frontend (React Native + Expo)**
```
src/
├── app/                    # Configuración principal de la app
├── components/             # Componentes reutilizables
│   ├── ui/                # Componentes de UI base
│   └── forms/             # Componentes de formularios
├── contexts/              # Contextos de React
├── screens/               # Pantallas de la aplicación
│   ├── auth/              # Autenticación
│   ├── dashboard/         # Dashboard principal
│   ├── events/            # Gestión de solicitudes
│   └── notifications/     # Sistema de notificaciones
├── services/              # Servicios de API
├── config/                # Configuración centralizada
├── hooks/                 # Hooks personalizados
├── utils/                 # Utilidades y helpers
└── types/                 # Definiciones de tipos TypeScript
```

### 🔧 **Backend (Node.js + Express + TypeScript)**
```
app_mussikon_express/
├── src/
│   ├── controllers/       # Controladores de la API
│   ├── models/           # Modelos de datos
│   ├── routes/           # Rutas de la API
│   ├── middleware/       # Middleware personalizado
│   ├── sockets/          # Configuración de Socket.IO
│   ├── utils/            # Utilidades del backend
│   └── types/            # Tipos TypeScript
```

---

## 🛠️ Tecnologías Utilizadas

### 📱 **Frontend**
- **React Native**: Framework principal
- **Expo**: Plataforma de desarrollo
- **TypeScript**: Tipado estático
- **React Navigation**: Navegación entre pantallas
- **Socket.IO Client**: Comunicación en tiempo real
- **AsyncStorage**: Almacenamiento local
- **React i18next**: Internacionalización

### 🎨 **UI/UX**
- **React Native Elements**: Componentes de UI
- **Expo Vector Icons**: Iconografía
- **React Native Reanimated**: Animaciones
- **React Native Safe Area**: Manejo de áreas seguras
- **Expo Haptics**: Feedback táctil

### 🔧 **Backend**
- **Node.js**: Runtime de JavaScript
- **Express.js**: Framework web
- **TypeScript**: Tipado estático
- **Socket.IO**: Comunicación en tiempo real
- **Firebase Firestore**: Base de datos
- **JWT**: Autenticación

### 🚀 **Herramientas de Desarrollo**
- **ESLint**: Linting de código
- **Prettier**: Formateo de código
- **Git**: Control de versiones
- **GitHub**: Repositorio remoto

---

## 📱 Funcionalidades por Rol

### 🎪 **Organizador de Eventos**

#### **Gestión de Solicitudes**
- ✅ Crear solicitudes musicales detalladas
- ✅ Editar solicitudes existentes
- ✅ Cancelar solicitudes
- ✅ Eliminar solicitudes completadas
- ✅ Ver detalles completos de solicitudes

#### **Seguimiento de Estado**
- ✅ Solicitudes pendientes
- ✅ Solicitudes asignadas
- ✅ Solicitudes canceladas
- ✅ Solicitudes completadas

#### **Comunicación**
- ✅ Notificaciones en tiempo real
- ✅ Chat con músicos asignados
- ✅ Historial de conversaciones

### 🎵 **Músico Profesional**

#### **Exploración de Oportunidades**
- ✅ Ver solicitudes disponibles
- ✅ Filtrar por instrumento, ubicación, fecha
- ✅ Aceptar solicitudes de interés
- ✅ Ver detalles completos antes de aceptar

#### **Gestión de Compromisos**
- ✅ Solicitudes agendadas
- ✅ Historial de actuaciones
- ✅ Cancelar compromisos (con notificación)

#### **Comunicación**
- ✅ Notificaciones de nuevas solicitudes
- ✅ Notificaciones de cancelaciones
- ✅ Chat con organizadores

---

## 🔧 Configuración del Proyecto

### 🌐 **Configuración de API Centralizada**

#### **Archivo Principal: `src/config/apiConfig.ts`**
```typescript
export const API_CONFIG = {
  BASE_URL: 'http://192.168.100.101:3001',
  ENDPOINTS: {
    // Todos los endpoints centralizados
  },
  TIMEOUT: 10000,
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
  },
  RETRY_CONFIG: {
    maxRetries: 3,
    retryDelay: 1000,
  },
};
```

#### **Entornos: `src/config/environment.ts`**
```typescript
// Development y Production usan configuración centralizada
// Staging mantiene configuración específica
```

### 🔌 **Sistema de Notificaciones**

#### **Componentes Principales**
- **`FloatingNotificationButton`**: Botón flotante en header
- **`NotificationsScreen`**: Pantalla de notificaciones
- **`notificationService`**: Servicio de gestión local
- **`SocketContext`**: Comunicación en tiempo real

#### **Flujo de Notificaciones**
1. **Recepción**: Socket.IO recibe evento del servidor
2. **Procesamiento**: Se crea notificación local
3. **Persistencia**: Se guarda en AsyncStorage
4. **Visualización**: Se muestra en botón flotante
5. **Navegación**: Al tocar, va a detalles de solicitud

---

## 📦 Instalación y Configuración

### 🔧 **Requisitos Previos**
```bash
# Node.js (v16 o superior)
node --version

# npm o yarn
npm --version

# Expo CLI
npm install -g @expo/cli
```

### 🚀 **Instalación del Proyecto**
```bash
# Clonar repositorio
git clone https://github.com/MussikOn/APP_MussikOn_React_Native_Expo.git
cd APP_MussikOn_React_Native_Expo

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con las URLs correctas
```

### 🔧 **Configuración de Desarrollo**
```bash
# Iniciar servidor de desarrollo
npm start

# Ejecutar en Android
npm run android

# Ejecutar en iOS
npm run ios
```

### 🌐 **Configuración de Backend**
```bash
# Navegar al directorio del backend
cd ../app_mussikon_express

# Instalar dependencias
npm install

# Iniciar servidor
npm run dev
```

---

## 🎨 Sistema de Temas y UI/UX

### 🎨 **Sistema de Temas**
- ✅ **Tema Claro**: Colores vibrantes y legibles
- ✅ **Tema Oscuro**: Colores suaves para uso nocturno
- ✅ **Transiciones Suaves**: Cambio automático de tema
- ✅ **Consistencia Visual**: Paleta de colores unificada

### 🎯 **Principios de Diseño**
- ✅ **Accesibilidad**: Contraste adecuado y tamaños de texto
- ✅ **Responsividad**: Adaptación a diferentes tamaños de pantalla
- ✅ **Feedback Visual**: Animaciones y estados de interacción
- ✅ **Navegación Intuitiva**: Flujo lógico entre pantallas

### 🎨 **Componentes de UI**
- ✅ **Botones**: Estados consistentes y feedback táctil
- ✅ **Cards**: Diseño moderno con sombras y bordes redondeados
- ✅ **Formularios**: Validación visual y mensajes de error
- ✅ **Modales**: Overlays elegantes para acciones importantes

---

## 🔌 Sistema de Notificaciones

### 🔔 **Características Principales**
- ✅ **Tiempo Real**: Socket.IO para notificaciones instantáneas
- ✅ **Persistencia**: AsyncStorage para notificaciones offline
- ✅ **Navegación**: Acceso directo a detalles de solicitudes
- ✅ **Gestión**: Marcar como leídas, eliminar, limpiar todas

### 🎯 **Flujo de Usuario**
1. **Recepción**: Notificación llega vía Socket.IO
2. **Almacenamiento**: Se guarda localmente
3. **Indicación**: Botón flotante muestra contador
4. **Acceso**: Usuario toca botón para ver notificaciones
5. **Navegación**: Al tocar notificación, va a detalles

### 🎨 **Componentes Visuales**
- ✅ **Botón Flotante**: Pequeño, en header, no intrusivo
- ✅ **Contador**: Badge con número de no leídas
- ✅ **Animación**: Pulso cuando hay notificaciones nuevas
- ✅ **Pantalla Dedicada**: Lista completa con acciones

---

## 🌐 Configuración de API Centralizada

### 🎯 **Ventajas del Sistema Centralizado**
- ✅ **Un Solo Punto**: Cambiar URL en un archivo
- ✅ **Consistencia**: Todos los servicios usan misma configuración
- ✅ **Mantenimiento**: Fácil actualización de endpoints
- ✅ **Flexibilidad**: Soporte para múltiples entornos

### 📁 **Estructura de Configuración**
```
src/config/
├── apiConfig.ts          # Configuración principal
├── environment.ts        # Entornos (dev, prod, staging)
└── types/               # Tipos TypeScript
```

### 🔧 **Funciones Helper**
- ✅ **`getApiUrl()`**: Construir URLs con parámetros
- ✅ **`getSocketUrl()`**: Obtener URL de Socket.IO
- ✅ **`getApiConfig()`**: Configuración completa de API
- ✅ **`getSocketEvents()`**: Eventos de Socket.IO

---

## 📊 Estado del Proyecto

### ✅ **Funcionalidades Completadas**

#### **Autenticación y Usuarios**
- ✅ Login/Registro con validación
- ✅ Gestión de sesión con JWT
- ✅ Roles de usuario (Organizador/Músico)
- ✅ Perfil de usuario editable

#### **Gestión de Solicitudes**
- ✅ Creación de solicitudes musicales
- ✅ Edición y eliminación
- ✅ Estados de solicitud (Pendiente, Asignado, Completado, Cancelado)
- ✅ Filtrado y búsqueda
- ✅ Detalles completos de solicitudes

#### **Sistema de Notificaciones**
- ✅ Notificaciones en tiempo real
- ✅ Notificaciones persistentes
- ✅ Botón flotante de notificaciones
- ✅ Pantalla de gestión de notificaciones
- ✅ Navegación desde notificaciones

#### **UI/UX y Temas**
- ✅ Sistema de temas claro/oscuro
- ✅ Componentes reutilizables
- ✅ Animaciones fluidas
- ✅ Diseño responsivo

#### **Configuración y Arquitectura**
- ✅ Configuración centralizada de API
- ✅ Sistema de entornos
- ✅ Tipado TypeScript completo
- ✅ Estructura modular

### 🚧 **En Desarrollo**
- 🔄 Chat en tiempo real
- 🔄 Subida de archivos
- 🔄 Geolocalización avanzada
- 🔄 Analytics y métricas

### 📋 **Pendiente**
- ⏳ Sistema de pagos
- ⏳ Calificaciones y reseñas
- ⏳ Integración con redes sociales
- ⏳ Modo offline completo

---

## 🐛 Problemas Conocidos

### 🔧 **Problemas Técnicos**
- ⚠️ **Navegación**: Ocasional error de navegación en Android
- ⚠️ **Socket.IO**: Reconexión automática en algunos casos
- ⚠️ **Performance**: Carga lenta en dispositivos antiguos

### 🎨 **Problemas de UI/UX**
- ⚠️ **Responsividad**: Algunos elementos en pantallas muy pequeñas
- ⚠️ **Accesibilidad**: Mejoras necesarias en lectores de pantalla

### 🔌 **Problemas de API**
- ⚠️ **Timeout**: Ocasionales timeouts en conexiones lentas
- ⚠️ **Caché**: Mejoras necesarias en caché de datos

---

## 🔮 Roadmap y Mejoras Futuras

### 🚀 **Versión 2.0 (Próximos 3 meses)**
- 🎯 **Chat Avanzado**: Mensajes de voz, imágenes, archivos
- 🎯 **Geolocalización**: Búsqueda por proximidad
- 🎯 **Subida de Archivos**: Portfolios, demos, contratos
- 🎯 **Analytics**: Métricas de uso y rendimiento

### 🌟 **Versión 3.0 (Próximos 6 meses)**
- 🎯 **Sistema de Pagos**: Integración con pasarelas de pago
- 🎯 **Calificaciones**: Sistema de reseñas y ratings
- 🎯 **Redes Sociales**: Integración con Facebook, Instagram
- 🎯 **Modo Offline**: Funcionalidad completa sin conexión

### 🎪 **Versión 4.0 (Próximos 12 meses)**
- 🎯 **IA y ML**: Recomendaciones inteligentes
- 🎯 **Realidad Aumentada**: Visualización de eventos
- 🎯 **Streaming**: Transmisiones en vivo
- 🎯 **Marketplace**: Tienda de instrumentos y equipos

---

## 🤝 Contribución

### 📋 **Cómo Contribuir**
1. **Fork** el repositorio
2. **Crea** una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. **Push** a la rama (`git push origin feature/AmazingFeature`)
5. **Abre** un Pull Request

### 📝 **Estándares de Código**
- ✅ **TypeScript**: Tipado estático obligatorio
- ✅ **ESLint**: Linting de código
- ✅ **Prettier**: Formateo automático
- ✅ **Commits**: Mensajes descriptivos en español

### 🧪 **Testing**
- ✅ **Unit Tests**: Jest para lógica de negocio
- ✅ **Integration Tests**: Testing de API
- ✅ **E2E Tests**: Detox para flujos completos

---

## 📚 Documentación Completa

### 📖 **Guías Principales**
- [📚 Documentación Completa](docs/README.md) - Guía principal de documentación
- [🛠️ Guías de Desarrollo](DEVELOPMENT_GUIDELINES.md) - Mejores prácticas y estándares
- [📊 Análisis de Estado](PROJECT_STATUS_ANALYSIS.md) - Estado actual detallado
- [🚀 Guía de Modernización](MODERNIZATION_GUIDE.md) - Plan de mejora

### 🏗️ **Arquitectura y Estructura**
- [🏗️ Arquitectura del Proyecto](docs/architecture/README.md) - Visión general de la arquitectura
- [📁 Estructura de Carpetas](docs/architecture/folder-structure.md) - Organización del código
- [🎨 Patrones de Diseño](docs/architecture/design-patterns.md) - Patrones implementados
- [🔄 Flujo de Datos](docs/architecture/data-flow.md) - Flujo de información

### 🛠️ **Tecnologías y Dependencias**
- [🛠️ Stack Tecnológico](docs/technologies/tech-stack.md) - Tecnologías utilizadas
- [📦 Dependencias Principales](docs/technologies/dependencies.md) - Librerías y paquetes
- [⚙️ Configuración de Entorno](docs/technologies/environment-setup.md) - Setup del proyecto
- [🔧 Herramientas de Desarrollo](docs/technologies/development-tools.md) - Herramientas utilizadas

### 🎨 **UI/UX y Componentes**
- [🎨 Sistema de Diseño](docs/ui-ux/design-system.md) - Principios de diseño
- [🧩 Componentes UI](docs/components/ui-components.md) - Componentes de interfaz
- [🎨 Temas y Colores](docs/ui-ux/themes-colors.md) - Sistema de colores
- [🧭 Navegación](docs/ui-ux/navigation.md) - Sistema de navegación

### 🔧 **Funcionalidades Core**
- [🔐 Autenticación](docs/features/authentication.md) - Sistema de autenticación
- [📅 Gestión de Eventos](docs/features/events-management.md) - Manejo de eventos
- [🎵 Búsqueda de Músicos](docs/features/musician-search.md) - Búsqueda y filtros
- [💬 Chat en Tiempo Real](docs/features/real-time-chat.md) - Comunicación instantánea
- [🗺️ Sistema de Mapas](docs/features/maps-system.md) - Integración de mapas

### 📱 **Pantallas y Navegación**
- [🔐 Pantallas de Autenticación](docs/screens/auth-screens.md) - Login y registro
- [🏠 Pantallas Principales](docs/screens/main-screens.md) - Pantallas core
- [📅 Pantallas de Eventos](docs/screens/event-screens.md) - Gestión de eventos
- [👤 Pantallas de Perfil](docs/screens/profile-screens.md) - Perfiles de usuario

### 🔌 **APIs y Servicios**
- [🔌 Integración con Backend](docs/BACKEND_INTEGRATION.md) - Documentación completa de la API REST y Socket.IO
- [⚙️ Configuración de API](docs/api/api-configuration.md) - Setup de APIs
- [🔐 Servicios de Autenticación](docs/api/auth-services.md) - Servicios de auth
- [📅 Servicios de Eventos](docs/api/event-services.md) - Servicios de eventos
- [❌ Manejo de Errores](docs/api/error-handling.md) - Gestión de errores

### 🗄️ **Estado y Gestión de Datos**
- [🔄 Redux Store](docs/state-management/redux-store.md) - Configuración de Redux
- [📦 Slices de Estado](docs/state-management/state-slices.md) - Slices implementados
- [🌐 Contextos de React](docs/state-management/react-contexts.md) - Contextos utilizados
- [💾 Persistencia de Datos](docs/state-management/data-persistence.md) - Almacenamiento

### 🌍 **Internacionalización**
- [🌐 Configuración i18n](docs/i18n/i18n-setup.md) - Setup de internacionalización
- [📄 Archivos de Traducción](docs/i18n/translation-files.md) - Archivos de idiomas
- [🔧 Contexto de Idioma](docs/i18n/language-context.md) - Contexto de idioma

### 🧪 **Testing y Calidad**
- [🧪 Estrategia de Testing](docs/testing/testing-strategy.md) - Plan de testing
- [🔬 Tests Unitarios](docs/testing/unit-tests.md) - Tests de componentes
- [🔗 Tests de Integración](docs/testing/integration-tests.md) - Tests de integración
- [📋 Guías de Calidad](docs/testing/quality-guidelines.md) - Estándares de calidad

### 🚀 **Despliegue y Build**
- [⚙️ Configuración de Build](docs/deployment/build-configuration.md) - Configuración de build
- [📱 EAS Build](docs/deployment/eas-build.md) - Build con Expo
- [🌐 Configuración de Producción](docs/deployment/production-setup.md) - Setup de producción
- [📊 Monitoreo y Analytics](docs/deployment/monitoring.md) - Monitoreo de la app

### 📖 **Guías de Desarrollo**
- [📝 Guías de Estilo](docs/development/style-guides.md) - Convenciones de código
- [🔧 Convenciones de Código](docs/development/coding-conventions.md) - Estándares de desarrollo
- [🔄 Proceso de Desarrollo](docs/development/development-process.md) - Flujo de trabajo
- [🔧 Troubleshooting](docs/development/troubleshooting.md) - Solución de problemas

### 📝 **Documentación de Componentes**
- [🧩 Componentes UI](docs/components/ui-components.md) - Componentes de interfaz
- [🧭 Componentes de Navegación](docs/components/navigation-components.md) - Componentes de navegación
- [📝 Componentes de Formularios](docs/components/form-components.md) - Componentes de formularios
- [📅 Componentes de Eventos](docs/components/event-components.md) - Componentes de eventos
- [📋 Detalles de Componentes](docs/components/component-details.md) - Documentación detallada

### 🔍 **Análisis de Estado Actual**
- [📊 Estado del Proyecto](docs/project-status/current-status.md) - Estado actual
- [✅ Funcionalidades Implementadas](docs/project-status/implemented-features.md) - Features completadas
- [⏳ Funcionalidades Pendientes](docs/project-status/pending-features.md) - Features por implementar
- [🐛 Bugs Conocidos](docs/project-status/known-bugs.md) - Problemas identificados

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE.md` para más detalles.

---

## 📞 Contacto

- **Desarrollador Principal**: Jefry Agustin Astacio Sanchez
- **Email**: astaciosanchezjefryagustin@gmail.com
- **GitHub**: [@MussikOn](https://github.com/MussikOn)

---

## 🙏 Agradecimientos

- **Expo Team**: Por la excelente plataforma de desarrollo
- **React Native Community**: Por el ecosistema robusto
- **Socket.IO**: Por la comunicación en tiempo real
- **Firebase**: Por la infraestructura de backend

---

<div align="center">

**🎵 MussikOn - Conectando Música y Eventos 🎵**

*Desarrollado con ❤️ para la comunidad musical*

</div>
