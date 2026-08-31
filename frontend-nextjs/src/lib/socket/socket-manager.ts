import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;
let listeners: (() => void)[] = [];

function notify() {
  listeners.forEach((l) => l());
}

export function subscribeSocket(listener: () => void) {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

export function getSocketSnapshot(): Socket | null {
  return socket;
}

export function connectSocket(): Socket {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_API_URL!, {
      withCredentials: true,
      autoConnect: false,
    });
    socket.on("connect", notify);
    socket.on("disconnect", notify);
  }
  if (!socket.connected) socket.connect();
  return socket;
}

export function disconnectSocket() {
  socket?.disconnect();
  socket = null;
  notify();
}
