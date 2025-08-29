import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '@hooks/useAppTheme';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '@contexts/UserContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import { requestService, Request, CreateRequestData } from '@services/requests';
import Card from '@components/ui/Card';
import Button from '@components/ui/Button';
import Input from '@components/ui/Input';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

interface EditRequestRouteParams {
  requestId: string;
}

const EditRequest: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { user } = useUser();
  const navigation = useNavigation();
  const route = useRoute();
  
  const { requestId } = route.params as EditRequestRouteParams;
  
  // Estados del formulario
  const [formData, setFormData] = useState<CreateRequestData>({
    userId: user?.userEmail || '',
    eventType: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '18:00',
    endTime: '20:00',
    location: '',
    instrument: '',
    budget: 0,
    comments: '',
  });
  
  // Estados de UI
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [originalRequest, setOriginalRequest] = useState<Request | null>(null);

  // Opciones para los pickers
  const eventTypes = [
    { label: 'Concierto', value: 'concierto' },
    { label: 'Boda', value: 'boda' },
    { label: 'Culto', value: 'culto' },
    { label: 'Evento Corporativo', value: 'evento_corporativo' },
    { label: 'Festival', value: 'festival' },
    { label: 'Fiesta Privada', value: 'fiesta_privada' },
    { label: 'Graduación', value: 'graduacion' },
    { label: 'Cumpleaños', value: 'cumpleanos' },
    { label: 'Otro', value: 'otro' },
  ];

  const instruments = [
    { label: 'Guitarra', value: 'guitarra' },
    { label: 'Piano', value: 'piano' },
    { label: 'Bajo', value: 'bajo' },
    { label: 'Batería', value: 'bateria' },
    { label: 'Saxofón', value: 'saxofon' },
    { label: 'Trompeta', value: 'trompeta' },
    { label: 'Violín', value: 'violin' },
    { label: 'Canto', value: 'canto' },
    { label: 'Teclado', value: 'teclado' },
    { label: 'Flauta', value: 'flauta' },
    { label: 'Otro', value: 'otro' },
  ];

  // Cargar datos de la solicitud
  useEffect(() => {
    loadRequestData();
  }, [requestId]);

  const loadRequestData = async () => {
    try {
      setLoading(true);
      
      const response = await requestService.getRequestById(requestId);
      
      if (response.success && response.data) {
        const request = response.data;
        setOriginalRequest(request);
        
        // Mapear datos del backend al formulario
        const [startTime, endTime] = request.time.split(' - ');
        
        setFormData({
          userId: request.userId,
          eventType: request.eventType,
          date: request.date,
          startTime: startTime || '18:00',
          endTime: endTime || '20:00',
          location: request.location,
          instrument: request.instrument,
          budget: request.budget,
          comments: request.comments || '',
        });
      } else {
        Alert.alert('Error', 'No se pudo cargar la solicitud');
        navigation.goBack();
      }
    } catch (error: any) {
      console.error('Error cargando solicitud:', error);
      Alert.alert('Error', 'Error al cargar la solicitud');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  // Validar formulario
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.eventType) {
      newErrors.eventType = 'Selecciona el tipo de evento';
    }
    
    if (!formData.date) {
      newErrors.date = 'Selecciona la fecha del evento';
    }
    
    if (!formData.startTime) {
      newErrors.startTime = 'Selecciona la hora de inicio';
    }
    
    if (!formData.endTime) {
      newErrors.endTime = 'Selecciona la hora de fin';
    }
    
    if (!formData.location) {
      newErrors.location = 'Ingresa la ubicación del evento';
    }
    
    if (!formData.instrument) {
      newErrors.instrument = 'Selecciona el instrumento requerido';
    }
    
    if (formData.budget <= 0) {
      newErrors.budget = 'Ingresa un presupuesto válido';
    }
    
    if (formData.startTime >= formData.endTime) {
      newErrors.endTime = 'La hora de fin debe ser posterior a la de inicio';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar cambios en el formulario
  const handleInputChange = (field: keyof CreateRequestData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpiar error del campo
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Manejar fecha
  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      handleInputChange('date', formattedDate);
    }
  };

  // Manejar hora
  const handleTimeChange = (event: any, selectedTime?: Date, isStartTime: boolean = true) => {
    if (isStartTime) {
      setShowStartTimePicker(false);
    } else {
      setShowEndTimePicker(false);
    }
    
    if (selectedTime) {
      const hours = selectedTime.getHours().toString().padStart(2, '0');
      const minutes = selectedTime.getMinutes().toString().padStart(2, '0');
      const timeString = `${hours}:${minutes}`;
      
      if (isStartTime) {
        handleInputChange('startTime', timeString);
      } else {
        handleInputChange('endTime', timeString);
      }
    }
  };

  // Guardar cambios
  const handleSave = async () => {
    if (!validateForm()) {
      Alert.alert('Error', 'Por favor corrige los errores en el formulario');
      return;
    }

    if (!user?.userEmail) {
      Alert.alert('Error', 'Debes estar autenticado para editar una solicitud');
      return;
    }

    setSaving(true);
    try {
      // Verificar si la solicitud puede ser editada
      if (originalRequest?.status !== 'pendiente') {
        Alert.alert(
          'No se puede editar',
          'Solo se pueden editar solicitudes pendientes. Esta solicitud ya tiene un músico asignado o ha sido completada.'
        );
        return;
      }

      const updateData = {
        eventType: formData.eventType,
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
        location: formData.location,
        instrument: formData.instrument,
        budget: formData.budget,
        comments: formData.comments,
      };

      console.log('🎵 Actualizando solicitud:', requestId, updateData);
      
      const response = await requestService.updateRequest(requestId, updateData);
      
      if (response.success) {
        Alert.alert(
          '¡Solicitud Actualizada!',
          'Los cambios han sido guardados exitosamente.',
          [
            {
              text: 'Ver Detalles',
              onPress: () => {
                (navigation as any).navigate('RequestDetail', { requestId });
              }
            },
            {
              text: 'OK',
              style: 'cancel',
              onPress: () => navigation.goBack()
            }
          ]
        );
      } else {
        Alert.alert('Error', response.message || 'Error al actualizar la solicitud');
      }
    } catch (error: any) {
      console.error('Error actualizando solicitud:', error);
      Alert.alert('Error', 'Error al actualizar la solicitud. Inténtalo de nuevo.');
    } finally {
      setSaving(false);
    }
  };

  // Cancelar edición
  const handleCancel = () => {
    Alert.alert(
      'Cancelar Edición',
      '¿Estás seguro de que quieres cancelar? Los cambios no guardados se perderán.',
      [
        { text: 'Continuar Editando', style: 'cancel' },
        {
          text: 'Sí, Cancelar',
          style: 'destructive',
          onPress: () => navigation.goBack()
        }
      ]
    );
  };

  // Formatear fecha para mostrar
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background.primary }]}>
        <ActivityIndicator size="large" color={theme.colors.primary[500]} />
        <Text style={[styles.loadingText, { color: theme.colors.text.secondary }]}>
          Cargando solicitud...
        </Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background.primary }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <Ionicons 
            name="create-outline" 
            size={32} 
            color={theme.colors.primary[500]} 
          />
          <Text style={[styles.title, { color: theme.colors.text.primary }]}>
            Editar Solicitud
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>
            Modifica los detalles de tu solicitud de músico
          </Text>
        </View>

        {/* Información del estado */}
        {originalRequest && (
          <Card style={styles.statusCard}>
            <View style={styles.statusHeader}>
              <Ionicons name="information-circle-outline" size={24} color={theme.colors.primary[500]} />
              <Text style={[styles.statusTitle, { color: theme.colors.text.primary }]}>
                Estado de la Solicitud
              </Text>
            </View>
            <Text style={[styles.statusText, { color: theme.colors.text.secondary }]}>
              {originalRequest.status === 'pendiente' 
                ? 'Esta solicitud está pendiente y puede ser editada.'
                : 'Esta solicitud no puede ser editada porque ya tiene un músico asignado o ha sido completada.'
              }
            </Text>
          </Card>
        )}

        {/* Formulario */}
        <Card style={styles.formCard}>
          {/* Tipo de Evento */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.colors.text.primary }]}>
              Tipo de Evento *
            </Text>
            <View style={[styles.pickerContainer, { borderColor: errors.eventType ? theme.colors.error[500] : theme.colors.border.primary }]}>
              <Picker
                selectedValue={formData.eventType}
                onValueChange={(value) => handleInputChange('eventType', value)}
                style={[styles.picker, { color: theme.colors.text.primary }]}
                enabled={originalRequest?.status === 'pendiente'}
              >
                <Picker.Item label="Selecciona el tipo de evento" value="" />
                {eventTypes.map((type) => (
                  <Picker.Item key={type.value} label={type.label} value={type.value} />
                ))}
              </Picker>
            </View>
            {errors.eventType && (
              <Text style={[styles.errorText, { color: theme.colors.error[500] }]}>
                {errors.eventType}
              </Text>
            )}
          </View>

          {/* Fecha */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.colors.text.primary }]}>
              Fecha del Evento *
            </Text>
            <TouchableOpacity
              style={[
                styles.dateButton, 
                { 
                  borderColor: errors.date ? theme.colors.error[500] : theme.colors.border.primary,
                  opacity: originalRequest?.status === 'pendiente' ? 1 : 0.6
                }
              ]}
              onPress={() => originalRequest?.status === 'pendiente' && setShowDatePicker(true)}
              disabled={originalRequest?.status !== 'pendiente'}
            >
              <Ionicons name="calendar-outline" size={20} color={theme.colors.text.secondary} />
              <Text style={[styles.dateButtonText, { color: theme.colors.text.primary }]}>
                {formData.date ? formatDate(formData.date) : 'Seleccionar fecha'}
              </Text>
            </TouchableOpacity>
            {errors.date && (
              <Text style={[styles.errorText, { color: theme.colors.error[500] }]}>
                {errors.date}
              </Text>
            )}
          </View>

          {/* Horarios */}
          <View style={styles.timeContainer}>
            <View style={styles.timeInput}>
              <Text style={[styles.label, { color: theme.colors.text.primary }]}>
                Hora de Inicio *
              </Text>
              <TouchableOpacity
                style={[
                  styles.timeButton, 
                  { 
                    borderColor: errors.startTime ? theme.colors.error[500] : theme.colors.border.primary,
                    opacity: originalRequest?.status === 'pendiente' ? 1 : 0.6
                  }
                ]}
                onPress={() => originalRequest?.status === 'pendiente' && setShowStartTimePicker(true)}
                disabled={originalRequest?.status !== 'pendiente'}
              >
                <Ionicons name="time-outline" size={20} color={theme.colors.text.secondary} />
                <Text style={[styles.timeButtonText, { color: theme.colors.text.primary }]}>
                  {formData.startTime}
                </Text>
              </TouchableOpacity>
              {errors.startTime && (
                <Text style={[styles.errorText, { color: theme.colors.error[500] }]}>
                  {errors.startTime}
                </Text>
              )}
            </View>

            <View style={styles.timeInput}>
              <Text style={[styles.label, { color: theme.colors.text.primary }]}>
                Hora de Fin *
              </Text>
              <TouchableOpacity
                style={[
                  styles.timeButton, 
                  { 
                    borderColor: errors.endTime ? theme.colors.error[500] : theme.colors.border.primary,
                    opacity: originalRequest?.status === 'pendiente' ? 1 : 0.6
                  }
                ]}
                onPress={() => originalRequest?.status === 'pendiente' && setShowEndTimePicker(true)}
                disabled={originalRequest?.status !== 'pendiente'}
              >
                <Ionicons name="time-outline" size={20} color={theme.colors.text.secondary} />
                <Text style={[styles.timeButtonText, { color: theme.colors.text.primary }]}>
                  {formData.endTime}
                </Text>
              </TouchableOpacity>
              {errors.endTime && (
                <Text style={[styles.errorText, { color: theme.colors.error[500] }]}>
                  {errors.endTime}
                </Text>
              )}
            </View>
          </View>

          {/* Ubicación */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.colors.text.primary }]}>
              Ubicación del Evento *
            </Text>
            <Input
              label="Ubicación del Evento"
              placeholder="Dirección del evento"
              value={formData.location}
              onChangeText={(value) => handleInputChange('location', value)}
              error={errors.location}
              editable={originalRequest?.status === 'pendiente'}
            />
          </View>

          {/* Instrumento */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.colors.text.primary }]}>
              Instrumento Requerido *
            </Text>
            <View style={[styles.pickerContainer, { borderColor: errors.instrument ? theme.colors.error[500] : theme.colors.border.primary }]}>
              <Picker
                selectedValue={formData.instrument}
                onValueChange={(value) => handleInputChange('instrument', value)}
                style={[styles.picker, { color: theme.colors.text.primary }]}
                enabled={originalRequest?.status === 'pendiente'}
              >
                <Picker.Item label="Selecciona el instrumento" value="" />
                {instruments.map((instrument) => (
                  <Picker.Item key={instrument.value} label={instrument.label} value={instrument.value} />
                ))}
              </Picker>
            </View>
            {errors.instrument && (
              <Text style={[styles.errorText, { color: theme.colors.error[500] }]}>
                {errors.instrument}
              </Text>
            )}
          </View>

          {/* Presupuesto */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.colors.text.primary }]}>
              Presupuesto (USD) *
            </Text>
            <Input
              label="Presupuesto (USD)"
              placeholder="0.00"
              value={formData.budget.toString()}
              onChangeText={(value) => handleInputChange('budget', parseFloat(value) || 0)}
              error={errors.budget}
              keyboardType="numeric"
              editable={originalRequest?.status === 'pendiente'}
            />
          </View>

          {/* Comentarios */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.colors.text.primary }]}>
              Comentarios Adicionales
            </Text>
            <Input
              label="Comentarios Adicionales"
              placeholder="Describe detalles adicionales del evento, canciones específicas, etc."
              value={formData.comments}
              onChangeText={(value) => handleInputChange('comments', value)}
              multiline
              numberOfLines={4}
              editable={originalRequest?.status === 'pendiente'}
            />
          </View>

          {/* Botones de acción */}
          <View style={styles.actionButtons}>
            <Button
              title="Cancelar"
              onPress={handleCancel}
              style={styles.cancelButton}
            />
            <Button
              title={saving ? 'Guardando...' : 'Guardar Cambios'}
              onPress={handleSave}
              disabled={saving || originalRequest?.status !== 'pendiente'}
              style={styles.saveButton}
            />
          </View>
        </Card>
      </ScrollView>

      {/* Date/Time Pickers */}
      {showDatePicker && (
        <DateTimePicker
          value={new Date(formData.date)}
          mode="date"
          display="default"
          onChange={handleDateChange}
          minimumDate={new Date()}
        />
      )}

      {showStartTimePicker && (
        <DateTimePicker
          value={new Date(`2000-01-01T${formData.startTime}:00`)}
          mode="time"
          display="default"
          onChange={(event, date) => handleTimeChange(event, date, true)}
        />
      )}

      {showEndTimePicker && (
        <DateTimePicker
          value={new Date(`2000-01-01T${formData.endTime}:00`)}
          mode="time"
          display="default"
          onChange={(event, date) => handleTimeChange(event, date, false)}
        />
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
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
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  statusCard: {
    marginBottom: 20,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  statusText: {
    fontSize: 14,
    lineHeight: 20,
  },
  formCard: {
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 12,
    backgroundColor: 'transparent',
  },
  picker: {
    height: 50,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    padding: 15,
    backgroundColor: 'transparent',
  },
  dateButtonText: {
    marginLeft: 12,
    fontSize: 16,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  timeInput: {
    flex: 0.48,
  },
  timeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    padding: 15,
    backgroundColor: 'transparent',
  },
  timeButtonText: {
    marginLeft: 12,
    fontSize: 16,
  },
  errorText: {
    fontSize: 14,
    marginTop: 4,
    marginLeft: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#6b7280',
  },
  saveButton: {
    flex: 1,
  },
});

export default EditRequest; 