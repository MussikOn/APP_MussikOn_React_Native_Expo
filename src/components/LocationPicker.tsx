import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@contexts/ThemeContext';

interface LocationPickerProps {
  value: string;
  onLocationChange: (address: string, city: string, latitude: number, longitude: number) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
}

const LocationPicker: React.FC<LocationPickerProps> = ({
  value,
  onLocationChange,
  placeholder = 'Seleccionar ubicación',
  required = false,
  error
}) => {
  const { theme } = useTheme();
  const [showMapModal, setShowMapModal] = useState(false);

  const handleLocationSelect = () => {
    // Por ahora, simulamos la selección de ubicación
    // En una implementación real, aquí se abriría un mapa
    Alert.alert(
      'Selección de Ubicación',
      'Esta funcionalidad se implementará con React Native Maps. Por ahora, puedes ingresar la dirección manualmente.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Simular Selección', 
          onPress: () => {
            // Simular datos de ubicación
            onLocationChange(
              'Calle Principal 123',
              'Santo Domingo',
              18.4861,
              -69.9312
            );
            setShowMapModal(false);
          }
        }
      ]
    );
  };

  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={{ 
        fontSize: 16, 
        fontWeight: 'bold', 
        color: theme.colors.text.primary, 
        marginBottom: 8 
      }}>
        Ubicación {required && <Text style={{ color: theme.colors.error[500] }}>*</Text>}
      </Text>
      
      <TouchableOpacity
        style={{
          borderWidth: 1,
          borderColor: error ? theme.colors.error[500] : theme.colors.border.primary,
          borderRadius: 12,
          padding: 16,
          backgroundColor: theme.colors.background.primary,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
        onPress={handleLocationSelect}
      >
        <View style={{ flex: 1 }}>
          <Text style={{ 
            color: value ? theme.colors.text.primary : theme.colors.text.tertiary,
            fontSize: 16,
          }}>
            {value || placeholder}
          </Text>
          {value && (
            <Text style={{ 
              color: theme.colors.text.secondary,
              fontSize: 12,
              marginTop: 2
            }}>
              📍 Ubicación seleccionada
            </Text>
          )}
        </View>
        <Ionicons name="location" size={20} color={theme.colors.primary[500]} />
      </TouchableOpacity>
      
      {error && (
        <Text style={{ 
          color: theme.colors.error[500], 
          fontSize: 12, 
          marginTop: 4 
        }}>
          {error}
        </Text>
      )}
    </View>
  );
};

export default LocationPicker; 