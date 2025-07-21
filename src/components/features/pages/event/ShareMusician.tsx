import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View, Alert, StyleSheet } from "react-native";
import AnimatedBackground from '@components/ui/styles/AnimatedBackground';
import { bg_dark, bg_primary, bg_white, color_primary } from '@styles/Styles';
import MusicianRequestForm from '@components/forms/MusicianRequestForm';
import { Ionicons } from '@expo/vector-icons';
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

const ShareMusician = ({ navigation }: any) => {
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
              // Navegar a la lista de solicitudes
              if (navigation) {
                navigation.navigate('EventList');
              }
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
    <>
      <ScrollView style={styles.container}>
        <AnimatedBackground />
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Solicitar Músico</Text>
          <Text style={styles.subtitle}>
            Completa el formulario para solicitar un músico para tu evento
          </Text>
        </View>

        {/* Formulario */}
        <View style={styles.formContainer}>
          <MusicianRequestForm 
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </View>

        {/* Información adicional */}
        <View style={styles.infoContainer}>
          <View style={styles.infoCard}>
            <Ionicons name="information-circle" size={24} color={color_primary} />
            <Text style={styles.infoText}>
              Los músicos recibirán tu solicitud y podrán responder con sus propuestas.
            </Text>
          </View>
          
          <View style={styles.infoCard}>
            <Ionicons name="time" size={24} color={color_primary} />
            <Text style={styles.infoText}>
              El precio se calcula automáticamente según el tipo de evento y duración.
            </Text>
          </View>

          <View style={styles.infoCard}>
            <Ionicons name="shield-checkmark" size={24} color={color_primary} />
            <Text style={styles.infoText}>
              Todas las solicitudes son verificadas y procesadas de forma segura.
            </Text>
          </View>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: 'center',
  },
  title: {
    color: bg_primary,
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  formContainer: {
    flex: 1,
  },
  infoContainer: {
    padding: 20,
    paddingTop: 0,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  infoText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

export default ShareMusician;
