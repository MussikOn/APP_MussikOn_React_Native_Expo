import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Notification {
  id: string;
  type: 'request_cancelled' | 'request_cancelled_by_musician' | 'request_deleted' | 'musician_accepted' | 'new_event_request';
  title: string;
  message: string;
  eventId?: string;
  event?: any;
  timestamp: Date;
  read: boolean;
  userId: string; // Para filtrar por usuario
}

const NOTIFICATIONS_KEY = '@mussikon_notifications';

export const notificationService = {
  // Guardar notificación
  async saveNotification(notification: Notification): Promise<void> {
    try {
      const existingNotifications = await this.getNotifications();
      const updatedNotifications = [notification, ...existingNotifications];
      
      // Mantener solo las últimas 50 notificaciones
      const limitedNotifications = updatedNotifications.slice(0, 50);
      
      await AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(limitedNotifications));
      console.log('📱 Notificación guardada:', notification.id);
    } catch (error) {
      console.error('❌ Error al guardar notificación:', error);
    }
  },

  // Obtener notificaciones del usuario
  async getNotifications(userId?: string): Promise<Notification[]> {
    try {
      const notificationsJson = await AsyncStorage.getItem(NOTIFICATIONS_KEY);
      if (!notificationsJson) return [];

      const notifications: Notification[] = JSON.parse(notificationsJson);
      
      // Filtrar por usuario si se especifica
      if (userId) {
        return notifications.filter(notification => notification.userId === userId);
      }
      
      return notifications;
    } catch (error) {
      console.error('❌ Error al obtener notificaciones:', error);
      return [];
    }
  },

  // Marcar notificación como leída
  async markAsRead(notificationId: string): Promise<void> {
    try {
      const notifications = await this.getNotifications();
      const updatedNotifications = notifications.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      );
      
      await AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updatedNotifications));
      console.log('📱 Notificación marcada como leída:', notificationId);
    } catch (error) {
      console.error('❌ Error al marcar notificación como leída:', error);
    }
  },

  // Marcar todas las notificaciones como leídas
  async markAllAsRead(userId: string): Promise<void> {
    try {
      const notifications = await this.getNotifications();
      const updatedNotifications = notifications.map(notification => 
        notification.userId === userId 
          ? { ...notification, read: true }
          : notification
      );
      
      await AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updatedNotifications));
      console.log('📱 Todas las notificaciones marcadas como leídas para usuario:', userId);
    } catch (error) {
      console.error('❌ Error al marcar todas las notificaciones como leídas:', error);
    }
  },

  // Eliminar notificación
  async deleteNotification(notificationId: string): Promise<void> {
    try {
      const notifications = await this.getNotifications();
      const updatedNotifications = notifications.filter(notification => 
        notification.id !== notificationId
      );
      
      await AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updatedNotifications));
      console.log('📱 Notificación eliminada:', notificationId);
    } catch (error) {
      console.error('❌ Error al eliminar notificación:', error);
    }
  },

  // Obtener notificaciones no leídas
  async getUnreadNotifications(userId: string): Promise<Notification[]> {
    try {
      const notifications = await this.getNotifications(userId);
      return notifications.filter(notification => !notification.read);
    } catch (error) {
      console.error('❌ Error al obtener notificaciones no leídas:', error);
      return [];
    }
  },

  // Limpiar todas las notificaciones
  async clearAllNotifications(): Promise<void> {
    try {
      await AsyncStorage.removeItem(NOTIFICATIONS_KEY);
      console.log('📱 Todas las notificaciones eliminadas');
    } catch (error) {
      console.error('❌ Error al limpiar notificaciones:', error);
    }
  },

  // Crear notificación desde datos del servidor
  createNotificationFromServer(data: any, userId: string, type: Notification['type']): Notification {
    return {
      id: `${type}_${data.eventId || data.requestId}_${Date.now()}`,
      type,
      title: this.getNotificationTitle(type),
      message: this.getNotificationMessage(type, data),
      eventId: data.eventId || data.requestId,
      event: data.event,
      timestamp: new Date(),
      read: false,
      userId,
    };
  },

  // Obtener título de notificación
  getNotificationTitle(type: Notification['type']): string {
    switch (type) {
      case 'request_cancelled':
        return 'Solicitud Cancelada';
      case 'request_cancelled_by_musician':
        return 'Solicitud Cancelada por Músico';
      case 'request_deleted':
        return 'Solicitud Eliminada';
      case 'musician_accepted':
        return '¡Músico Aceptó tu Solicitud!';
      case 'new_event_request':
        return '¡Nueva Solicitud Disponible!';
      default:
        return 'Nueva Notificación';
    }
  },

  // Obtener mensaje de notificación
  getNotificationMessage(type: Notification['type'], data: any): string {
    const eventName = data.event?.eventName || 'Solicitud de músico';
    
    switch (type) {
      case 'request_cancelled':
        return `El organizador ha cancelado la solicitud "${eventName}"`;
      case 'request_cancelled_by_musician':
        return `El músico ha cancelado la solicitud "${eventName}"`;
      case 'request_deleted':
        return `El organizador ha eliminado la solicitud "${eventName}"`;
      case 'musician_accepted':
        const musicianName = data.musician?.name || 'Un músico';
        return `${musicianName} ha aceptado tu solicitud "${eventName}"`;
      case 'new_event_request':
        const eventType = data.eventType || 'evento';
        const instrument = data.instrument || 'instrumento';
        const budget = data.budget || 0;
        return `Nueva solicitud de ${eventType} - ${instrument} - $${budget}`;
      default:
        return 'Tienes una nueva notificación';
    }
  },
}; 