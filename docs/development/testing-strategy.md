# Estrategia de Testing

## Descripción General
Estrategia integral de testing que cubre testing unitario, de integración, end-to-end y de performance para garantizar la calidad y confiabilidad del código.

## Estado de Implementación
**70% Implementado** ⚠️

## Arquitectura de Testing

### Frontend (React Native + Expo)
- **Jest**: Framework principal de testing
- **React Native Testing Library**: Testing de componentes
- **@testing-library/jest-native**: Matchers específicos para RN
- **MSW**: Mock Service Worker para APIs

### Backend (Node.js + Express)
- **Jest**: Framework principal de testing
- **Supertest**: Testing de APIs HTTP
- **Firebase Emulator**: Testing de Firebase local
- **Nock**: Mocking de HTTP requests

### Herramientas de Testing
- **Coverage**: Jest coverage para métricas
- **Watch Mode**: Testing en tiempo real
- **CI/CD**: GitHub Actions para testing automático
- **Reporting**: Reportes de coverage y resultados

## Tipos de Testing

### 1. Unit Testing
**Objetivo**: Probar funciones y componentes individuales de forma aislada.

#### Frontend - Componentes
```typescript
// src/components/Button.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Button from './Button';

describe('Button Component', () => {
  it('renders correctly with title', () => {
    const { getByText } = render(<Button title="Test Button" />);
    expect(getByText('Test Button')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const mockOnPress = jest.fn();
    const { getByText } = render(
      <Button title="Test Button" onPress={mockOnPress} />
    );
    
    fireEvent.press(getByText('Test Button'));
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('applies custom styles', () => {
    const customStyle = { backgroundColor: 'red' };
    const { getByTestId } = render(
      <Button title="Test" style={customStyle} testID="custom-button" />
    );
    
    const button = getByTestId('custom-button');
    expect(button.props.style).toContainEqual(customStyle);
  });
});
```

#### Frontend - Hooks
```typescript
// src/hooks/useUser.test.ts
import { renderHook, act } from '@testing-library/react-native';
import { useUser } from './useUser';
import { UserProvider } from '../contexts/UserContext';

describe('useUser Hook', () => {
  it('returns user data when authenticated', () => {
    const wrapper = ({ children }) => (
      <UserProvider>{children}</UserProvider>
    );
    
    const { result } = renderHook(() => useUser(), { wrapper });
    
    expect(result.current.user).toBeDefined();
    expect(result.current.isLoading).toBe(false);
  });

  it('handles login correctly', async () => {
    const wrapper = ({ children }) => (
      <UserProvider>{children}</UserProvider>
    );
    
    const { result } = renderHook(() => useUser(), { wrapper });
    
    await act(async () => {
      await result.current.login('test-token');
    });
    
    expect(result.current.user).toBeTruthy();
  });
});
```

#### Backend - Services
```typescript
// src/services/userService.test.ts
import { UserService } from './userService';
import { mockUser, mockFirestore } from '../__mocks__/firebase';

describe('UserService', () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService(mockFirestore);
  });

  it('creates user successfully', async () => {
    const userData = { email: 'test@example.com', name: 'Test User' };
    const result = await userService.createUser(userData);
    
    expect(result).toBeDefined();
    expect(result.email).toBe(userData.email);
  });

  it('throws error for invalid user data', async () => {
    const invalidData = { email: 'invalid-email' };
    
    await expect(userService.createUser(invalidData))
      .rejects.toThrow('Invalid user data');
  });
});
```

### 2. Integration Testing
**Objetivo**: Probar la interacción entre múltiples componentes y servicios.

#### Frontend - Pantallas Completas
```typescript
// src/screens/Login.test.tsx
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import Login from './Login';
import { UserProvider } from '../contexts/UserContext';

const mockNavigation = {
  navigate: jest.fn(),
  replace: jest.fn(),
};

describe('Login Screen Integration', () => {
  it('navigates to main app after successful login', async () => {
    const { getByPlaceholderText, getByText } = render(
      <NavigationContainer>
        <UserProvider>
          <Login navigation={mockNavigation} />
        </UserProvider>
      </NavigationContainer>
    );

    const emailInput = getByPlaceholderText('Email');
    const passwordInput = getByPlaceholderText('Password');
    const loginButton = getByText('Login');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(mockNavigation.replace).toHaveBeenCalledWith('MainTabs');
    });
  });
});
```

#### Backend - API Endpoints
```typescript
// src/routes/auth.test.ts
import request from 'supertest';
import { app } from '../app';
import { setupTestDatabase, teardownTestDatabase } from '../testUtils';

describe('Auth Routes Integration', () => {
  beforeAll(async () => {
    await setupTestDatabase();
  });

  afterAll(async () => {
    await teardownTestDatabase();
  });

  it('POST /auth/login returns JWT token', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body).toHaveProperty('user');
  });

  it('POST /auth/login fails with invalid credentials', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({
        email: 'test@example.com',
        password: 'wrongpassword'
      });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message');
  });
});
```

### 3. End-to-End Testing
**Objetivo**: Probar flujos completos de usuario desde el frontend hasta el backend.

#### Flujo de Autenticación
```typescript
// e2e/auth-flow.test.ts
import { device, element, by, expect } from 'detox';

describe('Authentication Flow', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  it('completes full login flow', async () => {
    // Navegar a pantalla de login
    await element(by.id('login-screen')).tap();
    
    // Ingresar credenciales
    await element(by.id('email-input')).typeText('test@example.com');
    await element(by.id('password-input')).typeText('password123');
    
    // Presionar botón de login
    await element(by.id('login-button')).tap();
    
    // Verificar navegación a pantalla principal
    await expect(element(by.id('main-screen'))).toBeVisible();
    
    // Verificar que el usuario está autenticado
    await expect(element(by.id('user-profile'))).toBeVisible();
  });
});
```

#### Flujo de Solicitud de Músico
```typescript
// e2e/musician-request-flow.test.ts
describe('Musician Request Flow', () => {
  it('creates and manages musician request', async () => {
    // Crear solicitud
    await element(by.id('create-request-button')).tap();
    await element(by.id('request-title-input')).typeText('Evento de Música');
    await element(by.id('request-description-input')).typeText('Necesito un guitarrista');
    await element(by.id('submit-request-button')).tap();
    
    // Verificar solicitud creada
    await expect(element(by.id('request-success-message'))).toBeVisible();
    
    // Navegar a lista de solicitudes
    await element(by.id('my-requests-tab')).tap();
    await expect(element(by.text('Evento de Música'))).toBeVisible();
  });
});
```

### 4. Performance Testing
**Objetivo**: Verificar que la aplicación cumple con los requisitos de rendimiento.

#### Frontend - Rendimiento de Componentes
```typescript
// src/components/__tests__/performance.test.tsx
import { render } from '@testing-library/react-native';
import { performance } from 'perf_hooks';
import LargeList from '../LargeList';

describe('LargeList Performance', () => {
  it('renders 1000 items in under 100ms', () => {
    const items = Array.from({ length: 1000 }, (_, i) => ({
      id: i,
      title: `Item ${i}`,
      description: `Description for item ${i}`
    }));

    const startTime = performance.now();
    render(<LargeList items={items} />);
    const endTime = performance.now();

    const renderTime = endTime - startTime;
    expect(renderTime).toBeLessThan(100);
  });
});
```

#### Backend - Rendimiento de APIs
```typescript
// src/routes/__tests__/performance.test.ts
import request from 'supertest';
import { app } from '../../app';

describe('API Performance', () => {
  it('responds to GET /users in under 200ms', async () => {
    const startTime = Date.now();
    
    const response = await request(app).get('/users');
    
    const responseTime = Date.now() - startTime;
    
    expect(response.status).toBe(200);
    expect(responseTime).toBeLessThan(200);
  });

  it('handles 100 concurrent requests', async () => {
    const requests = Array.from({ length: 100 }, () =>
      request(app).get('/users')
    );

    const startTime = Date.now();
    const responses = await Promise.all(requests);
    const totalTime = Date.now() - startTime;

    expect(responses).toHaveLength(100);
    expect(responses.every(r => r.status === 200)).toBe(true);
    expect(totalTime).toBeLessThan(5000); // 5 segundos máximo
  });
});
```

## Configuración de Testing

### Jest Configuration Frontend
```javascript
// jest.config.js
module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|expo|@expo|@react-navigation)/)'
  ],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{ts,tsx}',
    '!src/**/*.test.{ts,tsx}'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  testEnvironment: 'node',
  testMatch: [
    '**/__tests__/**/*.{ts,tsx}',
    '**/*.{test,spec}.{ts,tsx}'
  ]
};
```

### Jest Configuration Backend
```javascript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: [
    '**/__tests__/**/*.ts',
    '**/*.{test,spec}.ts'
  ],
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/*.test.ts'
  ],
  coverageThreshold: {
    global: {
      branches: 85,
      functions: 85,
      lines: 85,
      statements: 85
    }
  },
  setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts']
};
```

### Setup de Testing
```typescript
// src/setupTests.ts
import '@testing-library/jest-native/extend-expect';
import { jest } from '@jest/globals';

// Mock de AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock de Expo SecureStore
jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

// Mock de Expo Notifications
jest.mock('expo-notifications', () => ({
  getPermissionsAsync: jest.fn(),
  requestPermissionsAsync: jest.fn(),
  getExpoPushTokenAsync: jest.fn(),
}));

// Mock de Socket.IO
jest.mock('socket.io-client', () => ({
  io: jest.fn(() => ({
    on: jest.fn(),
    emit: jest.fn(),
    disconnect: jest.fn(),
  })),
}));
```

## Mocking y Stubbing

### Mock de APIs
```typescript
// src/__mocks__/api.ts
export const mockApi = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
};

export const mockApiResponse = (data: any, status = 200) => ({
  data,
  status,
  statusText: 'OK',
});

// Configurar respuestas por defecto
mockApi.get.mockResolvedValue(mockApiResponse([]));
mockApi.post.mockResolvedValue(mockApiResponse({ id: '1' }));
```

### Mock de Firebase
```typescript
// src/__mocks__/firebase.ts
export const mockFirestore = {
  collection: jest.fn(() => ({
    doc: jest.fn(() => ({
      get: jest.fn(),
      set: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    })),
    add: jest.fn(),
    where: jest.fn(() => ({
      orderBy: jest.fn(() => ({
        limit: jest.fn(() => ({
          get: jest.fn(),
        })),
      })),
    })),
  })),
};

export const mockAuth = {
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  currentUser: {
    uid: 'test-uid',
    email: 'test@example.com',
  },
};
```

## Testing de Componentes UI

### Testing de Componentes con Props
```typescript
// src/components/Button.test.tsx
describe('Button Component Props', () => {
  it('renders with different variants', () => {
    const { rerender, getByTestId } = render(
      <Button variant="primary" testID="button" />
    );
    
    let button = getByTestId('button');
    expect(button.props.style).toContainEqual(
      expect.objectContaining({ backgroundColor: expect.any(String) })
    );

    rerender(<Button variant="secondary" testID="button" />);
    button = getByTestId('button');
    expect(button.props.style).toContainEqual(
      expect.objectContaining({ backgroundColor: expect.any(String) })
    );
  });

  it('handles disabled state', () => {
    const mockOnPress = jest.fn();
    const { getByTestId } = render(
      <Button disabled testID="button" onPress={mockOnPress} />
    );
    
    const button = getByTestId('button');
    fireEvent.press(button);
    
    expect(mockOnPress).not.toHaveBeenCalled();
    expect(button.props.disabled).toBe(true);
  });
});
```

### Testing de Formularios
```typescript
// src/components/LoginForm.test.tsx
describe('LoginForm Component', () => {
  it('validates required fields', async () => {
    const mockOnSubmit = jest.fn();
    const { getByText, getByTestId } = render(
      <LoginForm onSubmit={mockOnSubmit} />
    );
    
    const submitButton = getByTestId('submit-button');
    fireEvent.press(submitButton);
    
    await waitFor(() => {
      expect(getByText('Email is required')).toBeVisible();
      expect(getByText('Password is required')).toBeVisible();
    });
    
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('submits form with valid data', async () => {
    const mockOnSubmit = jest.fn();
    const { getByTestId, getByPlaceholderText } = render(
      <LoginForm onSubmit={mockOnSubmit} />
    );
    
    const emailInput = getByPlaceholderText('Email');
    const passwordInput = getByPlaceholderText('Password');
    const submitButton = getByTestId('submit-button');
    
    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.press(submitButton);
    
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      });
    });
  });
});
```

## Testing de Hooks Personalizados

### Testing de Estado y Efectos
```typescript
// src/hooks/useLocalStorage.test.ts
describe('useLocalStorage Hook', () => {
  it('initializes with default value', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'));
    
    expect(result.current[0]).toBe('default');
  });

  it('updates value and persists to storage', async () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'));
    
    act(() => {
      result.current[1]('new-value');
    });
    
    expect(result.current[0]).toBe('new-value');
    
    // Verificar que se guardó en AsyncStorage
    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('test-key', 'new-value');
    });
  });
});
```

## Testing de Integración con APIs

### Testing de Servicios
```typescript
// src/services/apiService.test.ts
describe('ApiService Integration', () => {
  beforeEach(() => {
    // Limpiar mocks antes de cada test
    jest.clearAllMocks();
  });

  it('handles successful API response', async () => {
    const mockData = { id: 1, name: 'Test User' };
    mockApi.get.mockResolvedValue(mockApiResponse(mockData));
    
    const result = await ApiService.getUser(1);
    
    expect(result).toEqual(mockData);
    expect(mockApi.get).toHaveBeenCalledWith('/users/1');
  });

  it('handles API errors gracefully', async () => {
    const errorMessage = 'User not found';
    mockApi.get.mockRejectedValue({
      response: { status: 404, data: { message: errorMessage } }
    });
    
    await expect(ApiService.getUser(999)).rejects.toThrow(errorMessage);
  });
});
```

## Testing de Navegación

### Testing de React Navigation
```typescript
// src/navigation/__tests__/navigation.test.tsx
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

const TestNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);

describe('Navigation', () => {
  it('navigates between screens', async () => {
    const { getByText } = render(<TestNavigator />);
    
    // Navegar a Profile
    fireEvent.press(getByText('Go to Profile'));
    
    await waitFor(() => {
      expect(getByText('Profile Screen')).toBeVisible();
    });
  });
});
```

## Coverage y Reporting

### Configuración de Coverage
```json
// package.json
{
  "scripts": {
    "test:coverage": "jest --coverage --coverageReporters=text --coverageReporters=lcov",
    "test:coverage:watch": "jest --coverage --watch",
    "test:coverage:html": "jest --coverage --coverageReporters=html"
  }
}
```

### Reportes de Coverage
```typescript
// jest.config.js
module.exports = {
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.test.{ts,tsx}',
    '!src/**/*.stories.{ts,tsx}',
    '!src/test/**/*',
    '!src/**/index.ts'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: [
    'text',
    'lcov',
    'html',
    'json'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    },
    './src/components/': {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90
    }
  }
};
```

## Testing en CI/CD

### GitHub Actions
```yaml
# .github/workflows/test.yml
name: Testing

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm run test:coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info

  test-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm run test:coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info
```

## Scripts de Testing

### Package.json Scripts
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:coverage:watch": "jest --coverage --watch",
    "test:coverage:html": "jest --coverage --coverageReporters=html",
    "test:ci": "jest --ci --coverage --watchAll=false",
    "test:debug": "node --inspect-brk node_modules/.bin/jest --runInBand",
    "test:update": "jest --updateSnapshot",
    "test:clear": "jest --clearCache",
    "test:verbose": "jest --verbose"
  }
}
```

## Roadmap de Testing

### Implementaciones Pendientes
- [ ] Testing de componentes con animaciones
- [ ] Testing de performance con Lighthouse
- [ ] Testing de accesibilidad con axe-core
- [ ] Testing de seguridad con OWASP ZAP
- [ ] Testing de compatibilidad cross-platform
- [ ] Testing de offline/online scenarios
- [ ] Testing de internacionalización
- [ ] Testing de temas (light/dark mode)

### Mejoras Futuras
- [ ] Testing visual con Percy
- [ ] Testing de regresión visual
- [ ] Testing de carga con Artillery
- [ ] Testing de stress con k6
- [ ] Testing de mutación con Stryker
- [ ] Testing de contrato con Pact
- [ ] Testing de API con Postman Collections
- [ ] Testing de base de datos con Testcontainers

## Archivos Relacionados

- `jest.config.js`
- `src/setupTests.ts`
- `src/__mocks__/`
- `src/**/*.test.{ts,tsx}`
- `src/**/*.spec.{ts,tsx}`
- `.github/workflows/test.yml`
- `coverage/`
- `package.json` (scripts de testing)
