import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { useTheme } from '@hooks/useAppTheme';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '@contexts/UserContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import { requestService, Request } from '@services/requests';
import Card from '@components/ui/Card';
import Button from '@components/ui/Button';
import { useSocket } from '@contexts/SocketContext';

const { width } = Dimensions.get('window');

interface RequestDetailRouteParams {
  requestId: string;
}

const RequestDetail: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { user } = useUser();
  const navigation = useNavigation();
  const route = useRoute();
  const { socket } = useSocket();
  
  const { requestId } = route.params as RequestDetailRouteParams;
  
  // Estados
  const [request, setRequest] = useState<Request | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar detalles de la solicitud
  useEffect(() => {
    loadRequestDetails();
  }, [requestId]);

  // Escuchar cambios en tiempo real
  useEffect(() => {
    if (socket && requestId) {
      // Suscribirse a actualizaciones de la solicitud
      socket.emit('join-request', requestId);
      
      socket.on('request-updated', (updatedRequest: Request) => {
        if (updatedRequest.id === requestId) {
          setRequest(updatedRequest);
        }
      });

      socket.on('request-cancelled', (cancelledRequestId: string) => {
        if (cancelledRequestId === requestId) {
          Alert.alert('Solicitud Cancelada', 'Esta solicitud ha sido cancelada por el organizador.');
          navigation.goBack();
        }
      });

      return () => {
        socket.emit('leave-request', requestId);
        socket.off('request-updated');
        socket.off('request-cancelled');
      };
    }
  }, [socket, requestId]);

  const loadRequestDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await requestService.getRequestById(requestId);
      
      if (response.success && response.data) {
        setRequest(response.data);
      } else {
        setError(response.message || 'Error al cargar los detalles');
      }
    } catch (err: any) {
      setError(err.message || 'Error desconocido');
      console.error('Error cargando detalles:', err);
    } finally {
      setLoading(false);
    }
  };

  // Aceptar solicitud (solo para músicos)
  const handleAcceptRequest = async () => {
    if (!user || user.roll !== 'musician') {
      Alert.alert('Error', 'Solo los músicos pueden aceptar solicitudes');
      return;
    }

    Alert.alert(
      'Confirmar Aceptación',
      '¿Estás seguro de que quieres aceptar esta solicitud? Una vez aceptada, se creará un chat para coordinar los detalles.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Aceptar',
          style: 'default',
          onPress: async () => {
            setActionLoading(true);
            try {
              const response = await requestService.acceptRequest(requestId);
              if (response.success) {
                Alert.alert(
                  '¡Solicitud Aceptada!',
                  'Has aceptado esta solicitud. El organizador será notificado y podrás chatear para coordinar los detalles.',
                  [
                    {
                      text: 'Ir al Chat',
                      onPress: () => {
                        // TODO: Navegar al chat
                        (navigation as any).navigate('Chat', { conversationId: `request_${requestId}` });
                      }
                    },
                    { text: 'OK', style: 'cancel' }
                  ]
                );
              } else {
                Alert.alert('Error', response.message || 'Error al aceptar la solicitud');
              }
            } catch (error: any) {
              console.error('Error aceptando solicitud:', error);
              Alert.alert('Error', 'Error al aceptar la solicitud. Inténtalo de nuevo.');
            } finally {
              setActionLoading(false);
            }
          }
        }
      ]
    );
  };

  // Cancelar solicitud (solo para organizadores)
  const handleCancelRequest = async () => {
    if (!user || user.roll !== 'eventCreator') {
      Alert.alert('Error', 'Solo los organizadores pueden cancelar solicitudes');
      return;
    }

    Alert.alert(
      'Confirmar Cancelación',
      '¿Estás seguro de que quieres cancelar esta solicitud? Esta acción no se puede deshacer.',
      [
        { text: 'No Cancelar', style: 'cancel' },
        {
          text: 'Sí, Cancelar',
          style: 'destructive',
          onPress: async () => {
            setActionLoading(true);
            try {
              const response = await requestService.cancelRequest(requestId);
              if (response.success) {
                Alert.alert(
                  'Solicitud Cancelada',
                  'La solicitud ha sido cancelada exitosamente.',
                  [
                    {
                      text: 'OK',
                      onPress: () => navigation.goBack()
                    }
                  ]
                );
              } else {
                Alert.alert('Error', response.message || 'Error al cancelar la solicitud');
              }
            } catch (error: any) {
              console.error('Error cancelando solicitud:', error);
              Alert.alert('Error', 'Error al cancelar la solicitud. Inténtalo de nuevo.');
            } finally {
              setActionLoading(false);
            }
          }
        }
      ]
    );
  };

  // Completar solicitud (solo para organizadores)
  const handleCompleteRequest = async () => {
    if (!user || user.roll !== 'eventCreator') {
      Alert.alert('Error', 'Solo los organizadores pueden marcar solicitudes como completadas');
      return;
    }

    Alert.alert(
      'Confirmar Completado',
      '¿Estás seguro de que quieres marcar esta solicitud como completada? Esto iniciará el proceso de pago.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Marcar como Completada',
          style: 'default',
          onPress: async () => {
            setActionLoading(true);
            try {
              const response = await requestService.completeRequest(requestId);
              if (response.success) {
                Alert.alert(
                  '¡Evento Completado!',
                  'El evento ha sido marcado como completado. El músico recibirá su pago.',
                  [
                    {
                      text: 'Ver Historial',
                      onPress: () => {
                        // TODO: Navegar al historial de pagos
                        (navigation as any).navigate('PaymentHistory');
                      }
                    },
                    { text: 'OK', style: 'cancel' }
                  ]
                );
              } else {
                Alert.alert('Error', response.message || 'Error al marcar como completada');
              }
            } catch (error: any) {
              console.error('Error completando solicitud:', error);
              Alert.alert('Error', 'Error al marcar como completada. Inténtalo de nuevo.');
            } finally {
              setActionLoading(false);
            }
          }
        }
      ]
    );
  };

  // Formatear fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Formatear hora
  const formatTime = (timeString: string) => {
    return timeString;
  };

  // Obtener color del estado
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

  // Obtener texto del estado
  const getStatusText = (status: string) => {
    switch (status) {
      case 'pendiente':
        return 'Pendiente de Asignación';
      case 'asignada':
        return 'Músico Asignado';
      case 'completada':
        return 'Evento Completado';
      case 'cancelada':
        return 'Cancelada';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background.primary }]}>
        <ActivityIndicator size="large" color={theme.colors.primary[500]} />
        <Text style={[styles.loadingText, { color: theme.colors.text.secondary }]}>
          Cargando detalles...
        </Text>
      </View>
    );
  }

  if (error || !request) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: theme.colors.background.primary }]}>
        <Ionicons name="alert-circle-outline" size={64} color={theme.colors.error[500]} />
        <Text style={[styles.errorTitle, { color: theme.colors.text.primary }]}>
          Error al Cargar
        </Text>
        <Text style={[styles.errorText, { color: theme.colors.text.secondary }]}>
          {error || 'No se pudo cargar la solicitud'}
        </Text>
        <Button
          title="Reintentar"
          onPress={loadRequestDetails}
          style={styles.retryButton}
        />
      </View>
    );
  }

  const isOrganizer = user?.roll === 'eventCreator';
  const isMusician = user?.roll === 'musician';
  const canAccept = isMusician && request.status === 'pendiente';
  const canCancel = isOrganizer && ['pendiente', 'asignada'].includes(request.status);
  const canComplete = isOrganizer && request.status === 'asignada';

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.background.primary }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header con estado */}
      <Card style={styles.statusCard}>
        <View style={styles.statusHeader}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(request.status) }]}>
            <Text style={styles.statusText}>
              {getStatusText(request.status)}
            </Text>
          </View>
          <Text style={[styles.requestId, { color: theme.colors.text.secondary }]}>
            ID: {request.id}
          </Text>
        </View>
      </Card>

      {/* Detalles del evento */}
      <Card style={styles.detailsCard}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
          Detalles del Evento
        </Text>
        
        <View style={styles.detailRow}>
          <Ionicons name="calendar-outline" size={20} color={theme.colors.text.secondary} />
          <Text style={[styles.detailLabel, { color: theme.colors.text.secondary }]}>
            Fecha:
          </Text>
          <Text style={[styles.detailValue, { color: theme.colors.text.primary }]}>
            {formatDate(request.date)}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="time-outline" size={20} color={theme.colors.text.secondary} />
          <Text style={[styles.detailLabel, { color: theme.colors.text.secondary }]}>
            Horario:
          </Text>
          <Text style={[styles.detailValue, { color: theme.colors.text.primary }]}>
            {formatTime(request.time)}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="location-outline" size={20} color={theme.colors.text.secondary} />
          <Text style={[styles.detailLabel, { color: theme.colors.text.secondary }]}>
            Ubicación:
          </Text>
          <Text style={[styles.detailValue, { color: theme.colors.text.primary }]}>
            {request.location}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="musical-notes-outline" size={20} color={theme.colors.text.secondary} />
          <Text style={[styles.detailLabel, { color: theme.colors.text.secondary }]}>
            Instrumento:
          </Text>
          <Text style={[styles.detailValue, { color: theme.colors.text.primary }]}>
            {request.instrument}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="cash-outline" size={20} color={theme.colors.text.secondary} />
          <Text style={[styles.detailLabel, { color: theme.colors.text.secondary }]}>
            Presupuesto:
          </Text>
          <Text style={[styles.detailValue, { color: theme.colors.text.primary }]}>
            ${request.budget}
          </Text>
        </View>

        {request.comments && (
          <View style={styles.detailRow}>
            <Ionicons name="chatbubble-outline" size={20} color={theme.colors.text.secondary} />
            <Text style={[styles.detailLabel, { color: theme.colors.text.secondary }]}>
              Comentarios:
            </Text>
            <Text style={[styles.detailValue, { color: theme.colors.text.primary }]}>
              {request.comments}
            </Text>
          </View>
        )}
      </Card>

      {/* Acciones disponibles */}
      {(canAccept || canCancel || canComplete) && (
        <Card style={styles.actionsCard}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
            Acciones Disponibles
          </Text>
          
          <View style={styles.actionsContainer}>
            {canAccept && (
              <Button
                title="Aceptar Solicitud"
                onPress={handleAcceptRequest}
                disabled={actionLoading}
                style={styles.actionButton}
              />
            )}
            
            {canCancel && (
              <Button
                title="Cancelar Solicitud"
                onPress={handleCancelRequest}
                disabled={actionLoading}
                style={styles.actionButton}
              />
            )}
            
            {canComplete && (
              <Button
                title="Marcar como Completada"
                onPress={handleCompleteRequest}
                disabled={actionLoading}
                style={styles.actionButton}
              />
            )}
          </View>
        </Card>
      )}

      {/* Chat y comunicación */}
      {request.status === 'asignada' && (
        <Card style={styles.chatCard}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
            Comunicación
          </Text>
          <Text style={[styles.chatDescription, { color: theme.colors.text.secondary }]}>
            El músico ha sido asignado. Puedes chatear para coordinar los detalles del evento.
          </Text>
          <Button
            title="Abrir Chat"
            onPress={() => {
              (navigation as any).navigate('Chat', { conversationId: `request_${requestId}` });
            }}
            style={styles.chatButton}
          />
        </Card>
      )}

      {/* Información adicional */}
      <Card style={styles.infoCard}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
          Información Adicional
        </Text>
        <Text style={[styles.infoText, { color: theme.colors.text.secondary }]}>
          • Creada el: {formatDate(request.createdAt)}{'\n'}
          • Última actualización: {formatDate(request.updatedAt)}{'\n'}
          {request.assignedMusicianId && `• Músico asignado: ${request.assignedMusicianId}`}
        </Text>
      </Card>
    </ScrollView>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  retryButton: {
    minWidth: 120,
  },
  statusCard: {
    margin: 16,
    marginBottom: 8,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  requestId: {
    fontSize: 12,
    fontFamily: 'monospace',
  },
  detailsCard: {
    margin: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    marginRight: 8,
    minWidth: 80,
  },
  detailValue: {
    fontSize: 16,
    flex: 1,
  },
  actionsCard: {
    margin: 16,
    marginBottom: 8,
  },
  actionsContainer: {
    gap: 12,
  },
  actionButton: {
    marginBottom: 8,
  },
  chatCard: {
    margin: 16,
    marginBottom: 8,
  },
  chatDescription: {
    fontSize: 16,
    marginBottom: 16,
    lineHeight: 24,
  },
  chatButton: {
    backgroundColor: '#6366f1',
  },
  infoCard: {
    margin: 16,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default RequestDetail; 