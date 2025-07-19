
import React from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet, Dimensions, Image, ScrollView, Pressable, Platform } from 'react-native';
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
import { LinearGradient } from 'expo-linear-gradient';

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
        // NUEVO: Opción para el wizard moderno
        { icon: 'person-add', label: 'Solicitar Músico', route: 'SolicitarMusico', color: color_primary },
        // NUEVO: Opción para listado de eventos
        { icon: 'calendar-outline', label: 'Mis Eventos', route: 'MisEventos', color: color_info },
        { icon: 'list', label: 'Solicitudes', route: 'Solicitudes', color: color_info },
        { icon: 'person', label: 'Perfil', route: 'Perfil' },
        { icon: 'settings', label: 'Configuración', route: 'Configuracion' },
        { icon: 'log-out', label: 'Cerrar sesión', route: 'Logout', color: btn_danger },
      ]
    : [
        { icon: 'home', label: 'Inicio', route: 'Inicio' },
        // NUEVO: Opción para el wizard moderno
        { icon: 'person-add', label: 'Solicitar Músico', route: 'SolicitarMusico', color: color_primary },
        // NUEVO: Opción para listado de eventos
        { icon: 'calendar-outline', label: 'Mis Eventos', route: 'MisEventos', color: color_info },
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
      {/* Header con gradiente, avatar destacado y datos */}
      <LinearGradient
        colors={[color_primary, color_info]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerContainer}
      >
        <View style={styles.avatarWrapper}>
          <Image
            source={require('../../../../../assets/Jefry_Astacio_perfil_example.jpg')}
            style={styles.avatar}
          />
        </View>
        <Text style={styles.name}>{user?.name || 'Usuario'}</Text>
        <Text style={styles.email}>{user?.userEmail || ''}</Text>
      </LinearGradient>
      {/* Menú con ScrollView */}
      <ScrollView style={styles.menuScroll} contentContainerStyle={styles.menuContainer} showsVerticalScrollIndicator={false}>
        {menuItems(user?.roll || '').map((item, idx) => (
          <Pressable
            key={item.label}
            style={({ pressed }) => [
              styles.menuItem,
              item.route === 'Logout' ? styles.menuItemDanger : styles.menuItemOutline,
              pressed && styles.menuItemPressed,
              idx === 0 && styles.menuItemFirst,
              idx === menuItems(user?.roll || '').length - 1 && styles.menuItemLast,
            ]}
            android_ripple={{ color: color_primary + '11' }}
            onPress={() => onNavigate && onNavigate(item.route)}
          >
            <Ionicons name={item.icon as any} size={24} color={item.route === 'Logout' ? btn_danger : color_primary} style={styles.menuIcon} />
            <Text style={[styles.menuText, item.route === 'Logout' ? { color: btn_danger } : { color: color_primary }]}>{item.label}</Text>
            {/* Badge para opciones nuevas */}
            {(item.route === 'SolicitarMusico' || item.route === 'MisEventos') && (
              <View style={styles.badgeNew}><Text style={styles.badgeNewText}>¡Nuevo!</Text></View>
            )}
          </Pressable>
        ))}
        <View style={{ height: Platform.OS === 'ios' ? 60 : 40 }} /> {/* Espacio al final para que no se tape el último botón */}
      </ScrollView>
      {/* Separador */}
      <View style={styles.separator} />
      {/* Botón cerrar flotante */}
      <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.8}>
        <Ionicons name="close" size={32} color={color_secondary} />
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
    paddingBottom: 32,
    borderTopRightRadius: 36,
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
    elevation: 8,
    shadowColor: color_primary,
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
  },
  avatarWrapper: {
    borderWidth: 4,
    borderColor: color_white,
    borderRadius: 50,
    padding: 4,
    marginBottom: 10,
    backgroundColor: color_white,
    elevation: 6,
    shadowColor: color_primary,
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  name: {
    color: color_white,
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 6,
    letterSpacing: 0.5,
    textShadowColor: color_primary,
    textShadowRadius: 8,
  },
  email: {
    color: color_white,
    fontSize: 15,
    opacity: 0.92,
    marginTop: 2,
    marginBottom: 2,
    textShadowColor: color_primary,
    textShadowRadius: 4,
  },
  menuScroll: {
    flex: 1,
  },
  menuContainer: {
    paddingTop: 18,
    paddingHorizontal: 18,
    paddingBottom: 18,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    minHeight: 54,
    backgroundColor: color_white,
    borderWidth: 2,
    borderColor: color_primary,
    elevation: 2,
    shadowColor: color_primary,
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    position: 'relative',
  },
  menuItemOutline: {
    backgroundColor: color_white,
    borderColor: color_primary,
  },
  menuItemDanger: {
    backgroundColor: color_white,
    borderColor: btn_danger,
  },
  menuItemPressed: {
    backgroundColor: color_info + '11',
    shadowOpacity: 0.16,
    transform: [{ scale: 0.98 }],
  },
  menuItemFirst: {
    marginTop: 8,
  },
  menuItemLast: {
    marginBottom: 8,
  },
  menuIcon: {
    marginRight: 18,
    opacity: 0.98,
  },
  menuText: {
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.2,
    flex: 1,
  },
  badgeNew: {
    backgroundColor: color_info,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 1,
    position: 'absolute',
    top: 8,
    right: 12,
    zIndex: 2,
  },
  badgeNewText: {
    color: color_white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  separator: {
    height: 1,
    backgroundColor: color_secondary + '22',
    marginHorizontal: 18,
    marginVertical: 8,
    borderRadius: 2,
  },
  closeBtn: {
    position: 'absolute',
    top: 18,
    right: 18,
    backgroundColor: color_white,
    borderRadius: 24,
    padding: 10,
    elevation: 8,
    shadowColor: color_primary,
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 2 },
  },
});

export default MainSidebar;

//
// Cambios de diseño:
// - Botones tipo outline/fill suaves, fondo blanco, borde color principal
// - Icono a la izquierda, texto grande y legible, badge pequeño y discreto
// - Feedback sutil, espaciado cómodo, contraste profesional
// - ScrollView para menú
// - Botón cerrar flotante y visible
//
