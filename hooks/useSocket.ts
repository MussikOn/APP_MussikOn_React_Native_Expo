import { useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { SOCKET_URL } from "../src/config/environment";
import { useAppDispatch } from '../src/store/store';
import { addNotification } from '../src/store/slices/notificationsSlice';
import { v4 as uuidv4 } from 'uuid';

export interface SocketNotification {
  title: string;
  message: string;
  type: 'new_event_request' | 'musician_accepted' | 'general';
  eventId?: string;
  timestamp: string;
}

export const useSocket = (userId: string) => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    const newSocket: Socket = io(SOCKET_URL, {
      transports: ["websocket"],
      timeout: 5000,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    newSocket.on("connect", () => {
      console.log("🔌 Conectado al servidor Socket.IO:", newSocket.id);
      newSocket.emit("register", userId);
    });

    newSocket.on("disconnect", () => {
      console.log("🔌 Desconectado del servidor Socket.IO");
    });

    newSocket.on("connect_error", (error) => {
      console.error("❌ Error de conexión Socket.IO:", error);
    });

    // Eventos específicos de MusikOn
    newSocket.on("new_event_request", (data) => {
      console.log("🎵 Nueva solicitud de evento recibida:", data);
      dispatch(addNotification({
        id: uuidv4(),
        message: 'notifications.new_event_request',
        type: 'info',
      }));
    });

    newSocket.on("musician_accepted", (data) => {
      console.log("✅ Músico aceptó solicitud:", data);
      dispatch(addNotification({
        id: uuidv4(),
        message: 'notifications.musician_accepted',
        type: 'success',
      }));
    });

    newSocket.on("notification", (data) => {
      console.log("📢 Notificación general recibida:", data);
      dispatch(addNotification({
        id: uuidv4(),
        message: data.message || 'notifications.general',
        type: 'info',
      }));
    });

    return () => {
      newSocket.disconnect();
    };
  }, [userId, dispatch]);

  // No retorna notificaciones locales, solo integra con Redux
  return null;
};
