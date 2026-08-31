"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createGroupChat } from "@/lib/api/chats";
import { CHATS_QUERY_KEY } from "./useChats";

export function useCreateGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createGroupChat,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: CHATS_QUERY_KEY }),
  });
}
