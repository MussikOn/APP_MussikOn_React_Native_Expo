import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { color_primary, color_white, border_color_primary, text_primary, text_secondary } from '@styles/Styles';

/**
 * Paso 1: Selección de ubicación para el evento.
 * Permite ingresar dirección manual y/o usar un mapa (puedes extenderlo).
 * Usa Formik para manejar el estado y validación.
 */
const StepLocation: React.FC<{ formik: any }> = ({ formik }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>¿Dónde será el evento?</Text>
      <Text style={styles.subtitle}>Ingresa la dirección o selecciona en el mapa.</Text>
      <TextInput
        style={[styles.input, formik.touched.location?.address && formik.errors.location?.address && styles.inputError]}
        placeholder="Dirección completa del evento"
        value={formik.values.location.address}
        onChangeText={(text) => formik.setFieldValue('location.address', text)}
        onBlur={() => formik.setFieldTouched('location.address', true)}
      />
      {formik.touched.location?.address && formik.errors.location?.address && (
        <Text style={styles.errorText}>{formik.errors.location.address}</Text>
      )}
      {/* Aquí puedes agregar un selector de mapa si lo deseas */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginTop: 32 },
  title: { fontSize: 22, fontWeight: 'bold', color: color_primary, marginBottom: 8 },
  subtitle: { fontSize: 15, color: text_secondary, marginBottom: 16 },
  input: { borderWidth: 1, borderColor: border_color_primary, borderRadius: 8, padding: 12, fontSize: 16, color: text_primary, backgroundColor: color_white },
  inputError: { borderColor: 'red' },
  errorText: { color: 'red', fontSize: 13, marginTop: 4 },
});

export default StepLocation; 