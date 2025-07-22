# 🎵 MussikOn

Aplicación móvil para conectar músicos y eventos musicales. Desarrollada con React Native y Expo.

## 📱 Características

- **Autenticación de usuarios** - Sistema seguro de login y registro
- **Búsqueda de músicos** - Encuentra músicos por instrumento y ubicación
- **Gestión de eventos** - Crea y gestiona eventos musicales
- **Chat en tiempo real** - Comunicación instantánea entre usuarios
- **Mapas interactivos** - Visualiza músicos y eventos en tu área
- **Perfiles personalizados** - Gestiona tu información y preferencias

## 🛠️ Tecnologías

- **React Native** - Framework de desarrollo móvil
- **Expo** - Plataforma de desarrollo y herramientas
- **TypeScript** - Tipado estático para mayor robustez
- **Socket.io** - Comunicación en tiempo real
- **React Navigation** - Navegación entre pantallas
- **AsyncStorage** - Almacenamiento local
- **Axios** - Cliente HTTP para APIs

## 🚀 Instalación

### Prerrequisitos

- Node.js (versión 16 o superior)
- npm o yarn
- Expo CLI
- Expo Go (para pruebas en dispositivo)

### Pasos de instalación

1. **Clonar el repositorio**
```bash
git clone [URL_DEL_REPOSITORIO]
cd APP_MussikOn_React_Native_Expo
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Iniciar el proyecto**
```bash
npm start
# o
npx expo start
```

4. **Ejecutar en dispositivo**
- Escanea el código QR con Expo Go (Android)
- Usa la app Cámara en iOS

## 📁 Estructura del Proyecto

```
src/
├── app/                    # Punto de entrada de la aplicación
├── components/            # Componentes reutilizables
│   ├── ui/               # Componentes de interfaz
│   ├── features/         # Componentes específicos de funcionalidades
│   └── navigation/       # Componentes de navegación
├── screens/              # Pantallas de la aplicación
│   ├── auth/            # Pantallas de autenticación
│   ├── dashboard/       # Pantalla principal
│   ├── profile/         # Perfil de usuario
│   └── settings/        # Configuraciones
├── hooks/               # Custom hooks
├── utils/               # Utilidades y helpers
├── types/               # Definiciones de tipos TypeScript
├── styles/              # Estilos y temas
└── contexts/            # Contextos de React (futuro)
```

## 🔧 Scripts Disponibles

```bash
# Iniciar en modo desarrollo
npm start

# Iniciar en Android
npm run android

# Iniciar en iOS
npm run ios

# Iniciar en web
npm run web

# Limpiar cache
npx expo start --clear
```

## 🌐 Configuración de Entorno

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
API_URL=http://tu-servidor-api.com
SOCKET_URL=ws://tu-servidor-socket.com
```

### Configuración de API

Edita `src/utils/ENV.ts` para configurar las URLs de tu backend:

```typescript
export const URL_API = `http://tu-servidor-api.com`;
```

## 📱 Características Principales

### Autenticación
- Login con email y contraseña
- Registro de nuevos usuarios
- Gestión de tokens JWT
- Persistencia de sesión

### Búsqueda de Músicos
- Filtros por instrumento
- Búsqueda por ubicación
- Perfiles detallados
- Sistema de calificaciones

### Eventos Musicales
- Creación de eventos
- Gestión de invitaciones
- Calendario integrado
- Notificaciones en tiempo real

### Chat y Comunicación
- Mensajería instantánea
- Notificaciones push
- Estados de conexión
- Historial de conversaciones

## 🔒 Seguridad

- Tokens JWT para autenticación
- Validación de datos en frontend
- Sanitización de inputs
- Manejo seguro de errores

## 🎨 Temas y Personalización

La aplicación soporta:
- Modo claro/oscuro
- Colores personalizables
- Tipografías adaptables
- Iconografía consistente

## 📊 Performance

- Lazy loading de componentes
- Optimización de imágenes
- Caché inteligente
- Bundle splitting

## 🧪 Testing

```bash
# Ejecutar tests
npm test

# Tests en modo watch
npm run test:watch

# Coverage
npm run test:coverage
```

## 📦 Build y Despliegue

### Android
```bash
eas build --platform android
```

### iOS
```bash
eas build --platform ios
```

### Configuración EAS
El proyecto incluye configuración para EAS Build. Revisa `eas.json` para más detalles.

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📋 Checklist de Desarrollo

- [ ] Código sigue las convenciones de TypeScript
- [ ] Componentes están tipados correctamente
- [ ] Tests pasan
- [ ] Documentación actualizada
- [ ] Performance optimizada
- [ ] Accesibilidad implementada

## 🐛 Reportar Bugs

Si encuentras un bug, por favor:

1. Revisa si ya existe un issue similar
2. Crea un nuevo issue con:
   - Descripción detallada del problema
   - Pasos para reproducir
   - Información del dispositivo/OS
   - Screenshots si es relevante

## 📞 Soporte

- **Documentación:** [DEVELOPMENT_GUIDELINES.md](./DEVELOPMENT_GUIDELINES.md)
- **Issues:** Usa la sección de Issues de GitHub
- **Discusiones:** Usa la sección de Discussions

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🙏 Agradecimientos

- Equipo de Expo por la excelente plataforma
- Comunidad de React Native
- Contribuidores del proyecto

---

**Desarrollado con ❤️ para la comunidad musical**

*Última actualización: Diciembre 2024*

## 🌍 Internacionalización (i18n)

- Soporte completo para múltiples idiomas (español, inglés, y fácil de expandir).
- Selector de idioma disponible en la pantalla de configuración.
- Todo el texto visible para el usuario está internacionalizado usando `i18next` y `react-i18next`.
- Para agregar un nuevo idioma, consulta la documentación en `docs/technologies/tags/LanguageSelector.md`.
