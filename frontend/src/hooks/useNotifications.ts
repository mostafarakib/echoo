"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getNotifications, markAsRead } from "@/lib/api/notifications";

export const NOTIFICATIONS_QUERY_KEY = ["notifications"];

export function useNotifications() {
  return useQuery({
    queryKey: NOTIFICATIONS_QUERY_KEY,
    queryFn: getNotifications,
  });
}

export function useMarkAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAsRead,
    onSuccess: (unread) => {
      queryClient.setQueryData(NOTIFICATIONS_QUERY_KEY, unread);
    },
  });
}
