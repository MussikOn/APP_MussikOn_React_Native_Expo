import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@hooks/useAppTheme';
import { useTranslation } from 'react-i18next';
import { useSidebar } from '@contexts/SidebarContext';

interface MainSidebarProps {
  isVisible: boolean;
  user?: any;
  onClose: () => void;
  onNavigate: (route: string) => void;
}

const MainSidebar: React.FC<MainSidebarProps> = ({ isVisible, user, onClose, onNavigate }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const menuItems = [
    { id: 'home', title: t('sidebar.home'), icon: 'home-outline', route: 'Home' },
    { id: 'profile', title: t('sidebar.profile'), icon: 'person-outline', route: 'Profile' },
    { id: 'events', title: t('sidebar.events'), icon: 'calendar-outline', route: 'MyRequestsList' },
    { id: 'available', title: t('sidebar.available'), icon: 'list-outline', route: 'AvailableRequests' },
    { id: 'chat', title: t('sidebar.chat'), icon: 'chatbubbles-outline', route: 'ChatList' },
    { id: 'notifications', title: t('sidebar.notifications'), icon: 'notifications-outline', route: 'Notifications' },
    { id: 'payments', title: t('sidebar.payments'), icon: 'card-outline', route: 'PaymentBalance' },
    { id: 'settings', title: t('sidebar.settings'), icon: 'settings-outline', route: 'Settings' },
  ];

  const handleNavigate = (route: string) => {
    onNavigate(route);
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
        <View style={[styles.container, { backgroundColor: theme.colors.background.card }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.colors.text.primary }]}>
              {t('sidebar.title')}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={theme.colors.text.primary} />
            </TouchableOpacity>
          </View>

          <View style={styles.menuContainer}>
            {menuItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.menuItem, { borderBottomColor: theme.colors.border.primary }]}
                onPress={() => handleNavigate(item.route)}
              >
                <Ionicons name={item.icon as any} size={24} color={theme.colors.text.primary} />
                <Text style={[styles.menuText, { color: theme.colors.text.primary }]}>
                  {item.title}
                </Text>
                <Ionicons name="chevron-forward" size={20} color={theme.colors.text.secondary} />
              </TouchableOpacity>
            ))}
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
    paddingTop: 50,
    width: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 8,
  },
  menuContainer: {
    flex: 1,
    paddingTop: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 15,
  },
});

export default MainSidebar;
