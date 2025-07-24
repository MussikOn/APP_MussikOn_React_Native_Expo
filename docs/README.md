# 📚 Documentación Completa - MussikOn

## 🎯 Descripción General

**MussikOn** es una aplicación móvil desarrollada en React Native con Expo que conecta músicos y organizadores de eventos musicales. La aplicación facilita la búsqueda, contratación y gestión de eventos musicales a través de una interfaz intuitiva y funcionalidades en tiempo real.

**NUEVO:** Ahora la app cuenta con una pantalla moderna de **"Mis Solicitudes"** accesible desde el menú lateral, donde músicos y organizadores pueden gestionar todas sus solicitudes/eventos en progreso. Esta pantalla incluye tabs para alternar entre pendientes, asignados/agendados y todos, con feedback visual inmediato y acceso a los endpoints REST `/events/my-pending`, `/events/my-assigned`, `/events/my-scheduled`, `/events/my-events`.

## 📋 Índice de Documentación

### 🏗️ **Arquitectura y Estructura**
- [Arquitectura del Proyecto](./architecture/README.md)
- [Estructura de Carpetas](./architecture/folder-structure.md)
- [Patrones de Diseño](./architecture/design-patterns.md)
- [Flujo de Datos](./architecture/data-flow.md)

### 🛠️ **Tecnologías y Dependencias**
- [Stack Tecnológico](./technologies/tech-stack.md)
- [Dependencias Principales](./technologies/dependencies.md)
- [Configuración de Entorno](./technologies/environment-setup.md)
- [Herramientas de Desarrollo](./technologies/development-tools.md)

### 🎨 **UI/UX y Componentes**
- [Sistema de Diseño](./ui-ux/design-system.md)
- [Componentes UI](./ui-ux/ui-components.md)
- [Temas y Colores](./ui-ux/themes-colors.md)
- [Navegación](./ui-ux/navigation.md)

### 🔧 **Funcionalidades Core**
- [Autenticación](./features/authentication.md)
- [Gestión de Eventos](./features/events-management.md)
- [Búsqueda de Músicos](./features/musician-search.md)
- [Chat en Tiempo Real](./features/real-time-chat.md)
- [Sistema de Mapas](./features/maps-system.md)
- **Gestión centralizada de solicitudes/eventos:** ver sección "Mis Solicitudes" y los endpoints REST asociados.

### 📱 **Pantallas y Navegación**
- [Pantallas de Autenticación](./screens/auth-screens.md)
- [Pantallas Principales](./screens/main-screens.md)
- [Pantallas de Eventos](./screens/event-screens.md)
- [Pantallas de Perfil](./screens/profile-screens.md)
- **Pantalla "Mis Solicitudes"** (nueva): gestión moderna y centralizada de solicitudes/eventos para ambos roles.

### 🔌 **APIs y Servicios**
- [Configuración de API](./api/api-configuration.md)
- [Servicios de Autenticación](./api/auth-services.md)
- [Servicios de Eventos](./api/event-services.md)
- **Endpoints REST relevantes:** `/events/my-pending`, `/events/my-assigned`, `/events/my-scheduled`, `/events/my-events`.

### 🗄️ **Estado y Gestión de Datos**
- [Redux Store](./state-management/redux-store.md)
- [Slices de Estado](./state-management/state-slices.md)
- [Contextos de React](./state-management/react-contexts.md)
- [Persistencia de Datos](./state-management/data-persistence.md)

### 🌐 **Internacionalización**
- [Configuración i18n](./i18n/i18n-setup.md)
- [Archivos de Traducción](./i18n/translation-files.md)
- [Contexto de Idioma](./i18n/language-context.md)

### 🧪 **Testing y Calidad**
- [Estrategia de Testing](./testing/testing-strategy.md)
- [Tests Unitarios](./testing/unit-tests.md)
- [Tests de Integración](./testing/integration-tests.md)
- [Guías de Calidad](./testing/quality-guidelines.md)

### 🚀 **Despliegue y Build**
- [Configuración de Build](./deployment/build-configuration.md)
- [EAS Build](./deployment/eas-build.md)
- [Configuración de Producción](./deployment/production-setup.md)
- [Monitoreo y Analytics](./deployment/monitoring.md)

### 📖 **Guías de Desarrollo**
- [Guías de Estilo](./development/style-guides.md)
- [Convenciones de Código](./development/coding-conventions.md)
- [Proceso de Desarrollo](./development/development-process.md)
- [Troubleshooting](./development/troubleshooting.md)

### 📝 **Documentación de Componentes**
- [Componentes UI](./components/ui-components.md)
- [Componentes de Navegación](./components/navigation-components.md)
- [Componentes de Formularios](./components/form-components.md)
- [Componentes de Eventos](./components/event-components.md)

### 🔍 **Análisis de Estado Actual**
- [Estado del Proyecto](./project-status/current-status.md)
- [Funcionalidades Implementadas](./project-status/implemented-features.md)
- [Funcionalidades Pendientes](./project-status/pending-features.md)
- [Bugs Conocidos](./project-status/known-bugs.md)

## 🎯 **Objetivos de la Documentación**

Esta documentación está diseñada para:

1. **Facilitar la comprensión** del proyecto para nuevos desarrolladores
2. **Estandarizar el desarrollo** con guías claras y convenciones
3. **Acelerar el onboarding** de nuevos miembros del equipo
4. **Mantener la calidad** del código y la arquitectura
5. **Documentar decisiones técnicas** y sus justificaciones
6. **Proporcionar referencias rápidas** para tareas comunes

## 📊 **Métricas de Documentación**

- **Cobertura**: 100% de archivos principales documentados
- **Actualización**: Documentación actualizada con cada release
- **Accesibilidad**: Estructura clara y navegación intuitiva
- **Mantenibilidad**: Separación por módulos y funcionalidades

## 🔄 **Mantenimiento**

Esta documentación se actualiza automáticamente con cada cambio significativo en el código. Los desarrolladores deben:

1. Actualizar la documentación al agregar nuevas funcionalidades
2. Revisar la documentación antes de hacer merge a main
3. Mantener ejemplos de código actualizados
4. Verificar que los enlaces internos funcionen correctamente

---

**Última actualización**: Diciembre 2024  
**Versión de la documentación**: 1.0.0  
**Mantenedor**: Equipo de Desarrollo MussikOn 