import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  ActivityIndicator,
  RefreshControl,
  Platform
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@contexts/ThemeContext';
import { useUser } from '@contexts/UserContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { requestService } from '@services/requests';
import { Request } from '@services/requests';

interface AvailableRequestsScreenProps {
  navigation: any;
}

const AvailableRequestsScreen: React.FC<AvailableRequestsScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const { user } = useUser();
  const insets = useSafeAreaInsets();
  
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [acceptingRequest, setAcceptingRequest] = useState<string | null>(null);

  useEffect(() => {
    loadAvailableRequests();
  }, []);

  const loadAvailableRequests = async () => {
    try {
      setLoading(true);
      const response = await requestService.getAvailableRequests();
      if (response.data) {
        setRequests(response.data);
      }
    } catch (error: any) {
      console.error('Error loading available requests:', error);
      Alert.alert('Error', 'No se pudieron cargar las solicitudes disponibles');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAvailableRequests();
    setRefreshing(false);
  };

  const handleAcceptRequest = async (request: Request) => {
    Alert.alert(
      'Aceptar Solicitud',
      `¿Estás seguro de que quieres aceptar la solicitud "${request.name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Aceptar',
          style: 'default',
          onPress: async () => {
            try {
              setAcceptingRequest(request.id);
              
              // Feedback táctil
              if (Platform.OS === 'ios') {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              }

              const response = await requestService.acceptRequest(request.id);
              
              if (response.success) {
                Alert.alert(
                  '¡Solicitud Aceptada!',
                  'Has aceptado la solicitud exitosamente. El organizador será notificado.',
                  [
                    {
                      text: 'Ver Detalles',
                      onPress: () => {
                        navigation.navigate('RequestDetail', { requestId: request.id });
                      },
                    },
                    {
                      text: 'Continuar',
                      style: 'cancel',
                    },
                  ]
                );
                
                // Recargar lista
                await loadAvailableRequests();
              } else {
                Alert.alert('Error', response.message || 'No se pudo aceptar la solicitud');
              }
            } catch (error: any) {
              console.error('Error accepting request:', error);
              Alert.alert('Error', 'No se pudo aceptar la solicitud');
            } finally {
              setAcceptingRequest(null);
            }
          },
        },
      ]
    );
  };

  const handleViewDetails = (request: Request) => {
    navigation.navigate('RequestDetail', { requestId: request.id });
  };

  const formatDate = (date: string) => {
    if (!date) return 'Fecha no especificada';
    return new Date(date).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (time: string) => {
    if (!time) return 'Hora no especificada';
    return time;
  };

  const renderRequestCard = ({ item: request }: { item: Request }) => (
    <View style={[
      styles.requestCard,
      { 
        backgroundColor: theme.colors.background.card,
        borderColor: theme.colors.border.primary,
      }
    ]}>
      {/* Header */}
      <View style={styles.cardHeader}>
        <View style={styles.cardTitleContainer}>
                  <Text style={[styles.cardTitle, { color: theme.colors.text.primary }]}>
          {request.name || 'Solicitud sin nombre'}
        </Text>
          <View style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(request.status) }
          ]}>
            <Text style={styles.statusText}>
              {getStatusText(request.status)}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => handleViewDetails(request)}
          style={styles.detailsButton}
        >
          <Ionicons name="chevron-forward" size={20} color={theme.colors.text.tertiary} />
        </TouchableOpacity>
      </View>

      {/* Información Principal */}
      <View style={styles.cardContent}>
        {/* Fecha y Hora */}
        <View style={styles.infoRow}>
          <Ionicons name="calendar" size={16} color={theme.colors.primary[500]} />
          <Text style={[styles.infoText, { color: theme.colors.text.secondary }]}>
            {formatDate(request.date)} - {formatTime(request.time)}
          </Text>
        </View>

        {/* Ubicación */}
        <View style={styles.infoRow}>
          <Ionicons name="location" size={16} color={theme.colors.primary[500]} />
          <Text style={[styles.infoText, { color: theme.colors.text.secondary }]}>
            {request.location?.address || 'Ubicación no especificada'}
          </Text>
        </View>

        {/* Instrumento */}
        <View style={styles.infoRow}>
          <Ionicons name="musical-notes" size={16} color={theme.colors.primary[500]} />
          <Text style={[styles.infoText, { color: theme.colors.text.secondary }]}>
            {request.instrument || 'Instrumento no especificado'}
          </Text>
        </View>

        {/* Presupuesto */}
        <View style={styles.infoRow}>
          <Ionicons name="cash" size={16} color={theme.colors.primary[500]} />
          <Text style={[styles.infoText, { color: theme.colors.text.secondary }]}>
            ${request.budget ? request.budget.toLocaleString() : 'No especificado'}
          </Text>
        </View>

        {/* Duración */}
        <View style={styles.infoRow}>
          <Ionicons name="hourglass" size={16} color={theme.colors.primary[500]} />
          <Text style={[styles.infoText, { color: theme.colors.text.secondary }]}>
            {request.duration ? `${request.duration} horas` : 'Duración no especificada'}
          </Text>
        </View>

        {/* Tipo de Evento */}
        <View style={styles.infoRow}>
          <Ionicons name="information-circle" size={16} color={theme.colors.primary[500]} />
          <Text style={[styles.infoText, { color: theme.colors.text.secondary }]}>
            Tipo: {request.eventType || request.requestType || 'No especificado'}
          </Text>
        </View>

        {/* Llevar Instrumento */}
        <View style={styles.infoRow}>
          <Ionicons name="musical-note" size={16} color={theme.colors.primary[500]} />
          <Text style={[styles.infoText, { color: theme.colors.text.secondary }]}>
            Llevar instrumento: {request.bringInstrument ? 'Sí' : 'No'}
          </Text>
        </View>

        {/* Fecha de Creación */}
        <View style={styles.infoRow}>
          <Ionicons name="time-outline" size={16} color={theme.colors.primary[500]} />
          <Text style={[styles.infoText, { color: theme.colors.text.secondary }]}>
            Creada: {request.createdAt ? new Date(request.createdAt).toLocaleDateString('es-ES', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric'
            }) : 'Fecha no especificada'}
          </Text>
        </View>

        {/* Comentarios */}
        {(request.comments || request.additionalComments) && (
          <View style={styles.commentsContainer}>
            <Ionicons name="chatbubble-outline" size={16} color={theme.colors.primary[500]} />
            <Text style={[styles.commentsText, { color: theme.colors.text.tertiary }]}>
              {request.comments || request.additionalComments}
            </Text>
          </View>
        )}
      </View>

      {/* Botones de Acción */}
      <View style={styles.cardActions}>
        <TouchableOpacity
          onPress={() => handleViewDetails(request)}
          style={[
            styles.actionButton,
            styles.secondaryButton,
            { borderColor: theme.colors.border.primary }
          ]}
        >
          <Ionicons name="eye" size={16} color={theme.colors.primary[500]} />
          <Text style={[styles.actionButtonText, { color: theme.colors.primary[500] }]}>
            Ver Detalles
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleAcceptRequest(request)}
          disabled={acceptingRequest === request.id}
          style={[
            styles.actionButton,
            styles.primaryButton,
            { backgroundColor: theme.colors.primary[500] },
            acceptingRequest === request.id && styles.disabledButton
          ]}
        >
          {acceptingRequest === request.id ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <Ionicons name="checkmark" size={16} color="#fff" />
              <Text style={[styles.actionButtonText, { color: '#fff' }]}>
                Aceptar
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background.primary }]}>
        <ActivityIndicator size="large" color={theme.colors.primary[500]} />
        <Text style={[styles.loadingText, { color: theme.colors.text.secondary }]}>
          Cargando solicitudes disponibles...
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View style={styles.headerContent}>
          <Text style={[styles.headerTitle, { color: theme.colors.text.primary }]}>
            Solicitudes Disponibles
          </Text>
          <Text style={[styles.headerSubtitle, { color: theme.colors.text.secondary }]}>
            Solicitudes de músicos disponibles para aceptar
          </Text>
        </View>
      </View>

      {/* Requests List */}
      <FlatList
        data={requests}
        renderItem={renderRequestCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary[500]]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="musical-notes" size={64} color={theme.colors.text.tertiary} />
            <Text style={[styles.emptyTitle, { color: theme.colors.text.secondary }]}>
              No hay solicitudes disponibles
            </Text>
            <Text style={[styles.emptyMessage, { color: theme.colors.text.tertiary }]}>
              Cuando haya solicitudes disponibles, aparecerán aquí
            </Text>
          </View>
        }
      />
    </View>
  );
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending_musician':
      return '#f59e0b';
    case 'musician_assigned':
      return '#10b981';
    case 'completed':
      return '#8b5cf6';
    case 'cancelled':
      return '#ef4444';
    case 'musician_cancelled':
      return '#f97316';
    default:
      return '#6b7280';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'pending_musician':
      return 'Pendiente';
    case 'musician_assigned':
      return 'Asignado';
    case 'completed':
      return 'Completado';
    case 'cancelled':
      return 'Cancelado';
    case 'musician_cancelled':
      return 'Cancelado por Músico';
    default:
      return 'Desconocido';
  }
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
    marginTop: 12,
    fontSize: 16,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  headerContent: {
    flexDirection: 'column',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  requestCard: {
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  cardTitleContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  detailsButton: {
    padding: 4,
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
    flex: 1,
  },
  commentsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  commentsText: {
    marginLeft: 8,
    fontSize: 12,
    flex: 1,
    fontStyle: 'italic',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
  },
  primaryButton: {
    // backgroundColor se define dinámicamente
  },
  secondaryButton: {
    borderWidth: 1,
  },
  disabledButton: {
    opacity: 0.6,
  },
  actionButtonText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});

export default AvailableRequestsScreen; 