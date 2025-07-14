import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing, Pressable } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { appName, bg_primary, color_white, color_info, color_success, color_danger } from '../../styles/Styles';
import AnimatedBackground from '../../components/ui/styles/AnimatedBackground';
import { socket } from '../../utils/soket';

type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

const ConnectionGlobe = ({ status, onPress }: { status: ConnectionStatus; onPress: () => void }) => {
  const rotationAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

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
            Animated.timing(pulseAnim, { toValue: 1.05, duration: 1000, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
            Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
        ])
    );

    if (status === 'connecting' || status === 'connected') {
      orbitAnimation.start();
      if (status === 'connecting') {
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

  const rotate = rotationAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const animatedGlobeStyle = { transform: [{ scale: pulseAnim }] };

  const { globeColor, iconName, statusText, iconColor } = {
    disconnected: { globeColor: bg_primary, iconName: 'power', statusText: 'Conectar', iconColor: color_white },
    connecting: { globeColor: color_info, iconName: 'sync', statusText: 'Conectando...', iconColor: color_white },
    connected: { globeColor: color_success, iconName: 'wifi', statusText: 'Conectado', iconColor: color_white },
    error: { globeColor: color_danger, iconName: 'wifi-off', statusText: 'Error de Conexión', iconColor: color_white },
  }[status];

  return (
    <View style={styles.globeContainer}>
      {(status === 'connecting' || status === 'connected') && (
        <Animated.View style={[styles.orbit, { transform: [{ rotate }] }]}>
          <Ionicons name="rocket" size={30} color={color_white} style={styles.rocket} />
        </Animated.View>
      )}
      <Pressable onPress={onPress} disabled={status === 'connecting'}>
        <Animated.View style={[styles.globe, { backgroundColor: globeColor }, animatedGlobeStyle]}>
          <MaterialCommunityIcons name={iconName} size={80} color={iconColor} />
        </Animated.View>
      </Pressable>
      <Text style={styles.statusText}>{statusText}</Text>
    </View>
  );
};

const Dashboard = ({ navigation }: any) => {
  // Hook para obtener los márgenes seguros del dispositivo (notch, barra inferior, etc.)
  const insets = useSafeAreaInsets();

  const [status, setStatus] = useState<ConnectionStatus>(socket.connected ? 'connected' : 'disconnected');

  useEffect(() => {
    const onConnect = () => setStatus('connected');
    const onDisconnect = () => setStatus('disconnected');
    const onConnectError = () => setStatus('error');

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('connect_error', onConnectError);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('connect_error', onConnectError);
    };
  }, []);

  const handleConnection = () => {
    if (status === 'connected') {
      socket.disconnect();
    } else {
      setStatus('connecting');
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
      <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom + 90 }]}>
        <View style={styles.header}>
          <Text style={styles.title}>Bienvenido a {appName} 🎶</Text>
          <Text style={styles.subtitle}>Tu universo musical te espera</Text>
        </View>

        <ConnectionGlobe status={status} onPress={handleConnection} />

        <View style={styles.navGrid}>
          <TouchableOpacity style={styles.navCard} onPress={() => navigation.navigate("Profile")}>
            <Ionicons name="person-circle-outline" size={40} color={color_white} />
            <Text style={styles.navCardText}>Mi Perfil</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navCard} onPress={() => navigation.navigate("Seting")}>
            <Ionicons name="settings-outline" size={40} color={color_white} />
            <Text style={styles.navCardText}>Ajustes</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navCard} onPress={() => navigation.navigate("Musicos")}>
            <MaterialCommunityIcons name="account-music-outline" size={40} color={color_white} />
            <Text style={styles.navCardText}>Músicos</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: color_white,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: color_white,
    textAlign: 'center',
    opacity: 0.9,
    marginTop: 8,
  },
  globeContainer: {
    width: 250,
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 40,
  },
  globe: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  statusText: {
    marginTop: 20,
    color: color_white,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  orbit: {
    position: 'absolute',
    width: 250,
    height: 250,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  rocket: {
    transform: [{ rotate: '-90deg' }],
  },
  navGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  navCard: {
    alignItems: 'center',
    padding: 10,
  },
  navCardText: {
    marginTop: 5,
    fontSize: 12,
    fontWeight: '600',
    color: color_white,
    opacity: 0.9,
  },
});

export default Dashboard;
