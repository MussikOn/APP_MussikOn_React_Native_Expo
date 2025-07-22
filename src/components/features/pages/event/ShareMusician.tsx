import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View, Alert, StyleSheet } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import MusicianRequestForm from '@components/forms/MusicianRequestForm';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSidebar } from '@contexts/SidebarContext';
import musicianRequestsAPI, { CreateMusicianRequestData } from '@services/musicianRequests';
import { useTheme } from '@contexts/ThemeContext';

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
  const { setActiveScreen } = useSidebar();
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (values: MusicianRequestFormValues, calculatedPrice: number) => {
    setIsLoading(true);
    
    try {
      // Preparar datos para el backend
      const requestData: CreateMusicianRequestData = {
        eventName: values.eventName,
        eventType: values.eventType,
        eventDate: values.eventDate,
        startTime: values.startTime,
        endTime: values.endTime,
        location: values.location,
        instrumentType: values.instrumentType,
        eventDescription: values.eventDescription,
        flyerImage: values.flyerImage,
      };

      // Enviar solicitud al backend
      const createdRequest = await musicianRequestsAPI.createRequest(requestData);

      Alert.alert(
        '¡Solicitud Creada Exitosamente!',
        `Tu solicitud de músico ha sido creada y está siendo procesada.\n\nPrecio calculado: RD$ ${calculatedPrice.toLocaleString()}\n\nID de solicitud: ${createdRequest.id}`,
        [
          {
            text: 'Ver Mis Solicitudes',
            onPress: () => {
              // Usar el sistema del sidebar para navegar
              setActiveScreen('RequestList');
            }
          },
          {
            text: 'Crear Otra',
            style: 'cancel',
            onPress: () => {
              // Resetear el formulario para crear otra solicitud
              // Esto se manejará en el formulario
            }
          }
        ]
      );

    } catch (error: any) {
      console.error('Error creating request:', error);
      
      let errorMessage = 'No se pudo crear la solicitud. Por favor, intenta de nuevo.';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      Alert.alert(
        'Error al Crear Solicitud',
        errorMessage,
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background.primary }}>
      {/* Header visual moderno */}
      <View style={{ alignItems: 'center', paddingTop: 48, paddingBottom: 16 }}>
        <View style={{ backgroundColor: theme.colors.primary[500], borderRadius: 48, padding: 18, marginBottom: 12 }}>
          <Ionicons name="musical-notes" size={40} color={theme.colors.text.inverse} />
        </View>
        <Text style={{ fontSize: 28, fontWeight: 'bold', color: theme.colors.text.primary, marginBottom: 4 }}>Solicitar Músico</Text>
        <Text style={{ fontSize: 16, color: theme.colors.text.secondary, textAlign: 'center', maxWidth: 320 }}>
          Completa el formulario en segundos. Selecciona tus opciones y recibe tu músico ideal.
          </Text>
        </View>

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
          <Text style={{ color: theme.colors.text.primary, marginBottom: 12, textAlign: 'center' }}>DEBUG: El formulario se está montando</Text>
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
