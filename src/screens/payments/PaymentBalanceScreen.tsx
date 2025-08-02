import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@contexts/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@appTypes/DatasTypes';
import { paymentService } from '@services/paymentService';
import { UserBalance } from '@appTypes/DatasTypes';

type PaymentBalanceNavigationProp = StackNavigationProp<RootStackParamList, 'PaymentBalance'>;

const PaymentBalanceScreen: React.FC = () => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<PaymentBalanceNavigationProp>();
  const [balance, setBalance] = useState<UserBalance | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<any>(null);

  const loadBalance = async () => {
    try {
      console.log('src/screens/payments/PaymentBalanceScreen.tsx:loadBalance - Cargando balance del usuario');
      const response = await paymentService.getBalance();
      if (response.success && response.data) {
        setBalance(response.data);
      } else {
        throw new Error(response.message || 'Error al cargar el balance');
      }
    } catch (error: any) {
      console.error('src/screens/payments/PaymentBalanceScreen.tsx:loadBalance - Error:', error);
      Alert.alert('Error', error.message || 'No se pudo cargar el balance');
    }
  };

  const loadStats = async () => {
    try {
      const response = await paymentService.getPaymentStats();
      if (response.success && response.data) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('src/screens/payments/PaymentBalanceScreen.tsx:loadStats - Error:', error);
    }
  };

  const loadData = async () => {
    setLoading(true);
    await Promise.all([loadBalance(), loadStats()]);
    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-DO', {
      style: 'currency',
      currency: 'DOP',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-DO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

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
          Cargando balance...
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
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
          </TouchableOpacity>
          <Text style={{ 
            fontSize: 18, 
            fontWeight: 'bold', 
            color: theme.colors.text.primary 
          }}>
            Mi Balance
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('PaymentHistory')}>
            <Ionicons name="time-outline" size={24} color={theme.colors.primary[500]} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Balance Principal */}
        <View style={{
          backgroundColor: theme.colors.primary[500],
          margin: 20,
          borderRadius: 20,
          padding: 24,
          alignItems: 'center',
        }}>
          <Text style={{ 
            fontSize: 16, 
            color: theme.colors.text.inverse,
            opacity: 0.9,
            marginBottom: 8 
          }}>
            Balance Disponible
          </Text>
          <Text style={{ 
            fontSize: 36, 
            fontWeight: 'bold', 
            color: theme.colors.text.inverse,
            marginBottom: 16 
          }}>
            {balance ? formatCurrency(balance.balance) : formatCurrency(0)}
          </Text>
          <Text style={{ 
            fontSize: 14, 
            color: theme.colors.text.inverse,
            opacity: 0.8 
          }}>
            Última actualización: {balance ? formatDate(balance.lastUpdated) : 'N/A'}
          </Text>
        </View>

        {/* Estadísticas Rápidas */}
        {stats && (
          <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
            <Text style={{ 
              fontSize: 18, 
              fontWeight: 'bold', 
              color: theme.colors.text.primary,
              marginBottom: 16 
            }}>
              Resumen
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View style={{
                backgroundColor: theme.colors.background.card,
                padding: 16,
                borderRadius: 12,
                flex: 1,
                marginRight: 8,
                alignItems: 'center',
              }}>
                <Ionicons name="trending-up" size={24} color={theme.colors.success[500]} />
                <Text style={{ 
                  fontSize: 16, 
                  fontWeight: 'bold', 
                  color: theme.colors.text.primary,
                  marginTop: 8 
                }}>
                  {formatCurrency(stats.totalEarnings)}
                </Text>
                <Text style={{ 
                  fontSize: 12, 
                  color: theme.colors.text.secondary 
                }}>
                  Ganancias Totales
                </Text>
              </View>
              <View style={{
                backgroundColor: theme.colors.background.card,
                padding: 16,
                borderRadius: 12,
                flex: 1,
                marginLeft: 8,
                alignItems: 'center',
              }}>
                <Ionicons name="trending-down" size={24} color={theme.colors.error[500]} />
                <Text style={{ 
                  fontSize: 16, 
                  fontWeight: 'bold', 
                  color: theme.colors.text.primary,
                  marginTop: 8 
                }}>
                  {formatCurrency(stats.totalWithdrawals)}
                </Text>
                <Text style={{ 
                  fontSize: 12, 
                  color: theme.colors.text.secondary 
                }}>
                  Retiros Totales
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Acciones Rápidas */}
        <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
          <Text style={{ 
            fontSize: 18, 
            fontWeight: 'bold', 
            color: theme.colors.text.primary,
            marginBottom: 16 
          }}>
            Acciones Rápidas
          </Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <TouchableOpacity
              style={{
                backgroundColor: theme.colors.success[500],
                padding: 20,
                borderRadius: 16,
                flex: 1,
                marginRight: 8,
                alignItems: 'center',
              }}
              onPress={() => navigation.navigate('Deposit')}
            >
              <Ionicons name="add-circle" size={32} color={theme.colors.text.inverse} />
              <Text style={{ 
                fontSize: 16, 
                fontWeight: 'bold', 
                color: theme.colors.text.inverse,
                marginTop: 8 
              }}>
                Depositar
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: theme.colors.primary[500],
                padding: 20,
                borderRadius: 16,
                flex: 1,
                marginLeft: 8,
                alignItems: 'center',
              }}
              onPress={() => navigation.navigate('Withdraw')}
            >
              <Ionicons name="remove-circle" size={32} color={theme.colors.text.inverse} />
              <Text style={{ 
                fontSize: 16, 
                fontWeight: 'bold', 
                color: theme.colors.text.inverse,
                marginTop: 8 
              }}>
                Retirar
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Información Adicional */}
        {balance && (
          <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
            <Text style={{ 
              fontSize: 18, 
              fontWeight: 'bold', 
              color: theme.colors.text.primary,
              marginBottom: 16 
            }}>
              Información Detallada
            </Text>
            <View style={{
              backgroundColor: theme.colors.background.card,
              borderRadius: 16,
              padding: 20,
            }}>
              <View style={{ 
                flexDirection: 'row', 
                justifyContent: 'space-between', 
                marginBottom: 12 
              }}>
                <Text style={{ color: theme.colors.text.secondary }}>Ganancias Totales:</Text>
                <Text style={{ 
                  color: theme.colors.text.primary, 
                  fontWeight: '600' 
                }}>
                  {formatCurrency(balance.totalEarnings)}
                </Text>
              </View>
              <View style={{ 
                flexDirection: 'row', 
                justifyContent: 'space-between', 
                marginBottom: 12 
              }}>
                <Text style={{ color: theme.colors.text.secondary }}>Retiros Totales:</Text>
                <Text style={{ 
                  color: theme.colors.text.primary, 
                  fontWeight: '600' 
                }}>
                  {formatCurrency(balance.totalWithdrawals)}
                </Text>
              </View>
              <View style={{ 
                flexDirection: 'row', 
                justifyContent: 'space-between', 
                marginBottom: 12 
              }}>
                <Text style={{ color: theme.colors.text.secondary }}>Retiros Pendientes:</Text>
                <Text style={{ 
                  color: theme.colors.warning[500], 
                  fontWeight: '600' 
                }}>
                  {formatCurrency(balance.pendingWithdrawals)}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Cuentas Bancarias */}
        <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
          <View style={{ 
            flexDirection: 'row', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: 16 
          }}>
            <Text style={{ 
              fontSize: 18, 
              fontWeight: 'bold', 
              color: theme.colors.text.primary 
            }}>
              Cuentas Bancarias
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
          <TouchableOpacity
            onPress={() => navigation.navigate('BankAccounts')}
            style={{
              backgroundColor: theme.colors.background.card,
              padding: 16,
              borderRadius: 12,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="card" size={24} color={theme.colors.primary[500]} />
              <Text style={{ 
                marginLeft: 12, 
                fontSize: 16, 
                color: theme.colors.text.primary 
              }}>
                Gestionar Cuentas
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.text.secondary} />
          </TouchableOpacity>
        </View>

        {/* Espacio al final */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

export default PaymentBalanceScreen; 