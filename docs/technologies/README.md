# 📚 Índice y Guía de Tecnologías, Componentes y Utilidades

## 🗺️ Diagrama Visual de la Arquitectura y Tecnologías

```mermaid
flowchart TD
  A[Etiquetas y Componentes Nativos] -->|Usados en UI| B[Componentes Personalizados]
  B -->|Composición| C[Animaciones y Efectos]
  B -->|Composición| D[Almacenamiento y Seguridad]
  B -->|Composición| E[HTTP y APIs]
  B -->|Composición| F[Mapas y Geolocalización]
  B -->|Composición| G[Audio y Video]
  B -->|Composición| H[Sockets y Tiempo Real]
  B -->|Composición| I[Iconografía]
  D -->|Tokens| J[Autenticación]
  E -->|Peticiones| K[Axios / Instancia API]
  F -->|Ubicación| L[expo-location / MapView]
  G -->|Media| M[expo-av]
  H -->|Comunicación| N[Socket.io-client]
  I -->|Visual| O[Ionicons / MaterialCommunityIcons]
  D -->|Persistencia| P[AsyncStorage / SecureStore]
  C -->|Animaciones| Q[Animated / Easing / Blur / LinearGradient]
  B -->|Utiliza| A
  B -->|Utiliza| P
  B -->|Utiliza| Q
  B -->|Utiliza| O
  B -->|Utiliza| K
  B -->|Utiliza| L
  B -->|Utiliza| M
  B -->|Utiliza| N
  subgraph Node.js
    R[path / fs / process / os / crypto]
  end
  B -->|Scripts / Backend| R
  style A fill:#e3e3e3,stroke:#333,stroke-width:2px
  style B fill:#c6e2ff,stroke:#333,stroke-width:2px
  style C fill:#ffe4b5,stroke:#333,stroke-width:2px
  style D fill:#ffe4e1,stroke:#333,stroke-width:2px
  style E fill:#e0ffe0,stroke:#333,stroke-width:2px
  style F fill:#e0ffff,stroke:#333,stroke-width:2px
  style G fill:#f0e68c,stroke:#333,stroke-width:2px
  style H fill:#f5e6ff,stroke:#333,stroke-width:2px
  style I fill:#f0f8ff,stroke:#333,stroke-width:2px
  style J fill:#f8d7da,stroke:#333,stroke-width:2px
  style K fill:#d1ffd1,stroke:#333,stroke-width:2px
  style L fill:#d1f0ff,stroke:#333,stroke-width:2px
  style M fill:#fffacd,stroke:#333,stroke-width:2px
  style N fill:#e6ccff,stroke:#333,stroke-width:2px
  style O fill:#f0f8ff,stroke:#333,stroke-width:2px
  style P fill:#f5f5dc,stroke:#333,stroke-width:2px
  style Q fill:#ffe4b5,stroke:#333,stroke-width:2px
  style R fill:#d3d3d3,stroke:#333,stroke-width:2px
```

---

Este documento es el índice central y guía de navegación para toda la documentación técnica de etiquetas, componentes, APIs, funciones nativas y utilitarias usadas en el proyecto.

---

## 🏷️ **Etiquetas y Componentes Nativos de React Native**
- [Text](./tags/Text.md)
- [View](./tags/View.md)
- [TouchableOpacity](./tags/TouchableOpacity.md)
- [Pressable](./tags/Pressable.md)
- [ScrollView](./tags/ScrollView.md)
- [FlatList](./tags/FlatList.md)
- [SectionList](./tags/SectionList.md)
- [TextInput](./tags/TextInput.md)
- [KeyboardAvoidingView](./tags/KeyboardAvoidingView.md)
- [Modal](./tags/Modal.md)
- [Image](./tags/Image.md)
- [ActivityIndicator](./tags/ActivityIndicator.md)
- [StatusBar](./tags/StatusBar.md)
- [Platform](./tags/Platform.md)

## 🎨 **Componentes Personalizados del Proyecto**
- [Button](./tags/Button.md)
- [Card](./tags/Card.md)
- [FAB (Floating Action Button)](./tags/FAB.md)
- [SlideButton](./tags/SlideButton.md)
- [Input](./tags/Input.md)
- [Header](./tags/Header.md)
- [LoadingSpinner](./tags/LoadingSpinner.md)
- [LoadingModal](./tags/LoadingModal.md)
- [LanguageSelector](./tags/LanguageSelector.md)
- [UserList](./tags/UserList.md)
- [BottomNavigation](./tags/BottomNavigation.md)
- [BottomMenu](./tags/BottomMenu.md)
- [AnimatedBackground](./tags/AnimatedBackground.md)
- [AlertModal](./tags/AlertModal.md)
- [Sidebar (MainSidebar)](./tags/Sidebar.md)
- [DateTimePicker/DateTimeSelector](./tags/DateTimePicker.md)

## 🗺️ **Componentes de Mapas y Geolocalización**
- [MapView (react-native-maps)](./tags/MapView.md)
- [expo-location](./tags/ExpoLocation.md)

## 🖼️ **Imágenes, Gradientes y Efectos Visuales**
- [expo-linear-gradient](./tags/ExpoLinearGradient.md)
- [expo-blur](./tags/ExpoBlur.md)
- [expo-image-picker](./tags/ExpoImagePicker.md)

## 🔊 **Audio y Video**
- [expo-av](./tags/ExpoAV.md)

## 💬 **Sockets y Comunicación en Tiempo Real**
- [Socket.io-client](./tags/Socket.md)
- [useSocket (hook personalizado)](../hooks/useSocket.tsx)

## 🛠️ **Animaciones y Easing**
- [Animated.View y Animated.Text](./tags/Animated.md)
- [Animated.spring](./tags/AnimatedSpring.md)
- [Animated.timing](./tags/AnimatedTiming.md)
- [Easing](./tags/Easing.md)

## 🗄️ **Almacenamiento y Seguridad**
- [AsyncStorage](./tags/AsyncStorage.md)
- [SecureStore](./tags/SecureStore.md)

## 🔑 **Autenticación y Tokens**
- [jwt-decode](./tags/jwtDecode.md)

## 🌐 **HTTP y APIs**
- [Axios](./tags/Axios.md)
- [Instancia personalizada de Axios (api)](./tags/axiosInstance.md)

## 🎵 **Iconografía**
- [Ionicons](./tags/Ionicons.md)
- [MaterialCommunityIcons](./tags/MaterialCommunityIcons.md)

## ⚙️ **Node.js: Funciones y Módulos Nativos**
- [path](./tags/NodePath.md)
- [fs](./tags/NodeFs.md)
- [process](./tags/NodeProcess.md)
- [os](./tags/NodeOs.md)
- [crypto](./tags/NodeCrypto.md)

---

### 📝 **Cómo Navegar esta Documentación**
- Cada archivo explica: **origen**, **qué hace**, **cómo se usa** (con ejemplos), **ejemplo real** y **por qué se eligió**.
- Los componentes personalizados están agrupados por funcionalidad para facilitar la búsqueda.
- Los módulos nativos de Node.js están al final para referencia de backend/scripts.
- Si buscas una función utilitaria propia, revisa la documentación de cada componente o servicio relacionado.

---

**¿Buscas algo específico?**
- Usa la búsqueda de tu editor o el índice de este archivo.
- Si tienes dudas sobre la integración de varias tecnologías, revisa los ejemplos de uso real en cada archivo.

---

**Última actualización:** Diciembre 2024

**Mantenedor:** Equipo de Desarrollo MussikOn 