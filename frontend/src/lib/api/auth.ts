import { isAxiosError } from "axios";
import { apiClient } from "./client";
import { User } from "@/types/user";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload {
  name: string;
  email: string;
  password: string;
  pic?: string;
}

export const login = async (payload: LoginPayload): Promise<User> => {
  const { data } = await apiClient.post("/api/user/login", payload);
  return data;
};

export const signup = async (payload: SignupPayload): Promise<User> => {
  const { data } = await apiClient.post("/api/user", payload);
  return data;
};

export const logout = async (): Promise<void> => {
  await apiClient.post("/api/user/logout");
};

export const getMe = async (): Promise<User | null> => {
  try {
    const { data } = await apiClient.get<User>("/api/user/me");
    return data;
  } catch (err) {
    if (isAxiosError(err) && err.response?.status === 401) {
      return null; // not logged in — a normal, valid state, not an error
    }
    throw err; // real failures (backend down, 500, etc.)
  }
};
