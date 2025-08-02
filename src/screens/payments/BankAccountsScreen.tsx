import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Alert,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@contexts/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@appTypes/DatasTypes';
import { paymentService } from '@services/paymentService';
import { BankAccount } from '@appTypes/DatasTypes';

type BankAccountsNavigationProp = StackNavigationProp<RootStackParamList, 'BankAccounts'>;

const BankAccountsScreen: React.FC = () => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<BankAccountsNavigationProp>();
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadBankAccounts();
  }, []);

  const loadBankAccounts = async () => {
    try {
      console.log('src/screens/payments/BankAccountsScreen.tsx:loadBankAccounts - Cargando cuentas bancarias');
      const response = await paymentService.getBankAccounts();
      if (response.success && response.data) {
        setBankAccounts(response.data);
      } else {
        throw new Error(response.message || 'Error al cargar las cuentas bancarias');
      }
    } catch (error: any) {
      console.error('src/screens/payments/BankAccountsScreen.tsx:loadBankAccounts - Error:', error);
      Alert.alert('Error', error.message || 'No se pudieron cargar las cuentas bancarias');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadBankAccounts();
    setRefreshing(false);
  };

  const handleSetDefault = async (accountId: string) => {
    try {
      console.log('src/screens/payments/BankAccountsScreen.tsx:handleSetDefault - Estableciendo cuenta predeterminada:', accountId);
      const response = await paymentService.setDefaultBankAccount(accountId);
      if (response.success) {
        Alert.alert('Éxito', 'Cuenta bancaria establecida como predeterminada');
        loadBankAccounts(); // Recargar la lista
      } else {
        throw new Error(response.message || 'Error al establecer la cuenta predeterminada');
      }
    } catch (error: any) {
      console.error('src/screens/payments/BankAccountsScreen.tsx:handleSetDefault - Error:', error);
      Alert.alert('Error', error.message || 'No se pudo establecer la cuenta predeterminada');
    }
  };

  const handleDeleteAccount = async (account: BankAccount) => {
    Alert.alert(
      'Eliminar Cuenta',
      `¿Estás seguro de que quieres eliminar la cuenta de ${account.bankName}?\n\nEsta acción no se puede deshacer.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('src/screens/payments/BankAccountsScreen.tsx:handleDeleteAccount - Eliminando cuenta:', account.id);
              const response = await paymentService.deleteBankAccount(account.id);
              if (response.success) {
                Alert.alert('Éxito', 'Cuenta bancaria eliminada correctamente');
                loadBankAccounts(); // Recargar la lista
              } else {
                throw new Error(response.message || 'Error al eliminar la cuenta bancaria');
              }
            } catch (error: any) {
              console.error('src/screens/payments/BankAccountsScreen.tsx:handleDeleteAccount - Error:', error);
              Alert.alert('Error', error.message || 'No se pudo eliminar la cuenta bancaria');
            }
          },
        },
      ]
    );
  };

  const maskAccountNumber = (accountNumber: string) => {
    if (accountNumber.length <= 4) return accountNumber;
    return `****${accountNumber.slice(-4)}`;
  };

  const getAccountTypeText = (accountType: string) => {
    switch (accountType) {
      case 'savings':
        return 'Ahorros';
      case 'checking':
        return 'Corriente';
      default:
        return accountType;
    }
  };

  const renderBankAccount = ({ item }: { item: BankAccount }) => (
    <View style={{
      backgroundColor: theme.colors.background.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
    }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <Ionicons name="card" size={20} color={theme.colors.primary[500]} />
            <Text style={{ 
              fontSize: 16, 
              fontWeight: '600', 
              color: theme.colors.text.primary,
              marginLeft: 8 
            }}>
              {item.bankName}
            </Text>
            {item.isDefault && (
              <View style={{
                backgroundColor: theme.colors.primary[500],
                paddingHorizontal: 8,
                paddingVertical: 2,
                borderRadius: 4,
                marginLeft: 8,
              }}>
                <Text style={{ 
                  fontSize: 10, 
                  color: theme.colors.text.inverse,
                  fontWeight: '600' 
                }}>
                  PREDETERMINADA
                </Text>
              </View>
            )}
          </View>
          
          <Text style={{ 
            fontSize: 14, 
            color: theme.colors.text.secondary,
            marginBottom: 4 
          }}>
            {item.accountHolderName}
          </Text>
          
          <Text style={{ 
            fontSize: 14, 
            color: theme.colors.text.secondary,
            marginBottom: 4 
          }}>
            Cuenta: {maskAccountNumber(item.accountNumber)}
          </Text>
          
          <Text style={{ 
            fontSize: 14, 
            color: theme.colors.text.secondary 
          }}>
            Tipo: {getAccountTypeText(item.accountType)}
          </Text>

          {!item.isVerified && (
            <View style={{
              backgroundColor: theme.colors.warning[100],
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 4,
              alignSelf: 'flex-start',
              marginTop: 8,
            }}>
              <Text style={{ 
                fontSize: 10, 
                color: theme.colors.warning[700],
                fontWeight: '600' 
              }}>
                PENDIENTE DE VERIFICACIÓN
              </Text>
            </View>
          )}
        </View>

        <View style={{ alignItems: 'flex-end' }}>
          {!item.isDefault && (
            <TouchableOpacity
              onPress={() => handleSetDefault(item.id)}
              style={{
                backgroundColor: theme.colors.primary[500],
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 6,
                marginBottom: 8,
              }}
            >
              <Text style={{ 
                fontSize: 12, 
                color: theme.colors.text.inverse,
                fontWeight: '600' 
              }}>
                Predeterminada
              </Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            onPress={() => handleDeleteAccount(item)}
            style={{
              backgroundColor: theme.colors.error[500],
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 6,
            }}
          >
            <Text style={{ 
              fontSize: 12, 
              color: theme.colors.text.inverse,
              fontWeight: '600' 
            }}>
              Eliminar
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: theme.colors.background.primary 
      }}>
        <ActivityIndicator size="large" color={theme.colors.primary[500]} />
        <Text style={{ 
          marginTop: 16, 
          color: theme.colors.text.secondary,
          fontSize: 16 
        }}>
          Cargando cuentas bancarias...
        </Text>
      </View>
    );
  }

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
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
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
              Cuentas Bancarias
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate('BankAccountRegister')}
            style={{
              backgroundColor: theme.colors.primary[500],
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 8,
            }}
          >
            <Text style={{ 
              color: theme.colors.text.inverse, 
              fontSize: 12, 
              fontWeight: '600' 
            }}>
              Agregar
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Información */}
      <View style={{
        backgroundColor: theme.colors.primary[100],
        margin: 20,
        padding: 16,
        borderRadius: 12,
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
          • Solo puedes retirar a cuentas bancarias verificadas{'\n'}
          • Las cuentas se verifican en 24-48 horas{'\n'}
          • Puedes tener múltiples cuentas registradas{'\n'}
          • Una cuenta puede ser marcada como predeterminada
        </Text>
      </View>

      {/* Lista de Cuentas */}
      <FlatList
        data={bankAccounts}
        renderItem={renderBankAccount}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={{
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 60,
          }}>
            <Ionicons name="card" size={64} color={theme.colors.text.secondary} />
            <Text style={{ 
              fontSize: 18, 
              fontWeight: 'bold', 
              color: theme.colors.text.secondary,
              marginTop: 16,
              marginBottom: 8 
            }}>
              No tienes cuentas bancarias
            </Text>
            <Text style={{ 
              fontSize: 14, 
              color: theme.colors.text.secondary,
              textAlign: 'center',
              paddingHorizontal: 40,
              marginBottom: 24 
            }}>
              Registra una cuenta bancaria para poder realizar retiros
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('BankAccountRegister')}
              style={{
                backgroundColor: theme.colors.primary[500],
                paddingHorizontal: 24,
                paddingVertical: 12,
                borderRadius: 8,
              }}
            >
              <Text style={{ 
                color: theme.colors.text.inverse, 
                fontSize: 16, 
                fontWeight: '600' 
              }}>
                Registrar Primera Cuenta
              </Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
};

export default BankAccountsScreen; 