import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimeSelector from '@components/ui/DateTimeSelector';
import { Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { eventService, CreateEventRequest } from '@services/events';
import { useEventService } from '@services/events';
import {
  color_primary,
  color_white,
  color_secondary,
  color_danger,
  color_success,
  btn_primary,
  btn_white,
  border_color_primary,
  text_primary,
  text_secondary,
} from '@styles/Styles';

// Esquema de validación
const validationSchema = Yup.object().shape({
  eventName: Yup.string()
    .required('El nombre del evento es requerido')
    .min(3, 'El nombre debe tener al menos 3 caracteres'),
  eventType: Yup.string()
    .required('El tipo de evento es requerido'),
  date: Yup.string()
    .required('La fecha es requerida'),
  time: Yup.string()
    .required('La hora es requerida'),
  location: Yup.object().shape({
    address: Yup.string()
      .required('La dirección es requerida'),
    city: Yup.string()
      .required('La ciudad es requerida'),
    latitude: Yup.number()
      .required('La latitud es requerida'),
    longitude: Yup.number()
      .required('La longitud es requerida'),
  }),
  duration: Yup.number()
    .required('La duración es requerida')
    .min(30, 'La duración mínima es 30 minutos')
    .max(480, 'La duración máxima es 8 horas'),
  instrument: Yup.string()
    .required('El instrumento es requerido'),
  budget: Yup.number()
    .required('El presupuesto es requerido')
    .min(1, 'El presupuesto debe ser mayor a 0'),
});

// Tipos de eventos disponibles
const EVENT_TYPES = [
  'Fiesta',
  'Boda',
  'Concierto',
  'Evento corporativo',
  'Cumpleaños',
  'Graduación',
  'Otro',
];

// Instrumentos disponibles
const INSTRUMENTS = [
  'Guitarra',
  'Piano',
  'Violín',
  'Saxofón',
  'Batería',
  'Bajo',
  'Vocalista',
  'DJ',
  'Banda completa',
  'Otro',
];

interface EventRequestFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const EventRequestForm: React.FC<EventRequestFormProps> = ({ onSuccess, onCancel }) => {
  const { t } = useTranslation();
  const { loading, error, executeRequest } = useEventService();
  const [dateValue, setDateValue] = useState('');
  const [timeValue, setTimeValue] = useState('');

  const initialValues: CreateEventRequest = {
    eventName: '',
    eventType: '',
    date: '',
    time: '',
    location: {
      address: '',
      city: '',
      latitude: 0,
      longitude: 0,
      googleMapsUrl: '',
    },
    duration: 60,
    instrument: '',
    budget: 0,
    additionalComments: '',
    minBudget: 0,
    maxBudget: 0,
  };

  const handleSubmit = async (
    values: CreateEventRequest,
    { setSubmitting, resetForm }: FormikHelpers<CreateEventRequest>
  ) => {
    try {
      const result = await executeRequest(() => eventService.createEventRequest(values));
      
      if (result?.success) {
        Alert.alert(
          'Solicitud Creada',
          'Tu solicitud de músico ha sido creada exitosamente.',
          [
            {
              text: 'OK',
              onPress: () => {
                resetForm();
                onSuccess?.();
              },
            },
          ]
        );
      } else {
        Alert.alert('Error', result?.message || 'Error al crear la solicitud');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al crear la solicitud');
    } finally {
      setSubmitting(false);
    }
  };



  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Solicitar Músico</Text>
      
      {error && (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={20} color={color_danger} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldValue,
          isSubmitting,
        }) => (
          <View style={styles.form}>
            {/* Nombre del Evento */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Nombre del Evento *</Text>
              <TextInput
                style={[
                  styles.input,
                  touched.eventName && errors.eventName && styles.inputError,
                ]}
                placeholder="Ej: Boda de María y Juan"
                value={values.eventName}
                onChangeText={handleChange('eventName')}
                onBlur={handleBlur('eventName')}
                editable={!loading}
              />
              {touched.eventName && errors.eventName && (
                <Text style={styles.errorText}>{errors.eventName}</Text>
              )}
            </View>

            {/* Tipo de Evento */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Tipo de Evento *</Text>
              <View style={styles.pickerContainer}>
                {EVENT_TYPES.map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.pickerOption,
                      values.eventType === type && styles.pickerOptionSelected,
                    ]}
                    onPress={() => setFieldValue('eventType', type)}
                    disabled={loading}
                  >
                    <Text
                      style={[
                        styles.pickerOptionText,
                        values.eventType === type && styles.pickerOptionTextSelected,
                      ]}
                    >
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              {touched.eventType && errors.eventType && (
                <Text style={styles.errorText}>{errors.eventType}</Text>
              )}
            </View>

            {/* Fecha y Hora */}
            <View style={styles.row}>
              <View style={[styles.fieldContainer, styles.halfWidth]}>
                <Text style={styles.label}>Fecha *</Text>
                <DateTimeSelector
                  value={dateValue}
                  onValueChange={(value) => {
                    setDateValue(value);
                    setFieldValue('date', value);
                  }}
                  mode="date"
                  placeholder="Seleccionar fecha"
                  disabled={loading}
                />
                {touched.date && errors.date && (
                  <Text style={styles.errorText}>{errors.date}</Text>
                )}
              </View>

              <View style={[styles.fieldContainer, styles.halfWidth]}>
                <Text style={styles.label}>Hora *</Text>
                <DateTimeSelector
                  value={timeValue}
                  onValueChange={(value) => {
                    setTimeValue(value);
                    setFieldValue('time', value);
                  }}
                  mode="time"
                  placeholder="Seleccionar hora"
                  disabled={loading}
                />
                {touched.time && errors.time && (
                  <Text style={styles.errorText}>{errors.time}</Text>
                )}
              </View>
            </View>

            {/* Duración */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Duración (minutos) *</Text>
              <TextInput
                style={[
                  styles.input,
                  touched.duration && errors.duration && styles.inputError,
                ]}
                placeholder="60"
                value={values.duration.toString()}
                onChangeText={(text) => setFieldValue('duration', parseInt(text) || 0)}
                onBlur={handleBlur('duration')}
                keyboardType="numeric"
                editable={!loading}
              />
              {touched.duration && errors.duration && (
                <Text style={styles.errorText}>{errors.duration}</Text>
              )}
            </View>

            {/* Instrumento */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Instrumento/Músico *</Text>
              <View style={styles.pickerContainer}>
                {INSTRUMENTS.map((instrument) => (
                  <TouchableOpacity
                    key={instrument}
                    style={[
                      styles.pickerOption,
                      values.instrument === instrument && styles.pickerOptionSelected,
                    ]}
                    onPress={() => setFieldValue('instrument', instrument)}
                    disabled={loading}
                  >
                    <Text
                      style={[
                        styles.pickerOptionText,
                        values.instrument === instrument && styles.pickerOptionTextSelected,
                      ]}
                    >
                      {instrument}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              {touched.instrument && errors.instrument && (
                <Text style={styles.errorText}>{errors.instrument}</Text>
              )}
            </View>

            {/* Presupuesto */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Presupuesto (USD) *</Text>
              <TextInput
                style={[
                  styles.input,
                  touched.budget && errors.budget && styles.inputError,
                ]}
                placeholder="100"
                value={values.budget.toString()}
                onChangeText={(text) => setFieldValue('budget', parseInt(text) || 0)}
                onBlur={handleBlur('budget')}
                keyboardType="numeric"
                editable={!loading}
              />
              {touched.budget && errors.budget && (
                <Text style={styles.errorText}>{errors.budget}</Text>
              )}
            </View>

            {/* Dirección */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Dirección *</Text>
              <TextInput
                style={[
                  styles.input,
                  styles.textArea,
                  touched.location?.address && errors.location?.address && styles.inputError,
                ]}
                placeholder="Dirección completa del evento"
                value={values.location.address}
                onChangeText={(text) => setFieldValue('location.address', text)}
                onBlur={handleBlur('location.address')}
                multiline
                numberOfLines={3}
                editable={!loading}
              />
              {touched.location?.address && errors.location?.address && (
                <Text style={styles.errorText}>{errors.location.address}</Text>
              )}
            </View>

            {/* Comentarios Adicionales */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Comentarios Adicionales</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Información adicional sobre el evento..."
                value={values.additionalComments}
                onChangeText={handleChange('additionalComments')}
                onBlur={handleBlur('additionalComments')}
                multiline
                numberOfLines={4}
                editable={!loading}
              />
            </View>

            {/* Botones */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={onCancel}
                disabled={loading}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.submitButton, loading && styles.buttonDisabled]}
                onPress={() => handleSubmit()}
                disabled={loading || isSubmitting}
              >
                {loading ? (
                  <ActivityIndicator color={color_white} />
                ) : (
                  <Text style={styles.submitButtonText}>Crear Solicitud</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Formik>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color_white,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: text_primary,
    textAlign: 'center',
    marginBottom: 20,
  },
  form: {
    flex: 1,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: text_primary,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: border_color_primary,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: text_primary,
    backgroundColor: color_white,
  },
  inputError: {
    borderColor: color_danger,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  dateInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    color: text_primary,
    fontSize: 16,
  },
  placeholderText: {
    color: text_secondary,
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  pickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pickerOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: border_color_primary,
    backgroundColor: color_white,
  },
  pickerOptionSelected: {
    backgroundColor: color_primary,
    borderColor: color_primary,
  },
  pickerOptionText: {
    color: text_primary,
    fontSize: 14,
  },
  pickerOptionTextSelected: {
    color: color_white,
    fontWeight: '600',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffebee',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  errorText: {
    color: color_danger,
    fontSize: 14,
    marginLeft: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButton: {
    backgroundColor: btn_primary,
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: border_color_primary,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: color_white,
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButtonText: {
    color: text_primary,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default EventRequestForm; 