import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";


 const SOCKET_URL = "http://172.21.50.241:3001"; 

export const useSocket = (userId: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [notifications, setNotifications] = useState<{ title: string; message: string }[]>([]);

  useEffect(() => {

    const newSocket = io(SOCKET_URL, { transports: ["websocket"] });

    newSocket.on("connect", () => {
      console.log("Conectado al servidor Socket.IO:", newSocket.id);
      

      newSocket.emit("register", userId);
    });


    newSocket.on("notification", (data) => {
      console.log("Notificación recibida:", data);
      setNotifications((prev) => [...prev, data]); 
    });


    setSocket(newSocket);

    return () => {
      newSocket.disconnect(); 
    };
  }, [userId]);


  const sendNotification = (targetUserId: string, title: string, message: string) => {
    if (socket) {
      socket.emit("sendNotification", { userId: targetUserId, title, message });
      console.log(`Notificación enviada a ${targetUserId}: ${title}`);
    }
  };

  return { socket, notifications, sendNotification };
};
