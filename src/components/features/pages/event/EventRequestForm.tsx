import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Switch, Platform, ActivityIndicator } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import {
  color_primary,
  color_white,
  color_secondary,
  color_info,
  color_success,
  color_danger,
  bg_white,
  bg_primary,
  btn_primary,
  btn_success,
  btn_danger,
  border_color_primary,
} from '@styles/Styles';

const EventRequestSchema = Yup.object().shape({
  eventName: Yup.string().required('Nombre del evento requerido'),
  eventType: Yup.string().required('Tipo de evento requerido'),
  date: Yup.date().required('Fecha requerida'),
  time: Yup.string().required('Hora requerida'),
  location: Yup.string().required('Ubicación requerida'),
  duration: Yup.string().required('Duración requerida'),
  instrument: Yup.string().required('Instrumento requerido'),
  mustBringInstrument: Yup.boolean(),
  budget: Yup.string().required('Presupuesto requerido'),
  comment: Yup.string(),
  repertoire: Yup.string(),
});

const eventTypes = [
  'Boda',
  'Concierto',
  'Cumpleaños',
  'Fiesta privada',
  'Evento corporativo',
  'Otro',
];

const instrumentsList = [
  'Guitarra',
  'Batería',
  'Piano',
  'Bajo',
  'Voz',
  'Saxofón',
  'Trompeta',
  'Violín',
  'Otro',
];

export interface EventRequestFormValues {
  eventName: string;
  eventType: string;
  date: Date;
  time: string;
  location: string;
  duration: string;
  instrument: string;
  mustBringInstrument: boolean;
  budget: string;
  comment: string;
  repertoire: string;
}

interface EventRequestFormProps {
  onSubmit: (values: EventRequestFormValues) => void;
  initialValues?: Partial<EventRequestFormValues>;
  loading?: boolean;
}

const EventRequestForm: React.FC<EventRequestFormProps> = ({ onSubmit, initialValues = {}, loading = false }) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  return (
    <Formik
      initialValues={{
        eventName: '',
        eventType: '',
        date: new Date(),
        time: '',
        location: '',
        duration: '',
        instrument: '',
        mustBringInstrument: false,
        budget: '',
        comment: '',
        repertoire: '',
        ...initialValues,
      }}
      validationSchema={EventRequestSchema}
      onSubmit={onSubmit}
    >
      {({ handleChange, handleBlur, handleSubmit, setFieldValue, values, errors, touched }) => (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
          <Text style={styles.title}>Solicitar Músico</Text>

          <Text style={styles.label}>Nombre del evento</Text>
          <TextInput
            style={[styles.input, errors.eventName && touched.eventName && styles.inputError]}
            placeholder="Ej: Fiesta de boda"
            value={values.eventName}
            onChangeText={handleChange('eventName')}
            onBlur={handleBlur('eventName')}
          />
          {errors.eventName && touched.eventName && <Text style={styles.error}>{errors.eventName}</Text>}

          <Text style={styles.label}>Tipo de evento</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={values.eventType}
              onValueChange={itemValue => setFieldValue('eventType', itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Selecciona tipo de evento" value="" />
              {eventTypes.map(type => (
                <Picker.Item key={type} label={type} value={type} />
              ))}
            </Picker>
          </View>
          {errors.eventType && touched.eventType && <Text style={styles.error}>{errors.eventType}</Text>}

          <Text style={styles.label}>Fecha</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={{ color: values.date ? color_primary : color_secondary }}>
              {values.date ? new Date(values.date).toLocaleDateString() : 'Selecciona una fecha'}
            </Text>
            <Ionicons name="calendar" size={20} color={color_primary} style={{ position: 'absolute', right: 10, top: 10 }} />
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={showDatePicker}
            mode="date"
            date={values.date || new Date()}
            onConfirm={date => {
              setShowDatePicker(false);
              setFieldValue('date', date);
            }}
            onCancel={() => setShowDatePicker(false)}
          />
          {errors.date && touched.date && typeof errors.date === 'string' && <Text style={styles.error}>{errors.date}</Text>}

          <Text style={styles.label}>Hora</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowTimePicker(true)}
          >
            <Text style={{ color: values.time ? color_primary : color_secondary }}>
              {values.time ? values.time : 'Selecciona una hora'}
            </Text>
            <Ionicons name="time" size={20} color={color_primary} style={{ position: 'absolute', right: 10, top: 10 }} />
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={showTimePicker}
            mode="time"
            date={values.date || new Date()}
            onConfirm={date => {
              setShowTimePicker(false);
              const hours = date.getHours().toString().padStart(2, '0');
              const minutes = date.getMinutes().toString().padStart(2, '0');
              setFieldValue('time', `${hours}:${minutes}`);
            }}
            onCancel={() => setShowTimePicker(false)}
          />
          {errors.time && touched.time && <Text style={styles.error}>{errors.time}</Text>}

          <Text style={styles.label}>Ubicación (dirección o enlace Google Maps)</Text>
          <TextInput
            style={[styles.input, errors.location && touched.location && styles.inputError]}
            placeholder="Ej: Av. Principal 123, Ciudad"
            value={values.location}
            onChangeText={handleChange('location')}
            onBlur={handleBlur('location')}
          />
          {errors.location && touched.location && <Text style={styles.error}>{errors.location}</Text>}

          <Text style={styles.label}>Duración</Text>
          <TextInput
            style={[styles.input, errors.duration && touched.duration && styles.inputError]}
            placeholder="Ej: 3 horas"
            value={values.duration}
            onChangeText={handleChange('duration')}
            onBlur={handleBlur('duration')}
          />
          {errors.duration && touched.duration && <Text style={styles.error}>{errors.duration}</Text>}

          <Text style={styles.label}>Instrumento / tipo de músico</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={values.instrument}
              onValueChange={itemValue => setFieldValue('instrument', itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Selecciona instrumento" value="" />
              {instrumentsList.map(inst => (
                <Picker.Item key={inst} label={inst} value={inst} />
              ))}
            </Picker>
          </View>
          {errors.instrument && touched.instrument && <Text style={styles.error}>{errors.instrument}</Text>}

          <View style={styles.switchRow}>
            <Text style={styles.label}>¿Debe llevar instrumento?</Text>
            <Switch
              value={values.mustBringInstrument}
              onValueChange={val => { setFieldValue('mustBringInstrument', val); }}
              trackColor={{ false: color_secondary, true: color_primary }}
              thumbColor={values.mustBringInstrument ? color_primary : color_white}
            />
          </View>

          <Text style={styles.label}>Presupuesto</Text>
          <TextInput
            style={[styles.input, errors.budget && touched.budget && styles.inputError]}
            placeholder="Ej: 5000 RD$"
            value={values.budget}
            onChangeText={handleChange('budget')}
            onBlur={handleBlur('budget')}
            keyboardType="numeric"
          />
          {errors.budget && touched.budget && <Text style={styles.error}>{errors.budget}</Text>}

          <Text style={styles.label}>Comentario adicional</Text>
          <TextInput
            style={styles.input}
            placeholder="Detalles extra para el músico"
            value={values.comment}
            onChangeText={handleChange('comment')}
            onBlur={handleBlur('comment')}
            multiline
          />

          <Text style={styles.label}>Lista de canciones / repertorio</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Canción 1, Canción 2, ..."
            value={values.repertoire}
            onChangeText={handleChange('repertoire')}
            onBlur={handleBlur('repertoire')}
            multiline
          />

          <TouchableOpacity
            style={styles.submitBtn}
            onPress={() => handleSubmit()}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color={color_white} /> : <Text style={styles.submitBtnText}>Solicitar Músico</Text>}
          </TouchableOpacity>
        </ScrollView>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: bg_white,
    padding: 24,
    borderRadius: 18,
    margin: 16,
    elevation: 8,
    shadowColor: color_primary,
    shadowOpacity: 0.10,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: color_primary,
    marginBottom: 18,
    textAlign: 'center',
    letterSpacing: 1.1,
  },
  label: {
    fontSize: 16,
    color: color_primary,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 4,
  },
  input: {
    backgroundColor: color_white,
    borderColor: border_color_primary,
    borderWidth: 1.2,
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: color_primary,
    marginBottom: 2,
  },
  inputError: {
    borderColor: color_danger,
  },
  error: {
    color: color_danger,
    fontSize: 13,
    marginBottom: 2,
    marginLeft: 2,
  },
  pickerWrapper: {
    borderWidth: 1.2,
    borderColor: border_color_primary,
    borderRadius: 10,
    marginBottom: 2,
    backgroundColor: color_white,
    overflow: 'hidden',
  },
  picker: {
    color: color_primary,
    width: '100%',
    height: 48,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 2,
  },
  submitBtn: {
    backgroundColor: btn_primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 28,
    elevation: 2,
  },
  submitBtnText: {
    color: color_white,
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1.1,
  },
});

export default EventRequestForm; 