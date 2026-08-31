"use client";
import { useEffect } from "react";
import { useSocket } from "@/providers/SocketProvider";
import { useAuth } from "./useAuth";

export function useChatRoomSocket(
  chatId: string,
  onTyping: (isTyping: boolean) => void,
) {
  const socket = useSocket();
  const { user } = useAuth();

  useEffect(() => {
    if (!socket) return;

    const handleTyping = (data: { room: string; senderId: string }) => {
      if (data.room === chatId && data.senderId !== user?._id) onTyping(true);
    };
    const handleStopTyping = (data: { room: string; senderId: string }) => {
      if (data.room === chatId && data.senderId !== user?._id) onTyping(false);
    };

    socket.on("typing", handleTyping);
    socket.on("stop typing", handleStopTyping);
    socket.emit("join chat", chatId);
    socket.emit("open chat", chatId);

    return () => {
      socket.off("typing", handleTyping);
      socket.off("stop typing", handleStopTyping);
      socket.emit("close chat");
    };
  }, [socket, chatId, user?._id, onTyping]);
}
