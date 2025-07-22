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
import { useTheme } from '@contexts/ThemeContext';

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
  const { theme } = useTheme();
  const progress = (currentStep / totalSteps) * 100;

  const styles = getProgressBarStyles(theme);
  
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

const getProgressBarStyles = (theme: any) => ({
  progressContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  progressBar: {
    height: 4,
    backgroundColor: theme.colors.background.secondary,
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: 4, // Cambiado de '100%' a 4 (igual que progressBar)
    backgroundColor: theme.colors.primary[500],
    borderRadius: 2,
  },
  progressText: {
    color: theme.colors.text.secondary,
    fontSize: 12,
    textAlign: 'center' as const,
    opacity: 0.8,
  },
});

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
}> = ({ title, subtitle, children, onNext, onBack, isFirstStep, isLastStep, canProceed }) => {
  const { theme } = useTheme();
  const styles = getStepContainerStyles(theme);
  return (
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
            <Ionicons name="arrow-back" size={20} color={theme.colors.text.secondary} />
            <Text style={styles.backButtonText}>Anterior</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity 
          style={[styles.nextButton, { backgroundColor: canProceed ? theme.colors.primary[500] : theme.colors.primary[100], shadowColor: theme.shadows.medium.shadowColor }]} 
          onPress={onNext}
          disabled={!canProceed}
        >
          <Text style={styles.nextButtonText}>
            {isLastStep ? 'Confirmar' : 'Siguiente'}
          </Text>
          <Ionicons 
            name={isLastStep ? "checkmark" : "arrow-forward"} 
            size={20} 
            color={theme.colors.text.inverse} 
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const getStepContainerStyles = (theme: any) => ({
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
    fontWeight: 'bold' as const,
    color: theme.colors.text.primary,
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 16,
    color: theme.colors.text.secondary,
    lineHeight: 22,
  },
  stepContent: {
    flex: 1,
  },
  stepActions: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    paddingVertical: 20,
  },
  backButton: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  backButtonText: {
    color: theme.colors.text.secondary,
    fontSize: 16,
    marginLeft: 8,
  },
  nextButton: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: theme.colors.primary[500],
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  nextButtonText: {
    color: theme.colors.text.inverse,
    fontSize: 16,
    fontWeight: '600' as const,
    marginRight: 8,
  },
});

// Componente nativo para selección de opciones
const NativePicker: React.FC<{
  visible: boolean;
  onClose: () => void;
  onSelect: (value: string) => void;
  options: { label: string; value: string }[];
  title: string;
}> = ({ visible, onClose, onSelect, options, title }) => {
  const { theme } = useTheme();
  const styles = getNativePickerStyles(theme);
  return (
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
              <Ionicons name="close" size={24} color={theme.colors.text.secondary} />
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
};

const getNativePickerStyles = (theme: any) => ({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end' as const,
  },
  modalContent: {
    backgroundColor: theme.colors.background.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%' as any,
  },
  modalHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.secondary,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: theme.colors.text.primary,
  },
  optionItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.secondary,
  },
  optionText: {
    fontSize: 16,
    color: theme.colors.text.primary,
  },
});

// Componente nativo para date picker
const NativeDatePicker: React.FC<{
  visible: boolean;
  onClose: () => void;
  onDateSelect: (date: Date) => void;
  currentDate: Date;
}> = ({ visible, onClose, onDateSelect, currentDate }) => {
  const { theme } = useTheme();
  const styles = getNativeDatePickerStyles(theme);
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
              <Ionicons name="close" size={24} color={theme.colors.text.secondary} />
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

const getNativeDatePickerStyles = (theme: any) => ({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end' as const,
  },
  datePickerContainer: {
    backgroundColor: theme.colors.background.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%' as any,
  },
  datePickerHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: 20,
  },
  datePickerTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: theme.colors.text.primary,
  },
  datePickerContent: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    marginBottom: 20,
  },
  pickerSection: {
    flex: 1,
    marginHorizontal: 5,
  },
  pickerLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: theme.colors.text.secondary,
    textAlign: 'center' as const,
    marginBottom: 10,
  },
  pickerScroll: {
    height: 200,
  },
  pickerOption: {
    padding: 12,
    alignItems: 'center' as const,
    borderRadius: 8,
    marginVertical: 2,
  },
  pickerOptionSelected: {
    backgroundColor: theme.colors.primary[100],
  },
  pickerOptionText: {
    fontSize: 16,
    color: theme.colors.text.primary,
  },
  pickerOptionTextSelected: {
    color: theme.colors.text.inverse,
    fontWeight: '600' as const,
  },
  datePickerActions: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
  },
  cancelButton: {
    flex: 1,
    padding: 12,
    marginRight: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border.secondary,
    alignItems: 'center' as const,
  },
  cancelButtonText: {
    color: theme.colors.text.secondary,
    fontSize: 16,
  },
  confirmButton: {
    flex: 1,
    padding: 12,
    marginLeft: 10,
    borderRadius: 8,
    backgroundColor: theme.colors.primary[500],
    alignItems: 'center' as const,
  },
  confirmButtonText: {
    color: theme.colors.text.inverse,
    fontSize: 16,
    fontWeight: '600' as const,
  },
});

// Componente nativo para time picker
const NativeTimePicker: React.FC<{
  visible: boolean;
  onClose: () => void;
  onTimeSelect: (time: string) => void;
  currentTime?: string;
}> = ({ visible, onClose, onTimeSelect, currentTime }) => {
  const { theme } = useTheme();
  const styles = getNativeTimePickerStyles(theme);
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
              <Ionicons name="close" size={24} color={theme.colors.text.secondary} />
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

const getNativeTimePickerStyles = (theme: any) => ({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end' as const,
  },
  timePickerContainer: {
    backgroundColor: theme.colors.background.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%' as any,
  },
  timePickerHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: 20,
  },
  timePickerTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: theme.colors.text.primary,
  },
  timePickerContent: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    marginBottom: 20,
  },
  pickerSection: {
    flex: 1,
    marginHorizontal: 5,
  },
  pickerLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: theme.colors.text.secondary,
    textAlign: 'center' as const,
    marginBottom: 10,
  },
  pickerScroll: {
    height: 200,
  },
  pickerOption: {
    padding: 12,
    alignItems: 'center' as const,
    borderRadius: 8,
    marginVertical: 2,
  },
  pickerOptionSelected: {
    backgroundColor: theme.colors.primary[100],
  },
  pickerOptionText: {
    fontSize: 16,
    color: theme.colors.text.primary,
  },
  pickerOptionTextSelected: {
    color: theme.colors.text.inverse,
    fontWeight: '600' as const,
  },
  timePickerActions: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
  },
  cancelButton: {
    flex: 1,
    padding: 12,
    marginRight: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border.secondary,
    alignItems: 'center' as const,
  },
  cancelButtonText: {
    color: theme.colors.text.secondary,
    fontSize: 16,
  },
  confirmButton: {
    flex: 1,
    padding: 12,
    marginLeft: 10,
    borderRadius: 8,
    backgroundColor: theme.colors.primary[500],
    alignItems: 'center' as const,
  },
  confirmButtonText: {
    color: theme.colors.text.inverse,
    fontSize: 16,
    fontWeight: '600' as const,
  },
});

const getFormStyles = (theme: any) => ({
  inputWrapper: {
    marginBottom: 25,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: theme.colors.text.primary,
    marginBottom: 8,
  },
  modernInput: {
    backgroundColor: theme.colors.background.card,
    borderWidth: 0,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: theme.colors.text.primary,
    shadowColor: theme.shadows.small.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modernTextArea: {
    backgroundColor: theme.colors.background.card,
    borderWidth: 0,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: theme.colors.text.primary,
    minHeight: 120,
    textAlignVertical: 'top' as const,
    shadowColor: theme.shadows.small.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modernPickerButton: {
    backgroundColor: theme.colors.background.card,
    borderWidth: 0,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    shadowColor: theme.shadows.small.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  pickerButtonText: {
    fontSize: 16,
    color: theme.colors.text.primary,
  },
  inputError: {
    borderColor: theme.colors.border.error,
    borderWidth: 1,
  },
  errorText: {
    color: theme.colors.text.error,
    fontSize: 12,
    marginTop: 4,
  },
  timeInputsContainer: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
  },
  timeInput: {
    flex: 1,
    marginRight: 10,
  },
  imagePickerButton: {
    backgroundColor: theme.colors.background.card,
    borderWidth: 0,
    borderRadius: 12,
    overflow: 'hidden' as const,
    shadowColor: theme.shadows.small.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  imagePlaceholder: {
    padding: 40,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  imagePlaceholderText: {
    marginTop: 8,
    fontSize: 14,
    color: theme.colors.text.secondary,
  },
  selectedImage: {
    width: '100%' as any,
    height: 200,
    resizeMode: 'cover' as const,
  },
  confirmationContainer: {
    flex: 1,
  },
  confirmationCard: {
    backgroundColor: theme.colors.background.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: theme.shadows.small.shadowColor,
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.1,
    shadowRadius: 6.27,
    elevation: 8,
  },
  confirmationTitle: {
    fontSize: 20,
    fontWeight: 'bold' as const,
    color: theme.colors.text.primary,
    marginBottom: 20,
    textAlign: 'center' as const,
  },
  confirmationItem: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.secondary,
  },
  confirmationLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: theme.colors.text.secondary,
    flex: 1,
  },
  confirmationValue: {
    fontSize: 14,
    color: theme.colors.text.primary,
    flex: 2,
    textAlign: 'right' as const,
  },
  priceCard: {
    backgroundColor: theme.colors.background.card,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center' as const,
    shadowColor: theme.shadows.small.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6.27,
    elevation: 8,
  },
  priceLabel: {
    fontSize: 16,
    color: theme.colors.text.secondary,
    marginBottom: 8,
  },
  priceValue: {
    fontSize: 28,
    fontWeight: 'bold' as const,
    color: theme.colors.text.success,
  },
});

const MusicianRequestForm: React.FC<Props> = ({ onSubmit, isLoading = false }) => {
  const { theme } = useTheme();
  const formStyles = getFormStyles(theme);
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
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        setFlyerImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'No se pudo seleccionar la imagen');
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
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10 }}>
              {['Boda', 'Concierto', 'Cumpleaños', 'Culto', 'Evento Corporativo', 'Fiesta', 'Reunión', 'Otro'].map(suggestion => (
                <TouchableOpacity
                  key={suggestion}
                  style={{ backgroundColor: theme.colors.primary[100], borderRadius: 16, paddingHorizontal: 14, paddingVertical: 6, marginRight: 8, marginBottom: 8 }}
                  onPress={() => updateFormData('eventName', suggestion)}
                >
                  <Text style={{ color: theme.colors.primary[700], fontWeight: '600' }}>{suggestion}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={formStyles.inputWrapper}>
              <Text style={formStyles.inputLabel}>Nombre del Evento</Text>
              <TextInput
                style={[formStyles.modernInput, errors.eventName && formStyles.inputError]}
                value={formData.eventName}
                onChangeText={(value) => updateFormData('eventName', value)}
                placeholder="Ej: Culto de Domingo"
                placeholderTextColor={theme.colors.text.tertiary}
              />
              {errors.eventName && (
                <Text style={formStyles.errorText}>{errors.eventName}</Text>
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
            <View style={formStyles.inputWrapper}>
              <Text style={formStyles.inputLabel}>Tipo de Evento</Text>
              <TouchableOpacity
                style={[formStyles.modernPickerButton, errors.eventType && formStyles.inputError]}
                onPress={() => setShowEventTypePicker(true)}
              >
                <Text style={formStyles.pickerButtonText}>
                  {getEventTypeLabel(formData.eventType)}
                </Text>
                <Ionicons name="chevron-down" size={20} color={theme.colors.text.secondary} />
              </TouchableOpacity>
              {errors.eventType && (
                <Text style={formStyles.errorText}>{errors.eventType}</Text>
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
            <View style={formStyles.inputWrapper}>
              <Text style={formStyles.inputLabel}>Fecha del Evento</Text>
              <TouchableOpacity
                style={formStyles.modernPickerButton}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={formStyles.pickerButtonText}>{formatDate(formData.eventDate)}</Text>
                <Ionicons name="calendar" size={20} color={theme.colors.text.secondary} />
              </TouchableOpacity>
            </View>

            <View style={formStyles.timeInputsContainer}>
              <View style={formStyles.timeInput}>
                <Text style={formStyles.inputLabel}>Hora de Inicio</Text>
                <TouchableOpacity
                  style={[formStyles.modernPickerButton, errors.startTime && formStyles.inputError]}
                  onPress={() => setShowStartTimePicker(true)}
                >
                  <Text style={formStyles.pickerButtonText}>{formatTime(formData.startTime)}</Text>
                  <Ionicons name="time" size={20} color={theme.colors.text.secondary} />
                </TouchableOpacity>
                {errors.startTime && (
                  <Text style={formStyles.errorText}>{errors.startTime}</Text>
                )}
              </View>

              <View style={formStyles.timeInput}>
                <Text style={formStyles.inputLabel}>Hora de Fin</Text>
                <TouchableOpacity
                  style={[formStyles.modernPickerButton, errors.endTime && formStyles.inputError]}
                  onPress={() => setShowEndTimePicker(true)}
                >
                  <Text style={formStyles.pickerButtonText}>{formatTime(formData.endTime)}</Text>
                  <Ionicons name="time" size={20} color={theme.colors.text.secondary} />
                </TouchableOpacity>
                {errors.endTime && (
                  <Text style={formStyles.errorText}>{errors.endTime}</Text>
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
            <View style={formStyles.inputWrapper}>
              <Text style={formStyles.inputLabel}>Ubicación</Text>
              <TextInput
                style={[formStyles.modernInput, errors.location && formStyles.inputError]}
                value={formData.location}
                onChangeText={(value) => updateFormData('location', value)}
                placeholder="Ej: Iglesia Central, Santo Domingo"
                placeholderTextColor={theme.colors.text.tertiary}
              />
              {errors.location && (
                <Text style={formStyles.errorText}>{errors.location}</Text>
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
            <View style={formStyles.inputWrapper}>
              <Text style={formStyles.inputLabel}>Instrumento Requerido</Text>
              <TouchableOpacity
                style={[formStyles.modernPickerButton, errors.instrumentType && formStyles.inputError]}
                onPress={() => setShowInstrumentPicker(true)}
              >
                <Text style={formStyles.pickerButtonText}>
                  {getInstrumentLabel(formData.instrumentType)}
                </Text>
                <Ionicons name="chevron-down" size={20} color={theme.colors.text.secondary} />
              </TouchableOpacity>
              {errors.instrumentType && (
                <Text style={formStyles.errorText}>{errors.instrumentType}</Text>
              )}
            </View>

            <View style={formStyles.inputWrapper}>
              <Text style={formStyles.inputLabel}>Descripción del Evento</Text>
              <TextInput
                style={[formStyles.modernTextArea, errors.eventDescription && formStyles.inputError]}
                value={formData.eventDescription}
                onChangeText={(value) => updateFormData('eventDescription', value)}
                placeholder="Describe el evento, tipo de música, ambiente..."
                placeholderTextColor={theme.colors.text.tertiary}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
              {errors.eventDescription && (
                <Text style={formStyles.errorText}>{errors.eventDescription}</Text>
              )}
            </View>

            <View style={formStyles.inputWrapper}>
              <Text style={formStyles.inputLabel}>Flyer del Evento (Opcional)</Text>
              <TouchableOpacity style={formStyles.imagePickerButton} onPress={pickImage}>
                {flyerImage ? (
                  <Image source={{ uri: flyerImage }} style={formStyles.selectedImage} />
                ) : (
                  <View style={formStyles.imagePlaceholder}>
                    <Ionicons name="image-outline" size={40} color={theme.colors.text.secondary} />
                    <Text style={formStyles.imagePlaceholderText}>Seleccionar Flyer</Text>
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
            <View style={formStyles.confirmationContainer}>
              <View style={formStyles.confirmationCard}>
                <Text style={formStyles.confirmationTitle}>Resumen de tu Solicitud</Text>
                
                <View style={formStyles.confirmationItem}>
                  <Text style={formStyles.confirmationLabel}>Evento:</Text>
                  <Text style={formStyles.confirmationValue}>{formData.eventName}</Text>
                </View>
                
                <View style={formStyles.confirmationItem}>
                  <Text style={formStyles.confirmationLabel}>Tipo:</Text>
                  <Text style={formStyles.confirmationValue}>{getEventTypeLabel(formData.eventType)}</Text>
                </View>
                
                <View style={formStyles.confirmationItem}>
                  <Text style={formStyles.confirmationLabel}>Fecha:</Text>
                  <Text style={formStyles.confirmationValue}>{formatDate(formData.eventDate)}</Text>
                </View>
                
                <View style={formStyles.confirmationItem}>
                  <Text style={formStyles.confirmationLabel}>Horario:</Text>
                  <Text style={formStyles.confirmationValue}>
                    {formData.startTime} - {formData.endTime}
                  </Text>
                </View>
                
                <View style={formStyles.confirmationItem}>
                  <Text style={formStyles.confirmationLabel}>Ubicación:</Text>
                  <Text style={formStyles.confirmationValue}>{formData.location}</Text>
                </View>
                
                <View style={formStyles.confirmationItem}>
                  <Text style={formStyles.confirmationLabel}>Instrumento:</Text>
                  <Text style={formStyles.confirmationValue}>{formData.instrumentType}</Text>
                </View>
                
                <View style={formStyles.confirmationItem}>
                  <Text style={formStyles.confirmationLabel}>Descripción:</Text>
                  <Text style={formStyles.confirmationValue}>{formData.eventDescription}</Text>
                </View>
              </View>

              {formData.startTime && formData.endTime && formData.eventType && (
                <View style={formStyles.priceCard}>
                  <Text style={formStyles.priceLabel}>Precio Calculado:</Text>
                  <Text style={formStyles.priceValue}>
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

  const getMainStyles = (theme: any) => ({
    container: {
      flex: 1,
    },
    gradientBackground: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      // backgroundColor eliminado, LinearGradient ya aplica el gradiente
    },
    scrollContainer: {
      flex: 1,
    },
  });

  return (
    <View style={[getMainStyles(theme).container, { backgroundColor: theme.colors.background.primary }] }>
      <Text style={{ color: theme.colors.text.primary, fontSize: 18, textAlign: 'center', marginTop: 24 }}>DEBUG: Dentro del formulario</Text>
      
      <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
      
      <ScrollView style={getMainStyles(theme).scrollContainer} showsVerticalScrollIndicator={false}>
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
    height: 4, // Cambiado de '100%' a 4 (igual que progressBar)
    backgroundColor: '#fff',
    borderRadius: 2,
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
    maxHeight: '70%' as any,
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