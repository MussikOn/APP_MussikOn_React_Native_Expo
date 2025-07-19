import React from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { color_primary, color_secondary, color_white, border_color_primary, text_primary, text_secondary } from '@styles/Styles';

interface StepBasicInfoProps {
  values: any;
  handleChange: (field: string) => (text: string) => void;
  handleBlur: (field: string) => () => void;
  errors: any;
  touched: any;
}

const StepBasicInfo: React.FC<StepBasicInfoProps> = ({
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
          <Ionicons name="information-circle" size={32} color={color_primary} />
          <Text style={styles.title}>Información Básica</Text>
          <Text style={styles.subtitle}>Completa los datos principales del evento</Text>
        </View>

        {/* Nombre del evento */}
        <View style={styles.inputContainer}>
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
            placeholderTextColor={color_secondary}
          />
          {touched.eventName && errors.eventName && (
            <Text style={styles.errorText}>{errors.eventName}</Text>
          )}
        </View>

        {/* Tipo de evento */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Tipo de Evento *</Text>
          <TextInput
            style={[
              styles.input,
              touched.eventType && errors.eventType && styles.inputError,
            ]}
            placeholder="Ej: Boda, Cumpleaños, Corporativo"
            value={values.eventType}
            onChangeText={handleChange('eventType')}
            onBlur={handleBlur('eventType')}
            placeholderTextColor={color_secondary}
          />
          {touched.eventType && errors.eventType && (
            <Text style={styles.errorText}>{errors.eventType}</Text>
          )}
        </View>

        {/* Instrumento requerido */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Instrumento Requerido *</Text>
          <TextInput
            style={[
              styles.input,
              touched.instrument && errors.instrument && styles.inputError,
            ]}
            placeholder="Ej: Guitarra, Piano, Violín"
            value={values.instrument}
            onChangeText={handleChange('instrument')}
            onBlur={handleBlur('instrument')}
            placeholderTextColor={color_secondary}
          />
          {touched.instrument && errors.instrument && (
            <Text style={styles.errorText}>{errors.instrument}</Text>
          )}
        </View>

        {/* Duración */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Duración (minutos) *</Text>
          <TextInput
            style={[
              styles.input,
              touched.duration && errors.duration && styles.inputError,
            ]}
            placeholder="Ej: 120"
            value={values.duration}
            onChangeText={handleChange('duration')}
            onBlur={handleBlur('duration')}
            keyboardType="numeric"
            placeholderTextColor={color_secondary}
          />
          {touched.duration && errors.duration && (
            <Text style={styles.errorText}>{errors.duration}</Text>
          )}
        </View>

        {/* Presupuesto */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Presupuesto (USD) *</Text>
          <TextInput
            style={[
              styles.input,
              touched.budget && errors.budget && styles.inputError,
            ]}
            placeholder="Ej: 500"
            value={values.budget}
            onChangeText={handleChange('budget')}
            onBlur={handleBlur('budget')}
            keyboardType="numeric"
            placeholderTextColor={color_secondary}
          />
          {touched.budget && errors.budget && (
            <Text style={styles.errorText}>{errors.budget}</Text>
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

export default StepBasicInfo; 