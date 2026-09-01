import { apiClient } from "./client";
import { Chat } from "@/types/chat";

export const fetchChats = async (): Promise<Chat[]> => {
  const { data } = await apiClient.get<Chat[]>("/api/chat");
  return data;
};

export const accessChat = async (userId: string): Promise<Chat> => {
  const { data } = await apiClient.post<Chat>("/api/chat", { userId });
  return data;
};

export const createGroupChat = async (payload: {
  name: string;
  users: string[];
}): Promise<Chat> => {
  const { data } = await apiClient.post<Chat>("/api/chat/group", {
    name: payload.name,
    users: JSON.stringify(payload.users),
  });
  return data;
};

export const renameGroup = async (payload: {
  chatId: string;
  chatName: string;
}): Promise<Chat> => {
  const { data } = await apiClient.put<Chat>("/api/chat/rename", payload);
  return data;
};

export const addToGroup = async (payload: {
  chatId: string;
  userId: string;
}): Promise<Chat> => {
  const { data } = await apiClient.put<Chat>("/api/chat/groupadd", payload);
  return data;
};

export const removeFromGroup = async (payload: {
  chatId: string;
  userId: string;
}): Promise<Chat> => {
  const { data } = await apiClient.put<Chat>("/api/chat/groupremove", payload);
  return data;
};
