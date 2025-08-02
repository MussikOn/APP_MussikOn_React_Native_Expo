import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  ScrollView,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@contexts/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@appTypes/DatasTypes';
import { paymentService } from '@services/paymentService';
import { BankAccount, UserBalance } from '@appTypes/DatasTypes';

type WithdrawNavigationProp = StackNavigationProp<RootStackParamList, 'Withdraw'>;

const WithdrawScreen: React.FC = () => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<WithdrawNavigationProp>();
  const [amount, setAmount] = useState('');
  const [selectedAccount, setSelectedAccount] = useState<BankAccount | null>(null);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [balance, setBalance] = useState<UserBalance | null>(null);
  const [loading, setLoading] = useState(false);
  const [accountsLoading, setAccountsLoading] = useState(true);
  const [showAccountModal, setShowAccountModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setAccountsLoading(true);
    try {
      const [accountsResponse, balanceResponse] = await Promise.all([
        paymentService.getBankAccounts(),
        paymentService.getBalance(),
      ]);

      if (accountsResponse.success && accountsResponse.data) {
        setBankAccounts(accountsResponse.data);
        // Seleccionar la cuenta predeterminada si existe
        const defaultAccount = accountsResponse.data.find(account => account.isDefault);
        if (defaultAccount) {
          setSelectedAccount(defaultAccount);
        }
      }

      if (balanceResponse.success && balanceResponse.data) {
        setBalance(balanceResponse.data);
      }
    } catch (error: any) {
      console.error('src/screens/payments/WithdrawScreen.tsx:loadData - Error:', error);
      Alert.alert('Error', 'No se pudieron cargar los datos');
    } finally {
      setAccountsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Por favor ingresa un monto válido');
      return;
    }

    if (!selectedAccount) {
      Alert.alert('Error', 'Por favor selecciona una cuenta bancaria');
      return;
    }

    if (balance && parseFloat(amount) > balance.balance) {
      Alert.alert('Error', 'El monto excede tu balance disponible');
      return;
    }

    if (parseFloat(amount) < 100) {
      Alert.alert('Error', 'El monto mínimo para retiros es RD$ 100');
      return;
    }

    setLoading(true);
    try {
      console.log('src/screens/payments/WithdrawScreen.tsx:handleSubmit - Procesando retiro');
      
      const withdrawData = {
        bankAccountId: selectedAccount.id,
        amount: parseFloat(amount),
      };

      const response = await paymentService.requestWithdrawal(withdrawData);
      if (response.success && response.data) {
        Alert.alert(
          'Retiro Solicitado',
          'Tu solicitud de retiro ha sido procesada. Recibirás una notificación cuando sea aprobado y transferido a tu cuenta bancaria.',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('PaymentBalance'),
            },
          ]
        );
      } else {
        throw new Error(response.message || 'Error al procesar el retiro');
      }
    } catch (error: any) {
      console.error('src/screens/payments/WithdrawScreen.tsx:handleSubmit - Error:', error);
      Alert.alert('Error', error.message || 'No se pudo procesar el retiro');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    if (numericValue === '') return '';
    
    const number = parseFloat(numericValue);
    return new Intl.NumberFormat('es-DO', {
      style: 'currency',
      currency: 'DOP',
      minimumFractionDigits: 2,
    }).format(number);
  };

  const handleAmountChange = (text: string) => {
    const numericValue = text.replace(/[^0-9]/g, '');
    setAmount(numericValue);
  };

  const selectAccount = (account: BankAccount) => {
    setSelectedAccount(account);
    setShowAccountModal(false);
  };

  const maskAccountNumber = (accountNumber: string) => {
    if (accountNumber.length <= 4) return accountNumber;
    return `****${accountNumber.slice(-4)}`;
  };

  if (accountsLoading) {
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
            Solicitar Retiro
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
              • El monto mínimo para retiros es RD$ 100{'\n'}
              • Los retiros se procesan en 24-48 horas{'\n'}
              • Solo puedes retirar a cuentas bancarias verificadas{'\n'}
              • Se aplica una comisión del 2% por retiro
            </Text>
          </View>

          {/* Balance Disponible */}
          {balance && (
            <View style={{
              backgroundColor: theme.colors.background.card,
              padding: 16,
              borderRadius: 12,
              marginBottom: 24,
            }}>
              <Text style={{ 
                fontSize: 14, 
                color: theme.colors.text.secondary,
                marginBottom: 4 
              }}>
                Balance Disponible
              </Text>
              <Text style={{ 
                fontSize: 24, 
                fontWeight: 'bold', 
                color: theme.colors.text.primary 
              }}>
                {new Intl.NumberFormat('es-DO', {
                  style: 'currency',
                  currency: 'DOP',
                  minimumFractionDigits: 2,
                }).format(balance.balance)}
              </Text>
            </View>
          )}

          {/* Monto */}
          <View style={{ marginBottom: 24 }}>
            <Text style={{ 
              fontSize: 16, 
              fontWeight: 'bold', 
              color: theme.colors.text.primary,
              marginBottom: 12 
            }}>
              Monto a Retirar
            </Text>
            <View style={{
              backgroundColor: theme.colors.background.card,
              borderRadius: 12,
              padding: 16,
              borderWidth: 1,
              borderColor: theme.colors.border.primary,
            }}>
              <TextInput
                style={{
                  fontSize: 24,
                  fontWeight: 'bold',
                  color: theme.colors.text.primary,
                  textAlign: 'center',
                }}
                value={amount ? formatCurrency(amount) : ''}
                onChangeText={handleAmountChange}
                placeholder="RD$ 0.00"
                placeholderTextColor={theme.colors.text.secondary}
                keyboardType="numeric"
                maxLength={20}
              />
            </View>
            {amount && parseFloat(amount) < 100 && (
              <Text style={{ 
                fontSize: 12, 
                color: theme.colors.error[500],
                marginTop: 8 
              }}>
                El monto mínimo es RD$ 100
              </Text>
            )}
            {amount && balance && parseFloat(amount) > balance.balance && (
              <Text style={{ 
                fontSize: 12, 
                color: theme.colors.error[500],
                marginTop: 8 
              }}>
                El monto excede tu balance disponible
              </Text>
            )}
            {amount && parseFloat(amount) >= 100 && (
              <View style={{ marginTop: 8 }}>
                <Text style={{ 
                  fontSize: 12, 
                  color: theme.colors.text.secondary 
                }}>
                  Comisión (2%): {formatCurrency((parseFloat(amount) * 0.02).toString())}
                </Text>
                <Text style={{ 
                  fontSize: 12, 
                  color: theme.colors.text.secondary 
                }}>
                  Monto neto: {formatCurrency((parseFloat(amount) * 0.98).toString())}
                </Text>
              </View>
            )}
          </View>

          {/* Cuenta Bancaria */}
          <View style={{ marginBottom: 24 }}>
            <View style={{ 
              flexDirection: 'row', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: 12 
            }}>
              <Text style={{ 
                fontSize: 16, 
                fontWeight: 'bold', 
                color: theme.colors.text.primary 
              }}>
                Cuenta Bancaria
              </Text>
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

            {bankAccounts.length === 0 ? (
              <View style={{
                backgroundColor: theme.colors.background.card,
                borderRadius: 12,
                padding: 20,
                borderWidth: 2,
                borderColor: theme.colors.border.secondary,
                borderStyle: 'dashed',
                alignItems: 'center',
              }}>
                <Ionicons name="card" size={48} color={theme.colors.text.secondary} />
                <Text style={{ 
                  fontSize: 16, 
                  color: theme.colors.text.secondary,
                  marginTop: 12,
                  marginBottom: 16,
                  textAlign: 'center' 
                }}>
                  No tienes cuentas bancarias registradas
                </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate('BankAccountRegister')}
                  style={{
                    backgroundColor: theme.colors.primary[500],
                    paddingHorizontal: 20,
                    paddingVertical: 12,
                    borderRadius: 8,
                  }}
                >
                  <Text style={{ 
                    color: theme.colors.text.inverse, 
                    fontSize: 14, 
                    fontWeight: '600' 
                  }}>
                    Registrar Cuenta
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                onPress={() => setShowAccountModal(true)}
                style={{
                  backgroundColor: theme.colors.background.card,
                  borderRadius: 12,
                  padding: 16,
                  borderWidth: 1,
                  borderColor: theme.colors.border.primary,
                }}
              >
                {selectedAccount ? (
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <View style={{ flex: 1 }}>
                      <Text style={{ 
                        fontSize: 16, 
                        fontWeight: '600', 
                        color: theme.colors.text.primary 
                      }}>
                        {selectedAccount.bankName}
                      </Text>
                      <Text style={{ 
                        fontSize: 14, 
                        color: theme.colors.text.secondary,
                        marginTop: 4 
                      }}>
                        {selectedAccount.accountHolderName} • {maskAccountNumber(selectedAccount.accountNumber)}
                      </Text>
                      {selectedAccount.isDefault && (
                        <View style={{
                          backgroundColor: theme.colors.primary[100],
                          paddingHorizontal: 8,
                          paddingVertical: 2,
                          borderRadius: 4,
                          alignSelf: 'flex-start',
                          marginTop: 4,
                        }}>
                          <Text style={{ 
                            fontSize: 10, 
                            color: theme.colors.primary[700],
                            fontWeight: '600' 
                          }}>
                            PREDETERMINADA
                          </Text>
                        </View>
                      )}
                    </View>
                    <Ionicons name="chevron-down" size={20} color={theme.colors.text.secondary} />
                  </View>
                ) : (
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={{ 
                      fontSize: 16, 
                      color: theme.colors.text.secondary 
                    }}>
                      Seleccionar cuenta bancaria
                    </Text>
                    <Ionicons name="chevron-down" size={20} color={theme.colors.text.secondary} />
                  </View>
                )}
              </TouchableOpacity>
            )}
          </View>

          {/* Botón de Envío */}
          <TouchableOpacity
            style={{
              backgroundColor: (amount && parseFloat(amount) >= 100 && selectedAccount && 
                (!balance || parseFloat(amount) <= balance.balance)) 
                ? theme.colors.primary[500] 
                : theme.colors.border.secondary,
              paddingVertical: 16,
              borderRadius: 12,
              alignItems: 'center',
              marginTop: 20,
            }}
            onPress={handleSubmit}
            disabled={loading || !amount || parseFloat(amount) < 100 || !selectedAccount || 
              (balance ? parseFloat(amount) > balance.balance : false)}
          >
            {loading ? (
              <ActivityIndicator color={theme.colors.text.inverse} />
            ) : (
              <Text style={{ 
                fontSize: 18, 
                fontWeight: 'bold', 
                color: theme.colors.text.inverse 
              }}>
                Solicitar Retiro
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal de Selección de Cuenta */}
      <Modal
        visible={showAccountModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAccountModal(false)}
      >
        <View style={{ 
          flex: 1, 
          backgroundColor: 'rgba(0,0,0,0.5)', 
          justifyContent: 'flex-end' 
        }}>
          <View style={{
            backgroundColor: theme.colors.background.card,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            padding: 20,
            maxHeight: '70%',
          }}>
            <View style={{ 
              flexDirection: 'row', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: 20 
            }}>
              <Text style={{ 
                fontSize: 18, 
                fontWeight: 'bold', 
                color: theme.colors.text.primary 
              }}>
                Seleccionar Cuenta
              </Text>
              <TouchableOpacity onPress={() => setShowAccountModal(false)}>
                <Ionicons name="close" size={24} color={theme.colors.text.secondary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {bankAccounts.map((account) => (
                <TouchableOpacity
                  key={account.id}
                  onPress={() => selectAccount(account)}
                  style={{
                    backgroundColor: selectedAccount?.id === account.id 
                      ? theme.colors.primary[100] 
                      : theme.colors.background.primary,
                    padding: 16,
                    borderRadius: 12,
                    marginBottom: 12,
                    borderWidth: 1,
                    borderColor: selectedAccount?.id === account.id 
                      ? theme.colors.primary[500] 
                      : theme.colors.border.primary,
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <View style={{ flex: 1 }}>
                      <Text style={{ 
                        fontSize: 16, 
                        fontWeight: '600', 
                        color: theme.colors.text.primary 
                      }}>
                        {account.bankName}
                      </Text>
                      <Text style={{ 
                        fontSize: 14, 
                        color: theme.colors.text.secondary,
                        marginTop: 4 
                      }}>
                        {account.accountHolderName}
                      </Text>
                      <Text style={{ 
                        fontSize: 14, 
                        color: theme.colors.text.secondary 
                      }}>
                        {maskAccountNumber(account.accountNumber)}
                      </Text>
                      {account.isDefault && (
                        <View style={{
                          backgroundColor: theme.colors.primary[500],
                          paddingHorizontal: 8,
                          paddingVertical: 2,
                          borderRadius: 4,
                          alignSelf: 'flex-start',
                          marginTop: 4,
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
                    {selectedAccount?.id === account.id && (
                      <Ionicons name="checkmark-circle" size={24} color={theme.colors.primary[500]} />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default WithdrawScreen; 