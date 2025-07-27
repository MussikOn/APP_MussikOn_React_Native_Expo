
import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet, Dimensions, Image, ScrollView, Pressable, Platform, PanResponder } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Token } from '@appTypes/DatasTypes';
import { LinearGradient } from 'expo-linear-gradient';
import { useUser } from '@contexts/UserContext';
import { useTheme } from '@contexts/ThemeContext';

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
  const { theme } = useTheme();
  const slideAnim = useRef(new Animated.Value(-SCREEN_WIDTH * 0.8)).current;

  // PanResponder para swipe to close
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dx < -10,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dx < 0) {
          slideAnim.setValue(Math.max(gestureState.dx, -SCREEN_WIDTH * 0.8));
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx < -60) {
          Animated.timing(slideAnim, {
            toValue: -SCREEN_WIDTH * 0.8,
            duration: 200,
            useNativeDriver: true,
          }).start(() => onClose && onClose());
        } else {
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  // Menú dinámico según estado de usuario
  const menuItems = () => {
    if (!globalUser) {
      return [
        { icon: 'home', label: t('sidebar.home'), route: 'Home' },
        { icon: 'log-in', label: t('sidebar.login'), route: 'Login', color: theme.colors.primary[500] },
        { icon: 'person-add', label: t('sidebar.register'), route: 'Register', color: theme.colors.primary[500] },
      ];
    }
    const baseMenu = [
      { icon: 'home', label: t('sidebar.home'), route: 'Home' },
      // Mis Solicitudes como segunda opción
      ...(['musico', 'eventCreator'].includes(globalUser.roll) ? [{
        icon: 'list',
        label: t('sidebar.my_requests'),
        route: 'MyRequestsList',
        color: theme.colors.primary[500]
      }] : []),
      // Mostrar Dashboard solo si el usuario es musico
      ...(globalUser.roll === 'musico' ? [
        { icon: 'speedometer', label: t('sidebar.dashboard'), route: 'Dashboard', color: theme.colors.primary[500] },
      ] : []),
      { icon: 'person', label: t('sidebar.profile'), route: 'Profile' },
      { icon: 'settings', label: t('sidebar.configuration'), route: 'Settings' },
      { icon: 'log-out', label: t('sidebar.logout'), route: 'Logout', color: theme.colors.error[500] },
    ];
    const specificMenu = [];
    // Mostrar Agenda/Solicitudes para todos los roles logueados
    if (['musico', 'eventCreator'].includes(globalUser.roll)) {
      specificMenu.push({
        icon: 'calendar',
        label: globalUser.roll === 'eventCreator' ? t('sidebar.requests') : t('sidebar.agenda'),
        route: 'MyRequestsList',
        color: theme.colors.accent[500]
      });
    }
    if (globalUser.roll === 'eventCreator') {
      specificMenu.push({
        icon: 'person-add',
        label: t('sidebar.request_musician'),
        route: 'ShareMusician',
        color: theme.colors.primary[500]
      });
    }
    return [...specificMenu, ...baseMenu];
  };

  React.useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isVisible ? 0 : -SCREEN_WIDTH * 0.8,
      duration: 350,
      useNativeDriver: true,
    }).start();
  }, [isVisible]);

  const handleMenuPress = (route: string) => {
    if (route === 'Logout') {
      logout();
      if (onClose) onClose();
      return;
    }
    if (onNavigate) onNavigate(route);
    if (onClose) onClose();
  };

  // Overlay para cerrar tocando fuera
  if (!isVisible) return null;

  // Mostrar el rol capitalizado
  const displayRole = (role: string) => role.charAt(0).toUpperCase() + role.slice(1);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      {/* Overlay oscuro */}
      <Pressable
        style={[styles.overlay, { backgroundColor: theme.colors.secondary + 'CC' }]}
        onPress={onClose}
      />
      {/* Sidebar animado */}
      <Animated.View
        style={[styles.sidebar, { backgroundColor: theme.colors.background.primary, transform: [{ translateX: slideAnim }] }]}
        {...panResponder.panHandlers}
      >
        {/* Botón de cerrar */}
        <TouchableOpacity style={styles.closeButton} onPress={onClose} accessibilityLabel="Cerrar menú">
          <Ionicons name="close" size={28} color={theme.colors.text.inverse} />
        </TouchableOpacity>
        {/* Header con gradiente y avatar */}
        <LinearGradient
          colors={theme.gradients.primary}
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
            <Text style={styles.userName} numberOfLines={1}>
              {globalUser ? `${globalUser.name} ${globalUser.lastName}` : t('sidebar.user')}
            </Text>
            <Text style={styles.userRole} numberOfLines={1}>
              {globalUser ? displayRole(globalUser.roll) : ''}
            </Text>
          </View>
        </LinearGradient>
        {/* Lista de menú */}
        <ScrollView style={styles.menuContainer} showsVerticalScrollIndicator={false}>
          {menuItems().map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.menuItem,
                {
                  backgroundColor: item.color
                    ? `${item.color}22`
                    : theme.colors.background.card,
                },
              ]}
              onPress={() => handleMenuPress(item.route)}
              activeOpacity={0.7}
            >
              <View style={styles.menuItemContent}>
                <Ionicons
                  name={item.icon as any}
                  size={26}
                  color={item.color || theme.colors.text.primary}
                />
                <Text
                  style={[
                    styles.menuItemText,
                    { color: item.color || theme.colors.text.primary },
                  ]}
                  numberOfLines={1}
                >
                  {item.label}
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={item.color || theme.colors.text.primary}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: SCREEN_WIDTH * 0.8,
    height: '100%',
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
    borderTopRightRadius: 24,
    borderBottomRightRadius: 24,
    overflow: 'hidden',
  },
  closeButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 48 : 24,
    right: 16,
    zIndex: 10,
    backgroundColor: '#2228',
    borderRadius: 20,
    padding: 4,
  },
  headerContainer: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 20,
    paddingBottom: 30,
    borderTopRightRadius: 24,
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
    borderColor: '#ffffff',
  },
  userInfo: {
    alignItems: 'center',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
    maxWidth: SCREEN_WIDTH * 0.6,
  },
  userRole: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.9,
    maxWidth: SCREEN_WIDTH * 0.6,
  },
  menuContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    paddingHorizontal: 16,
    marginVertical: 6,
    borderRadius: 16,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemText: {
    fontSize: 17,
    fontWeight: '600',
    marginLeft: 18,
  },
});

export default MainSidebar;
