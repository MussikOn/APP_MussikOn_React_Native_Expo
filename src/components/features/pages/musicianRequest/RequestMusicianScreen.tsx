import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';
import { RootStackParamList } from '@appTypes/DatasTypes';
import { s, bg_primary, bg_white, color_white, btn_primary, text_white } from '@styles/Styles';
import AnimatedBackground from '@components/ui/styles/AnimatedBackground';

type Props = StackScreenProps<RootStackParamList, 'RequestMusician'>;

const RequestMusicianScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const [eventType, setEventType] = useState<string>('');
  const [eventDate, setEventDate] = useState<string>('');
  const [eventTime, setEventTime] = useState<string>('');
  const [genre, setGenre] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [budget, setBudget] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  const handleSubmitRequest = () => {
    if (!eventType || !eventDate || !eventTime || !genre || !location || !budget) {
      Alert.alert(t('musician_request.incomplete_fields'), t('musician_request.incomplete_fields_message'));
      return;
    }

    // Aquí iría la lógica para enviar la solicitud a tu backend
    // Por ahora, solo mostraremos una alerta con los datos
    Alert.alert(
      t('musician_request.success'),
      `Tipo de Evento: ${eventType}\nFecha: ${eventDate}\nHora: ${eventTime}\nGénero: ${genre}\nUbicación: ${location}\nPresupuesto: ${budget}\nNotas Adicionales: ${notes || 'N/A'}`,
      [
        {
          text: t('common.ok'),
          onPress: () => {
            // Puedes navegar a otra pantalla o resetear el formulario
            navigation.goBack(); // O a una pantalla de confirmación
          },
        },
      ]
    );

    // Limpiar formulario
    setEventType('');
    setEventDate('');
    setEventTime('');
    setGenre('');
    setLocation('');
    setBudget('');
    setNotes('');
  };

  return (
    <>
      <AnimatedBackground />
      <ScrollView contentContainerStyle={[s.container, styles.screenPadding]}>
        <Text style={[s.title, styles.titleOverride]}>{t('musician_request.title')}</Text>
        <Text style={[s.subtitle, styles.subtitleOverride]}>
          Cuéntanos sobre tu evento y el tipo de músico que necesitas.
        </Text>

        <View style={styles.formContainer}>
          <Text style={styles.label}>{t('events.event_type')}:</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Boda, Cumpleaños, Evento Corporativo"
            placeholderTextColor="#aaa"
            value={eventType}
            onChangeText={setEventType}
          />

          <Text style={styles.label}>{t('events.date')} (DD/MM/AAAA):</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: 25/12/2025"
            placeholderTextColor="#aaa"
            value={eventDate}
            onChangeText={setEventDate}
            keyboardType="numeric"
          />

          <Text style={styles.label}>{t('events.time')} (HH:MM):</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: 20:00"
            placeholderTextColor="#aaa"
            value={eventTime}
            onChangeText={setEventTime}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Género Musical Preferido:</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Rock, Salsa, Jazz, Clásica"
            placeholderTextColor="#aaa"
            value={genre}
            onChangeText={setGenre}
          />

          <Text style={styles.label}>{t('events.location')}:</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Salón de eventos X, Ciudad Y"
            placeholderTextColor="#aaa"
            value={location}
            onChangeText={setLocation}
          />

          <Text style={styles.label}>{t('events.budget')} Estimado:</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: $500, $1000-$1500"
            placeholderTextColor="#aaa"
            value={budget}
            onChangeText={setBudget}
            keyboardType="numeric"
          />

          <Text style={styles.label}>{t('events.additional_comments')} (Opcional):</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Cualquier detalle extra sobre tu solicitud..."
            placeholderTextColor="#aaa"
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={4}
          />

          <TouchableOpacity style={[s.btn, s.btn_primary, styles.submitButton]} onPress={handleSubmitRequest}>
            <Text style={s.btnText}>Enviar Solicitud</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[s.btn, styles.backButton]} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>{t('common.back')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  screenPadding: {
    paddingVertical: 40, // Ajusta el padding vertical general
  },
  titleOverride: {
    color: color_white, // Color blanco para el título
    fontSize: 28, // Tamaño de fuente ajustado
    marginBottom: 10,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  subtitleOverride: {
    color: color_white, // Color blanco para el subtítulo
    fontSize: 16,
    marginBottom: 30,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  formContainer: {
    width: '90%', // Contenedor del formulario más ancho
    backgroundColor: bg_primary, // Fondo principal para el formulario
    borderRadius: 15,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  label: {
    fontSize: 16,
    color: color_white,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: bg_white,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  textArea: {
    minHeight: 100, // Altura mínima para el área de texto
    textAlignVertical: 'top', // Alineación del texto en la parte superior
  },
  submitButton: {
    marginTop: 20,
    backgroundColor: btn_primary,
    borderColor: btn_primary,
  },
  backButton: {
    marginTop: 15,
    backgroundColor: 'transparent',
    borderColor: color_white, // Borde blanco
    borderWidth: 2,
  },
  backButtonText: {
    color: color_white, // Texto blanco
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default RequestMusicianScreen;