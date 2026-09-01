import { apiClient } from "./client";
import { Message } from "@/types/message";

export const fetchMessages = async (chatId: string): Promise<Message[]> => {
  const { data } = await apiClient.get<Message[]>(`/api/message/${chatId}`);
  return data;
};

export const sendMessageApi = async (payload: {
  content: string;
  chatId: string;
}): Promise<Message> => {
  const { data } = await apiClient.post<Message>("/api/message", payload);
  return data;
};
