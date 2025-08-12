import { notificationService } from '@services/notificationService';

export const createTestNotifications = async (userEmail: string) => {
  try {
    // Crear notificaciones de prueba
    const testNotifications = [
      {
        type: 'request_cancelled' as const,
        data: {
          eventId: 'test_event_1',
          event: {
            eventName: 'Fiesta de Cumpleaños',
            eventType: 'private',
            date: '2024-01-15',
            time: '20:00',
            location: {
              address: 'Calle Principal 123',
              city: 'Ciudad',
              latitude: 0,
              longitude: 0,
            },
            budget: 50000,
            instrument: 'Guitarra',
            duration: 3,
            comments: 'Evento de prueba',
          },
        },
      },
      {
        type: 'musician_accepted' as const,
        data: {
          requestId: 'test_request_1',
          event: {
            eventName: 'Boda de María y Juan',
            eventType: 'wedding',
            date: '2024-01-20',
            time: '18:00',
            location: {
              address: 'Salón de Eventos ABC',
              city: 'Ciudad',
              latitude: 0,
              longitude: 0,
            },
            budget: 80000,
            instrument: 'Piano',
            duration: 4,
            comments: 'Música romántica para la ceremonia',
          },
          musician: {
            name: 'Carlos Músico',
            email: 'carlos@example.com',
          },
        },
      },
      {
        type: 'request_deleted' as const,
        data: {
          eventId: 'test_event_2',
          event: {
            eventName: 'Evento Corporativo',
            eventType: 'corporate',
            date: '2024-01-25',
            time: '19:00',
            location: {
              address: 'Centro de Convenciones',
              city: 'Ciudad',
              latitude: 0,
              longitude: 0,
            },
            budget: 120000,
            instrument: 'Banda Completa',
            duration: 5,
            comments: 'Evento cancelado por la empresa',
          },
        },
      },
    ];

    // Crear y guardar cada notificación
    for (const notification of testNotifications) {
      const newNotification = notificationService.createNotificationFromServer(
        notification.data,
        userEmail,
        notification.type
      );
      
      await notificationService.saveNotification(newNotification);
      console.log('📱 Notificación de prueba creada:', newNotification.title);
    }

    console.log('✅ Notificaciones de prueba creadas exitosamente');
  } catch (error) {
    console.error('❌ Error al crear notificaciones de prueba:', error);
  }
}; 