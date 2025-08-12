import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Dimensions, Animated, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@hooks/useAppTheme';
import { useTranslation } from 'react-i18next';
import { useSidebar } from '@contexts/SidebarContext';
import { LinearGradient } from 'expo-linear-gradient';

interface MainSidebarProps {
  isVisible: boolean;
  user?: any;
  onClose: () => void;
  onNavigate: (route: string) => void;
}

const MainSidebar: React.FC<MainSidebarProps> = ({ isVisible, user, onClose, onNavigate }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [activeItem, setActiveItem] = useState<string | null>(null);

  const menuItems = [
    // Pantalla principal según el rol
    ...(user?.roll === 'musician' ? [
      { 
        id: 'dashboard', 
        title: t('sidebar.dashboard') || 'Dashboard', 
        icon: 'grid-outline', 
        route: 'Dashboard',
        color: theme.colors.primary[400],
        themeKey: 'primary'
      }
    ] : [
      { 
        id: 'home', 
        title: t('sidebar.home'), 
        icon: 'home-outline', 
        route: 'Home',
        color: theme.colors.primary[500],
        themeKey: 'primary'
      }
    ]),
    { 
      id: 'profile', 
      title: t('sidebar.profile'), 
      icon: 'person-outline', 
      route: 'Profile',
      color: theme.colors.success[500],
      themeKey: 'success'
    },
    { 
      id: 'events', 
      title: t('sidebar.events'), 
      icon: 'calendar-outline', 
      route: 'MyRequestsList',
      color: theme.colors.error[500],
      themeKey: 'error'
    },
    { 
      id: 'available', 
      title: t('sidebar.available'), 
      icon: 'list-outline', 
      route: 'AvailableRequests',
      color: theme.colors.warning[500],
      themeKey: 'warning'
    },
    { 
      id: 'chat', 
      title: t('sidebar.chat'), 
      icon: 'chatbubbles-outline', 
      route: 'ChatList',
      color: theme.colors.accent[500],
      themeKey: 'accent'
    },
    { 
      id: 'notifications', 
      title: t('sidebar.notifications'), 
      icon: 'notifications-outline', 
      route: 'Notifications',
      color: theme.colors.primary[600],
      themeKey: 'primary'
    },
    { 
      id: 'payments', 
      title: t('sidebar.payments'), 
      icon: 'card-outline', 
      route: 'PaymentBalance',
      color: theme.colors.success[600],
      themeKey: 'success'
    },
    { 
      id: 'settings', 
      title: t('sidebar.settings'), 
      icon: 'settings-outline', 
      route: 'Settings',
      color: theme.colors.neutral[500],
      themeKey: 'neutral'
    },
  ];

  const handleNavigate = (route: string, itemId: string) => {
    setActiveItem(itemId);
    
    // Si es Dashboard o Home, navegar a MainTabs
    if (route === 'Dashboard' || route === 'Home') {
      onNavigate('MainTabs');
    } else {
      onNavigate(route);
    }
    
    onClose();
  };

  if (!isVisible) return null;

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[
          styles.container, 
          { 
            backgroundColor: theme.colors.background.secondary,
            shadowColor: theme.colors.primary[500],
            shadowOffset: { width: 2, height: 0 },
            shadowOpacity: 0.15,
            shadowRadius: 15,
            elevation: 15,
          }
        ]}>
          {/* Header con gradiente del tema */}
          <LinearGradient
            colors={theme.gradients.primary}
            style={styles.headerGradient}
          >
            <View style={styles.header}>
              <View style={styles.userInfo}>
                <View style={[styles.avatarContainer, { backgroundColor: 'rgba(255, 255, 255, 0.15)' }]}>
                  <Ionicons name="person-circle" size={50} color={theme.colors.text.inverse} />
                </View>
                <View style={styles.userDetails}>
                  <Text style={[styles.welcomeText, { color: 'rgba(255, 255, 255, 0.8)' }]}>¡Bienvenido!</Text>
                  <Text style={[styles.userName, { color: theme.colors.text.inverse }]}>{user?.name || 'Usuario'}</Text>
                </View>
              </View>
              <TouchableOpacity onPress={onClose} style={[styles.closeButton, { backgroundColor: 'rgba(255, 255, 255, 0.15)' }]}>
                <Ionicons name="close" size={24} color={theme.colors.text.inverse} />
              </TouchableOpacity>
            </View>
          </LinearGradient>

          {/* Contenido del menú con scroll */}
          <ScrollView 
            style={styles.menuContainer}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.menuContent}
          >
            {menuItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.menuItem,
                  activeItem === item.id && styles.activeMenuItem
                ]}
                onPress={() => handleNavigate(item.route, item.id)}
                activeOpacity={0.8}
              >
                <View style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}>
                  <Ionicons 
                    name={item.icon as any} 
                    size={26} 
                    color={item.color} 
                  />
                </View>
                <Text style={[styles.menuText, { color: theme.colors.text.primary }]}>
                  {item.title}
                </Text>
                <View style={[styles.arrowContainer, { backgroundColor: theme.colors.background.overlay }]}>
                  <Ionicons 
                    name="chevron-forward" 
                    size={18} 
                    color={theme.colors.text.secondary} 
                  />
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Footer con información */}
          <View style={[styles.footer, { borderTopColor: theme.colors.border.secondary }]}>
            <Text style={[styles.footerText, { color: theme.colors.text.tertiary }]}>MussikOn v1.0</Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    flex: 1,
    width: '85%',
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 25,
  },
  userInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  userDetails: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContainer: {
    flex: 1,
  },
  menuContent: {
    paddingTop: 25,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 18,
    marginBottom: 12,
    borderRadius: 20,
    backgroundColor: 'rgba(1, 74, 173, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(1, 74, 173, 0.1)',
  },
  activeMenuItem: {
    backgroundColor: 'rgba(1, 74, 173, 0.12)',
    borderColor: 'rgba(1, 74, 173, 0.2)',
    transform: [{ scale: 1.01 }],
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  arrowContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    paddingVertical: 20,
    paddingHorizontal: 25,
    borderTopWidth: 1,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    fontWeight: '500',
  },
});

export default MainSidebar;
