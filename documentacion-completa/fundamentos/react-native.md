# 📱 ¿Qué es React Native?

## 🤔 ¿Qué es React Native?

**React Native** es una tecnología creada por Facebook que nos permite crear **aplicaciones móviles** usando **JavaScript** (el mismo lenguaje que usan las páginas web).

## 🎯 ¿Por qué React Native?

### El Problema Antiguo:
Antes, para crear una app móvil necesitabas:
- **Para iPhone**: Programar en Swift/Objective-C
- **Para Android**: Programar en Java/Kotlin
- **Resultado**: Dos apps completamente diferentes

### La Solución de React Native:
```
Un solo código → Funciona en iPhone Y Android
```

## 🧠 Analogía Simple

Imagina que quieres construir una casa:

### Método Antiguo:
- **Casa en Estados Unidos**: Construir con madera
- **Casa en México**: Construir con ladrillos
- **Resultado**: Dos casas completamente diferentes

### Método React Native:
- **Un solo plano**: Usar el mismo diseño
- **Materiales adaptables**: Se adapta al lugar
- **Resultado**: La misma casa en ambos lugares

## 🔄 ¿Cómo Funciona React Native?

### 1. **Escribes Código JavaScript**
```javascript
// Tu código
<View>
    <Text>Hola Mundo</Text>
    <Button title="Presionar" />
</View>
```

### 2. **React Native lo Convierte**
```javascript
// Para iPhone (iOS)
UIView *view = [[UIView alloc] init];
UILabel *label = [[UILabel alloc] init];
label.text = @"Hola Mundo";
```

```java
// Para Android
LinearLayout layout = new LinearLayout(context);
TextView text = new TextView(context);
text.setText("Hola Mundo");
```

### 3. **Resultado Final**
- **iPhone**: Ve botones nativos de iPhone
- **Android**: Ve botones nativos de Android
- **Mismo código**: Funciona en ambos

## 🏗️ Arquitectura de React Native

```
┌─────────────────┐
│   Tu Código     │ ← JavaScript/TypeScript
│   React Native  │
├─────────────────┤
│   Bridge        │ ← Traductor
├─────────────────┤
│   iOS Native    │ ← Código nativo iPhone
│   Android Native│ ← Código nativo Android
└─────────────────┘
```

## 📱 Componentes Básicos de React Native

### 1. **View** (Contenedor)
```javascript
// Como un div en HTML
<View style={{backgroundColor: 'blue', padding: 20}}>
    <Text>Contenido aquí</Text>
</View>
```

### 2. **Text** (Texto)
```javascript
// Para mostrar texto
<Text style={{fontSize: 18, color: 'black'}}>
    Hola Mundo
</Text>
```

### 3. **Button** (Botón)
```javascript
// Botón que se puede presionar
<Button 
    title="Presionar" 
    onPress={() => console.log('¡Presionado!')} 
/>
```

### 4. **TextInput** (Campo de texto)
```javascript
// Para que el usuario escriba
<TextInput 
    placeholder="Escribe aquí"
    onChangeText={(text) => console.log(text)}
/>
```

### 5. **Image** (Imagen)
```javascript
// Para mostrar imágenes
<Image 
    source={{uri: 'https://ejemplo.com/imagen.jpg'}}
    style={{width: 100, height: 100}}
/>
```

## 🎨 Estilos en React Native

### CSS vs React Native:
```css
/* CSS (web) */
.button {
    background-color: blue;
    padding: 10px;
    border-radius: 5px;
}
```

```javascript
// React Native
const styles = StyleSheet.create({
    button: {
        backgroundColor: 'blue',
        padding: 10,
        borderRadius: 5,
    }
});
```

### Diferencias Importantes:
- **CSS**: `background-color`
- **React Native**: `backgroundColor`
- **CSS**: `padding: 10px`
- **React Native**: `padding: 10`

## 🔄 Estados y Props

### Estado (State)
```javascript
// Información que puede cambiar
const [contador, setContador] = useState(0);

return (
    <View>
        <Text>Contador: {contador}</Text>
        <Button 
            title="Incrementar" 
            onPress={() => setContador(contador + 1)} 
        />
    </View>
);
```

### Props (Propiedades)
```javascript
// Información que se pasa de padre a hijo
function Saludo({nombre, edad}) {
    return (
        <Text>Hola {nombre}, tienes {edad} años</Text>
    );
}

// Uso
<Saludo nombre="Juan" edad={25} />
```

## 📱 Componentes en MussikOn

### 1. **Pantalla de Login**
```javascript
// src/screens/auth/Login.tsx
function Login() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Iniciar Sesión</Text>
            <TextInput placeholder="Email" />
            <TextInput placeholder="Contraseña" />
            <Button title="Entrar" onPress={handleLogin} />
        </View>
    );
}
```

### 2. **Botón Personalizado**
```javascript
// src/components/ui/Button.tsx
function Button({title, onPress, style}) {
    return (
        <TouchableOpacity onPress={onPress} style={[styles.button, style]}>
            <Text style={styles.buttonText}>{title}</Text>
        </TouchableOpacity>
    );
}
```

### 3. **Lista de Solicitudes**
```javascript
// src/screens/events/MyRequestsList.tsx
function MyRequestsList() {
    return (
        <FlatList
            data={solicitudes}
            renderItem={({item}) => (
                <View>
                    <Text>{item.eventName}</Text>
                    <Text>{item.instrument}</Text>
                </View>
            )}
        />
    );
}
```

## 🎯 Ventajas de React Native

### ✅ **Pros:**
1. **Un solo código**: Funciona en iPhone y Android
2. **Desarrollo rápido**: Menos tiempo de programación
3. **Comunidad grande**: Mucha ayuda disponible
4. **Actualizaciones**: Fácil de mantener
5. **Rendimiento**: Casi tan rápido como nativo

### ❌ **Contras:**
1. **Limitaciones**: No todo es posible
2. **Tamaño**: Apps un poco más grandes
3. **Dependencias**: Necesitas herramientas adicionales

## 🔧 Herramientas de React Native

### 1. **Metro Bundler**
- Empaqueta tu código JavaScript
- Lo prepara para ejecutarse en el teléfono

### 2. **React Native CLI**
- Herramientas de línea de comandos
- Para crear y gestionar proyectos

### 3. **Expo CLI** (Lo que usa MussikOn)
- Herramientas adicionales de Expo
- Más fácil de usar

## 📱 Ciclo de Vida de un Componente

```javascript
function MiComponente() {
    // 1. Se crea el componente
    useEffect(() => {
        console.log('Componente creado');
        
        // 3. Se limpia cuando se destruye
        return () => {
            console.log('Componente destruido');
        };
    }, []);

    // 2. Se renderiza (se muestra en pantalla)
    return (
        <View>
            <Text>Mi Componente</Text>
        </View>
    );
}
```

## 🎨 Navegación en React Native

### Stack Navigator (Navegación por pilas)
```javascript
// Como páginas de un libro
<Stack.Navigator>
    <Stack.Screen name="Login" component={Login} />
    <Stack.Screen name="Home" component={Home} />
    <Stack.Screen name="Profile" component={Profile} />
</Stack.Navigator>
```

### Tab Navigator (Navegación por pestañas)
```javascript
// Como pestañas en un navegador web
<Tab.Navigator>
    <Tab.Screen name="Home" component={Home} />
    <Tab.Screen name="Profile" component={Profile} />
    <Tab.Screen name="Settings" component={Settings} />
</Tab.Navigator>
```

## 🔄 Hooks en React Native

### useState (Estado)
```javascript
const [usuario, setUsuario] = useState(null);
const [cargando, setCargando] = useState(false);
```

### useEffect (Efectos)
```javascript
useEffect(() => {
    // Se ejecuta cuando el componente se monta
    cargarUsuario();
}, []); // Array vacío = solo al montar
```

### useCallback (Optimización)
```javascript
const handlePress = useCallback(() => {
    console.log('Botón presionado');
}, []); // Solo se recrea si las dependencias cambian
```

## 📱 Debugging en React Native

### 1. **Console.log**
```javascript
console.log('Valor de usuario:', usuario);
console.error('Error:', error);
```

### 2. **React Native Debugger**
- Herramienta visual para debuggear
- Como las herramientas de desarrollador del navegador

### 3. **Flipper**
- Herramienta de Facebook para debugging
- Inspeccionar red, base de datos, etc.

## 🎯 Resumen

1. **React Native** = Crear apps móviles con JavaScript
2. **Un código** = Funciona en iPhone y Android
3. **Componentes** = Bloques de construcción de la UI
4. **Estados** = Información que puede cambiar
5. **Props** = Información que se pasa entre componentes
6. **Hooks** = Funciones para manejar estado y efectos
7. **Navegación** = Mover entre pantallas

## ➡️ Siguiente Paso

Ahora que entiendes React Native, vamos a aprender sobre **Expo**, que es lo que usa MussikOn para hacer el desarrollo más fácil.

[¿Qué es Expo? →](./expo.md) 