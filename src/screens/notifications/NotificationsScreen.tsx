import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  RefreshControl,
  ActivityIndicator,
  Platform
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@contexts/ThemeContext';
import { useUser } from '@contexts/UserContext';
import { useSidebar } from '@contexts/SidebarContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { notificationService, Notification } from '@services/notificationService';

interface NotificationsScreenProps {
  navigation: any;
}

const NotificationsScreen: React.FC<NotificationsScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const { user } = useUser();
  const { openSidebar } = useSidebar();
  const insets = useSafeAreaInsets();
  
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user?.userEmail) {
      loadNotifications();
    }
  }, [user?.userEmail]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const userNotifications = await notificationService.getNotifications(user!.userEmail);
      setNotifications(userNotifications);
    } catch (error) {
      console.error('❌ Error al cargar notificaciones:', error);
      Alert.alert('Error', 'No se pudieron cargar las notificaciones');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadNotifications();
    setRefreshing(false);
  };

  const handleMarkAsRead = async (notification: Notification) => {
    try {
      await notificationService.markAsRead(notification.id);
      await loadNotifications(); // Recargar lista
    } catch (error) {
      console.error('❌ Error al marcar como leída:', error);
    }
  };

  const handleNotificationPress = (notification: Notification) => {
    // Marcar como leída
    handleMarkAsRead(notification);
    
    // Navegar según el tipo de notificación
    if (notification.type === 'new_event_request') {
      // Para notificaciones de nuevas solicitudes, ir a la pantalla de solicitudes disponibles
      navigation.navigate('AvailableRequests');
    } else if (notification.eventId) {
      // Para otras notificaciones con eventId, navegar a detalles de la solicitud
      navigation.navigate('RequestDetail', { requestId: notification.eventId });
    } else {
      // Si no tiene eventId, ir a la lista de solicitudes
      navigation.navigate('MyRequestsList');
    }
    
    // Mostrar feedback táctil
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleDeleteNotification = async (notification: Notification) => {
    Alert.alert(
      'Eliminar Notificación',
      '¿Estás seguro de que quieres eliminar esta notificación?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await notificationService.deleteNotification(notification.id);
              await loadNotifications(); // Recargar lista
            } catch (error) {
              console.error('❌ Error al eliminar notificación:', error);
              Alert.alert('Error', 'No se pudo eliminar la notificación');
            }
          }
        }
      ]
    );
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead(user!.userEmail);
      await loadNotifications(); // Recargar lista
    } catch (error) {
      console.error('❌ Error al marcar todas como leídas:', error);
    }
  };

  const handleClearAll = async () => {
    Alert.alert(
      'Limpiar Todas las Notificaciones',
      '¿Estás seguro de que quieres eliminar todas las notificaciones?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Limpiar',
          style: 'destructive',
          onPress: async () => {
            try {
              await notificationService.clearAllNotifications();
              setNotifications([]);
            } catch (error) {
              console.error('❌ Error al limpiar notificaciones:', error);
              Alert.alert('Error', 'No se pudieron limpiar las notificaciones');
            }
          }
        }
      ]
    );
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'request_cancelled':
        return 'close-circle';
      case 'request_cancelled_by_musician':
        return 'close-circle-outline';
      case 'request_deleted':
        return 'trash';
      case 'musician_accepted':
        return 'checkmark-circle';
      default:
        return 'notifications';
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'request_cancelled':
      case 'request_cancelled_by_musician':
      case 'request_deleted':
        return theme.colors.error[500];
      case 'musician_accepted':
        return theme.colors.success[500];
      default:
        return theme.colors.primary[500];
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Ahora';
    if (minutes < 60) return `Hace ${minutes} min`;
    if (hours < 24) return `Hace ${hours} h`;
    if (days < 7) return `Hace ${days} días`;
    return new Date(date).toLocaleDateString('es-ES');
  };

  const renderNotification = ({ item }: { item: Notification }) => (
    <TouchableOpacity
      style={[
        styles.notificationItem,
        { 
          backgroundColor: theme.colors.background.card,
          borderColor: theme.colors.border.primary,
        }
      ]}
      onPress={() => handleNotificationPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.notificationHeader}>
        <View style={styles.iconContainer}>
          <Ionicons 
            name={getNotificationIcon(item.type) as any} 
            size={24} 
            color={getNotificationColor(item.type)} 
          />
        </View>
        <View style={styles.notificationContent}>
          <Text style={[styles.notificationTitle, { color: theme.colors.text.primary }]}>
            {item.title}
          </Text>
          <Text style={[styles.notificationMessage, { color: theme.colors.text.secondary }]}>
            {item.message}
          </Text>
          <Text style={[styles.notificationTime, { color: theme.colors.text.tertiary }]}>
            {formatDate(item.timestamp)}
          </Text>
        </View>
        <View style={styles.notificationActions}>
          {!item.read && (
            <View style={[styles.unreadDot, { backgroundColor: theme.colors.primary[500] }]} />
          )}
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation(); // Evitar que se active el onPress del contenedor
              handleDeleteNotification(item);
            }}
            style={styles.actionButton}
          >
            <Ionicons name="trash-outline" size={20} color={theme.colors.error[500]} />
          </TouchableOpacity>
          {/* Indicador de que es tocable */}
          <Ionicons 
            name="chevron-forward" 
            size={16} 
            color={theme.colors.text.tertiary} 
            style={styles.chevronIcon}
          />
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background.primary }]}>
        <ActivityIndicator size="large" color={theme.colors.primary[500]} />
        <Text style={[styles.loadingText, { color: theme.colors.text.secondary }]}>
          Cargando notificaciones...
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
      {/* Header personalizado con botón del sidebar */}
      <View style={[styles.customHeader, { backgroundColor: theme.colors.background.primary }]}>
        <TouchableOpacity
          onPress={openSidebar}
          style={[styles.sidebarButton, {
            backgroundColor: theme.colors.background.card,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 3.84,
            elevation: 5,
          }]}
          accessibilityLabel="Abrir menú"
        >
          <Ionicons name="menu" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text.primary }]}>
          Notificaciones
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Contenido principal */}
      <View style={styles.content}>

      {/* Notifications List */}
      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary[500]]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="notifications-off" size={64} color={theme.colors.text.tertiary} />
            <Text style={[styles.emptyTitle, { color: theme.colors.text.secondary }]}>
              No hay notificaciones
            </Text>
            <Text style={[styles.emptyMessage, { color: theme.colors.text.tertiary }]}>
              Cuando recibas notificaciones, aparecerán aquí
            </Text>
          </View>
        }
      />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    padding: 8,
    marginLeft: 8,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  notificationItem: {
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    marginRight: 12,
    marginTop: 2,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  notificationTime: {
    fontSize: 12,
  },
  notificationActions: {
    alignItems: 'center',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  actionButton: {
    padding: 4,
  },
  chevronIcon: {
    marginLeft: 8,
    marginTop: 2,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  customHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sidebarButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  headerSpacer: {
    width: 44, // Ajustar según sea necesario para balancear el botón
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
});

export default NotificationsScreen; 