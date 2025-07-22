import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View, Alert, StyleSheet } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import MusicianRequestForm from '@components/forms/MusicianRequestForm';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSidebar } from '@contexts/SidebarContext';
import { useTheme } from '@contexts/ThemeContext';
import { requestMusician } from '@services/api';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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

const ShareMusician = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const insets = useSafeAreaInsets();

  const handleSubmit = async (values: MusicianRequestFormValues, calculatedPrice: number) => {
    setIsLoading(true);
    try {
      // Preparar datos para el backend
      const requestData: any = {
        eventName: values.eventName,
        eventType: values.eventType,
        date: values.eventDate?.toISOString?.() || '',
        time: values.startTime,
        location: values.location,
        duration: '', // Puedes calcularlo si tienes endTime
        instrument: values.instrumentType,
        bringInstrument: false, // Puedes agregarlo al formulario si lo necesitas
        comment: values.eventDescription,
        budget: calculatedPrice.toString(),
        flyerUrl: values.flyerImage || '',
        songs: [], // Puedes agregar selección de canciones si lo deseas
        recommendations: [],
        mapsLink: '',
      };
      // Llamada real al backend
      const response = await requestMusician(requestData);
      if (response && response.success) {
        Alert.alert(
          '¡Solicitud Creada Exitosamente!',
          `Tu solicitud de músico ha sido creada y está siendo procesada.\n\nPrecio calculado: RD$ ${calculatedPrice.toLocaleString()}\n\nID de solicitud: ${response.data?.id || 'N/A'}`,
          [
            {
              text: 'Ver Mis Solicitudes',
              onPress: () => {},
            },
            {
              text: 'Crear Otra',
              style: 'cancel',
              onPress: () => {},
            },
          ]
        );
      } else {
        throw new Error(response?.message || 'No se pudo crear la solicitud.');
      }
    } catch (error: any) {
      console.error('Error creating request:', error);
      let errorMessage = 'No se pudo crear la solicitud. Por favor, intenta de nuevo.';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      Alert.alert('Error al Crear Solicitud', errorMessage, [{ text: 'OK' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background.primary }}>
      {/* Header visual moderno con gradiente */}
      <LinearGradient
        colors={theme.gradients.primary}
        style={{ paddingTop: insets.top + 52, paddingHorizontal: 24, paddingBottom: 16, borderBottomLeftRadius: 32, borderBottomRightRadius: 32 }}
      >
        <View style={{ paddingBottom: 8, alignItems: 'center' }}>
          <View style={{ backgroundColor: theme.colors.primary[500], borderRadius: 48, padding: 18, marginBottom: 12 }}>
            <Ionicons name="musical-notes" size={40} color={theme.colors.text.inverse} />
          </View>
          <Text style={{ fontSize: 28, fontWeight: 'bold', color: theme.colors.text.inverse, marginBottom: 4 }}>Solicitar Músico</Text>
          <Text style={{ fontSize: 16, color: theme.colors.text.inverse, textAlign: 'center', maxWidth: 320 }}>
            Completa el formulario en segundos. Selecciona tus opciones y recibe tu músico ideal.
          </Text>
        </View>
      </LinearGradient>
      {/* Card visual del formulario */}
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start' }}>
        <View style={{
          width: '95%',
          maxWidth: 420,
          backgroundColor: theme.colors.background.card,
          borderRadius: 20,
          padding: 24,
          marginBottom: 16,
          borderWidth: 2,
          borderColor: theme.colors.border.primary,
          shadowColor: theme.shadows.medium.shadowColor,
          shadowOffset: theme.shadows.medium.shadowOffset,
          shadowOpacity: theme.shadows.medium.shadowOpacity,
          shadowRadius: theme.shadows.medium.shadowRadius,
          elevation: theme.shadows.medium.elevation,
        }}>
          <MusicianRequestForm onSubmit={handleSubmit} isLoading={isLoading} />
        </View>
      </View>
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
  scrollView: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 22,
  },
  formContainer: {
    padding: 20,
    paddingTop: 0,
  },
});

export default ShareMusician;
