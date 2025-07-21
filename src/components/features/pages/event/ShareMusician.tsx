import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View, Alert, StyleSheet } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import MusicianRequestForm from '@components/forms/MusicianRequestForm';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSidebar } from '@contexts/SidebarContext';
import musicianRequestsAPI, { CreateMusicianRequestData } from '@services/musicianRequests';

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
    <View style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.gradientBackground}
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Solicitar Músico</Text>
          <Text style={styles.subtitle}>
            Completa el formulario para solicitar un músico para tu evento
          </Text>
        </View>

        {/* Formulario */}
        <View style={styles.formContainer}>
          <MusicianRequestForm onSubmit={handleSubmit} isLoading={isLoading} />
        </View>
      </ScrollView>
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
