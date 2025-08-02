# 🚀 PLAN DE IMPLEMENTACIÓN POR BLOQUES - APP MÓVIL MUSSIKON

## 📋 METODOLOGÍA DE TRABAJO

### Principios Fundamentales
1. **Implementación por bloques funcionales**
2. **Pruebas después de cada bloque**
3. **Sin commits sin testing**
4. **Documentación de cada cambio**
5. **Compatibilidad con backend existente**

### Estructura de Bloques
- **BLOQUE 1**: Corrección de tipos y estructura de datos
- **BLOQUE 2**: Sistema de pagos completo
- **BLOQUE 3**: Validaciones y testing
- **BLOQUE 4**: Documentación y optimización

---

## 🎯 BLOQUE 1: CORRECCIÓN DE TIPOS Y ESTRUCTURA

### Objetivo
Alinear completamente las interfaces de datos entre frontend y backend para que la comunicación sea 100% funcional.

### Archivos a Modificar

#### 1.1 Corregir Tipos de Datos
**Archivo**: `src/appTypes/DatasTypes.ts`
```typescript
// AGREGAR tipos de pagos
export interface UserBalance {
  userId: string;
  balance: number;
  currency: string;
  lastUpdated: string;
  totalDeposits: number;
  totalWithdrawals: number;
  totalEarnings: number;
}

export interface BankAccount {
  id: string;
  userId: string;
  accountHolder: string;
  accountNumber: string;
  bankName: string;
  accountType: 'savings' | 'checking';
  isVerified: boolean;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserDeposit {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  voucherFile: {
    url: string;
    filename: string;
    uploadedAt: string;
  };
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface MusicianEarnings {
  id: string;
  musicianId: string;
  eventId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'available' | 'withdrawn';
  createdAt: string;
  updatedAt: string;
}

export interface WithdrawalRequest {
  id: string;
  musicianId: string;
  amount: number;
  currency: string;
  bankAccountId: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

// ACTUALIZAR RootStackParamList
export type RootStackParamList = {
  // ... existente
  PaymentBalance: undefined;
  BankAccounts: undefined;
  Deposit: undefined;
  Withdraw: undefined;
  PaymentHistory: undefined;
  BankAccountRegister: undefined;
};
```

#### 1.2 Corregir RequestService
**Archivo**: `src/services/requests.ts`
```typescript
// CORREGIR interfaces
export interface Request {
  id: string;
  eventName: string; // Cambiar de requestName
  eventType: string;
  user: string; // email del organizador
  date: string;
  time: string;
  location: {
    address: string;
    latitude: number;
    longitude: number;
  };
  duration: number;
  instrument: string;
  budget: number;
  status: 'pending_musician' | 'musician_assigned' | 'completed' | 'cancelled';
  assignedMusicianId?: string;
  interestedMusicians?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateRequestData {
  eventName: string; // Cambiar de requestName
  eventType: string;
  date: string;
  time: string;
  location: {
    address: string;
    latitude: number;
    longitude: number;
  };
  duration: number;
  instrument: string;
  budget: number;
  description: string;
  musicGenre: string;
  guestCount: number;
  specialRequirements: string;
  additionalComments: string;
  paymentMethod: string;
  paymentTerms: string;
}

// CORREGIR métodos del servicio
export const requestService = {
  async createRequest(requestData: CreateRequestData): Promise<ApiResponse<Request>> {
    // Mapear datos correctamente para el backend
    const eventData = {
      eventName: requestData.eventName,
      eventType: requestData.eventType,
      date: requestData.date,
      time: requestData.time,
      location: requestData.location.address, // Backend espera string
      duration: requestData.duration.toString(),
      instrument: requestData.instrument,
      budget: requestData.budget.toString(),
      comment: requestData.additionalComments,
      songs: [],
      recommendations: [],
      mapsLink: '',
      bringInstrument: false,
    };
    
    return apiService.post(API_CONFIG.ENDPOINTS.CREATE_REQUEST, eventData);
  },

  // ... resto de métodos corregidos
};
```

#### 1.3 Actualizar Configuración API
**Archivo**: `src/config/apiConfig.ts`
```typescript
export const API_CONFIG = {
  // CAMBIAR URL para producción
  BASE_URL: 'https://tu-dominio-produccion.com',
  
  ENDPOINTS: {
    // ... existente
    
    // AGREGAR endpoints de pagos
    PAYMENT_BALANCE: '/payments/my-balance',
    BANK_ACCOUNTS_REGISTER: '/bank-accounts/register',
    BANK_ACCOUNTS_MY: '/bank-accounts/my-accounts',
    PAYMENT_DEPOSIT: '/payments/deposit',
    PAYMENT_MY_DEPOSITS: '/payments/my-deposits',
    PAYMENT_PAY_MUSICIAN: '/events/:eventId/pay-musician',
    PAYMENT_MUSICIAN_EARNINGS: '/musicians/earnings',
    PAYMENT_WITHDRAW: '/musicians/withdraw-earnings',
  },
};
```

### Testing del Bloque 1
- [ ] Verificar que los tipos compilan sin errores
- [ ] Probar creación de solicitud con datos corregidos
- [ ] Verificar que la respuesta del backend se mapea correctamente
- [ ] Probar listado de solicitudes con nuevos campos

---

## 🎯 BLOQUE 2: SISTEMA DE PAGOS COMPLETO

### Objetivo
Implementar completamente el sistema de pagos con todas las funcionalidades del backend.

### Archivos a Crear/Modificar

#### 2.1 Crear PaymentService
**Archivo**: `src/services/paymentService.ts`
```typescript
import { apiService, ApiResponse } from './api';
import { getApiUrl, API_CONFIG } from '../config/apiConfig';
import { 
  UserBalance, 
  BankAccount, 
  UserDeposit, 
  MusicianEarnings, 
  WithdrawalRequest 
} from '../appTypes/DatasTypes';

export interface BankAccountData {
  accountHolder: string;
  accountNumber: string;
  bankName: string;
  accountType: 'savings' | 'checking';
  routingNumber?: string;
}

export interface DepositRequest {
  amount: number;
  voucherFile: any; // File object
  description?: string;
}

export interface WithdrawalRequestData {
  bankAccountId: string;
  amount: number;
  description?: string;
}

export const paymentService = {
  // Obtener balance del usuario
  async getUserBalance(): Promise<ApiResponse<UserBalance>> {
    return apiService.get(API_CONFIG.ENDPOINTS.PAYMENT_BALANCE);
  },

  // Registrar cuenta bancaria
  async registerBankAccount(accountData: BankAccountData): Promise<ApiResponse<BankAccount>> {
    return apiService.post(API_CONFIG.ENDPOINTS.BANK_ACCOUNTS_REGISTER, accountData);
  },

  // Obtener cuentas bancarias del usuario
  async getUserBankAccounts(): Promise<ApiResponse<BankAccount[]>> {
    return apiService.get(API_CONFIG.ENDPOINTS.BANK_ACCOUNTS_MY);
  },

  // Subir comprobante de depósito
  async uploadDepositVoucher(depositData: DepositRequest): Promise<ApiResponse<UserDeposit>> {
    const formData = new FormData();
    formData.append('amount', depositData.amount.toString());
    formData.append('voucherFile', depositData.voucherFile);
    if (depositData.description) {
      formData.append('description', depositData.description);
    }
    
    return apiService.postFormData(API_CONFIG.ENDPOINTS.PAYMENT_DEPOSIT, formData);
  },

  // Obtener historial de depósitos
  async getUserDeposits(): Promise<ApiResponse<UserDeposit[]>> {
    return apiService.get(API_CONFIG.ENDPOINTS.PAYMENT_MY_DEPOSITS);
  },

  // Pagar a músico por evento
  async payMusicianForEvent(eventId: string, musicianId: string, amount: number): Promise<ApiResponse<any>> {
    const url = API_CONFIG.ENDPOINTS.PAYMENT_PAY_MUSICIAN.replace(':eventId', eventId);
    return apiService.post(url, { musicianId, amount });
  },

  // Obtener ganancias del músico
  async getMusicianEarnings(): Promise<ApiResponse<MusicianEarnings[]>> {
    return apiService.get(API_CONFIG.ENDPOINTS.PAYMENT_MUSICIAN_EARNINGS);
  },

  // Solicitar retiro de ganancias
  async requestWithdrawal(withdrawalData: WithdrawalRequestData): Promise<ApiResponse<WithdrawalRequest>> {
    return apiService.post(API_CONFIG.ENDPOINTS.PAYMENT_WITHDRAW, withdrawalData);
  },
};
```

#### 2.2 Crear Pantallas de Pagos

**Archivo**: `src/screens/payments/PaymentBalanceScreen.tsx`
```typescript
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useTheme } from '@contexts/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { paymentService } from '@services/paymentService';
import { UserBalance } from '@appTypes/DatasTypes';

const PaymentBalanceScreen: React.FC = ({ navigation }: any) => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [balance, setBalance] = useState<UserBalance | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBalance();
  }, []);

  const loadBalance = async () => {
    try {
      setLoading(true);
      const response = await paymentService.getUserBalance();
      if (response.success && response.data) {
        setBalance(response.data);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo cargar el balance');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Mi Balance</Text>
      </View>

      {balance && (
        <View style={styles.balanceCard}>
          <Text style={[styles.balanceAmount, { color: theme.colors.primary }]}>
            RD$ {balance.balance.toLocaleString()}
          </Text>
          <Text style={[styles.balanceLabel, { color: theme.colors.textSecondary }]}>
            Balance Disponible
          </Text>
        </View>
      )}

      <View style={styles.actionsContainer}>
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
          onPress={() => navigation.navigate('Deposit')}
        >
          <Ionicons name="add-circle" size={24} color="white" />
          <Text style={styles.actionButtonText}>Depositar</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: theme.colors.secondary }]}
          onPress={() => navigation.navigate('Withdraw')}
        >
          <Ionicons name="remove-circle" size={24} color="white" />
          <Text style={styles.actionButtonText}>Retirar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: theme.colors.success }]}>
            RD$ {balance?.totalDeposits.toLocaleString() || '0'}
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
            Total Depositado
          </Text>
        </View>

        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: theme.colors.warning }]}>
            RD$ {balance?.totalWithdrawals.toLocaleString() || '0'}
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
            Total Retirado
          </Text>
        </View>

        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: theme.colors.info }]}>
            RD$ {balance?.totalEarnings.toLocaleString() || '0'}
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
            Total Ganado
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  balanceCard: {
    alignItems: 'center',
    padding: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginBottom: 30,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  balanceLabel: {
    fontSize: 16,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    minWidth: 120,
    justifyContent: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
});

export default PaymentBalanceScreen;
```

**Archivo**: `src/screens/payments/DepositScreen.tsx`
```typescript
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { useTheme } from '@contexts/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { paymentService } from '@services/paymentService';

const DepositScreen: React.FC = ({ navigation }: any) => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0]);
    }
  };

  const handleSubmit = async () => {
    if (!amount || !selectedImage) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    try {
      setLoading(true);
      
      // Crear archivo para FormData
      const file = {
        uri: selectedImage.uri,
        type: 'image/jpeg',
        name: 'voucher.jpg',
      };

      const response = await paymentService.uploadDepositVoucher({
        amount: parseFloat(amount),
        voucherFile: file,
        description,
      });

      if (response.success) {
        Alert.alert(
          'Éxito',
          'Comprobante subido correctamente. Será verificado por el administrador.',
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo subir el comprobante');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.colors.text }]}>Depositar</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: theme.colors.text }]}>Monto (RD$)</Text>
          <TextInput
            style={[styles.input, { 
              backgroundColor: theme.colors.surface,
              color: theme.colors.text,
              borderColor: theme.colors.border 
            }]}
            value={amount}
            onChangeText={setAmount}
            placeholder="0.00"
            placeholderTextColor={theme.colors.textSecondary}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: theme.colors.text }]}>Descripción (opcional)</Text>
          <TextInput
            style={[styles.input, { 
              backgroundColor: theme.colors.surface,
              color: theme.colors.text,
              borderColor: theme.colors.border 
            }]}
            value={description}
            onChangeText={setDescription}
            placeholder="Descripción del depósito"
            placeholderTextColor={theme.colors.textSecondary}
            multiline
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: theme.colors.text }]}>Comprobante</Text>
          <TouchableOpacity 
            style={[styles.imagePicker, { 
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border 
            }]}
            onPress={pickImage}
          >
            {selectedImage ? (
              <View style={styles.selectedImage}>
                <Ionicons name="checkmark-circle" size={24} color={theme.colors.success} />
                <Text style={[styles.selectedImageText, { color: theme.colors.text }]}>
                  Imagen seleccionada
                </Text>
              </View>
            ) : (
              <View style={styles.imagePickerContent}>
                <Ionicons name="camera" size={32} color={theme.colors.textSecondary} />
                <Text style={[styles.imagePickerText, { color: theme.colors.textSecondary }]}>
                  Seleccionar comprobante
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={[
            styles.submitButton, 
            { 
              backgroundColor: theme.colors.primary,
              opacity: loading ? 0.7 : 1 
            }
          ]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.submitButtonText}>Subir Comprobante</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  imagePicker: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePickerContent: {
    alignItems: 'center',
  },
  imagePickerText: {
    marginTop: 8,
    fontSize: 16,
  },
  selectedImage: {
    alignItems: 'center',
  },
  selectedImageText: {
    marginTop: 8,
    fontSize: 16,
  },
  submitButton: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DepositScreen;
```

#### 2.3 Actualizar Navegación
**Archivo**: `src/app/App.tsx`
```typescript
// AGREGAR imports de pantallas de pagos
import PaymentBalanceScreen from '@screens/payments/PaymentBalanceScreen';
import DepositScreen from '@screens/payments/DepositScreen';
import WithdrawScreen from '@screens/payments/WithdrawScreen';
import BankAccountsScreen from '@screens/payments/BankAccountsScreen';

// AGREGAR rutas en el Stack Navigator
<Stack.Screen 
  name="PaymentBalance" 
  component={PaymentBalanceScreen}
  options={{ headerShown: false }}
/>
<Stack.Screen 
  name="Deposit" 
  component={DepositScreen}
  options={{ headerShown: false }}
/>
<Stack.Screen 
  name="Withdraw" 
  component={WithdrawScreen}
  options={{ headerShown: false }}
/>
<Stack.Screen 
  name="BankAccounts" 
  component={BankAccountsScreen}
  options={{ headerShown: false }}
/>
```

### Testing del Bloque 2
- [ ] Probar obtención de balance
- [ ] Probar subida de comprobante de depósito
- [ ] Probar registro de cuenta bancaria
- [ ] Probar solicitud de retiro
- [ ] Verificar navegación entre pantallas

---

## 🎯 BLOQUE 3: VALIDACIONES Y TESTING

### Objetivo
Implementar validaciones robustas y testing completo del sistema.

### Archivos a Crear/Modificar

#### 3.1 Crear Esquemas de Validación
**Archivo**: `src/utils/validationSchemas.ts`
```typescript
import * as Yup from 'yup';

export const createRequestSchema = Yup.object({
  eventName: Yup.string()
    .required('Nombre del evento es requerido')
    .min(3, 'Mínimo 3 caracteres')
    .max(100, 'Máximo 100 caracteres'),
  
  eventType: Yup.string()
    .required('Tipo de evento es requerido'),
  
  date: Yup.string()
    .required('Fecha es requerida'),
  
  time: Yup.string()
    .required('Hora es requerida'),
  
  location: Yup.object({
    address: Yup.string()
      .required('Dirección es requerida')
      .min(10, 'Dirección muy corta'),
    latitude: Yup.number()
      .required('Latitud es requerida')
      .min(-90, 'Latitud inválida')
      .max(90, 'Latitud inválida'),
    longitude: Yup.number()
      .required('Longitud es requerida')
      .min(-180, 'Longitud inválida')
      .max(180, 'Longitud inválida'),
  }),
  
  duration: Yup.number()
    .required('Duración es requerida')
    .min(30, 'Mínimo 30 minutos')
    .max(480, 'Máximo 8 horas'),
  
  instrument: Yup.string()
    .required('Instrumento es requerido'),
  
  budget: Yup.number()
    .required('Presupuesto es requerido')
    .min(1000, 'Presupuesto mínimo RD$ 1,000')
    .max(100000, 'Presupuesto máximo RD$ 100,000'),
  
  description: Yup.string()
    .max(500, 'Máximo 500 caracteres'),
  
  musicGenre: Yup.string()
    .max(100, 'Máximo 100 caracteres'),
  
  guestCount: Yup.number()
    .min(1, 'Mínimo 1 invitado')
    .max(1000, 'Máximo 1000 invitados'),
  
  specialRequirements: Yup.string()
    .max(300, 'Máximo 300 caracteres'),
  
  additionalComments: Yup.string()
    .max(500, 'Máximo 500 caracteres'),
  
  paymentMethod: Yup.string()
    .required('Método de pago es requerido'),
  
  paymentTerms: Yup.string()
    .required('Términos de pago son requeridos'),
});

export const depositSchema = Yup.object({
  amount: Yup.number()
    .required('Monto es requerido')
    .min(100, 'Monto mínimo RD$ 100')
    .max(100000, 'Monto máximo RD$ 100,000'),
  
  description: Yup.string()
    .max(200, 'Máximo 200 caracteres'),
});

export const bankAccountSchema = Yup.object({
  accountHolder: Yup.string()
    .required('Titular de cuenta es requerido')
    .min(3, 'Mínimo 3 caracteres')
    .max(100, 'Máximo 100 caracteres'),
  
  accountNumber: Yup.string()
    .required('Número de cuenta es requerido')
    .min(8, 'Número de cuenta muy corto')
    .max(20, 'Número de cuenta muy largo'),
  
  bankName: Yup.string()
    .required('Nombre del banco es requerido')
    .min(3, 'Mínimo 3 caracteres')
    .max(50, 'Máximo 50 caracteres'),
  
  accountType: Yup.string()
    .required('Tipo de cuenta es requerido')
    .oneOf(['savings', 'checking'], 'Tipo de cuenta inválido'),
  
  routingNumber: Yup.string()
    .max(20, 'Máximo 20 caracteres'),
});

export const withdrawalSchema = Yup.object({
  bankAccountId: Yup.string()
    .required('Cuenta bancaria es requerida'),
  
  amount: Yup.number()
    .required('Monto es requerido')
    .min(100, 'Monto mínimo RD$ 100')
    .max(100000, 'Monto máximo RD$ 100,000'),
  
  description: Yup.string()
    .max(200, 'Máximo 200 caracteres'),
});
```

#### 3.2 Crear Hooks de Validación
**Archivo**: `src/hooks/useFormValidation.ts`
```typescript
import { useState } from 'react';
import { ValidationError } from 'yup';

export const useFormValidation = <T>(schema: any) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValidating, setIsValidating] = useState(false);

  const validate = async (data: T): Promise<boolean> => {
    try {
      setIsValidating(true);
      setErrors({});
      await schema.validate(data, { abortEarly: false });
      return true;
    } catch (error) {
      if (error instanceof ValidationError) {
        const newErrors: Record<string, string> = {};
        error.inner.forEach((err) => {
          if (err.path) {
            newErrors[err.path] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    } finally {
      setIsValidating(false);
    }
  };

  const clearErrors = () => {
    setErrors({});
  };

  const getFieldError = (fieldName: string): string => {
    return errors[fieldName] || '';
  };

  return {
    errors,
    isValidating,
    validate,
    clearErrors,
    getFieldError,
  };
};
```

#### 3.3 Crear Tests Unitarios
**Archivo**: `src/__tests__/services/requests.test.ts`
```typescript
import { requestService } from '../../services/requests';
import { apiService } from '../../services/api';

// Mock apiService
jest.mock('../../services/api');

describe('RequestService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createRequest', () => {
    it('should create request successfully', async () => {
      const mockRequestData = {
        eventName: 'Test Event',
        eventType: 'boda',
        date: '2024-12-25',
        time: '20:00 - 22:00',
        location: {
          address: 'Test Address',
          latitude: 18.4861,
          longitude: -69.9312,
        },
        duration: 120,
        instrument: 'guitarra',
        budget: 5000,
        description: 'Test description',
        musicGenre: 'Pop',
        guestCount: 100,
        specialRequirements: 'None',
        additionalComments: 'Test comments',
        paymentMethod: 'transfer',
        paymentTerms: '50% advance',
      };

      const mockResponse = {
        success: true,
        data: {
          id: 'test-id',
          ...mockRequestData,
        },
      };

      (apiService.post as jest.Mock).mockResolvedValue(mockResponse);

      const result = await requestService.createRequest(mockRequestData);

      expect(apiService.post).toHaveBeenCalledWith(
        '/events/request-musician',
        expect.objectContaining({
          eventName: mockRequestData.eventName,
          eventType: mockRequestData.eventType,
          location: mockRequestData.location.address,
        })
      );

      expect(result).toEqual(mockResponse);
    });

    it('should handle API errors', async () => {
      const mockError = new Error('API Error');
      (apiService.post as jest.Mock).mockRejectedValue(mockError);

      await expect(requestService.createRequest({} as any)).rejects.toThrow('API Error');
    });
  });
});
```

### Testing del Bloque 3
- [ ] Probar validaciones de formularios
- [ ] Ejecutar tests unitarios
- [ ] Probar manejo de errores
- [ ] Verificar mensajes de error

---

## 🎯 BLOQUE 4: DOCUMENTACIÓN Y OPTIMIZACIÓN

### Objetivo
Documentar completamente el sistema y optimizar el rendimiento.

### Archivos a Crear/Modificar

#### 4.1 Actualizar README Principal
**Archivo**: `README.md`
```markdown
# 🎵 MusikOn - App Móvil

## 📱 Descripción

Aplicación móvil para conectar músicos con organizadores de eventos, con sistema completo de pagos y gestión de solicitudes.

## 🚀 Características

- ✅ **Sistema de Solicitudes**: Crear y gestionar solicitudes de músicos
- ✅ **Sistema de Pagos**: Depósitos, retiros y pagos a músicos
- ✅ **Autenticación**: Login/registro con roles
- ✅ **Navegación**: Sistema de navegación completo
- ✅ **Tema**: Soporte para modo claro/oscuro
- ✅ **Validaciones**: Formularios con validación robusta

## 📋 Requisitos

- Node.js 16+
- Expo CLI
- Cuenta de Firebase
- Backend MusikOn funcionando

## 🛠️ Instalación

1. **Clonar repositorio**
```bash
git clone <repo-url>
cd app_mussikon_react_native_expo
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
# Editar .env con tus configuraciones
```

4. **Ejecutar aplicación**
```bash
npm start
```

## 🏗️ Estructura del Proyecto

```
src/
├── app/                    # Configuración de la app
├── components/             # Componentes reutilizables
├── screens/               # Pantallas de la aplicación
│   ├── auth/             # Autenticación
│   ├── events/           # Gestión de eventos
│   ├── payments/         # Sistema de pagos
│   └── ...
├── services/             # Servicios de API
├── hooks/                # Hooks personalizados
├── utils/                # Utilidades y helpers
├── types/                # Tipos TypeScript
└── theme/                # Configuración de temas
```

## 🔧 Configuración

### Variables de Entorno

```env
# API Configuration
API_BASE_URL=https://tu-backend.com
API_TIMEOUT=10000

# Firebase Configuration
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_auth_domain
FIREBASE_PROJECT_ID=your_project_id

# Storage Configuration
STORAGE_BUCKET=your_storage_bucket
```

### Configuración de API

El archivo `src/config/apiConfig.ts` contiene toda la configuración de endpoints:

```typescript
export const API_CONFIG = {
  BASE_URL: 'https://tu-backend.com',
  ENDPOINTS: {
    // Eventos
    CREATE_REQUEST: '/events/request-musician',
    MY_EVENTS: '/events/my-events',
    // Pagos
    PAYMENT_BALANCE: '/payments/my-balance',
    PAYMENT_DEPOSIT: '/payments/deposit',
    // ...
  }
};
```

## 📱 Pantallas Principales

### Autenticación
- **Login**: Inicio de sesión
- **Register**: Registro de usuarios

### Eventos
- **ShareMusicianScreen**: Crear solicitud de músico
- **MyRequestsList**: Listar mis solicitudes
- **AvailableRequestsScreen**: Solicitudes disponibles (músicos)
- **RequestDetail**: Detalles de solicitud
- **EditRequest**: Editar solicitud

### Pagos
- **PaymentBalanceScreen**: Ver balance
- **DepositScreen**: Subir depósito
- **WithdrawScreen**: Solicitar retiro
- **BankAccountsScreen**: Gestionar cuentas bancarias

## 🔌 Servicios

### RequestService
Gestiona todas las operaciones relacionadas con solicitudes de eventos.

```typescript
import { requestService } from '@services/requests';

// Crear solicitud
const response = await requestService.createRequest(requestData);

// Obtener mis solicitudes
const requests = await requestService.getMyRequests();
```

### PaymentService
Gestiona todas las operaciones de pagos.

```typescript
import { paymentService } from '@services/paymentService';

// Obtener balance
const balance = await paymentService.getUserBalance();

// Subir depósito
const deposit = await paymentService.uploadDepositVoucher(depositData);
```

## 🎨 Temas

La aplicación soporta temas claro y oscuro:

```typescript
import { useTheme } from '@contexts/ThemeContext';

const { theme, isDark, toggleTheme } = useTheme();
```

## 🧪 Testing

### Ejecutar Tests
```bash
npm test
```

### Tests Disponibles
- Tests unitarios de servicios
- Tests de validación
- Tests de componentes

## 📦 Build y Deploy

### Android
```bash
expo build:android
```

### iOS
```bash
expo build:ios
```

## 🐛 Troubleshooting

### Problemas Comunes

1. **Error de conexión API**
   - Verificar URL en `apiConfig.ts`
   - Verificar que el backend esté funcionando

2. **Error de autenticación**
   - Verificar token en AsyncStorage
   - Verificar configuración de Firebase

3. **Error de imágenes**
   - Verificar permisos de cámara/galería
   - Verificar configuración de Expo ImagePicker

## 🤝 Contribución

1. Fork el proyecto
2. Crear rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para detalles.

## 📞 Soporte

Para soporte técnico, contactar:
- Email: soporte@mussikon.com
- Discord: [Servidor MusikOn](https://discord.gg/mussikon)
```

#### 4.2 Crear Documentación de API
**Archivo**: `docs/API_INTEGRATION.md`
```markdown
# 🔌 Integración con API - MusikOn Mobile

## 📋 Endpoints Principales

### Autenticación
- `POST /auth/login` - Iniciar sesión
- `POST /auth/register` - Registrarse
- `GET /auth/refresh` - Renovar token

### Eventos/Solicitudes
- `POST /events/request-musician` - Crear solicitud
- `GET /events/my-events` - Mis eventos
- `GET /events/available-requests` - Solicitudes disponibles
- `POST /events/:eventId/accept` - Aceptar solicitud
- `PATCH /events/:eventId/cancel` - Cancelar solicitud

### Pagos
- `GET /payments/my-balance` - Obtener balance
- `POST /payments/deposit` - Subir depósito
- `GET /payments/my-deposits` - Mis depósitos
- `POST /events/:eventId/pay-musician` - Pagar músico
- `GET /musicians/earnings` - Ganancias del músico
- `POST /musicians/withdraw-earnings` - Solicitar retiro

## 🔧 Configuración

### Headers Requeridos
```typescript
const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`,
};
```

### Manejo de Errores
```typescript
try {
  const response = await apiService.post('/endpoint', data);
  if (response.success) {
    // Manejar éxito
  } else {
    // Manejar error de negocio
  }
} catch (error) {
  // Manejar error de red/API
}
```

## 📊 Estructura de Respuestas

### Respuesta Exitosa
```json
{
  "success": true,
  "data": {
    // Datos de la respuesta
  },
  "message": "Operación exitosa"
}
```

### Respuesta de Error
```json
{
  "success": false,
  "error": "Mensaje de error",
  "code": "ERROR_CODE"
}
```

## 🔐 Autenticación

### Flujo de Login
1. Usuario envía credenciales
2. Servidor valida y devuelve JWT
3. App almacena token en AsyncStorage
4. Token se incluye en todas las peticiones

### Renovación de Token
- Token expira en 24 horas
- App debe renovar automáticamente
- Si falla renovación, redirigir a login

## 📱 Estados de Carga

### Implementación Recomendada
```typescript
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

const handleRequest = async () => {
  setLoading(true);
  setError(null);
  
  try {
    const response = await apiService.post('/endpoint', data);
    // Manejar respuesta
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};
```

## 🎯 Mejores Prácticas

1. **Siempre manejar errores** en todas las peticiones
2. **Mostrar estados de carga** para mejor UX
3. **Validar datos** antes de enviar al servidor
4. **Usar tipos TypeScript** para mejor desarrollo
5. **Implementar retry logic** para peticiones críticas
```

### Testing del Bloque 4
- [ ] Verificar documentación completa
- [ ] Probar optimizaciones de rendimiento
- [ ] Verificar que todo funciona en producción
- [ ] Validar que la documentación es clara para otras IAs

---

## 📊 CRONOGRAMA DE IMPLEMENTACIÓN

### Semana 1: Bloque 1
- [ ] Día 1-2: Corregir tipos de datos
- [ ] Día 3-4: Actualizar servicios
- [ ] Día 5: Testing y correcciones

### Semana 2: Bloque 2
- [ ] Día 1-3: Implementar sistema de pagos
- [ ] Día 4-5: Crear pantallas de pagos

### Semana 3: Bloque 3
- [ ] Día 1-2: Implementar validaciones
- [ ] Día 3-4: Crear tests
- [ ] Día 5: Testing completo

### Semana 4: Bloque 4
- [ ] Día 1-2: Documentación
- [ ] Día 3-4: Optimización
- [ ] Día 5: Testing final y deploy

## 🎯 CRITERIOS DE ÉXITO

### Funcionalidad
- [ ] Todas las pantallas funcionan correctamente
- [ ] Sistema de pagos 100% funcional
- [ ] Validaciones robustas implementadas
- [ ] Manejo de errores completo

### Calidad
- [ ] Código limpio y bien documentado
- [ ] Tests unitarios > 80% cobertura
- [ ] Performance optimizada
- [ ] UX/UI consistente

### Producción
- [ ] App lista para producción
- [ ] Documentación completa
- [ ] Guías de deploy
- [ ] Soporte técnico documentado

---

**ESTADO**: 📋 PLANIFICADO
**PRÓXIMO PASO**: Iniciar Bloque 1 - Corrección de tipos y estructura
**RESPONSABLE**: Equipo de desarrollo
**FECHA OBJETIVO**: 4 semanas desde inicio 