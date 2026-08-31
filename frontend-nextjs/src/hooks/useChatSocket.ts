"use client";
import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSocket } from "@/providers/SocketProvider";
import { useAuth } from "./useAuth";
import { Message } from "@/types/message";
import { CHATS_QUERY_KEY } from "./useChats";
import { NOTIFICATIONS_QUERY_KEY } from "./useNotifications";

interface UseChatSocketOptions {
  chatId?: string;
  onTyping: (isTyping: boolean) => void;
}

export function useChatSocket({ chatId, onTyping }: UseChatSocketOptions) {
  const socket = useSocket();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const chatIdRef = useRef(chatId);
  chatIdRef.current = chatId;

  useEffect(() => {
    if (!socket) return;

    const handleMessageReceived = (message: Message) => {
      if (chatIdRef.current && message.chat._id === chatIdRef.current) {
        queryClient.setQueryData<Message[]>(
          ["messages", chatIdRef.current],
          (prev = []) =>
            prev.find((m) => m._id === message._id) ? prev : [...prev, message],
        );
      }
      queryClient.invalidateQueries({ queryKey: CHATS_QUERY_KEY });
    };

    const handleTyping = (data: { room: string; senderId: string }) => {
      if (data.room === chatIdRef.current && data.senderId !== user?._id)
        onTyping(true);
    };

    const handleStopTyping = (data: { room: string; senderId: string }) => {
      if (data.room === chatIdRef.current && data.senderId !== user?._id)
        onTyping(false);
    };

    const handleNotification = () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
    };

    socket.on("message received", handleMessageReceived);
    socket.on("typing", handleTyping);
    socket.on("stop typing", handleStopTyping);
    socket.on("notification", handleNotification);

    return () => {
      socket.off("message received", handleMessageReceived);
      socket.off("typing", handleTyping);
      socket.off("stop typing", handleStopTyping);
      socket.off("notification", handleNotification);
    };
  }, [socket, queryClient, user?._id, onTyping]);

  useEffect(() => {
    if (!socket || !chatId) return;
    socket.emit("join chat", chatId);
    socket.emit("open chat", chatId);
    return () => {
      socket.emit("close chat");
    };
  }, [socket, chatId]);
}
