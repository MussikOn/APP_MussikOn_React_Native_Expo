# Sintaxis Completa - Guía de Referencia

## Introducción

Esta guía de sintaxis es tu referencia completa para todos los lenguajes y tecnologías utilizadas en MussikOn. Aquí encontrarás ejemplos prácticos de cada concepto, explicados de manera clara y con analogías para facilitar el aprendizaje.

---

## 1. JavaScript - Sintaxis Básica

### Variables y Declaraciones

```javascript
// Declaración de variables
let nombre = "Juan";           // Variable que puede cambiar
const edad = 25;               // Constante que NO puede cambiar
var apellido = "Pérez";        // Forma antigua (evitar usar)

// Analogía: Variables son como cajas con etiquetas
// let = caja que puedes cambiar el contenido
// const = caja sellada que no puedes cambiar
```

### Tipos de Datos

```javascript
// Strings (texto)
let mensaje = "Hola mundo";
let nombre = 'María';
let direccion = `Calle ${numero}`; // Template literal

// Números
let edad = 25;
let precio = 99.99;
let negativo = -10;

// Booleanos (verdadero/falso)
let esActivo = true;
let estaLogueado = false;

// Arrays (listas)
let colores = ["rojo", "verde", "azul"];
let numeros = [1, 2, 3, 4, 5];

// Objetos
let usuario = {
    nombre: "Ana",
    edad: 30,
    email: "ana@email.com"
};
```

### Funciones

```javascript
// Función tradicional
function saludar(nombre) {
    return `Hola ${nombre}`;
}

// Función flecha (arrow function)
const saludar = (nombre) => {
    return `Hola ${nombre}`;
};

// Función flecha simplificada
const saludar = nombre => `Hola ${nombre}`;

// Función sin parámetros
const obtenerFecha = () => new Date();

// Función con múltiples parámetros
const sumar = (a, b) => a + b;
```

### Control de Flujo

```javascript
// Condicionales
if (edad >= 18) {
    console.log("Eres mayor de edad");
} else {
    console.log("Eres menor de edad");
}

// Operador ternario
const mensaje = edad >= 18 ? "Mayor" : "Menor";

// Switch
switch (dia) {
    case "lunes":
        console.log("Inicio de semana");
        break;
    case "viernes":
        console.log("¡Fin de semana!");
        break;
    default:
        console.log("Día normal");
}
```

### Bucles

```javascript
// For tradicional
for (let i = 0; i < 5; i++) {
    console.log(i);
}

// For...of (para arrays)
const colores = ["rojo", "verde", "azul"];
for (const color of colores) {
    console.log(color);
}

// For...in (para objetos)
const usuario = { nombre: "Juan", edad: 25 };
for (const propiedad in usuario) {
    console.log(`${propiedad}: ${usuario[propiedad]}`);
}

// forEach (método de array)
colores.forEach(color => console.log(color));
```

### Métodos de Array

```javascript
const numeros = [1, 2, 3, 4, 5];

// map - transformar elementos
const duplicados = numeros.map(num => num * 2);
// Resultado: [2, 4, 6, 8, 10]

// filter - filtrar elementos
const pares = numeros.filter(num => num % 2 === 0);
// Resultado: [2, 4]

// find - encontrar primer elemento
const mayor3 = numeros.find(num => num > 3);
// Resultado: 4

// reduce - acumular valores
const suma = numeros.reduce((total, num) => total + num, 0);
// Resultado: 15
```

### Destructuring y Spread

```javascript
// Destructuring de arrays
const [primero, segundo, ...resto] = [1, 2, 3, 4, 5];
// primero = 1, segundo = 2, resto = [3, 4, 5]

// Destructuring de objetos
const { nombre, edad, ...otrosDatos } = {
    nombre: "Juan",
    edad: 25,
    email: "juan@email.com",
    telefono: "123456789"
};

// Spread operator
const array1 = [1, 2, 3];
const array2 = [...array1, 4, 5]; // [1, 2, 3, 4, 5]

const objeto1 = { a: 1, b: 2 };
const objeto2 = { ...objeto1, c: 3 }; // { a: 1, b: 2, c: 3 }
```

---

## 2. TypeScript - Sintaxis de Tipos

### Tipos Básicos

```typescript
// Tipos primitivos
let nombre: string = "Juan";
let edad: number = 25;
let esActivo: boolean = true;
let valor: any = "cualquier cosa";

// Arrays
let colores: string[] = ["rojo", "verde"];
let numeros: Array<number> = [1, 2, 3];

// Tuplas (arrays con tipos específicos)
let coordenadas: [number, number] = [10, 20];
let usuario: [string, number, boolean] = ["Juan", 25, true];
```

### Interfaces

```typescript
// Definir estructura de objeto
interface Usuario {
    id: number;
    nombre: string;
    email: string;
    edad?: number; // Propiedad opcional
    readonly fechaCreacion: Date; // Solo lectura
}

// Usar la interfaz
const usuario: Usuario = {
    id: 1,
    nombre: "Juan",
    email: "juan@email.com",
    fechaCreacion: new Date()
};

// Extender interfaces
interface UsuarioPremium extends Usuario {
    plan: string;
    fechaExpiracion: Date;
}
```

### Tipos Union y Literales

```typescript
// Union types
let estado: "activo" | "inactivo" | "pendiente" = "activo";
let id: string | number = "abc123";

// Type aliases
type EstadoUsuario = "online" | "offline" | "away";
type ID = string | number;

// Literal types
type Direccion = "norte" | "sur" | "este" | "oeste";
```

### Funciones con Tipos

```typescript
// Función con tipos
function sumar(a: number, b: number): number {
    return a + b;
}

// Función con parámetros opcionales
function saludar(nombre: string, apellido?: string): string {
    return apellido ? `Hola ${nombre} ${apellido}` : `Hola ${nombre}`;
}

// Función con parámetros por defecto
function crearUsuario(nombre: string, edad: number = 18): Usuario {
    return { id: Date.now(), nombre, edad, email: "" };
}

// Arrow functions con tipos
const multiplicar = (a: number, b: number): number => a * b;
```

### Genéricos

```typescript
// Función genérica
function crearArray<T>(elemento: T, longitud: number): T[] {
    return new Array(longitud).fill(elemento);
}

// Uso
const numeros = crearArray<number>(0, 5); // [0, 0, 0, 0, 0]
const strings = crearArray<string>("hola", 3); // ["hola", "hola", "hola"]

// Interfaces genéricas
interface Respuesta<T> {
    datos: T;
    estado: string;
    mensaje?: string;
}

// Uso
const respuestaUsuario: Respuesta<Usuario> = {
    datos: usuario,
    estado: "success"
};
```

---

## 3. React Native - Sintaxis de Componentes

### Componente Funcional Básico

```typescript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
    nombre: string;
    edad?: number;
}

const MiComponente: React.FC<Props> = ({ nombre, edad = 18 }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.texto}>
                Hola {nombre}, tienes {edad} años
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff'
    },
    texto: {
        fontSize: 16,
        color: '#333'
    }
});

export default MiComponente;
```

### Hooks Básicos

```typescript
import React, { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';

const Contador: React.FC = () => {
    // useState - estado local
    const [contador, setContador] = useState<number>(0);
    const [nombre, setNombre] = useState<string>("");

    // useEffect - efectos secundarios
    useEffect(() => {
        console.log("Componente montado");
        
        // Cleanup al desmontar
        return () => {
            console.log("Componente desmontado");
        };
    }, []); // Array vacío = solo al montar

    useEffect(() => {
        console.log("Contador cambió:", contador);
    }, [contador]); // Se ejecuta cuando cambia contador

    return (
        <View>
            <Text>Contador: {contador}</Text>
            <Button 
                title="Incrementar" 
                onPress={() => setContador(contador + 1)} 
            />
        </View>
    );
};
```

### Navegación

```typescript
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Definir tipos para navegación
type RootStackParamList = {
    Home: undefined;
    Profile: { userId: string };
    Settings: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const App: React.FC = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen 
                    name="Home" 
                    component={HomeScreen}
                    options={{ title: 'Inicio' }}
                />
                <Stack.Screen 
                    name="Profile" 
                    component={ProfileScreen}
                    options={{ title: 'Perfil' }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

// En un componente
const HomeScreen: React.FC<StackScreenProps<RootStackParamList, 'Home'>> = ({ navigation }) => {
    const irAPerfil = () => {
        navigation.navigate('Profile', { userId: '123' });
    };

    return (
        <View>
            <Button title="Ir a Perfil" onPress={irAPerfil} />
        </View>
    );
};
```

### Estilos y Temas

```typescript
import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    card: {
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        padding: 15,
        marginVertical: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    texto: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    boton: {
        backgroundColor: '#007AFF',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    botonTexto: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

// Usar con tema
const MiComponente: React.FC = () => {
    const { theme } = useTheme();
    
    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Text style={[styles.texto, { color: theme.colors.text }]}>
                Texto con tema
            </Text>
        </View>
    );
};
```

---

## 4. Redux Toolkit - Sintaxis de Estado

### Slice Básico

```typescript
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Usuario {
    id: string;
    nombre: string;
    email: string;
}

interface AuthState {
    usuario: Usuario | null;
    token: string | null;
    cargando: boolean;
    error: string | null;
}

const estadoInicial: AuthState = {
    usuario: null,
    token: null,
    cargando: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState: estadoInicial,
    reducers: {
        // Acciones síncronas
        loginInicio: (state) => {
            state.cargando = true;
            state.error = null;
        },
        loginExitoso: (state, action: PayloadAction<{ usuario: Usuario; token: string }>) => {
            state.cargando = false;
            state.usuario = action.payload.usuario;
            state.token = action.payload.token;
        },
        loginFallido: (state, action: PayloadAction<string>) => {
            state.cargando = false;
            state.error = action.payload;
        },
        logout: (state) => {
            state.usuario = null;
            state.token = null;
        },
    },
});

export const { loginInicio, loginExitoso, loginFallido, logout } = authSlice.actions;
export default authSlice.reducer;
```

### Thunk Actions (Acciones Asíncronas)

```typescript
import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../services/api';

// Thunk para login
export const loginUsuario = createAsyncThunk(
    'auth/loginUsuario',
    async (credenciales: { email: string; password: string }, { rejectWithValue }) => {
        try {
            const respuesta = await api.post('/auth/login', credenciales);
            return respuesta.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Error de login');
        }
    }
);

// Slice con thunk
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // ... reducers síncronos
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUsuario.pending, (state) => {
                state.cargando = true;
                state.error = null;
            })
            .addCase(loginUsuario.fulfilled, (state, action) => {
                state.cargando = false;
                state.usuario = action.payload.usuario;
                state.token = action.payload.token;
            })
            .addCase(loginUsuario.rejected, (state, action) => {
                state.cargando = false;
                state.error = action.payload as string;
            });
    },
});
```

### Usar Redux en Componentes

```typescript
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { loginUsuario, logout } from '../store/slices/authSlice';

const LoginScreen: React.FC = () => {
    const dispatch = useDispatch();
    const { cargando, error, usuario } = useSelector((state: RootState) => state.auth);

    const handleLogin = async () => {
        const credenciales = {
            email: 'usuario@email.com',
            password: 'password123'
        };
        
        await dispatch(loginUsuario(credenciales));
    };

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <View>
            {cargando && <Text>Cargando...</Text>}
            {error && <Text style={{ color: 'red' }}>{error}</Text>}
            {usuario ? (
                <View>
                    <Text>Bienvenido, {usuario.nombre}</Text>
                    <Button title="Cerrar Sesión" onPress={handleLogout} />
                </View>
            ) : (
                <Button title="Iniciar Sesión" onPress={handleLogin} />
            )}
        </View>
    );
};
```

---

## 5. Socket.IO - Sintaxis de Comunicación

### Configuración del Cliente

```typescript
import { io, Socket } from 'socket.io-client';

class SocketService {
    private socket: Socket | null = null;
    private url: string = 'https://tu-servidor.com';

    conectar(token: string) {
        this.socket = io(this.url, {
            auth: {
                token: token
            },
            transports: ['websocket', 'polling']
        });

        // Eventos de conexión
        this.socket.on('connect', () => {
            console.log('Conectado al servidor');
        });

        this.socket.on('disconnect', () => {
            console.log('Desconectado del servidor');
        });

        this.socket.on('connect_error', (error) => {
            console.error('Error de conexión:', error);
        });
    }

    desconectar() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    // Emitir eventos
    emitirEvento(evento: string, datos: any) {
        if (this.socket) {
            this.socket.emit(evento, datos);
        }
    }

    // Escuchar eventos
    escucharEvento(evento: string, callback: (datos: any) => void) {
        if (this.socket) {
            this.socket.on(evento, callback);
        }
    }

    // Dejar de escuchar
    dejarDeEscuchar(evento: string) {
        if (this.socket) {
            this.socket.off(evento);
        }
    }
}

export const socketService = new SocketService();
```

### Uso en Componentes

```typescript
import React, { useEffect, useState } from 'react';
import { socketService } from '../services/socketService';

const ChatComponent: React.FC = () => {
    const [mensajes, setMensajes] = useState<Mensaje[]>([]);
    const [conectado, setConectado] = useState(false);

    useEffect(() => {
        // Conectar al socket
        socketService.conectar('token-jwt');

        // Escuchar eventos
        socketService.escucharEvento('mensaje_nuevo', (mensaje: Mensaje) => {
            setMensajes(prev => [...prev, mensaje]);
        });

        socketService.escucharEvento('usuario_conectado', (usuario: Usuario) => {
            console.log(`${usuario.nombre} se conectó`);
        });

        socketService.escucharEvento('usuario_desconectado', (usuario: Usuario) => {
            console.log(`${usuario.nombre} se desconectó`);
        });

        // Cleanup
        return () => {
            socketService.desconectar();
        };
    }, []);

    const enviarMensaje = (texto: string) => {
        const mensaje = {
            id: Date.now(),
            texto,
            usuario: 'Yo',
            timestamp: new Date()
        };

        // Emitir evento al servidor
        socketService.emitirEvento('enviar_mensaje', mensaje);
    };

    return (
        <View>
            <Text>Estado: {conectado ? 'Conectado' : 'Desconectado'}</Text>
            {mensajes.map(mensaje => (
                <Text key={mensaje.id}>{mensaje.usuario}: {mensaje.texto}</Text>
            ))}
        </View>
    );
};
```

---

## 6. Axios - Sintaxis de API

### Configuración Base

```typescript
import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

// Configurar instancia base
const api: AxiosInstance = axios.create({
    baseURL: 'https://tu-api.com/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor de requests
api.interceptors.request.use(
    (config) => {
        // Agregar token a cada request
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor de responses
api.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            // Token expirado, redirigir a login
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
```

### Servicios de API

```typescript
// Tipos para las respuestas
interface ApiResponse<T> {
    data: T;
    message: string;
    success: boolean;
}

interface Usuario {
    id: string;
    nombre: string;
    email: string;
}

// Servicio de usuarios
class UsuarioService {
    // GET - Obtener usuarios
    async obtenerUsuarios(): Promise<Usuario[]> {
        try {
            const response = await api.get<ApiResponse<Usuario[]>>('/usuarios');
            return response.data.data;
        } catch (error) {
            throw new Error('Error al obtener usuarios');
        }
    }

    // GET - Obtener usuario por ID
    async obtenerUsuario(id: string): Promise<Usuario> {
        try {
            const response = await api.get<ApiResponse<Usuario>>(`/usuarios/${id}`);
            return response.data.data;
        } catch (error) {
            throw new Error('Usuario no encontrado');
        }
    }

    // POST - Crear usuario
    async crearUsuario(datos: Omit<Usuario, 'id'>): Promise<Usuario> {
        try {
            const response = await api.post<ApiResponse<Usuario>>('/usuarios', datos);
            return response.data.data;
        } catch (error) {
            throw new Error('Error al crear usuario');
        }
    }

    // PUT - Actualizar usuario
    async actualizarUsuario(id: string, datos: Partial<Usuario>): Promise<Usuario> {
        try {
            const response = await api.put<ApiResponse<Usuario>>(`/usuarios/${id}`, datos);
            return response.data.data;
        } catch (error) {
            throw new Error('Error al actualizar usuario');
        }
    }

    // DELETE - Eliminar usuario
    async eliminarUsuario(id: string): Promise<void> {
        try {
            await api.delete(`/usuarios/${id}`);
        } catch (error) {
            throw new Error('Error al eliminar usuario');
        }
    }
}

export const usuarioService = new UsuarioService();
```

### Uso en Componentes

```typescript
import React, { useState, useEffect } from 'react';
import { usuarioService } from '../services/usuarioService';

const UsuariosScreen: React.FC = () => {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const cargarUsuarios = async () => {
        setCargando(true);
        setError(null);
        
        try {
            const data = await usuarioService.obtenerUsuarios();
            setUsuarios(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarUsuarios();
    }, []);

    const crearNuevoUsuario = async () => {
        try {
            const nuevoUsuario = await usuarioService.crearUsuario({
                nombre: 'Nuevo Usuario',
                email: 'nuevo@email.com'
            });
            setUsuarios(prev => [...prev, nuevoUsuario]);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al crear usuario');
        }
    };

    return (
        <View>
            {cargando && <Text>Cargando usuarios...</Text>}
            {error && <Text style={{ color: 'red' }}>{error}</Text>}
            
            {usuarios.map(usuario => (
                <View key={usuario.id}>
                    <Text>{usuario.nombre}</Text>
                    <Text>{usuario.email}</Text>
                </View>
            ))}
            
            <Button title="Crear Usuario" onPress={crearNuevoUsuario} />
        </View>
    );
};
```

---

## 7. React Hooks - Sintaxis Avanzada

### useCallback y useMemo

```typescript
import React, { useState, useCallback, useMemo } from 'react';

const ListaOptimizada: React.FC = () => {
    const [items, setItems] = useState<string[]>([]);
    const [filtro, setFiltro] = useState('');

    // useCallback - memorizar función
    const agregarItem = useCallback((nuevoItem: string) => {
        setItems(prev => [...prev, nuevoItem]);
    }, []); // Dependencias vacías = función nunca cambia

    const eliminarItem = useCallback((index: number) => {
        setItems(prev => prev.filter((_, i) => i !== index));
    }, []);

    // useMemo - memorizar valor calculado
    const itemsFiltrados = useMemo(() => {
        return items.filter(item => 
            item.toLowerCase().includes(filtro.toLowerCase())
        );
    }, [items, filtro]); // Se recalcula solo si cambian items o filtro

    const totalItems = useMemo(() => itemsFiltrados.length, [itemsFiltrados]);

    return (
        <View>
            <TextInput
                value={filtro}
                onChangeText={setFiltro}
                placeholder="Filtrar items..."
            />
            
            <Text>Total: {totalItems}</Text>
            
            {itemsFiltrados.map((item, index) => (
                <View key={index}>
                    <Text>{item}</Text>
                    <Button 
                        title="Eliminar" 
                        onPress={() => eliminarItem(index)} 
                    />
                </View>
            ))}
        </View>
    );
};
```

### useRef

```typescript
import React, { useRef, useEffect } from 'react';
import { TextInput, Button } from 'react-native';

const FormularioConRef: React.FC = () => {
    const inputRef = useRef<TextInput>(null);
    const contadorRef = useRef<number>(0);

    useEffect(() => {
        // Focus automático al montar
        inputRef.current?.focus();
    }, []);

    const incrementarContador = () => {
        contadorRef.current += 1;
        console.log('Contador:', contadorRef.current);
    };

    const focusInput = () => {
        inputRef.current?.focus();
    };

    return (
        <View>
            <TextInput
                ref={inputRef}
                placeholder="Escribe algo..."
                style={{ borderWidth: 1, padding: 10 }}
            />
            
            <Button title="Focus Input" onPress={focusInput} />
            <Button title="Incrementar" onPress={incrementarContador} />
        </View>
    );
};
```

### Custom Hooks

```typescript
// Hook personalizado para formularios
import { useState, useCallback } from 'react';

interface UseFormReturn<T> {
    values: T;
    errors: Partial<T>;
    handleChange: (field: keyof T) => (value: any) => void;
    handleSubmit: (onSubmit: (values: T) => void) => void;
    reset: () => void;
    setFieldValue: (field: keyof T, value: any) => void;
}

function useForm<T extends Record<string, any>>(
    initialValues: T,
    validationSchema?: (values: T) => Partial<T>
): UseFormReturn<T> {
    const [values, setValues] = useState<T>(initialValues);
    const [errors, setErrors] = useState<Partial<T>>({});

    const handleChange = useCallback((field: keyof T) => (value: any) => {
        setValues(prev => ({ ...prev, [field]: value }));
        
        // Limpiar error del campo
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    }, [errors]);

    const setFieldValue = useCallback((field: keyof T, value: any) => {
        setValues(prev => ({ ...prev, [field]: value }));
    }, []);

    const handleSubmit = useCallback((onSubmit: (values: T) => void) => {
        if (validationSchema) {
            const newErrors = validationSchema(values);
            setErrors(newErrors);
            
            if (Object.keys(newErrors).length === 0) {
                onSubmit(values);
            }
        } else {
            onSubmit(values);
        }
    }, [values, validationSchema]);

    const reset = useCallback(() => {
        setValues(initialValues);
        setErrors({});
    }, [initialValues]);

    return {
        values,
        errors,
        handleChange,
        handleSubmit,
        reset,
        setFieldValue,
    };
}

// Uso del hook personalizado
const FormularioUsuario: React.FC = () => {
    const { values, errors, handleChange, handleSubmit, reset } = useForm({
        nombre: '',
        email: '',
        edad: ''
    }, (values) => {
        const errors: any = {};
        if (!values.nombre) errors.nombre = 'Nombre requerido';
        if (!values.email) errors.email = 'Email requerido';
        if (!values.edad) errors.edad = 'Edad requerida';
        return errors;
    });

    const onSubmit = (datos: any) => {
        console.log('Datos del formulario:', datos);
        // Enviar datos al servidor
    };

    return (
        <View>
            <TextInput
                value={values.nombre}
                onChangeText={handleChange('nombre')}
                placeholder="Nombre"
            />
            {errors.nombre && <Text style={{ color: 'red' }}>{errors.nombre}</Text>}
            
            <TextInput
                value={values.email}
                onChangeText={handleChange('email')}
                placeholder="Email"
            />
            {errors.email && <Text style={{ color: 'red' }}>{errors.email}</Text>}
            
            <Button title="Enviar" onPress={() => handleSubmit(onSubmit)} />
            <Button title="Reset" onPress={reset} />
        </View>
    );
};
```

---

## 8. Context API - Sintaxis de Contextos

### Crear Contexto

```typescript
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Definir tipos
interface Usuario {
    id: string;
    nombre: string;
    email: string;
}

interface UsuarioContextType {
    usuario: Usuario | null;
    login: (usuario: Usuario) => void;
    logout: () => void;
    actualizarUsuario: (datos: Partial<Usuario>) => void;
}

// Crear contexto
const UsuarioContext = createContext<UsuarioContextType | undefined>(undefined);

// Provider component
interface UsuarioProviderProps {
    children: ReactNode;
}

export const UsuarioProvider: React.FC<UsuarioProviderProps> = ({ children }) => {
    const [usuario, setUsuario] = useState<Usuario | null>(null);

    const login = (nuevoUsuario: Usuario) => {
        setUsuario(nuevoUsuario);
    };

    const logout = () => {
        setUsuario(null);
    };

    const actualizarUsuario = (datos: Partial<Usuario>) => {
        if (usuario) {
            setUsuario({ ...usuario, ...datos });
        }
    };

    const value: UsuarioContextType = {
        usuario,
        login,
        logout,
        actualizarUsuario,
    };

    return (
        <UsuarioContext.Provider value={value}>
            {children}
        </UsuarioContext.Provider>
    );
};

// Hook personalizado para usar el contexto
export const useUsuario = (): UsuarioContextType => {
    const context = useContext(UsuarioContext);
    if (context === undefined) {
        throw new Error('useUsuario debe usarse dentro de UsuarioProvider');
    }
    return context;
};
```

### Usar Contexto

```typescript
// En el componente raíz
const App: React.FC = () => {
    return (
        <UsuarioProvider>
            <NavigationContainer>
                {/* Resto de la app */}
            </NavigationContainer>
        </UsuarioProvider>
    );
};

// En cualquier componente hijo
const PerfilScreen: React.FC = () => {
    const { usuario, logout, actualizarUsuario } = useUsuario();

    if (!usuario) {
        return <Text>No hay usuario logueado</Text>;
    }

    return (
        <View>
            <Text>Nombre: {usuario.nombre}</Text>
            <Text>Email: {usuario.email}</Text>
            
            <Button 
                title="Actualizar Nombre" 
                onPress={() => actualizarUsuario({ nombre: 'Nuevo Nombre' })} 
            />
            
            <Button title="Cerrar Sesión" onPress={logout} />
        </View>
    );
};
```

---

## 9. AsyncStorage - Sintaxis de Almacenamiento

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

// Clase para manejar almacenamiento
class StorageService {
    // Guardar datos
    async guardar<T>(clave: string, valor: T): Promise<void> {
        try {
            const jsonValue = JSON.stringify(valor);
            await AsyncStorage.setItem(clave, jsonValue);
        } catch (error) {
            console.error('Error al guardar:', error);
            throw error;
        }
    }

    // Obtener datos
    async obtener<T>(clave: string): Promise<T | null> {
        try {
            const jsonValue = await AsyncStorage.getItem(clave);
            return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch (error) {
            console.error('Error al obtener:', error);
            return null;
        }
    }

    // Eliminar datos
    async eliminar(clave: string): Promise<void> {
        try {
            await AsyncStorage.removeItem(clave);
        } catch (error) {
            console.error('Error al eliminar:', error);
            throw error;
        }
    }

    // Limpiar todo
    async limpiarTodo(): Promise<void> {
        try {
            await AsyncStorage.clear();
        } catch (error) {
            console.error('Error al limpiar:', error);
            throw error;
        }
    }

    // Obtener todas las claves
    async obtenerClaves(): Promise<string[]> {
        try {
            return await AsyncStorage.getAllKeys();
        } catch (error) {
            console.error('Error al obtener claves:', error);
            return [];
        }
    }
}

export const storageService = new StorageService();

// Hook personalizado para usar storage
import { useState, useEffect } from 'react';

function useStorage<T>(clave: string, valorInicial: T) {
    const [valor, setValor] = useState<T>(valorInicial);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        cargarValor();
    }, [clave]);

    const cargarValor = async () => {
        try {
            const valorGuardado = await storageService.obtener<T>(clave);
            if (valorGuardado !== null) {
                setValor(valorGuardado);
            }
        } catch (error) {
            console.error('Error al cargar valor:', error);
        } finally {
            setCargando(false);
        }
    };

    const guardarValor = async (nuevoValor: T) => {
        try {
            await storageService.guardar(clave, nuevoValor);
            setValor(nuevoValor);
        } catch (error) {
            console.error('Error al guardar valor:', error);
        }
    };

    return { valor, guardarValor, cargando };
}

// Uso del hook
const ConfiguracionScreen: React.FC = () => {
    const { valor: tema, guardarValor: guardarTema, cargando } = useStorage('tema', 'claro');

    if (cargando) {
        return <Text>Cargando configuración...</Text>;
    }

    return (
        <View>
            <Text>Tema actual: {tema}</Text>
            <Button 
                title="Cambiar a Oscuro" 
                onPress={() => guardarTema('oscuro')} 
            />
            <Button 
                title="Cambiar a Claro" 
                onPress={() => guardarTema('claro')} 
            />
        </View>
    );
};
```

---

## 10. Expo - Sintaxis Específica

### Configuración de app.json

```json
{
  "expo": {
    "name": "MussikOn",
    "slug": "mussikon",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "updates": {
      "fallbackToCacheTimeout": 0
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.mussikon.app"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#FFFFFF"
      },
      "package": "com.mussikon.app"
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "plugins": [
      "expo-secure-store",
      "expo-location",
      "expo-image-picker"
    ]
  }
}
```

### Uso de Expo APIs

```typescript
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import * as SecureStore from 'expo-secure-store';

// Ubicación
const obtenerUbicacion = async () => {
    try {
        // Solicitar permisos
        const { status } = await Location.requestForegroundPermissionsAsync();
        
        if (status !== 'granted') {
            alert('Se necesitan permisos de ubicación');
            return;
        }

        // Obtener ubicación actual
        const ubicacion = await Location.getCurrentPositionAsync({});
        
        return {
            latitude: ubicacion.coords.latitude,
            longitude: ubicacion.coords.longitude,
        };
    } catch (error) {
        console.error('Error al obtener ubicación:', error);
    }
};

// Selector de imágenes
const seleccionarImagen = async () => {
    try {
        // Solicitar permisos
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        
        if (status !== 'granted') {
            alert('Se necesitan permisos para acceder a la galería');
            return;
        }

        // Abrir selector de imágenes
        const resultado = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!resultado.canceled) {
            return resultado.assets[0].uri;
        }
    } catch (error) {
        console.error('Error al seleccionar imagen:', error);
    }
};

// Almacenamiento seguro
const guardarToken = async (token: string) => {
    try {
        await SecureStore.setItemAsync('auth_token', token);
    } catch (error) {
        console.error('Error al guardar token:', error);
    }
};

const obtenerToken = async (): Promise<string | null> => {
    try {
        return await SecureStore.getItemAsync('auth_token');
    } catch (error) {
        console.error('Error al obtener token:', error);
        return null;
    }
};
```

---

## Conclusión

Esta guía de sintaxis te proporciona una referencia completa de todos los lenguajes y tecnologías utilizadas en MussikOn. Recuerda que:

1. **La práctica hace al maestro**: Experimenta con cada sintaxis
2. **Comienza simple**: Domina lo básico antes de avanzar
3. **Usa el autocompletado**: Tu editor te ayudará con la sintaxis
4. **Lee documentación**: Siempre consulta la documentación oficial
5. **Debugging**: Usa `console.log()` para entender qué está pasando

¡Ahora tienes todas las herramientas sintácticas necesarias para entender y trabajar con el código de MussikOn! 