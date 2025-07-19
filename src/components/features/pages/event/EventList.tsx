import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  TextInput,
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { eventService, Event, EventFilters } from '@services/events';
import { useEventService } from '@services/events';
import { getData } from '@utils/functions';
import { Token } from '@appTypes/DatasTypes';
import {
  color_primary,
  color_white,
  color_secondary,
  color_danger,
  color_success,
  color_info,
  btn_primary,
  btn_success,
  btn_danger,
  border_color_primary,
  text_primary,
  text_secondary,
} from '@styles/Styles';

interface EventListProps {
  onEventPress?: (eventId: string) => void;
  onCreateEvent?: () => void;
}

const EventList: React.FC<EventListProps> = ({ onEventPress, onCreateEvent }) => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { loading, error, executeRequest } = useEventService();
  const [events, setEvents] = useState<Event[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<EventFilters>({});
  const [user, setUser] = useState<Token | null>(null);
  const [activeTab, setActiveTab] = useState<'available' | 'my-events'>('available');

  useEffect(() => {
    loadUser();
    loadEvents();
  }, [activeTab]);

  const loadUser = async () => {
    const userData = await getData();
    if (userData) {
      setUser(userData);
    }
  };

  const loadEvents = async () => {
    try {
      let result;
      
      if (activeTab === 'available') {
        result = await executeRequest(() => eventService.getAvailableRequests(filters));
      } else {
        result = await executeRequest(() => eventService.getMyEvents());
      }

      if (result?.success && result.data) {
        setEvents(result.data as Event[]);
      }
    } catch (error) {
      console.error('Error loading events:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadEvents();
    setRefreshing(false);
  };

  const handleAcceptEvent = async (eventId: string) => {
    Alert.alert(
      'Aceptar Solicitud',
      '¿Estás seguro de que quieres aceptar esta solicitud?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Aceptar',
          onPress: async () => {
            try {
              const result = await executeRequest(() => eventService.acceptEventRequest(eventId));
              if (result?.success) {
                Alert.alert('Éxito', 'Solicitud aceptada exitosamente');
                loadEvents(); // Recargar lista
              } else {
                Alert.alert('Error', result?.message || 'Error al aceptar la solicitud');
              }
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Error al aceptar la solicitud');
            }
          },
        },
      ]
    );
  };

  const handleCreateEvent = () => {
    // Navegar al wizard de creación de eventos
    navigation.navigate('EventRequestWizard' as never);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending_musician':
        return color_info;
      case 'assigned':
        return color_success;
      case 'completed':
        return color_secondary;
      case 'cancelled':
        return color_danger;
      default:
        return color_secondary;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending_musician':
        return 'Pendiente';
      case 'assigned':
        return 'Asignado';
      case 'completed':
        return 'Completado';
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

  const formatTime = (timeString: string) => {
    return timeString;
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const filteredEvents = events.filter(event =>
    event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.eventType.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.instrument.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderEventItem = ({ item }: { item: Event }) => (
    <TouchableOpacity
      style={styles.eventCard}
      onPress={() => onEventPress?.(item.id)}
      activeOpacity={0.7}
    >
      <View style={styles.eventHeader}>
        <Text style={styles.eventName}>{item.name}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
        </View>
      </View>

      <View style={styles.eventDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="calendar" size={16} color={color_primary} />
          <Text style={styles.detailText}>{formatDate(item.date)}</Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="time" size={16} color={color_primary} />
          <Text style={styles.detailText}>{formatTime(item.time)} ({formatDuration(item.duration)})</Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="musical-notes" size={16} color={color_primary} />
          <Text style={styles.detailText}>{item.instrument}</Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="location" size={16} color={color_primary} />
          <Text style={styles.detailText} numberOfLines={1}>{item.location.address}</Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="cash" size={16} color={color_primary} />
          <Text style={styles.detailText}>${item.budget}</Text>
        </View>
      </View>

      {activeTab === 'available' && item.status === 'pending_musician' && (
        <TouchableOpacity
          style={[styles.actionButton, styles.acceptButton]}
          onPress={() => handleAcceptEvent(item.id)}
          disabled={loading}
        >
          <Ionicons name="checkmark" size={16} color={color_white} />
          <Text style={styles.actionButtonText}>Aceptar</Text>
        </TouchableOpacity>
      )}

      {item.additionalComments && (
        <View style={styles.commentsContainer}>
          <Text style={styles.commentsLabel}>Comentarios:</Text>
          <Text style={styles.commentsText} numberOfLines={2}>
            {item.additionalComments}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="list" size={64} color={color_secondary} />
      <Text style={styles.emptyStateTitle}>No hay eventos</Text>
      <Text style={styles.emptyStateText}>
        {activeTab === 'available' 
          ? 'No hay solicitudes disponibles en este momento'
          : 'No tienes eventos en esta categoría'
        }
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header con tabs */}
      <View style={styles.header}>
        <Text style={styles.title}>Eventos</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
          <Ionicons name="refresh" size={20} color={color_primary} />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'available' && styles.activeTab]}
          onPress={() => setActiveTab('available')}
        >
          <Text style={[styles.tabText, activeTab === 'available' && styles.activeTabText]}>
            Disponibles
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'my-events' && styles.activeTab]}
          onPress={() => setActiveTab('my-events')}
        >
          <Text style={[styles.tabText, activeTab === 'my-events' && styles.activeTabText]}>
            Mis Eventos
          </Text>
        </TouchableOpacity>
      </View>

      {/* Búsqueda */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={color_secondary} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar eventos..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Filtros */}
      {activeTab === 'available' && (
        <View style={styles.filtersContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity
              style={[styles.filterChip, !filters.instrument && styles.filterChipActive]}
              onPress={() => setFilters({ ...filters, instrument: undefined })}
            >
              <Text style={styles.filterChipText}>Todos</Text>
            </TouchableOpacity>
            {['Guitarra', 'Piano', 'Violín', 'Saxofón', 'Batería', 'Bajo', 'Vocalista', 'DJ'].map((instrument) => (
              <TouchableOpacity
                key={instrument}
                style={[
                  styles.filterChip,
                  filters.instrument === instrument && styles.filterChipActive,
                ]}
                onPress={() => setFilters({ ...filters, instrument })}
              >
                <Text style={styles.filterChipText}>{instrument}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Botón crear evento */}
      {user?.roll === 'eventCreator' && (
        <TouchableOpacity style={styles.createButton} onPress={handleCreateEvent}>
          <Ionicons name="add" size={20} color={color_white} />
          <Text style={styles.createButtonText}>Crear Evento</Text>
        </TouchableOpacity>
      )}

      {/* Lista de eventos */}
      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={color_primary} />
          <Text style={styles.loadingText}>Cargando eventos...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredEvents}
          renderItem={renderEventItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={renderEmptyState}
          showsVerticalScrollIndicator={false}
        />
      )}

      {error && (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={20} color={color_danger} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color_white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: border_color_primary,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: text_primary,
  },
  refreshButton: {
    padding: 8,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: color_primary,
  },
  tabText: {
    fontSize: 16,
    color: text_secondary,
    fontWeight: '500',
  },
  activeTabText: {
    color: color_primary,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 20,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: border_color_primary,
    borderRadius: 8,
    backgroundColor: color_white,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: text_primary,
  },
  filtersContainer: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: border_color_primary,
    backgroundColor: color_white,
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: color_primary,
    borderColor: color_primary,
  },
  filterChipText: {
    color: text_primary,
    fontSize: 14,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color_primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginHorizontal: 20,
    marginBottom: 10,
  },
  createButtonText: {
    color: color_white,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  listContainer: {
    padding: 20,
  },
  eventCard: {
    backgroundColor: color_white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: border_color_primary,
    elevation: 2,
    shadowColor: color_primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  eventName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: text_primary,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: color_white,
    fontSize: 12,
    fontWeight: '600',
  },
  eventDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 14,
    color: text_secondary,
    marginLeft: 8,
    flex: 1,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 12,
  },
  acceptButton: {
    backgroundColor: btn_success,
  },
  actionButtonText: {
    color: color_white,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  commentsContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: border_color_primary,
  },
  commentsLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: text_primary,
    marginBottom: 4,
  },
  commentsText: {
    fontSize: 12,
    color: text_secondary,
    fontStyle: 'italic',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: text_secondary,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: text_primary,
    marginTop: 16,
  },
  emptyStateText: {
    fontSize: 14,
    color: text_secondary,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 40,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffebee',
    padding: 12,
    margin: 20,
    borderRadius: 8,
  },
  errorText: {
    color: color_danger,
    fontSize: 14,
    marginLeft: 8,
  },
});

export default EventList; 