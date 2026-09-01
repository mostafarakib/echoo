"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { renameGroup, addToGroup, removeFromGroup } from "@/lib/api/chats";
import { useChatUIStore } from "@/stores/chat-ui-store";
import { CHATS_QUERY_KEY } from "./useChats";

export function useRenameGroup() {
  const queryClient = useQueryClient();
  const setSelectedChat = useChatUIStore((s) => s.setSelectedChat);
  return useMutation({
    mutationFn: renameGroup,
    onSuccess: (chat) => {
      setSelectedChat(chat);
      queryClient.invalidateQueries({ queryKey: CHATS_QUERY_KEY });
    },
  });
}

export function useAddToGroup() {
  const queryClient = useQueryClient();
  const setSelectedChat = useChatUIStore((s) => s.setSelectedChat);
  return useMutation({
    mutationFn: addToGroup,
    onSuccess: (chat) => {
      setSelectedChat(chat);
      queryClient.invalidateQueries({ queryKey: CHATS_QUERY_KEY });
    },
  });
}

export function useRemoveFromGroup() {
  const queryClient = useQueryClient();
  const setSelectedChat = useChatUIStore((s) => s.setSelectedChat);
  return useMutation({
    mutationFn: removeFromGroup,
    onSuccess: (chat) => {
      setSelectedChat(chat);
      queryClient.invalidateQueries({ queryKey: CHATS_QUERY_KEY });
    },
  });
}
