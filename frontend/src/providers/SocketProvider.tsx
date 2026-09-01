"use client";

import {
  createContext,
  useContext,
  useEffect,
  useSyncExternalStore,
} from "react";
import type { Socket } from "socket.io-client";
import { useAuth } from "@/hooks/useAuth";
import {
  connectSocket,
  disconnectSocket,
  subscribeSocket,
  getSocketSnapshot,
} from "@/lib/socket/socket-manager";

const SocketContext = createContext<Socket | null>(null);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) return;
    connectSocket();
    return () => disconnectSocket();
  }, [isAuthenticated]);

  const socket = useSyncExternalStore(
    subscribeSocket,
    getSocketSnapshot,
    () => null,
  );

  return (
    <SocketContext.Provider value={isAuthenticated ? socket : null}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}
