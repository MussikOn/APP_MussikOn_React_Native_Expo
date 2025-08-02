import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { apiService } from './api';

// Configurar el comportamiento de las notificaciones
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export interface PushNotificationSubscription {
  id: string;
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
  userId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PushNotificationSettings {
  enabled: boolean;
  categories: Record<string, boolean>;
  quietHours: {
    enabled: boolean;
    startTime: string;
    endTime: string;
  };
  sound: boolean;
  vibration: boolean;
}

export interface PushNotificationStats {
  totalSent: number;
  totalDelivered: number;
  totalFailed: number;
  totalRead: number;
  averageDeliveryTime: number;
  successRate: number;
}

class PushNotificationService {
  private expoPushToken: string | null = null;
  private isInitialized = false;

  /**
   * Inicializar el servicio de notificaciones push
   */
  async initialize(): Promise<boolean> {
    try {
      if (this.isInitialized) return true;

      // Verificar si el dispositivo soporta notificaciones push
      if (!Device.isDevice) {
        console.log('❌ Las notificaciones push no están disponibles en el simulador');
        return false;
      }

      // Solicitar permisos
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('❌ Permisos de notificaciones no otorgados');
        return false;
      }

      // Obtener token de Expo
      const token = await this.getExpoPushToken();
      if (!token) {
        console.log('❌ No se pudo obtener el token de Expo');
        return false;
      }

      this.expoPushToken = token;
      this.isInitialized = true;
      console.log('✅ Servicio de notificaciones push inicializado');
      return true;
    } catch (error) {
      console.error('❌ Error inicializando notificaciones push:', error);
      return false;
    }
  }

  /**
   * Obtener token de Expo Push
   */
  private async getExpoPushToken(): Promise<string | null> {
    try {
      const token = await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas?.projectId,
      });
      return token.data;
    } catch (error) {
      console.error('❌ Error obteniendo token de Expo:', error);
      return null;
    }
  }

  /**
   * Suscribirse a notificaciones push
   */
  async subscribeToPushNotifications(userId: string): Promise<boolean> {
    try {
      if (!this.isInitialized || !this.expoPushToken) {
        console.log('❌ Servicio no inicializado o token no disponible');
        return false;
      }

      // Enviar suscripción al backend
      const response = await apiService.post('/push-notifications/subscriptions', {
        userId,
        endpoint: `https://exp.host/--/api/v2/push/send/${this.expoPushToken}`,
        keys: {
          p256dh: this.expoPushToken,
          auth: this.expoPushToken,
        },
        isActive: true,
      });

      if (response.success) {
        console.log('✅ Suscrito a notificaciones push');
        return true;
      } else {
        console.log('❌ Error suscribiéndose a notificaciones push:', response.error);
        return false;
      }
    } catch (error) {
      console.error('❌ Error suscribiéndose a notificaciones push:', error);
      return false;
    }
  }

  /**
   * Desuscribirse de notificaciones push
   */
  async unsubscribeFromPushNotifications(subscriptionId: string): Promise<boolean> {
    try {
      const response = await apiService.delete(`/push-notifications/subscription/${subscriptionId}`);
      
      if (response.success) {
        console.log('✅ Desuscrito de notificaciones push');
        return true;
      } else {
        console.log('❌ Error desuscribiéndose de notificaciones push:', response.error);
        return false;
      }
    } catch (error) {
      console.error('❌ Error desuscribiéndose de notificaciones push:', error);
      return false;
    }
  }

  /**
   * Obtener suscripciones del usuario
   */
  async getUserSubscriptions(): Promise<PushNotificationSubscription[]> {
    try {
      const response = await apiService.get('/push-notifications/subscriptions');
      if (response.success && response.data) {
        return response.data;
      }
      return [];
    } catch (error) {
      console.error('❌ Error obteniendo suscripciones:', error);
      return [];
    }
  }

  /**
   * Obtener configuración de notificaciones
   */
  async getNotificationSettings(): Promise<PushNotificationSettings> {
    try {
      const response = await apiService.get('/push-notifications/settings');
      if (response.success && response.data) {
        return response.data;
      }
    } catch (error) {
      console.error('❌ Error obteniendo configuración:', error);
    }

    // Configuración por defecto
    return {
      enabled: true,
      categories: {
        system: true,
        user: true,
        event: true,
        request: true,
        payment: true,
        chat: true,
      },
      quietHours: {
        enabled: false,
        startTime: '22:00',
        endTime: '08:00',
      },
      sound: true,
      vibration: true,
    };
  }

  /**
   * Actualizar configuración de notificaciones
   */
  async updateNotificationSettings(settings: Partial<PushNotificationSettings>): Promise<boolean> {
    try {
      const response = await apiService.put('/push-notifications/settings', settings);
      return response.success;
    } catch (error) {
      console.error('❌ Error actualizando configuración:', error);
      return false;
    }
  }

  /**
   * Enviar notificación de prueba
   */
  async testPushNotification(): Promise<boolean> {
    try {
      const response = await apiService.post('/push-notifications/test', {});
      return response.success;
    } catch (error) {
      console.error('❌ Error enviando notificación de prueba:', error);
      return false;
    }
  }

  /**
   * Obtener estadísticas de notificaciones
   */
  async getNotificationStats(): Promise<PushNotificationStats | null> {
    try {
      const response = await apiService.get('/push-notifications/stats');
      if (response.success && response.data) {
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('❌ Error obteniendo estadísticas:', error);
      return null;
    }
  }

  /**
   * Verificar si está en horas silenciosas
   */
  isInQuietHours(settings: PushNotificationSettings): boolean {
    if (!settings.quietHours.enabled) return false;

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    const [startHour, startMinute] = settings.quietHours.startTime.split(':').map(Number);
    const [endHour, endMinute] = settings.quietHours.endTime.split(':').map(Number);
    
    const startTime = startHour * 60 + startMinute;
    const endTime = endHour * 60 + endMinute;

    if (startTime <= endTime) {
      return currentTime >= startTime && currentTime <= endTime;
    } else {
      // Horas silenciosas cruzan la medianoche
      return currentTime >= startTime || currentTime <= endTime;
    }
  }

  /**
   * Obtener el estado actual del permiso
   */
  async getPermissionStatus(): Promise<{
    granted: boolean;
    denied: boolean;
    default: boolean;
  }> {
    try {
      const { status } = await Notifications.getPermissionsAsync();
      return {
        granted: status === 'granted',
        denied: status === 'denied',
        default: status === 'undetermined',
      };
    } catch (error) {
      console.error('❌ Error obteniendo estado de permisos:', error);
      return {
        granted: false,
        denied: false,
        default: true,
      };
    }
  }

  /**
   * Mostrar notificación local (para testing)
   */
  async showLocalNotification(title: string, body: string, data?: any): Promise<void> {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data,
          sound: true,
        },
        trigger: null, // Mostrar inmediatamente
      });
    } catch (error) {
      console.error('❌ Error mostrando notificación local:', error);
    }
  }

  /**
   * Configurar listeners de notificaciones
   */
  setupNotificationListeners(
    onNotificationReceived: (notification: Notifications.Notification) => void,
    onNotificationResponse: (response: Notifications.NotificationResponse) => void
  ): () => void {
    const notificationListener = Notifications.addNotificationReceivedListener(onNotificationReceived);
    const responseListener = Notifications.addNotificationResponseReceivedListener(onNotificationResponse);

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }

  /**
   * Limpiar todas las notificaciones
   */
  async clearAllNotifications(): Promise<void> {
    try {
      await Notifications.dismissAllNotificationsAsync();
      console.log('✅ Todas las notificaciones limpiadas');
    } catch (error) {
      console.error('❌ Error limpiando notificaciones:', error);
    }
  }

  /**
   * Obtener el token actual
   */
  getCurrentToken(): string | null {
    return this.expoPushToken;
  }

  /**
   * Verificar si el servicio está inicializado
   */
  isServiceInitialized(): boolean {
    return this.isInitialized;
  }
}

// Instancia singleton del servicio
export const pushNotificationService = new PushNotificationService(); 