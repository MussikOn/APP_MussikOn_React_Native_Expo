import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useSidebar } from '@contexts/SidebarContext';
import musicianRequestsAPI, { MusicianRequest } from '@services/musicianRequests';

interface RequestListProps {
  navigation?: any;
}

const RequestList: React.FC<RequestListProps> = ({ navigation: propNavigation }) => {
  const navigation = useNavigation();
  const { setActiveScreen } = useSidebar();
  const [requests, setRequests] = useState<MusicianRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const userRequests = await musicianRequestsAPI.getUserRequests();
      setRequests(userRequests);
    } catch (error: any) {
      console.error('Error loading requests:', error);
      Alert.alert(
        'Error',
        'No se pudieron cargar las solicitudes. Por favor, intenta de nuevo.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadRequests();
    setRefreshing(false);
  };

  const handleCancelRequest = async (requestId: string) => {
    Alert.alert(
      'Cancelar Solicitud',
      '¿Estás seguro de que quieres cancelar esta solicitud?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Sí, Cancelar',
          style: 'destructive',
          onPress: async () => {
            try {
              await musicianRequestsAPI.cancelRequest(requestId);
              Alert.alert('Éxito', 'Solicitud cancelada exitosamente');
              loadRequests(); // Recargar lista
            } catch (error: any) {
              console.error('Error canceling request:', error);
              Alert.alert('Error', 'No se pudo cancelar la solicitud');
            }
          },
        },
      ]
    );
  };

  const handleResendRequest = async (requestId: string) => {
    try {
      await musicianRequestsAPI.resendRequest(requestId);
      Alert.alert('Éxito', 'Solicitud reenviada exitosamente');
      loadRequests(); // Recargar lista
    } catch (error: any) {
      console.error('Error resending request:', error);
      Alert.alert('Error', 'No se pudo reenviar la solicitud');
    }
  };

  const navigateToShareMusician = () => {
    // Usar el sistema del sidebar para cambiar de pantalla
    setActiveScreen('ShareMusician');
  };

  const navigateToRequestDetail = (requestId: string) => {
    // Usar el sistema del sidebar para cambiar de pantalla
    setActiveScreen('RequestDetail');
    // Nota: Para pasar parámetros, necesitaríamos un sistema más complejo
    // Por ahora, usaremos el contexto global o AsyncStorage
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'searching_musician':
        return '#2196f3';
      case 'musician_found':
        return '#ff9800';
      case 'completed':
        return '#4caf50';
      case 'expired':
        return '#f44336';
      case 'cancelled':
        return '#9e9e9e';
      default:
        return '#666';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'searching_musician':
        return 'Buscando Músico';
      case 'musician_found':
        return 'Músico Encontrado';
      case 'completed':
        return 'Completado';
      case 'expired':
        return 'Expirado';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const renderRequestItem = ({ item }: { item: MusicianRequest }) => (
    <View style={styles.requestCard}>
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.7)']}
        style={styles.cardGradient}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.eventName}>{item.eventName}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
          </View>
        </View>

        <View style={styles.cardContent}>
          <View style={styles.infoRow}>
            <Ionicons name="calendar" size={16} color="#666" />
            <Text style={styles.infoText}>{formatDate(item.eventDate)}</Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="time" size={16} color="#666" />
            <Text style={styles.infoText}>
              {item.startTime} - {item.endTime}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="location" size={16} color="#666" />
            <Text style={styles.infoText}>{item.location}</Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="musical-notes" size={16} color="#666" />
            <Text style={styles.infoText}>{item.instrumentType}</Text>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Precio:</Text>
            <Text style={styles.priceValue}>RD$ {item.calculatedPrice.toLocaleString()}</Text>
          </View>
        </View>

        <View style={styles.cardActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigateToRequestDetail(item.id)}
          >
            <Ionicons name="eye" size={16} color="#2196f3" />
            <Text style={styles.actionButtonText}>Ver Detalles</Text>
          </TouchableOpacity>

          {item.status === 'searching_musician' && (
            <TouchableOpacity
              style={[styles.actionButton, styles.cancelButton]}
              onPress={() => handleCancelRequest(item.id)}
            >
              <Ionicons name="close-circle" size={16} color="#f44336" />
              <Text style={[styles.actionButtonText, styles.cancelButtonText]}>Cancelar</Text>
            </TouchableOpacity>
          )}

          {item.status === 'expired' && (
            <TouchableOpacity
              style={[styles.actionButton, styles.resendButton]}
              onPress={() => handleResendRequest(item.id)}
            >
              <Ionicons name="refresh" size={16} color="#ff9800" />
              <Text style={[styles.actionButtonText, styles.resendButtonText]}>Reenviar</Text>
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="document-text" size={64} color="#ccc" />
      <Text style={styles.emptyStateTitle}>No tienes solicitudes</Text>
      <Text style={styles.emptyStateSubtitle}>
        Crea tu primera solicitud de músico para comenzar
      </Text>
      <TouchableOpacity
        style={styles.createButton}
        onPress={navigateToShareMusician}
      >
        <Ionicons name="add" size={20} color="#fff" />
        <Text style={styles.createButtonText}>Crear Solicitud</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#667eea" />
        <Text style={styles.loadingText}>Cargando solicitudes...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.gradientBackground}
      />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mis Solicitudes</Text>
        <Text style={styles.headerSubtitle}>
          Gestiona tus solicitudes de músicos
        </Text>
      </View>

      <FlatList
        data={requests}
        renderItem={renderRequestItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={navigateToShareMusician}
      >
        <Ionicons name="add" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  listContainer: {
    padding: 20,
    paddingTop: 0,
  },
  requestCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6.27,
    elevation: 8,
  },
  cardGradient: {
    padding: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  eventName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  cardContent: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  priceLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  priceValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
  },
  actionButtonText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#2196f3',
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
  },
  cancelButtonText: {
    color: '#f44336',
  },
  resendButton: {
    backgroundColor: 'rgba(255, 152, 0, 0.1)',
  },
  resendButtonText: {
    color: '#ff9800',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginBottom: 24,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#667eea',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#667eea',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 6.27,
    elevation: 8,
  },
});

export default RequestList; 