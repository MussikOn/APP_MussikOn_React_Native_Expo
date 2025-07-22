import React from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useLegacyColors } from '@hooks/useAppTheme';

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
  const { t } = useTranslation();
  const colors = useLegacyColors();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Ionicons name="information-circle" size={32} color={colors.color_primary} />
          <Text style={[styles.title, { color: colors.text_primary }]}>{t('forms.basic_info')}</Text>
          <Text style={[styles.subtitle, { color: colors.text_secondary }]}>{t('forms.basic_info_subtitle')}</Text>
        </View>

        {/* Nombre del evento */}
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: colors.text_primary }]}>{t('events.event_name')} *</Text>
          <TextInput
            style={[
              styles.input,
              { 
                borderColor: colors.border_color_primary,
                color: colors.text_primary,
              },
              touched.eventName && errors.eventName && { borderColor: colors.color_danger },
            ]}
            placeholder={t('forms.event_name_placeholder')}
            value={values.eventName}
            onChangeText={handleChange('eventName')}
            onBlur={handleBlur('eventName')}
            placeholderTextColor={colors.color_secondary}
          />
          {touched.eventName && errors.eventName && (
            <Text style={[styles.errorText, { color: colors.color_danger }]}>{errors.eventName}</Text>
          )}
        </View>

        {/* Tipo de evento */}
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: colors.text_primary }]}>{t('events.event_type')} *</Text>
          <TextInput
            style={[
              styles.input,
              { 
                borderColor: colors.border_color_primary,
                color: colors.text_primary,
              },
              touched.eventType && errors.eventType && { borderColor: colors.color_danger },
            ]}
            placeholder={t('forms.event_type_placeholder')}
            value={values.eventType}
            onChangeText={handleChange('eventType')}
            onBlur={handleBlur('eventType')}
            placeholderTextColor={colors.color_secondary}
          />
          {touched.eventType && errors.eventType && (
            <Text style={[styles.errorText, { color: colors.color_danger }]}>{errors.eventType}</Text>
          )}
        </View>

        {/* Instrumento requerido */}
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: colors.text_primary }]}>{t('events.instrument')} *</Text>
          <TextInput
            style={[
              styles.input,
              { 
                borderColor: colors.border_color_primary,
                color: colors.text_primary,
              },
              touched.instrument && errors.instrument && { borderColor: colors.color_danger },
            ]}
            placeholder={t('forms.instrument_placeholder')}
            value={values.instrument}
            onChangeText={handleChange('instrument')}
            onBlur={handleBlur('instrument')}
            placeholderTextColor={colors.color_secondary}
          />
          {touched.instrument && errors.instrument && (
            <Text style={[styles.errorText, { color: colors.color_danger }]}>{errors.instrument}</Text>
          )}
        </View>

        {/* Duración */}
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: colors.text_primary }]}>{t('events.duration')} ({t('forms.minutes')}) *</Text>
          <TextInput
            style={[
              styles.input,
              { 
                borderColor: colors.border_color_primary,
                color: colors.text_primary,
              },
              touched.duration && errors.duration && { borderColor: colors.color_danger },
            ]}
            placeholder={t('forms.duration_placeholder')}
            value={values.duration}
            onChangeText={handleChange('duration')}
            onBlur={handleBlur('duration')}
            placeholderTextColor={colors.color_secondary}
            keyboardType="numeric"
          />
          {touched.duration && errors.duration && (
            <Text style={[styles.errorText, { color: colors.color_danger }]}>{errors.duration}</Text>
          )}
        </View>

        {/* Descripción */}
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: colors.text_primary }]}>{t('events.description')}</Text>
          <TextInput
            style={[
              styles.textArea,
              { 
                borderColor: colors.border_color_primary,
                color: colors.text_primary,
              },
              touched.description && errors.description && { borderColor: colors.color_danger },
            ]}
            placeholder={t('forms.description_placeholder')}
            value={values.description}
            onChangeText={handleChange('description')}
            onBlur={handleBlur('description')}
            placeholderTextColor={colors.color_secondary}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
          {touched.description && errors.description && (
            <Text style={[styles.errorText, { color: colors.color_danger }]}>{errors.description}</Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    marginTop: 10,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.8,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
  },
  inputError: {
    borderColor: '#dc3545',
  },
  errorText: {
    fontSize: 14,
    marginTop: 5,
  },
});

export default StepBasicInfo; 