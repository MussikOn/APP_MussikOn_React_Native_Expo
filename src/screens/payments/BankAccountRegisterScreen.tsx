import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@contexts/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@appTypes/DatasTypes';
import { paymentService } from '@services/paymentService';

type BankAccountRegisterNavigationProp = StackNavigationProp<RootStackParamList, 'BankAccountRegister'>;

interface FormData {
  accountHolderName: string;
  accountNumber: string;
  bankName: string;
  accountType: 'savings' | 'checking';
  routingNumber: string;
  swiftCode: string;
}

const BankAccountRegisterScreen: React.FC = () => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<BankAccountRegisterNavigationProp>();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    accountHolderName: '',
    accountNumber: '',
    bankName: '',
    accountType: 'savings',
    routingNumber: '',
    swiftCode: '',
  });

  const banks = [
    'Banco Popular Dominicano',
    'Banco de Reservas',
    'Banco BHD León',
    'Scotiabank República Dominicana',
    'Banco Santa Cruz',
    'Banco Caribe',
    'Banco Vimenca',
    'Banco Ademi',
    'Banco Promerica',
    'Otro',
  ];

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = (): string | null => {
    if (!formData.accountHolderName.trim()) {
      return 'El nombre del titular es requerido';
    }
    if (!formData.accountNumber.trim()) {
      return 'El número de cuenta es requerido';
    }
    if (formData.accountNumber.length < 8) {
      return 'El número de cuenta debe tener al menos 8 dígitos';
    }
    if (!formData.bankName.trim()) {
      return 'El nombre del banco es requerido';
    }
    if (!formData.routingNumber.trim()) {
      return 'El número de ruta es requerido';
    }
    if (formData.routingNumber.length !== 9) {
      return 'El número de ruta debe tener 9 dígitos';
    }
    return null;
  };

  const handleSubmit = async () => {
    const error = validateForm();
    if (error) {
      Alert.alert('Error de Validación', error);
      return;
    }

    setLoading(true);
    try {
      console.log('src/screens/payments/BankAccountRegisterScreen.tsx:handleSubmit - Registrando cuenta bancaria');
      
      const accountData = {
        accountHolderName: formData.accountHolderName.trim(),
        accountNumber: formData.accountNumber.trim(),
        bankName: formData.bankName.trim(),
        accountType: formData.accountType,
        routingNumber: formData.routingNumber.trim(),
        swiftCode: formData.swiftCode.trim() || undefined,
      };

      const response = await paymentService.registerBankAccount(accountData);
      if (response.success && response.data) {
        Alert.alert(
          'Cuenta Registrada',
          'Tu cuenta bancaria ha sido registrada exitosamente. Será verificada en 24-48 horas.',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('BankAccounts'),
            },
          ]
        );
      } else {
        throw new Error(response.message || 'Error al registrar la cuenta bancaria');
      }
    } catch (error: any) {
      console.error('src/screens/payments/BankAccountRegisterScreen.tsx:handleSubmit - Error:', error);
      Alert.alert('Error', error.message || 'No se pudo registrar la cuenta bancaria');
    } finally {
      setLoading(false);
    }
  };

  const selectBank = (bank: string) => {
    handleInputChange('bankName', bank);
  };

  const selectAccountType = (type: 'savings' | 'checking') => {
    setFormData(prev => ({ ...prev, accountType: type }));
  };

  return (
    <View style={{ 
      flex: 1, 
      backgroundColor: theme.colors.background.primary,
      paddingTop: insets.top 
    }}>
      {/* Header */}
      <View style={{
        backgroundColor: theme.colors.background.card,
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border.primary,
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
          </TouchableOpacity>
          <Text style={{ 
            fontSize: 18, 
            fontWeight: 'bold', 
            color: theme.colors.text.primary,
            marginLeft: 16 
          }}>
            Registrar Cuenta Bancaria
          </Text>
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View style={{ padding: 20 }}>
          {/* Información */}
          <View style={{
            backgroundColor: theme.colors.primary[100],
            padding: 16,
            borderRadius: 12,
            marginBottom: 24,
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <Ionicons name="information-circle" size={20} color={theme.colors.primary[700]} />
              <Text style={{ 
                fontSize: 16, 
                fontWeight: 'bold', 
                color: theme.colors.primary[700],
                marginLeft: 8 
              }}>
                Información Importante
              </Text>
            </View>
            <Text style={{ 
              fontSize: 14, 
              color: theme.colors.primary[700],
              lineHeight: 20 
            }}>
              • Asegúrate de que la información sea exacta{'\n'}
              • La cuenta será verificada en 24-48 horas{'\n'}
              • Solo cuentas verificadas pueden recibir retiros{'\n'}
              • El número de ruta debe tener 9 dígitos
            </Text>
          </View>

          {/* Nombre del Titular */}
          <View style={{ marginBottom: 20 }}>
            <Text style={{ 
              fontSize: 16, 
              fontWeight: 'bold', 
              color: theme.colors.text.primary,
              marginBottom: 8 
            }}>
              Nombre del Titular
            </Text>
            <TextInput
              style={{
                backgroundColor: theme.colors.background.card,
                borderRadius: 12,
                padding: 16,
                fontSize: 16,
                color: theme.colors.text.primary,
                borderWidth: 1,
                borderColor: theme.colors.border.primary,
              }}
              value={formData.accountHolderName}
              onChangeText={(text) => handleInputChange('accountHolderName', text)}
              placeholder="Nombre completo del titular"
              placeholderTextColor={theme.colors.text.secondary}
              autoCapitalize="words"
            />
          </View>

          {/* Banco */}
          <View style={{ marginBottom: 20 }}>
            <Text style={{ 
              fontSize: 16, 
              fontWeight: 'bold', 
              color: theme.colors.text.primary,
              marginBottom: 8 
            }}>
              Banco
            </Text>
            <View style={{
              backgroundColor: theme.colors.background.card,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: theme.colors.border.primary,
            }}>
              {banks.map((bank) => (
                <TouchableOpacity
                  key={bank}
                  style={{
                    padding: 16,
                    borderBottomWidth: 1,
                    borderBottomColor: theme.colors.border.secondary,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                  onPress={() => selectBank(bank)}
                >
                  <Text style={{ 
                    fontSize: 16, 
                    color: theme.colors.text.primary 
                  }}>
                    {bank}
                  </Text>
                  {formData.bankName === bank && (
                    <Ionicons name="checkmark" size={20} color={theme.colors.primary[500]} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Tipo de Cuenta */}
          <View style={{ marginBottom: 20 }}>
            <Text style={{ 
              fontSize: 16, 
              fontWeight: 'bold', 
              color: theme.colors.text.primary,
              marginBottom: 8 
            }}>
              Tipo de Cuenta
            </Text>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: formData.accountType === 'savings' 
                    ? theme.colors.primary[500] 
                    : theme.colors.background.card,
                  padding: 16,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: formData.accountType === 'savings' 
                    ? theme.colors.primary[500] 
                    : theme.colors.border.primary,
                  alignItems: 'center',
                }}
                onPress={() => selectAccountType('savings')}
              >
                <Text style={{ 
                  fontSize: 16, 
                  fontWeight: '600',
                  color: formData.accountType === 'savings' 
                    ? theme.colors.text.inverse 
                    : theme.colors.text.primary 
                }}>
                  Ahorros
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: formData.accountType === 'checking' 
                    ? theme.colors.primary[500] 
                    : theme.colors.background.card,
                  padding: 16,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: formData.accountType === 'checking' 
                    ? theme.colors.primary[500] 
                    : theme.colors.border.primary,
                  alignItems: 'center',
                }}
                onPress={() => selectAccountType('checking')}
              >
                <Text style={{ 
                  fontSize: 16, 
                  fontWeight: '600',
                  color: formData.accountType === 'checking' 
                    ? theme.colors.text.inverse 
                    : theme.colors.text.primary 
                }}>
                  Corriente
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Número de Cuenta */}
          <View style={{ marginBottom: 20 }}>
            <Text style={{ 
              fontSize: 16, 
              fontWeight: 'bold', 
              color: theme.colors.text.primary,
              marginBottom: 8 
            }}>
              Número de Cuenta
            </Text>
            <TextInput
              style={{
                backgroundColor: theme.colors.background.card,
                borderRadius: 12,
                padding: 16,
                fontSize: 16,
                color: theme.colors.text.primary,
                borderWidth: 1,
                borderColor: theme.colors.border.primary,
              }}
              value={formData.accountNumber}
              onChangeText={(text) => handleInputChange('accountNumber', text.replace(/[^0-9]/g, ''))}
              placeholder="Número de cuenta (solo números)"
              placeholderTextColor={theme.colors.text.secondary}
              keyboardType="numeric"
              maxLength={20}
            />
          </View>

          {/* Número de Ruta */}
          <View style={{ marginBottom: 20 }}>
            <Text style={{ 
              fontSize: 16, 
              fontWeight: 'bold', 
              color: theme.colors.text.primary,
              marginBottom: 8 
            }}>
              Número de Ruta (ABA)
            </Text>
            <TextInput
              style={{
                backgroundColor: theme.colors.background.card,
                borderRadius: 12,
                padding: 16,
                fontSize: 16,
                color: theme.colors.text.primary,
                borderWidth: 1,
                borderColor: theme.colors.border.primary,
              }}
              value={formData.routingNumber}
              onChangeText={(text) => handleInputChange('routingNumber', text.replace(/[^0-9]/g, ''))}
              placeholder="Número de ruta (9 dígitos)"
              placeholderTextColor={theme.colors.text.secondary}
              keyboardType="numeric"
              maxLength={9}
            />
            <Text style={{ 
              fontSize: 12, 
              color: theme.colors.text.secondary,
              marginTop: 4 
            }}>
              El número de ruta debe tener exactamente 9 dígitos
            </Text>
          </View>

          {/* Código SWIFT (Opcional) */}
          <View style={{ marginBottom: 24 }}>
            <Text style={{ 
              fontSize: 16, 
              fontWeight: 'bold', 
              color: theme.colors.text.primary,
              marginBottom: 8 
            }}>
              Código SWIFT (Opcional)
            </Text>
            <TextInput
              style={{
                backgroundColor: theme.colors.background.card,
                borderRadius: 12,
                padding: 16,
                fontSize: 16,
                color: theme.colors.text.primary,
                borderWidth: 1,
                borderColor: theme.colors.border.primary,
              }}
              value={formData.swiftCode}
              onChangeText={(text) => handleInputChange('swiftCode', text.toUpperCase())}
              placeholder="Código SWIFT (opcional)"
              placeholderTextColor={theme.colors.text.secondary}
              autoCapitalize="characters"
              maxLength={11}
            />
          </View>

          {/* Botón de Envío */}
          <TouchableOpacity
            style={{
              backgroundColor: theme.colors.primary[500],
              paddingVertical: 16,
              borderRadius: 12,
              alignItems: 'center',
              marginTop: 20,
            }}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={theme.colors.text.inverse} />
            ) : (
              <Text style={{ 
                fontSize: 18, 
                fontWeight: 'bold', 
                color: theme.colors.text.inverse 
              }}>
                Registrar Cuenta
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default BankAccountRegisterScreen; 