import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@contexts/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { requestService, Request, CreateRequestData } from '@services/requests';
import { useUser } from '@contexts/UserContext';

interface EditRequestRouteParams {
  requestId: string;
}

const EditRequest: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { requestId } = route.params as EditRequestRouteParams;
  const { theme } = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { user } = useUser();

  const [request, setRequest] = useState<Request | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<CreateRequestData>>({});

  useEffect(() => {
    loadRequest();
  }, [requestId]);

  const loadRequest = async () => {
    try {
      const response = await requestService.getRequestById(requestId);
      const requestData = response.data;
      
      if (!requestData) {
        Alert.alert('Error', 'No se pudo cargar la solicitud');
        navigation.goBack();
        return;
      }

      // Verificar que el usuario es el organizador de la solicitud
      if (requestData.user !== user?.userEmail) {
        Alert.alert('Acceso denegado', 'Solo puedes editar solicitudes que hayas creado');
        navigation.goBack();
        return;
      }

      setRequest(requestData);
      setFormData({
        eventName: requestData.eventName,
        eventType: requestData.eventType,
        date: requestData.date,
        time: requestData.time,
        location: {
          address: requestData.location,
          city: 'Santo Domingo',
          latitude: 18.4861,
          longitude: -69.9312,
        },
        duration: Number(requestData.duration),
        instrument: requestData.instrument,
        budget: Number(requestData.budget),
        comment: requestData.comment,
      });
    } catch (error) {
      console.error('Error loading request:', error);
      Alert.alert('Error', 'No se pudo cargar la solicitud');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!request) return;

    setSaving(true);
    try {
      await requestService.updateRequest(requestId, formData);
      Alert.alert('Éxito', 'Solicitud actualizada correctamente', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.error('Error updating request:', error);
      Alert.alert('Error', 'No se pudo actualizar la solicitud');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    Alert.alert(
      'Cancelar edición',
      '¿Estás seguro de que quieres cancelar? Los cambios no se guardarán.',
      [
        { text: 'No', style: 'cancel' },
        { text: 'Sí, cancelar', style: 'destructive', onPress: () => navigation.goBack() }
      ]
    );
  };

  const updateFormData = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background.primary }}>
        <ActivityIndicator size="large" color={theme.colors.primary[500]} />
        <Text style={{ marginTop: 12, color: theme.colors.text.secondary }}>
          Cargando evento...
        </Text>
      </View>
    );
  }

  if (!event) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background.primary }}>
        <Text style={{ color: theme.colors.text.secondary }}>
          Evento no encontrado
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background.primary, paddingTop: insets.top }}>
      {/* Header */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: theme.colors.background.card,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border.primary,
      }}>
        <TouchableOpacity onPress={handleCancel} style={{ marginRight: 16 }}>
          <Ionicons name="close" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.colors.text.primary, flex: 1 }}>
          Editar Evento
        </Text>
        <TouchableOpacity 
          onPress={handleSave}
          disabled={saving}
          style={{
            backgroundColor: theme.colors.primary[500],
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 8,
            opacity: saving ? 0.6 : 1,
          }}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>
            {saving ? 'Guardando...' : 'Guardar'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Formulario */}
      <ScrollView style={{ flex: 1, padding: 20 }}>
        {/* Nombre del evento */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: theme.colors.text.primary, marginBottom: 8 }}>
            Nombre del evento
          </Text>
          <TextInput
            style={{
              backgroundColor: theme.colors.background.card,
              borderRadius: 12,
              padding: 16,
              fontSize: 16,
              color: theme.colors.text.primary,
              borderWidth: 1,
              borderColor: theme.colors.border.primary,
            }}
            value={formData.eventName}
            onChangeText={(text) => setFormData(prev => ({ ...prev, eventName: text }))}
            placeholder="Nombre del evento"
            placeholderTextColor={theme.colors.text.tertiary}
          />
        </View>

        {/* Tipo de evento */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: theme.colors.text.primary, marginBottom: 8 }}>
            Tipo de evento
          </Text>
          <TextInput
            style={{
              backgroundColor: theme.colors.background.card,
              borderRadius: 12,
              padding: 16,
              fontSize: 16,
              color: theme.colors.text.primary,
              borderWidth: 1,
              borderColor: theme.colors.border.primary,
            }}
            value={formData.eventType}
            onChangeText={(text) => setFormData(prev => ({ ...prev, eventType: text }))}
            placeholder="Tipo de evento"
            placeholderTextColor={theme.colors.text.tertiary}
          />
        </View>

        {/* Fecha */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: theme.colors.text.primary, marginBottom: 8 }}>
            Fecha
          </Text>
          <TextInput
            style={{
              backgroundColor: theme.colors.background.card,
              borderRadius: 12,
              padding: 16,
              fontSize: 16,
              color: theme.colors.text.primary,
              borderWidth: 1,
              borderColor: theme.colors.border.primary,
            }}
            value={formData.date}
            onChangeText={(text) => updateFormData('date', text)}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={theme.colors.text.tertiary}
          />
        </View>

        {/* Hora */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: theme.colors.text.primary, marginBottom: 8 }}>
            Hora
          </Text>
          <TextInput
            style={{
              backgroundColor: theme.colors.background.card,
              borderRadius: 12,
              padding: 16,
              fontSize: 16,
              color: theme.colors.text.primary,
              borderWidth: 1,
              borderColor: theme.colors.border.primary,
            }}
            value={formData.time}
            onChangeText={(text) => updateFormData('time', text)}
            placeholder="HH:MM"
            placeholderTextColor={theme.colors.text.tertiary}
          />
        </View>

        {/* Ubicación */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: theme.colors.text.primary, marginBottom: 8 }}>
            Ubicación
          </Text>
          <TextInput
            style={{
              backgroundColor: theme.colors.background.card,
              borderRadius: 12,
              padding: 16,
              fontSize: 16,
              color: theme.colors.text.primary,
              borderWidth: 1,
              borderColor: theme.colors.border.primary,
            }}
            value={formData.location?.address}
            onChangeText={(text) => updateFormData('location', { ...formData.location, address: text })}
            placeholder="Dirección del evento"
            placeholderTextColor={theme.colors.text.tertiary}
          />
        </View>

        {/* Instrumento */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: theme.colors.text.primary, marginBottom: 8 }}>
            Instrumento requerido
          </Text>
          <TextInput
            style={{
              backgroundColor: theme.colors.background.card,
              borderRadius: 12,
              padding: 16,
              fontSize: 16,
              color: theme.colors.text.primary,
              borderWidth: 1,
              borderColor: theme.colors.border.primary,
            }}
            value={formData.instrument}
            onChangeText={(text) => updateFormData('instrument', text)}
            placeholder="Instrumento requerido"
            placeholderTextColor={theme.colors.text.tertiary}
          />
        </View>

        {/* Presupuesto */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: theme.colors.text.primary, marginBottom: 8 }}>
            Presupuesto
          </Text>
          <TextInput
            style={{
              backgroundColor: theme.colors.background.card,
              borderRadius: 12,
              padding: 16,
              fontSize: 16,
              color: theme.colors.text.primary,
              borderWidth: 1,
              borderColor: theme.colors.border.primary,
            }}
            value={formData.budget?.toString()}
            onChangeText={(text) => updateFormData('budget', parseInt(text) || 0)}
            placeholder="Presupuesto en pesos"
            placeholderTextColor={theme.colors.text.tertiary}
            keyboardType="numeric"
          />
        </View>

        {/* Comentarios adicionales */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: theme.colors.text.primary, marginBottom: 8 }}>
            Comentarios adicionales
          </Text>
          <TextInput
            style={{
              backgroundColor: theme.colors.background.card,
              borderRadius: 12,
              padding: 16,
              fontSize: 16,
              color: theme.colors.text.primary,
              borderWidth: 1,
              borderColor: theme.colors.border.primary,
              minHeight: 100,
              textAlignVertical: 'top',
            }}
            value={formData.comment}
            onChangeText={(text) => setFormData(prev => ({ ...prev, comment: text }))}
            placeholder="Comentarios adicionales sobre el evento"
            placeholderTextColor={theme.colors.text.tertiary}
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Información del estado actual */}
        <View style={{
          backgroundColor: theme.colors.warning[50],
          borderRadius: 12,
          padding: 16,
          marginBottom: 20,
          borderWidth: 1,
          borderColor: theme.colors.warning[200],
        }}>
          <Text style={{ fontSize: 14, fontWeight: 'bold', color: theme.colors.warning[700], marginBottom: 8 }}>
            Estado actual: {request?.status === 'pending_musician' ? 'Pendiente de músico' : request?.status}
          </Text>
          <Text style={{ fontSize: 14, color: theme.colors.warning[600] }}>
            {request?.status === 'pending_musician' 
              ? 'Esta solicitud está esperando que un músico la acepte. Los cambios se reflejarán inmediatamente.'
              : 'Esta solicitud ya tiene un músico asignado. Los cambios pueden afectar la coordinación.'
            }
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default EditRequest; 