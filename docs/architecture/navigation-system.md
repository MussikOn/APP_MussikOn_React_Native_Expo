# Sistema de Navegación

## Descripción General
Sistema de navegación completo con navegación por pestañas, drawer lateral y navegación por stack, adaptado a diferentes roles de usuario.

## Estado de Implementación
**100% Implementado** ✅

## Arquitectura

### Frontend
- **React Navigation**: Stack, Bottom Tabs, Drawer
- **Navegación condicional**: Basada en roles de usuario
- **Context**: SidebarContext para gestión del drawer
- **Estado**: Redux para navegación persistente

### Backend
- **Rutas protegidas**: Verificación de autenticación
- **Middleware**: Validación de permisos por rol
- **Webhooks**: Redirecciones automáticas

## Componentes Implementados

### Navegadores
- `App.tsx` - Navegador principal con Stack
- `MainTabs.tsx` - Navegación por pestañas inferiores
- `MainSidebar.tsx` - Drawer lateral con menú

### Pantallas de Navegación
- `HomeScreen.tsx` - Pantalla principal para usuarios
- `Dashboard.tsx` - Pantalla principal para músicos
- `Profile.tsx` - Perfil de usuario
- `SettingsScreen.tsx` - Configuraciones

## Estructura de Navegación

### Navegador Principal (Stack)
```
App (Stack Navigator)
├── Login
├── Register
├── MainTabs (Bottom Tabs)
│   ├── Home/Dashboard (según rol)
│   ├── Available Requests
│   ├── My Events
│   ├── Chat
│   └── Profile
├── Sidebar (Drawer)
├── Event Screens
├── Payment Screens
├── Chat Screens
├── Maps
└── Reels
```

### Navegación por Pestañas (MainTabs)
```
MainTabs (Bottom Tabs)
├── Músicos:
│   ├── Dashboard (principal)
│   ├── Available
│   ├── MyEvents
│   ├── Chat
│   └── Profile
└── Usuarios:
    ├── Home (principal)
    ├── Available
    ├── MyEvents
    ├── Chat
    └── Profile
```

### Drawer Lateral (MainSidebar)
```
Sidebar (Drawer)
├── Home/Dashboard (según rol)
├── Profile
├── My Requests
├── Available Requests
├── Chat
├── Notifications
├── Payments
└── Settings
```

## Navegación Condicional por Rol

### Usuario Músico
- **Pantalla principal**: Dashboard
- **Pestañas**: Dashboard, Available, MyEvents, Chat, Profile
- **Sidebar**: Dashboard como primera opción
- **Acceso**: Solo músicos pueden ver Dashboard

### Usuario Regular
- **Pantalla principal**: Home
- **Pestañas**: Home, Available, MyEvents, Chat, Profile
- **Sidebar**: Home como primera opción
- **Acceso**: No pueden acceder a Dashboard

## Flujos de Navegación

### 1. Autenticación
- Usuario abre app
- Verificación de token existente
- Redirección a Login si no autenticado
- Redirección a MainTabs si autenticado

### 2. Navegación Principal
- Usuario autenticado ve MainTabs
- Primera pestaña según rol (Dashboard/Home)
- Navegación entre pestañas disponibles
- Acceso a drawer lateral

### 3. Navegación Secundaria
- Navegación a pantallas específicas
- Stack navigation para flujos complejos
- Retorno a pantalla anterior
- Navegación anidada

## Protección de Rutas

### Nivel de App
- **Verificación de token**: Middleware global
- **Redirección automática**: Login si no autenticado
- **Estado de carga**: Spinner durante verificación

### Nivel de Pantalla
- **useEffect**: Verificación de permisos
- **Redirección**: Navegación automática si no autorizado
- **Loading**: Estado de carga durante verificación

### Nivel de Componente
- **Renderizado condicional**: UI según permisos
- **Acciones**: Funcionalidades limitadas por rol
- **Mensajes**: Información contextual

## Gestión de Estado de Navegación

### Redux Store
- **Navigation State**: Estado actual de navegación
- **History**: Historial de navegación
- **Permissions**: Permisos por pantalla

### Context
- **SidebarContext**: Estado del drawer lateral
- **UserContext**: Estado de autenticación
- **ThemeContext**: Tema para navegación

### Hooks Personalizados
- **useNavigation**: Hook de navegación
- **useRoute**: Hook de ruta actual
- **usePermissions**: Hook de permisos

## Navegación Profunda (Deep Linking)

### Configuración
- **URLs**: Enlaces directos a pantallas
- **Parámetros**: Datos pasados por URL
- **Fallbacks**: Navegación por defecto

### Casos de Uso
- **Notificaciones**: Navegación desde push
- **Enlaces externos**: Compartir enlaces
- **Web**: Navegación desde navegador

## Navegación Offline

### Estado
- **Cache**: Navegación almacenada localmente
- **Sincronización**: Actualización al conectar
- **Fallbacks**: Pantallas disponibles offline

### Funcionalidades
- **Navegación básica**: Entre pantallas principales
- **Datos locales**: Información cacheada
- **Acciones**: Funcionalidades limitadas

## Performance

### Optimización
- **Lazy loading**: Carga de pantallas bajo demanda
- **Preload**: Precarga de pantallas frecuentes
- **Cache**: Almacenamiento de estado de navegación
- **Debounce**: Reducción de navegaciones rápidas

### Métricas
- **Tiempo de carga**: Pantallas principales
- **Transiciones**: Animaciones suaves
- **Memoria**: Uso de RAM por pantalla
- **Batería**: Consumo energético

## Manejo de Errores

### Navegación
- **Ruta no encontrada**: Pantalla 404
- **Permisos insuficientes**: Redirección automática
- **Error de carga**: Reintento automático
- **Fallback**: Pantalla de error genérica

### Autenticación
- **Token expirado**: Logout automático
- **Error de red**: Reintento con backoff
- **Datos corruptos**: Limpieza y recarga
- **Estado inconsistente**: Sincronización

## Testing

### Unit Tests
- **Componentes**: Navegación individual
- **Hooks**: Hooks de navegación
- **Utilidades**: Funciones de navegación

### Integration Tests
- **Flujos**: Navegación completa
- **Roles**: Permisos por usuario
- **Transiciones**: Entre pantallas

### E2E Tests
- **Experiencia completa**: Desde login hasta logout
- **Navegación**: Entre todas las pantallas
- **Permisos**: Verificación de acceso

## Roadmap

- [ ] Navegación por gestos avanzada
- [ ] Transiciones personalizadas
- [ ] Navegación por voz
- [ ] Navegación adaptativa
- [ ] Analytics de navegación
- [ ] A/B testing de flujos
- [ ] Navegación predictiva

## Archivos Relacionados

- `src/app/App.tsx`
- `src/components/navigation/MainTabs.tsx`
- `src/components/features/pages/Sidebar/MainSidebar.tsx`
- `src/contexts/SidebarContext.tsx`
- `src/contexts/UserContext.tsx`
- `src/screens/dashboard/HomeScreen.tsx`
- `src/screens/dashboard/Dashboard.tsx`
- `src/screens/profile/Profile.tsx`
- `src/screens/settings/SettingsScreen.tsx`
- `src/store/slices/navigationSlice.ts`
