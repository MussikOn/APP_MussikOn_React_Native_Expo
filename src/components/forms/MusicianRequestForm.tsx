import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  StyleSheet,
  Modal,
  FlatList,
  Dimensions,
  Animated,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { useUser } from '@contexts/UserContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Platform } from 'react-native';

// Tipos del backend
import { CreateEventPayload, Event, ApiResponse } from '@appTypes/DatasTypes';

// Servicios
import { api } from '@services/api';

const { width, height } = Dimensions.get('window');

interface MusicianRequestFormValues extends CreateEventPayload {
  flyerImage?: string;
  songs: string[];
  recommendations: string[];
  mapsLink: string;
}

interface Props {
  onSubmit: (values: MusicianRequestFormValues) => void;
  onCancel?: () => void;
  isLoading?: boolean;
  initialValues?: Partial<MusicianRequestFormValues>;
}

// Componente de progreso moderno con animaciones
const ProgressBar: React.FC<{ currentStep: number; totalSteps: number }> = ({ currentStep, totalSteps }) => {
  const { theme } = useTheme();
  const progress = (currentStep / totalSteps) * 100;
  const progressAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [progress]);
  
  return (
    <View style={styles.progressContainer}>
      <View style={styles.progressBar}>
        <Animated.View 
          style={[
            styles.progressFill,
            { width: progressAnim }
          ]} 
        />
      </View>
      <View style={styles.progressSteps}>
        {Array.from({ length: totalSteps }, (_, index) => (
          <View
            key={index}
            style={[
              styles.progressStep,
              index < currentStep && styles.progressStepActive,
              index === currentStep - 1 && styles.progressStepCurrent
            ]}
          >
            <Text style={[
              styles.progressStepText,
              index < currentStep && styles.progressStepTextActive,
              index === currentStep - 1 && styles.progressStepTextCurrent
            ]}>
              {index + 1}
            </Text>
          </View>
        ))}
      </View>
      <Text style={styles.progressText}>
        Paso {currentStep} de {totalSteps}
      </Text>
    </View>
  );
};

// Componente de paso individual mejorado
const StepContainer: React.FC<{
  title: string;
  subtitle: string;
  children: React.ReactNode;
  onNext: () => void;
  onBack: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  canProceed: boolean;
  isLoading?: boolean;
}> = ({ title, subtitle, children, onNext, onBack, isFirstStep, isLastStep, canProceed, isLoading }) => {
  const { theme } = useTheme();
  
  return (
    <View style={styles.stepContainer}>
      <View style={styles.stepHeader}>
        <Text style={[styles.stepTitle, { color: theme.colors.text.primary }]}>{title}</Text>
        <Text style={[styles.stepSubtitle, { color: theme.colors.text.secondary }]}>{subtitle}</Text>
      </View>
      
      <View style={styles.stepContent}>
        {children}
      </View>
      
      <View style={styles.stepActions}>
        {!isFirstStep && (
          <TouchableOpacity 
            style={[styles.backButton, { borderColor: theme.colors.border.primary }]} 
            onPress={onBack}
            disabled={isLoading}
          >
            <Ionicons name="arrow-back" size={20} color={theme.colors.text.secondary} />
            <Text style={[styles.backButtonText, { color: theme.colors.text.secondary }]}>
              Anterior
            </Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity 
          style={[
            styles.nextButton, 
            { 
              backgroundColor: canProceed ? theme.colors.primary[500] : theme.colors.primary[100],
              opacity: isLoading ? 0.7 : 1
            }
          ]} 
          onPress={onNext}
          disabled={!canProceed || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={theme.colors.text.inverse} />
          ) : (
            <>
              <Text style={[styles.nextButtonText, { color: theme.colors.text.inverse }]}>
                {isLastStep ? 'Crear Solicitud' : 'Siguiente'}
          </Text>
          <Ionicons 
            name={isLastStep ? "checkmark" : "arrow-forward"} 
            size={20} 
            color={theme.colors.text.inverse} 
          />
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Componente de input moderno
const ModernInput: React.FC<{
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  error?: string;
  multiline?: boolean;
  numberOfLines?: number;
  icon?: keyof typeof Ionicons.glyphMap;
}> = ({ label, value, onChangeText, placeholder, error, multiline, numberOfLines, icon }) => {
  const { theme } = useTheme();
  
  return (
    <View style={styles.inputWrapper}>
      <Text style={[styles.inputLabel, { color: theme.colors.text.primary }]}>{label}</Text>
      <View style={[
        styles.inputContainer,
        { backgroundColor: theme.colors.background.card },
        error && styles.inputError
      ]}>
        {icon && (
          <Ionicons 
            name={icon} 
            size={20} 
            color={theme.colors.text.secondary} 
            style={styles.inputIcon}
          />
        )}
        <TextInput
          style={[
            styles.modernInput,
            { color: theme.colors.text.primary },
            multiline && styles.modernTextArea
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.text.tertiary}
          multiline={multiline}
          numberOfLines={numberOfLines}
          textAlignVertical={multiline ? 'top' : 'center'}
          />
        </View>
      {error && (
        <Text style={[styles.errorText, { color: theme.colors.text.secondary }]}>{error}</Text>
      )}
      </View>
  );
};

// Componente de selector moderno
const ModernPicker: React.FC<{
  label: string;
  value: string;
  onPress: () => void;
  placeholder: string;
  error?: string;
  icon?: keyof typeof Ionicons.glyphMap;
}> = ({ label, value, onPress, placeholder, error, icon }) => {
  const { theme } = useTheme();

  return (
    <View style={styles.inputWrapper}>
      <Text style={[styles.inputLabel, { color: theme.colors.text.primary }]}>{label}</Text>
                  <TouchableOpacity
                    style={[
          styles.modernPickerButton,
          { backgroundColor: theme.colors.background.card },
          error && styles.inputError
        ]}
        onPress={onPress}
      >
        <View style={styles.pickerContent}>
          {icon && (
            <Ionicons 
              name={icon} 
              size={20} 
              color={theme.colors.text.secondary} 
              style={styles.pickerIcon}
            />
          )}
                    <Text style={[
            styles.pickerButtonText,
            { color: value ? theme.colors.text.primary : theme.colors.text.tertiary }
                    ]}>
            {value || placeholder}
                    </Text>
            </View>
        <Ionicons name="chevron-down" size={20} color={theme.colors.text.secondary} />
                  </TouchableOpacity>
      {error && (
        <Text style={[styles.errorText, { color: theme.colors.text.secondary }]}>{error}</Text>
      )}
            </View>
  );
};

// Componente de selector de fecha y hora
const DateTimeSelector: React.FC<{
  label: string;
  value: Date;
  onChange: (date: Date) => void;
  mode: 'date' | 'time';
  error?: string;
}> = ({ label, value, onChange, mode, error }) => {
  const { theme } = useTheme();
  const [showPicker, setShowPicker] = useState(false);
  
  const formatValue = () => {
    if (mode === 'date') {
      return value.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } else {
      return value.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
      });
    }
  };

  const handleChange = (event: any, selectedValue?: Date) => {
    setShowPicker(false);
    if (selectedValue) {
      onChange(selectedValue);
    }
  };

  return (
    <View style={styles.inputWrapper}>
      <Text style={[styles.inputLabel, { color: theme.colors.text.primary }]}>{label}</Text>
                  <TouchableOpacity
                    style={[
          styles.modernPickerButton,
          { backgroundColor: theme.colors.background.card },
          error && styles.inputError
        ]}
        onPress={() => setShowPicker(true)}
      >
        <View style={styles.pickerContent}>
          <Ionicons 
            name={mode === 'date' ? 'calendar' : 'time'} 
            size={20} 
            color={theme.colors.text.secondary} 
            style={styles.pickerIcon}
          />
          <Text style={[styles.pickerButtonText, { color: theme.colors.text.primary }]}>
            {formatValue()}
                    </Text>
            </View>
        <Ionicons name="chevron-down" size={20} color={theme.colors.text.secondary} />
            </TouchableOpacity>
      
      {showPicker && (
        <DateTimePicker
          value={value}
          mode={mode}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleChange}
          minimumDate={mode === 'date' ? new Date() : undefined}
        />
      )}
      
      {error && (
        <Text style={[styles.errorText, { color: theme.colors.text.secondary }]}>{error}</Text>
      )}
          </View>
  );
};

// Componente de selector de opciones
const OptionsSelector: React.FC<{
  visible: boolean;
  onClose: () => void;
  onSelect: (value: string) => void;
  options: { label: string; value: string }[];
  title: string;
}> = ({ visible, onClose, onSelect, options, title }) => {
  const { theme } = useTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: theme.colors.background.card }]}>
          <View style={[styles.modalHeader, { borderBottomColor: theme.colors.border.secondary }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.text.primary }]}>{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={theme.colors.text.secondary} />
            </TouchableOpacity>
          </View>
          <FlatList
            data={options}
            keyExtractor={(item) => item.value}
            renderItem={({ item }) => (
                  <TouchableOpacity
                style={[styles.optionItem, { borderBottomColor: theme.colors.border.secondary }]}
                onPress={() => {
                  onSelect(item.value);
                  onClose();
                }}
              >
                <Text style={[styles.optionText, { color: theme.colors.text.primary }]}>{item.label}</Text>
                  </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </Modal>
  );
};

// Componente de selector de imagen
const ImageSelector: React.FC<{
  label: string;
  value?: string;
  onChange: (uri: string) => void;
  error?: string;
}> = ({ label, value, onChange, error }) => {
  const { theme } = useTheme();

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        onChange(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'No se pudo seleccionar la imagen');
    }
  };

  return (
    <View style={styles.inputWrapper}>
      <Text style={[styles.inputLabel, { color: theme.colors.text.primary }]}>{label}</Text>
      <TouchableOpacity 
        style={[
          styles.imagePickerButton,
          { backgroundColor: theme.colors.background.card },
          error && styles.inputError
        ]} 
        onPress={pickImage}
      >
        {value ? (
          <Image source={{ uri: value }} style={styles.selectedImage} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Ionicons name="image-outline" size={40} color={theme.colors.text.secondary} />
            <Text style={[styles.imagePlaceholderText, { color: theme.colors.text.secondary }]}>
              Seleccionar Flyer
            </Text>
          </View>
        )}
      </TouchableOpacity>
      {error && (
        <Text style={[styles.errorText, { color: theme.colors.text.secondary }]}>{error}</Text>
      )}
    </View>
  );
};

const MusicianRequestForm: React.FC<Props> = ({ onSubmit, onCancel, isLoading = false, initialValues }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { user } = useUser();
  const insets = useSafeAreaInsets();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [showEventTypePicker, setShowEventTypePicker] = useState(false);
  const [showInstrumentPicker, setShowInstrumentPicker] = useState(false);
  
  // Estados del formulario alineados con el backend
  const [formData, setFormData] = useState<MusicianRequestFormValues>({
    eventName: '',
    eventType: 'concierto',
    date: new Date().toISOString().split('T')[0],
    time: '18:00',
    location: '',
    duration: '120',
    instrument: 'guitarra',
    bringInstrument: false,
    comment: '',
    budget: '',
    songs: [],
    recommendations: [],
    mapsLink: '',
    ...initialValues
  });

  const [errors, setErrors] = useState<Partial<MusicianRequestFormValues>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Opciones para los pickers (alineadas con el backend)
  const eventTypeOptions = [
    { label: 'Concierto', value: 'concierto' },
    { label: 'Boda', value: 'boda' },
    { label: 'Culto', value: 'culto' },
    { label: 'Evento Corporativo', value: 'evento_corporativo' },
    { label: 'Festival', value: 'festival' },
    { label: 'Fiesta Privada', value: 'fiesta_privada' },
    { label: 'Graduación', value: 'graduacion' },
    { label: 'Cumpleaños', value: 'cumpleanos' },
    { label: 'Otro', value: 'otro' }
  ];

  const instrumentOptions = [
    { label: 'Guitarra', value: 'guitarra' },
    { label: 'Piano', value: 'piano' },
    { label: 'Bajo', value: 'bajo' },
    { label: 'Batería', value: 'bateria' },
    { label: 'Saxofón', value: 'saxofon' },
    { label: 'Trompeta', value: 'trompeta' },
    { label: 'Violín', value: 'violin' },
    { label: 'Canto', value: 'canto' },
    { label: 'Teclado', value: 'teclado' },
    { label: 'Flauta', value: 'flauta' },
    { label: 'Otro', value: 'otro' }
  ];

  const totalSteps = 6;

  const updateFormData = (field: keyof MusicianRequestFormValues, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateCurrentStep = (): boolean => {
    const newErrors: Partial<MusicianRequestFormValues> = {};

    switch (currentStep) {
      case 1: // Información básica
        if (!formData.eventName.trim()) {
          newErrors.eventName = 'Nombre del evento es requerido';
        } else if (formData.eventName.length < 3) {
          newErrors.eventName = 'Mínimo 3 caracteres';
        }
        if (!formData.eventType) {
          newErrors.eventType = 'Tipo de evento es requerido' as any;
        }
        break;
        
      case 2: // Fecha y horarios
        if (!formData.date) {
          newErrors.date = 'Fecha es requerida';
        }
        if (!formData.time) {
          newErrors.time = 'Hora es requerida';
        }
        if (!formData.duration) {
          newErrors.duration = 'Duración es requerida';
        }
        break;
        
      case 3: // Ubicación
        if (!formData.location.trim()) {
          newErrors.location = 'Ubicación es requerida';
        } else if (formData.location.length < 5) {
          newErrors.location = 'Mínimo 5 caracteres';
        }
        break;
        
      case 4: // Instrumento y detalles
        if (!formData.instrument) {
          newErrors.instrument = 'Instrumento es requerido' as any;
        }
        if (!formData.comment.trim()) {
          newErrors.comment = 'Descripción es requerida';
        } else if (formData.comment.length < 10) {
          newErrors.comment = 'Mínimo 10 caracteres';
        }
        break;
        
      case 5: // Presupuesto y extras
        if (!formData.budget.trim()) {
          newErrors.budget = 'Presupuesto es requerido';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateCurrentStep()) return;
    
    setIsSubmitting(true);
    try {
      // Preparar datos para el backend
      const eventData: CreateEventPayload = {
        eventName: formData.eventName,
        eventType: formData.eventType,
        date: formData.date,
        time: formData.time,
        location: formData.location,
        duration: formData.duration,
        instrument: formData.instrument,
        bringInstrument: formData.bringInstrument,
        comment: formData.comment,
        budget: formData.budget,
        songs: formData.songs,
        recommendations: formData.recommendations,
        mapsLink: formData.mapsLink
      };

      // Llamar al callback del padre
      onSubmit(eventData as MusicianRequestFormValues);
    } catch (error) {
      console.error('Error submitting form:', error);
      Alert.alert('Error', 'No se pudo enviar la solicitud');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getEventTypeLabel = (value: string) => {
    return eventTypeOptions.find(option => option.value === value)?.label || 'Seleccionar tipo';
  };

  const getInstrumentLabel = (value: string) => {
    return instrumentOptions.find(option => option.value === value)?.label || 'Seleccionar instrumento';
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <StepContainer
            title="Información Básica"
            subtitle="Comencemos con los datos principales de tu evento"
            onNext={handleNext}
            onBack={handleBack}
            isFirstStep={true}
            isLastStep={false}
            canProceed={!!formData.eventName.trim() && !!formData.eventType}
            isLoading={isSubmitting}
          >
            <ModernInput
              label="Nombre del Evento"
                value={formData.eventName}
                onChangeText={(value) => updateFormData('eventName', value)}
              placeholder="Ej: Concierto de Verano"
              error={errors.eventName}
              icon="calendar"
            />
            
            <ModernPicker
              label="Tipo de Evento"
              value={getEventTypeLabel(formData.eventType)}
                onPress={() => setShowEventTypePicker(true)}
              placeholder="Seleccionar tipo de evento"
              error={errors.eventType}
              icon="star"
            />
          </StepContainer>
        );

      case 2:
        return (
          <StepContainer
            title="Fecha y Horarios"
            subtitle="¿Cuándo y por cuánto tiempo será tu evento?"
            onNext={handleNext}
            onBack={handleBack}
            isFirstStep={false}
            isLastStep={false}
            canProceed={!!formData.date && !!formData.time && !!formData.duration}
            isLoading={isSubmitting}
          >
            <DateTimeSelector
              label="Fecha del Evento"
              value={new Date(formData.date)}
              onChange={(date) => updateFormData('date', date.toISOString().split('T')[0])}
              mode="date"
              error={errors.date}
            />
            
            <DateTimeSelector
              label="Hora del Evento"
              value={new Date(`2000-01-01T${formData.time}`)}
              onChange={(date) => updateFormData('time', date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }))}
              mode="time"
              error={errors.time}
            />
            
            <ModernInput
              label="Duración (en minutos)"
              value={formData.duration}
              onChangeText={(value) => updateFormData('duration', value)}
              placeholder="120"
              error={errors.duration}
              icon="time"
            />
          </StepContainer>
        );

      case 3:
        return (
          <StepContainer
            title="Ubicación"
            subtitle="¿Dónde se realizará tu evento?"
            onNext={handleNext}
            onBack={handleBack}
            isFirstStep={false}
            isLastStep={false}
            canProceed={!!formData.location.trim()}
            isLoading={isSubmitting}
          >
            <ModernInput
              label="Ubicación del Evento"
                value={formData.location}
                onChangeText={(value) => updateFormData('location', value)}
              placeholder="Ej: Teatro Nacional, Santo Domingo"
              error={errors.location}
              icon="location"
            />
            
            <ModernInput
              label="Enlace de Google Maps (Opcional)"
              value={formData.mapsLink}
              onChangeText={(value) => updateFormData('mapsLink', value)}
              placeholder="https://maps.google.com/..."
              icon="map"
            />
          </StepContainer>
        );

      case 4:
        return (
          <StepContainer
            title="Detalles del Evento"
            subtitle="Cuéntanos más sobre lo que necesitas"
            onNext={handleNext}
            onBack={handleBack}
            isFirstStep={false}
            isLastStep={false}
            canProceed={!!formData.instrument && !!formData.comment.trim()}
            isLoading={isSubmitting}
          >
            <ModernPicker
              label="Instrumento Requerido"
              value={getInstrumentLabel(formData.instrument)}
                onPress={() => setShowInstrumentPicker(true)}
              placeholder="Seleccionar instrumento"
              error={errors.instrument}
              icon="musical-notes"
            />
            
            <ModernInput
              label="Descripción del Evento"
              value={formData.comment}
              onChangeText={(value) => updateFormData('comment', value)}
              placeholder="Describe el evento, tipo de música, ambiente, requisitos especiales..."
              error={errors.comment}
                multiline
                numberOfLines={4}
              icon="document-text"
            />
            
            <View style={styles.checkboxContainer}>
              <TouchableOpacity
                style={styles.checkbox}
                onPress={() => updateFormData('bringInstrument', !formData.bringInstrument)}
              >
                <Ionicons 
                  name={formData.bringInstrument ? "checkbox" : "square-outline"} 
                  size={24} 
                  color={theme.colors.primary[500]} 
                />
              </TouchableOpacity>
              <Text style={[styles.checkboxLabel, { color: theme.colors.text.primary }]}>
                El músico debe traer su propio instrumento
              </Text>
            </View>
          </StepContainer>
        );

      case 5:
        return (
          <StepContainer
            title="Presupuesto y Extras"
            subtitle="Información adicional para completar tu solicitud"
            onNext={handleNext}
            onBack={handleBack}
            isFirstStep={false}
            isLastStep={false}
            canProceed={!!formData.budget.trim()}
            isLoading={isSubmitting}
          >
            <ModernInput
              label="Presupuesto Disponible"
              value={formData.budget}
              onChangeText={(value) => updateFormData('budget', value)}
              placeholder="Ej: 500 USD, 25,000 RD$"
              error={errors.budget}
              icon="cash"
            />
            
            <ModernInput
              label="Canciones Específicas (Opcional)"
              value={formData.songs.join(', ')}
              onChangeText={(value) => updateFormData('songs', value.split(',').map(s => s.trim()).filter(s => s))}
              placeholder="Canción 1, Canción 2, Canción 3..."
              icon="musical-note"
            />
            
            <ModernInput
              label="Recomendaciones (Opcional)"
              value={formData.recommendations.join(', ')}
              onChangeText={(value) => updateFormData('recommendations', value.split(',').map(s => s.trim()).filter(s => s))}
              placeholder="Recomendación 1, Recomendación 2..."
              icon="bulb"
            />
            
            <ImageSelector
              label="Flyer del Evento (Opcional)"
              value={formData.flyerImage}
              onChange={(uri) => updateFormData('flyerImage', uri)}
              error={errors.flyerImage}
            />
          </StepContainer>
        );

      case 6:
        return (
          <StepContainer
            title="Confirmar Solicitud"
            subtitle="Revisa todos los datos antes de crear tu solicitud"
            onNext={handleSubmit}
            onBack={handleBack}
            isFirstStep={false}
            isLastStep={true}
            canProceed={true}
            isLoading={isSubmitting}
          >
            <View style={styles.confirmationContainer}>
              <View style={[styles.confirmationCard, { backgroundColor: theme.colors.background.card }]}>
                <Text style={[styles.confirmationTitle, { color: theme.colors.text.primary }]}>
                  Resumen de tu Solicitud
                </Text>
                
                <View style={styles.confirmationItem}>
                  <Text style={[styles.confirmationLabel, { color: theme.colors.text.secondary }]}>Evento:</Text>
                  <Text style={[styles.confirmationValue, { color: theme.colors.text.primary }]}>{formData.eventName}</Text>
                </View>
                
                <View style={styles.confirmationItem}>
                  <Text style={[styles.confirmationLabel, { color: theme.colors.text.secondary }]}>Tipo:</Text>
                  <Text style={[styles.confirmationValue, { color: theme.colors.text.primary }]}>{getEventTypeLabel(formData.eventType)}</Text>
                </View>
                
                <View style={styles.confirmationItem}>
                  <Text style={[styles.confirmationLabel, { color: theme.colors.text.secondary }]}>Fecha:</Text>
                  <Text style={[styles.confirmationValue, { color: theme.colors.text.primary }]}>{formData.date}</Text>
                </View>
                
                <View style={styles.confirmationItem}>
                  <Text style={[styles.confirmationLabel, { color: theme.colors.text.secondary }]}>Hora:</Text>
                  <Text style={[styles.confirmationValue, { color: theme.colors.text.primary }]}>{formData.time}</Text>
                </View>
                
                <View style={styles.confirmationItem}>
                  <Text style={[styles.confirmationLabel, { color: theme.colors.text.secondary }]}>Duración:</Text>
                  <Text style={[styles.confirmationValue, { color: theme.colors.text.primary }]}>{formData.duration} minutos</Text>
                </View>
                
                <View style={styles.confirmationItem}>
                  <Text style={[styles.confirmationLabel, { color: theme.colors.text.secondary }]}>Ubicación:</Text>
                  <Text style={[styles.confirmationValue, { color: theme.colors.text.primary }]}>{formData.location}</Text>
                </View>
                
                <View style={styles.confirmationItem}>
                  <Text style={[styles.confirmationLabel, { color: theme.colors.text.secondary }]}>Instrumento:</Text>
                  <Text style={[styles.confirmationValue, { color: theme.colors.text.primary }]}>{getInstrumentLabel(formData.instrument)}</Text>
                </View>
                
                <View style={styles.confirmationItem}>
                  <Text style={[styles.confirmationLabel, { color: theme.colors.text.secondary }]}>Presupuesto:</Text>
                  <Text style={[styles.confirmationValue, { color: theme.colors.text.primary }]}>{formData.budget}</Text>
              </View>

                <View style={styles.confirmationItem}>
                  <Text style={[styles.confirmationLabel, { color: theme.colors.text.secondary }]}>Descripción:</Text>
                  <Text style={[styles.confirmationValue, { color: theme.colors.text.primary }]}>{formData.comment}</Text>
                </View>
              </View>
            </View>
          </StepContainer>
        );

      default:
        return null;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.primary, paddingTop: insets.top }]}>
      <LinearGradient
        colors={theme.gradients.primary}
        style={styles.gradientBackground}
      />
      
      <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
      
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {renderStep()}
      </ScrollView>

      {/* Pickers */}
      <OptionsSelector
        visible={showEventTypePicker}
        onClose={() => setShowEventTypePicker(false)}
        onSelect={(value) => updateFormData('eventType', value)}
        options={eventTypeOptions}
        title="Seleccionar Tipo de Evento"
      />

      <OptionsSelector
        visible={showInstrumentPicker}
        onClose={() => setShowInstrumentPicker(false)}
        onSelect={(value) => updateFormData('instrument', value)}
        options={instrumentOptions}
        title="Seleccionar Instrumento"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  scrollContainer: {
    flex: 1,
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    marginBottom: 16,
  },
  progressFill: {
    height: 4,
    backgroundColor: '#fff',
    borderRadius: 2,
  },
  progressSteps: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressStep: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressStepActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  progressStepCurrent: {
    backgroundColor: '#fff',
  },
  progressStepText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    fontWeight: '600',
  },
  progressStepTextActive: {
    color: 'rgba(0, 0, 0, 0.7)',
  },
  progressStepTextCurrent: {
    color: '#000',
  },
  progressText: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
    opacity: 0.8,
  },
  stepContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  stepHeader: {
    marginBottom: 30,
  },
  stepTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 16,
    lineHeight: 22,
    opacity: 0.8,
  },
  stepContent: {
    flex: 1,
  },
  stepActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderRadius: 25,
  },
  backButtonText: {
    fontSize: 16,
    marginLeft: 8,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  inputWrapper: {
    marginBottom: 25,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  inputIcon: {
    marginLeft: 16,
    marginRight: 12,
  },
  modernInput: {
    flex: 1,
    padding: 16,
    fontSize: 16,
    textAlignVertical: 'center',
  },
  modernTextArea: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: '#ff4444',
    borderWidth: 1,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
  modernPickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  pickerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  pickerIcon: {
    marginRight: 12,
  },
  pickerButtonText: {
    fontSize: 16,
    flex: 1,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  checkbox: {
    marginRight: 12,
  },
  checkboxLabel: {
    fontSize: 16,
    flex: 1,
  },
  imagePickerButton: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  imagePlaceholder: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePlaceholderText: {
    marginTop: 8,
    fontSize: 14,
  },
  selectedImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  confirmationContainer: {
    flex: 1,
  },
  confirmationCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6.27,
    elevation: 8,
  },
  confirmationTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  confirmationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  confirmationLabel: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  confirmationValue: {
    fontSize: 14,
    flex: 2,
    textAlign: 'right',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  optionItem: {
    padding: 16,
    borderBottomWidth: 1,
  },
  optionText: {
    fontSize: 16,
  },
});

export default MusicianRequestForm; 