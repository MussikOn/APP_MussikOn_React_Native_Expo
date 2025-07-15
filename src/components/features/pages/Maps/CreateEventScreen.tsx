import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import LocationPickerModal from './LocationPickerModal';
import { bg_primary, color_white } from '@styles/Styles';

interface LatLng {
  latitude: number;
  longitude: number;
}

const CreateEventScreen = () => {
  const insets = useSafeAreaInsets();
  const [modalVisible, setModalVisible] = useState(false);
  const [eventLocation, setEventLocation] = useState<LatLng | null>(null);

  const handleLocationSelected = (location: LatLng) => {
    console.log("Ubicación seleccionada para el evento:", location);
    setEventLocation(location);
    Alert.alert("Ubicación Guardada", `Lat: ${location.latitude.toFixed(4)}, Lon: ${location.longitude.toFixed(4)}`);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <Text style={styles.title}>Agendar Evento</Text>
      
      <View style={styles.locationContainer}>
        <Text style={styles.label}>Ubicación del Evento:</Text>
        {eventLocation ? (
          <Text style={styles.locationText}>
            {`Lat: ${eventLocation.latitude.toFixed(4)}, Lon: ${eventLocation.longitude.toFixed(4)}`}
          </Text>
        ) : (
          <Text style={styles.locationPlaceholder}>Aún no has seleccionado una ubicación.</Text>
        )}
      </View>

      <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
        <Ionicons name="map-outline" size={20} color={color_white} />
        <Text style={styles.buttonText}>Seleccionar Ubicación en el Mapa</Text>
      </TouchableOpacity>

      <LocationPickerModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onLocationSelect={handleLocationSelected}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f4f6f8' },
  title: { fontSize: 28, fontWeight: 'bold', color: bg_primary, marginBottom: 30 },
  locationContainer: { marginBottom: 20, padding: 15, backgroundColor: color_white, borderRadius: 10 },
  label: { fontSize: 16, fontWeight: '600', color: '#555' },
  locationText: { fontSize: 16, color: bg_primary, marginTop: 5 },
  locationPlaceholder: { fontSize: 16, color: '#999', fontStyle: 'italic', marginTop: 5 },
  button: { flexDirection: 'row', backgroundColor: bg_primary, padding: 15, borderRadius: 10, alignItems: 'center', justifyContent: 'center', elevation: 3 },
  buttonText: { color: color_white, fontSize: 16, fontWeight: 'bold', marginLeft: 10 },
});

export default CreateEventScreen;