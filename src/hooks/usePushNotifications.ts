import { useState, useEffect, useCallback, useRef } from 'react';
import { Alert, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { pushNotificationService, PushNotificationSettings, PushNotificationSubscription } from '@services/pushNotificationService';
import { useAuth } from '@contexts/AuthContext';

export interface PushNotificationState {
  isInitialized: boolean;
  isSubscribed: boolean;
  permission: {
    granted: boolean;
    denied: boolean;
    default: boolean;
  };
  settings: PushNotificationSettings;
  subscriptions: PushNotificationSubscription[];
  stats: {
    totalSent: number;
    totalDelivered: number;
    totalFailed: number;
    totalRead: number;
    successRate: number;
  } | null;
  isLoading: boolean;
  error: string | null;
}

export interface PushNotificationActions {
  initialize: () => Promise<boolean>;
  subscribe: () => Promise<boolean>;
  unsubscribe: (subscriptionId: string) => Promise<boolean>;
  updateSettings: (settings: Partial<PushNotificationSettings>) => Promise<boolean>;
  testNotification: () => Promise<boolean>;
  clearAllNotifications: () => Promise<void>;
  refreshStats: () => Promise<void>;
  refreshSubscriptions: () => Promise<void>;
}

export const usePushNotifications = (): PushNotificationState & PushNotificationActions => {
  const { user } = useAuth();
  const [state, setState] = useState<PushNotificationState>({
    isInitialized: false,
    isSubscribed: false,
    permission: {
      granted: false,
      denied: false,
      default: true,
    },
    settings: {
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
    },
    subscriptions: [],
    stats: null,
    isLoading: false,
    error: null,
  });

  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  // Inicializar el servicio de notificaciones push
  const initialize = useCallback(async (): Promise<boolean> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      // Inicializar el servicio
      const success = await pushNotificationService.initialize();
      if (!success) {
        setState(prev => ({ 
          ...prev, 
          isLoading: false, 
          error: 'No se pudo inicializar el servicio de notificaciones' 
        }));
        return false;
      }

      // Obtener estado de permisos
      const permission = await pushNotificationService.getPermissionStatus();

      // Obtener configuración
      const settings = await pushNotificationService.getNotificationSettings();

      // Obtener suscripciones si hay usuario
      let subscriptions: PushNotificationSubscription[] = [];
      let isSubscribed = false;
      if (user?.id) {
        subscriptions = await pushNotificationService.getUserSubscriptions();
        isSubscribed = subscriptions.length > 0;
      }

      // Obtener estadísticas
      const stats = await pushNotificationService.getNotificationStats();

      setState(prev => ({
        ...prev,
        isInitialized: true,
        isSubscribed,
        permission,
        settings,
        subscriptions,
        stats,
        isLoading: false,
      }));

      return true;
    } catch (error) {
      console.error('❌ Error inicializando notificaciones push:', error);
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: 'Error inicializando notificaciones push' 
      }));
      return false;
    }
  }, [user?.id]);

  // Suscribirse a notificaciones push
  const subscribe = useCallback(async (): Promise<boolean> => {
    try {
      if (!user?.id) {
        Alert.alert('Error', 'Debes estar autenticado para suscribirte a notificaciones');
        return false;
      }

      setState(prev => ({ ...prev, isLoading: true, error: null }));

      const success = await pushNotificationService.subscribeToPushNotifications(user.id);
      if (success) {
        // Refrescar suscripciones
        const subscriptions = await pushNotificationService.getUserSubscriptions();
        setState(prev => ({
          ...prev,
          isSubscribed: subscriptions.length > 0,
          subscriptions,
          isLoading: false,
        }));
        return true;
      } else {
        setState(prev => ({ 
          ...prev, 
          isLoading: false, 
          error: 'No se pudo suscribir a las notificaciones' 
        }));
        return false;
      }
    } catch (error) {
      console.error('❌ Error suscribiéndose a notificaciones:', error);
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: 'Error suscribiéndose a notificaciones' 
      }));
      return false;
    }
  }, [user?.id]);

  // Desuscribirse de notificaciones push
  const unsubscribe = useCallback(async (subscriptionId: string): Promise<boolean> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      const success = await pushNotificationService.unsubscribeFromPushNotifications(subscriptionId);
      if (success) {
        // Refrescar suscripciones
        const subscriptions = await pushNotificationService.getUserSubscriptions();
        setState(prev => ({
          ...prev,
          isSubscribed: subscriptions.length > 0,
          subscriptions,
          isLoading: false,
        }));
        return true;
      } else {
        setState(prev => ({ 
          ...prev, 
          isLoading: false, 
          error: 'No se pudo desuscribir de las notificaciones' 
        }));
        return false;
      }
    } catch (error) {
      console.error('❌ Error desuscribiéndose de notificaciones:', error);
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: 'Error desuscribiéndose de notificaciones' 
      }));
      return false;
    }
  }, []);

  // Actualizar configuración
  const updateSettings = useCallback(async (newSettings: Partial<PushNotificationSettings>): Promise<boolean> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      const success = await pushNotificationService.updateNotificationSettings(newSettings);
      if (success) {
        // Refrescar configuración
        const settings = await pushNotificationService.getNotificationSettings();
        setState(prev => ({
          ...prev,
          settings,
          isLoading: false,
        }));
        return true;
      } else {
        setState(prev => ({ 
          ...prev, 
          isLoading: false, 
          error: 'No se pudo actualizar la configuración' 
        }));
        return false;
      }
    } catch (error) {
      console.error('❌ Error actualizando configuración:', error);
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: 'Error actualizando configuración' 
      }));
      return false;
    }
  }, []);

  // Enviar notificación de prueba
  const testNotification = useCallback(async (): Promise<boolean> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      const success = await pushNotificationService.testPushNotification();
      setState(prev => ({ ...prev, isLoading: false }));
      
      if (success) {
        Alert.alert('Éxito', 'Notificación de prueba enviada');
        return true;
      } else {
        Alert.alert('Error', 'No se pudo enviar la notificación de prueba');
        return false;
      }
    } catch (error) {
      console.error('❌ Error enviando notificación de prueba:', error);
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: 'Error enviando notificación de prueba' 
      }));
      return false;
    }
  }, []);

  // Limpiar todas las notificaciones
  const clearAllNotifications = useCallback(async (): Promise<void> => {
    try {
      await pushNotificationService.clearAllNotifications();
      Alert.alert('Éxito', 'Todas las notificaciones han sido limpiadas');
    } catch (error) {
      console.error('❌ Error limpiando notificaciones:', error);
      Alert.alert('Error', 'No se pudieron limpiar las notificaciones');
    }
  }, []);

  // Refrescar estadísticas
  const refreshStats = useCallback(async (): Promise<void> => {
    try {
      const stats = await pushNotificationService.getNotificationStats();
      setState(prev => ({ ...prev, stats }));
    } catch (error) {
      console.error('❌ Error refrescando estadísticas:', error);
    }
  }, []);

  // Refrescar suscripciones
  const refreshSubscriptions = useCallback(async (): Promise<void> => {
    try {
      const subscriptions = await pushNotificationService.getUserSubscriptions();
      setState(prev => ({
        ...prev,
        subscriptions,
        isSubscribed: subscriptions.length > 0,
      }));
    } catch (error) {
      console.error('❌ Error refrescando suscripciones:', error);
    }
  }, []);

  // Configurar listeners de notificaciones
  useEffect(() => {
    if (!state.isInitialized) return;

    // Listener para notificaciones recibidas
    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      console.log('📱 Notificación recibida:', notification);
      // Aquí puedes manejar la notificación recibida
      // Por ejemplo, actualizar el estado de la app
    });

    // Listener para respuestas a notificaciones
    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log('📱 Respuesta a notificación:', response);
      // Aquí puedes manejar cuando el usuario toca la notificación
      // Por ejemplo, navegar a una pantalla específica
      const data = response.notification.request.content.data;
      if (data?.screen) {
        // Navegar a la pantalla especificada
        // navigation.navigate(data.screen, data.params);
      }
    });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, [state.isInitialized]);

  // Inicializar automáticamente cuando hay usuario
  useEffect(() => {
    if (user?.id && !state.isInitialized) {
      initialize();
    }
  }, [user?.id, state.isInitialized, initialize]);

  // Refrescar suscripciones cuando cambia el usuario
  useEffect(() => {
    if (user?.id && state.isInitialized) {
      refreshSubscriptions();
    }
  }, [user?.id, state.isInitialized, refreshSubscriptions]);

  return {
    ...state,
    initialize,
    subscribe,
    unsubscribe,
    updateSettings,
    testNotification,
    clearAllNotifications,
    refreshStats,
    refreshSubscriptions,
  };
}; 