import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator, Linking, Share } from 'react-native';
import { useTheme } from '@contexts/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { requestService } from '@services/requests';
import { Request } from '@services/requests';
import { useTranslation } from 'react-i18next';

interface RequestDetailProps {
  route: {
    params: {
      requestId: string;
    };
  };
  navigation: any;
}

const RequestDetail: React.FC<RequestDetailProps> = ({ route, navigation }) => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { requestId } = route.params;
  
  const [request, setRequest] = useState<Request | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRequestDetails();
  }, [requestId]);

  const loadRequestDetails = async () => {
    try {
      setLoading(true);
      const response = await requestService.getRequestById(requestId);
      if (response.data) {
        setRequest(response.data);
      } else {
        setError('No se pudo cargar los detalles de la solicitud');
      }
    } catch (error: any) {
      console.error('Error loading request details:', error);
      setError(error.message || 'Error al cargar los detalles');
    } finally {
      setLoading(false);
    }
  };

  const handleShareLocation = async () => {
    if (!request?.location) {
      Alert.alert('Error', 'No hay ubicación disponible para compartir');
      return;
    }

    try {
      const locationText = `${request.location}\n\nCoordenadas: No disponibles`;
      await Share.share({
        message: `Ubicación del evento: ${locationText}`,
        title: 'Ubicación del evento'
      });
    } catch (error) {
      console.error('Error sharing location:', error);
    }
  };

  const handleOpenMaps = async () => {
    if (!request?.location) {
      Alert.alert('Error', 'No hay coordenadas disponibles para abrir en el mapa');
      return;
    }

    try {
      const url = `https://www.google.com/maps/search/?api=1&query=${request.location}`;
      const supported = await Linking.canOpenURL(url);
      
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'No se pudo abrir la aplicación de mapas');
      }
    } catch (error) {
      console.error('Error opening maps:', error);
      Alert.alert('Error', 'No se pudo abrir la aplicación de mapas');
    }
  };

  const handleOpenWhatsApp = async () => {
    if (!request?.location) {
      Alert.alert('Error', 'No hay ubicación disponible para compartir por WhatsApp');
      return;
    }

    try {
      const locationText = `Ubicación del evento: ${request.location}\nCoordenadas: No disponibles`;
      const whatsappUrl = `whatsapp://send?text=${encodeURIComponent(locationText)}`;
      
      const supported = await Linking.canOpenURL(whatsappUrl);
      if (supported) {
        await Linking.openURL(whatsappUrl);
      } else {
        Alert.alert('Error', 'WhatsApp no está instalado en este dispositivo');
      }
    } catch (error) {
      console.error('Error opening WhatsApp:', error);
      Alert.alert('Error', 'No se pudo abrir WhatsApp');
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background.primary }}>
        <ActivityIndicator size="large" color={theme.colors.primary[500]} />
        <Text style={{ marginTop: 16, color: theme.colors.text.secondary }}>
          Cargando detalles...
        </Text>
      </View>
    );
  }

  if (error || !request) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background.primary }}>
        <Ionicons name="alert-circle" size={64} color={theme.colors.error[500]} />
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.colors.text.primary, marginTop: 16 }}>
          Error
        </Text>
        <Text style={{ fontSize: 14, color: theme.colors.text.secondary, textAlign: 'center', marginTop: 8, paddingHorizontal: 20 }}>
          {error || 'No se pudo cargar los detalles de la solicitud'}
        </Text>
        <TouchableOpacity
          onPress={loadRequestDetails}
          style={{
            backgroundColor: theme.colors.primary[500],
            paddingHorizontal: 24,
            paddingVertical: 12,
            borderRadius: 8,
            marginTop: 16,
          }}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>
            Reintentar
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background.primary, paddingTop: insets.top }}>
      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 28, fontWeight: 'bold', color: theme.colors.text.primary, marginBottom: 8 }}>
            {request.eventName || 'Solicitud sin nombre'}
          </Text>
          <View style={{
            backgroundColor: getStatusColor(request.status),
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 16,
            alignSelf: 'flex-start',
          }}>
            <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#fff' }}>
              {getStatusText(request.status)}
            </Text>
          </View>
        </View>

        {/* Información Principal */}
        <View style={{
          backgroundColor: theme.colors.background.card,
          borderRadius: 16,
          padding: 20,
          marginBottom: 16,
          borderWidth: 1,
          borderColor: theme.colors.border.primary,
        }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: theme.colors.text.primary, marginBottom: 16 }}>
            Detalles del Evento
          </Text>

          {/* Fecha y Hora */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            <Ionicons name="calendar" size={20} color={theme.colors.primary[500]} />
            <Text style={{ marginLeft: 12, fontSize: 16, color: theme.colors.text.primary }}>
              {request.date ? new Date(request.date).toLocaleDateString('es-ES', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }) : 'Fecha no especificada'}
            </Text>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            <Ionicons name="time" size={20} color={theme.colors.primary[500]} />
            <Text style={{ marginLeft: 12, fontSize: 16, color: theme.colors.text.primary }}>
              {request.time || 'Hora no especificada'}
            </Text>
          </View>

          {/* Instrumento */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            <Ionicons name="musical-notes" size={20} color={theme.colors.primary[500]} />
            <Text style={{ marginLeft: 12, fontSize: 16, color: theme.colors.text.primary }}>
              {request.instrument || 'Instrumento no especificado'}
            </Text>
          </View>

          {/* Presupuesto */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            <Ionicons name="cash" size={20} color={theme.colors.primary[500]} />
            <Text style={{ marginLeft: 12, fontSize: 16, color: theme.colors.text.primary }}>
              ${request.budget ? request.budget.toLocaleString() : 'No especificado'}
            </Text>
          </View>

          {/* Duración */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            <Ionicons name="hourglass" size={20} color={theme.colors.primary[500]} />
            <Text style={{ marginLeft: 12, fontSize: 16, color: theme.colors.text.primary }}>
              {request.duration ? `${request.duration} minutos` : 'Duración no especificada'}
            </Text>
          </View>

          {/* Comentarios */}
          {(request.comment) && (
            <View style={{ marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: theme.colors.border.secondary }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: theme.colors.text.primary, marginBottom: 8 }}>
                {t('requests.details.comments')}
              </Text>
              <Text style={{ fontSize: 14, color: theme.colors.text.secondary, lineHeight: 20 }}>
                {request.comment}
              </Text>
            </View>
          )}
        </View>

        {/* Ubicación */}
        <View style={{
          backgroundColor: theme.colors.background.card,
          borderRadius: 16,
          padding: 20,
          marginBottom: 16,
          borderWidth: 1,
          borderColor: theme.colors.border.primary,
        }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: theme.colors.text.primary, marginBottom: 16 }}>
            Ubicación
          </Text>

          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <Ionicons name="location" size={20} color={theme.colors.primary[500]} />
            <Text style={{ marginLeft: 12, fontSize: 16, color: theme.colors.text.primary, flex: 1 }}>
              {request.location || 'Ubicación no especificada'}
            </Text>
          </View>

          {/* Botones de Acción para Ubicación */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <TouchableOpacity
              onPress={handleOpenMaps}
              style={{
                backgroundColor: theme.colors.primary[500],
                paddingHorizontal: 16,
                paddingVertical: 12,
                borderRadius: 8,
                flex: 1,
                marginRight: 8,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons name="map" size={16} color="#fff" style={{ marginRight: 6 }} />
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>
                Abrir Mapa
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleShareLocation}
              style={{
                backgroundColor: theme.colors.secondary[500],
                paddingHorizontal: 16,
                paddingVertical: 12,
                borderRadius: 8,
                flex: 1,
                marginLeft: 8,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons name="share" size={16} color="#fff" style={{ marginRight: 6 }} />
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>
                Compartir
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={handleOpenWhatsApp}
            style={{
              backgroundColor: '#25D366',
              paddingHorizontal: 16,
              paddingVertical: 12,
              borderRadius: 8,
              marginTop: 12,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name="logo-whatsapp" size={16} color="#fff" style={{ marginRight: 6 }} />
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>
              Compartir por WhatsApp
            </Text>
          </TouchableOpacity>
        </View>

        {/* Información del Solicitante */}
        <View style={{
          backgroundColor: theme.colors.background.card,
          borderRadius: 16,
          padding: 20,
          marginBottom: 16,
          borderWidth: 1,
          borderColor: theme.colors.border.primary,
        }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: theme.colors.text.primary, marginBottom: 16 }}>
            {t('requests.details.organizer_info')}
          </Text>

          {/* ID del Organizador */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            <Ionicons name="person" size={20} color={theme.colors.primary[500]} />
            <Text style={{ marginLeft: 12, fontSize: 16, color: theme.colors.text.primary }}>
              {t('requests.details.organizer_id')}: {request.user || 'No especificado'}
            </Text>
          </View>

          {/* Músico Asignado */}
          {request.assignedMusicianId && (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
              <Ionicons name="musical-notes" size={20} color={theme.colors.primary[500]} />
                          <Text style={{ marginLeft: 12, fontSize: 16, color: theme.colors.text.primary }}>
              {t('requests.details.assigned_musician')}: {request.assignedMusicianId}
            </Text>
            </View>
          )}

          {/* Fecha de Creación */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            <Ionicons name="calendar-outline" size={20} color={theme.colors.primary[500]} />
            <Text style={{ marginLeft: 12, fontSize: 16, color: theme.colors.text.primary }}>
              {t('requests.details.created_at')}: {request.createdAt ? new Date(request.createdAt).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              }) : 'Fecha no especificada'}
            </Text>
          </View>

          {/* Fecha de Actualización */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            <Ionicons name="time-outline" size={20} color={theme.colors.primary[500]} />
            <Text style={{ marginLeft: 12, fontSize: 16, color: theme.colors.text.primary }}>
              {t('requests.details.updated_at')}: {request.updatedAt ? new Date(request.updatedAt).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              }) : 'Fecha no especificada'}
            </Text>
          </View>
        </View>

        {/* Información Adicional */}
        <View style={{
          backgroundColor: theme.colors.background.card,
          borderRadius: 16,
          padding: 20,
          marginBottom: 16,
          borderWidth: 1,
          borderColor: theme.colors.border.primary,
        }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: theme.colors.text.primary, marginBottom: 16 }}>
            {t('requests.details.additional_info')}
          </Text>

          {/* Tipo de Evento */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            <Ionicons name="information-circle" size={20} color={theme.colors.primary[500]} />
            <Text style={{ marginLeft: 12, fontSize: 16, color: theme.colors.text.primary }}>
              {t('requests.details.event_type')}: {request.eventType || 'No especificado'}
            </Text>
          </View>

          {/* Llevar Instrumento */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            <Ionicons name="musical-note" size={20} color={theme.colors.primary[500]} />
            <Text style={{ marginLeft: 12, fontSize: 16, color: theme.colors.text.primary }}>
              {t('requests.details.bring_instrument')}: {request.bringInstrument ? t('requests.details.yes') : t('requests.details.no')}
            </Text>
          </View>

          {/* Recomendaciones */}
          {request.recommendations && request.recommendations.length > 0 && (
            <View style={{ marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: theme.colors.border.secondary }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: theme.colors.text.primary, marginBottom: 8 }}>
                {t('requests.details.recommendations')}
              </Text>
              {request.recommendations.map((rec, index) => (
                <Text key={index} style={{ fontSize: 14, color: theme.colors.text.secondary, marginBottom: 4 }}>
                  • {rec}
                </Text>
              ))}
            </View>
          )}

          {/* Canciones */}
          {request.songs && request.songs.length > 0 && (
            <View style={{ marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: theme.colors.border.secondary }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: theme.colors.text.primary, marginBottom: 8 }}>
                {t('requests.details.song_list')}
              </Text>
              {request.songs.map((song: string, index: number) => (
                <Text key={index} style={{ fontSize: 14, color: theme.colors.text.secondary, marginBottom: 4 }}>
                  • {song}
                </Text>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
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

export default RequestDetail; 