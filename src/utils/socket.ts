import { io, Socket } from "socket.io-client";
import { SOCKET_URL } from "../config/environment";

export const socket: Socket = io(SOCKET_URL, {
  transports: ["websocket"],
  autoConnect: false,
  timeout: 5000,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

