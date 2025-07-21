
import React from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet, Dimensions, Image, ScrollView, Pressable, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
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
import { useUser } from '@contexts/UserContext';

const SCREEN_WIDTH = Dimensions.get('window').width;

interface SidebarProps {
  isVisible: boolean;
  user: Token | undefined;
  onClose?: () => void;
  onNavigate?: (route: string) => void;
}

const MainSidebar: React.FC<SidebarProps> = ({ isVisible, user, onClose, onNavigate }) => {
  const { t } = useTranslation();
  const { user: globalUser, logout } = useUser();
  const slideAnim = React.useRef(new Animated.Value(-SCREEN_WIDTH * 0.8)).current;

  // Menú dinámico según estado de usuario
  // Si no hay usuario, mostrar Home, Login y Register
  const menuItems = () => {
    if (!globalUser) {
      return [
        { icon: 'home', label: t('sidebar.home'), route: 'Home' },
        { icon: 'log-in', label: t('sidebar.login'), route: 'Login', color: color_primary },
        { icon: 'person-add', label: t('sidebar.register'), route: 'Register', color: color_primary },
      ];
    }
    // Si hay usuario, mostrar menú completo según rol
    return globalUser.roll === 'eventCreator'
      ? [
          { icon: 'home', label: t('sidebar.home'), route: 'Dashboard' },
          { icon: 'add-circle', label: t('sidebar.create_event'), route: 'CreateEvent', color: color_success },
          { icon: 'person-add', label: t('sidebar.request_musician'), route: 'ShareMusician', color: color_primary },
          { icon: 'list', label: t('sidebar.my_requests'), route: 'RequestList', color: color_info },
          { icon: 'calendar', label: t('sidebar.events'), route: 'EventList', color: color_info },
          { icon: 'person', label: t('sidebar.profile'), route: 'Profile' },
          { icon: 'settings', label: t('sidebar.configuration'), route: 'Settings' },
          { icon: 'log-out', label: t('sidebar.logout'), route: 'Logout', color: btn_danger },
        ]
      : [
          { icon: 'home', label: t('sidebar.home'), route: 'Dashboard' },
          { icon: 'person-add', label: t('sidebar.request_musician'), route: 'ShareMusician', color: color_primary },
          { icon: 'list', label: t('sidebar.my_requests'), route: 'RequestList', color: color_info },
          { icon: 'calendar', label: t('sidebar.agenda'), route: 'Maps' },
          { icon: 'person', label: t('sidebar.profile'), route: 'Profile' },
          { icon: 'settings', label: t('sidebar.configuration'), route: 'Settings' },
          { icon: 'log-out', label: t('sidebar.logout'), route: 'Logout', color: btn_danger },
        ];
  };

  React.useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isVisible ? 0 : -SCREEN_WIDTH * 0.8,
      duration: 350,
      useNativeDriver: true,
    }).start();
  }, [isVisible]);

  // Handler para Logout/Login
  const handleMenuPress = (route: string) => {
    if (route === 'Logout') {
      logout();
      if (onClose) onClose();
      return;
    }
    if (onNavigate) onNavigate(route);
    if (onClose) onClose();
  };

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
        <Text style={styles.name}>{globalUser?.name || t('sidebar.user')}</Text>
        <Text style={styles.email}>{globalUser?.userEmail || t('sidebar.email')}</Text>
        <View style={styles.roleBadge}>
          <Text style={styles.roleText}>
            {globalUser?.roll === 'eventCreator' ? t('sidebar.event_creator') : t('sidebar.musician')}
          </Text>
        </View>
      </LinearGradient>

      {/* Menú de navegación */}
      <ScrollView style={styles.menuContainer} showsVerticalScrollIndicator={false}>
        {menuItems().map((item, index) => (
          <Pressable
            key={index}
            style={({ pressed }) => [
              styles.menuItem,
              pressed && styles.menuItemPressed,
              item.color && { borderLeftColor: item.color, borderLeftWidth: 4 }
            ]}
            onPress={() => handleMenuPress(item.route)}
          >
            <View style={styles.menuItemContent}>
              <Ionicons 
                name={item.icon as any} 
                size={24} 
                color={item.color || color_secondary} 
              />
              <Text style={[
                styles.menuItemText,
                item.color && { color: item.color, fontWeight: '600' }
              ]}>
                {item.label}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={color_secondary} />
          </Pressable>
        ))}
      </ScrollView>

      {/* Footer con información de la app */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>MussikOn v1.0</Text>
        <Text style={styles.footerSubtext}>Conectando músicos y eventos</Text>
      </View>
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
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1000,
  },
  headerContainer: {
    padding: 20,
    paddingTop: 40,
    alignItems: 'center',
  },
  avatarWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: color_white,
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 12,
  },
  roleBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  roleText: {
    fontSize: 12,
    fontWeight: '600',
    color: color_white,
    textTransform: 'uppercase',
  },
  menuContainer: {
    flex: 1,
    paddingTop: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemPressed: {
    backgroundColor: '#f8f9fa',
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemText: {
    fontSize: 16,
    color: color_secondary,
    marginLeft: 16,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    fontWeight: '600',
    color: color_secondary,
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 12,
    color: '#999',
  },
});

export default MainSidebar;
