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
  PanResponder,
  Dimensions,
  Alert,
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
import { useTheme } from '@contexts/ThemeContext';
import LottieView from 'lottie-react-native';
import * as Haptics from 'expo-haptics';
import { Audio } from 'expo-av';
import { typography, spacing, borderRadius } from '../../theme';
import Logo from '../../components/ui/Logo';

// Animaciones Lottie (puedes reemplazar los paths por los tuyos propios)
const lottiePower = require('../../../assets/lottie/Power.json');
const lottieRadar = require('../../../assets/lottie/Connected_world.json');
const lottieLoading = require('../../../assets/lottie/Loading.json');

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
  const { theme } = useTheme();

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
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);
  const [connectedAt, setConnectedAt] = useState<Date | null>(null);
  const bottomSheetHeight = 320;
  const screenHeight = Dimensions.get('window').height;
  const bottomSheetY = useRef(new Animated.Value(screenHeight)).current;

  // Estado para alerta de notificación
  const [eventAlert, setEventAlert] = useState<any>(null);
  const [eventAlertVisible, setEventAlertVisible] = useState(false);
  const [eventAlertProgress, setEventAlertProgress] = useState(0); // 0 a 1
  const [eventAlertTimeLeft, setEventAlertTimeLeft] = useState(120); // segundos
  const eventAlertTimer = useRef<any>(null);
  const eventAlertInterval = useRef<any>(null);

  // Mostrar alerta cuando llegue una notificación
  useEffect(() => {
    if (notifications.length > 0 && !eventAlertVisible) {
      setEventAlert(notifications[0]);
      setEventAlertVisible(true);
      setEventAlertProgress(0);
      setEventAlertTimeLeft(120);
      // Cerrar automáticamente después de 2 minutos y actualizar barra
      if (eventAlertTimer.current) clearTimeout(eventAlertTimer.current);
      if (eventAlertInterval.current) clearInterval(eventAlertInterval.current);
      let elapsed = 0;
      eventAlertInterval.current = setInterval(() => {
        elapsed += 1;
        setEventAlertProgress(elapsed / 120);
        setEventAlertTimeLeft(120 - elapsed);
        if (elapsed >= 120) {
          clearInterval(eventAlertInterval.current);
        }
      }, 1000);
      eventAlertTimer.current = setTimeout(() => {
        setEventAlertVisible(false);
        setEventAlert(null);
        setEventAlertProgress(0);
        setEventAlertTimeLeft(120);
        if (eventAlertInterval.current) clearInterval(eventAlertInterval.current);
      }, 2 * 60 * 1000);
    }
    return () => {
      if (eventAlertTimer.current) clearTimeout(eventAlertTimer.current);
      if (eventAlertInterval.current) clearInterval(eventAlertInterval.current);
    };
  }, [notifications]);

  // Cerrar alerta manualmente
  const closeEventAlert = () => {
    setEventAlertVisible(false);
    setEventAlert(null);
    setEventAlertProgress(0);
    setEventAlertTimeLeft(120);
    if (eventAlertTimer.current) clearTimeout(eventAlertTimer.current);
    if (eventAlertInterval.current) clearInterval(eventAlertInterval.current);
  };

  // Ver detalles de la notificación
  const handleViewDetails = () => {
    setSelectedNotification(eventAlert);
    setIsModalVisible(true);
    closeEventAlert();
  };

  // Cronómetro de tiempo conectado
  useEffect(() => {
    let timer: any;
    if (status === 'connected') {
      setConnectedAt(new Date());
      setBottomSheetOpen(true); // Abrir Bottom Sheet automáticamente al conectar
      timer = setInterval(() => setConnectedAt((prev) => prev ? new Date(prev) : new Date()), 1000);
    } else {
      setConnectedAt(null);
      setBottomSheetOpen(false); // Cerrar Bottom Sheet al desconectar
    }
    return () => clearInterval(timer);
  }, [status]);

  // Animación del bottom sheet
  useEffect(() => {
    // Dejar siempre visible el handle (20px)
    const closedPosition = screenHeight - 60 + 20; // 20px del handle visible
    Animated.timing(bottomSheetY, {
      toValue: bottomSheetOpen ? screenHeight - bottomSheetHeight : closedPosition,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [bottomSheetOpen]);

  // PanResponder para deslizar
  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dy) > 10,
    onPanResponderMove: (_, gestureState) => {
      let newY = (bottomSheetOpen ? screenHeight - bottomSheetHeight : screenHeight - 60) + gestureState.dy;
      if (newY < screenHeight - bottomSheetHeight) newY = screenHeight - bottomSheetHeight;
      if (newY > screenHeight - 60) newY = screenHeight - 60;
      bottomSheetY.setValue(newY);
    },
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dy < -40) setBottomSheetOpen(true);
      else if (gestureState.dy > 40) setBottomSheetOpen(false);
      else setBottomSheetOpen(bottomSheetOpen);
    },
  });

  // Formato de tiempo conectado
  const getConnectedTime = () => {
    if (!connectedAt) return '--:--:--';
    const diff = Math.floor((Date.now() - connectedAt.getTime()) / 1000);
    const h = String(Math.floor(diff / 3600)).padStart(2, '0');
    const m = String(Math.floor((diff % 3600) / 60)).padStart(2, '0');
    const s = String(diff % 60).padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  // Botón seguro de desconexión
  const handleSafeDisconnect = () => {
    Alert.alert(
      t('settings.logout'),
      t('settings.logout_confirm'),
      [
        { text: t('settings.cancel'), style: 'cancel' },
        { text: t('settings.logout'), style: 'destructive', onPress: () => handleConnection() },
      ]
    );
  };

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

  // Slide button para desconexión (mejor sensibilidad)
  const [slideX, setSlideX] = useState(new Animated.Value(0));
  const slideWidth = 220;
  const slideBtnPanResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dx) > 5,
    onPanResponderMove: (_, gestureState) => {
      let newX = Math.max(0, Math.min(slideWidth - 56, gestureState.dx));
      slideX.setValue(newX);
    },
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dx > slideWidth - 100) {
        setBottomSheetOpen(false);
        setTimeout(() => handleConnection(), 300);
        Animated.timing(slideX, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }).start();
      } else {
        Animated.timing(slideX, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }).start();
      }
    },
  });

  // Animaciones para planeta y lupa (fluidez mejorada)
  const planetOrbitAnim = useRef(new Animated.Value(0)).current;
  const planetSpinAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    planetOrbitAnim.setValue(0);
    planetSpinAnim.setValue(0);
    Animated.loop(
      Animated.timing(planetOrbitAnim, {
        toValue: 1,
        duration: 4000,
        useNativeDriver: true,
        easing: Easing.linear,
      })
    ).start();
    Animated.loop(
      Animated.timing(planetSpinAnim, {
        toValue: 1,
        duration: 6000,
        useNativeDriver: true,
        easing: Easing.linear,
      })
    ).start();
  }, []);
  const planetOrbitRotate = planetOrbitAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  const planetSpinRotate = planetSpinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  const planetAnimStyles = StyleSheet.create({
    planetContainer: {
      width: 180,
      height: 180,
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: 30,
    },
    orbit: {
      position: 'absolute',
      width: 180,
      height: 180,
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    lupa: {
      position: 'absolute',
      top: 0,
      left: 72,
    },
    planet: {
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
  const slideBtnStyles = StyleSheet.create({
    slideContainer: {
      marginTop: 18,
      alignItems: 'center',
    },
    slideText: {
      fontSize: 15,
      color: '#444',
      marginBottom: 8,
    },
    slideTrack: {
      width: 220,
      height: 56,
      backgroundColor: '#eee',
      borderRadius: 28,
      justifyContent: 'center',
      overflow: 'hidden',
    },
    slideThumb: {
      position: 'absolute',
      left: 0,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: color_danger,
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 4,
      shadowColor: color_danger,
      shadowOpacity: 0.18,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 2 },
    },
  });

  // Slide button para conexión
  const [slideConnectX, setSlideConnectX] = useState(new Animated.Value(0));
  const slideConnectWidth = 220;
  const slideConnectPanResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dx) > 10,
    onPanResponderMove: (_, gestureState) => {
      let newX = Math.max(0, Math.min(slideConnectWidth - 56, gestureState.dx));
      slideConnectX.setValue(newX);
    },
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dx > slideConnectWidth - 80) {
        // Conectar
        setTimeout(() => handleConnection(), 300);
        Animated.timing(slideConnectX, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }).start();
      } else {
        Animated.timing(slideConnectX, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }).start();
      }
    },
  });
  const slideConnectBtnStyles = StyleSheet.create({
    slideContainer: {
      marginTop: 40,
      alignItems: 'center',
    },
    slideText: {
      fontSize: 16,
      color: '#fff',
      marginBottom: 10,
      fontWeight: 'bold',
      letterSpacing: 0.5,
      textShadowColor: 'rgba(0,0,0,0.18)',
      textShadowRadius: 4,
    },
    slideTrack: {
      width: 220,
      height: 56,
      backgroundColor: bg_primary,
      borderRadius: 28,
      justifyContent: 'center',
      overflow: 'hidden',
      borderWidth: 2,
      borderColor: color_info,
      shadowColor: color_info,
      shadowOpacity: 0.18,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 2 },
    },
    slideThumb: {
      position: 'absolute',
      left: 0,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: color_info,
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 4,
      shadowColor: color_info,
      shadowOpacity: 0.18,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 2 },
    },
  });

  const playSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../../../assets/sounds/ping.mp3')
      );
      await sound.playAsync();
      setTimeout(() => sound.unloadAsync(), 2000);
    } catch (e) {}
  };

  // --- DASHBOARD ULTRA-ESTRABAGANTE CON SISTEMA DE TEMAS ---
  // Usar el mismo fondo animado y color base en todos los estados
  const animatedBgColors = Array.from(theme.gradients.primary);

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background.primary, paddingTop: insets.top + 100 }}>
      {/* Fondo animado extravagante */}
      <AnimatedBackground colors={animatedBgColors} />
      <Animated.View
        style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          opacity: 0.5,
          backgroundColor: theme.colors.background.primary,
          zIndex: 0,
        }}
      />
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }} showsVerticalScrollIndicator={false}>
        {/* Logo de la app centrado */}
        <View style={{ alignItems: 'center', marginBottom: 24 }}>
          <Logo size={140} showText={true} />
        </View>
        {/* Mensaje motivacional animado */}
        <Animated.View style={{ marginBottom: 16, alignItems: 'center', opacity: 0.9 }}>
          <Text style={{ color: theme.colors.text.primary, fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.bold, letterSpacing: 1 }}>
            {status === 'connected' ? t('dashboard.tip_connected') : status === 'connecting' ? t('dashboard.tip_connecting') : t('dashboard.tip_ready')}
          </Text>
        </Animated.View>
        {/* Botón central Lottie extravagante */}
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', zIndex: 2 }}>
          <Pressable
            onPress={async () => {
              if (status === 'disconnected') {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                await playSound();
                handleConnection();
              }
            }}
            disabled={status !== 'disconnected'}
            style={({ pressed }) => [{
              borderRadius: borderRadius.full,
              ...theme.shadows.large,
              backgroundColor: theme.colors.background.overlay,
              padding: spacing.xl,
              marginBottom: spacing.xl,
              transform: [{ scale: pressed ? 1.08 : 1 }],
            }]}
          >
            <LottieView
              source={status === 'connected' ? lottieRadar : status === 'connecting' ? lottieLoading : lottiePower}
              autoPlay
              loop
              style={{ width: 220, height: 220 }}
            />
          </Pressable>
          {/* Estado y tiempo */}
          <Animated.View style={{ alignItems: 'center', marginBottom: spacing.lg }}>
            <Text style={{ fontSize: typography.fontSize['2xl'], color: theme.colors.text.primary, fontWeight: typography.fontWeight.bold, marginBottom: 4 }}>
              {status === 'connected' ? t('dashboard.connected') : status === 'connecting' ? t('dashboard.connecting') : t('dashboard.disconnected')}
            </Text>
            {status === 'connected' && (
              <Text style={{ fontSize: typography.fontSize.lg, color: theme.colors.text.primary, opacity: 0.8, marginBottom: 8 }}>{t('dashboard.connected_time')}: {getConnectedTime()}</Text>
            )}
            {status === 'connecting' && (
              <Text style={{ fontSize: typography.fontSize.base, color: theme.colors.text.primary, opacity: 0.7 }}>{t('dashboard.please_wait')}</Text>
            )}
            {status === 'disconnected' && (
              <Text style={{ fontSize: typography.fontSize.base, color: theme.colors.text.primary, opacity: 0.7 }}>{t('dashboard.tap_to_connect')}</Text>
            )}
          </Animated.View>
          {/* Badge de eventos animado */}
          {status === 'connected' && (
            <Animated.View style={{ backgroundColor: theme.colors.accent[200], borderRadius: borderRadius.xl, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, flexDirection: 'row', alignItems: 'center', ...theme.shadows.medium, marginBottom: spacing.lg }}>
              <Ionicons name="notifications" size={20} color={theme.colors.primary[900]} style={{ marginRight: 8 }} />
              <Text style={{ color: theme.colors.primary[900], fontWeight: typography.fontWeight.bold, fontSize: typography.fontSize.lg }}>2 {t('dashboard.events_available')}</Text>
            </Animated.View>
          )}
          {/* Slide para desconexión extravagante */}
          {status === 'connected' && (
            <View style={{ marginTop: spacing.lg, alignItems: 'center', width: 260 }}>
              <Text style={{ color: theme.colors.text.primary, fontSize: typography.fontSize.lg, marginBottom: 10 }}>{t('dashboard.slide_to_disconnect')}</Text>
              <View style={{ width: 260, height: 60, backgroundColor: theme.colors.background.card, borderRadius: 30, justifyContent: 'center', overflow: 'hidden', borderWidth: 2, borderColor: theme.colors.accent[500], ...theme.shadows.medium }}>
                <Animated.View
                  style={{
                    position: 'absolute',
                    left: 0,
                    width: 60,
                    height: 60,
                    borderRadius: 30,
                    backgroundColor: theme.colors.error[500],
                    alignItems: 'center',
                    justifyContent: 'center',
                    elevation: 8,
                    shadowColor: theme.colors.error[500],
                    shadowOpacity: 0.25,
                    shadowRadius: 12,
                    shadowOffset: { width: 0, height: 2 },
                    transform: [{ translateX: slideX }],
                  }}
                  {...slideBtnPanResponder.panHandlers}
                  onTouchEnd={async () => {
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
                    await playSound();
                  }}
                >
                  <Ionicons name="log-out-outline" size={32} color={theme.colors.text.inverse} />
                </Animated.View>
                {/* Barra de progreso visual */}
                <Animated.View
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    height: 60,
                    width: slideX.interpolate({ inputRange: [0, 200], outputRange: [0, 200], extrapolate: 'clamp' }),
                    backgroundColor: theme.colors.error[100],
                    borderRadius: 30,
                  }}
                />
                <View style={{ position: 'absolute', left: 80, right: 0, top: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ color: theme.colors.text.primary, fontWeight: typography.fontWeight.bold, fontSize: typography.fontSize.lg, letterSpacing: 1 }}>{t('dashboard.disconnect_swipe')}</Text>
                </View>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
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

const bottomSheetStyles = StyleSheet.create({
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 320,
    backgroundColor: color_white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    elevation: 20,
    shadowColor: bg_primary,
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: -4 },
    padding: 24,
    zIndex: 100,
  },
  handleContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  handle: {
    width: 48,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ddd',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: bg_primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  timeLabel: {
    fontSize: 16,
    color: color_info,
    textAlign: 'center',
    marginBottom: 16,
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    backgroundColor: '#f6f8fa',
    borderRadius: 12,
    padding: 12,
  },
  sectionText: {
    marginLeft: 10,
    fontSize: 15,
    color: '#444',
  },
  disconnectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color_danger,
    borderRadius: 16,
    paddingVertical: 14,
    marginTop: 18,
  },
  disconnectText: {
    color: color_white,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

const eventAlertStyles = StyleSheet.create({
  alertContainer: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 200,
  },
  alertBox: {
    backgroundColor: color_white,
    borderRadius: 18,
    padding: 24,
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: color_info,
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 10,
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: bg_primary,
    marginBottom: 4,
    textAlign: 'center',
  },
  alertText: {
    fontSize: 15,
    color: '#444',
    marginBottom: 12,
    textAlign: 'center',
  },
  progressBarContainer: {
    width: '100%',
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressBarBg: {
    flex: 1,
    height: 10,
    backgroundColor: '#eee',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBarFg: {
    height: 10,
    borderRadius: 6,
  },
  progressText: {
    fontSize: 13,
    color: '#444',
    fontWeight: 'bold',
    minWidth: 36,
    textAlign: 'right',
  },
  alertBtnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  alertBtn: {
    flex: 1,
    marginHorizontal: 6,
    backgroundColor: color_info,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  alertBtnText: {
    color: color_white,
    fontWeight: 'bold',
    fontSize: 15,
  },
});

export default Dashboard;
