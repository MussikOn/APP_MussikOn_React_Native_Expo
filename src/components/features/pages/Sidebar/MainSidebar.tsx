
import React from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet, Dimensions, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Token } from '@appTypes/DatasTypes';
import {
  color_primary,
  color_white,
  color_secondary,
  bg_white,
  btn_primary,
  btn_danger,
  color_info,
  color_success,
} from '@styles/Styles';
import { useNavigation } from '@react-navigation/native';
import { deleteToken } from '@utils/functions';

const SCREEN_WIDTH = Dimensions.get('window').width;

// SidebarProps: props que recibe el sidebar, incluyendo visibilidad, usuario y handlers
interface SidebarProps {
  isVisible: boolean;
  user: Token | undefined;
  onClose?: () => void;
  onNavigate?: (route: string) => void;
}

// Menú dinámico según el rol
const menuItems = (role: string) =>
  role === 'eventCreator'
    ? [
        { icon: 'home', label: 'Inicio', route: 'Inicio' },
        { icon: 'add-circle', label: 'Crear Evento', route: 'CrearEvento', color: color_success },
        { icon: 'list', label: 'Solicitudes', route: 'Solicitudes', color: color_info },
        { icon: 'person', label: 'Perfil', route: 'Perfil' },
        { icon: 'settings', label: 'Configuración', route: 'Configuracion' },
        { icon: 'log-out', label: 'Cerrar sesión', route: 'Logout', color: btn_danger },
      ]
    : [
        { icon: 'home', label: 'Inicio', route: 'Inicio' },
        { icon: 'list', label: 'Solicitudes', route: 'Solicitudes', color: color_info },
        { icon: 'calendar', label: 'Agenda', route: 'Agenda' },
        { icon: 'time', label: 'Historial', route: 'Historial' },
        { icon: 'person', label: 'Perfil', route: 'Perfil' },
        { icon: 'settings', label: 'Configuración', route: 'Configuracion' },
        { icon: 'log-out', label: 'Cerrar sesión', route: 'Logout', color: btn_danger },
      ];

/**
 * MainSidebar: Sidebar lateral moderno y elegante
 * - Muestra avatar, nombre y email del usuario
 * - Menú dinámico según el rol
 * - Animación de entrada/salida
 * - Botón de cerrar
 * - Al pulsar un ítem, muestra un Alert con el nombre de la acción
 */
const MainSidebar: React.FC<SidebarProps> = ({ isVisible, user, onClose, onNavigate }) => {
  // Animación de entrada/salida
  const slideAnim = React.useRef(new Animated.Value(-SCREEN_WIDTH * 0.8)).current;
  const navigation = useNavigation();

  React.useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isVisible ? 0 : -SCREEN_WIDTH * 0.8,
      duration: 350,
      useNativeDriver: true,
    }).start();
  }, [isVisible]);

  // Handler para cada botón del menú: muestra un Alert con el nombre de la acción o hace logout
  const handleMenuPress = async (item: { label: string; route: string }) => {
    if (item.route === 'Logout') {
      Alert.alert(
        '🚪 Cerrar sesión',
        '¿Seguro que quieres salir de tu cuenta? No perderás tus datos y podrás volver a ingresar cuando quieras.',
        [
          { text: 'No, quedarme', style: 'cancel' },
          { text: 'Sí, cerrar sesión', style: 'destructive', onPress: async () => {
            await deleteToken();
            navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
          }},
        ],
        { cancelable: true }
      );
      return;
    }
    Alert.alert('Acción', `Has pulsado: ${item.label}`);
    if (onNavigate) onNavigate(item.route);
  };

  // Helper para estilos de botón
  const getButtonStyle = (item: { color?: string; route: string }) => {
    if (item.route === 'Logout') {
      return {
        backgroundColor: btn_danger,
        borderColor: btn_danger,
        borderWidth: 1.5,
        shadowColor: btn_danger,
        shadowOpacity: 0.18,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 4,
      };
    }
    return {
      backgroundColor: color_white,
      borderColor: color_info,
      borderWidth: 1.2,
      shadowColor: color_primary,
      shadowOpacity: 0.08,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 2 },
      elevation: 1,
    };
  };

  return (
    <Animated.View style={[styles.sidebar, { transform: [{ translateX: slideAnim }] }]}>  
      {/* Header con avatar y datos del usuario */}
      <View style={styles.headerContainer}>
        <View style={styles.avatarWrapper}>
          <Image
            source={require('../../../../../assets/Jefry_Astacio_perfil_example.jpg')}
            style={styles.avatar}
          />
        </View>
        <Text style={styles.name}>{user?.name || 'Usuario'}</Text>
        <Text style={styles.email}>{user?.userEmail || ''}</Text>
      </View>
      {/* Menú dinámico según el rol */}
      <View style={styles.menuContainer}>
        {menuItems(user?.roll || '').map((item, idx) => (
          <TouchableOpacity
            key={item.label}
            style={[styles.menuItem, getButtonStyle(item)]}
            activeOpacity={0.85}
            onPress={() => handleMenuPress(item)}
          >
            {item.route !== 'Logout' ? (
              <View style={styles.menuContent}>
                <Ionicons name={item.icon as any} size={26} color={color_primary} style={styles.menuIcon} />
                <Text style={styles.menuText}>{item.label}</Text>
              </View>
            ) : (
              <View style={styles.menuContentLogout}>
                <Ionicons name={item.icon as any} size={26} color={color_white} style={styles.menuIcon} />
                <Text style={styles.menuTextLogout}>{item.label}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>
      {/* Botón cerrar sidebar */}
      <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
        <Ionicons name="close" size={28} color={color_secondary} />
      </TouchableOpacity>
    </Animated.View>
  );
};

// Estilos modernos y responsivos
const styles = StyleSheet.create({
  sidebar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: SCREEN_WIDTH * 0.8,
    backgroundColor: bg_white,
    paddingTop: 0,
    paddingHorizontal: 0,
    zIndex: 99,
    borderTopRightRadius: 36,
    borderBottomRightRadius: 36,
    elevation: 24,
    shadowColor: color_primary,
    shadowOpacity: 0.13,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 10 },
  },
  headerContainer: {
    alignItems: 'center',
    paddingTop: 48,
    paddingBottom: 24,
    backgroundColor: color_primary,
    borderTopRightRadius: 36,
  },
  avatarWrapper: {
    borderWidth: 3,
    borderColor: color_white,
    borderRadius: 50,
    padding: 3,
    marginBottom: 8,
    backgroundColor: color_white,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  name: {
    color: color_white,
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 4,
    letterSpacing: 0.5,
  },
  email: {
    color: color_white,
    fontSize: 14,
    opacity: 0.85,
    marginTop: 2,
    marginBottom: 2,
  },
  menuContainer: {
    flex: 1,
    paddingTop: 18,
    paddingHorizontal: 18,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    paddingVertical: 0,
    paddingHorizontal: 0,
    borderRadius: 16,
    overflow: 'hidden',
    minHeight: 48,
    marginHorizontal: 2,
    // Fondo y borde se definen dinámicamente
  },
  menuContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 16,
    backgroundColor: 'transparent',
  },
  menuContentLogout: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 16,
    backgroundColor: 'transparent',
  },
  menuIcon: {
    marginRight: 18,
    opacity: 0.92,
  },
  menuText: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.2,
    color: color_primary,
    flexShrink: 1,
  },
  menuTextLogout: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.2,
    color: color_white,
    flexShrink: 1,
  },
  closeBtn: {
    position: 'absolute',
    top: 18,
    right: 18,
    backgroundColor: color_white,
    borderRadius: 20,
    padding: 6,
    elevation: 4,
    shadowColor: color_primary,
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
});

export default MainSidebar;
