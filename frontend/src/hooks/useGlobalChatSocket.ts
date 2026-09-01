"use client";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSocket } from "@/providers/SocketProvider";
import { Message } from "@/types/message";
import { CHATS_QUERY_KEY } from "./useChats";
import { NOTIFICATIONS_QUERY_KEY } from "./useNotifications";

export function useGlobalChatSocket() {
  const socket = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) return;

    const handleMessageReceived = (message: Message) => {
      queryClient.setQueryData<Message[]>(
        ["messages", message.chat._id],
        (prev) =>
          prev
            ? prev.find((m) => m._id === message._id)
              ? prev
              : [...prev, message]
            : prev,
      );
      queryClient.invalidateQueries({ queryKey: CHATS_QUERY_KEY });
    };

    const handleNotification = () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
    };

    socket.on("message received", handleMessageReceived);
    socket.on("notification", handleNotification);

    return () => {
      socket.off("message received", handleMessageReceived);
      socket.off("notification", handleNotification);
    };
  }, [socket, queryClient]);
}
