# Configuración e Instalación

## Descripción General
Guía completa para configurar y ejecutar el proyecto APP_MussikOn tanto en el frontend (React Native + Expo) como en el backend (Node.js + Express).

## Estado de Implementación
**100% Implementado** ✅

## Requisitos Previos

### Software Necesario
- **Node.js**: Versión 18.0.0 o superior
- **npm**: Versión 9.0.0 o superior
- **Git**: Para clonar el repositorio
- **Expo CLI**: Para desarrollo móvil

### Herramientas de Desarrollo
- **VS Code**: Editor recomendado
- **Postman**: Para probar APIs
- **Firebase Console**: Para configuración de Firebase
- **Android Studio**: Para emulador Android (opcional)
- **Xcode**: Para simulador iOS (solo macOS)

### Cuentas de Servicios
- **Firebase**: Proyecto configurado
- **Google Maps**: API key para mapas
- **Expo**: Cuenta para desarrollo

## Instalación del Proyecto

### 1. Clonar el Repositorio
```bash
# Clonar el repositorio principal
git clone https://github.com/username/APP_MussikOn.git
cd APP_MussikOn

# Clonar el backend
cd ..
git clone https://github.com/username/app_mussikon_express.git
```

### 2. Instalar Dependencias Frontend
```bash
# Navegar al directorio del frontend
cd APP_MussikOn

# Instalar dependencias
npm install

# Instalar Expo CLI globalmente (si no está instalado)
npm install -g @expo/cli
```

### 3. Instalar Dependencias Backend
```bash
# Navegar al directorio del backend
cd ../app_mussikon_express

# Instalar dependencias
npm install

# Instalar dependencias de desarrollo
npm install --save-dev
```

## Configuración del Entorno

### 1. Variables de Entorno Frontend
Crear archivo `.env` en la raíz del frontend:
```bash
# Firebase Configuration
EXPO_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id

# Google Maps
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# API Configuration
EXPO_PUBLIC_API_BASE_URL=http://localhost:3000/api
EXPO_PUBLIC_SOCKET_URL=http://localhost:3000

# Expo Configuration
EXPO_PUBLIC_EXPO_PROJECT_ID=your_expo_project_id
```

### 2. Variables de Entorno Backend
Crear archivo `.env` en la raíz del backend:
```bash
# Server Configuration
PORT=3000
NODE_ENV=development

# Firebase Configuration
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=your_client_email

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=24h

# Database Configuration
FIRESTORE_PROJECT_ID=your_project_id

# External Services
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_email_password
```

### 3. Configuración de Firebase
1. Ir a [Firebase Console](https://console.firebase.google.com/)
2. Crear nuevo proyecto o seleccionar existente
3. Habilitar Authentication, Firestore y Storage
4. Descargar archivo de configuración `google-services.json`
5. Configurar reglas de Firestore y Storage

### 4. Configuración de Google Maps
1. Ir a [Google Cloud Console](https://console.cloud.google.com/)
2. Habilitar Maps JavaScript API
3. Crear credenciales (API Key)
4. Restringir API key por dominio/IP

## Configuración de la Base de Datos

### 1. Firestore Rules
Configurar archivo `firestore.rules`:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Reglas de seguridad para usuarios
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow read: if request.auth != null;
    }
    
    // Reglas para solicitudes de músicos
    match /musicianRequests/{requestId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
        (resource.data.userId == request.auth.uid || 
         resource.data.assignedMusicianId == request.auth.uid);
    }
  }
}
```

### 2. Firestore Indexes
Configurar archivo `firestore.indexes.json`:
```json
{
  "indexes": [
    {
      "collectionGroup": "musicianRequests",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "status", "order": "ASCENDING" },
        { "fieldPath": "date", "order": "DESCENDING" }
      ]
    }
  ]
}
```

## Configuración de Expo

### 1. app.config.js
```javascript
export default {
  expo: {
    name: "APP_MussikOn",
    slug: "app-mussikon",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "automatic",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.yourcompany.appmussikon"
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#FFFFFF"
      },
      package: "com.yourcompany.appmussikon"
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    plugins: [
      "expo-router",
      [
        "expo-location",
        {
          locationAlwaysAndWhenInUsePermission: "Allow $(PRODUCT_NAME) to use your location."
        }
      ]
    ]
  }
};
```

### 2. Configuración de Notificaciones
```javascript
// En app.config.js
plugins: [
  [
    "expo-notifications",
    {
      icon: "./assets/notification-icon.png",
      color: "#ffffff",
      sounds: ["./assets/notification-sound.wav"]
    }
  ]
]
```

## Ejecución del Proyecto

### 1. Iniciar Backend
```bash
# Navegar al directorio del backend
cd app_mussikon_express

# Ejecutar en modo desarrollo
npm run dev

# O ejecutar directamente
node dist/index.js
```

### 2. Iniciar Frontend
```bash
# Navegar al directorio del frontend
cd APP_MussikOn

# Iniciar Expo
npx expo start

# O usar el script de package.json
npm start
```

### 3. Ejecutar en Dispositivo
```bash
# Escanear QR code con Expo Go app
# O ejecutar en emulador
npx expo run:android
npx expo run:ios
```

## Scripts Disponibles

### Frontend (package.json)
```json
{
  "scripts": {
    "start": "expo start",
    "android": "expo run:android",
    "ios": "expo run:ios",
    "web": "expo start --web",
    "build:android": "eas build --platform android",
    "build:ios": "eas build --platform ios",
    "test": "jest",
    "test:watch": "jest --watch",
    "lint": "eslint . --ext .ts,.tsx",
    "lint:fix": "eslint . --ext .ts,.tsx --fix",
    "type-check": "tsc --noEmit"
  }
}
```

### Backend (package.json)
```json
{
  "scripts": {
    "start": "node dist/index.js",
    "dev": "nodemon src/index.ts",
    "build": "tsc",
    "test": "jest",
    "test:watch": "jest --watch",
    "lint": "eslint src/**/*.ts",
    "lint:fix": "eslint src/**/*.ts --fix"
  }
}
```

## Configuración de Desarrollo

### 1. ESLint y Prettier
```json
// .eslintrc.js
module.exports = {
  extends: [
    '@react-native',
    '@typescript-eslint/recommended'
  ],
  rules: {
    // Reglas personalizadas
  }
};

// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2
}
```

### 2. TypeScript
```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "es2020",
    "lib": ["es2020"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

## Configuración de Testing

### 1. Jest Configuration
```javascript
// jest.config.js
module.exports = {
  preset: 'react-native',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|expo|@expo|@react-navigation)/)'
  ],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{ts,tsx}'
  ]
};
```

### 2. Testing Library
```bash
npm install --save-dev @testing-library/react-native @testing-library/jest-native
```

## Configuración de CI/CD

### 1. GitHub Actions
```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run lint
      - run: npm run test
      - run: npm run type-check
```

### 2. EAS Build
```json
// eas.json
{
  "cli": {
    "version": ">= 3.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {}
  }
}
```

## Solución de Problemas

### Problemas Comunes

#### 1. Error de Metro Bundler
```bash
# Limpiar cache de Metro
npx expo start --clear
```

#### 2. Error de Dependencias
```bash
# Limpiar node_modules y reinstalar
rm -rf node_modules package-lock.json
npm install
```

#### 3. Error de Firebase
- Verificar configuración en `.env`
- Verificar reglas de Firestore
- Verificar permisos de API

#### 4. Error de Google Maps
- Verificar API key en `.env`
- Verificar restricciones de API key
- Verificar facturación habilitada

### Logs y Debugging
```bash
# Frontend - Logs de Expo
npx expo start --dev-client

# Backend - Logs detallados
DEBUG=* npm run dev

# Ver logs de Firebase
firebase functions:log
```

## Recursos Adicionales

### Documentación Oficial
- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Node.js Documentation](https://nodejs.org/docs/)

### Comunidad y Soporte
- [Expo Discord](https://discord.gg/expo)
- [React Native Community](https://github.com/react-native-community)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/react-native)

### Herramientas Útiles
- [React Native Debugger](https://github.com/jhen0409/react-native-debugger)
- [Flipper](https://fbflipper.com/)
- [Reactotron](https://github.com/infinitered/reactotron)
