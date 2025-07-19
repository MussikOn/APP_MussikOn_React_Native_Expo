
import React from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet, Dimensions, Image } from 'react-native';
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

const SCREEN_WIDTH = Dimensions.get('window').width;

interface SidebarProps {
  isVisible: boolean;
  user: Token | undefined;
  onClose?: () => void;
  onNavigate?: (route: string) => void;
}

const menuItems = (role: string) =>
  role === 'organizador'
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

const MainSidebar: React.FC<SidebarProps> = ({ isVisible, user, onClose, onNavigate }) => {
  const slideAnim = React.useRef(new Animated.Value(-SCREEN_WIDTH * 0.8)).current;

  React.useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isVisible ? 0 : -SCREEN_WIDTH * 0.8,
      duration: 350,
      useNativeDriver: true,
    }).start();
  }, [isVisible]);

  return (
    <Animated.View style={[styles.sidebar, { transform: [{ translateX: slideAnim }] }]}>  
      {/* Header con avatar y datos */}
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
      {/* Menú */}
      <View style={styles.menuContainer}>
        {menuItems(user?.roll || '').map((item, idx) => (
          <TouchableOpacity
            key={item.label}
            style={[styles.menuItem, item.color && { backgroundColor: item.color + '15' }]}
            activeOpacity={0.7}
            onPress={() => onNavigate && onNavigate(item.route)}
          >
            <Ionicons name={item.icon as any} size={28} color={item.color || color_primary} style={styles.menuIcon} />
            <Text style={[styles.menuText, { color: item.color || color_primary }]}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {/* Botón cerrar */}
      <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
        <Ionicons name="close" size={28} color={color_secondary} />
      </TouchableOpacity>
    </Animated.View>
  );
};

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
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: 'rgba(0,74,173,0.04)',
    elevation: 1,
  },
  menuIcon: {
    marginRight: 18,
    opacity: 0.92,
  },
  menuText: {
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.2,
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
