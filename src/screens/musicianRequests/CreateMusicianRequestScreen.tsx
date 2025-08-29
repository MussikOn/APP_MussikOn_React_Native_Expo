import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { colors, textStyles, borderRadius, shadows, spacing } from '@theme';
import { MusicianRequestService } from '@services/musicianRequestService';
import { CreateMusicianRequestDTO } from '@appTypes/DatasTypes';
import { Button, Card, LoadingSpinner, BaseText, BaseContainer, BaseInput } from '@components/ui';
import { useUser } from '@contexts/UserContext';
import DateTimePicker from '@react-native-community/datetimepicker';

export const CreateMusicianRequestScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { user } = useUser();
  
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  
  const [formData, setFormData] = useState<CreateMusicianRequestDTO>({
    eventType: '',
    instrument: '',
    eventDate: new Date().toISOString(),
    duration: 60,
    location: '',
    budget: 100,
    description: '',
    isUrgent: false,
    specialRequirements: '',
  });

  const [errors, setErrors] = useState<{
    eventType?: string;
    instrument?: string;
    eventDate?: string;
    duration?: string;
    location?: string;
    budget?: string;
    description?: string;
    isUrgent?: string;
    specialRequirements?: string;
  }>({});

  const eventTypes = [
    'Boda',
    'Cumpleaños',
    'Evento Corporativo',
    'Fiesta Privada',
    'Concierto',
    'Ceremonia',
    'Otro',
  ];

  const instruments = [
    'Piano',
    'Guitarra',
    'Violín',
    'Saxofón',
    'Trompeta',
    'Batería',
    'Bajo',
    'Voz',
    'Flauta',
    'Clarinete',
    'Acordeón',
    'Otro',
  ];

  const durations = [30, 60, 90, 120, 180, 240];

  const validateForm = (): boolean => {
    const newErrors: {
      eventType?: string;
      instrument?: string;
      eventDate?: string;
      duration?: string;
      location?: string;
      budget?: string;
      description?: string;
      isUrgent?: string;
      specialRequirements?: string;
    } = {};

    if (!formData.eventType.trim()) {
      newErrors.eventType = t('musician_requests.validation.event_type_required');
    }

    if (!formData.instrument.trim()) {
      newErrors.instrument = t('musician_requests.validation.instrument_required');
    }

    if (!formData.eventDate) {
      newErrors.eventDate = t('musician_requests.validation.event_date_required');
    }

    if (formData.duration <= 0) {
      newErrors.duration = t('musician_requests.validation.duration_required');
    }

    if (!formData.location.trim()) {
      newErrors.location = t('musician_requests.validation.location_required');
    }

    if (formData.budget <= 0) {
      newErrors.budget = t('musician_requests.validation.budget_required');
    }

    if (formData.budget < 50) {
      newErrors.budget = t('musician_requests.validation.budget_minimum');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      
      const newRequest = await MusicianRequestService.createRequest(formData);
      
      Alert.alert(
        t('common.success'),
        t('musician_requests.created_success'),
        [
          {
            text: t('common.ok'),
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      console.error('Error creating request:', error);
      Alert.alert(
        t('common.error'),
        t('musician_requests.create_error')
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFormData((prev: CreateMusicianRequestDTO) => ({
        ...prev,
        eventDate: selectedDate.toISOString(),
      }));
    }
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const currentDate = new Date(formData.eventDate);
      const newDate = new Date(currentDate);
      newDate.setHours(selectedTime.getHours());
      newDate.setMinutes(selectedTime.getMinutes());
      
      setFormData((prev: CreateMusicianRequestDTO) => ({
        ...prev,
        eventDate: newDate.toISOString(),
      }));
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (loading) {
    return (
      <BaseContainer style={styles.loadingContainer}>
        <LoadingSpinner size="large" />
        <BaseText style={styles.loadingText}>{t('common.creating')}</BaseText>
      </BaseContainer>
    );
  }

  return (
    <BaseContainer style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <BaseText style={styles.title}>{t('musician_requests.create_title')}</BaseText>
            <BaseText style={styles.subtitle}>
              {t('musician_requests.create_subtitle')}
            </BaseText>
          </View>

          <Card style={styles.formCard}>
            {/* Tipo de Evento */}
            <View style={styles.formSection}>
              <BaseText style={styles.sectionTitle}>
                {t('musician_requests.event_type')} *
              </BaseText>
              <View style={styles.optionsGrid}>
                {eventTypes.map((type) => (
                  <Button
                    key={type}
                    title={type}
                    onPress={() => setFormData((prev: CreateMusicianRequestDTO) => ({ ...prev, eventType: type }))}
                    type={formData.eventType === type ? 'primary' : 'outline'}
                    size="small"
                    style={styles.optionButton}
                  />
                ))}
              </View>
              {errors.eventType && (
                <BaseText style={styles.errorText}>{errors.eventType}</BaseText>
              )}
            </View>

            {/* Instrumento */}
            <View style={styles.formSection}>
              <BaseText style={styles.sectionTitle}>
                {t('musician_requests.instrument')} *
              </BaseText>
              <View style={styles.optionsGrid}>
                {instruments.map((instrument) => (
                  <Button
                    key={instrument}
                    title={instrument}
                    onPress={() => setFormData((prev: CreateMusicianRequestDTO) => ({ ...prev, instrument }))}
                    type={formData.instrument === instrument ? 'primary' : 'outline'}
                    size="small"
                    style={styles.optionButton}
                  />
                ))}
              </View>
              {errors.instrument && (
                <BaseText style={styles.errorText}>{errors.instrument}</BaseText>
              )}
            </View>

            {/* Fecha y Hora */}
            <View style={styles.formSection}>
              <BaseText style={styles.sectionTitle}>
                {t('musician_requests.event_date')} *
              </BaseText>
              <View style={styles.dateTimeRow}>
                <Button
                  title={t('musician_requests.select_date')}
                  onPress={() => setShowDatePicker(true)}
                  type="outline"
                  size="medium"
                  style={styles.dateTimeButton}
                />
                <Button
                  title={t('musician_requests.select_time')}
                  onPress={() => setShowTimePicker(true)}
                  type="outline"
                  size="medium"
                  style={styles.dateTimeButton}
                />
              </View>
              <BaseText style={styles.selectedDateTime}>
                {formatDateTime(formData.eventDate)}
              </BaseText>
              {errors.eventDate && (
                <BaseText style={styles.errorText}>{errors.eventDate}</BaseText>
              )}
            </View>

            {/* Duración */}
            <View style={styles.formSection}>
              <BaseText style={styles.sectionTitle}>
                {t('musician_requests.duration')} *
              </BaseText>
              <View style={styles.optionsGrid}>
                {durations.map((duration) => (
                  <Button
                    key={duration}
                    title={`${duration} ${t('musician_requests.minutes')}`}
                    onPress={() => setFormData((prev: CreateMusicianRequestDTO) => ({ ...prev, duration }))}
                    type={formData.duration === duration ? 'primary' : 'outline'}
                    size="small"
                    style={styles.optionButton}
                  />
                ))}
              </View>
              {errors.duration && (
                <BaseText style={styles.errorText}>{errors.duration}</BaseText>
              )}
            </View>

            {/* Ubicación */}
            <View style={styles.formSection}>
              <BaseText style={styles.sectionTitle}>
                {t('musician_requests.location')} *
              </BaseText>
              <BaseInput
                label={t('musician_requests.location')}
                placeholder={t('musician_requests.location_placeholder')}
                value={formData.location}
                onChangeText={(text: string) => setFormData((prev: CreateMusicianRequestDTO) => ({ ...prev, location: text }))}
                error={errors.location}
                multiline
                numberOfLines={2}
              />
            </View>

            {/* Presupuesto */}
            <View style={styles.formSection}>
              <BaseText style={styles.sectionTitle}>
                {t('musician_requests.budget')} *
              </BaseText>
              <BaseInput
                label={t('musician_requests.budget')}
                placeholder={t('musician_requests.budget_placeholder')}
                value={formData.budget.toString()}
                onChangeText={(text) => {
                  const budget = parseFloat(text) || 0;
                  setFormData((prev: CreateMusicianRequestDTO) => ({ ...prev, budget }));
                }}
                keyboardType="numeric"
                error={errors.budget || undefined}
              />
              <BaseText style={styles.budgetHint}>
                {t('musician_requests.budget_hint')}
              </BaseText>
            </View>

            {/* Descripción */}
            <View style={styles.formSection}>
              <BaseText style={styles.sectionTitle}>
                {t('musician_requests.description')}
              </BaseText>
              <BaseInput
                label={t('musician_requests.description')}
                placeholder={t('musicianRequest.description_placeholder')}
                value={formData.description}
                onChangeText={(text: string) => setFormData((prev: CreateMusicianRequestDTO) => ({ ...prev, description: text }))}
                multiline
                numberOfLines={4}
              />
            </View>

            {/* Requisitos Especiales */}
            <View style={styles.formSection}>
              <BaseText style={styles.sectionTitle}>
                {t('musician_requests.special_requirements')}
              </BaseText>
              <BaseInput
                label={t('musician_requests.special_requirements')}
                placeholder={t('musician_requests.special_requirements_placeholder')}
                value={formData.specialRequirements}
                onChangeText={(text: string) => setFormData((prev: CreateMusicianRequestDTO) => ({ ...prev, specialRequirements: text }))}
                multiline
                numberOfLines={3}
              />
            </View>

            {/* Urgente */}
            <View style={styles.formSection}>
              <View style={styles.checkboxRow}>
                <Button
                  title={t('musician_requests.urgent')}
                  onPress={() => setFormData((prev: CreateMusicianRequestDTO) => ({ ...prev, isUrgent: !prev.isUrgent }))}
                  type={formData.isUrgent ? 'primary' : 'outline'}
                  size="small"
                  icon={formData.isUrgent ? 'checkmark-circle' : 'ellipse-outline'}
                />
                <BaseText style={styles.urgentHint}>
                  {t('musician_requests.urgent_hint')}
                </BaseText>
              </View>
            </View>
          </Card>

          {/* Botones de Acción */}
          <View style={styles.actionButtons}>
            <Button
              title={t('common.cancel')}
              onPress={() => navigation.goBack()}
              type="outline"
              size="large"
              style={styles.cancelButton}
            />
            <Button
              title={t('musician_requests.create_request')}
              onPress={handleSubmit}
              type="primary"
              size="large"
              style={styles.submitButton}
              loading={loading}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={new Date(formData.eventDate)}
          mode="date"
          display="default"
          onChange={handleDateChange}
          minimumDate={new Date()}
        />
      )}

      {/* Time Picker */}
      {showTimePicker && (
        <DateTimePicker
          value={new Date(formData.eventDate)}
          mode="time"
          display="default"
          onChange={handleTimeChange}
        />
      )}
    </BaseContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...textStyles.body1,
    color: colors.text.secondary,
    marginTop: spacing.md,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    backgroundColor: colors.background.secondary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.primary,
  },
  title: {
    ...textStyles.h2,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...textStyles.body1,
    color: colors.text.secondary,
  },
  formCard: {
    margin: spacing.lg,
    padding: spacing.lg,
  },
  formSection: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...textStyles.h4,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  optionButton: {
    minWidth: 100,
  },
  dateTimeRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  dateTimeButton: {
    flex: 1,
  },
  selectedDateTime: {
    ...textStyles.body1,
    color: colors.text.secondary,
    fontStyle: 'italic',
    textAlign: 'center',
    padding: spacing.sm,
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.sm,
  },
  budgetHint: {
    ...textStyles.caption,
    color: colors.text.tertiary,
    marginTop: spacing.xs,
    fontStyle: 'italic',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  urgentHint: {
    ...textStyles.caption,
    color: colors.text.tertiary,
    flex: 1,
  },
  errorText: {
    ...textStyles.caption,
    color: colors.error[500],
    marginTop: spacing.xs,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
  },
  cancelButton: {
    flex: 1,
  },
  submitButton: {
    flex: 2,
  },
});

export default CreateMusicianRequestScreen;
