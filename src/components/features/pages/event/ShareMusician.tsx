import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView, Dimensions, Platform, KeyboardAvoidingView } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@contexts/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SearchingMusicianModal from '@components/features/pages/solicitudMusico/SearchingMusicianModal';
import { createMusicianRequest } from '@services/musicianRequests';
import DateTimeSelector from '@components/ui/DateTimeSelector';
import Input from '@components/ui/Input';
import LocationPickerModal from '@components/features/pages/Maps/LocationPickerModal';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const MAX_FORM_WIDTH = 420;

const steps = [
  {
    key: 'eventType',
    label: '¿Qué tipo de evento vas a realizar?',
    options: [
      { label: 'Culto', value: 'culto', icon: 'ios-people' },
      { label: 'Campaña', value: 'campana', icon: 'ios-megaphone' },
      { label: 'Concierto', value: 'concierto', icon: 'musical-notes' },
      { label: 'Otro', value: 'otro', icon: 'ellipsis-horizontal' },
    ],
  },
  {
    key: 'instrument',
    label: '¿Qué instrumento necesitas?',
    options: [
      { label: 'Piano', value: 'piano', icon: 'musical-notes' },
      { label: 'Guitarra', value: 'guitarra', icon: 'guitar-outline' },
      { label: 'Batería', value: 'bateria', icon: 'drum-outline' },
      { label: 'Voz', value: 'voz', icon: 'mic-outline' },
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

const ShareMusician = () => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [currentStep, setCurrentStep] = useState(0);
  const [form, setForm] = useState<any>({});
  const [modalVisible, setModalVisible] = useState(false);
  const [requestData, setRequestData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [locationMode, setLocationMode] = useState<'text' | 'map'>('text');

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
    setIsLoading(true);
    try {
      const payload = {
        userId: 'userId_placeholder',
        eventType: form.eventType,
        instrument: form.instrument,
        date: form.date,
        startTime: form.startTime,
        endTime: form.endTime,
        location: form.location,
        budget: 0,
        comments: '',
      };
      const response = await createMusicianRequest(payload);
      if (response && response.id) {
        setRequestData({ ...payload, id: response.id });
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
      return (
        <View style={{ marginTop: 24 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: theme.colors.text.primary, marginBottom: 20, textAlign: 'center' }}>{step.label}</Text>
          <DateTimeSelector
            value={form.date || ''}
            onValueChange={(val) => setForm({ ...form, date: val })}
            mode="date"
            placeholder="Seleccionar fecha"
          />
          <TouchableOpacity
            style={{ marginTop: 24, alignSelf: 'flex-end' }}
            onPress={handleNext}
            disabled={!form.date}
          >
            <Text style={{ color: theme.colors.primary[500], fontWeight: 'bold', fontSize: 16 }}>Siguiente</Text>
          </TouchableOpacity>
        </View>
      );
    }
    if (step.type === 'time') {
      return (
        <View style={{ marginTop: 24 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: theme.colors.text.primary, marginBottom: 20, textAlign: 'center' }}>{step.label}</Text>
          <DateTimeSelector
            value={form[step.key] || ''}
            onValueChange={(val) => setForm({ ...form, [step.key]: val })}
            mode="time"
            placeholder="Seleccionar hora"
          />
          <TouchableOpacity
            style={{ marginTop: 24, alignSelf: 'flex-end' }}
            onPress={handleNext}
            disabled={!form[step.key]}
          >
            <Text style={{ color: theme.colors.primary[500], fontWeight: 'bold', fontSize: 16 }}>Siguiente</Text>
          </TouchableOpacity>
        </View>
      );
    }
    if (step.type === 'location') {
      return (
        <View style={{ marginTop: 24 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: theme.colors.text.primary, marginBottom: 20, textAlign: 'center' }}>{step.label}</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 16 }}>
            <TouchableOpacity
              style={{
                backgroundColor: locationMode === 'text' ? theme.colors.primary[100] : theme.colors.background.card,
                borderRadius: 12,
                padding: 10,
                marginRight: 8,
                borderWidth: 1,
                borderColor: locationMode === 'text' ? theme.colors.primary[500] : theme.colors.border.secondary,
              }}
              onPress={() => setLocationMode('text')}
            >
              <Ionicons name="search" size={18} color={theme.colors.primary[500]} />
              <Text style={{ marginLeft: 6, color: theme.colors.text.primary }}>Buscar por texto</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: locationMode === 'map' ? theme.colors.primary[100] : theme.colors.background.card,
                borderRadius: 12,
                padding: 10,
                borderWidth: 1,
                borderColor: locationMode === 'map' ? theme.colors.primary[500] : theme.colors.border.secondary,
              }}
              onPress={() => setLocationMode('map')}
            >
              <Ionicons name="map" size={18} color={theme.colors.primary[500]} />
              <Text style={{ marginLeft: 6, color: theme.colors.text.primary }}>Seleccionar en mapa</Text>
            </TouchableOpacity>
          </View>
          {locationMode === 'text' ? (
            <Input
              label="Dirección del evento"
              value={form.location || ''}
              onChangeText={(val) => setForm({ ...form, location: val })}
              placeholder="Ej: Iglesia Central, Santo Domingo"
              leftIcon="location-outline"
            />
          ) : (
            <>
              <TouchableOpacity
                style={{ backgroundColor: theme.colors.primary[500], borderRadius: 12, padding: 14, alignItems: 'center', marginTop: 8 }}
                onPress={() => setShowLocationModal(true)}
              >
                <Ionicons name="map" size={20} color={theme.colors.text.inverse} />
                <Text style={{ color: theme.colors.text.inverse, fontWeight: 'bold', marginTop: 4 }}>Abrir mapa</Text>
              </TouchableOpacity>
              <Text style={{ marginTop: 12, color: theme.colors.text.secondary, fontSize: 13 }}>
                {form.location ? `Ubicación seleccionada: ${form.location}` : 'No se ha seleccionado ubicación.'}
              </Text>
            </>
          )}
          <TouchableOpacity
            style={{ marginTop: 24, alignSelf: 'flex-end' }}
            onPress={handleNext}
            disabled={!form.location}
          >
            <Text style={{ color: theme.colors.primary[500], fontWeight: 'bold', fontSize: 16 }}>Siguiente</Text>
          </TouchableOpacity>
          <LocationPickerModal
            visible={showLocationModal}
            onClose={() => setShowLocationModal(false)}
            onLocationSelect={(loc) => {
              setForm({ ...form, location: `${loc.latitude},${loc.longitude}` });
              setShowLocationModal(false);
            }}
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
          return (
            <View key={step.key} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, width: '100%' }}>
              <Ionicons name={iconName as any} size={18} color={theme.colors.primary[500]} style={{ marginRight: 8 }} />
              <Text style={{ fontSize: 15, color: theme.colors.text.primary }}>{step.label}: </Text>
              <Text style={{ fontSize: 15, color: theme.colors.text.secondary, marginLeft: 4, flexShrink: 1 }}>{form[step.key]}</Text>
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

export default ShareMusician;
