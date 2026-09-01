"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sendMessageApi } from "@/lib/api/messages";
import { Message } from "@/types/message";
import { CHATS_QUERY_KEY } from "./useChats";

export function useSendMessage(chatId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sendMessageApi,
    onSuccess: (message) => {
      queryClient.setQueryData<Message[]>(["messages", chatId], (prev = []) =>
        prev.find((m) => m._id === message._id) ? prev : [...prev, message],
      );
      queryClient.invalidateQueries({ queryKey: CHATS_QUERY_KEY });
    },
  });
}
