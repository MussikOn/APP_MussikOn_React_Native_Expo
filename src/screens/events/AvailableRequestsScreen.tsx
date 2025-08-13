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
import { useSidebar } from '@contexts/SidebarContext';
import { requestService, Request, RequestFilters } from '@services/requests';
import Card from '@components/ui/Card';
import Button from '@components/ui/Button';
import Input from '@components/ui/Input';

const { width } = Dimensions.get('window');

const AvailableRequestsScreen: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { openSidebar } = useSidebar();
  
  // Estados
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<RequestFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  
  // Filtros
  const [instrumentFilter, setInstrumentFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [budgetMinFilter, setBudgetMinFilter] = useState('');
  const [budgetMaxFilter, setBudgetMaxFilter] = useState('');
  const [eventTypeFilter, setEventTypeFilter] = useState('');
  const [queryFilter, setQueryFilter] = useState('');

  // Cargar solicitudes disponibles
  const loadAvailableRequests = useCallback(async (refresh = false) => {
    try {
      setLoading(true);
      setError(null);
      
      // Aplicar filtros en el formato correcto del backend
      const appliedFilters: RequestFilters = {};
      if (instrumentFilter) appliedFilters.instrument = instrumentFilter;
      if (locationFilter) appliedFilters.location = locationFilter;
      if (budgetMinFilter || budgetMaxFilter) {
        appliedFilters.budget = {};
        if (budgetMinFilter) appliedFilters.budget.min = parseFloat(budgetMinFilter);
        if (budgetMaxFilter) appliedFilters.budget.max = parseFloat(budgetMaxFilter);
      }
      if (eventTypeFilter) appliedFilters.eventType = eventTypeFilter;
      if (queryFilter) appliedFilters.query = queryFilter;
      
      console.log('🔍 Cargando solicitudes disponibles con filtros:', appliedFilters);
      
      const response = await requestService.getAvailableRequests(appliedFilters);
      
      if (response.success && response.data) {
        setRequests(response.data);
        console.log(`✅ ${response.data.length} solicitudes cargadas`);
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
  }, [instrumentFilter, locationFilter, budgetMinFilter, budgetMaxFilter, eventTypeFilter, queryFilter]);

  // Aceptar solicitud
  const handleAcceptRequest = async (requestId: string) => {
    try {
      Alert.alert(
        'Confirmar Aceptación',
        '¿Estás seguro de que quieres aceptar esta solicitud?',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Aceptar',
            style: 'default',
            onPress: async () => {
              setLoading(true);
              try {
                const response = await requestService.acceptRequest(requestId);
                if (response.success) {
                  Alert.alert('¡Éxito!', 'Solicitud aceptada correctamente');
                  // Recargar solicitudes
                  loadAvailableRequests();
                } else {
                  Alert.alert('Error', response.message || 'No se pudo aceptar la solicitud');
                }
              } catch (err: any) {
                Alert.alert('Error', err.message || 'Error al aceptar la solicitud');
              } finally {
                setLoading(false);
              }
            }
          }
        ]
      );
    } catch (err: any) {
      Alert.alert('Error', 'No se pudo procesar la solicitud');
    }
  };

  // Aplicar filtros
  const applyFilters = () => {
    const appliedFilters: RequestFilters = {};
    if (instrumentFilter) appliedFilters.instrument = instrumentFilter;
    if (locationFilter) appliedFilters.location = locationFilter;
    if (budgetMinFilter || budgetMaxFilter) {
      appliedFilters.budget = {};
      if (budgetMinFilter) appliedFilters.budget.min = parseFloat(budgetMinFilter);
      if (budgetMaxFilter) appliedFilters.budget.max = parseFloat(budgetMaxFilter);
    }
    if (eventTypeFilter) appliedFilters.eventType = eventTypeFilter;
    if (queryFilter) appliedFilters.query = queryFilter;
    
    setFilters(appliedFilters);
    loadAvailableRequests();
  };

  // Limpiar filtros
  const clearFilters = () => {
    setInstrumentFilter('');
    setLocationFilter('');
    setBudgetMinFilter('');
    setBudgetMaxFilter('');
    setFilters({});
    loadAvailableRequests();
  };

  // Refrescar
  const onRefresh = () => {
    setRefreshing(true);
    loadAvailableRequests(true);
  };

  // Cargar al montar
  useEffect(() => {
    loadAvailableRequests();
  }, []);

  // Renderizar item de solicitud
  const renderRequestItem = ({ item }: { item: Request }) => (
    <Card style={styles.requestCard}>
      <View style={styles.requestHeader}>
        <View style={styles.requestInfo}>
          <Text style={[styles.eventType, { color: '#014aad' }]}>
            {item.eventType}
          </Text>
          <Text style={[styles.date, { color: '#333333' }]}>
            {formatDate(item.date)}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
        </View>
      </View>

      <View style={styles.requestDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="location" size={16} color="#333333" />
          <Text style={[styles.detailText, { color: '#333333' }]}>
            {item.location}
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <Ionicons name="musical-notes" size={16} color="#333333" />
          <Text style={[styles.detailText, { color: '#333333' }]}>
            {item.instrument}
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <Ionicons name="time" size={16} color="#333333" />
          <Text style={[styles.detailText, { color: '#333333' }]}>
            {item.time}
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <Ionicons name="cash" size={16} color="#333333" />
          <Text style={[styles.detailText, { color: '#333333' }]}>
            ${item.budget}
          </Text>
        </View>
        
        {item.comments && (
          <View style={styles.detailRow}>
            <Ionicons name="chatbubble" size={16} color="#333333" />
            <Text style={[styles.detailText, { color: '#333333' }]}>
              {item.comments}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.requestActions}>
        <Button
          title="Ver Detalles"
          onPress={() => {
            // TODO: Navegar a detalles de la solicitud
            console.log('Ver detalles de solicitud:', item.id);
          }}
          style={styles.detailsButton}
        />
        
        {item.status === 'pendiente' && (
          <Button
            title="Aceptar"
            onPress={() => handleAcceptRequest(item.id!)}
            style={styles.acceptButton}
          />
        )}
      </View>
    </Card>
  );

  // Renderizar filtros
  const renderFilters = () => (
    <View style={[styles.filtersContainer, { backgroundColor: theme.colors.background.card }]}>
      <View style={styles.filterRow}>
        <Input
          label="Instrumento"
          placeholder="Instrumento"
          value={instrumentFilter}
          onChangeText={setInstrumentFilter}
          style={styles.filterInput}
        />
        <Input
          label="Ubicación"
          placeholder="Ubicación"
          value={locationFilter}
          onChangeText={setLocationFilter}
          style={styles.filterInput}
        />
      </View>
      
      <View style={styles.filterRow}>
        <Input
          label="Presupuesto mínimo"
          placeholder="Presupuesto mínimo"
          value={budgetMinFilter}
          onChangeText={setBudgetMinFilter}
          keyboardType="numeric"
          style={styles.filterInput}
        />
        <Input
          label="Presupuesto máximo"
          placeholder="Presupuesto máximo"
          value={budgetMaxFilter}
          onChangeText={setBudgetMaxFilter}
          keyboardType="numeric"
          style={styles.filterInput}
        />
      </View>

      <View style={styles.filterActions}>
        <Button
          title="Aplicar Filtros"
          onPress={applyFilters}
          style={styles.filterButton}
        />
        <Button
          title="Limpiar"
          onPress={clearFilters}
          type="outline"
          style={styles.filterButton}
        />
      </View>
    </View>
  );

  // Renderizar contenido
  if (loading && !refreshing) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
        <ActivityIndicator size="large" color={theme.colors.primary[500]} />
        <Text style={[styles.loadingText, { color: theme.colors.text.secondary }]}>
          Cargando solicitudes disponibles...
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
      {/* Header personalizado con botón del sidebar */}
      <View style={[styles.customHeader, { backgroundColor: theme.colors.background.primary }]}>
        <TouchableOpacity
          onPress={openSidebar}
          style={[styles.sidebarButton, {
            backgroundColor: theme.colors.background.card,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 3.84,
            elevation: 5,
          }]}
          accessibilityLabel="Abrir menú"
        >
          <Ionicons name="menu" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text.primary }]}>
          Solicitudes Disponibles
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Contenido principal */}
      <View style={styles.content}>
        {/* Filtros */}
        {showFilters && renderFilters()}

        {/* Lista de solicitudes */}
        {error ? (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle-outline" size={48} color={theme.colors.error[500]} />
            <Text style={[styles.errorText, { color: theme.colors.error[500] }]}>
              {error}
            </Text>
            <Button
              title="Reintentar"
              onPress={() => loadAvailableRequests()}
              style={styles.retryButton}
            />
          </View>
        ) : requests.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="list-outline" size={80} color={theme.colors.text.secondary} />
            <Text style={[styles.emptyTitle, { color: theme.colors.text.primary }]}>
              No hay solicitudes disponibles
            </Text>
            <Text style={[styles.emptyMessage, { color: theme.colors.text.secondary }]}>
              {filters.instrument || filters.location || filters.budget?.min || filters.budget?.max
                ? 'Intenta ajustar los filtros de búsqueda'
                : 'No hay solicitudes activas en este momento'}
            </Text>
            <Button
              title="Refrescar"
              onPress={onRefresh}
              type="outline"
              style={styles.refreshButton}
            />
          </View>
        ) : (
          <FlatList
            data={requests}
            renderItem={renderRequestItem}
            keyExtractor={(item) => item.id || `request-${Math.random()}`}
            contentContainerStyle={styles.listContainer}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[theme.colors.primary[500]]}
              />
            }
            showsVerticalScrollIndicator={false}
          />
        )}

        {/* Contador de resultados */}
        {requests.length > 0 && (
          <View style={[styles.resultsCount, { backgroundColor: theme.colors.background.card }]}>
            <Text style={[styles.resultsText, { color: theme.colors.text.secondary }]}>
              {requests.length} solicitud{requests.length !== 1 ? 'es' : ''} disponible{requests.length !== 1 ? 's' : ''}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

// Funciones auxiliares - ALINEADAS CON BACKEND
const getStatusColor = (status: string) => {
  switch (status) {
    case 'pendiente': return '#f59e0b'; // Amarillo para pendiente
    case 'asignada': return '#10b981'; // Verde para asignada
    case 'no_asignada': return '#6b7280'; // Gris para no asignada
    case 'cancelada': return '#ef4444'; // Rojo para cancelada
    case 'completada': return '#3b82f6'; // Azul para completada
    default: return '#6b7280';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'pendiente': return 'Pendiente';
    case 'asignada': return 'Asignada';
    case 'no_asignada': return 'No Asignada';
    case 'cancelada': return 'Cancelada';
    case 'completada': return 'Completada';
    default: return 'Desconocido';
  }
};

const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch {
    return dateString;
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  customHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sidebarButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  headerSpacer: {
    width: 44, // Ajustar según sea necesario para balancear el botón
  },
  content: {
    flex: 1,
    padding: 16,
  },
  filtersContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  filterRow: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 12,
  },
  filterInput: {
    flex: 1,
  },
  filterActions: {
    flexDirection: 'row',
    gap: 12,
  },
  filterButton: {
    flex: 1,
  },
  listContainer: {
    padding: 16,
    paddingBottom: 80,
  },
  requestCard: {
    marginBottom: 16,
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
    marginRight: 12,
  },
  eventType: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 14,
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  requestDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    marginLeft: 8,
    fontSize: 14,
    flex: 1,
  },
  commentContainer: {
    marginTop: 8,
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 8,
  },
  commentText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  requestActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  retryButton: {
    minWidth: 120,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  refreshButton: {
    minWidth: 120,
  },
  resultsCount: {
    padding: 12,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  resultsText: {
    fontSize: 14,
    fontWeight: '500',
  },
  detailsButton: {
    flex: 1,
    backgroundColor: '#014aad', // theme.colors.primary[500]
  },
  acceptButton: {
    flex: 1,
    backgroundColor: '#23cd73', // theme.colors.success[500]
  },
});

export default AvailableRequestsScreen; 