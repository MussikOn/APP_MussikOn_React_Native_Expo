import React, { useState } from 'react';
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
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

interface MusicianRequestFormValues {
  eventName: string;
  eventType: string;
  eventDate: Date;
  startTime: string;
  endTime: string;
  location: string;
  instrumentType: string;
  eventDescription: string;
  flyerImage?: string;
}

interface Props {
  onSubmit: (values: MusicianRequestFormValues, calculatedPrice: number) => void;
  isLoading?: boolean;
}

// Componente de progreso moderno
const ProgressBar: React.FC<{ currentStep: number; totalSteps: number }> = ({ currentStep, totalSteps }) => {
  const progress = (currentStep / totalSteps) * 100;
  
  return (
    <View style={styles.progressContainer}>
      <View style={styles.progressBar}>
        <Animated.View 
          style={[
            styles.progressFill,
            { width: `${progress}%` }
          ]} 
        />
      </View>
      <Text style={styles.progressText}>
        Paso {currentStep} de {totalSteps}
      </Text>
    </View>
  );
};

// Componente de paso individual
const StepContainer: React.FC<{
  title: string;
  subtitle: string;
  children: React.ReactNode;
  onNext: () => void;
  onBack: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  canProceed: boolean;
}> = ({ title, subtitle, children, onNext, onBack, isFirstStep, isLastStep, canProceed }) => (
  <View style={styles.stepContainer}>
    <View style={styles.stepHeader}>
      <Text style={styles.stepTitle}>{title}</Text>
      <Text style={styles.stepSubtitle}>{subtitle}</Text>
    </View>
    
    <View style={styles.stepContent}>
      {children}
    </View>
    
    <View style={styles.stepActions}>
      {!isFirstStep && (
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="arrow-back" size={20} color="#666" />
          <Text style={styles.backButtonText}>Anterior</Text>
        </TouchableOpacity>
      )}
      
      <TouchableOpacity 
        style={[styles.nextButton, !canProceed && styles.nextButtonDisabled]} 
        onPress={onNext}
        disabled={!canProceed}
      >
        <Text style={styles.nextButtonText}>
          {isLastStep ? 'Confirmar' : 'Siguiente'}
        </Text>
        <Ionicons 
          name={isLastStep ? "checkmark" : "arrow-forward"} 
          size={20} 
          color="#fff" 
        />
      </TouchableOpacity>
    </View>
  </View>
);

// Componente nativo para selección de opciones
const NativePicker: React.FC<{
  visible: boolean;
  onClose: () => void;
  onSelect: (value: string) => void;
  options: { label: string; value: string }[];
  title: string;
}> = ({ visible, onClose, onSelect, options, title }) => (
  <Modal
    visible={visible}
    transparent
    animationType="slide"
    onRequestClose={onClose}
  >
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>{title}</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>
        </View>
        <FlatList
          data={options}
          keyExtractor={(item) => item.value}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.optionItem}
              onPress={() => {
                onSelect(item.value);
                onClose();
              }}
            >
              <Text style={styles.optionText}>{item.label}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  </Modal>
);

// Componente nativo para date picker
const NativeDatePicker: React.FC<{
  visible: boolean;
  onClose: () => void;
  onDateSelect: (date: Date) => void;
  currentDate: Date;
}> = ({ visible, onClose, onDateSelect, currentDate }) => {
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [selectedDay, setSelectedDay] = useState(currentDate.getDate());

  const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i);
  const months = [
    { value: 0, label: 'Enero' }, { value: 1, label: 'Febrero' }, { value: 2, label: 'Marzo' },
    { value: 3, label: 'Abril' }, { value: 4, label: 'Mayo' }, { value: 5, label: 'Junio' },
    { value: 6, label: 'Julio' }, { value: 7, label: 'Agosto' }, { value: 8, label: 'Septiembre' },
    { value: 9, label: 'Octubre' }, { value: 10, label: 'Noviembre' }, { value: 11, label: 'Diciembre' }
  ];

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const days = Array.from({ length: getDaysInMonth(selectedYear, selectedMonth) }, (_, i) => i + 1);

  const handleConfirm = () => {
    const selectedDate = new Date(selectedYear, selectedMonth, selectedDay);
    onDateSelect(selectedDate);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.datePickerContainer}>
          <View style={styles.datePickerHeader}>
            <Text style={styles.datePickerTitle}>Seleccionar Fecha</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.datePickerContent}>
            {/* Año */}
            <View style={styles.pickerSection}>
              <Text style={styles.pickerLabel}>Año</Text>
              <ScrollView style={styles.pickerScroll} showsVerticalScrollIndicator={false}>
                {years.map((year) => (
                  <TouchableOpacity
                    key={year}
                    style={[
                      styles.pickerOption,
                      selectedYear === year && styles.pickerOptionSelected
                    ]}
                    onPress={() => setSelectedYear(year)}
                  >
                    <Text style={[
                      styles.pickerOptionText,
                      selectedYear === year && styles.pickerOptionTextSelected
                    ]}>
                      {year}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Mes */}
            <View style={styles.pickerSection}>
              <Text style={styles.pickerLabel}>Mes</Text>
              <ScrollView style={styles.pickerScroll} showsVerticalScrollIndicator={false}>
                {months.map((month) => (
                  <TouchableOpacity
                    key={month.value}
                    style={[
                      styles.pickerOption,
                      selectedMonth === month.value && styles.pickerOptionSelected
                    ]}
                    onPress={() => setSelectedMonth(month.value)}
                  >
                    <Text style={[
                      styles.pickerOptionText,
                      selectedMonth === month.value && styles.pickerOptionTextSelected
                    ]}>
                      {month.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Día */}
            <View style={styles.pickerSection}>
              <Text style={styles.pickerLabel}>Día</Text>
              <ScrollView style={styles.pickerScroll} showsVerticalScrollIndicator={false}>
                {days.map((day) => (
                  <TouchableOpacity
                    key={day}
                    style={[
                      styles.pickerOption,
                      selectedDay === day && styles.pickerOptionSelected
                    ]}
                    onPress={() => setSelectedDay(day)}
                  >
                    <Text style={[
                      styles.pickerOptionText,
                      selectedDay === day && styles.pickerOptionTextSelected
                    ]}>
                      {day}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>

          <View style={styles.datePickerActions}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
              <Text style={styles.confirmButtonText}>Confirmar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// Componente nativo para time picker
const NativeTimePicker: React.FC<{
  visible: boolean;
  onClose: () => void;
  onTimeSelect: (time: string) => void;
  currentTime?: string;
}> = ({ visible, onClose, onTimeSelect, currentTime }) => {
  const [selectedHour, setSelectedHour] = useState(
    currentTime ? parseInt(currentTime.split(':')[0]) : 12
  );
  const [selectedMinute, setSelectedMinute] = useState(
    currentTime ? parseInt(currentTime.split(':')[1]) : 0
  );

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  const handleConfirm = () => {
    const timeString = `${selectedHour.toString().padStart(2, '0')}:${selectedMinute.toString().padStart(2, '0')}`;
    onTimeSelect(timeString);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.timePickerContainer}>
          <View style={styles.timePickerHeader}>
            <Text style={styles.timePickerTitle}>Seleccionar Hora</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.timePickerContent}>
            {/* Horas */}
            <View style={styles.pickerSection}>
              <Text style={styles.pickerLabel}>Hora</Text>
              <ScrollView style={styles.pickerScroll} showsVerticalScrollIndicator={false}>
                {hours.map((hour) => (
                  <TouchableOpacity
                    key={hour}
                    style={[
                      styles.pickerOption,
                      selectedHour === hour && styles.pickerOptionSelected
                    ]}
                    onPress={() => setSelectedHour(hour)}
                  >
                    <Text style={[
                      styles.pickerOptionText,
                      selectedHour === hour && styles.pickerOptionTextSelected
                    ]}>
                      {hour.toString().padStart(2, '0')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Minutos */}
            <View style={styles.pickerSection}>
              <Text style={styles.pickerLabel}>Minuto</Text>
              <ScrollView style={styles.pickerScroll} showsVerticalScrollIndicator={false}>
                {minutes.map((minute) => (
                  <TouchableOpacity
                    key={minute}
                    style={[
                      styles.pickerOption,
                      selectedMinute === minute && styles.pickerOptionSelected
                    ]}
                    onPress={() => setSelectedMinute(minute)}
                  >
                    <Text style={[
                      styles.pickerOptionText,
                      selectedMinute === minute && styles.pickerOptionTextSelected
                    ]}>
                      {minute.toString().padStart(2, '0')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>

          <View style={styles.timePickerActions}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
              <Text style={styles.confirmButtonText}>Confirmar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const MusicianRequestForm: React.FC<Props> = ({ onSubmit, isLoading = false }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [showEventTypePicker, setShowEventTypePicker] = useState(false);
  const [showInstrumentPicker, setShowInstrumentPicker] = useState(false);
  const [flyerImage, setFlyerImage] = useState<string | undefined>();

  // Estados del formulario
  const [formData, setFormData] = useState<MusicianRequestFormValues>({
    eventName: '',
    eventType: '',
    eventDate: new Date(),
    startTime: '',
    endTime: '',
    location: '',
    instrumentType: '',
    eventDescription: '',
    flyerImage: undefined,
  });

  const [errors, setErrors] = useState<Partial<MusicianRequestFormValues>>({});

  // Opciones para los pickers
  const eventTypeOptions = [
    { label: 'Culto', value: 'culto' },
    { label: 'Campaña dentro del templo', value: 'campana_dentro_templo' },
    { label: 'Otro', value: 'otro' }
  ];

  const instrumentOptions = [
    'Piano', 'Guitarra', 'Bajo', 'Batería', 'Teclado', 
    'Saxofón', 'Trompeta', 'Violín', 'Flauta', 'Vocalista', 'Coro', 'Otro'
  ].map(instrument => ({ label: instrument, value: instrument }));

  const totalSteps = 6;

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permisos', 'Se necesitan permisos para acceder a la galería');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setFlyerImage(result.assets[0].uri);
      setFormData(prev => ({ ...prev, flyerImage: result.assets[0].uri }));
    }
  };

  const calculatePrice = (startTime: string, endTime: string, eventType: string): number => {
    if (!startTime || !endTime || !eventType) return 0;

    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    
    let startMinutes = startHour * 60 + startMinute;
    let endMinutes = endHour * 60 + endMinute;
    
    if (endMinutes < startMinutes) {
      endMinutes += 24 * 60;
    }
    
    const totalMinutes = endMinutes - startMinutes;
    const totalHours = totalMinutes / 60;
    
    const pricingRules = {
      culto: { basePrice: 800, additionalHourPrice: 650 },
      campana_dentro_templo: { basePrice: 1200, additionalHourPrice: 850 },
      otro: { basePrice: 1000, additionalHourPrice: 750 }
    };

    const rules = pricingRules[eventType as keyof typeof pricingRules] || pricingRules.culto;
    const baseHours = 2;
    const basePrice = rules.basePrice;
    
    if (totalHours <= baseHours) {
      return basePrice;
    }
    
    const additionalHours = totalHours - baseHours;
    const additionalMinutes = (additionalHours - Math.floor(additionalHours)) * 60;
    
    let additionalPrice = 0;
    
    if (Math.floor(additionalHours) > 0) {
      additionalPrice += Math.floor(additionalHours) * rules.additionalHourPrice;
    }
    
    if (additionalMinutes > 10) {
      additionalPrice += (additionalMinutes / 60) * rules.additionalHourPrice;
    }
    
    return basePrice + additionalPrice;
  };

  const updateFormData = (field: keyof MusicianRequestFormValues, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateCurrentStep = (): boolean => {
    const newErrors: Partial<MusicianRequestFormValues> = {};

    switch (currentStep) {
      case 1: // Nombre del evento
        if (!formData.eventName.trim()) {
          newErrors.eventName = 'Nombre del evento es requerido';
        } else if (formData.eventName.length < 3) {
          newErrors.eventName = 'Mínimo 3 caracteres';
        }
        break;
      case 2: // Tipo de evento
        if (!formData.eventType) {
          newErrors.eventType = 'Tipo de evento es requerido';
        }
        break;
      case 3: // Fecha y horarios
        if (!formData.startTime) {
          newErrors.startTime = 'Hora de inicio es requerida';
        }
        if (!formData.endTime) {
          newErrors.endTime = 'Hora de fin es requerida';
        }
        if (formData.startTime && formData.endTime && formData.startTime >= formData.endTime) {
          newErrors.endTime = 'La hora de fin debe ser después de la hora de inicio';
        }
        break;
      case 4: // Ubicación
        if (!formData.location.trim()) {
          newErrors.location = 'Ubicación es requerida';
        } else if (formData.location.length < 5) {
          newErrors.location = 'Mínimo 5 caracteres';
        }
        break;
      case 5: // Instrumento y descripción
        if (!formData.instrumentType) {
          newErrors.instrumentType = 'Tipo de instrumento es requerido';
        }
        if (!formData.eventDescription.trim()) {
          newErrors.eventDescription = 'Descripción es requerida';
        } else if (formData.eventDescription.length < 10) {
          newErrors.eventDescription = 'Mínimo 10 caracteres';
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

  const handleSubmit = () => {
    const calculatedPrice = calculatePrice(formData.startTime, formData.endTime, formData.eventType);
    onSubmit(formData, calculatedPrice);
  };

  const formatTime = (time: string) => {
    return time || 'Seleccionar hora';
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getEventTypeLabel = (value: string) => {
    return eventTypeOptions.find(option => option.value === value)?.label || 'Seleccionar tipo';
  };

  const getInstrumentLabel = (value: string) => {
    return value || 'Seleccionar instrumento';
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <StepContainer
            title="Nombre del Evento"
            subtitle="¿Cómo se llama tu evento?"
            onNext={handleNext}
            onBack={handleBack}
            isFirstStep={true}
            isLastStep={false}
            canProceed={!!formData.eventName.trim()}
          >
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Nombre del Evento</Text>
              <TextInput
                style={[styles.modernInput, errors.eventName && styles.inputError]}
                value={formData.eventName}
                onChangeText={(value) => updateFormData('eventName', value)}
                placeholder="Ej: Culto de Domingo"
                placeholderTextColor="#999"
              />
              {errors.eventName && (
                <Text style={styles.errorText}>{errors.eventName}</Text>
              )}
            </View>
          </StepContainer>
        );

      case 2:
        return (
          <StepContainer
            title="Tipo de Evento"
            subtitle="¿Qué tipo de evento vas a realizar?"
            onNext={handleNext}
            onBack={handleBack}
            isFirstStep={false}
            isLastStep={false}
            canProceed={!!formData.eventType}
          >
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Tipo de Evento</Text>
              <TouchableOpacity
                style={[styles.modernPickerButton, errors.eventType && styles.inputError]}
                onPress={() => setShowEventTypePicker(true)}
              >
                <Text style={styles.pickerButtonText}>
                  {getEventTypeLabel(formData.eventType)}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#666" />
              </TouchableOpacity>
              {errors.eventType && (
                <Text style={styles.errorText}>{errors.eventType}</Text>
              )}
            </View>
          </StepContainer>
        );

      case 3:
        return (
          <StepContainer
            title="Fecha y Horarios"
            subtitle="¿Cuándo y a qué hora será tu evento?"
            onNext={handleNext}
            onBack={handleBack}
            isFirstStep={false}
            isLastStep={false}
            canProceed={!!formData.startTime && !!formData.endTime}
          >
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Fecha del Evento</Text>
              <TouchableOpacity
                style={styles.modernPickerButton}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={styles.pickerButtonText}>{formatDate(formData.eventDate)}</Text>
                <Ionicons name="calendar" size={20} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.timeInputsContainer}>
              <View style={styles.timeInput}>
                <Text style={styles.inputLabel}>Hora de Inicio</Text>
                <TouchableOpacity
                  style={[styles.modernPickerButton, errors.startTime && styles.inputError]}
                  onPress={() => setShowStartTimePicker(true)}
                >
                  <Text style={styles.pickerButtonText}>{formatTime(formData.startTime)}</Text>
                  <Ionicons name="time" size={20} color="#666" />
                </TouchableOpacity>
                {errors.startTime && (
                  <Text style={styles.errorText}>{errors.startTime}</Text>
                )}
              </View>

              <View style={styles.timeInput}>
                <Text style={styles.inputLabel}>Hora de Fin</Text>
                <TouchableOpacity
                  style={[styles.modernPickerButton, errors.endTime && styles.inputError]}
                  onPress={() => setShowEndTimePicker(true)}
                >
                  <Text style={styles.pickerButtonText}>{formatTime(formData.endTime)}</Text>
                  <Ionicons name="time" size={20} color="#666" />
                </TouchableOpacity>
                {errors.endTime && (
                  <Text style={styles.errorText}>{errors.endTime}</Text>
                )}
              </View>
            </View>
          </StepContainer>
        );

      case 4:
        return (
          <StepContainer
            title="Ubicación"
            subtitle="¿Dónde se realizará tu evento?"
            onNext={handleNext}
            onBack={handleBack}
            isFirstStep={false}
            isLastStep={false}
            canProceed={!!formData.location.trim()}
          >
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Ubicación</Text>
              <TextInput
                style={[styles.modernInput, errors.location && styles.inputError]}
                value={formData.location}
                onChangeText={(value) => updateFormData('location', value)}
                placeholder="Ej: Iglesia Central, Santo Domingo"
                placeholderTextColor="#999"
              />
              {errors.location && (
                <Text style={styles.errorText}>{errors.location}</Text>
              )}
            </View>
          </StepContainer>
        );

      case 5:
        return (
          <StepContainer
            title="Detalles del Evento"
            subtitle="Cuéntanos más sobre tu evento"
            onNext={handleNext}
            onBack={handleBack}
            isFirstStep={false}
            isLastStep={false}
            canProceed={!!formData.instrumentType && !!formData.eventDescription.trim()}
          >
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Instrumento Requerido</Text>
              <TouchableOpacity
                style={[styles.modernPickerButton, errors.instrumentType && styles.inputError]}
                onPress={() => setShowInstrumentPicker(true)}
              >
                <Text style={styles.pickerButtonText}>
                  {getInstrumentLabel(formData.instrumentType)}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#666" />
              </TouchableOpacity>
              {errors.instrumentType && (
                <Text style={styles.errorText}>{errors.instrumentType}</Text>
              )}
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Descripción del Evento</Text>
              <TextInput
                style={[styles.modernTextArea, errors.eventDescription && styles.inputError]}
                value={formData.eventDescription}
                onChangeText={(value) => updateFormData('eventDescription', value)}
                placeholder="Describe el evento, tipo de música, ambiente..."
                placeholderTextColor="#999"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
              {errors.eventDescription && (
                <Text style={styles.errorText}>{errors.eventDescription}</Text>
              )}
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Flyer del Evento (Opcional)</Text>
              <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
                {flyerImage ? (
                  <Image source={{ uri: flyerImage }} style={styles.selectedImage} />
                ) : (
                  <View style={styles.imagePlaceholder}>
                    <Ionicons name="image-outline" size={40} color="#666" />
                    <Text style={styles.imagePlaceholderText}>Seleccionar Flyer</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </StepContainer>
        );

      case 6:
        return (
          <StepContainer
            title="Confirmar Solicitud"
            subtitle="Revisa todos los datos antes de enviar"
            onNext={handleSubmit}
            onBack={handleBack}
            isFirstStep={false}
            isLastStep={true}
            canProceed={true}
          >
            <View style={styles.confirmationContainer}>
              <View style={styles.confirmationCard}>
                <Text style={styles.confirmationTitle}>Resumen de tu Solicitud</Text>
                
                <View style={styles.confirmationItem}>
                  <Text style={styles.confirmationLabel}>Evento:</Text>
                  <Text style={styles.confirmationValue}>{formData.eventName}</Text>
                </View>
                
                <View style={styles.confirmationItem}>
                  <Text style={styles.confirmationLabel}>Tipo:</Text>
                  <Text style={styles.confirmationValue}>{getEventTypeLabel(formData.eventType)}</Text>
                </View>
                
                <View style={styles.confirmationItem}>
                  <Text style={styles.confirmationLabel}>Fecha:</Text>
                  <Text style={styles.confirmationValue}>{formatDate(formData.eventDate)}</Text>
                </View>
                
                <View style={styles.confirmationItem}>
                  <Text style={styles.confirmationLabel}>Horario:</Text>
                  <Text style={styles.confirmationValue}>
                    {formData.startTime} - {formData.endTime}
                  </Text>
                </View>
                
                <View style={styles.confirmationItem}>
                  <Text style={styles.confirmationLabel}>Ubicación:</Text>
                  <Text style={styles.confirmationValue}>{formData.location}</Text>
                </View>
                
                <View style={styles.confirmationItem}>
                  <Text style={styles.confirmationLabel}>Instrumento:</Text>
                  <Text style={styles.confirmationValue}>{formData.instrumentType}</Text>
                </View>
                
                <View style={styles.confirmationItem}>
                  <Text style={styles.confirmationLabel}>Descripción:</Text>
                  <Text style={styles.confirmationValue}>{formData.eventDescription}</Text>
                </View>
              </View>

              {formData.startTime && formData.endTime && formData.eventType && (
                <View style={styles.priceCard}>
                  <Text style={styles.priceLabel}>Precio Calculado:</Text>
                  <Text style={styles.priceValue}>
                    RD$ {calculatePrice(formData.startTime, formData.endTime, formData.eventType).toLocaleString()}
                  </Text>
                </View>
              )}
            </View>
          </StepContainer>
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.gradientBackground}
      />
      
      <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
      
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {renderStep()}
      </ScrollView>

      {/* Pickers */}
      <NativeDatePicker
        visible={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        onDateSelect={(date) => {
          updateFormData('eventDate', date);
        }}
        currentDate={formData.eventDate}
      />

      <NativeTimePicker
        visible={showStartTimePicker}
        onClose={() => setShowStartTimePicker(false)}
        onTimeSelect={(time) => {
          updateFormData('startTime', time);
        }}
        currentTime={formData.startTime}
      />

      <NativeTimePicker
        visible={showEndTimePicker}
        onClose={() => setShowEndTimePicker(false)}
        onTimeSelect={(time) => {
          updateFormData('endTime', time);
        }}
        currentTime={formData.endTime}
      />

      <NativePicker
        visible={showEventTypePicker}
        onClose={() => setShowEventTypePicker(false)}
        onSelect={(value) => {
          updateFormData('eventType', value);
        }}
        options={eventTypeOptions}
        title="Seleccionar Tipo de Evento"
      />

      <NativePicker
        visible={showInstrumentPicker}
        onClose={() => setShowInstrumentPicker(false)}
        onSelect={(value) => {
          updateFormData('instrumentType', value);
        }}
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
  progressContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 2,
  },
  progressText: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
    opacity: 0.8,
  },
  scrollContainer: {
    flex: 1,
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
    color: '#fff',
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 22,
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
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  nextButtonDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  nextButtonText: {
    color: '#667eea',
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
    color: '#fff',
    marginBottom: 8,
  },
  modernInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderWidth: 0,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#333',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modernTextArea: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderWidth: 0,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#333',
    minHeight: 120,
    textAlignVertical: 'top',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modernPickerButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderWidth: 0,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  pickerButtonText: {
    fontSize: 16,
    color: '#333',
  },
  inputError: {
    borderColor: '#ff4444',
    borderWidth: 1,
  },
  errorText: {
    color: '#ff4444',
    fontSize: 12,
    marginTop: 4,
  },
  timeInputsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeInput: {
    flex: 1,
    marginRight: 10,
  },
  imagePickerButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderWidth: 0,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
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
    color: '#666',
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
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6.27,
    elevation: 8,
  },
  confirmationTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  confirmationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  confirmationLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    flex: 1,
  },
  confirmationValue: {
    fontSize: 14,
    color: '#333',
    flex: 2,
    textAlign: 'right',
  },
  priceCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6.27,
    elevation: 8,
  },
  priceLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  priceValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
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
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  optionItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  // Date picker styles
  datePickerContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  datePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  datePickerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  datePickerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  pickerSection: {
    flex: 1,
    marginHorizontal: 5,
  },
  pickerLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  pickerScroll: {
    height: 200,
  },
  pickerOption: {
    padding: 12,
    alignItems: 'center',
    borderRadius: 8,
    marginVertical: 2,
  },
  pickerOptionSelected: {
    backgroundColor: '#2196f3',
  },
  pickerOptionText: {
    fontSize: 16,
    color: '#333',
  },
  pickerOptionTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  datePickerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  // Time picker styles
  timePickerContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  timePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  timePickerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  timePickerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  timePickerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    padding: 12,
    marginRight: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
  },
  confirmButton: {
    flex: 1,
    padding: 12,
    marginLeft: 10,
    borderRadius: 8,
    backgroundColor: '#2196f3',
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default MusicianRequestForm; 