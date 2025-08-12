import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSocket } from '@contexts/SocketContext';
import { useTheme } from '@contexts/ThemeContext';
import { useUser } from '@contexts/UserContext';

const ConnectionStatus: React.FC = () => {
  const { isConnected } = useSocket();
  const { theme } = useTheme();
  const { user } = useUser();

  // No mostrar nada si no hay usuario logueado o si está conectado
  if (!user || isConnected) {
    return null;
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.error[500] }]}>
      <Ionicons name="wifi-outline" size={16} color="#fff" />
      <Text style={styles.text}>Sin conexión</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    position: 'absolute',
    bottom: 0, // Cambiado de top: 0 a bottom: 0
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  text: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default ConnectionStatus; 