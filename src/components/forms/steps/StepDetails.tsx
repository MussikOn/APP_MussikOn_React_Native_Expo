import React from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { color_primary, color_secondary, color_white, border_color_primary, text_primary, text_secondary } from '@styles/Styles';

interface StepDetailsProps {
  values: any;
  handleChange: (field: string) => (text: string) => void;
  handleBlur: (field: string) => () => void;
  errors: any;
  touched: any;
}

const StepDetails: React.FC<StepDetailsProps> = ({
  values,
  handleChange,
  handleBlur,
  errors,
  touched,
}) => {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Ionicons name="document-text" size={32} color={color_primary} />
          <Text style={styles.title}>Detalles del Evento</Text>
          <Text style={styles.subtitle}>Agrega información adicional sobre el evento</Text>
        </View>

        {/* Descripción */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Descripción del Evento</Text>
          <TextInput
            style={[
              styles.textArea,
              touched.description && errors.description && styles.inputError,
            ]}
            placeholder="Describe el evento, el ambiente que buscas, el tipo de música..."
            value={values.description}
            onChangeText={handleChange('description')}
            onBlur={handleBlur('description')}
            placeholderTextColor={color_secondary}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
          {touched.description && errors.description && (
            <Text style={styles.errorText}>{errors.description}</Text>
          )}
        </View>

        {/* Género musical */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Género Musical</Text>
          <TextInput
            style={[
              styles.input,
              touched.musicGenre && errors.musicGenre && styles.inputError,
            ]}
            placeholder="Ej: Pop, Rock, Jazz, Clásica"
            value={values.musicGenre}
            onChangeText={handleChange('musicGenre')}
            onBlur={handleBlur('musicGenre')}
            placeholderTextColor={color_secondary}
          />
          {touched.musicGenre && errors.musicGenre && (
            <Text style={styles.errorText}>{errors.musicGenre}</Text>
          )}
        </View>

        {/* Número de invitados */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Número de Invitados</Text>
          <TextInput
            style={[
              styles.input,
              touched.guestCount && errors.guestCount && styles.inputError,
            ]}
            placeholder="Ej: 150"
            value={values.guestCount}
            onChangeText={handleChange('guestCount')}
            onBlur={handleBlur('guestCount')}
            keyboardType="numeric"
            placeholderTextColor={color_secondary}
          />
          {touched.guestCount && errors.guestCount && (
            <Text style={styles.errorText}>{errors.guestCount}</Text>
          )}
        </View>

        {/* Requisitos especiales */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Requisitos Especiales</Text>
          <TextInput
            style={[
              styles.textArea,
              touched.specialRequirements && errors.specialRequirements && styles.inputError,
            ]}
            placeholder="Algún requisito especial, equipamiento necesario, etc."
            value={values.specialRequirements}
            onChangeText={handleChange('specialRequirements')}
            onBlur={handleBlur('specialRequirements')}
            placeholderTextColor={color_secondary}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
          {touched.specialRequirements && errors.specialRequirements && (
            <Text style={styles.errorText}>{errors.specialRequirements}</Text>
          )}
        </View>

        {/* Comentarios adicionales */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Comentarios Adicionales</Text>
          <TextInput
            style={[
              styles.textArea,
              touched.additionalComments && errors.additionalComments && styles.inputError,
            ]}
            placeholder="Cualquier información adicional que consideres importante..."
            value={values.additionalComments}
            onChangeText={handleChange('additionalComments')}
            onBlur={handleBlur('additionalComments')}
            placeholderTextColor={color_secondary}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
          {touched.additionalComments && errors.additionalComments && (
            <Text style={styles.errorText}>{errors.additionalComments}</Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color_white,
  },
  content: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: text_primary,
    marginTop: 12,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: text_secondary,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: text_primary,
    marginBottom: 8,
  },
  input: {
    borderWidth: 2,
    borderColor: border_color_primary,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: text_primary,
    backgroundColor: color_white,
  },
  textArea: {
    borderWidth: 2,
    borderColor: border_color_primary,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: text_primary,
    backgroundColor: color_white,
    minHeight: 100,
  },
  inputError: {
    borderColor: '#ff6b6b',
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 14,
    marginTop: 4,
    marginLeft: 4,
  },
});

export default StepDetails; 