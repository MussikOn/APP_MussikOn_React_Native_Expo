# 🎵 MussikOn - Aplicación Móvil para Conectar Músicos y Eventos

> **Plataforma móvil desarrollada en React Native + Expo para conectar músicos con organizadores de eventos musicales**

## 🚀 **Estado Actual del Proyecto**

### ✅ **Funcionalidades Implementadas**
- [x] **Sistema de Autenticación Completo** - Login, registro, JWT, persistencia segura
- [x] **Navegación Inteligente** - Stack, Tabs, Drawer con roles diferenciados
- [x] **Sistema de Temas** - Claro/oscuro con personalización completa
- [x] **Internacionalización** - Soporte ES/EN con detección automática
- [x] **Gestión de Eventos** - Creación, listado, filtros por rol
- [x] **Notificaciones en Tiempo Real** - Socket.io con reconexión automática
- [x] **UI/UX Foundation** - Componentes modernos, loading states, error handling
- [x] **Configuración Robusta** - Entornos, APIs centralizadas, manejo de errores
- [x] **Pantalla "Mis Solicitudes"** - Gestión centralizada con tabs y feedback visual

### 🔄 **Funcionalidades en Desarrollo**
- [~] **Sistema de Mapas Avanzado** - Geolocalización y marcadores personalizados
- [~] **Chat en Tiempo Real** - Interfaz completa de mensajería
- [~] **Gestión de Perfiles** - Subida de imágenes y preferencias avanzadas
- [~] **Sistema de Pagos** - Integración con pasarelas de pago

### 📋 **Pendientes de Implementar**
- [ ] **Sistema de Calificaciones** - Reviews y ratings
- [ ] **Push Notifications** - Notificaciones push nativas
- [ ] **Analytics** - Métricas y tracking de uso
- [ ] **Modo Offline** - Funcionalidad sin conexión

---

## 🛠️ **Stack Tecnológico**

### **Framework Principal**
- **React Native** 0.79.5 - Framework móvil multiplataforma
- **Expo** 53.0.0 - Plataforma de desarrollo y herramientas
- **TypeScript** 5.8.3 - Tipado estático para robustez

### **Gestión de Estado**
- **Redux Toolkit** 2.8.2 - Estado global con slices organizados
- **React Context** - Contextos para tema, usuario, idioma

### **Navegación**
- **React Navigation** 7.x - Stack, Tabs, Drawer navigators
- **Navegación por Roles** - Experiencias diferenciadas por tipo de usuario

### **Comunicación**
- **Socket.io Client** 4.8.1 - Comunicación en tiempo real
- **Axios** 1.3.6 - Cliente HTTP con interceptores
- **JWT Decode** - Manejo de tokens de autenticación

### **UI/UX**
- **Expo Vector Icons** - Iconografía consistente
- **Expo Linear Gradient** - Gradientes y efectos visuales
- **Expo Blur** - Efectos de desenfoque
- **Lottie React Native** - Animaciones complejas

### **Almacenamiento**
- **Expo Secure Store** - Almacenamiento seguro de tokens
- **AsyncStorage** - Persistencia de preferencias

### **Internacionalización**
- **i18next** + **react-i18next** - Soporte multiidioma
- **expo-localization** - Detección automática de idioma

---

## 📱 **Características Principales**

### 🔐 **Autenticación Segura**
- Login/registro con validación robusta
- Tokens JWT con almacenamiento seguro
- Persistencia de sesión automática
- Manejo de tokens expirados

### 🎵 **Gestión de Eventos Musicales**
- Creación de solicitudes de músicos
- Filtros por instrumento, ubicación, fecha
- Estados en tiempo real (pendiente, asignado, completado)
- Historial de eventos por rol

### 🌍 **Internacionalización Completa**
- Soporte para español e inglés
- Detección automática de idioma del dispositivo
- Selector de idioma en configuración
- Persistencia de preferencias

### 🎨 **Sistema de Temas**
- Modo claro/oscuro
- Colores oficiales de MussikOn
- Componentes adaptables al tema
- Transiciones suaves

### 📍 **Sistema de Mapas**
- Integración con React Native Maps
- Selección de ubicación para eventos
- Geolocalización del usuario
- Marcadores personalizados

### 💬 **Comunicación en Tiempo Real**
- Socket.io para notificaciones instantáneas
- Estados de conexión en tiempo real
- Reconexión automática
- Eventos específicos por funcionalidad

---

## 🚀 **Instalación y Configuración**

### **Prerrequisitos**
- Node.js 16+ 
- npm o yarn
- Expo CLI
- Expo Go (para pruebas)

### **Pasos de Instalación**

1. **Clonar el repositorio**
```bash
git clone [URL_DEL_REPOSITORIO]
cd APP_MussikOn_React_Native_Expo
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar entorno**
```bash
# Crear archivo .env en la raíz
API_URL=http://tu-servidor-api.com
SOCKET_URL=ws://tu-servidor-socket.com
```

4. **Iniciar desarrollo**
```bash
npm start
# o
npx expo start
```

5. **Ejecutar en dispositivo**
- Escanear QR con Expo Go (Android)
- Usar app Cámara en iOS

---

## 📁 **Estructura del Proyecto**

```
src/
├── app/                    # Punto de entrada
│   └── App.tsx            # Componente raíz
├── components/            # Componentes reutilizables
│   ├── ui/               # Componentes de interfaz
│   ├── features/         # Componentes específicos
│   └── navigation/       # Componentes de navegación
├── screens/              # Pantallas de la aplicación
│   ├── auth/            # Autenticación
│   ├── dashboard/       # Panel principal
│   ├── events/          # Gestión de eventos
│   ├── profile/         # Perfiles de usuario
│   └── settings/        # Configuraciones
├── services/            # Servicios y APIs
│   ├── api.ts           # Cliente HTTP centralizado
│   ├── events.ts        # Servicios de eventos
│   └── musicianRequests.ts # Servicios de músicos
├── store/               # Estado global (Redux)
│   ├── store.ts         # Configuración de store
│   └── slices/          # Slices de Redux
├── contexts/            # Contextos de React
│   ├── ThemeContext.tsx # Contexto de tema
│   ├── UserContext.tsx  # Contexto de usuario
│   ├── LanguageContext.tsx # Contexto de idioma
│   └── SidebarContext.tsx # Contexto de sidebar
├── hooks/               # Custom hooks
│   ├── useSocket.tsx    # Hook de sockets
│   └── useMusicianRequestSocket.ts # Hook de solicitudes
├── utils/               # Utilidades y helpers
│   ├── functions.ts     # Funciones de token
│   ├── auth.ts          # Utilidades de auth
│   └── socket.ts        # Configuración de socket
├── theme/               # Sistema de diseño
│   ├── colors.ts        # Paleta de colores
│   ├── typography.ts    # Tipografías
│   └── spacing.ts       # Espaciado y layout
├── i18n/                # Internacionalización
│   ├── index.ts         # Configuración i18n
│   └── locales/         # Archivos de traducción
├── config/              # Configuración
│   └── environment.ts   # Variables de entorno
└── appTypes/            # Tipos TypeScript
    └── DatasTypes.ts    # Tipos principales
```

---

## 🔧 **Scripts Disponibles**

```bash
# Desarrollo
npm start              # Iniciar servidor de desarrollo
npm run android        # Ejecutar en Android
npm run ios           # Ejecutar en iOS
npm run web           # Ejecutar en web

# Build y Deploy
eas build --platform android  # Build para Android
eas build --platform ios      # Build para iOS

# Utilidades
npx tsc --noEmit      # Verificar tipos TypeScript
npx expo start --clear # Limpiar cache
```

---

## 🌐 **Configuración de APIs**

### **Variables de Entorno**
```typescript
// src/config/environment.ts
export const API_URL = "http://tu-servidor-api.com";
export const SOCKET_URL = "ws://tu-servidor-socket.com";
```

### **Endpoints Principales**
- `POST /auth/login` - Autenticación de usuarios
- `POST /events/request-musician` - Crear solicitud de músico
- `GET /events/my-pending` - Eventos pendientes del organizador
- `GET /events/my-assigned` - Eventos asignados del organizador
- `GET /events/available-requests` - Solicitudes disponibles para músicos
- `POST /events/:eventId/accept` - Aceptar solicitud (músico)

---

## 🎨 **Sistema de Diseño**

### **Colores Oficiales**
```typescript
// Paleta principal de MussikOn
primary: {
  500: '#014aad',    // Azul principal
  600: '#013e94',    // Azul oscuro
  400: '#3385d7',    // Azul claro
}

secondary: {
  500: '#444444',    // Gris medio
  900: '#000000',    // Negro puro
}

accent: {
  500: '#1aa3ff',    // Azul claro
}
```

### **Componentes UI**
- **Button** - Botones con múltiples variantes
- **Input** - Campos de entrada con validación
- **Card** - Tarjetas contenedoras
- **LoadingSpinner** - Indicadores de carga
- **Header** - Encabezados de pantalla
- **BottomNavigation** - Navegación inferior

---

## 🔐 **Seguridad**

- **Tokens JWT** - Autenticación segura
- **Expo Secure Store** - Almacenamiento encriptado
- **Validación de Datos** - Sanitización de inputs
- **Manejo de Errores** - Logging centralizado
- **Interceptores HTTP** - Headers automáticos

---

## 🌍 **Internacionalización**

### **Idiomas Soportados**
- **Español (ES)** - Idioma por defecto
- **Inglés (EN)** - Idioma secundario

### **Uso en Componentes**
```typescript
import { useTranslation } from 'react-i18next';

const { t } = useTranslation();
<Text>{t('login.title')}</Text>
```

---

## 📊 **Performance**

- **Lazy Loading** - Carga diferida de componentes
- **Optimización de Imágenes** - Compresión automática
- **Caché Inteligente** - Almacenamiento local
- **Bundle Splitting** - División de código
- **Memory Management** - Limpieza de recursos

---

## 🧪 **Testing**

```bash
# Ejecutar tests
npm test

# Tests en modo watch
npm run test:watch

# Coverage
npm run test:coverage
```

---

## 📦 **Build y Despliegue**

### **Android**
```bash
eas build --platform android
```

### **iOS**
```bash
eas build --platform ios
```

### **Configuración EAS**
El proyecto incluye configuración completa para EAS Build. Revisa `eas.json` para más detalles.

---

## 🤝 **Contribución**

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### **Guías de Contribución**
- Sigue las convenciones de TypeScript
- Mantén la consistencia del código
- Documenta nuevas funcionalidades
- Añade tests para nuevas features

---

## 📚 **Documentación**

### **Archivos de Documentación**
- [📚 Documentación Completa](./docs/INDEX.md)
- [🛠️ Guías de Desarrollo](./DEVELOPMENT_GUIDELINES.md)
- [📊 Análisis de Estado](./PROJECT_STATUS_ANALYSIS.md)
- [🚀 Guía de Modernización](./MODERNIZATION_GUIDE.md)

### **Secciones Principales**
- [🏗️ Arquitectura](./docs/architecture/README.md)
- [🛠️ Tecnologías](./docs/technologies/tech-stack.md)
- [🎨 Componentes](./docs/components/ui-components.md)
- [🔐 Autenticación](./docs/features/authentication.md)
- [📱 Pantallas](./docs/screens/)

---

## 🐛 **Reportar Bugs**

Si encuentras un bug, por favor:

1. Revisa si ya existe un issue similar
2. Crea un nuevo issue con:
   - Descripción detallada del problema
   - Pasos para reproducir
   - Información del dispositivo/OS
   - Screenshots si es relevante

---

## 📞 **Soporte**

- **Documentación:** [DEVELOPMENT_GUIDELINES.md](./DEVELOPMENT_GUIDELINES.md)
- **Issues:** Usa la sección de Issues de GitHub
- **Discusiones:** Usa la sección de Discussions

---

## 📄 **Licencia**

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

## 🙏 **Agradecimientos**

- Equipo de Expo por la excelente plataforma
- Comunidad de React Native
- Contribuidores del proyecto
- Músicos y organizadores que inspiran la plataforma

---

**Desarrollado con ❤️ para la comunidad musical**

*Última actualización: Diciembre 2024*  
*Versión del proyecto: 1.0.0*
