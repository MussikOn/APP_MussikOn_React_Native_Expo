import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Platform,
  Linking,
  Animated,
  Modal,
  Share,
} from "react-native";
import MapView, { Region } from "react-native-maps";
import * as Location from "expo-location";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  bg_primary,
  color_white,
  color_success,
  color_danger,
  color_info,
} from '@styles/Styles';

/**
 * @interface LatLng
 * @description Define la estructura para un par de coordenadas geográficas.
 */
interface LatLng {
  latitude: number;
  longitude: number;
}

interface Props {
  visible: boolean;
  onClose: () => void;
  onLocationSelect: (location: LatLng) => void;
}

const LocationPickerModal: React.FC<Props> = ({
  visible,
  onClose,
  onLocationSelect,
}) => {
  const insets = useSafeAreaInsets();
  const mapRef = useRef<MapView>(null);
  const [region, setRegion] = useState<Region | undefined>(undefined);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Hook para solicitar permisos y obtener la ubicación inicial del usuario al montar el componente.
  useEffect(() => {
    if (visible) {
      // Solo se ejecuta cuando el modal se hace visible
      (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setErrorMsg("Permiso para acceder a la ubicación fue denegado.");
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        const initialRegion = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };
        setRegion(initialRegion);
        mapRef.current?.animateToRegion(initialRegion, 1000);
      })();
    }
  }, [visible]);

  /**
   * Confirma la ubicación seleccionada (el centro actual del mapa).
   */
  const handleConfirm = () => {
    if (!region) return;
    const selectedLocation = {
      latitude: region.latitude,
      longitude: region.longitude,
    };
    onLocationSelect(selectedLocation);
    onClose();
  };

  /**
   * Comparte la ubicación actual del centro del mapa.
   */
  const handleShare = async () => {
    if (!region) return;
    const { latitude, longitude } = region;
    try {
      const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
      await Share.share({
        message: `¡Te comparto esta ubicación! Mírala en el mapa: ${url}`,
      });
    } catch (error: any) {
      Alert.alert(error.message);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {!region ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={bg_primary} />
            <Text style={styles.infoText}>
              {errorMsg || "Obteniendo tu ubicación..."}
            </Text>
          </View>
        ) : (
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={region}
            onRegionChangeComplete={setRegion} // Actualiza la región cuando el usuario mueve el mapa
            showsUserLocation
            showsMyLocationButton={false}
          />
        )}

        {/* Punto de mira central */}
        <View style={styles.crosshairContainer}>
          <MaterialCommunityIcons
            name="crosshairs-gps"
            size={40}
            color={bg_primary}
            style={styles.crosshairIcon}
          />
        </View>

        {/* Panel de control inferior */}
        <View
          style={[
            styles.controlsContainer,
            { paddingBottom: insets.bottom + 10 },
          ]}
        >
          <Text style={styles.instructions}>
            Mueve el mapa para seleccionar la ubicación
          </Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.shareButton]}
              onPress={handleShare}
            >
              <Ionicons
                name="share-social-outline"
                size={20}
                color={color_white}
              />
              <Text style={styles.buttonText}>Compartir</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.confirmButton]}
              onPress={handleConfirm}
            >
              <Ionicons
                name="checkmark-circle-outline"
                size={20}
                color={color_white}
              />
              <Text style={styles.buttonText}>Confirmar</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={onClose}
          >
            <Text style={[styles.buttonText, { color: bg_primary }]}>
              Cancelar
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  map: { ...StyleSheet.absoluteFillObject },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  infoText: { marginTop: 10, color: "#555", textAlign: "center" },
  crosshairContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    pointerEvents: "none",
  },
  crosshairIcon: {
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  controlsContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  instructions: {
    fontSize: 16,
    fontWeight: "600",
    color: bg_primary,
    textAlign: "center",
    marginBottom: 15,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  button: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: color_white,
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  confirmButton: { backgroundColor: bg_primary, flex: 1, marginLeft: 5 },
  shareButton: { backgroundColor: color_info, flex: 1, marginRight: 5 },
  cancelButton: { backgroundColor: "#e0e0e0", marginTop: 5 },
});

export default LocationPickerModal;
