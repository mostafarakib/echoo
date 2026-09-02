"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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

  const currentUserQuery = useQuery({
    queryKey: AUTH_QUERY_KEY,
    queryFn: getMe,
    retry: false,
    staleTime: Infinity,
    refetchOnMount: false,
  });

  const loginMutation = useMutation({
    mutationFn: (payload: LoginPayload) => login(payload),
    onSuccess: (user) => {
      queryClient.setQueryData(AUTH_QUERY_KEY, user);
    },
  });

  const signupMutation = useMutation({
    mutationFn: (payload: SignupPayload) => signup(payload),
    onSuccess: (user) => {
      queryClient.setQueryData(AUTH_QUERY_KEY, user);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.setQueryData(AUTH_QUERY_KEY, null);
      // clear everyone else's cached data (chats, messages, notifications)
      // but leave the auth key alone — we just set it correctly above
      queryClient.removeQueries({
        predicate: (query) => query.queryKey[0] !== "user",
      });
    },
  });

  return {
    user: currentUserQuery.data ?? null,
    isLoading: currentUserQuery.isLoading,
    isAuthenticated: !!currentUserQuery.data,
    currentUserQuery,
    login: loginMutation,
    signup: signupMutation,
    logout: logoutMutation,
  };
}
