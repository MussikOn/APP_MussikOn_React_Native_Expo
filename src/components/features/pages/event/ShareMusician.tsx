import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, Alert, ScrollView, Dimensions, Platform, KeyboardAvoidingView, Modal, TextInput, FlatList } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@contexts/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SearchingMusicianModal from '@components/features/pages/solicitudMusico/SearchingMusicianModal';
import { createMusicianRequest } from '@services/musicianRequests';
import MapView, { Marker, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { ActivityIndicator } from 'react-native';
import { useUser } from '@contexts/UserContext';
import { eventService } from '@services/events';
import { registerSocketUser } from '@utils/socket';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const MAX_FORM_WIDTH = 420;

const steps = [
  {
    key: 'eventType',
    label: '¿Qué tipo de evento vas a realizar?',
    options: [
      { label: 'Culto', value: 'culto', icon: 'people' },
      { label: 'Campaña', value: 'campana', icon: 'megaphone' },
      { label: 'Concierto', value: 'concierto', icon: 'musical-notes' },
      { label: 'Otro', value: 'otro', icon: 'ellipsis-horizontal' },
    ],
  },
  {
    key: 'instrument',
    label: '¿Qué instrumento necesitas?',
    options: [
      { label: 'Piano', value: 'piano', icon: 'musical-notes' },
      { label: 'Guitarra', value: 'guitarra', icon: 'musical-notes' },
      { label: 'Batería', value: 'bateria', icon: 'musical-notes' },
      { label: 'Voz', value: 'voz', icon: 'mic' },
      { label: 'Otro', value: 'otro', icon: 'ellipsis-horizontal' },
    ],
  },
  {
    key: 'date',
    label: '¿En qué fecha será el evento?',
    type: 'date',
  },
  {
    key: 'startTime',
    label: '¿A qué hora inicia?',
    type: 'time',
  },
  {
    key: 'endTime',
    label: '¿A qué hora termina?',
    type: 'time',
  },
  {
    key: 'location',
    label: '¿Dónde será el evento?',
    type: 'location',
  },
];

const formatDate = (date: Date | string | undefined) => {
  if (!date) return '';
  if (typeof date === 'string') date = new Date(date);
  return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
};
const formatTime = (date: Date | string | undefined) => {
  if (!date) return '';
  if (typeof date === 'string') date = new Date(`1970-01-01T${date}`);
  return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
};

// CustomDatePickerModal
const CustomDatePickerModal = ({
  visible,
  onClose,
  onConfirm,
  initialDate = new Date(),
}: {
  visible: boolean;
  onClose: () => void;
  onConfirm: (date: Date) => void;
  initialDate?: Date;
}) => {
  const { theme } = useTheme();
  const [currentDate, setCurrentDate] = useState(initialDate);
  const [displayMonth, setDisplayMonth] = useState(initialDate.getMonth());
  const [displayYear, setDisplayYear] = useState(initialDate.getFullYear());

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  // Cambiar el cálculo del primer día de la semana para que lunes sea 0
  const firstDayOfWeek = (year: number, month: number) => {
    const day = new Date(year, month, 1).getDay();
    return (day + 6) % 7; // Lunes=0, Domingo=6
  };

  const days = [];
  const totalDays = daysInMonth(displayYear , displayMonth);
  const firstDay = firstDayOfWeek(displayYear, displayMonth);
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= totalDays; d++) days.push(d);

  const handlePrevMonth = () => {
    if (displayMonth === 0) {
      setDisplayMonth(11);
      setDisplayYear(displayYear - 1);
    } else {
      setDisplayMonth(displayMonth - 1);
    }
  };
  const handleNextMonth = () => {
    if (displayMonth === 11) {
      setDisplayMonth(0);
      setDisplayYear(displayYear + 1);
    } else {
      setDisplayMonth(displayMonth + 1);
    }
  };

  const handleSelectDay = (day: number | null) => {
    if (!day) return;
    const selected = new Date(displayYear, displayMonth, day);
    onConfirm(selected);
    onClose();
  };

  const monthNames = ['Enero', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

  const weekDays = [
    { key: 'D', label: 'D' },
    { key: 'L', label: 'L' },
    { key: 'Ma', label: 'M' },
    { key: 'Mi', label: 'M' },
    { key: 'J', label: 'J' },
    { key: 'V', label: 'V' },
    { key: 'S', label: 'S' },
  ];

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ backgroundColor: theme.colors.background.card, borderRadius: 20, padding: 24, width: 340, alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            <TouchableOpacity onPress={handlePrevMonth} style={{ padding: 8 }}>
              <Ionicons name="chevron-back" size={24} color={theme.colors.primary[500]} />
            </TouchableOpacity>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.colors.text.primary, marginHorizontal: 12 }}>{monthNames[displayMonth]} {displayYear}</Text>
            <TouchableOpacity onPress={handleNextMonth} style={{ padding: 8 }}>
              <Ionicons name="chevron-forward" size={24} color={theme.colors.primary[500]} />
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 4 }}>
            {weekDays.map((d) => (
              <Text key={d.key} style={{ width: 32, textAlign: 'center', color: theme.colors.text.secondary, fontWeight: 'bold' }}>{d.label}</Text>
            ))}
          </View>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', width: 32 * 7 }}>
            {days.map((day, idx) => (
              <TouchableOpacity
                key={idx}
                style={{ width: 32, height: 32, alignItems: 'center', justifyContent: 'center', margin: 2, borderRadius: 16, backgroundColor: day && currentDate.getDate() === day && currentDate.getMonth() === displayMonth && currentDate.getFullYear() === displayYear ? theme.colors.primary[500] : 'transparent' }}
                onPress={() => handleSelectDay(day)}
                disabled={!day}
              >
                <Text style={{ color: day && currentDate.getDate() === day && currentDate.getMonth() === displayMonth && currentDate.getFullYear() === displayYear ? theme.colors.text.inverse : theme.colors.text.primary, fontWeight: 'bold' }}>{day ? day : ''}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity onPress={onClose} style={{ marginTop: 18, padding: 10, borderRadius: 10, backgroundColor: theme.colors.primary[100] }}>
            <Text style={{ color: theme.colors.primary[700], fontWeight: 'bold' }}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

// CustomTimePickerModal
const CustomTimePickerModal = ({
  visible,
  onClose,
  onConfirm,
  initialHour = 12,
  initialMinute = 0,
  hourFormat = '24h',
}: {
  visible: boolean;
  onClose: () => void;
  onConfirm: (hour: number, minute: number, ampm?: 'AM' | 'PM') => void;
  initialHour?: number;
  initialMinute?: number;
  hourFormat?: '24h' | '12h';
}) => {
  const [hour, setHour] = useState(initialHour);
  const [minute, setMinute] = useState(initialMinute);
  const [ampm, setAMPM] = useState<'AM' | 'PM'>('AM');
  const { theme } = useTheme();

  const hours = hourFormat === '24h' ? Array.from({ length: 24 }, (_, i) => i) : Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = Array.from({ length: 12 }, (_, i) => i * 5);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ backgroundColor: theme.colors.background.card, borderRadius: 20, padding: 24, width: 320, alignItems: 'center' }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.colors.text.primary, marginBottom: 16 }}>Seleccionar hora</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <ScrollView style={{ height: 120 }} showsVerticalScrollIndicator={false}>
              {hours.map((h) => (
                <TouchableOpacity key={h} onPress={() => setHour(h)} style={{ padding: 8, backgroundColor: hour === h ? theme.colors.primary[100] : 'transparent', borderRadius: 8 }}>
                  <Text style={{ fontSize: 22, color: theme.colors.text.primary }}>{h.toString().padStart(2, '0')}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <Text style={{ fontSize: 22, marginHorizontal: 8, color: theme.colors.text.primary }}>:</Text>
            <ScrollView style={{ height: 120 }} showsVerticalScrollIndicator={false}>
              {minutes.map((m) => (
                <TouchableOpacity key={m} onPress={() => setMinute(m)} style={{ padding: 8, backgroundColor: minute === m ? theme.colors.primary[100] : 'transparent', borderRadius: 8 }}>
                  <Text style={{ fontSize: 22, color: theme.colors.text.primary }}>{m.toString().padStart(2, '0')}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            {hourFormat === '12h' && (
              <View style={{ marginLeft: 12 }}>
                <TouchableOpacity onPress={() => setAMPM('AM')} style={{ padding: 8, backgroundColor: ampm === 'AM' ? theme.colors.primary[100] : 'transparent', borderRadius: 8 }}>
                  <Text style={{ fontSize: 18, color: theme.colors.text.primary }}>AM</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setAMPM('PM')} style={{ padding: 8, backgroundColor: ampm === 'PM' ? theme.colors.primary[100] : 'transparent', borderRadius: 8, marginTop: 4 }}>
                  <Text style={{ fontSize: 18, color: theme.colors.text.primary }}>PM</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
          <View style={{ flexDirection: 'row', marginTop: 12 }}>
            <TouchableOpacity onPress={onClose} style={{ padding: 12, borderRadius: 12, backgroundColor: theme.colors.primary[100], marginRight: 12 }}>
              <Text style={{ color: theme.colors.primary[700], fontWeight: 'bold' }}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              onConfirm(hour, minute, hourFormat === '12h' ? ampm : undefined);
              onClose();
            }} style={{ padding: 12, borderRadius: 12, backgroundColor: theme.colors.primary[500] }}>
              <Text style={{ color: theme.colors.text.inverse, fontWeight: 'bold' }}>Confirmar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// Paso de ubicación: solo mapa + barra de búsqueda
const LocationMapPicker = ({
  value,
  onChange,
  onConfirm,
  theme,
}: {
  value: string;
  onChange: (val: string) => void;
  onConfirm: (val: string) => void;
  theme: any;
}) => {
  const [region, setRegion] = useState<Region | undefined>(undefined);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;
      let location = await Location.getCurrentPositionAsync({});
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    })();
  }, []);

  // Autocompletado en tiempo real
  useEffect(() => {
    let active = true;
    if (search.length > 2) {
      setLoading(true);
      // @ts-ignore: searchPlacesAsync puede no estar en todos los entornos
      if (typeof Location.searchPlacesAsync === 'function') {
        // @ts-ignore
        Location.searchPlacesAsync(search, undefined, 5)
          .then((results: any[]) => {
            if (active) setSuggestions(results);
          })
          .catch(() => {
            if (active) setSuggestions([]);
          })
          .finally(() => {
            if (active) setLoading(false);
          });
      } else {
        if (active) setSuggestions([]);
        setLoading(false);
      }
    } else {
      setSuggestions([]);
    }
    return () => { active = false; };
  }, [search]);

  const handleSuggestionSelect = async (item: any) => {
    setSearch(item.name);
    setSuggestions([]);
    if (item.coordinate) {
      setRegion({
        latitude: item.coordinate.latitude,
        longitude: item.coordinate.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
      mapRef.current?.animateToRegion({
        latitude: item.coordinate.latitude,
        longitude: item.coordinate.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 1000);
    }
  };

  const goToMyLocation = async () => {
    let location = await Location.getCurrentPositionAsync({});
    setRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
    mapRef.current?.animateToRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    }, 1000);
  };

  return (
    <View style={{ flex: 1, width: '100%', alignItems: 'center' }}>
      <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', padding: 8, backgroundColor: theme.colors.background.card, borderRadius: 12, marginBottom: 8, marginTop: 8 }}>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Buscar dirección o lugar"
          style={{ flex: 1, fontSize: 16, color: theme.colors.text.primary, padding: 8 }}
          placeholderTextColor={theme.colors.text.secondary}
        />
        <TouchableOpacity onPress={goToMyLocation} style={{ marginLeft: 8 }}>
          <Ionicons name="locate" size={22} color={theme.colors.primary[500]} />
        </TouchableOpacity>
        {loading && <ActivityIndicator size="small" color={theme.colors.primary[500]} style={{ marginLeft: 8 }} />}
      </View>
      {/* Sugerencias de autocompletado */}
      {suggestions.length > 0 && (
        <View style={{ width: '100%', backgroundColor: theme.colors.background.card, borderRadius: 12, maxHeight: 180, marginBottom: 8 }}>
          <FlatList
            data={suggestions}
            keyExtractor={(item) => item.id || item.name}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleSuggestionSelect(item)} style={{ padding: 12, borderBottomWidth: 1, borderBottomColor: theme.colors.border.secondary }}>
                <Text style={{ color: theme.colors.text.primary }}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
      {typeof Location.searchPlacesAsync !== 'function' && (
        <Text style={{ color: theme.colors.error[500], marginBottom: 8 }}>
          El autocompletado de direcciones no está disponible en este entorno Expo.
        </Text>
      )}
      <View style={{ width: '100%', height: 300, borderRadius: 16, overflow: 'hidden', marginBottom: 12 }}>
        {region ? (
          <MapView
            ref={mapRef}
            style={{ flex: 1 }}
            initialRegion={region}
            region={region}
            onRegionChangeComplete={setRegion}
          >
            <Marker coordinate={{ latitude: region.latitude, longitude: region.longitude }} />
          </MapView>
        ) : (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color={theme.colors.primary[500]} />
          </View>
        )}
      </View>
      <TouchableOpacity
        style={{ backgroundColor: theme.colors.primary[500], borderRadius: 12, padding: 14, alignItems: 'center', width: '80%' }}
        onPress={() => {
          if (region) {
            const locStr = `${region.latitude},${region.longitude}`;
            onChange(locStr);
            onConfirm(locStr);
          }
        }}
      >
        <Text style={{ color: theme.colors.text.inverse, fontWeight: 'bold' }}>Confirmar ubicación</Text>
      </TouchableOpacity>
    </View>
  );
};

const ShareMusician = () => {
  const { theme, hourFormat } = useTheme();
  const { user } = useUser();
  const insets = useSafeAreaInsets();
  const [currentStep, setCurrentStep] = useState(0);
  const [form, setForm] = useState<any>({
    eventType: '',
    instrument: '',
    date: '',
    startTime: '',
    endTime: '',
    location: '', // Siempre string vacío al inicio
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [requestData, setRequestData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [locationMode, setLocationMode] = useState<'text' | 'map'>('text');
  // DateTimePicker states
  const [pickerVisible, setPickerVisible] = useState(false);
  const [pickerMode, setPickerMode] = useState<'date' | 'time'>('date');
  const [pickerKey, setPickerKey] = useState<string>('');
  // CustomDatePickerModal states
  const [customDatePickerVisible, setCustomDatePickerVisible] = useState(false);
  const [customDatePickerKey, setCustomDatePickerKey] = useState<'date'>('date');
  // CustomTimePickerModal states
  const [customTimePickerVisible, setCustomTimePickerVisible] = useState(false);
  const [customTimePickerKey, setCustomTimePickerKey] = useState<'startTime' | 'endTime'>('startTime');

  useEffect(() => {
    if (locationMode === 'text' && typeof form.location !== 'string') {
      setForm((prev: any) => ({ ...prev, location: '' }));
    }
  }, [locationMode, form.location]);

  useEffect(() => {
    if (user?.userEmail) {
      registerSocketUser(user.userEmail);
    }
  }, [user]);

  const handleOptionSelect = (value: string) => {
    setForm({ ...form, [steps[currentStep].key]: value });
    setTimeout(() => setCurrentStep((prev) => prev + 1), 200);
  };

  const handleInput = (value: string) => {
    setForm({ ...form, [steps[currentStep].key]: value });
  };

  const handleNext = () => setCurrentStep((prev) => prev + 1);
  const handleBack = () => setCurrentStep((prev) => prev - 1);

  const handleSubmit = async () => {
    if (!user || !user.userEmail) {
      Alert.alert('Error', 'Debes iniciar sesión para solicitar un músico.');
      return;
    }
    setIsLoading(true);
    try {
      const payload = {
        eventName: form.eventName,
        eventType: form.eventType,
        date: typeof form.date === 'string' ? form.date : form.date?.toISOString().split('T')[0],
        time: `${form.startTime} - ${form.endTime}`,
        location: {
          address: typeof form.location === 'string' ? form.location : '',
          city: '',
          latitude: 0,
          longitude: 0,
          googleMapsUrl: '',
        },
        duration: 60, // 1 hora por defecto
        instrument: form.instrument,
        budget: 0,
        minBudget: 0,
        maxBudget: 0,
        description: '',
        user: user.userEmail,
      };
      const response = await eventService.createEventRequest(payload);
      if (response && response.data && response.data.id) {
        setRequestData({ ...payload, id: response.data.id });
        setModalVisible(true);
      } else {
        throw new Error(response?.message || 'No se pudo crear la solicitud.');
      }
    } catch (error: any) {
      Alert.alert('Error al Crear Solicitud', error.message || 'No se pudo crear la solicitud.');
    } finally {
      setIsLoading(false);
    }
  };

  // UI para cada paso
  const renderStep = () => {
    const step = steps[currentStep];
    if (step.options) {
      return (
        <View style={{ marginTop: 24 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: theme.colors.text.primary, marginBottom: 20, textAlign: 'center' }}>{step.label}</Text>
          {step.options.map((opt) => (
            <TouchableOpacity
              key={opt.value}
              style={{
                backgroundColor: form[step.key] === opt.value ? theme.colors.primary[100] : theme.colors.background.card,
                borderRadius: 16,
                paddingVertical: 16,
                paddingHorizontal: 12,
                marginBottom: 14,
                flexDirection: 'row',
                alignItems: 'center',
                borderWidth: form[step.key] === opt.value ? 2 : 1,
                borderColor: form[step.key] === opt.value ? theme.colors.primary[500] : theme.colors.border.secondary,
                width: '100%',
                minWidth: 0,
                maxWidth: '100%',
              }}
              onPress={() => handleOptionSelect(opt.value)}
              activeOpacity={0.85}
            >
              <Ionicons name={opt.icon as any} size={24} color={theme.colors.primary[500]} style={{ marginRight: 14 }} />
              <Text style={{ fontSize: 16, color: theme.colors.text.primary, flexShrink: 1 }}>{opt.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      );
    }
    if (step.type === 'date') {
      const value = form[step.key];
      return (
        <View style={{ marginTop: 24 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: theme.colors.text.primary, marginBottom: 20, textAlign: 'center' }}>{step.label}</Text>
          <TouchableOpacity
            style={{
              backgroundColor: theme.colors.background.card,
              borderRadius: 16,
              padding: 16,
              alignItems: 'center',
              borderWidth: 1,
              borderColor: theme.colors.border.secondary,
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'center',
            }}
            onPress={() => {
              setCustomDatePickerKey(step.key as 'date');
              setCustomDatePickerVisible(true);
            }}
            activeOpacity={0.85}
          >
            <Ionicons name="calendar" size={24} color={theme.colors.primary[500]} style={{ marginRight: 12 }} />
            <Text style={{ fontSize: 16, color: theme.colors.text.primary }}>
              {value ? formatDate(value) : 'Seleccionar fecha'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ marginTop: 24, alignSelf: 'flex-end' }}
            onPress={handleNext}
            disabled={!form[step.key]}
          >
            <Text style={{ color: theme.colors.primary[500], fontWeight: 'bold', fontSize: 16 }}>Siguiente</Text>
          </TouchableOpacity>
          <CustomDatePickerModal
            visible={customDatePickerVisible && customDatePickerKey === step.key}
            onClose={() => setCustomDatePickerVisible(false)}
            onConfirm={(date) => {
              setForm({ ...form, [step.key]: date.toISOString().split('T')[0] });
              setCustomDatePickerVisible(false);
            }}
            initialDate={form[step.key] ? new Date(form[step.key]) : new Date()}
          />
        </View>
      );
    }
    if (step.type === 'time') {
      const value = form[step.key];
      return (
        <View style={{ marginTop: 24 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: theme.colors.text.primary, marginBottom: 20, textAlign: 'center' }}>{step.label}</Text>
          <TouchableOpacity
            style={{
              backgroundColor: theme.colors.background.card,
              borderRadius: 16,
              padding: 16,
              alignItems: 'center',
              borderWidth: 1,
              borderColor: theme.colors.border.secondary,
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'center',
            }}
            onPress={() => {
              setCustomTimePickerKey(step.key as 'startTime' | 'endTime');
              setCustomTimePickerVisible(true);
            }}
            activeOpacity={0.85}
          >
            <Ionicons name={'time'} size={24} color={theme.colors.primary[500]} style={{ marginRight: 12 }} />
            <Text style={{ fontSize: 16, color: theme.colors.text.primary }}>
              {value ? formatTime(value) : 'Seleccionar hora'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ marginTop: 24, alignSelf: 'flex-end' }}
            onPress={handleNext}
            disabled={!form[step.key]}
          >
            <Text style={{ color: theme.colors.primary[500], fontWeight: 'bold', fontSize: 16 }}>Siguiente</Text>
          </TouchableOpacity>
          <CustomTimePickerModal
            visible={customTimePickerVisible && customTimePickerKey === step.key}
            onClose={() => setCustomTimePickerVisible(false)}
            onConfirm={(hour, minute, ampm) => {
              let val = '';
              if (hourFormat === '24h') {
                val = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
              } else {
                let h = hour;
                if (ampm === 'PM' && h < 12) h += 12;
                if (ampm === 'AM' && h === 12) h = 0;
                val = `${h.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
              }
              setForm({ ...form, [step.key]: val });
            }}
            hourFormat={hourFormat}
          />
        </View>
      );
    }
    if (step.type === 'location') {
      return (
        <View style={{ marginTop: 24, width: '100%', alignItems: 'center' }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: theme.colors.text.primary, marginBottom: 20, textAlign: 'center' }}>{step.label}</Text>
          <LocationMapPicker
            value={form.location}
            onChange={(val) => setForm({ ...form, location: val })}
            onConfirm={handleNext}
            theme={theme}
          />
        </View>
      );
    }
    return null;
  };

  // Resumen final
  const renderSummary = () => {
    return (
      <View style={{ marginTop: 24, alignItems: 'center', width: '100%' }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: theme.colors.text.primary, marginBottom: 20, textAlign: 'center' }}>Resumen de tu solicitud</Text>
        {steps.map((step) => {
          let iconName: string = 'information-circle';
          if (step.options && form[step.key]) {
            const selected = step.options.find(opt => opt.value === form[step.key]);
            if (selected) iconName = selected.icon;
          }
          let displayValue = form[step.key];
          if (step.type === 'date') displayValue = formatDate(form[step.key]);
          if (step.type === 'time') displayValue = formatTime(form[step.key]);
          return (
            <View key={step.key} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, width: '100%' }}>
              <Ionicons name={iconName as any} size={18} color={theme.colors.primary[500]} style={{ marginRight: 8 }} />
              <Text style={{ fontSize: 15, color: theme.colors.text.primary }}>{step.label}: </Text>
              <Text style={{ fontSize: 15, color: theme.colors.text.secondary, marginLeft: 4, flexShrink: 1 }}>{displayValue}</Text>
            </View>
          );
        })}
        <TouchableOpacity
          style={{ backgroundColor: theme.colors.primary[500], borderRadius: 16, padding: 16, marginTop: 24, width: '80%', alignItems: 'center' }}
          onPress={handleSubmit}
          disabled={isLoading}
          activeOpacity={0.85}
        >
          <Text style={{ color: theme.colors.text.inverse, fontSize: 17, fontWeight: 'bold' }}>{isLoading ? 'Enviando...' : 'Solicitar Músico'}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const progress = (currentStep + 1) / (steps.length + 1);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.colors.background.primary }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={insets.top + 64}
    >
      <LinearGradient
        colors={theme.gradients.primary}
        style={{ paddingTop: insets.top + 52, paddingHorizontal: 16, paddingBottom: 12, borderBottomLeftRadius: 32, borderBottomRightRadius: 32 }}
      >
        <View style={{ paddingBottom: 8, alignItems: 'center', width: '100%' }}>
          <View style={{ backgroundColor: theme.colors.primary[500], borderRadius: 48, padding: 18, marginBottom: 12 }}>
            <Ionicons name="musical-notes" size={36} color={theme.colors.text.inverse} />
          </View>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: theme.colors.text.inverse, marginBottom: 4, textAlign: 'center' }}>Solicitar Músico</Text>
          <Text style={{ fontSize: 15, color: theme.colors.text.inverse, textAlign: 'center', maxWidth: 320 }}>
            Completa el formulario paso a paso. Solo responde una pregunta a la vez.
          </Text>
        </View>
        <View style={{ height: 8, backgroundColor: theme.colors.background.card, borderRadius: 4, marginTop: 12, marginBottom: 8, width: '100%' }}>
          <View style={{ height: 8, backgroundColor: theme.colors.primary[500], borderRadius: 4, width: `${progress * 100}%` }} />
        </View>
      </LinearGradient>
      <ScrollView
        contentContainerStyle={{ alignItems: 'center', justifyContent: 'flex-start', flexGrow: 1, paddingBottom: 32 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            width: '100%',
            maxWidth: MAX_FORM_WIDTH,
            backgroundColor: theme.colors.background.card,
            borderRadius: 20,
            padding: SCREEN_WIDTH < 400 ? 12 : 24,
            marginTop: 24,
            marginBottom: 16,
            borderWidth: 2,
            borderColor: theme.colors.border.primary,
            shadowColor: theme.shadows.medium.shadowColor,
            shadowOffset: theme.shadows.medium.shadowOffset,
            shadowOpacity: theme.shadows.medium.shadowOpacity,
            shadowRadius: theme.shadows.medium.shadowRadius,
            elevation: theme.shadows.medium.elevation,
            minWidth: 0,
          }}
        >
          {currentStep < steps.length ? renderStep() : renderSummary()}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 28, width: '100%' }}>
            {currentStep > 0 && (
              <TouchableOpacity onPress={handleBack} style={{ padding: 12, borderRadius: 12, backgroundColor: theme.colors.primary[100], minWidth: 48, alignItems: 'center' }}>
                <Ionicons name="arrow-back" size={20} color={theme.colors.primary[700]} />
              </TouchableOpacity>
            )}
            {currentStep < steps.length - 1 && (
              <TouchableOpacity onPress={handleNext} style={{ padding: 12, borderRadius: 12, backgroundColor: theme.colors.primary[500], minWidth: 48, alignItems: 'center' }}>
                <Ionicons name="arrow-forward" size={20} color={theme.colors.text.inverse} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
      <SearchingMusicianModal
        visible={modalVisible}
        requestData={requestData}
        onClose={() => setModalVisible(false)}
      />
    </KeyboardAvoidingView>
  );
};

declare module 'expo-location' {
  interface Location {
    searchPlacesAsync?: (query: string, options?: any, limit?: number) => Promise<any[]>;
  }
}

export default ShareMusician;
