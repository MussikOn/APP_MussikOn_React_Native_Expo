# 🎓 ¿Qué es la Programación?

## 🤔 ¿Qué es la Programación?

Imagina que quieres que tu computadora o teléfono haga algo específico. Por ejemplo:
- Mostrar una imagen
- Calcular una suma
- Enviar un mensaje
- Abrir una aplicación

**La programación es el proceso de escribir instrucciones para que las computadoras hagan exactamente lo que queremos.**

## 🧠 Analogía Simple

Piensa en la programación como **dar instrucciones a un robot muy obediente pero muy literal**:

### Ejemplo de la Vida Real:
```
Tú: "Ve a la cocina y hazme un sándwich"
Robot: "¿Qué es una cocina? ¿Qué es un sándwich? ¿Dónde está la cocina?"
```

### En Programación:
```javascript
// Le decimos al robot exactamente qué hacer
function hacerSandwich() {
    irACocina();
    abrirRefrigerador();
    tomarPan();
    tomarJamon();
    cerrarRefrigerador();
    ponerJamonEnPan();
    return "Sándwich listo";
}
```

## 💻 ¿Qué es el Código?

El **código** son las instrucciones que escribimos para las computadoras. Es como un **idioma especial** que las computadoras entienden.

### Ejemplo Básico:
```javascript
// Esto es código JavaScript
let nombre = "Juan";
let edad = 25;
console.log("Hola " + nombre + ", tienes " + edad + " años");
```

**¿Qué hace este código?**
1. Crea una variable llamada `nombre` con el valor "Juan"
2. Crea una variable llamada `edad` con el valor 25
3. Muestra en pantalla: "Hola Juan, tienes 25 años"

## 🔤 ¿Qué son los Lenguajes de Programación?

Los **lenguajes de programación** son como idiomas que usamos para comunicarnos con las computadoras. Cada uno tiene sus propias reglas y palabras.

### Lenguajes que usa MussikOn:

1. **JavaScript/TypeScript**: El idioma principal
2. **JSX**: Para crear interfaces (como HTML pero para apps móviles)
3. **JSON**: Para organizar datos

## 📱 ¿Qué es una Aplicación Móvil?

Una **aplicación móvil** (o "app") es un programa que funciona en tu teléfono. Como:
- WhatsApp
- Instagram
- Spotify
- **MussikOn** (¡nuestra app!)

### ¿Cómo funciona una app?
```
Usuario toca botón → App detecta el toque → App hace algo → App muestra resultado
```

## 🎯 ¿Qué hace MussikOn?

MussikOn es una aplicación que conecta **dos tipos de personas**:

### 👥 Organizadores de Eventos
- Quieren contratar músicos para sus eventos
- Crean solicitudes: "Necesito un guitarrista para mi boda"
- Especifican: fecha, lugar, presupuesto, tipo de música

### 🎵 Músicos
- Buscan trabajo tocando música
- Ven las solicitudes disponibles
- Pueden aceptar o rechazar ofertas

## 🔄 ¿Cómo Funciona el Código de MussikOn?

### 1. **Interfaz de Usuario (UI)**
```javascript
// Esto crea un botón en la pantalla
<Button 
    title="Solicitar Músico" 
    onPress={() => crearSolicitud()} 
/>
```

### 2. **Lógica de Negocio**
```javascript
// Esto maneja cuando alguien solicita un músico
function crearSolicitud() {
    // Validar datos
    // Guardar en base de datos
    // Enviar notificación a músicos
    // Mostrar confirmación
}
```

### 3. **Comunicación con Servidor**
```javascript
// Esto envía datos al servidor
api.post('/solicitudes', {
    evento: "Boda de María",
    instrumento: "Guitarra",
    fecha: "2024-06-15",
    presupuesto: 500
});
```

## 🧩 Conceptos Básicos que Verás en el Código

### Variables
```javascript
let nombre = "María";        // Almacena texto
let edad = 25;              // Almacena números
let esMusico = true;        // Almacena verdadero/falso
```

### Funciones
```javascript
function saludar(nombre) {
    return "Hola " + nombre;
}
// Uso: saludar("Juan") → "Hola Juan"
```

### Condiciones
```javascript
if (edad >= 18) {
    console.log("Eres mayor de edad");
} else {
    console.log("Eres menor de edad");
}
```

### Listas (Arrays)
```javascript
let instrumentos = ["Guitarra", "Piano", "Batería"];
// Acceder: instrumentos[0] → "Guitarra"
```

## 🎨 ¿Qué es la Interfaz de Usuario (UI)?

La **UI** es todo lo que ves en la pantalla:
- Botones
- Textos
- Imágenes
- Formularios
- Menús

### Ejemplo en MussikOn:
```javascript
// Esto crea una pantalla de login
<View>
    <Text>Iniciar Sesión</Text>
    <TextInput placeholder="Email" />
    <TextInput placeholder="Contraseña" />
    <Button title="Entrar" />
</View>
```

## 🔄 ¿Qué es el Estado?

El **estado** es la información que la app recuerda mientras está funcionando:

### Ejemplo:
```javascript
// Estado del usuario
let usuario = {
    nombre: "Juan",
    email: "juan@email.com",
    esMusico: true,
    estaConectado: false
};
```

## 🌐 ¿Qué es el Backend?

El **backend** es como el "cerebro" de la aplicación que:
- Guarda información en bases de datos
- Maneja la lógica de negocio
- Envía notificaciones
- Valida datos

## 📊 ¿Qué es una Base de Datos?

Una **base de datos** es como un archivo gigante donde guardamos información:

### Ejemplo de datos en MussikOn:
```
Usuarios:
- Juan (organizador)
- María (músico)
- Pedro (músico)

Solicitudes:
- Boda de Ana (guitarrista, $300)
- Cumpleaños de Carlos (pianista, $200)
```

## 🚀 ¿Por qué TypeScript?

**TypeScript** es como JavaScript pero más seguro. Te ayuda a evitar errores:

### JavaScript (puede fallar):
```javascript
function sumar(a, b) {
    return a + b;
}
sumar("2", 3); // Resultado: "23" (incorrecto)
```

### TypeScript (más seguro):
```typescript
function sumar(a: number, b: number): number {
    return a + b;
}
sumar("2", 3); // ❌ Error: "2" no es un número
```

## 🎯 Resumen

1. **Programación** = Dar instrucciones a computadoras
2. **Código** = Las instrucciones escritas
3. **App móvil** = Programa para teléfonos
4. **UI** = Lo que ves en pantalla
5. **Estado** = Información que la app recuerda
6. **Backend** = El "cerebro" de la app
7. **Base de datos** = Donde se guarda la información

## ➡️ Siguiente Paso

Ahora que entiendes qué es la programación, vamos a aprender sobre **React Native**, la tecnología principal que usa MussikOn.

[¿Qué es React Native? →](./react-native.md) 