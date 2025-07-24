import { io, Socket } from "socket.io-client";
import { SOCKET_URL } from "../config/environment";
import { useUser } from '@contexts/UserContext';

export const socket: Socket = io(SOCKET_URL, {
  transports: ["websocket"],
  autoConnect: false, 
  timeout: 5000,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

// Hook para registrar el usuario en el socket tras conectar
export const registerSocketUser = (userEmail: string) => {
  if (!userEmail) return;
  socket.on('connect', () => {
    console.log('Socket conectado:', socket.id, 'Registrando usuario:', userEmail);
    socket.emit('register', userEmail.toLowerCase());
  });
};

