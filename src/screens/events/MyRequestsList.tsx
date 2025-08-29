import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import { useTheme } from '@hooks/useAppTheme';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '@contexts/UserContext';
import { useNavigation } from '@react-navigation/native';
import { requestService, Request } from '@services/requests';
import Card from '@components/ui/Card';
import Button from '@components/ui/Button';
import { useSocket } from '@contexts/SocketContext';

const { width } = Dimensions.get('window');

const MyRequestsList: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { user } = useUser();
  const navigation = useNavigation();
  const { socket } = useSocket();
  
  // Estados
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Estados de filtros
  const [instrumentFilter, setInstrumentFilter] = useState('');
  const [dateFromFilter, setDateFromFilter] = useState('');
  const [dateToFilter, setDateToFilter] = useState('');

  // Cargar solicitudes del usuario
  const loadMyRequests = useCallback(async (refresh = false) => {
    try {
      if (refresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);
      
      console.log('🎵 Cargando mis solicitudes...');
      
      const response = await requestService.getMyRequests();
      
      if (response.success && response.data) {
        let filteredRequests = response.data;
        
        // Aplicar filtro de estado
        if (selectedStatus !== 'all') {
          filteredRequests = filteredRequests.filter((request: Request) => request.status === selectedStatus);
        }
        
        // Aplicar filtro de instrumento
        if (instrumentFilter) {
          filteredRequests = filteredRequests.filter((request: Request) => 
            request.instrument.toLowerCase().includes(instrumentFilter.toLowerCase())
          );
        }
        
        // Aplicar filtros de fecha
        if (dateFromFilter) {
          filteredRequests = filteredRequests.filter((request: Request) => 
            new Date(request.date) >= new Date(dateFromFilter)
          );
        }
        
        if (dateToFilter) {
          filteredRequests = filteredRequests.filter((request: Request) => 
            new Date(request.date) <= new Date(dateToFilter)
          );
        }
        
        setRequests(filteredRequests);
        console.log(`✅ ${filteredRequests.length} solicitudes cargadas`);
      } else {
        setError(response.message || 'Error al cargar solicitudes');
        console.error('❌ Error en respuesta:', response);
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Error desconocido al cargar solicitudes';
      setError(errorMessage);
      console.error('❌ Error cargando solicitudes:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedStatus, instrumentFilter, dateFromFilter, dateToFilter]);

  // Cargar solicitudes al montar el componente
  useEffect(() => {
    if (user) {
      loadMyRequests();
    }
  }, [user, loadMyRequests]);

  // Escuchar cambios en tiempo real
  useEffect(() => {
    if (socket) {
      socket.on('request-updated', (updatedRequest: Request) => {
        setRequests(prev => 
          prev.map(req => 
            req.id === updatedRequest.id ? updatedRequest : req
          )
        );
      });

      socket.on('request-cancelled', (cancelledRequestId: string) => {
        setRequests(prev => 
          prev.filter(req => req.id !== cancelledRequestId)
        );
      });

      socket.on('request-completed', (completedRequestId: string) => {
        setRequests(prev => 
          prev.map(req => 
            req.id === completedRequestId 
              ? { ...req, status: 'completada' }
              : req
          )
        );
      });

      return () => {
        socket.off('request-updated');
        socket.off('request-cancelled');
        socket.off('request-completed');
      };
    }
  }, [socket]);

  // Aplicar filtros
  const applyFilters = () => {
    loadMyRequests();
    setShowFilters(false);
  };

  // Limpiar filtros
  const clearFilters = () => {
    setSelectedStatus('all');
    setInstrumentFilter('');
    setDateFromFilter('');
    setDateToFilter('');
    loadMyRequests();
  };

  // Navegar a detalles de solicitud
  const navigateToRequestDetail = (requestId: string) => {
    (navigation as any).navigate('RequestDetail', { requestId });
  };

  // Navegar a crear nueva solicitud
  const navigateToCreateRequest = () => {
    (navigation as any).navigate('ShareMusicianScreen');
  };

  // Renderizar item de solicitud
  const renderRequestItem = ({ item }: { item: Request }) => {
    const getStatusColor = (status: string) => {
      switch (status) {
        case 'pendiente':
          return theme.colors.warning[500];
        case 'asignada':
          return theme.colors.primary[500];
        case 'completada':
          return theme.colors.success[500];
        case 'cancelada':
          return theme.colors.error[500];
        default:
          return theme.colors.text.secondary;
      }
    };

    const getStatusText = (status: string) => {
      switch (status) {
        case 'pendiente':
          return 'Pendiente';
        case 'asignada':
          return 'Asignada';
        case 'completada':
          return 'Completada';
        case 'cancelada':
          return 'Cancelada';
        default:
          return status;
      }
    };

    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    };

    const formatTime = (timeString: string) => {
      return timeString;
    };

    return (
      <TouchableOpacity
        onPress={() => navigateToRequestDetail(item.id!)}
        style={styles.requestItem}
      >
        <Card style={styles.requestCard}>
          <View style={styles.requestHeader}>
            <View style={styles.requestInfo}>
              <Text style={[styles.eventType, { color: theme.colors.text.primary }]}>
                {item.eventType}
              </Text>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                <Text style={styles.statusText}>
                  {getStatusText(item.status)}
                </Text>
              </View>
            </View>
            <Text style={[styles.requestId, { color: theme.colors.text.secondary }]}>
              #{item.id?.slice(-6)}
            </Text>
          </View>

          <View style={styles.requestDetails}>
            <View style={styles.detailRow}>
              <Ionicons name="calendar-outline" size={16} color={theme.colors.text.secondary} />
              <Text style={[styles.detailText, { color: theme.colors.text.primary }]}>
                {formatDate(item.date)} • {formatTime(item.time)}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Ionicons name="location-outline" size={16} color={theme.colors.text.secondary} />
              <Text style={[styles.detailText, { color: theme.colors.text.primary }]}>
                {item.location}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Ionicons name="musical-notes-outline" size={16} color={theme.colors.text.secondary} />
              <Text style={[styles.detailText, { color: theme.colors.text.primary }]}>
                {item.instrument}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Ionicons name="cash-outline" size={16} color={theme.colors.text.secondary} />
              <Text style={[styles.detailText, { color: theme.colors.text.primary }]}>
                ${item.budget}
              </Text>
            </View>
          </View>

          {item.comments && (
            <View style={styles.commentsContainer}>
              <Text style={[styles.commentsLabel, { color: theme.colors.text.secondary }]}>
                Comentarios:
              </Text>
              <Text style={[styles.commentsText, { color: theme.colors.text.primary }]}>
                {item.comments}
              </Text>
            </View>
          )}

          <View style={styles.requestActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigateToRequestDetail(item.id!)}
            >
              <Ionicons name="eye-outline" size={20} color={theme.colors.primary[500]} />
              <Text style={[styles.actionText, { color: theme.colors.primary[500] }]}>
                Ver Detalles
              </Text>
            </TouchableOpacity>

            {item.status === 'asignada' && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => {
                  (navigation as any).navigate('Chat', { conversationId: `request_${item.id}` });
                }}
              >
                <Ionicons name="chatbubble-outline" size={20} color={theme.colors.accent[500]} />
                <Text style={[styles.actionText, { color: theme.colors.accent[500] }]}>
                  Chat
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

  // Renderizar filtros
  const renderFilters = () => {
    if (!showFilters) return null;

    return (
      <Card style={styles.filtersCard}>
        <Text style={[styles.filtersTitle, { color: theme.colors.text.primary }]}>
          Filtros
        </Text>
        
        <View style={styles.filterRow}>
          <Text style={[styles.filterLabel, { color: theme.colors.text.secondary }]}>
            Estado:
          </Text>
          <View style={styles.statusFilterContainer}>
            {['all', 'pendiente', 'asignada', 'completada', 'cancelada'].map((status) => (
              <TouchableOpacity
                key={status}
                style={[
                  styles.statusFilterButton,
                  selectedStatus === status && { backgroundColor: theme.colors.primary[500] }
                ]}
                onPress={() => setSelectedStatus(status)}
              >
                <Text style={[
                  styles.statusFilterText,
                  { color: selectedStatus === status ? 'white' : theme.colors.text.primary }
                ]}>
                  {status === 'all' ? 'Todos' : status}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.filterActions}>
          <Button
            title="Aplicar Filtros"
            onPress={applyFilters}
            style={styles.applyFiltersButton}
          />
          <Button
            title="Limpiar"
            onPress={clearFilters}
            style={styles.clearFiltersButton}
          />
        </View>
      </Card>
    );
  };

  if (loading && !refreshing) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background.primary }]}>
        <ActivityIndicator size="large" color={theme.colors.primary[500]} />
        <Text style={[styles.loadingText, { color: theme.colors.text.secondary }]}>
          Cargando solicitudes...
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={[styles.title, { color: theme.colors.text.primary }]}>
            Mis Solicitudes
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>
            {requests.length} solicitud{requests.length !== 1 ? 'es' : ''} encontrada{requests.length !== 1 ? 's' : ''}
          </Text>
        </View>
        
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={[styles.filterButton, { backgroundColor: theme.colors.background.card }]}
            onPress={() => setShowFilters(!showFilters)}
          >
            <Ionicons 
              name={showFilters ? "close" : "filter-outline"} 
              size={24} 
              color={theme.colors.text.primary} 
            />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.createButton, { backgroundColor: theme.colors.primary[500] }]}
            onPress={navigateToCreateRequest}
          >
            <Ionicons name="add" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Filtros */}
      {renderFilters()}

      {/* Lista de solicitudes */}
      {error ? (
        <Card style={styles.errorCard}>
          <Ionicons name="alert-circle-outline" size={48} color={theme.colors.error[500]} />
          <Text style={[styles.errorTitle, { color: theme.colors.text.primary }]}>
            Error al Cargar
          </Text>
          <Text style={[styles.errorText, { color: theme.colors.text.secondary }]}>
            {error}
          </Text>
          <Button
            title="Reintentar"
            onPress={() => loadMyRequests()}
            style={styles.retryButton}
          />
        </Card>
      ) : requests.length === 0 ? (
        <Card style={styles.emptyCard}>
          <Ionicons name="document-outline" size={64} color={theme.colors.text.secondary} />
          <Text style={[styles.emptyTitle, { color: theme.colors.text.primary }]}>
            No tienes solicitudes
          </Text>
          <Text style={[styles.emptyText, { color: theme.colors.text.secondary }]}>
            Crea tu primera solicitud de músico para comenzar
          </Text>
          <Button
            title="Crear Solicitud"
            onPress={navigateToCreateRequest}
            style={styles.createFirstButton}
          />
        </Card>
      ) : (
        <FlatList
          data={requests}
          renderItem={renderRequestItem}
          keyExtractor={(item) => item.id!}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => loadMyRequests(true)}
              colors={[theme.colors.primary[500]]}
            />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 8,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  filterButton: {
    padding: 12,
    borderRadius: 12,
  },
  createButton: {
    padding: 12,
    borderRadius: 12,
  },
  filtersCard: {
    margin: 16,
    marginBottom: 8,
  },
  filtersTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  filterRow: {
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  statusFilterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statusFilterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  statusFilterText: {
    fontSize: 14,
    fontWeight: '500',
  },
  filterActions: {
    flexDirection: 'row',
    gap: 12,
  },
  applyFiltersButton: {
    flex: 1,
  },
  clearFiltersButton: {
    flex: 1,
    backgroundColor: '#6b7280',
  },
  listContainer: {
    padding: 16,
    paddingTop: 8,
  },
  requestItem: {
    marginBottom: 12,
  },
  requestCard: {
    padding: 16,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  requestInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  eventType: {
    fontSize: 18,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  requestId: {
    fontSize: 12,
    fontFamily: 'monospace',
  },
  requestDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  commentsContainer: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
  },
  commentsLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  commentsText: {
    fontSize: 14,
    lineHeight: 20,
  },
  requestActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  errorCard: {
    margin: 16,
    alignItems: 'center',
    padding: 24,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  retryButton: {
    minWidth: 120,
  },
  emptyCard: {
    margin: 16,
    alignItems: 'center',
    padding: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  createFirstButton: {
    minWidth: 160,
  },
});

export default MyRequestsList; 