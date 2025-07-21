
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
import { getRoleDisplayName, canRequestMusicians, canViewEvents, canViewRequests } from '@utils/functions';

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

    // Menú base para todos los usuarios autenticados
    const baseMenu = [
      { icon: 'home', label: t('sidebar.home'), route: 'Dashboard' },
      { icon: 'person', label: t('sidebar.profile'), route: 'Profile' },
      { icon: 'settings', label: t('sidebar.configuration'), route: 'Settings' },
      { icon: 'log-out', label: t('sidebar.logout'), route: 'Logout', color: btn_danger },
    ];

    // Agregar opciones específicas según permisos
    const specificMenu = [];

    // Solo mostrar "Solicitar Músico" si el usuario tiene permisos
    if (canRequestMusicians(globalUser.roll)) {
      specificMenu.push({
        icon: 'person-add',
        label: t('sidebar.request_musician'),
        route: 'ShareMusician',
        color: color_primary
      });
    }

    // Solo mostrar "Mis Solicitudes" si el usuario tiene permisos
    if (canViewRequests(globalUser.roll)) {
      specificMenu.push({
        icon: 'list',
        label: t('sidebar.my_requests'),
        route: 'RequestList',
        color: color_info
      });
    }

    // Solo mostrar "Eventos" si el usuario tiene permisos
    if (canViewEvents(globalUser.roll)) {
      specificMenu.push({
        icon: 'calendar',
        label: globalUser.roll === 'eventCreator' ? t('sidebar.events') : t('sidebar.agenda'),
        route: globalUser.roll === 'eventCreator' ? 'EventList' : 'Maps',
        color: color_info
      });
    }

    // Combinar menú específico con menú base
    return [...specificMenu, ...baseMenu];
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
        <View style={styles.userInfo}>
          <Text style={styles.userName}>
            {globalUser ? `${globalUser.name} ${globalUser.lastName}` : t('sidebar.user')}
          </Text>
          <Text style={styles.userRole}>
            {globalUser ? getRoleDisplayName(globalUser.roll) : ''}
          </Text>
        </View>
      </LinearGradient>

      {/* Lista de menú */}
      <ScrollView style={styles.menuContainer} showsVerticalScrollIndicator={false}>
        {menuItems().map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.menuItem, item.color && { backgroundColor: item.color + '20' }]}
            onPress={() => handleMenuPress(item.route)}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemContent}>
              <Ionicons 
                name={item.icon as any} 
                size={24} 
                color={item.color || color_white} 
              />
              <Text style={[styles.menuItemText, item.color && { color: item.color }]}>
                {item.label}
              </Text>
            </View>
            <Ionicons 
              name="chevron-forward" 
              size={20} 
              color={item.color || color_white} 
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: SCREEN_WIDTH * 0.8,
    height: '100%',
    backgroundColor: bg_white,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  headerContainer: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  avatarWrapper: {
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: color_white,
  },
  userInfo: {
    alignItems: 'center',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: color_white,
    marginBottom: 4,
  },
  userRole: {
    fontSize: 14,
    color: color_white,
    opacity: 0.9,
  },
  menuContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '600',
    color: color_white,
    marginLeft: 16,
  },
});

export default MainSidebar;
