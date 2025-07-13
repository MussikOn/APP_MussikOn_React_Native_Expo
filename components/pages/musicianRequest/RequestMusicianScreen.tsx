import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../../utils/DatasTypes';
import { s, bg_primary, bg_white, color_white, btn_primary, text_white } from '../../styles/Styles';
import AnimatedBackground from '../../styles/AnimatedBackground';

type Props = StackScreenProps<RootStackParamList, 'RequestMusician'>;

const RequestMusicianScreen: React.FC<Props> = ({ navigation }) => {
  const [eventType, setEventType] = useState<string>('');
  const [eventDate, setEventDate] = useState<string>('');
  const [eventTime, setEventTime] = useState<string>('');
  const [genre, setGenre] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [budget, setBudget] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  const handleSubmitRequest = () => {
    if (!eventType || !eventDate || !eventTime || !genre || !location || !budget) {
      Alert.alert('Campos Incompletos', 'Por favor, rellena todos los campos obligatorios para solicitar el músico.');
      return;
    }

    // Aquí iría la lógica para enviar la solicitud a tu backend
    // Por ahora, solo mostraremos una alerta con los datos
    Alert.alert(
      'Solicitud Enviada',
      `Tipo de Evento: ${eventType}\nFecha: ${eventDate}\nHora: ${eventTime}\nGénero: ${genre}\nUbicación: ${location}\nPresupuesto: ${budget}\nNotas Adicionales: ${notes || 'N/A'}`,
      [
        {
          text: 'OK',
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
        <Text style={[s.title, styles.titleOverride]}>Solicitar un Músico</Text>
        <Text style={[s.subtitle, styles.subtitleOverride]}>
          Cuéntanos sobre tu evento y el tipo de músico que necesitas.
        </Text>

        <View style={styles.formContainer}>
          <Text style={styles.label}>Tipo de Evento:</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Boda, Cumpleaños, Evento Corporativo"
            placeholderTextColor="#aaa"
            value={eventType}
            onChangeText={setEventType}
          />

          <Text style={styles.label}>Fecha del Evento (DD/MM/AAAA):</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: 25/12/2025"
            placeholderTextColor="#aaa"
            value={eventDate}
            onChangeText={setEventDate}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Hora del Evento (HH:MM):</Text>
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

          <Text style={styles.label}>Ubicación del Evento:</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Salón de eventos X, Ciudad Y"
            placeholderTextColor="#aaa"
            value={location}
            onChangeText={setLocation}
          />

          <Text style={styles.label}>Presupuesto Estimado:</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: $500, $1000-$1500"
            placeholderTextColor="#aaa"
            value={budget}
            onChangeText={setBudget}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Notas Adicionales (Opcional):</Text>
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
            <Text style={styles.backButtonText}>Volver</Text>
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