# Sistema de Autenticación

## Descripción General
Sistema completo de autenticación implementado con JWT tokens, Firebase y gestión de estado robusta.

## Estado de Implementación
**100% Implementado** ✅

## Arquitectura

### Frontend
- **Context**: `UserContext` - Gestión centralizada del estado de usuario
- **Almacenamiento**: Expo SecureStore para tokens JWT
- **Estado**: Redux + React Context para sincronización
- **Validación**: Esquemas de validación con Yup

### Backend
- **Autenticación**: Firebase Authentication
- **Base de datos**: Firebase Firestore
- **Tokens**: JWT para sesiones
- **Middleware**: Protección de rutas con verificación de tokens

## Componentes Implementados

### Pantallas
- `Login.tsx` - Inicio de sesión completo
- `Register.tsx` - Registro de usuarios con validación
- `Profile.tsx` - Gestión de perfil de usuario

### Hooks
- `useUser` - Acceso al contexto de usuario
- `useFormValidation` - Validación de formularios

### Servicios
- `auth.ts` - Funciones de autenticación
- `api.ts` - Interceptores para tokens automáticos

## Flujo de Autenticación

1. **Login**
   - Usuario ingresa credenciales
   - Validación en frontend
   - Llamada a API de autenticación
   - Almacenamiento de token JWT
   - Actualización de estado global

2. **Registro**
   - Formulario multi-paso con validación
   - Creación de cuenta en Firebase
   - Generación de perfil inicial
   - Login automático post-registro

3. **Persistencia**
   - Token almacenado en SecureStore
   - Recuperación automática al abrir app
   - Refresh automático de datos de usuario

4. **Logout**
   - Eliminación de token
   - Limpieza de estado global
   - Redirección a pantalla de login

## Seguridad

- **Tokens JWT**: Expiración configurable
- **Almacenamiento seguro**: Expo SecureStore
- **Validación**: Esquemas robustos en frontend y backend
- **Interceptores**: Renovación automática de tokens

## API Endpoints

### Autenticación
- `POST /auth/login` - Inicio de sesión
- `POST /auth/register` - Registro de usuario
- `POST /auth/logout` - Cierre de sesión
- `GET /auth/me` - Obtener datos del usuario actual

### Usuarios
- `GET /users/:id` - Obtener perfil de usuario
- `PUT /users/:id` - Actualizar perfil
- `DELETE /users/:id` - Eliminar cuenta

## Estados de Usuario

- **No autenticado**: Sin token, acceso limitado
- **Autenticado**: Token válido, acceso completo
- **Cargando**: Verificación de token en progreso
- **Error**: Problemas de autenticación

## Integración con Navegación

- **Rutas protegidas**: Verificación automática de autenticación
- **Redirección**: Lógica inteligente basada en estado de usuario
- **Sidebar**: Menú contextual según rol de usuario

## Manejo de Errores

- **Validación**: Errores de formulario en tiempo real
- **Red**: Manejo de errores de API
- **Tokens expirados**: Renovación automática o logout
- **Offline**: Estado persistente con fallback

## Testing

- **Unit tests**: Hooks y utilidades
- **Integration tests**: Flujos de autenticación
- **E2E tests**: Flujos completos de login/registro

## Roadmap

- [ ] Autenticación biométrica
- [ ] Autenticación de dos factores
- [ ] OAuth con redes sociales
- [ ] Gestión de sesiones múltiples

## Archivos Relacionados

- `src/contexts/UserContext.tsx`
- `src/screens/auth/Login.tsx`
- `src/screens/auth/Register.tsx`
- `src/utils/auth.ts`
- `src/services/api.ts`
- `src/utils/validationSchemas.ts`
