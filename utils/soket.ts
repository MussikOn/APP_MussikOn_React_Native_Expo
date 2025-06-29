import { io, Socket } from "socket.io-client";
import { URL_API } from "./ENV";

const SOCKET_URL = `${URL_API}`; 

export const socket:Socket = io(SOCKET_URL, {
  transports: ["websocket"],
  autoConnect: false, 
});

