# 🔒 ¿Qué es TypeScript?

## 🤔 ¿Qué es TypeScript?

**TypeScript** es como **JavaScript** pero con "superpoderes". Es un lenguaje de programación que te ayuda a escribir código más seguro y fácil de mantener.

## 🎯 ¿Por qué TypeScript?

### El Problema con JavaScript:
```javascript
// JavaScript (puede fallar)
function sumar(a, b) {
    return a + b;
}

sumar("2", 3); // Resultado: "23" (incorrecto)
sumar(2, 3);   // Resultado: 5 (correcto)
```

### La Solución con TypeScript:
```typescript
// TypeScript (más seguro)
function sumar(a: number, b: number): number {
    return a + b;
}

sumar("2", 3); // ❌ Error: "2" no es un número
sumar(2, 3);   // ✅ Correcto: 5
```

## 🧠 Analogía Simple

Imagina que estás construyendo una casa:

### JavaScript (Sin Planos):
- Construyes sin saber exactamente qué materiales usar
- Puede que funcione, pero también puede colapsar
- Es difícil para otros entender qué querías hacer

### TypeScript (Con Planos Detallados):
- Tienes planos exactos de cada habitación
- Sabes qué materiales usar en cada parte
- Es fácil para otros entender y mantener

## 🔧 Tipos Básicos en TypeScript

### 1. **string** (Texto)
```typescript
let nombre: string = "Juan";
let email: string = "juan@email.com";
```

### 2. **number** (Números)
```typescript
let edad: number = 25;
let precio: number = 99.99;
```

### 3. **boolean** (Verdadero/Falso)
```typescript
let esMusico: boolean = true;
let estaConectado: boolean = false;
```

### 4. **array** (Listas)
```typescript
let instrumentos: string[] = ["Guitarra", "Piano", "Batería"];
let edades: number[] = [25, 30, 35];
```

### 5. **object** (Objetos)
```typescript
let usuario: {
    nombre: string;
    edad: number;
    esMusico: boolean;
} = {
    nombre: "Juan",
    edad: 25,
    esMusico: true
};
```

## 🏗️ Interfaces en TypeScript

### ¿Qué son las Interfaces?
Son como "contratos" que definen qué propiedades debe tener un objeto.

### Ejemplo en MussikOn:
```typescript
// src/appTypes/DatasTypes.ts
export interface User {
    id: string;
    name: string;
    lastName: string;
    userEmail: string;
    roll: 'organizador' | 'musico';
    create_at: string;
    update_at: string;
    delete_at: string;
    status: boolean;
}

// Uso
const usuario: User = {
    id: "1",
    name: "Juan",
    lastName: "Pérez",
    userEmail: "juan@email.com",
    roll: "musico",
    create_at: "2024-01-01",
    update_at: "2024-01-01",
    delete_at: "",
    status: true
};
```

## 🔄 Tipos de Unión y Literales

### Tipos de Unión:
```typescript
// Un valor puede ser de varios tipos
let id: string | number = "abc123";
id = 123; // También válido
```

### Literales:
```typescript
// Solo valores específicos permitidos
type Rol = 'organizador' | 'musico' | 'evangelista';
let miRol: Rol = 'musico'; // ✅ Válido
let otroRol: Rol = 'admin'; // ❌ Error
```

## 🎯 Tipos en Funciones

### Parámetros Tipados:
```typescript
function saludar(nombre: string, edad: number): string {
    return `Hola ${nombre}, tienes ${edad} años`;
}

saludar("Juan", 25); // ✅ Correcto
saludar(25, "Juan"); // ❌ Error: tipos incorrectos
```

### Funciones con Callbacks:
```typescript
function procesarUsuario(
    usuario: User, 
    callback: (resultado: string) => void
): void {
    const resultado = `Usuario: ${usuario.name}`;
    callback(resultado);
}

procesarUsuario(usuario, (resultado) => {
    console.log(resultado);
});
```

## 📱 Tipos en React Native

### Props Tipadas:
```typescript
// src/components/ui/Button.tsx
interface ButtonProps {
    title: string;
    onPress: () => void;
    style?: any; // Opcional
    disabled?: boolean;
}

function Button({ title, onPress, style, disabled = false }: ButtonProps) {
    return (
        <TouchableOpacity 
            onPress={onPress} 
            style={[styles.button, style]}
            disabled={disabled}
        >
            <Text style={styles.buttonText}>{title}</Text>
        </TouchableOpacity>
    );
}
```

### Estados Tipados:
```typescript
// src/screens/auth/Login.tsx
function Login() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (): Promise<void> => {
        setLoading(true);
        try {
            // Lógica de login
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error desconocido");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View>
            <TextInput 
                value={email}
                onChangeText={setEmail}
                placeholder="Email"
            />
            <TextInput 
                value={password}
                onChangeText={setPassword}
                placeholder="Contraseña"
                secureTextEntry
            />
            <Button 
                title={loading ? "Cargando..." : "Entrar"}
                onPress={handleLogin}
                disabled={loading}
            />
            {error && <Text style={styles.error}>{error}</Text>}
        </View>
    );
}
```

## 🔄 Generics en TypeScript

### ¿Qué son los Generics?
Permiten crear funciones y tipos que funcionan con diferentes tipos de datos.

### Ejemplo:
```typescript
// Función genérica para arrays
function obtenerPrimerElemento<T>(array: T[]): T | undefined {
    return array[0];
}

// Uso
const nombres: string[] = ["Juan", "María", "Pedro"];
const edades: number[] = [25, 30, 35];

const primerNombre = obtenerPrimerElemento(nombres); // string
const primeraEdad = obtenerPrimerElemento(edades);   // number
```

## 🎨 Tipos para Navegación

### React Navigation con TypeScript:
```typescript
// src/appTypes/DatasTypes.ts
export type RootStackParamList = {
    Login: undefined;
    Home: undefined;
    Register: undefined;
    Dashboard: undefined;
    Profile: undefined;
    Settings: undefined;
    EditRequest: { requestId: string };
    Chat: { conversationId: string };
};

// Uso en navegación
function MyRequestsList({ navigation }: StackNavigationProp<RootStackParamList>) {
    const handleEdit = (requestId: string) => {
        navigation.navigate('EditRequest', { requestId });
    };

    return (
        <View>
            <Button 
                title="Editar Solicitud"
                onPress={() => handleEdit("123")}
            />
        </View>
    );
}
```

## 🔒 Tipos para API

### Respuestas de API:
```typescript
// src/services/api.ts
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

export interface LoginResponse {
    token: string;
    user: User;
}

// Uso
async function login(email: string, password: string): Promise<ApiResponse<LoginResponse>> {
    try {
        const response = await api.post('/auth/login', { email, password });
        return response.data;
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Error desconocido"
        };
    }
}
```

## 🎯 Tipos para Estado Global

### Redux con TypeScript:
```typescript
// src/store/slices/authSlice.ts
interface AuthState {
    user: User | null;
    token: string | null;
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    token: null,
    loading: false,
    error: null
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
        },
        setToken: (state, action: PayloadAction<string>) => {
            state.token = action.payload;
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
        }
    }
});
```

## 🔧 Configuración de TypeScript

### tsconfig.json:
```json
{
  "compilerOptions": {
    "target": "esnext",
    "lib": ["dom", "esnext"],
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
    "jsx": "react-jsx",
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@screens/*": ["src/screens/*"],
      "@utils/*": ["src/utils/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

## 🎯 Ventajas de TypeScript

### ✅ **Pros:**
1. **Menos errores**: Detecta problemas antes de ejecutar
2. **Mejor autocompletado**: El editor te sugiere opciones
3. **Refactoring seguro**: Cambiar código sin romper nada
4. **Documentación viva**: Los tipos son documentación
5. **Mejor mantenimiento**: Código más fácil de entender

### ❌ **Contras:**
1. **Curva de aprendizaje**: Hay que aprender tipos
2. **Más código**: Escribir tipos toma tiempo
3. **Configuración**: Requiere configuración inicial
4. **Compilación**: Necesita compilar a JavaScript

## 🔄 Migración de JavaScript a TypeScript

### Paso 1: Cambiar extensión
```
Login.js → Login.tsx
Button.js → Button.tsx
```

### Paso 2: Agregar tipos básicos
```typescript
// Antes (JavaScript)
function saludar(nombre) {
    return `Hola ${nombre}`;
}

// Después (TypeScript)
function saludar(nombre: string): string {
    return `Hola ${nombre}`;
}
```

### Paso 3: Crear interfaces
```typescript
// Antes
const usuario = {
    nombre: "Juan",
    edad: 25
};

// Después
interface Usuario {
    nombre: string;
    edad: number;
}

const usuario: Usuario = {
    nombre: "Juan",
    edad: 25
};
```

## 🎯 Resumen

1. **TypeScript** = JavaScript con tipos
2. **Interfaces** = Contratos para objetos
3. **Tipos básicos** = string, number, boolean, array
4. **Generics** = Funciones que funcionan con cualquier tipo
5. **Configuración** = tsconfig.json define las reglas
6. **Ventajas** = Menos errores, mejor mantenimiento

## ➡️ Siguiente Paso

Ahora que entiendes TypeScript, vamos a aprender sobre **JavaScript**, que es la base de todo lo que hemos visto hasta ahora.

[¿Qué es JavaScript? →](./javascript.md) 