import { apiClient } from "./client";
import { Notification } from "@/types/notification";

export const getNotifications = async (): Promise<Notification[]> => {
  const { data } = await apiClient.get("/api/notification");
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.unread)) return data.unread;
  return [];
};

export const markAsRead = async (payload: {
  chatId?: string;
  ids?: string[];
}): Promise<Notification[]> => {
  const { data } = await apiClient.post("/api/notification/mark-read", payload);
  return data?.unread ?? [];
};
