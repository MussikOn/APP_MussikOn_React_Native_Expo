import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { color_primary, color_secondary, color_white, color_success, border_color_primary, text_primary, text_secondary } from '@styles/Styles';

interface StepSummaryProps {
  values: any;
}

const StepSummary: React.FC<StepSummaryProps> = ({ values }) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return 'No especificada';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (timeString: string) => {
    return timeString || 'No especificada';
  };

  const renderSection = (title: string, icon: string, children: React.ReactNode) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Ionicons name={icon as any} size={24} color={color_primary} />
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      <View style={styles.sectionContent}>
        {children}
      </View>
    </View>
  );

  const renderField = (label: string, value: string, required: boolean = false) => (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>
        {label} {required && <Text style={styles.required}>*</Text>}
      </Text>
      <Text style={styles.fieldValue}>{value || 'No especificado'}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Ionicons name="checkmark-circle" size={32} color={color_success} />
          <Text style={styles.title}>Resumen de la Solicitud</Text>
          <Text style={styles.subtitle}>Revisa toda la información antes de enviar</Text>
        </View>

        {/* Información Básica */}
        {renderSection('information-circle', 'Información Básica',
          <>
            {renderField('Nombre del Evento', values.eventName, true)}
            {renderField('Tipo de Evento', values.eventType, true)}
            {renderField('Instrumento Requerido', values.instrument, true)}
            {renderField('Duración', values.duration ? `${values.duration} minutos` : '', true)}
            {renderField('Presupuesto', values.budget ? `$${values.budget} USD` : '', true)}
          </>
        )}

        {/* Ubicación */}
        {renderSection('location', 'Ubicación',
          <>
            {renderField('Dirección', values.location?.address || '', true)}
            {renderField('Ciudad', values.location?.city || '', true)}
            {renderField('Fecha', formatDate(values.date), true)}
            {renderField('Hora', formatTime(values.time), true)}
          </>
        )}

        {/* Detalles */}
        {renderSection('document-text', 'Detalles del Evento',
          <>
            {renderField('Descripción', values.description)}
            {renderField('Género Musical', values.musicGenre)}
            {renderField('Número de Invitados', values.guestCount)}
            {renderField('Requisitos Especiales', values.specialRequirements)}
            {renderField('Comentarios Adicionales', values.additionalComments)}
          </>
        )}

        {/* Presupuesto */}
        {renderSection('cash', 'Presupuesto y Pagos',
          <>
            {renderField('Presupuesto Mínimo', values.minBudget ? `$${values.minBudget} USD` : '', true)}
            {renderField('Presupuesto Máximo', values.maxBudget ? `$${values.maxBudget} USD` : '', true)}
            {renderField('Método de Pago', values.paymentMethod)}
            {renderField('Condiciones de Pago', values.paymentTerms)}
            {renderField('Equipamiento Incluido', values.equipmentIncluded)}
            {renderField('Notas de Presupuesto', values.budgetNotes)}
          </>
        )}

        {/* Mensaje de confirmación */}
        <View style={styles.confirmationMessage}>
          <Ionicons name="shield-checkmark" size={24} color={color_success} />
          <Text style={styles.confirmationText}>
            Al enviar esta solicitud, los músicos podrán ver tu evento y contactarte si están interesados.
          </Text>
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
  section: {
    marginBottom: 24,
    backgroundColor: color_white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: border_color_primary,
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: color_primary + '10',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: border_color_primary,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: text_primary,
    marginLeft: 12,
  },
  sectionContent: {
    padding: 16,
  },
  field: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: text_secondary,
    marginBottom: 4,
  },
  fieldValue: {
    fontSize: 16,
    color: text_primary,
    lineHeight: 22,
  },
  required: {
    color: '#ff6b6b',
    fontWeight: 'bold',
  },
  confirmationMessage: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: color_success + '10',
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
  },
  confirmationText: {
    fontSize: 14,
    color: text_primary,
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
});

export default StepSummary; 