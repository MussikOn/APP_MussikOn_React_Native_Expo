# 🚀 START.md - Guía de Implementación Automática para IA

> **Proyecto:** MussikOn Mobile App - React Native con Expo  
> **Versión:** 3.0.0 - Reinicio Completo del Proyecto  
> **Última Actualización:** Diciembre 2024  
> **Objetivo:** Implementación desde cero del sistema de solicitudes de músicos y pagos por depósito

---

## 🎯 **INSTRUCCIONES CRÍTICAS PARA IA**

### **Tu Misión Específica**
Eres una IA desarrolladora especializada en React Native, Expo, TypeScript, Redux, Socket.IO y desarrollo móvil. Tu objetivo es implementar **AUTOMÁTICAMENTE** desde cero el sistema de solicitudes de músicos y pagos por depósito en el proyecto **MusikOn Mobile App**.

### **⚠️ REGLAS CRÍTICAS**
1. **Siempre ejecuta** `npm run typecheck` antes y después de cambios
2. **Mantén la paleta de colores** especificada: `#014aad`, `#000000`, `#18375d`, `#5ebeee`, `#757575`, `#ff8c8c`, `#a2d6b0`
3. **Sigue las mejores prácticas** de React Native y TypeScript
4. **Implementa UI/UX moderna** con animaciones y microinteracciones
5. **Construye desde cero** con arquitectura limpia y escalable

---

## 📊 **ANÁLISIS CRÍTICO DEL ESTADO ACTUAL**

### ✅ **LO QUE YA EXISTE (BASE LIMPIA)**
- **App.tsx básico** - Pantalla de inicio con logo y título
- **Estructura de carpetas** - Organización básica del proyecto
- **Configuración Expo** - Proyecto configurado y funcionando
- **Dependencias instaladas** - React Native, Expo, TypeScript

### ❌ **LO QUE FALTA CRÍTICAMENTE (TODO POR IMPLEMENTAR)**

#### **1. Sistema de Autenticación (PRIORIDAD MÁXIMA)**
- ❌ **Pantallas de login/registro** - No existen
- ❌ **Context de usuario** - No existe gestión de estado
- ❌ **Persistencia de sesión** - No hay almacenamiento local
- ❌ **Validación de formularios** - No hay validaciones
- ❌ **Navegación protegida** - No hay rutas protegidas

#### **2. Sistema de Solicitudes de Músicos (PRIORIDAD MÁXIMA)**
- ❌ **Pantallas de solicitudes** - No existen
- ❌ **Formulario de creación** - No existe
- ❌ **Flujo de aceptación** - No existe
- ❌ **Estados de solicitud** - No hay manejo de estados
- ❌ **Notificaciones en tiempo real** - No hay Socket.IO

#### **3. Sistema de Pagos por Depósito (PRIORIDAD MÁXIMA)**
- ❌ **Pantalla de balance** - No existe
- ❌ **Subida de comprobantes** - No existe
- ❌ **Historial de transacciones** - No existe
- ❌ **Cuentas bancarias** - No existe gestión
- ❌ **Flujo de pagos** - No existe integración

#### **4. Infraestructura Básica (PRIORIDAD MÁXIMA)**
- ❌ **Sistema de navegación** - No existe React Navigation
- ❌ **Gestión de estado** - No existe Redux/Context
- ❌ **Sistema de temas** - No existe gestión de colores
- ❌ **Servicios de API** - No existen llamadas al backend
- ❌ **Componentes UI** - No existen componentes reutilizables

---

## 🚀 **PLAN DE IMPLEMENTACIÓN AUTOMÁTICA**

### **FASE 1: INFRAESTRUCTURA BÁSICA (Semana 1)**

#### **1.1 Configurar Navegación**
```typescript
// Archivos a crear:
src/navigation/
├── AppNavigator.tsx                 // Navegador principal
├── AuthNavigator.tsx                // Navegador de autenticación
├── MainNavigator.tsx                // Navegador principal (post-login)
└── types.ts                         // Tipos de navegación
```

#### **1.2 Configurar Gestión de Estado**
```typescript
// Archivos a crear:
src/store/
├── store.ts                         // Configuración Redux
├── slices/
│   ├── authSlice.ts                 // Estado de autenticación
│   ├── userSlice.ts                 // Estado de usuario
│   ├── requestsSlice.ts             // Estado de solicitudes
│   └── paymentsSlice.ts             // Estado de pagos
└── types.ts                         // Tipos de estado
```

#### **1.3 Configurar Sistema de Temas**
```typescript
// Archivos a crear:
src/theme/
├── colors.ts                        // Paleta de colores
├── typography.ts                    // Tipografías
├── spacing.ts                       // Espaciado
├── shadows.ts                       // Sombras
└── index.ts                         // Exportaciones
```

#### **1.4 Crear Componentes UI Básicos**
```typescript
// Archivos a crear:
src/components/ui/
├── Button.tsx                       // Botones
├── Input.tsx                        // Campos de entrada
├── Card.tsx                         // Tarjetas
├── Modal.tsx                        // Modales
├── Loading.tsx                      // Indicadores de carga
└── index.ts                         // Exportaciones
```

### **FASE 2: SISTEMA DE AUTENTICACIÓN (Semana 1)**

#### **2.1 Crear Pantallas de Autenticación**
```typescript
// Archivos a crear:
src/screens/auth/
├── LoginScreen.tsx                  // Pantalla de login
├── RegisterScreen.tsx               // Pantalla de registro
├── ForgotPasswordScreen.tsx         // Recuperar contraseña
└── WelcomeScreen.tsx                // Pantalla de bienvenida
```

#### **2.2 Crear Servicios de Autenticación**
```typescript
// Archivos a crear:
src/services/
├── authService.ts                   // Servicios de autenticación
├── apiService.ts                    // Cliente HTTP
└── storageService.ts                // Almacenamiento local
```

### **FASE 3: SISTEMA DE SOLICITUDES (Semana 2)**

#### **3.1 Crear Pantallas de Solicitudes**
```typescript
// Archivos a crear:
src/screens/requests/
├── CreateRequestScreen.tsx          // Crear solicitud
├── RequestDetailScreen.tsx          // Detalle de solicitud
├── AvailableRequestsScreen.tsx      // Solicitudes disponibles
├── MyRequestsScreen.tsx             // Mis solicitudes
└── RequestStatusScreen.tsx          // Estados
```

#### **3.2 Crear Componentes de Solicitudes**
```typescript
// Archivos a crear:
src/components/requests/
├── RequestCard.tsx                  // Tarjeta de solicitud
├── RequestForm.tsx                  // Formulario
├── RequestFilters.tsx               // Filtros
└── RequestActions.tsx               // Acciones
```

### **FASE 4: SISTEMA DE PAGOS (Semana 3)**

#### **4.1 Crear Pantallas de Pagos**
```typescript
// Archivos a crear:
src/screens/payments/
├── BalanceScreen.tsx                // Balance
├── DepositScreen.tsx                // Hacer depósito
├── TransactionHistoryScreen.tsx     // Historial
└── BankAccountsScreen.tsx           // Cuentas bancarias
```

---

## 🎨 **PALETA DE COLORES OBLIGATORIA**

```typescript
// Colores principales (OBLIGATORIOS)
primary: '#014aad'      // Azul principal
secondary: '#5ebeee'    // Azul claro
accent: '#ff8c8c'       // Rojo suave
success: '#a2d6b0'      // Verde suave
text: '#000000'         // Negro
textSecondary: '#757575' // Gris
background: '#18375d'   // Azul oscuro
```

---

## 📁 **ESTRUCTURA DE CARPETAS OBJETIVO**

```
src/
├── app/
│   └── App.tsx                      // ✅ Ya existe (básico)
├── navigation/                      // ❌ Crear
├── screens/                         // ❌ Crear
│   ├── auth/                        // ❌ Crear
│   ├── requests/                    // ❌ Crear
│   ├── payments/                    // ❌ Crear
│   └── profile/                     // ❌ Crear
├── components/                      // ❌ Crear
│   ├── ui/                          // ❌ Crear
│   └── requests/                    // ❌ Crear
├── store/                           // ❌ Crear
├── services/                        // ❌ Crear
├── theme/                           // ❌ Crear
├── utils/                           // ❌ Crear
└── types/                           // ❌ Crear
```

---

## 🚀 **COMANDOS DE DESARROLLO**

```bash
# Verificar tipos
npm run typecheck

# Iniciar desarrollo
npm start

# Construir para producción
npm run build

# Ejecutar tests
npm test
```

---

## 📋 **CHECKLIST DE IMPLEMENTACIÓN**

### **FASE 1: Infraestructura**
- [ ] Configurar navegación
- [ ] Configurar Redux store
- [ ] Crear sistema de temas
- [ ] Crear componentes UI básicos

### **FASE 2: Autenticación**
- [ ] Crear pantallas de auth
- [ ] Implementar servicios de auth
- [ ] Configurar persistencia
- [ ] Implementar navegación protegida

### **FASE 3: Solicitudes**
- [ ] Crear pantallas de solicitudes
- [ ] Implementar formularios
- [ ] Crear componentes de solicitudes
- [ ] Integrar con API

### **FASE 4: Pagos**
- [ ] Crear pantallas de pagos
- [ ] Implementar subida de archivos
- [ ] Crear historial de transacciones
- [ ] Integrar con backend

---

## 🎯 **PRÓXIMOS PASOS INMEDIATOS**

1. **Configurar navegación básica**
2. **Crear sistema de temas con la paleta de colores**
3. **Implementar pantallas de autenticación**
4. **Crear componentes UI reutilizables**

---

**¡El proyecto está listo para empezar desde cero con una base limpia!** 🎉 