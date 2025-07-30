import { useEffect } from 'react';
import { useUser } from '@contexts/UserContext';
import { notificationService } from '@services/notificationService';

export const useInitialNotifications = () => {
  const { user } = useUser();

  useEffect(() => {
    if (user?.userEmail) {
      loadInitialNotifications();
    }
  }, [user?.userEmail]);

  const loadInitialNotifications = async () => {
    try {
      // Cargar notificaciones no leídas al iniciar la app
      const unreadNotifications = await notificationService.getUnreadNotifications(user!.userEmail);
      
      if (unreadNotifications.length > 0) {
        console.log('📱 Notificaciones no leídas encontradas:', unreadNotifications.length);
        
        // Mostrar la notificación más reciente como alerta
        const latestNotification = unreadNotifications[0];
        console.log('📱 Mostrando notificación más reciente:', latestNotification.title);
      }
    } catch (error) {
      console.error('❌ Error al cargar notificaciones iniciales:', error);
    }
  };
}; 