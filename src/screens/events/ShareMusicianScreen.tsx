import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  Alert, 
  ActivityIndicator,
  Modal,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Image,
  Animated,
  Dimensions
} from 'react-native';
import { useTheme } from '@contexts/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { requestService } from '@services/requests';
import { CreateRequestData } from '@services/requests';
import DateTimePicker from '@react-native-community/datetimepicker';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

interface ShareMusicianScreenProps {
  navigation: any;
}

interface FormData {
  requestName: string;
  requestType: string;
  date: string;
  initTime: string;
  fineTime: string;
  location: {
    address: string;
    city: string;
    latitude: number;
    longitude: number;
  };
  duration: number;
  instrument: string;
  budget: string;
  description: string;
  locationDescription: string;
  musicGenre: string;
  guestCount: string;
  specialRequirements: string;
  additionalComments: string;
  minBudget: number;
  maxBudget: number;
  paymentMethod: string;
  paymentTerms: string;
  equipmentIncluded: string;
  budgetNotes: string;
}

const { width, height } = Dimensions.get('window');

// Datos predefinidos para mejorar UX con selección visual
const EVENT_TYPES = [
  { id: 'boda', label: 'requests.event_types.wedding', icon: 'heart', color: '#FF6B9D' },
  { id: 'cumpleanos', label: 'requests.event_types.birthday', icon: 'gift', color: '#4ECDC4' },
  { id: 'evento_corporativo', label: 'requests.event_types.corporate', icon: 'business', color: '#45B7D1' },
  { id: 'concierto', label: 'requests.event_types.concert', icon: 'musical-notes', color: '#96CEB4' },
  { id: 'festival', label: 'requests.event_types.festival', icon: 'people', color: '#FFEAA7' },
  { id: 'fiesta_privada', label: 'requests.event_types.private_party', icon: 'wine', color: '#DDA0DD' },
  { id: 'graduacion', label: 'requests.event_types.graduation', icon: 'school', color: '#98D8C8' },
  { id: 'culto', label: 'requests.event_types.religious', icon: 'business', color: '#F7DC6F' },
  { id: 'otro', label: 'requests.event_types.other', icon: 'ellipsis-horizontal', color: '#BB8FCE' },
];

const INSTRUMENTS = [
  { id: 'guitarra', label: 'requests.instruments.guitar', icon: 'musical-note', color: '#E74C3C' },
  { id: 'piano', label: 'requests.instruments.piano', icon: 'musical-note', color: '#3498DB' },
  { id: 'bajo', label: 'requests.instruments.bass', icon: 'musical-note', color: '#2ECC71' },
  { id: 'bateria', label: 'requests.instruments.drums', icon: 'musical-note', color: '#F39C12' },
  { id: 'saxofon', label: 'requests.instruments.saxophone', icon: 'musical-note', color: '#9B59B6' },
  { id: 'trompeta', label: 'requests.instruments.trumpet', icon: 'musical-note', color: '#E67E22' },
  { id: 'violin', label: 'requests.instruments.violin', icon: 'musical-note', color: '#1ABC9C' },
  { id: 'canto', label: 'requests.instruments.vocals', icon: 'musical-note', color: '#E91E63' },
  { id: 'teclado', label: 'requests.instruments.keyboard', icon: 'musical-note', color: '#607D8B' },
  { id: 'flauta', label: 'requests.instruments.flute', icon: 'musical-note', color: '#795548' },
  { id: 'otro', label: 'requests.instruments.other', icon: 'musical-note', color: '#9E9E9E' },
];

const BUDGET_RANGES = [
  { id: 'low', label: 'requests.budget.low', range: 'RD$ 1,000 - 3,000', value: 2000, color: '#4CAF50' },
  { id: 'medium', label: 'requests.budget.medium', range: 'RD$ 3,000 - 8,000', value: 5500, color: '#FF9800' },
  { id: 'high', label: 'requests.budget.high', range: 'RD$ 8,000 - 15,000', value: 11500, color: '#F44336' },
  { id: 'premium', label: 'requests.budget.premium', range: 'RD$ 15,000+', value: 20000, color: '#9C27B0' },
];

const DURATION_OPTIONS = [
  { id: 60, label: '1 hora', icon: 'time' },
  { id: 120, label: '2 horas', icon: 'time' },
  { id: 180, label: '3 horas', icon: 'time' },
  { id: 240, label: '4 horas', icon: 'time' },
  { id: 300, label: '5 horas', icon: 'time' },
  { id: 360, label: '6 horas', icon: 'time' },
];

// Definir los pasos del formulario
const FORM_STEPS = [
  { id: 'eventName', title: 'requests.steps.event_name', subtitle: 'requests.steps.event_name_subtitle' },
  { id: 'eventType', title: 'requests.steps.event_type', subtitle: 'requests.steps.event_type_subtitle' },
  { id: 'date', title: 'requests.steps.date', subtitle: 'requests.steps.date_subtitle' },
  { id: 'initTime', title: 'requests.steps.initTime', subtitle: 'requests.steps.initTime_subtitle' },
  { id: 'fineTime', title: 'requests.steps.fineTime', subtitle: 'requests.steps.fineTime_subtitle' },
  { id: 'duration', title: 'requests.steps.duration', subtitle: 'requests.steps.duration_subtitle' },
  { id: 'instrument', title: 'requests.steps.instrument', subtitle: 'requests.steps.instrument_subtitle' },
  { id: 'budget', title: 'requests.steps.budget', subtitle: 'requests.steps.budget_subtitle' },
  { id: 'location', title: 'requests.steps.location', subtitle: 'requests.steps.location_subtitle' },
  { id: 'locationDescription', title: 'requests.steps.location_description', subtitle: 'requests.steps.location_description_subtitle' },
  { id: 'description', title: 'requests.steps.description', subtitle: 'requests.steps.description_subtitle' },
];

const ShareMusicianScreen: React.FC<ShareMusicianScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [slideAnim] = useState(new Animated.Value(0));
  const [mapRegion, setMapRegion] = useState({
    latitude: 18.4861, // Santo Domingo
    longitude: -69.9312,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const [selectedLocation, setSelectedLocation] = useState({
    latitude: 18.4861,
    longitude: -69.9312,
    address: '',
    description: '',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    requestName: '',
    requestType: '',
    date: '',
    initTime: '',
    fineTime: '',
    location: {
      address: '',
      city: 'Santo Domingo',
      latitude: 18.4861,
      longitude: -69.9312,
    },
    duration: 120,
    instrument: '',
    budget: '',
    description: '',
    locationDescription: '',
    musicGenre: '',
    guestCount: '0',
    specialRequirements: '',
    additionalComments: '',
    minBudget: 0,
    maxBudget: 0,
    paymentMethod: '',
    paymentTerms: '',
    equipmentIncluded: '',
    budgetNotes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (field: string, value: any): string => {
    switch (field) {
      case 'requestName':
        return !value ? t('requests.validation.event_name_required') : '';
      case 'requestType':
        return !value ? t('requests.validation.event_type_required') : '';
      case 'date':
        return !value ? t('requests.validation.date_required') : '';
      case 'time':
        return !value ? t('requests.validation.time_required') : '';
      case 'location.address':
        return !value ? t('requests.validation.address_required') : '';
      case 'budget':
        return !value ? t('requests.validation.budget_required') : '';
      default:
        return '';
    }
  };

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof FormData] as any),
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
    console.info('./ShareMusicianScreen.tsx line 213');
    console.info(formData.fineTime);
    console.info(formData.initTime);
    // Limpiar error del campo
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Corregido el bug del calendario - usar fecha local en lugar de UTC
  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setSelectedDate(selectedDate);
      // Usar fecha local para evitar problemas de zona horaria
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const dateString = `${year}-${month}-${day}`;
      handleInputChange('date', dateString);
      // Avanzar automáticamente al siguiente paso
      setTimeout(() => nextStep(), 500);
    }
  };

  const handleinitTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setSelectedTime(selectedTime);
      const hours = String(selectedTime.getHours()).padStart(2, '0');
      const minutes = String(selectedTime.getMinutes()).padStart(2, '0');
      const timeString = `${hours}:${minutes}`;
      handleInputChange( "initTime",timeString);
      // Avanzar automáticamente al siguiente paso
      setTimeout(() => nextStep(), 500);
    }
  };
  const handlefineTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setSelectedTime(selectedTime);
      const hours = String(selectedTime.getHours()).padStart(2, '0');
      const minutes = String(selectedTime.getMinutes()).padStart(2, '0');
      const timeString = `${hours}:${minutes}`;
      handleInputChange( "fineTime",timeString);
      // Avanzar automáticamente al siguiente paso
      setTimeout(() => nextStep(), 500);
    }
  };

  const handleMapPress = (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setSelectedLocation({
      latitude,
      longitude,
      address: formData.location.address || t('requests.map.location_selected'),
      description: selectedLocation.description,
    });
    
    // Actualizar el formulario con las coordenadas
    handleInputChange('location.latitude', latitude);
    handleInputChange('location.longitude', longitude);
  };

  const getCurrentLocation = async () => {
    try {
      setIsLoadingLocation(true);
      
      // Solicitar permisos
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          t('common.error'),
          t('requests.map.location_permission_denied')
        );
        return;
      }

      // Obtener ubicación actual
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const { latitude, longitude } = location.coords;
      
      // Obtener dirección
      const addressResponse = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      let address = '';
      if (addressResponse.length > 0) {
        const addressData = addressResponse[0];
        address = [
          addressData.street,
          addressData.district,
          addressData.city,
          addressData.region,
        ].filter(Boolean).join(', ');
      }

      setSelectedLocation({
        latitude,
        longitude,
        address: address || t('requests.map.current_location'),
        description: selectedLocation.description,
      });

      setMapRegion({
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });

      // Actualizar formulario
      handleInputChange('location.latitude', latitude);
      handleInputChange('location.longitude', longitude);
      handleInputChange('location.address', address);

    } catch (error) {
      console.error('Error getting current location:', error);
      Alert.alert(
        t('common.error'),
        t('requests.map.location_error')
      );
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const searchLocation = async () => {
    if (!searchQuery.trim()) return;

    try {
      setIsLoadingLocation(true);
      
      // Geocodificar la búsqueda con región específica para República Dominicana
      const results = await Location.geocodeAsync(searchQuery + ', República Dominicana');
      
      if (results.length > 0) {
        const { latitude, longitude } = results[0];
        
        // Obtener dirección
        const addressResponse = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });

        let address = '';
        if (addressResponse.length > 0) {
          const addressData = addressResponse[0];
          address = [
            addressData.street,
            addressData.district,
            addressData.city,
            addressData.region,
          ].filter(Boolean).join(', ');
        }

        setSelectedLocation({
          latitude,
          longitude,
          address: address || searchQuery,
          description: selectedLocation.description,
        });

        setMapRegion({
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });

        // Actualizar formulario
        handleInputChange('location.latitude', latitude);
        handleInputChange('location.longitude', longitude);
        handleInputChange('location.address', address || searchQuery);

        setSearchQuery('');
      } else {
        // Intentar sin la región específica
        const fallbackResults = await Location.geocodeAsync(searchQuery);
        
        if (fallbackResults.length > 0) {
          const { latitude, longitude } = fallbackResults[0];
          
          setSelectedLocation({
            latitude,
            longitude,
            address: searchQuery,
            description: selectedLocation.description,
          });

          setMapRegion({
            latitude,
            longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          });

          // Actualizar formulario
          handleInputChange('location.latitude', latitude);
          handleInputChange('location.longitude', longitude);
          handleInputChange('location.address', searchQuery);

          setSearchQuery('');
        } else {
          Alert.alert(
            t('common.error'),
            t('requests.map.location_not_found')
          );
        }
      }
    } catch (error) {
      console.error('Error searching location:', error);
      Alert.alert(
        t('common.error'),
        t('requests.map.search_error')
      );
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const confirmLocation = () => {
    handleInputChange('location.address', selectedLocation.address);
    setShowMapModal(false);
    setTimeout(() => nextStep(), 300);
  };

  const nextStep = () => {
    if (currentStep < FORM_STEPS.length - 1) {
      Animated.timing(slideAnim, {
        toValue: -1,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setCurrentStep(currentStep + 1);
        slideAnim.setValue(1);
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      });
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setCurrentStep(currentStep - 1);
        slideAnim.setValue(-1);
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      });
    }
  };

  const handleSelection = (field: string, value: any) => {
    handleInputChange(field, value);
    // Avanzar automáticamente al siguiente paso después de una breve pausa
    setTimeout(() => nextStep(), 300);
  };

  const handleSubmit = async () => {
    // Validar todos los campos obligatorios
    const requiredFields = ['requestName', 'requestType', 'date', 'time', 'location.address', 'budget'];
    const newErrors: Record<string, string> = {};
    
    requiredFields.forEach(field => {
      let value: any;
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        const parentObj = formData[parent as keyof typeof formData] as any;
        value = parentObj[child];
      } else {
        value = formData[field as keyof typeof formData];
      }
      const error = validateField(field, value);
      if (error) newErrors[field] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      Alert.alert(t('common.error'), t('requests.validation.complete_required_fields'));
      return;
    }

    try {
      setLoading(true);

      const requestData: CreateRequestData = {
        requestName: formData.requestName,
        requestType: formData.requestType,
        date: formData.date,
        time: formData.initTime,
        location: {
          address: formData.location.address,
          city: formData.location.city,
          latitude: formData.location.latitude,
          longitude: formData.location.longitude,
        },
        // duration: formData.initTime - formData.fineTime,
        duration: formData.duration,
        instrument: formData.instrument,
        budget: Number(formData.budget),
        description: formData.description || '',
        musicGenre: formData.musicGenre || '',
        guestCount: Number(formData.guestCount) || 0,
        specialRequirements: formData.specialRequirements || '',
        additionalComments: formData.additionalComments || '',
        minBudget: Number(formData.budget),
        maxBudget: Number(formData.budget),
        paymentMethod: formData.paymentMethod || '',
        paymentTerms: formData.paymentTerms || '',
        equipmentIncluded: formData.equipmentIncluded || '',
        budgetNotes: formData.budgetNotes || '',
      };

                  const response = await requestService.createRequest(requestData);
      
      // El servidor devuelve los datos directamente, no en estructura { success: true }
      // Si llegamos aquí sin error, significa que la solicitud fue exitosa
      console.log('./src/screens/events/ShareMusicianScreen.tsx line 499')
      console.log('✅ Solicitud creada exitosamente:', response);
      
      Alert.alert(
        t('common.success'),
        t('requests.create_success'),
        [
          {
            text: t('requests.view_my_requests'),
            onPress: () => navigation.navigate('MyRequestsList')
          },
          {
            text: t('requests.create_another'),
            onPress: () => {
              setFormData({
                requestName: '',
                requestType: '',
                date: '',
                initTime: '',
                fineTime: '',
                location: { address: '', city: 'Santo Domingo', latitude: 18.4861, longitude: -69.9312 },
                duration: 120,
                instrument: '',
                budget: '',
                description: '',
                locationDescription: '',
                musicGenre: '',
                guestCount: '0',
                specialRequirements: '',
                additionalComments: '',
                minBudget: 0,
                maxBudget: 0,
                paymentMethod: '',
                paymentTerms: '',
                equipmentIncluded: '',
                budgetNotes: '',
              });
              setErrors({});
              setCurrentStep(0);
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error creating request:', error);
      Alert.alert(t('common.error'), t('requests.create_error'));
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    const currentStepData = FORM_STEPS[currentStep];
    const stepId = currentStepData.id;

    switch (stepId) {
      case 'eventName':
        return (
          <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 20 }}>
      <Text style={{ 
              fontSize: 28, 
        fontWeight: 'bold', 
        color: theme.colors.text.primary, 
              textAlign: 'center',
              marginBottom: 12 
      }}>
              {t(currentStepData.title)}
      </Text>
            <Text style={{ 
              fontSize: 16, 
              color: theme.colors.text.secondary, 
              textAlign: 'center',
              marginBottom: 40 
            }}>
              {t(currentStepData.subtitle)}
            </Text>
            
      <TextInput
        style={{
                borderWidth: 2,
                borderColor: errors.requestName ? theme.colors.error[500] : theme.colors.primary[500],
                borderRadius: 16,
                paddingHorizontal: 20,
                paddingVertical: 16,
                fontSize: 18,
          color: theme.colors.text.primary,
                backgroundColor: theme.colors.background.card,
                textAlign: 'center',
                marginBottom: 20,
        }}
              placeholder={t('requests.event_name_placeholder')}
              placeholderTextColor={theme.colors.text.secondary}
              value={formData.requestName}
              onChangeText={(text) => handleInputChange('requestName', text)}
              autoFocus={true}
      />
            
            {errors.requestName && (
        <Text style={{ 
          color: theme.colors.error[500], 
                fontSize: 14, 
                textAlign: 'center',
                marginBottom: 20 
        }}>
                {errors.requestName}
        </Text>
      )}
    </View>
  );

      case 'eventType':
        return (
          <ScrollView 
            style={{ flex: 1 }} 
            contentContainerStyle={{ 
              justifyContent: 'center', 
              paddingHorizontal: 20,
              paddingVertical: 20
            }}
            showsVerticalScrollIndicator={false}
          >
      <Text style={{ 
              fontSize: 28, 
        fontWeight: 'bold', 
        color: theme.colors.text.primary, 
              textAlign: 'center',
              marginBottom: 12 
      }}>
              {t(currentStepData.title)}
      </Text>
            <Text style={{ 
              fontSize: 16, 
              color: theme.colors.text.secondary, 
              textAlign: 'center',
              marginBottom: 40 
            }}>
              {t(currentStepData.subtitle)}
            </Text>
            
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
              {EVENT_TYPES.map((item) => (
      <TouchableOpacity
                  key={item.id}
        style={{
                    width: '48%',
                    backgroundColor: formData.requestType === item.id ? item.color : theme.colors.background.card,
                    borderRadius: 16,
                    padding: 20,
                    marginBottom: 12,
                    borderWidth: 3,
                    borderColor: formData.requestType === item.id ? item.color : theme.colors.border.primary,
          alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: 120,
        }}
                  onPress={() => handleSelection('requestType', item.id)}
      >
                  <Ionicons 
                    name={item.icon as any} 
                    size={32} 
                    color={formData.requestType === item.id ? '#fff' : theme.colors.text.secondary} 
                    style={{ marginBottom: 12 }}
                  />
        <Text style={{ 
                    fontSize: 14,
                    fontWeight: '600',
                    color: formData.requestType === item.id ? '#fff' : theme.colors.text.primary,
                    textAlign: 'center',
                  }}>
                    {t(item.label)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        );

      case 'date':
        return (
          <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 20 }}>
            <Text style={{ 
              fontSize: 28, 
              fontWeight: 'bold', 
              color: theme.colors.text.primary, 
              textAlign: 'center',
              marginBottom: 12 
            }}>
              {t(currentStepData.title)}
            </Text>
            <Text style={{ 
          fontSize: 16,
              color: theme.colors.text.secondary, 
              textAlign: 'center',
              marginBottom: 40 
        }}>
              {t(currentStepData.subtitle)}
        </Text>
            
            <TouchableOpacity
              style={{
                borderWidth: 2,
                borderColor: errors.date ? theme.colors.error[500] : theme.colors.primary[500],
                borderRadius: 16,
                paddingHorizontal: 20,
                paddingVertical: 20,
                backgroundColor: theme.colors.background.card,
                alignItems: 'center',
                marginBottom: 20,
              }}
              onPress={() => setShowDatePicker(true)}
            >
              <Ionicons name="calendar" size={32} color={theme.colors.primary[500]} style={{ marginBottom: 12 }} />
              <Text style={{ 
                fontSize: 18, 
                color: formData.date ? theme.colors.text.primary : theme.colors.text.secondary,
                textAlign: 'center',
              }}>
                {formData.date || t('requests.select_date')}
              </Text>
      </TouchableOpacity>
            
            {errors.date && (
        <Text style={{ 
          color: theme.colors.error[500], 
                fontSize: 14, 
                textAlign: 'center',
                marginBottom: 20 
        }}>
                {errors.date}
        </Text>
      )}
    </View>
  );

      case 'initTime':
        return (
          <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 20 }}>
      <Text style={{ 
              fontSize: 28, 
        fontWeight: 'bold', 
        color: theme.colors.text.primary, 
              textAlign: 'center',
              marginBottom: 12 
      }}>
              {t(currentStepData.title)}
      </Text>
            <Text style={{ 
              fontSize: 16, 
              color: theme.colors.text.secondary, 
              textAlign: 'center',
              marginBottom: 40 
            }}>
              {t(currentStepData.subtitle)}
            </Text>
            
      <TouchableOpacity
        style={{
                borderWidth: 2,
                borderColor: errors.time ? theme.colors.error[500] : theme.colors.primary[500],
                borderRadius: 16,
                paddingHorizontal: 20,
                paddingVertical: 20,
                backgroundColor: theme.colors.background.card,
          alignItems: 'center',
                marginBottom: 20,
        }}
              onPress={() => setShowTimePicker(true)}
      >
              <Ionicons name="time" size={32} color={theme.colors.primary[500]} style={{ marginBottom: 12 }} />
        <Text style={{ 
                fontSize: 18, 
                color: formData.initTime ? theme.colors.text.primary : theme.colors.text.secondary,
                textAlign: 'center',
        }}>
                {formData.initTime || t('requests.select_initTime')}
        </Text>
      </TouchableOpacity>
            
            {errors.time && (
        <Text style={{ 
          color: theme.colors.error[500], 
                fontSize: 14, 
                textAlign: 'center',
                marginBottom: 20 
        }}>
                {errors.time}
        </Text>
      )}
    </View>
  );
      case 'fineTime':
        return (
          <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 20 }}>
      <Text style={{ 
              fontSize: 28, 
        fontWeight: 'bold', 
        color: theme.colors.text.primary, 
              textAlign: 'center',
              marginBottom: 12 
      }}>
              {t(currentStepData.title)}
      </Text>
            <Text style={{ 
              fontSize: 16, 
              color: theme.colors.text.secondary, 
              textAlign: 'center',
              marginBottom: 40 
            }}>
              {t(currentStepData.subtitle)}
            </Text>
            
      <TouchableOpacity
        style={{
                borderWidth: 2,
                borderColor: errors.time ? theme.colors.error[500] : theme.colors.primary[500],
                borderRadius: 16,
                paddingHorizontal: 20,
                paddingVertical: 20,
                backgroundColor: theme.colors.background.card,
          alignItems: 'center',
                marginBottom: 20,
        }}
              onPress={() => setShowTimePicker(true)}
      >
              <Ionicons name="time" size={32} color={theme.colors.primary[500]} style={{ marginBottom: 12 }} />
        <Text style={{ 
                fontSize: 18, 
                color: formData.initTime ? theme.colors.text.primary : theme.colors.text.secondary,
                textAlign: 'center',
        }}>
                {formData.initTime || t('requests.select_initTime')}
        </Text>
      </TouchableOpacity>
            
            {errors.time && (
        <Text style={{ 
          color: theme.colors.error[500], 
                fontSize: 14, 
                textAlign: 'center',
                marginBottom: 20 
        }}>
                {errors.time}
        </Text>
      )}
    </View>
  );

      case 'duration':
  return (
        <ScrollView
          style={{ flex: 1 }}
            contentContainerStyle={{ 
              justifyContent: 'center', 
              paddingHorizontal: 20,
              paddingVertical: 20
            }}
          showsVerticalScrollIndicator={false}
        >
            <Text style={{ 
              fontSize: 28, 
              fontWeight: 'bold', 
              color: theme.colors.text.primary, 
              textAlign: 'center',
              marginBottom: 12 
            }}>
              {formData.fineTime}
              {t(currentStepData.title)}
            </Text>
            <Text style={{ 
              fontSize: 16, 
              color: theme.colors.text.secondary, 
              textAlign: 'center',
              marginBottom: 40 
            }}>
              {t(currentStepData.subtitle)}
            </Text>
            
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 12 }}>
              {DURATION_OPTIONS.map((duration) => (
                <TouchableOpacity
                  key={duration.id}
                  style={{
                    backgroundColor: formData.duration === duration.id ? theme.colors.primary[500] : theme.colors.background.card,
                    borderRadius: 25,
                    paddingHorizontal: 20,
                    paddingVertical: 12,
                    borderWidth: 2,
                    borderColor: formData.duration === duration.id ? theme.colors.primary[500] : theme.colors.border.primary,
                    flexDirection: 'row',
                    alignItems: 'center',
                    minWidth: 100,
                  }}
                  onPress={() => handleSelection('duration', duration.id)}
                >
                  <Ionicons 
                    name={duration.icon as any} 
                    size={20} 
                    color={formData.duration === duration.id ? '#fff' : theme.colors.text.secondary} 
                    style={{ marginRight: 8 }}
                  />
                  <Text style={{
                    fontSize: 14,
                    fontWeight: '600',
                    color: formData.duration === duration.id ? '#fff' : theme.colors.text.primary,
                  }}>
                    {duration.label}
                  </Text>
                </TouchableOpacity>
              ))}
          </View>
          </ScrollView>
        );

      case 'instrument':
        return (
          <ScrollView 
            style={{ flex: 1 }} 
            contentContainerStyle={{ 
              justifyContent: 'center', 
              paddingHorizontal: 20,
              paddingVertical: 20
            }}
            showsVerticalScrollIndicator={false}
          >
            <Text style={{ 
              fontSize: 28, 
              fontWeight: 'bold', 
              color: theme.colors.text.primary, 
              textAlign: 'center',
              marginBottom: 12 
            }}>
              {t(currentStepData.title)}
            </Text>
            <Text style={{ 
              fontSize: 16, 
              color: theme.colors.text.secondary, 
              textAlign: 'center',
              marginBottom: 40 
            }}>
              {t(currentStepData.subtitle)}
            </Text>
            
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
              {INSTRUMENTS.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={{
                    width: '48%',
                    backgroundColor: formData.instrument === item.id ? item.color : theme.colors.background.card,
            borderRadius: 16,
            padding: 20,
                    marginBottom: 12,
                    borderWidth: 3,
                    borderColor: formData.instrument === item.id ? item.color : theme.colors.border.primary,
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: 120,
                  }}
                  onPress={() => handleSelection('instrument', item.id)}
                >
                  <Ionicons 
                    name={item.icon as any} 
                    size={32} 
                    color={formData.instrument === item.id ? '#fff' : theme.colors.text.secondary} 
                    style={{ marginBottom: 12 }}
                  />
                  <Text style={{
                    fontSize: 14,
                    fontWeight: '600',
                    color: formData.instrument === item.id ? '#fff' : theme.colors.text.primary,
                    textAlign: 'center',
                  }}>
                    {t(item.label)}
            </Text>
                </TouchableOpacity>
              ))}
              </View>
          </ScrollView>
        );

      case 'budget':
        return (
          <ScrollView 
            style={{ flex: 1 }} 
            contentContainerStyle={{ 
              justifyContent: 'center', 
              paddingHorizontal: 20,
              paddingVertical: 20
            }}
            showsVerticalScrollIndicator={false}
          >
            <Text style={{ 
              fontSize: 28, 
              fontWeight: 'bold', 
              color: theme.colors.text.primary, 
              textAlign: 'center',
              marginBottom: 12 
            }}>
              {t(currentStepData.title)}
            </Text>
            <Text style={{ 
              fontSize: 16, 
              color: theme.colors.text.secondary, 
              textAlign: 'center',
              marginBottom: 40 
            }}>
              {t(currentStepData.subtitle)}
            </Text>
            
            <View style={{ gap: 12 }}>
              {BUDGET_RANGES.map((budget) => (
                <TouchableOpacity
                  key={budget.id}
                  style={{
                    backgroundColor: formData.budget === budget.id ? budget.color : theme.colors.background.card,
            borderRadius: 16,
            padding: 20,
                    borderWidth: 3,
                    borderColor: formData.budget === budget.id ? budget.color : theme.colors.border.primary,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                  onPress={() => {
                    handleInputChange('budget', budget.id);
                    handleInputChange('minBudget', budget.value);
                    handleInputChange('maxBudget', budget.value);
                    setTimeout(() => nextStep(), 300);
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={{
                      fontSize: 18,
                      fontWeight: '600',
                      color: formData.budget === budget.id ? '#fff' : theme.colors.text.primary,
                    }}>
                      {t(budget.label)}
            </Text>
                    <Text style={{
                      fontSize: 14,
                      color: formData.budget === budget.id ? '#fff' : theme.colors.text.secondary,
                    }}>
                      {budget.range}
                    </Text>
              </View>
                  <Ionicons 
                    name={formData.budget === budget.id ? 'checkmark-circle' : 'ellipse-outline'} 
                    size={28} 
                    color={formData.budget === budget.id ? '#fff' : theme.colors.text.secondary} 
                  />
                </TouchableOpacity>
              ))}
              </View>
          </ScrollView>
        );

      case 'location':
        return (
          <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 20 }}>
            <Text style={{ 
              fontSize: 28, 
              fontWeight: 'bold', 
              color: theme.colors.text.primary, 
              textAlign: 'center',
              marginBottom: 12 
            }}>
              {t(currentStepData.title)}
            </Text>
            <Text style={{ 
              fontSize: 16, 
              color: theme.colors.text.secondary, 
              textAlign: 'center',
              marginBottom: 40 
            }}>
              {t(currentStepData.subtitle)}
            </Text>
            
            <TouchableOpacity
              style={{
                borderWidth: 2,
                borderColor: errors['location.address'] ? theme.colors.error[500] : theme.colors.primary[500],
            borderRadius: 16,
                paddingHorizontal: 20,
                paddingVertical: 16,
                backgroundColor: theme.colors.background.card,
                alignItems: 'center',
                marginBottom: 20,
              }}
              onPress={() => setShowMapModal(true)}
            >
              <Ionicons name="location" size={32} color={theme.colors.primary[500]} style={{ marginBottom: 12 }} />
              <Text style={{ 
                fontSize: 18, 
                color: formData.location.address ? theme.colors.text.primary : theme.colors.text.secondary,
                textAlign: 'center',
              }}>
                {formData.location.address || t('requests.select_location')}
            </Text>
            </TouchableOpacity>
            
            {errors['location.address'] && (
              <Text style={{ 
                color: theme.colors.error[500], 
                fontSize: 14, 
                textAlign: 'center',
                marginBottom: 20 
              }}>
                {errors['location.address']}
              </Text>
            )}
          </View>
        );

      case 'locationDescription':
        return (
          <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 20 }}>
            <Text style={{ 
              fontSize: 28, 
              fontWeight: 'bold', 
              color: theme.colors.text.primary, 
              textAlign: 'center',
              marginBottom: 12 
            }}>
              {t(currentStepData.title)}
            </Text>
            <Text style={{ 
              fontSize: 16, 
              color: theme.colors.text.secondary, 
              textAlign: 'center',
              marginBottom: 40 
            }}>
              {t(currentStepData.subtitle)}
            </Text>
            
            <TextInput
              style={{
                borderWidth: 2,
                borderColor: theme.colors.primary[500],
                borderRadius: 16,
                paddingHorizontal: 20,
                paddingVertical: 16,
                fontSize: 18,
                color: theme.colors.text.primary,
                backgroundColor: theme.colors.background.card,
                textAlignVertical: 'top',
                minHeight: 120,
                marginBottom: 20,
              }}
              placeholder={t('requests.location_description_placeholder')}
              placeholderTextColor={theme.colors.text.secondary}
              value={formData.locationDescription}
              onChangeText={(text) => handleInputChange('locationDescription', text)}
              multiline={true}
              numberOfLines={4}
              autoFocus={true}
            />
          </View>
        );

      case 'description':
        return (
          <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 20 }}>
            <Text style={{ 
              fontSize: 28, 
              fontWeight: 'bold', 
              color: theme.colors.text.primary, 
              textAlign: 'center',
              marginBottom: 12 
            }}>
              {t(currentStepData.title)}
            </Text>
            <Text style={{ 
              fontSize: 16, 
              color: theme.colors.text.secondary, 
              textAlign: 'center',
              marginBottom: 40 
            }}>
              {t(currentStepData.subtitle)}
            </Text>
            
            <TextInput
              style={{
                borderWidth: 2,
                borderColor: theme.colors.primary[500],
                borderRadius: 16,
                paddingHorizontal: 20,
                paddingVertical: 16,
                fontSize: 18,
                color: theme.colors.text.primary,
                backgroundColor: theme.colors.background.card,
                textAlignVertical: 'top',
                minHeight: 120,
                marginBottom: 20,
              }}
              placeholder={t('requests.description_placeholder')}
              placeholderTextColor={theme.colors.text.secondary}
              value={formData.description}
              onChangeText={(text) => handleInputChange('description', text)}
              multiline={true}
              numberOfLines={4}
            />
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={{ 
      flex: 1, 
      backgroundColor: theme.colors.background.primary,
      paddingTop: insets.top + 10,
    }}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header con progreso */}
          <View style={{
          paddingHorizontal: 20, 
          paddingBottom: 20,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.border.primary,
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ 
                padding: 8, 
                borderRadius: 20, 
            backgroundColor: theme.colors.background.card,
                marginRight: 16
              }}
            >
              <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
            </TouchableOpacity>
            <Text style={{ 
              fontSize: 20, 
              fontWeight: 'bold', 
              color: theme.colors.text.primary,
              flex: 1
            }}>
              {t('requests.create_request')}
            </Text>
          </View>
          
          {/* Barra de progreso */}
          <View style={{ 
            height: 4, 
            backgroundColor: theme.colors.border.primary, 
            borderRadius: 2,
            overflow: 'hidden'
          }}>
            <View style={{ 
              height: '100%', 
              backgroundColor: theme.colors.primary[500], 
              width: `${((currentStep + 1) / FORM_STEPS.length) * 100}%`,
              borderRadius: 2
            }} />
          </View>
          
          <Text style={{ 
            fontSize: 14, 
            color: theme.colors.text.secondary, 
            textAlign: 'center',
            marginTop: 8
          }}>
            Paso {currentStep + 1} de {FORM_STEPS.length}
          </Text>
        </View>

        {/* Contenido del paso actual */}
        <Animated.View style={{ 
          flex: 1,
          transform: [{ translateX: slideAnim }]
        }}>
          {renderStepContent()}
        </Animated.View>

        {/* Botones de navegación */}
        <View style={{ 
          paddingHorizontal: 20, 
          paddingVertical: 20,
          borderTopWidth: 1,
          borderTopColor: theme.colors.border.primary,
        }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <TouchableOpacity
              style={{
                backgroundColor: currentStep === 0 ? theme.colors.background.card : theme.colors.primary[500],
                borderRadius: 12,
                paddingHorizontal: 24,
                paddingVertical: 12,
                opacity: currentStep === 0 ? 0.5 : 1,
              }}
              onPress={prevStep}
              disabled={currentStep === 0}
            >
              <Text style={{ 
                color: currentStep === 0 ? theme.colors.text.secondary : '#fff', 
                fontSize: 16, 
                fontWeight: '600' 
              }}>
                Anterior
              </Text>
            </TouchableOpacity>

            {currentStep === FORM_STEPS.length - 1 ? (
          <TouchableOpacity
            style={{
              backgroundColor: theme.colors.primary[500],
              borderRadius: 12,
                  paddingHorizontal: 32,
                  paddingVertical: 12,
              opacity: loading ? 0.7 : 1,
            }}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
                  <ActivityIndicator color="#fff" size="small" />
            ) : (
                  <Text style={{ 
                    color: '#fff', 
                    fontSize: 16, 
                    fontWeight: '600' 
                  }}>
                    {t('requests.create_request_button')}
              </Text>
            )}
          </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={{
                  backgroundColor: theme.colors.primary[500],
                  borderRadius: 12,
                  paddingHorizontal: 32,
                  paddingVertical: 12,
                }}
                onPress={nextStep}
              >
                <Text style={{ 
                  color: '#fff', 
                  fontSize: 16, 
                  fontWeight: '600' 
                }}>
                  Siguiente
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* DateTimePicker para fecha */}
        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            onChange={handleDateChange}
            minimumDate={new Date()}
          />
        )}

        {/* DateTimePicker para hora */}
        {showTimePicker && (
          <DateTimePicker
            value={selectedTime}
            mode="time"
            display="default"
            onChange={handleinitTimeChange}
          />
        )}

                {/* Modal del Mapa */}
        <Modal
          visible={showMapModal}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background.primary }}>
            {/* Header */}
          <View style={{
              flexDirection: 'row', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              paddingHorizontal: 20,
              paddingVertical: 16,
              borderBottomWidth: 1,
              borderBottomColor: theme.colors.border.primary,
            }}>
              <TouchableOpacity
                onPress={() => setShowMapModal(false)}
                style={{ padding: 8 }}
              >
                <Ionicons name="close" size={24} color={theme.colors.text.primary} />
              </TouchableOpacity>
              <Text style={{ 
                fontSize: 18, 
                fontWeight: 'bold', 
                color: theme.colors.text.primary 
              }}>
                {t('requests.map.title')}
                </Text>
                  <TouchableOpacity
                onPress={confirmLocation}
                    style={{
                  backgroundColor: theme.colors.primary[500],
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 8,
                }}
              >
                <Text style={{ color: '#fff', fontWeight: '600' }}>
                  {t('requests.map.confirm')}
                    </Text>
                  </TouchableOpacity>
            </View>

            {/* Barra de búsqueda */}
          <View style={{
              paddingHorizontal: 20, 
              paddingVertical: 12,
              backgroundColor: theme.colors.background.card,
              borderBottomWidth: 1,
              borderBottomColor: theme.colors.border.primary,
          }}>
            <View style={{
                flexDirection: 'row', 
                alignItems: 'center',
                backgroundColor: theme.colors.background.primary,
                borderRadius: 12,
                paddingHorizontal: 12,
                borderWidth: 1,
                borderColor: theme.colors.border.primary,
            }}>
                <TextInput
                  style={{
                    flex: 1,
                    paddingVertical: 12,
                    fontSize: 16,
                    color: theme.colors.text.primary,
                  }}
                  placeholder={t('requests.map.search_placeholder')}
                  placeholderTextColor={theme.colors.text.secondary}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  onSubmitEditing={searchLocation}
                />
                <TouchableOpacity
                  onPress={searchLocation}
                  style={{ padding: 8 }}
                  disabled={isLoadingLocation}
                >
                  <Ionicons 
                    name="search" 
                    size={20} 
                    color={isLoadingLocation ? theme.colors.text.secondary : theme.colors.primary[500]} 
                  />
                </TouchableOpacity>
              </View>
              
              {/* Botón de ubicación actual */}
                  <TouchableOpacity
                onPress={getCurrentLocation}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: theme.colors.primary[500],
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  borderRadius: 8,
                  marginTop: 12,
                }}
                disabled={isLoadingLocation}
              >
                {isLoadingLocation ? (
                  <ActivityIndicator color="#fff" size="small" style={{ marginRight: 8 }} />
                ) : (
                  <Ionicons name="location" size={20} color="#fff" style={{ marginRight: 8 }} />
                )}
                <Text style={{ color: '#fff', fontWeight: '600' }}>
                  {t('requests.map.use_current_location')}
                    </Text>
                  </TouchableOpacity>
            </View>
            
            {/* Mapa */}
            <MapView
              style={{ flex: 1 }}
              region={mapRegion}
              onPress={handleMapPress}
            >
              {selectedLocation.latitude && selectedLocation.longitude && (
                <Marker
                  coordinate={{
                    latitude: selectedLocation.latitude,
                    longitude: selectedLocation.longitude,
                  }}
                  title={t('requests.map.location_selected')}
              />
              )}
            </MapView>
            
            {/* Panel inferior */}
            <View style={{ 
              padding: 20, 
              backgroundColor: theme.colors.background.card,
              borderTopWidth: 1,
              borderTopColor: theme.colors.border.primary,
            }}>
              <Text style={{ 
                fontSize: 16, 
                color: theme.colors.text.secondary,
                textAlign: 'center',
                marginBottom: 12,
              }}>
                {t('requests.map.instruction')}
              </Text>
              
              {selectedLocation.address && (
                <View style={{ marginBottom: 12 }}>
                  <Text style={{ 
                    fontSize: 14, 
                    fontWeight: '600',
                    color: theme.colors.text.primary,
                    marginBottom: 4,
                  }}>
                    {t('requests.map.address')}:
                  </Text>
                  <Text style={{ 
                    fontSize: 14, 
                    color: theme.colors.text.primary,
                  }}>
                    {selectedLocation.address}
                  </Text>
            </View>
              )}

              
          </View>
          </SafeAreaView>
        </Modal>
    </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ShareMusicianScreen; 