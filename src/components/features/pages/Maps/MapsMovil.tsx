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
import MapView, { Marker, Region } from "react-native-maps";
import * as Location from "expo-location";
import { Audio } from "expo-av";
import MapViewDirections from "react-native-maps-directions";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  bg_primary,
  color_white,
  color_success,
  color_danger,
  color_info,
} from "@styles/Styles";

// ¡IMPORTANTE! Reemplaza esta clave con tu propia API Key de Google Maps con la API "Directions" habilitada.
// ¡ADVERTENCIA DE SEGURIDAD! No expongas tu API Key directamente en el código.
// Utiliza variables de entorno para protegerla.
const GOOGLE_MAPS_API_KEY = "TU_API_KEY_DE_GOOGLE_MAPS_AQUI"; // Reemplaza esto
/**
 * @interface LatLng
 * @description Define la estructura para un par de coordenadas geográficas.
 */
interface LatLng {
  latitude: number;
  longitude: number;
}

/**
 * @interface LocationsState
 * @description Define la estructura para almacenar los puntos de partida y destino.
 */
interface LocationsState {
  start: LatLng | null;
  end: LatLng | null;
}

/**
 * @type Step
 * @description Define los pasos del proceso de selección de ruta.
 * - 'set_start': El usuario debe seleccionar el punto de partida.
 * - 'set_end': El usuario debe seleccionar el punto de destino.
 * - 'preview': Se muestra la vista previa de la ruta.
 */
type Step = "set_start" | "set_end" | "preview";

interface RouteInfo {
  distance: number;
  duration: number;
}

export default function MapsMovil({ navigation }: any) {
  // Hook para obtener los márgenes seguros y evitar que los controles se superpongan con la barra de navegación.
  const insets = useSafeAreaInsets();

  // Referencia al componente MapView para poder controlarlo programáticamente.
  const mapRef = useRef<MapView>(null);

  // Estado para la región actual visible en el mapa.
  const [region, setRegion] = useState<Region | undefined>(undefined);

  // Estado para almacenar las ubicaciones de partida y destino.
  const [locations, setLocations] = useState<LocationsState>({
    start: null,
    end: null,
  });

  // Estado para controlar el paso actual del proceso.
  const [step, setStep] = useState<Step>("set_start");

  // Estado para mensajes de error, especialmente de permisos.
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Estado para la información de la ruta (distancia y duración).
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);

  // Estado para el objeto de sonido.
  const [sound, setSound] = useState<Audio.Sound>();

  // Animación para la aparición de los marcadores.
  const markerAnim = useRef(new Animated.Value(0)).current;

  // Hook para solicitar permisos y obtener la ubicación inicial del usuario.
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg(
          "Permiso para acceder a la ubicación fue denegado. Esta función es necesaria para usar el mapa."
        );
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
    })();

    // Cargar el sonido de feedback
    async function loadSound() {
      try {
        const { sound } = await Audio.Sound.createAsync(
          require("../../../../../assets/sounds/ping.mp3")
        );
        setSound(sound);
      } catch (error) {
        console.log(
          "No se pudo cargar el sonido. Asegúrate de tener 'ping.mp3' en 'assets/sounds/'"
        );
      }
    }
    loadSound();

    // Descargar el sonido al desmontar el componente.
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, []);

  /**
   * Reproduce un sonido de feedback.
   */
  const playSound = async () => {
    await sound?.replayAsync();
  };

  /**
   * Anima la aparición del marcador.
   */
  const animateMarker = () => {
    markerAnim.setValue(0);
    Animated.timing(markerAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  /**
   * Fija la ubicación actual del centro del mapa y avanza al siguiente paso.
   */
  const handleSetLocation = async () => {
    if (!region) return;
    await playSound();
    animateMarker();

    const newLocation = {
      latitude: region.latitude,
      longitude: region.longitude,
    };

    if (step === "set_start") {
      setLocations((prev) => ({ ...prev, start: newLocation }));
      setStep("set_end"); // Avanza al siguiente paso
    } else if (step === "set_end") {
      setLocations((prev) => ({ ...prev, end: newLocation }));
      setStep("preview"); // Avanza a la vista previa
    }
  };

  /**
   * Función que se ejecuta al confirmar las ubicaciones.
   * Aquí es donde integrarías la lógica para guardar los datos.
   */
  const handleConfirmRoute = () => {
    const locationsArray = [
      { type: "start", ...locations.start },
      { type: "end", ...locations.end },
    ];

    console.log(
      "Ubicaciones confirmadas:",
      JSON.stringify(locationsArray, null, 2)
    );
    Alert.alert("Actividad Agendada", "La ruta ha sido guardada con éxito.", [
      { text: "OK", onPress: () => navigation.goBack() },
    ]);
  };

  /**
   * Reinicia el proceso de selección de ruta.
   */
  const handleReset = () => {
    setLocations({ start: null, end: null });
    setRouteInfo(null);
    setStep("set_start");
  };

  /**
   * Centra el mapa en la ubicación actual del usuario.
   */
  const goToMyLocation = async () => {
    let location = await Location.getCurrentPositionAsync({});
    mapRef.current?.animateToRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
  };

  /**
   * Abre la ruta en una aplicación de mapas externa.
   */
  const openInExternalMaps = () => {
    const { start, end } = locations;
    if (!start || !end) return;

    const scheme = Platform.select({
      ios: "maps:0,0?q=",
      android: "geo:0,0?q=",
    });
    const latLng = `${end.latitude},${end.longitude}`;
    const label = "Destino";
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    });
    Linking.openURL(url!);
  };

  /**
   * Comparte la ubicación de destino.
   */
  const handleShareLocation = async () => {
    const { end } = locations;
    if (!end) return;
    try {
      const url = `https://www.google.com/maps/search/?api=1&query=${end.latitude},${end.longitude}`;
      await Share.share({
        message: `¡Te comparto la ubicación del evento! Haz clic aquí para verla en el mapa: ${url}`,
      });
    } catch (error: any) {
      Alert.alert(error.message);
    }
  };

  // Renderiza un indicador de carga mientras se obtiene la ubicación inicial.
  if (!region) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={bg_primary} />
        <Text style={styles.infoText}>
          {errorMsg || "Obteniendo tu ubicación..."}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={region}
        onRegionChangeComplete={setRegion} // Actualiza la región cuando el usuario mueve el mapa
        showsUserLocation
        showsMyLocationButton={false} // Usaremos nuestro propio botón
      >
        {/* Marcador de Origen */}
        {locations.start && (
          <Marker
            coordinate={locations.start}
            pinColor={color_success}
            title="Punto de Partida"
          />
        )}

        {/* Marcador de Destino */}
        {locations.end && (
          <Marker
            coordinate={locations.end}
            pinColor={color_danger}
            title="Punto de Destino"
          />
        )}

        {/* Componente que dibuja la ruta */}
        {locations.start && locations.end && step === "preview" && (
          <MapViewDirections
            origin={locations.start}
            destination={locations.end}
            apikey={GOOGLE_MAPS_API_KEY}
            strokeWidth={5}
            strokeColor={bg_primary}
            onReady={(result) => {
              setRouteInfo({
                distance: result.distance,
                duration: result.duration,
              });
              mapRef.current?.fitToCoordinates(result.coordinates, {
                edgePadding: { top: 100, right: 50, bottom: 250, left: 50 },
              });
            }}
          />
        )}
      </MapView>

      {/* Marcador central fijo para una selección precisa */}
      {(step === "set_start" || step === "set_end") && (
        <View style={styles.crosshairContainer}>
          <Animated.View
            style={{
              transform: [
                {
                  scale: markerAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 1.5],
                  }),
                },
              ],
            }}
          >
            <MaterialCommunityIcons
              name="crosshairs-gps"
              size={40}
              color={bg_primary}
            />
          </Animated.View>
        </View>
      )}

      {/* Botón para ir a mi ubicación */}
      <TouchableOpacity
        style={[styles.myLocationButton, { top: insets.top + 15 }]}
        onPress={goToMyLocation}
      >
        <MaterialCommunityIcons
          name="crosshairs-gps"
          size={24}
          color={bg_primary}
        />
      </TouchableOpacity>

      {/* Panel de control inferior */}
      <View
        style={[
          styles.controlsContainer,
          {
            // Ajustamos la posición inferior para que no quede debajo de la barra de pestañas (MainTabs).
            bottom: insets.bottom > 0 ? insets.bottom + 70 : 90,
          },
        ]}
      >
        {/* --- Panel de Selección --- */}
        {(step === "set_start" || step === "set_end") && (
          <View style={styles.selectionPanel}>
            <Text style={styles.selectionText}>
              {step === "set_start"
                ? "Mueve el mapa y fija el Origen"
                : "Ahora, mueve y fija el Destino"}
            </Text>
            <TouchableOpacity
              style={[styles.button, styles.confirmButton]}
              onPress={handleSetLocation}
            >
              <Text style={styles.buttonText}>
                {step === "set_start" ? "Fijar Origen" : "Fijar Destino"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleReset}
            >
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* --- Modal de Confirmación de Ruta --- */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={step === "preview" && routeInfo !== null}
          onRequestClose={handleReset}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Confirmar Ruta</Text>
              <View style={styles.routeInfoContainer}>
                <View style={styles.infoBox}>
                  <Ionicons
                    name="speedometer-outline"
                    size={24}
                    color={bg_primary}
                  />
                  <Text style={styles.infoTextBold}>
                    {routeInfo?.distance.toFixed(1)} km
                  </Text>
                  <Text style={styles.infoTextLabel}>Distancia</Text>
                </View>
                <View style={styles.infoBox}>
                  <Ionicons name="time-outline" size={24} color={bg_primary} />
                  <Text style={styles.infoTextBold}>
                    {routeInfo?.duration.toFixed(0)} min
                  </Text>
                  <Text style={styles.infoTextLabel}>Tiempo Aprox.</Text>
                </View>
              </View>
              <TouchableOpacity
                style={[styles.button, styles.confirmButton]}
                onPress={handleConfirmRoute}
              >
                <Text style={styles.buttonText}>Agendar y Finalizar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.navigateButton]}
                onPress={openInExternalMaps}
              >
                <Text style={styles.buttonText}>Navegar en App Externa</Text>
                <Ionicons
                  name="navigate-circle-outline"
                  size={24}
                  color={color_white}
                  style={{ marginLeft: 10 }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.shareButton]}
                onPress={handleShareLocation}
              >
                <Text style={styles.buttonText}>Compartir Ubicación</Text>
                <Ionicons
                  name="share-social-outline"
                  size={24}
                  color={color_white}
                  style={{ marginLeft: 10 }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.resetButton]}
                onPress={handleReset}
              >
                <Text style={[styles.buttonText, { color: bg_primary }]}>
                  Modificar Ruta
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
}

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
  myLocationButton: {
    position: "absolute",
    right: 20,
    backgroundColor: color_white,
    borderRadius: 20,
    padding: 8,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  controlsContainer: { position: "absolute", left: 20, right: 20 },
  selectionPanel: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 15,
    padding: 15,
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  selectionText: {
    fontSize: 16,
    fontWeight: "600",
    color: bg_primary,
    marginBottom: 15,
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: color_white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 30,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: bg_primary,
    marginBottom: 20,
  },
  routeInfoContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
    width: "100%",
  },
  infoBox: { alignItems: "center" },
  infoTextBold: { fontSize: 18, fontWeight: "bold", color: "#333" },
  infoTextLabel: { fontSize: 12, color: "#666" },
  button: {
    flexDirection: "row",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginTop: 10,
  },
  buttonText: { color: color_white, fontSize: 16, fontWeight: "bold" },
  confirmButton: { backgroundColor: bg_primary },
  navigateButton: { backgroundColor: color_success },
  shareButton: { backgroundColor: color_info },
  cancelButton: { backgroundColor: color_danger },
  resetButton: { backgroundColor: "#e0e0e0" },
});
