import React from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { color_primary, color_secondary, color_white, border_color_primary, text_primary, text_secondary } from '@styles/Styles';

interface StepBudgetProps {
  values: any;
  handleChange: (field: string) => (text: string) => void;
  handleBlur: (field: string) => () => void;
  errors: any;
  touched: any;
}

const StepBudget: React.FC<StepBudgetProps> = ({
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
          <Ionicons name="cash" size={32} color={color_primary} />
          <Text style={styles.title}>Presupuesto y Pagos</Text>
          <Text style={styles.subtitle}>Define los términos económicos del evento</Text>
        </View>

        {/* Presupuesto mínimo */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Presupuesto Mínimo (USD) *</Text>
          <TextInput
            style={[
              styles.input,
              touched.minBudget && errors.minBudget && styles.inputError,
            ]}
            placeholder="Ej: 300"
            value={values.minBudget}
            onChangeText={handleChange('minBudget')}
            onBlur={handleBlur('minBudget')}
            keyboardType="numeric"
            placeholderTextColor={color_secondary}
          />
          {touched.minBudget && errors.minBudget && (
            <Text style={styles.errorText}>{errors.minBudget}</Text>
          )}
        </View>

        {/* Presupuesto máximo */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Presupuesto Máximo (USD) *</Text>
          <TextInput
            style={[
              styles.input,
              touched.maxBudget && errors.maxBudget && styles.inputError,
            ]}
            placeholder="Ej: 800"
            value={values.maxBudget}
            onChangeText={handleChange('maxBudget')}
            onBlur={handleBlur('maxBudget')}
            keyboardType="numeric"
            placeholderTextColor={color_secondary}
          />
          {touched.maxBudget && errors.maxBudget && (
            <Text style={styles.errorText}>{errors.maxBudget}</Text>
          )}
        </View>

        {/* Método de pago preferido */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Método de Pago Preferido</Text>
          <TextInput
            style={[
              styles.input,
              touched.paymentMethod && errors.paymentMethod && styles.inputError,
            ]}
            placeholder="Ej: Efectivo, Transferencia, Tarjeta"
            value={values.paymentMethod}
            onChangeText={handleChange('paymentMethod')}
            onBlur={handleBlur('paymentMethod')}
            placeholderTextColor={color_secondary}
          />
          {touched.paymentMethod && errors.paymentMethod && (
            <Text style={styles.errorText}>{errors.paymentMethod}</Text>
          )}
        </View>

        {/* Condiciones de pago */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Condiciones de Pago</Text>
          <TextInput
            style={[
              styles.textArea,
              touched.paymentTerms && errors.paymentTerms && styles.inputError,
            ]}
            placeholder="Ej: 50% al contratar, 50% al finalizar"
            value={values.paymentTerms}
            onChangeText={handleChange('paymentTerms')}
            onBlur={handleBlur('paymentTerms')}
            placeholderTextColor={color_secondary}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
          {touched.paymentTerms && errors.paymentTerms && (
            <Text style={styles.errorText}>{errors.paymentTerms}</Text>
          )}
        </View>

        {/* Incluye equipamiento */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>¿Incluye Equipamiento?</Text>
          <TextInput
            style={[
              styles.textArea,
              touched.equipmentIncluded && errors.equipmentIncluded && styles.inputError,
            ]}
            placeholder="Especifica si necesitas que el músico traiga su propio equipamiento o si lo proporcionas tú"
            value={values.equipmentIncluded}
            onChangeText={handleChange('equipmentIncluded')}
            onBlur={handleBlur('equipmentIncluded')}
            placeholderTextColor={color_secondary}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
          {touched.equipmentIncluded && errors.equipmentIncluded && (
            <Text style={styles.errorText}>{errors.equipmentIncluded}</Text>
          )}
        </View>

        {/* Notas adicionales sobre presupuesto */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Notas Adicionales sobre Presupuesto</Text>
          <TextInput
            style={[
              styles.textArea,
              touched.budgetNotes && errors.budgetNotes && styles.inputError,
            ]}
            placeholder="Cualquier información adicional sobre el presupuesto o pagos..."
            value={values.budgetNotes}
            onChangeText={handleChange('budgetNotes')}
            onBlur={handleBlur('budgetNotes')}
            placeholderTextColor={color_secondary}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
          {touched.budgetNotes && errors.budgetNotes && (
            <Text style={styles.errorText}>{errors.budgetNotes}</Text>
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

export default StepBudget; 