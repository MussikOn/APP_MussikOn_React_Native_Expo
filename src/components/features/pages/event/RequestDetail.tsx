import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import musicianRequestsAPI, { MusicianRequest, MusicianRequestResponse } from '@services/musicianRequests';

interface RequestDetailProps {
  route?: {
    params: {
      requestId: string;
    };
  };
  navigation?: any;
}

const RequestDetail: React.FC<RequestDetailProps> = ({ route: propRoute, navigation: propNavigation }) => {
  const navigation = useNavigation();
  const route = useRoute();
  const { requestId } = (route.params as any) || propRoute?.params || { requestId: '' };
  
  const [request, setRequest] = useState<MusicianRequest | null>(null);
  const [responses, setResponses] = useState<MusicianRequestResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (requestId) {
      loadRequestDetails();
    }
  }, [requestId]);

  const loadRequestDetails = async () => {
    try {
      setLoading(true);
      const [requestData, responsesData] = await Promise.all([
        musicianRequestsAPI.getRequestById(requestId),
        musicianRequestsAPI.getRequestResponses(requestId),
      ]);
      setRequest(requestData);
      setResponses(responsesData);
    } catch (error: any) {
      console.error('Error loading request details:', error);
      Alert.alert(
        'Error',
        'No se pudieron cargar los detalles de la solicitud.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadRequestDetails();
    setRefreshing(false);
  };

  const handleAcceptResponse = async (responseId: string) => {
    Alert.alert(
      'Aceptar Músico',
      '¿Estás seguro de que quieres aceptar a este músico?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Aceptar',
          onPress: async () => {
            try {
              await musicianRequestsAPI.acceptResponse(responseId);
              Alert.alert('Éxito', 'Músico aceptado exitosamente');
              loadRequestDetails(); // Recargar datos
            } catch (error: any) {
              console.error('Error accepting response:', error);
              Alert.alert('Error', 'No se pudo aceptar al músico');
            }
          },
        },
      ]
    );
  };

  const handleDeclineResponse = async (responseId: string) => {
    Alert.alert(
      'Rechazar Músico',
      '¿Estás seguro de que quieres rechazar a este músico?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Rechazar',
          style: 'destructive',
          onPress: async () => {
            try {
              await musicianRequestsAPI.declineResponse(responseId);
              Alert.alert('Éxito', 'Músico rechazado');
              loadRequestDetails(); // Recargar datos
            } catch (error: any) {
              console.error('Error declining response:', error);
              Alert.alert('Error', 'No se pudo rechazar al músico');
            }
          },
        },
      ]
    );
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

  const getResponseStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return '#ff9800';
      case 'accepted':
        return '#4caf50';
      case 'declined':
        return '#f44336';
      default:
        return '#666';
    }
  };

  const getResponseStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendiente';
      case 'accepted':
        return 'Aceptado';
      case 'declined':
        return 'Rechazado';
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
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#667eea" />
        <Text style={styles.loadingText}>Cargando detalles...</Text>
      </View>
    );
  }

  if (!request) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={64} color="#f44336" />
        <Text style={styles.errorText}>No se pudo cargar la solicitud</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.gradientBackground}
      />
      
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              if (navigation) {
                (navigation as any).goBack();
              }
            }}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Detalles de Solicitud</Text>
        </View>

        {/* Información de la solicitud */}
        <View style={styles.requestCard}>
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.7)']}
            style={styles.cardGradient}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.eventName}>{request.eventName}</Text>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(request.status) }]}>
                <Text style={styles.statusText}>{getStatusText(request.status)}</Text>
              </View>
            </View>

            <View style={styles.cardContent}>
              <View style={styles.infoRow}>
                <Ionicons name="calendar" size={16} color="#666" />
                <Text style={styles.infoText}>{formatDate(request.eventDate)}</Text>
              </View>

              <View style={styles.infoRow}>
                <Ionicons name="time" size={16} color="#666" />
                <Text style={styles.infoText}>
                  {request.startTime} - {request.endTime}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Ionicons name="location" size={16} color="#666" />
                <Text style={styles.infoText}>{request.location}</Text>
              </View>

              <View style={styles.infoRow}>
                <Ionicons name="musical-notes" size={16} color="#666" />
                <Text style={styles.infoText}>{request.instrumentType}</Text>
              </View>

              <View style={styles.infoRow}>
                <Ionicons name="document-text" size={16} color="#666" />
                <Text style={styles.infoText}>{request.eventDescription}</Text>
              </View>

              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Precio Calculado:</Text>
                <Text style={styles.priceValue}>RD$ {request.calculatedPrice.toLocaleString()}</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Respuestas de músicos */}
        <View style={styles.responsesSection}>
          <Text style={styles.sectionTitle}>Respuestas de Músicos</Text>
          <Text style={styles.sectionSubtitle}>
            {responses.length} músico{responses.length !== 1 ? 's' : ''} han respondido
          </Text>

          {responses.length === 0 ? (
            <View style={styles.emptyResponses}>
              <Ionicons name="people" size={48} color="#ccc" />
              <Text style={styles.emptyResponsesText}>
                Aún no hay respuestas de músicos
              </Text>
              <Text style={styles.emptyResponsesSubtext}>
                Los músicos verán tu solicitud y podrán responder
              </Text>
            </View>
          ) : (
            responses.map((response, index) => (
              <View key={response.id} style={styles.responseCard}>
                <LinearGradient
                  colors={['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.7)']}
                  style={styles.responseGradient}
                >
                  <View style={styles.responseHeader}>
                    <View style={styles.musicianInfo}>
                      <Ionicons name="person" size={20} color="#667eea" />
                      <Text style={styles.musicianName}>{response.musicianName}</Text>
                    </View>
                    <View style={[styles.responseStatusBadge, { backgroundColor: getResponseStatusColor(response.status) }]}>
                      <Text style={styles.responseStatusText}>{getResponseStatusText(response.status)}</Text>
                    </View>
                  </View>

                  {response.message && (
                    <View style={styles.messageContainer}>
                      <Text style={styles.messageText}>{response.message}</Text>
                    </View>
                  )}

                  {response.proposedPrice && (
                    <View style={styles.priceContainer}>
                      <Text style={styles.proposedPriceLabel}>Precio Propuesto:</Text>
                      <Text style={styles.proposedPriceValue}>RD$ {response.proposedPrice.toLocaleString()}</Text>
                    </View>
                  )}

                  <View style={styles.responseFooter}>
                    <Text style={styles.responseDate}>
                      Respondió el {formatDate(response.createdAt)}
                    </Text>

                    {response.status === 'pending' && (
                      <View style={styles.responseActions}>
                        <TouchableOpacity
                          style={[styles.actionButton, styles.acceptButton]}
                          onPress={() => handleAcceptResponse(response.id)}
                        >
                          <Ionicons name="checkmark" size={16} color="#4caf50" />
                          <Text style={[styles.actionButtonText, styles.acceptButtonText]}>Aceptar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={[styles.actionButton, styles.declineButton]}
                          onPress={() => handleDeclineResponse(response.id)}
                        >
                          <Ionicons name="close" size={16} color="#f44336" />
                          <Text style={[styles.actionButtonText, styles.declineButtonText]}>Rechazar</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                </LinearGradient>
              </View>
            ))
          )}
        </View>
      </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  requestCard: {
    margin: 20,
    marginTop: 0,
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
    fontSize: 20,
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
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  infoText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
    flex: 1,
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  responsesSection: {
    padding: 20,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 20,
  },
  emptyResponses: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyResponsesText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyResponsesSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  responseCard: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  responseGradient: {
    padding: 16,
  },
  responseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  musicianInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  musicianName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  responseStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  responseStatusText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  messageContainer: {
    marginBottom: 12,
  },
  messageText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  proposedPriceLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  proposedPriceValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  responseFooter: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
  },
  responseDate: {
    fontSize: 12,
    color: '#999',
    marginBottom: 8,
  },
  responseActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
  },
  actionButtonText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '600',
  },
  acceptButton: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  acceptButtonText: {
    color: '#4caf50',
  },
  declineButton: {
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
  },
  declineButtonText: {
    color: '#f44336',
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
  },
});

export default RequestDetail; 