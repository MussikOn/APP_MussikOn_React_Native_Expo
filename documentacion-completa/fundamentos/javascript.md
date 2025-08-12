# 🔤 ¿Qué es JavaScript?

## 🤔 ¿Qué es JavaScript?

**JavaScript** es el lenguaje de programación más popular del mundo. Es como el "idioma" que hablan las páginas web y las aplicaciones móviles para funcionar.

## 🎯 ¿Por qué JavaScript?

### Ventajas:
- **Fácil de aprender**: Sintaxis simple y clara
- **Muy popular**: Mucha documentación y ayuda disponible
- **Versátil**: Funciona en web, móvil, servidor, etc.
- **Dinámico**: No necesitas compilar, funciona inmediatamente

## 🧠 Analogía Simple

Imagina que JavaScript es como el **inglés** de las computadoras:

### Sin JavaScript:
- Las páginas web son como fotos estáticas
- No puedes interactuar con nada
- Es aburrido y limitado

### Con JavaScript:
- Las páginas web cobran vida
- Puedes hacer clic, escribir, mover cosas
- Es dinámico e interactivo

## 🔧 Conceptos Básicos de JavaScript

### 1. **Variables** - Almacenar Información
```javascript
// Diferentes formas de crear variables
let nombre = "Juan";           // Puede cambiar
const edad = 25;               // No puede cambiar
var ciudad = "Madrid";         // Forma antigua (no usar)

// Tipos de datos
let texto = "Hola mundo";      // String (texto)
let numero = 42;               // Number (número)
let esVerdadero = true;        // Boolean (verdadero/falso)
let lista = ["a", "b", "c"];  // Array (lista)
let objeto = {                 // Object (objeto)
    nombre: "Juan",
    edad: 25
};
```

### 2. **Funciones** - Bloques de Código Reutilizables
```javascript
// Función básica
function saludar(nombre) {
    return "Hola " + nombre;
}

// Función con arrow function (forma moderna)
const multiplicar = (a, b) => {
    return a * b;
};

// Función simple con arrow function
const sumar = (a, b) => a + b;

// Uso de funciones
console.log(saludar("María"));        // "Hola María"
console.log(multiplicar(5, 3));       // 15
console.log(sumar(10, 20));           // 30
```

### 3. **Condiciones** - Tomar Decisiones
```javascript
// if/else básico
let edad = 18;

if (edad >= 18) {
    console.log("Eres mayor de edad");
} else {
    console.log("Eres menor de edad");
}

// Operador ternario (forma corta)
let mensaje = edad >= 18 ? "Mayor" : "Menor";

// Múltiples condiciones
let nota = 85;

if (nota >= 90) {
    console.log("Excelente");
} else if (nota >= 80) {
    console.log("Muy bien");
} else if (nota >= 70) {
    console.log("Bien");
} else {
    console.log("Necesitas mejorar");
}
```

### 4. **Bucles** - Repetir Código
```javascript
// For loop (para)
for (let i = 0; i < 5; i++) {
    console.log("Número: " + i);
}

// While loop (mientras)
let contador = 0;
while (contador < 3) {
    console.log("Contador: " + contador);
    contador++;
}

// ForEach (para arrays)
let frutas = ["manzana", "banana", "naranja"];
frutas.forEach(fruta => {
    console.log("Fruta: " + fruta);
});
```

### 5. **Arrays** - Listas de Datos
```javascript
// Crear array
let instrumentos = ["Guitarra", "Piano", "Batería"];

// Acceder a elementos
console.log(instrumentos[0]);  // "Guitarra"
console.log(instrumentos[1]);  // "Piano"

// Agregar elementos
instrumentos.push("Saxofón");

// Remover elementos
instrumentos.pop();  // Remueve el último

// Encontrar elementos
let index = instrumentos.indexOf("Piano");  // 1

// Filtrar elementos
let instrumentosConA = instrumentos.filter(instrumento => 
    instrumento.includes("a")
);
```

### 6. **Objetos** - Datos Organizados
```javascript
// Crear objeto
let usuario = {
    nombre: "Juan",
    edad: 25,
    email: "juan@email.com",
    esMusico: true,
    instrumentos: ["Guitarra", "Piano"]
};

// Acceder a propiedades
console.log(usuario.nombre);           // "Juan"
console.log(usuario["edad"]);          // 25

// Agregar propiedades
usuario.ciudad = "Madrid";

// Remover propiedades
delete usuario.edad;

// Verificar si existe propiedad
if ("nombre" in usuario) {
    console.log("El usuario tiene nombre");
}
```

## 🔄 Funciones Modernas de JavaScript

### 1. **Arrow Functions**
```javascript
// Forma tradicional
function sumar(a, b) {
    return a + b;
}

// Arrow function
const sumar = (a, b) => a + b;

// Arrow function con múltiples líneas
const procesarUsuario = (usuario) => {
    const nombreCompleto = usuario.nombre + " " + usuario.apellido;
    const edad = 2024 - usuario.añoNacimiento;
    return { nombreCompleto, edad };
};
```

### 2. **Destructuring** - Extraer Datos
```javascript
// Destructuring de arrays
let colores = ["rojo", "verde", "azul"];
let [primero, segundo, tercero] = colores;
console.log(primero);  // "rojo"

// Destructuring de objetos
let persona = {
    nombre: "María",
    edad: 30,
    ciudad: "Barcelona"
};

let { nombre, edad } = persona;
console.log(nombre);  // "María"

// Destructuring en parámetros de función
const saludar = ({ nombre, edad }) => {
    return `Hola ${nombre}, tienes ${edad} años`;
};
```

### 3. **Spread Operator** - Expandir Datos
```javascript
// Expandir arrays
let frutas1 = ["manzana", "banana"];
let frutas2 = ["naranja", "pera"];
let todasLasFrutas = [...frutas1, ...frutas2];

// Expandir objetos
let usuario = {
    nombre: "Juan",
    edad: 25
};

let usuarioCompleto = {
    ...usuario,
    ciudad: "Madrid",
    email: "juan@email.com"
};
```

### 4. **Template Literals** - Strings Inteligentes
```javascript
// Forma tradicional
let nombre = "Juan";
let edad = 25;
let mensaje = "Hola " + nombre + ", tienes " + edad + " años";

// Template literals
let mensaje = `Hola ${nombre}, tienes ${edad} años`;

// Con expresiones
let precio = 100;
let descuento = 0.2;
let precioFinal = `Precio: $${precio * (1 - descuento)}`;
```

## 🔄 Programación Asíncrona

### 1. **Promesas** - Manejar Operaciones Futuras
```javascript
// Crear una promesa
const obtenerUsuario = (id) => {
    return new Promise((resolve, reject) => {
        // Simular llamada a API
        setTimeout(() => {
            if (id > 0) {
                resolve({ id, nombre: "Juan", email: "juan@email.com" });
            } else {
                reject("ID inválido");
            }
        }, 1000);
    });
};

// Usar promesa
obtenerUsuario(1)
    .then(usuario => {
        console.log("Usuario encontrado:", usuario);
    })
    .catch(error => {
        console.error("Error:", error);
    });
```

### 2. **Async/Await** - Forma Más Limpia
```javascript
// Función async
const cargarDatos = async () => {
    try {
        const usuario = await obtenerUsuario(1);
        console.log("Usuario:", usuario);
        
        const solicitudes = await obtenerSolicitudes(usuario.id);
        console.log("Solicitudes:", solicitudes);
    } catch (error) {
        console.error("Error:", error);
    }
};

// Llamar función async
cargarDatos();
```

## 🎯 JavaScript en React Native

### 1. **JSX** - JavaScript + XML
```javascript
// En React Native
import React from 'react';
import { View, Text, Button } from 'react-native';

function MiComponente() {
    const [contador, setContador] = React.useState(0);

    return (
        <View>
            <Text>Contador: {contador}</Text>
            <Button 
                title="Incrementar" 
                onPress={() => setContador(contador + 1)} 
            />
        </View>
    );
}
```

### 2. **Hooks** - Estado y Efectos
```javascript
import React, { useState, useEffect } from 'react';

function UsuarioComponent() {
    // Estado
    const [usuario, setUsuario] = useState(null);
    const [cargando, setCargando] = useState(true);

    // Efecto (se ejecuta cuando el componente se monta)
    useEffect(() => {
        cargarUsuario();
    }, []);

    const cargarUsuario = async () => {
        try {
            const datos = await obtenerUsuario(1);
            setUsuario(datos);
        } catch (error) {
            console.error(error);
        } finally {
            setCargando(false);
        }
    };

    if (cargando) {
        return <Text>Cargando...</Text>;
    }

    return (
        <View>
            <Text>Nombre: {usuario?.nombre}</Text>
            <Text>Email: {usuario?.email}</Text>
        </View>
    );
}
```

## 🔧 Funciones Utilitarias en MussikOn

### 1. **Manejo de Tokens**
```javascript
// src/utils/functions.ts
export const getToken = async () => {
    try {
        return await SecureStore.getItemAsync('token');
    } catch (error) {
        console.error('Error getting token:', error);
        return null;
    }
};

export const deleteToken = async () => {
    try {
        await SecureStore.deleteItemAsync('token');
    } catch (error) {
        console.error('Error deleting token:', error);
    }
};
```

### 2. **Validación de Datos**
```javascript
// Validar email
const validarEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

// Validar contraseña
const validarContraseña = (contraseña) => {
    return contraseña.length >= 6;
};

// Validar formulario
const validarFormulario = (datos) => {
    const errores = {};
    
    if (!datos.email) {
        errores.email = "El email es requerido";
    } else if (!validarEmail(datos.email)) {
        errores.email = "Email inválido";
    }
    
    if (!datos.contraseña) {
        errores.contraseña = "La contraseña es requerida";
    } else if (!validarContraseña(datos.contraseña)) {
        errores.contraseña = "La contraseña debe tener al menos 6 caracteres";
    }
    
    return {
        esValido: Object.keys(errores).length === 0,
        errores
    };
};
```

### 3. **Formateo de Datos**
```javascript
// Formatear fecha
const formatearFecha = (fecha) => {
    const opciones = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    return new Date(fecha).toLocaleDateString('es-ES', opciones);
};

// Formatear precio
const formatearPrecio = (precio) => {
    return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'USD'
    }).format(precio);
};

// Formatear tiempo transcurrido
const tiempoTranscurrido = (fecha) => {
    const ahora = new Date();
    const tiempo = ahora - new Date(fecha);
    const minutos = Math.floor(tiempo / 60000);
    const horas = Math.floor(minutos / 60);
    const dias = Math.floor(horas / 24);

    if (dias > 0) return `Hace ${dias} días`;
    if (horas > 0) return `Hace ${horas} horas`;
    if (minutos > 0) return `Hace ${minutos} minutos`;
    return "Ahora";
};
```

## 🔄 Manejo de Errores

### 1. **Try/Catch**
```javascript
const manejarError = async () => {
    try {
        const resultado = await operacionRiesgosa();
        return resultado;
    } catch (error) {
        console.error('Error:', error);
        // Mostrar mensaje al usuario
        Alert.alert('Error', 'Algo salió mal. Intenta de nuevo.');
        return null;
    }
};
```

### 2. **Validación Defensiva**
```javascript
const procesarUsuario = (usuario) => {
    // Verificar que usuario existe
    if (!usuario) {
        return null;
    }

    // Verificar propiedades requeridas
    if (!usuario.nombre || !usuario.email) {
        console.warn('Usuario incompleto:', usuario);
        return null;
    }

    // Procesar datos
    return {
        nombre: usuario.nombre.trim(),
        email: usuario.email.toLowerCase(),
        edad: usuario.edad || 0
    };
};
```

## 🎯 Resumen

1. **Variables**: Almacenan datos (let, const, var)
2. **Funciones**: Bloques de código reutilizables
3. **Condiciones**: Tomar decisiones (if/else)
4. **Bucles**: Repetir código (for, while)
5. **Arrays**: Listas de datos
6. **Objetos**: Datos organizados
7. **Arrow Functions**: Funciones modernas
8. **Destructuring**: Extraer datos fácilmente
9. **Async/Await**: Manejar operaciones asíncronas
10. **Try/Catch**: Manejar errores

## ➡️ Siguiente Paso

Ahora que entiendes JavaScript, vamos a aprender sobre la **arquitectura del proyecto** y cómo se organiza todo el código en MussikOn.

[Estructura de Carpetas →](../arquitectura/estructura-carpetas.md) 