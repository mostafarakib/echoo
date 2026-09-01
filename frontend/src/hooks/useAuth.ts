"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  getMe,
  login,
  logout,
  signup,
  LoginPayload,
  SignupPayload,
} from "@/lib/api/auth";

export const AUTH_QUERY_KEY = ["user", "me"];

export function useAuth() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const currentUserQuery = useQuery({
    queryKey: AUTH_QUERY_KEY,
    queryFn: getMe,
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: (payload: LoginPayload) => login(payload),
    onSuccess: (user) => {
      queryClient.setQueryData(AUTH_QUERY_KEY, user);
      router.push("/chats");
    },
  });

  const signupMutation = useMutation({
    mutationFn: (payload: SignupPayload) => signup(payload),
    onSuccess: (user) => {
      queryClient.setQueryData(AUTH_QUERY_KEY, user);
      router.push("/chats");
    },
  });

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.setQueryData(AUTH_QUERY_KEY, null);
      queryClient.clear();
      router.push("/login");
    },
  });

  return {
    user: currentUserQuery.data,
    isLoading: currentUserQuery.isLoading,
    isAuthenticated: !!currentUserQuery.data,
    currentUserQuery,
    login: loginMutation,
    signup: signupMutation,
    logout: logoutMutation,
  };
}
