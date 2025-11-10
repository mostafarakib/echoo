import { Server } from "socket.io";

let ioInstance = null;

export const initSocket = (server, opts = {}) => {
  if (ioInstance) return ioInstance;
  ioInstance = new Server(server, opts);
  return ioInstance;
};

export const getIO = () => {
  if (!ioInstance) {
    throw new Error("Socket.io not initialized!");
  }
  return ioInstance;
};
