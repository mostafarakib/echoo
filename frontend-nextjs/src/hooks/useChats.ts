"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchChats, accessChat } from "@/lib/api/chats";
import { useChatUIStore } from "@/stores/chat-ui-store";

export const CHATS_QUERY_KEY = ["chats"];

export function useChats() {
  return useQuery({ queryKey: CHATS_QUERY_KEY, queryFn: fetchChats });
}

export function useAccessChat() {
  const queryClient = useQueryClient();
  const setSelectedChat = useChatUIStore((s) => s.setSelectedChat);

  return useMutation({
    mutationFn: accessChat,
    onSuccess: (chat) => {
      setSelectedChat(chat);
      queryClient.invalidateQueries({ queryKey: CHATS_QUERY_KEY });
    },
  });
}
