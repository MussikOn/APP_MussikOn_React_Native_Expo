import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useTheme } from '@hooks/useAppTheme';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { usePaymentService } from '@services/paymentService';
import { UserBalance } from '@appTypes/DatasTypes';

const PaymentBalance: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const paymentService = usePaymentService();
  
  const [balance, setBalance] = useState<UserBalance | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadBalance();
  }, []);

  const loadBalance = async () => {
    try {
      setLoading(true);
      const response = await paymentService.getUserBalance();
      if (response?.success && response.data) {
        setBalance(response.data);
      }
    } catch (error) {
      console.error('Error loading balance:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadBalance();
    setRefreshing(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-DO', {
      style: 'currency',
      currency: 'DOP',
    }).format(amount);
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.background.primary }]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.background.card }]}>
        <Text style={[styles.title, { color: theme.colors.text.primary }]}>
          Balance de Pagos
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>
          Gestiona tus fondos y transacciones
        </Text>
      </View>

      {/* Balance Principal */}
      <View style={[styles.balanceCard, { backgroundColor: theme.colors.background.card }]}>
        <View style={styles.balanceHeader}>
          <Ionicons name="wallet" size={32} color={theme.colors.primary[500]} />
          <Text style={[styles.balanceLabel, { color: theme.colors.text.secondary }]}>
            Balance Disponible
          </Text>
        </View>
        <Text style={[styles.balanceAmount, { color: theme.colors.text.primary }]}>
          {balance ? formatCurrency(balance.balance) : '$0.00'}
        </Text>
        <Text style={[styles.balanceCurrency, { color: theme.colors.text.secondary }]}>
          Pesos Dominicanos (DOP)
        </Text>
      </View>

      {/* Estadísticas */}
      <View style={[styles.statsContainer, { backgroundColor: theme.colors.background.card }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
          Resumen de Actividad
        </Text>
        
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Ionicons name="trending-up" size={24} color={theme.colors.success[500]} />
            <Text style={[styles.statValue, { color: theme.colors.text.primary }]}>
              {balance ? formatCurrency(balance.totalDeposits) : '$0.00'}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.text.secondary }]}>
              Total Depositado
            </Text>
          </View>

          <View style={styles.statItem}>
            <Ionicons name="trending-down" size={24} color={theme.colors.error[500]} />
            <Text style={[styles.statValue, { color: theme.colors.text.primary }]}>
              {balance ? formatCurrency(balance.totalWithdrawals) : '$0.00'}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.text.secondary }]}>
              Total Retirado
            </Text>
          </View>

          <View style={styles.statItem}>
            <Ionicons name="cash" size={24} color={theme.colors.accent[500]} />
            <Text style={[styles.statValue, { color: theme.colors.text.primary }]}>
              {balance ? formatCurrency(balance.totalEarnings) : '$0.00'}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.text.secondary }]}>
              Total Ganado
            </Text>
          </View>
        </View>
      </View>

      {/* Acciones Rápidas */}
      <View style={[styles.actionsContainer, { backgroundColor: theme.colors.background.card }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
          Acciones Rápidas
        </Text>
        
        <View style={styles.actionsGrid}>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: theme.colors.primary[500] }]}
            onPress={() => navigation.navigate('Deposit' as never)}
          >
            <Ionicons name="add-circle" size={24} color="#fff" />
            <Text style={styles.actionButtonText}>Depositar</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: theme.colors.secondary[500] }]}
            onPress={() => navigation.navigate('Withdraw' as never)}
          >
            <Ionicons name="remove-circle" size={24} color="#fff" />
            <Text style={styles.actionButtonText}>Retirar</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: theme.colors.accent[500] }]}
            onPress={() => navigation.navigate('PaymentHistory' as never)}
          >
            <Ionicons name="time" size={24} color="#fff" />
            <Text style={styles.actionButtonText}>Historial</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: theme.colors.success[500] }]}
            onPress={() => navigation.navigate('BankAccounts' as never)}
          >
            <Ionicons name="card" size={24} color="#fff" />
            <Text style={styles.actionButtonText}>Cuentas</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Información Adicional */}
      <View style={[styles.infoContainer, { backgroundColor: theme.colors.background.card }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
          Información Importante
        </Text>
        
        <View style={styles.infoItem}>
          <Ionicons name="information-circle" size={20} color={theme.colors.warning[500]} />
          <Text style={[styles.infoText, { color: theme.colors.text.secondary }]}>
            Los depósitos pueden tardar hasta 24 horas en ser procesados
          </Text>
        </View>
        
        <View style={styles.infoItem}>
          <Ionicons name="information-circle" size={20} color={theme.colors.warning[500]} />
          <Text style={[styles.infoText, { color: theme.colors.text.secondary }]}>
            Los retiros se procesan en 1-3 días hábiles
          </Text>
        </View>
        
        <View style={styles.infoItem}>
          <Ionicons name="information-circle" size={20} color={theme.colors.warning[500]} />
          <Text style={[styles.infoText, { color: theme.colors.text.secondary }]}>
            Mantén al menos una cuenta bancaria registrada
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
  },
  balanceCard: {
    margin: 16,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  balanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  balanceLabel: {
    fontSize: 16,
    marginLeft: 8,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  balanceCurrency: {
    fontSize: 14,
  },
  statsContainer: {
    margin: 16,
    padding: 20,
    borderRadius: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  actionsContainer: {
    margin: 16,
    padding: 20,
    borderRadius: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginTop: 8,
  },
  infoContainer: {
    margin: 16,
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
    lineHeight: 20,
  },
});

export default PaymentBalance; 