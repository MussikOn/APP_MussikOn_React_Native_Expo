import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { API_CONFIG } from '@config/apiConfig';
import { ENV } from '@config/environment';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
  emit: (event: string, data: any) => void;
  on: (event: string, callback: (data: any) => void) => void;
  off: (event: string, callback?: (data: any) => void) => void;
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
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const connect = () => {
    if (socket?.connected) return;

    const newSocket = io(API_CONFIG.socket.url, {
      transports: ['websocket', 'polling'],
      timeout: 5000, // Timeout fijo
      reconnection: true,
      reconnectionAttempts: API_CONFIG.socket.reconnectAttempts,
      reconnectionDelay: API_CONFIG.socket.reconnectDelay,
      reconnectionDelayMax: API_CONFIG.socket.reconnectDelay * 2,
      autoConnect: false,
    });

    newSocket.on('connect', () => {
      console.log('🔌 Socket conectado');
      setIsConnected(true);
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    });

    newSocket.on('disconnect', (reason) => {
      console.log('🔌 Socket desconectado:', reason);
      setIsConnected(false);
      
      if (reason === 'io server disconnect') {
        // Reconexión manual si el servidor desconecta
        setTimeout(() => {
          newSocket.connect();
        }, API_CONFIG.socket.reconnectDelay);
      }
    });

    newSocket.on('connect_error', (error) => {
      console.error('🔌 Error de conexión del socket:', error);
      setIsConnected(false);
    });

    newSocket.on('reconnect', (attemptNumber) => {
      console.log(`🔌 Socket reconectado después de ${attemptNumber} intentos`);
      setIsConnected(true);
    });

    newSocket.on('reconnect_error', (error) => {
      console.error('🔌 Error de reconexión del socket:', error);
    });

    newSocket.on('reconnect_failed', () => {
      console.error('🔌 Falló la reconexión del socket');
      setIsConnected(false);
    });

    setSocket(newSocket);
    newSocket.connect();
  };

  const disconnect = () => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
      setIsConnected(false);
    }
  };

  const emit = (event: string, data: any) => {
    if (socket?.connected) {
      socket.emit(event, data);
    } else {
      console.warn('Socket no está conectado, no se puede emitir evento:', event);
    }
  };

  const on = (event: string, callback: (data: any) => void) => {
    if (socket) {
      socket.on(event, callback);
    }
  };

  const off = (event: string, callback?: (data: any) => void) => {
    if (socket) {
      if (callback) {
        socket.off(event, callback);
      } else {
        socket.off(event);
      }
    }
  };

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      disconnect();
    };
  }, []);

  const value: SocketContextType = {
    socket,
    isConnected,
    connect,
    disconnect,
    emit,
    on,
    off,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
}; 