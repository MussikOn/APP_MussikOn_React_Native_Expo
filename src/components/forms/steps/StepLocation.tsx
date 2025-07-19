import React from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { color_primary, color_secondary, color_white, border_color_primary, text_primary, text_secondary } from '@styles/Styles';

interface StepLocationProps {
  values: any;
  handleChange: (field: string) => (text: string) => void;
  handleBlur: (field: string) => () => void;
  errors: any;
  touched: any;
}

const StepLocation: React.FC<StepLocationProps> = ({
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
          <Ionicons name="location" size={32} color={color_primary} />
          <Text style={styles.title}>Ubicación del Evento</Text>
          <Text style={styles.subtitle}>Define dónde se realizará el evento</Text>
        </View>

        {/* Dirección */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Dirección *</Text>
          <TextInput
            style={[
              styles.input,
              touched.location?.address && errors.location?.address && styles.inputError,
            ]}
            placeholder="Ej: Calle Principal 123"
            value={values.location?.address || ''}
            onChangeText={handleChange('location.address')}
            onBlur={handleBlur('location.address')}
            placeholderTextColor={color_secondary}
          />
          {touched.location?.address && errors.location?.address && (
            <Text style={styles.errorText}>{errors.location.address}</Text>
          )}
        </View>

        {/* Ciudad */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Ciudad *</Text>
          <TextInput
            style={[
              styles.input,
              touched.location?.city && errors.location?.city && styles.inputError,
            ]}
            placeholder="Ej: Santo Domingo"
            value={values.location?.city || ''}
            onChangeText={handleChange('location.city')}
            onBlur={handleBlur('location.city')}
            placeholderTextColor={color_secondary}
          />
          {touched.location?.city && errors.location?.city && (
            <Text style={styles.errorText}>{errors.location.city}</Text>
          )}
        </View>

        {/* Fecha */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Fecha del Evento *</Text>
          <TextInput
            style={[
              styles.input,
              touched.date && errors.date && styles.inputError,
            ]}
            placeholder="Ej: 2024-12-25"
            value={values.date}
            onChangeText={handleChange('date')}
            onBlur={handleBlur('date')}
            placeholderTextColor={color_secondary}
          />
          {touched.date && errors.date && (
            <Text style={styles.errorText}>{errors.date}</Text>
          )}
        </View>

        {/* Hora */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Hora del Evento *</Text>
          <TextInput
            style={[
              styles.input,
              touched.time && errors.time && styles.inputError,
            ]}
            placeholder="Ej: 19:00"
            value={values.time}
            onChangeText={handleChange('time')}
            onBlur={handleBlur('time')}
            placeholderTextColor={color_secondary}
          />
          {touched.time && errors.time && (
            <Text style={styles.errorText}>{errors.time}</Text>
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

export default StepLocation; 