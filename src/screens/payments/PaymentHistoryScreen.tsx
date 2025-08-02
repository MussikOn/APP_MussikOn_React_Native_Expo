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
import { UserDeposit, WithdrawalRequest, MusicianEarnings } from '@appTypes/DatasTypes';

type PaymentHistoryNavigationProp = StackNavigationProp<RootStackParamList, 'PaymentHistory'>;

type TransactionType = 'all' | 'deposits' | 'withdrawals' | 'earnings';

interface TransactionItem {
  id: string;
  type: 'deposit' | 'withdrawal' | 'earning';
  amount: number;
  status: string;
  date: string;
  description: string;
  data: UserDeposit | WithdrawalRequest | MusicianEarnings;
}

const PaymentHistoryScreen: React.FC = () => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<PaymentHistoryNavigationProp>();
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<TransactionItem[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<TransactionType>('all');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    filterTransactions();
  }, [transactions, selectedFilter]);

  const loadHistory = async () => {
    try {
      console.log('src/screens/payments/PaymentHistoryScreen.tsx:loadHistory - Cargando historial de pagos');
      const response = await paymentService.getPaymentHistory();
      if (response.success && response.data) {
        const allTransactions: TransactionItem[] = [];

        // Agregar depósitos
        response.data.deposits.forEach((deposit: UserDeposit) => {
          allTransactions.push({
            id: deposit.id,
            type: 'deposit',
            amount: deposit.amount,
            status: deposit.status,
            date: deposit.createdAt,
            description: 'Depósito a balance',
            data: deposit,
          });
        });

        // Agregar retiros
        response.data.withdrawals.forEach((withdrawal: WithdrawalRequest) => {
          allTransactions.push({
            id: withdrawal.id,
            type: 'withdrawal',
            amount: withdrawal.amount,
            status: withdrawal.status,
            date: withdrawal.createdAt,
            description: 'Retiro a cuenta bancaria',
            data: withdrawal,
          });
        });

        // Agregar ganancias
        response.data.earnings.forEach((earning: MusicianEarnings) => {
          allTransactions.push({
            id: earning.id,
            type: 'earning',
            amount: earning.amount,
            status: earning.status,
            date: earning.createdAt,
            description: `Ganancia por evento: ${earning.eventName}`,
            data: earning,
          });
        });

        // Ordenar por fecha (más reciente primero)
        allTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setTransactions(allTransactions);
      } else {
        throw new Error(response.message || 'Error al cargar el historial');
      }
    } catch (error: any) {
      console.error('src/screens/payments/PaymentHistoryScreen.tsx:loadHistory - Error:', error);
      Alert.alert('Error', error.message || 'No se pudo cargar el historial');
    } finally {
      setLoading(false);
    }
  };

  const filterTransactions = () => {
    if (selectedFilter === 'all') {
      setFilteredTransactions(transactions);
    } else {
      const filtered = transactions.filter(transaction => {
        switch (selectedFilter) {
          case 'deposits':
            return transaction.type === 'deposit';
          case 'withdrawals':
            return transaction.type === 'withdrawal';
          case 'earnings':
            return transaction.type === 'earning';
          default:
            return true;
        }
      });
      setFilteredTransactions(filtered);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadHistory();
    setRefreshing(false);
  };

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
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
      case 'paid':
      case 'completed':
        return theme.colors.success[500];
      case 'pending':
        return theme.colors.warning[500];
      case 'rejected':
      case 'cancelled':
        return theme.colors.error[500];
      default:
        return theme.colors.text.secondary;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Aprobado';
      case 'pending':
        return 'Pendiente';
      case 'rejected':
        return 'Rechazado';
      case 'paid':
        return 'Pagado';
      case 'completed':
        return 'Completado';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return 'add-circle';
      case 'withdrawal':
        return 'remove-circle';
      case 'earning':
        return 'trending-up';
      default:
        return 'cash';
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'deposit':
        return theme.colors.success[500];
      case 'withdrawal':
        return theme.colors.error[500];
      case 'earning':
        return theme.colors.primary[500];
      default:
        return theme.colors.text.secondary;
    }
  };

  const renderTransaction = ({ item }: { item: TransactionItem }) => (
    <View style={{
      backgroundColor: theme.colors.background.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
    }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
          <View style={{
            backgroundColor: getTransactionColor(item.type) + '20',
            padding: 8,
            borderRadius: 8,
            marginRight: 12,
          }}>
            <Ionicons 
              name={getTransactionIcon(item.type) as any} 
              size={20} 
              color={getTransactionColor(item.type)} 
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ 
              fontSize: 16, 
              fontWeight: '600', 
              color: theme.colors.text.primary 
            }}>
              {item.description}
            </Text>
            <Text style={{ 
              fontSize: 14, 
              color: theme.colors.text.secondary,
              marginTop: 4 
            }}>
              {formatDate(item.date)}
            </Text>
          </View>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={{ 
            fontSize: 16, 
            fontWeight: 'bold', 
            color: getTransactionColor(item.type) 
          }}>
            {item.type === 'withdrawal' ? '-' : '+'}{formatCurrency(item.amount)}
          </Text>
          <View style={{
            backgroundColor: getStatusColor(item.status) + '20',
            paddingHorizontal: 8,
            paddingVertical: 2,
            borderRadius: 4,
            marginTop: 4,
          }}>
            <Text style={{ 
              fontSize: 10, 
              color: getStatusColor(item.status),
              fontWeight: '600' 
            }}>
              {getStatusText(item.status).toUpperCase()}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  const FilterButton = ({ type, label }: { type: TransactionType; label: string }) => (
    <TouchableOpacity
      style={{
        backgroundColor: selectedFilter === type 
          ? theme.colors.primary[500] 
          : theme.colors.background.card,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 8,
        borderWidth: 1,
        borderColor: selectedFilter === type 
          ? theme.colors.primary[500] 
          : theme.colors.border.primary,
      }}
      onPress={() => setSelectedFilter(type)}
    >
      <Text style={{ 
        fontSize: 14, 
        fontWeight: '600',
        color: selectedFilter === type 
          ? theme.colors.text.inverse 
          : theme.colors.text.primary 
      }}>
        {label}
      </Text>
    </TouchableOpacity>
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
          Cargando historial...
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
            Historial de Pagos
          </Text>
        </View>
      </View>

      {/* Filtros */}
      <View style={{
        backgroundColor: theme.colors.background.card,
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border.primary,
      }}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: 20 }}
        >
          <FilterButton type="all" label="Todos" />
          <FilterButton type="deposits" label="Depósitos" />
          <FilterButton type="withdrawals" label="Retiros" />
          <FilterButton type="earnings" label="Ganancias" />
        </ScrollView>
      </View>

      {/* Lista de Transacciones */}
      <FlatList
        data={filteredTransactions}
        renderItem={renderTransaction}
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
            <Ionicons name="time-outline" size={64} color={theme.colors.text.secondary} />
            <Text style={{ 
              fontSize: 18, 
              fontWeight: 'bold', 
              color: theme.colors.text.secondary,
              marginTop: 16,
              marginBottom: 8 
            }}>
              No hay transacciones
            </Text>
            <Text style={{ 
              fontSize: 14, 
              color: theme.colors.text.secondary,
              textAlign: 'center',
              paddingHorizontal: 40 
            }}>
              {selectedFilter === 'all' 
                ? 'Aún no tienes transacciones en tu historial'
                : `No tienes ${selectedFilter === 'deposits' ? 'depósitos' : 
                    selectedFilter === 'withdrawals' ? 'retiros' : 'ganancias'} en tu historial`
              }
            </Text>
          </View>
        }
      />
    </View>
  );
};

export default PaymentHistoryScreen; 