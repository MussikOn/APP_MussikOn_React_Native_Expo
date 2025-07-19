import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { SOCKET_URL } from "../src/config/environment";

export interface SocketNotification {
  title: string;
  message: string;
  type: 'new_event_request' | 'musician_accepted' | 'general';
  eventId?: string;
  timestamp: string;
}

export const useSocket = (userId: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [notifications, setNotifications] = useState<SocketNotification[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const newSocket = io(SOCKET_URL, { 
      transports: ["websocket"],
      timeout: 5000,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    newSocket.on("connect", () => {
      console.log("🔌 Conectado al servidor Socket.IO:", newSocket.id);
      setIsConnected(true);
      newSocket.emit("register", userId);
    });

    newSocket.on("disconnect", () => {
      console.log("🔌 Desconectado del servidor Socket.IO");
      setIsConnected(false);
    });

    newSocket.on("connect_error", (error) => {
      console.error("❌ Error de conexión Socket.IO:", error);
      setIsConnected(false);
    });

    // Eventos específicos de MusikOn
    newSocket.on("new_event_request", (data) => {
      console.log("🎵 Nueva solicitud de evento recibida:", data);
      const notification: SocketNotification = {
        title: "Nueva Solicitud de Evento",
        message: `Hay una nueva solicitud de ${data.instrument} para ${data.eventType}`,
        type: 'new_event_request',
        eventId: data.eventId,
        timestamp: new Date().toISOString(),
      };
      setNotifications((prev) => [...prev, notification]);
    });

    newSocket.on("musician_accepted", (data) => {
      console.log("✅ Músico aceptó solicitud:", data);
      const notification: SocketNotification = {
        title: "Músico Aceptó tu Solicitud",
        message: `Un músico ha aceptado tu solicitud para ${data.eventName}`,
        type: 'musician_accepted',
        eventId: data.eventId,
        timestamp: new Date().toISOString(),
      };
      setNotifications((prev) => [...prev, notification]);
    });

    newSocket.on("notification", (data) => {
      console.log("📢 Notificación general recibida:", data);
      const notification: SocketNotification = {
        title: data.title || "Notificación",
        message: data.message || "Tienes una nueva notificación",
        type: 'general',
        timestamp: new Date().toISOString(),
      };
      setNotifications((prev) => [...prev, notification]);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [userId]);

  const sendNotification = (targetUserId: string, title: string, message: string) => {
    if (socket && isConnected) {
      socket.emit("sendNotification", { userId: targetUserId, title, message });
      console.log(`📤 Notificación enviada a ${targetUserId}: ${title}`);
    } else {
      console.warn("⚠️ Socket no conectado, no se puede enviar notificación");
    }
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return { 
    socket, 
    notifications, 
    isConnected,
    sendNotification, 
    clearNotifications 
  };
};
