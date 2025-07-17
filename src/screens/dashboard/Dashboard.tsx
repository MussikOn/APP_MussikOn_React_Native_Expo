import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  Pressable,
  ScrollView,
  Modal,
  TouchableOpacity,
  Image,
  Linking,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import {
  appName,
  bg_primary,
  color_white,
  color_info,
  color_success,
  color_danger,
} from "@styles/Styles";
import AnimatedBackground from "@components/ui/styles/AnimatedBackground";
import { socket } from "@utils/socket";
import { useTranslation } from 'react-i18next';

type ConnectionStatus = "disconnected" | "connecting" | "connected" | "error";

const ConnectionGlobe = ({
  status,
  onPress,
}: {
  status: ConnectionStatus;
  onPress: () => void;
}) => {
  const rotationAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const { t } = useTranslation();

  useEffect(() => {
    const orbitAnimation = Animated.loop(
      Animated.timing(rotationAnim, {
        toValue: 1,
        duration: 8000, // 8 segundos por órbita
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
      ])
    );

    if (status === "connecting" || status === "connected") {
      orbitAnimation.start();
      if (status === "connecting") {
        pulseAnimation.start();
      } else {
        pulseAnimation.stop();
        pulseAnim.setValue(1);
      }
    } else {
      orbitAnimation.stop();
      pulseAnimation.stop();
      rotationAnim.setValue(0);
      pulseAnim.setValue(1);
    }

    return () => {
      orbitAnimation.stop();
      pulseAnimation.stop();
    };
  }, [status]);

  const rotate = rotationAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });
  const animatedGlobeStyle = { transform: [{ scale: pulseAnim }] };

  const {
    globeColor,
    iconName,
    statusText,
    iconColor,
  }:{
    globeColor: string;
    iconName: 'wifi' | 'sync' | 'power' | 'wifi-off';
    statusText: string;
    iconColor: string;
  } = {
    disconnected: {
      globeColor: bg_primary,
      iconName: 'power' as 'power',
      statusText: t('home.connect'),
      iconColor: color_white,
    },
    connecting: {
      globeColor: color_info,
      iconName: 'sync' as 'sync',
      statusText: t('home.connecting'),
      iconColor: color_white,
    },
    connected: {
      globeColor: color_success,
      iconName: 'wifi' as 'wifi',
      statusText: t('home.connected'),
      iconColor: color_white,
    },
    error: {
      globeColor: color_danger,
      iconName: 'wifi-off' as 'wifi-off',
      statusText: t('home.connection_error'),
      iconColor: color_white,
    },
  }[status];

  return (
    <View style={styles.globeContainer}>
      {(status === "connecting" || status === "connected") && (
        <Animated.View style={[styles.orbit, { transform: [{ rotate }] }]}>
          <Ionicons
            name="rocket"
            size={30}
            color={color_white}
            style={styles.rocket}
          />
        </Animated.View>
      )}
      <Pressable onPress={onPress} disabled={status === "connecting"}>
        <Animated.View
          style={[
            styles.globe,
            { backgroundColor: globeColor },
            animatedGlobeStyle,
          ]}
        >
          <MaterialCommunityIcons name={iconName} size={80} color={iconColor} />
        </Animated.View>
      </Pressable>
      <Text style={styles.statusText}>{statusText}</Text>
    </View>
  );
};

// --- Componente para un solo item de información en el Modal ---
const InfoRow = ({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string | null | undefined;
}) => {
  if (!value) return null;
  return (
    <View style={styles.infoRow}>
      <Ionicons
        name={icon}
        size={22}
        color={bg_primary}
        style={styles.infoRowIcon}
      />
      <View>
        <Text style={styles.infoRowLabel}>{label}</Text>
        <Text style={styles.infoRowValue}>{value}</Text>
      </View>
    </View>
  );
};

const Dashboard = ({ navigation }: any) => {
  // Hook para obtener los márgenes seguros del dispositivo (notch, barra inferior, etc.)
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  const [status, setStatus] = useState<ConnectionStatus>(
    socket.connected ? "connected" : "disconnected"
  );
  const [notifications, setNotifications] = useState([
    // --- DATOS SIMULADOS ---
    // En una aplicación real, estos datos vendrían de tu backend a través de una API o un socket.
    {
      id: 1,
      eventName: "Boda de Ana y Carlos",
      requesterName: "Wedding Planners Inc.",
      location: "Jardín Botánico Nacional, Santo Domingo",
      date: "25 de Diciembre, 2024",
      time: "5:00 PM",
      duration: "3 horas",
      instrument: "Violín",
      bringInstrument: false,
      comment:
        "Se requiere un repertorio de música clásica para la ceremonia y piezas populares para el cóctel. Vestimenta formal es indispensable.",
      budget: "20,000 RD$",
      eventType: "Boda",
      flyerUrl:
        "https://d1csarkz8obe9u.cloudfront.net/posterpreviews/dj-concert-flyer-design-template-4c2f040ccbc983a6d539472a1d8f50b4_screen.jpg?ts=1698394859", // Opcional
      songs: [
        "Canon en D - Pachelbel",
        "Perfect - Ed Sheeran",
        "A Thousand Years - Christina Perri",
      ],
      recommendations: [
        "Llegar 1 hora antes para prueba de sonido.",
        "Estacionamiento disponible para el músico.",
      ],
      mapsLink: "https://maps.app.goo.gl/r6v8YmY4zB8nZJ2v8",
    },
  ]);
  const [selectedNotification, setSelectedNotification] = useState<any>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleOpenNotification = (notification: any) => {
    setSelectedNotification(notification);
    setIsModalVisible(true);
  };

  // Lógica para aceptar un evento
  const handleAcceptEvent = (id: number) => {
    // AQUÍ: Lógica para enviar la confirmación a tu backend
    console.log(`Evento ${id} ACEPTADO. Enviando a la API...`);

    // Simulación: Se elimina la notificación de la lista y se cierra el modal
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    setIsModalVisible(false);
    setSelectedNotification(null);
  };

  // Lógica para rechazar un evento
  const handleRejectEvent = (id: number) => {
    // AQUÍ: Lógica para enviar el rechazo a tu backend
    console.log(`Evento ${id} RECHAZADO. Enviando a la API...`);

    // Simulación: Se elimina la notificación de la lista y se cierra el modal
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    setIsModalVisible(false);
    setSelectedNotification(null);
  };

  const renderNotificationModal = () => (
    <Modal
      visible={isModalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setIsModalVisible(false)}
    >
      <View style={styles.modalBackdrop}>
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.closeModalButton}
            onPress={() => setIsModalVisible(false)}
          >
            <Ionicons name="close-circle" size={32} color={color_danger} />
          </TouchableOpacity>
          {selectedNotification && (
            <ScrollView showsVerticalScrollIndicator={false}>
              {selectedNotification.flyerUrl && (
                <Image
                  source={{ uri: selectedNotification.flyerUrl }}
                  style={styles.flyerImage}
                />
              )}
              <Text style={styles.modalTitle}>
                {selectedNotification.eventName}
              </Text>
              <Text style={styles.modalSubtitle}>
                por {selectedNotification.requesterName}
              </Text>

              <View style={styles.detailsSection}>
                <InfoRow
                  icon="calendar-outline"
                  label="Fecha y Hora"
                  value={`${selectedNotification.date} - ${selectedNotification.time}`}
                />
                <InfoRow
                  icon="location-outline"
                  label="Ubicación"
                  value={selectedNotification.location}
                />
                <TouchableOpacity
                  onPress={() => Linking.openURL(selectedNotification.mapsLink)}
                >
                  <Text style={styles.mapsLinkText}>Ver en Google Maps</Text>
                </TouchableOpacity>
                <InfoRow
                  icon="musical-notes-outline"
                  label="Instrumento Requerido"
                  value={selectedNotification.instrument}
                />
                <InfoRow
                  icon="time-outline"
                  label="Duración"
                  value={selectedNotification.duration}
                />
                <InfoRow
                  icon="cash-outline"
                  label="Presupuesto"
                  value={selectedNotification.budget}
                />
                <InfoRow
                  icon="document-text-outline"
                  label="Comentarios"
                  value={selectedNotification.comment}
                />
              </View>

              <View style={styles.actionButtonsContainer}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.acceptButton]}
                  onPress={() => handleAcceptEvent(selectedNotification.id)}
                >
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={24}
                    color={color_white}
                  />
                  <Text style={styles.actionButtonText}>Aceptar Evento</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.rejectButton]}
                  onPress={() => handleRejectEvent(selectedNotification.id)}
                >
                  <Ionicons
                    name="close-circle-outline"
                    size={24}
                    color={color_white}
                  />
                  <Text style={styles.actionButtonText}>Rechazar</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );

  useEffect(() => {
    const onConnect = () => setStatus("connected");
    const onDisconnect = () => setStatus("disconnected");
    const onConnectError = () => setStatus("error");

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onConnectError);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onConnectError);
    };
  }, []);

  const handleConnection = () => {
    if (status === "connected") {
      socket.disconnect();
    } else {
      setStatus("connecting");
      socket.connect();
    }
  };

  return (
    <>
      <AnimatedBackground />
      {/* 
        Aplicamos los márgenes seguros como padding.
        - paddingTop: insets.top asegura que no quede debajo de la barra de estado.
        - paddingBottom: insets.bottom + 90 asegura que no quede debajo de la barra de pestañas.
          (90 = 70 de altura de la barra + 20 de margen inferior)
      */}
      <View
        style={[
          styles.container,
          { paddingTop: insets.top, paddingBottom: insets.bottom + 90 },
        ]}
      >
        <ScrollView
          contentContainerStyle={{ alignItems: "center", width: "100%" }}
        >
          <View style={styles.header}>
            <Text style={styles.title}>{t('home.welcome_title', { appName })}</Text>
            <Text style={styles.subtitle}>{t('home.welcome_subtitle')}</Text>
          </View>

          {/* --- BANNER DE NOTIFICACIONES --- */}
          <View style={styles.notificationsBanner}>
            <Text style={styles.bannerTitle}>{t('home.event_requests')}</Text>
            {notifications.length > 0 ? (
              notifications.map((notif) => (
                <TouchableOpacity
                  key={notif.id}
                  style={styles.notificationItem}
                  onPress={() => handleOpenNotification(notif)}
                >
                  <Ionicons name="notifications" size={24} color={bg_primary} />
                  <View style={styles.notificationTextContainer}>
                    <Text style={styles.notificationTitle}>
                      {notif.eventName}
                    </Text>
                    <Text style={styles.notificationDate}>{notif.date}</Text>
                  </View>
                  <Ionicons
                    name="chevron-forward-outline"
                    size={24}
                    color="#ccc"
                  />
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.noNotificationsText}>
                {t('home.no_pending_requests')}
              </Text>
            )}
          </View>

          <ConnectionGlobe status={status} onPress={handleConnection} />
        </ScrollView>
        {renderNotificationModal()}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    // justifyContent: 'space-around', // Se quita para permitir el scroll
    paddingHorizontal: 20,
  },
  header: {
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: color_white,
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.25)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: color_white,
    textAlign: "center",
    opacity: 0.9,
    marginTop: 8,
  },
  globeContainer: {
    width: 250,
    height: 250,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 40,
  },
  globe: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  statusText: {
    marginTop: 20,
    color: color_white,
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  orbit: {
    position: "absolute",
    width: 250,
    height: 250,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  rocket: {
    transform: [{ rotate: "-90deg" }],
  },
  navGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  navCard: {
    alignItems: "center",
    padding: 10,
  },
  navCardText: {
    marginTop: 5,
    fontSize: 12,
    fontWeight: "600",
    color: color_white,
    opacity: 0.9,
  },
  // --- Estilos del Banner de Notificaciones ---
  notificationsBanner: {
    width: "100%",
    maxWidth: 500,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 20,
    padding: 20,
    marginTop: 30,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: bg_primary,
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 10,
  },
  notificationItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  notificationTextContainer: {
    flex: 1,
    marginLeft: 15,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  notificationDate: {
    fontSize: 14,
    color: "#777",
    marginTop: 2,
  },
  noNotificationsText: {
    textAlign: "center",
    fontSize: 16,
    color: "#888",
    paddingVertical: 20,
    fontStyle: "italic",
  },
  // --- Estilos del Modal ---
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "95%",
    maxHeight: "85%",
    backgroundColor: color_white,
    borderRadius: 25,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 20,
  },
  closeModalButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 10,
  },
  flyerImage: {
    width: "100%",
    height: 150,
    borderRadius: 15,
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: bg_primary,
    textAlign: "center",
  },
  modalSubtitle: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 20,
  },
  detailsSection: {
    marginVertical: 10,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 18,
  },
  infoRowIcon: {
    marginRight: 15,
    marginTop: 2,
  },
  infoRowLabel: {
    fontSize: 12,
    color: "#888",
    textTransform: "uppercase",
    fontWeight: "600",
  },
  infoRowValue: {
    fontSize: 16,
    color: "#333",
  },
  mapsLinkText: {
    color: color_info,
    fontWeight: "bold",
    textDecorationLine: "underline",
    marginLeft: 37, // Alinea con el texto de arriba
    marginBottom: 18,
  },
  actionButtonsContainer: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 15,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    borderRadius: 15,
    marginBottom: 10,
  },
  actionButtonText: {
    color: color_white,
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  acceptButton: {
    backgroundColor: color_success,
  },
  rejectButton: {
    backgroundColor: color_danger,
  },
});

export default Dashboard;
