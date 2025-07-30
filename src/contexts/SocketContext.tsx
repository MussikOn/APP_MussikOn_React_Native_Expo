import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { Alert } from 'react-native';
import { useUser } from './UserContext';
import { notificationService } from '@services/notificationService';
import { getSocketUrl, getSocketConnectionOptions, getSocketEvents } from '../config/apiConfig';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  notifications: Notification[];
  clearNotifications: () => void;
}

interface Notification {
  id: string;
  type: 'request_cancelled' | 'request_cancelled_by_musician' | 'request_deleted' | 'musician_accepted' | 'new_event_request';
  title: string;
  message: string;
  eventId?: string;
  event?: any;
  timestamp: Date;
  read: boolean;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

interface SocketProviderProps {
  children: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { user } = useUser();

  useEffect(() => {
    if (!user?.userEmail) return;

    // Crear conexión Socket.IO usando configuración centralizada
    const socketInstance = io(getSocketUrl(), getSocketConnectionOptions());

    // Obtener eventos de Socket.IO
    const socketEvents = getSocketEvents();

    // Eventos de conexión
    socketInstance.on('connect', () => {
      console.log('🔌 Socket.IO conectado');
      setIsConnected(true);
      
      // Autenticar el usuario con el servidor
      socketInstance.emit(socketEvents.AUTHENTICATE, {
        userEmail: user.userEmail,
        userId: user.userEmail, // Usar email como ID
      });
    });

    socketInstance.on('disconnect', () => {
      console.log('🔌 Socket.IO desconectado');
      setIsConnected(false);
    });

    socketInstance.on('connect_error', (error) => {
      console.error('❌ Error de conexión Socket.IO:', error);
      setIsConnected(false);
    });

    // Evento de solicitud cancelada por organizador
    socketInstance.on(socketEvents.REQUEST_CANCELLED, async (data: any) => {
      console.log('📢 Notificación: Solicitud cancelada por organizador', data);
      
      // Crear notificación usando el servicio
      const notification = notificationService.createNotificationFromServer(
        data, 
        user.userEmail, 
        'request_cancelled'
      );

      // Guardar notificación localmente
      await notificationService.saveNotification(notification);
      setNotifications(prev => [notification, ...prev]);

      // Mostrar alerta nativa
      Alert.alert(
        'Solicitud Cancelada',
        `El organizador ha cancelado la solicitud "${data.event?.eventName || 'Solicitud de músico'}"`,
        [
          {
            text: 'Cerrar',
            style: 'cancel',
          },
        ]
      );
    });

    // Evento de solicitud cancelada por músico
    socketInstance.on(socketEvents.REQUEST_CANCELLED_BY_MUSICIAN, async (data: any) => {
      console.log('📢 Notificación: Solicitud cancelada por músico', data);
      
      // Crear notificación usando el servicio
      const notification = notificationService.createNotificationFromServer(
        data, 
        user.userEmail, 
        'request_cancelled_by_musician'
      );

      // Guardar notificación localmente
      await notificationService.saveNotification(notification);
      setNotifications(prev => [notification, ...prev]);

      // Mostrar alerta nativa
      Alert.alert(
        'Solicitud Cancelada por Músico',
        `El músico ha cancelado la solicitud "${data.event?.eventName || 'Solicitud de músico'}"`,
        [
          {
            text: 'Cerrar',
            style: 'cancel',
          },
        ]
      );
    });

    // Evento de solicitud eliminada
    socketInstance.on(socketEvents.REQUEST_DELETED, async (data: any) => {
      console.log('📢 Notificación: Solicitud eliminada', data);
      
      // Crear notificación usando el servicio
      const notification = notificationService.createNotificationFromServer(
        data, 
        user.userEmail, 
        'request_deleted'
      );

      // Guardar notificación localmente
      await notificationService.saveNotification(notification);
      setNotifications(prev => [notification, ...prev]);

      // Mostrar alerta nativa
      Alert.alert(
        'Solicitud Eliminada',
        `El organizador ha eliminado la solicitud "${data.event?.eventName || 'Solicitud de músico'}"`,
        [
          {
            text: 'Cerrar',
            style: 'cancel',
          },
        ]
      );
    });

    // Evento de músico aceptado
    socketInstance.on(socketEvents.MUSICIAN_ACCEPTED, async (data: any) => {
      console.log('📢 Notificación: Músico aceptó la solicitud', data);
      
      // Crear notificación usando el servicio
      const notification = notificationService.createNotificationFromServer(
        data, 
        user.userEmail, 
        'musician_accepted'
      );

      // Guardar notificación localmente
      await notificationService.saveNotification(notification);
      setNotifications(prev => [notification, ...prev]);

      // Mostrar alerta nativa
      Alert.alert(
        '¡Músico Aceptó tu Solicitud!',
        `${data.musician?.name || 'Un músico'} ha aceptado tu solicitud "${data.event?.eventName || 'Solicitud de músico'}"`,
        [
          {
            text: 'Cerrar',
            style: 'cancel',
          },
        ]
      );
    });

    // Evento de nueva solicitud (para músicos)
    socketInstance.on('new_event_request', async (data: any) => {
      console.log('📢 Nueva solicitud recibida:', data);
      
      // Solo mostrar a músicos
      if (user.roll === 'musico') {
        // Crear notificación usando el servicio
        const notification = notificationService.createNotificationFromServer(
          data, 
          user.userEmail, 
          'new_event_request'
        );

        // Guardar notificación localmente
        await notificationService.saveNotification(notification);
        setNotifications(prev => [notification, ...prev]);

        // Mostrar alerta nativa
        Alert.alert(
          '¡Nueva Solicitud Disponible!',
          `Nueva solicitud de ${data.eventType || 'evento'} - ${data.instrument || 'instrumento'} - $${data.budget || 0}`,
          [
            {
              text: 'Ver Solicitudes',
              onPress: () => {
                // Navegar a la pantalla de solicitudes disponibles
                // Por ahora, solo cerramos la alerta
                // En el futuro, navegaremos a AvailableRequestsScreen
              },
            },
            {
              text: 'Cerrar',
              style: 'cancel',
            },
          ]
        );
      }
    });

    setSocket(socketInstance);

    // Cleanup al desmontar
    return () => {
      socketInstance.disconnect();
    };
  }, [user?.userEmail]);

  const clearNotifications = () => {
    setNotifications([]);
  };

  const value: SocketContextType = {
    socket,
    isConnected,
    notifications,
    clearNotifications,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
}; 