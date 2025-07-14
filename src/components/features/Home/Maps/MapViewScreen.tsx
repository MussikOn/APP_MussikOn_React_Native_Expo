import React from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const MapViewScreen = () => {
  const region = {
    latitude: 40.7128, // Latitud
    longitude: -74.0060, // Longitud
    latitudeDelta: 0.0922, // Zoom en latitud
    longitudeDelta: 0.0421, // Zoom en longitud
  };

  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={region}>
        <Marker coordinate={{ latitude: 40.7128, longitude: -74.0060 }} title="Ubicación" description="Este es un marcador" />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});

export default MapViewScreen;
