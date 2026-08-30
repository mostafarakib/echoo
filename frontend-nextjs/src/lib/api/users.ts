import { apiClient } from "./client";
import { User } from "@/types/user";

export const searchUsers = async (query: string): Promise<User[]> => {
  if (!query) return [];
  const { data } = await apiClient.get<User[]>(
    `/api/user?search=${encodeURIComponent(query)}`,
  );
  return data;
};
