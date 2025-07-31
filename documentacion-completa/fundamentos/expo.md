# 🚀 ¿Qué es Expo?

## 🤔 ¿Qué es Expo?

**Expo** es una plataforma que hace que desarrollar aplicaciones móviles con React Native sea **mucho más fácil**. Es como tener un "kit de herramientas" completo para crear apps.

## 🎯 ¿Por qué Expo?

### Sin Expo (React Native Puro):
```
Instalar Xcode (solo Mac) → Configurar Android Studio → 
Instalar dependencias nativas → Configurar cada librería → 
Compilar para cada plataforma
```

### Con Expo:
```
npx create-expo-app MiApp → npm start → ¡Listo!
```

## 🧠 Analogía Simple

Imagina que quieres cocinar:

### Sin Expo (React Native Puro):
- Necesitas comprar todos los ingredientes por separado
- Tienes que aprender a usar cada herramienta de cocina
- Debes configurar la cocina desde cero
- Cada receta requiere ingredientes específicos

### Con Expo:
- Te dan un "kit de cocina" completo
- Todos los ingredientes básicos están incluidos
- Las herramientas ya están configuradas
- Puedes empezar a cocinar inmediatamente

## 🏗️ ¿Qué Incluye Expo?

### 1. **SDK (Software Development Kit)**
```javascript
// Funciones listas para usar
import { Camera } from 'expo-camera';
import { Location } from 'expo-location';
import { ImagePicker } from 'expo-image-picker';
```

### 2. **Herramientas de Desarrollo**
- **Expo CLI**: Comandos para crear y gestionar proyectos
- **Expo Go**: App para probar tu aplicación en el teléfono
- **Expo DevTools**: Herramientas de debugging

### 3. **Servicios en la Nube**
- **Expo Build**: Compilar apps sin configurar nada
- **Expo Updates**: Actualizar apps sin pasar por las stores
- **Expo Notifications**: Sistema de notificaciones

## 📱 Expo Go - Tu Teléfono como Simulador

### ¿Qué es Expo Go?
Es una aplicación que puedes descargar en tu teléfono para probar aplicaciones Expo sin necesidad de compilarlas.

### ¿Cómo funciona?
1. **Desarrollas** en tu computadora
2. **Escaneas** un código QR con Expo Go
3. **Tu app** se ejecuta en tu teléfono real

### Ventajas:
- **Pruebas reales**: En tu teléfono de verdad
- **Sin compilación**: Cambios instantáneos
- **Múltiples dispositivos**: Prueba en varios teléfonos

## 🔧 Configuración de Expo en MussikOn

### 1. **app.json** (Configuración principal)
```json
{
  "expo": {
    "name": "MussikOn",
    "slug": "MussikOn",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/3.png",
    "userInterfaceStyle": "dark",
    "splash": {
      "image": "./assets/3.png",
      "resizeMode": "contain",
      "backgroundColor": "#f1f1f1"
    },
    "ios": {
      "supportsTablet": true
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/4.png",
        "backgroundColor": "#f1f1f1"
      },
      "package": "com.musikOn"
    }
  }
}
```

### 2. **package.json** (Dependencias)
```json
{
  "dependencies": {
    "expo": "~53.0.0",
    "expo-av": "^15.1.7",
    "expo-blur": "^14.1.5",
    "expo-haptics": "^14.1.4",
    "expo-image-picker": "^16.1.4",
    "expo-linear-gradient": "~14.1.5",
    "expo-location": "^18.1.6",
    "expo-secure-store": "~14.2.3"
  }
}
```

## 📦 Librerías de Expo que usa MussikOn

### 1. **expo-linear-gradient**
```javascript
// Para crear gradientes (colores que se mezclan)
import { LinearGradient } from 'expo-linear-gradient';

<LinearGradient
  colors={['#014aad', '#00334d']}
  style={styles.gradient}
>
  <Text>Texto con fondo degradado</Text>
</LinearGradient>
```

### 2. **expo-blur**
```javascript
// Para crear efectos de desenfoque
import { BlurView } from 'expo-blur';

<BlurView intensity={20} style={styles.blur}>
  <Text>Texto sobre fondo desenfocado</Text>
</BlurView>
```

### 3. **expo-location**
```javascript
// Para obtener la ubicación del usuario
import * as Location from 'expo-location';

const getLocation = async () => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status === 'granted') {
    const location = await Location.getCurrentPositionAsync({});
    console.log(location);
  }
};
```

### 4. **expo-image-picker**
```javascript
// Para seleccionar imágenes de la galería
import * as ImagePicker from 'expo-image-picker';

const pickImage = async () => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
  });
};
```

### 5. **expo-secure-store**
```javascript
// Para guardar información sensible (tokens, contraseñas)
import * as SecureStore from 'expo-secure-store';

// Guardar token
await SecureStore.setItemAsync('token', 'mi-token-secreto');

// Obtener token
const token = await SecureStore.getItemAsync('token');
```

## 🎨 Expo Vector Icons

### ¿Qué son?
Iconos vectoriales que se ven bien en cualquier tamaño.

### Uso en MussikOn:
```javascript
import { Ionicons } from '@expo/vector-icons';

<Ionicons name="musical-notes" size={60} color="#014aad" />
<Ionicons name="menu" size={24} color="#000000" />
<Ionicons name="arrow-back" size={24} color="#000000" />
```

## 🔄 Comandos de Expo

### 1. **Crear un proyecto**
```bash
npx create-expo-app MiApp
```

### 2. **Iniciar el servidor de desarrollo**
```bash
npm start
# o
expo start
```

### 3. **Ejecutar en dispositivo**
```bash
# Android
expo run:android

# iOS
expo run:ios

# Web
expo start --web
```

### 4. **Construir para producción**
```bash
# Android
eas build --platform android

# iOS
eas build --platform ios
```

## 📱 Expo Development Build

### ¿Qué es?
Una versión de tu app que incluye todas las librerías nativas pero mantiene las ventajas de desarrollo de Expo.

### Ventajas:
- **Librerías nativas**: Puedes usar cualquier librería
- **Desarrollo rápido**: Cambios instantáneos
- **Debugging**: Herramientas de desarrollo incluidas

### Configuración en MussikOn:
```json
// app.json
{
  "expo": {
    "plugins": [
      "expo-secure-store"
    ]
  }
}
```

## 🌐 Expo Updates

### ¿Qué es?
Sistema para actualizar tu app sin pasar por las stores de aplicaciones.

### ¿Cómo funciona?
1. **Desarrollas** cambios en tu app
2. **Publicas** una actualización
3. **Los usuarios** reciben la actualización automáticamente

### Limitaciones:
- **No cambios nativos**: Solo JavaScript/TypeScript
- **Tamaño limitado**: Máximo 50MB
- **Aprobación**: Algunas stores requieren aprobación

## 🔧 Configuración de EAS (Expo Application Services)

### ¿Qué es EAS?
Servicios de Expo para construir, publicar y gestionar apps.

### EAS Build:
```json
// eas.json
{
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

### EAS Submit:
```bash
# Enviar a Google Play Store
eas submit --platform android

# Enviar a App Store
eas submit --platform ios
```

## 🎯 Ventajas de Expo

### ✅ **Pros:**
1. **Configuración rápida**: Empiezas a programar inmediatamente
2. **Herramientas incluidas**: Todo lo que necesitas está ahí
3. **Comunidad activa**: Mucha ayuda disponible
4. **Actualizaciones OTA**: Sin pasar por stores
5. **Debugging fácil**: Herramientas integradas
6. **Múltiples plataformas**: iOS, Android, Web

### ❌ **Contras:**
1. **Tamaño de app**: Un poco más grande
2. **Limitaciones**: No todas las librerías nativas
3. **Dependencia**: Estás atado a Expo
4. **Costos**: Algunos servicios son de pago

## 📱 Flujo de Desarrollo con Expo

### 1. **Desarrollo Local**
```bash
npm start
# Escanea QR con Expo Go
# Desarrolla en tu teléfono
```

### 2. **Testing**
```bash
expo run:android
expo run:ios
# Prueba en simuladores
```

### 3. **Build de Desarrollo**
```bash
eas build --profile development
# Instala en tu teléfono
```

### 4. **Build de Producción**
```bash
eas build --profile production
# Sube a las stores
```

## 🔄 Ciclo de Vida de una App Expo

### 1. **Desarrollo**
- Escribes código
- Pruebas con Expo Go
- Debugging en tiempo real

### 2. **Testing**
- Build de desarrollo
- Testing en dispositivos reales
- Corrección de bugs

### 3. **Producción**
- Build de producción
- Subida a stores
- Monitoreo de usuarios

### 4. **Mantenimiento**
- Actualizaciones OTA
- Nuevas versiones
- Mejoras continuas

## 🎯 Resumen

1. **Expo** = Kit de herramientas para React Native
2. **Expo Go** = App para probar en tu teléfono
3. **SDK** = Librerías listas para usar
4. **EAS** = Servicios para construir y publicar
5. **Updates** = Actualizaciones sin stores
6. **Configuración fácil** = Todo listo para usar

## ➡️ Siguiente Paso

Ahora que entiendes Expo, vamos a aprender sobre **TypeScript**, que es lo que hace que el código de MussikOn sea más seguro y fácil de mantener.

[¿Qué es TypeScript? →](./typescript.md) 