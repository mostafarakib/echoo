import { isAxiosError } from "axios";

export interface ApiErrorPayload {
  message: string;
  stack?: string | null;
}

export function getApiErrorMessage(
  err: unknown,
  fallback = "Something went wrong",
): string {
  if (isAxiosError<ApiErrorPayload>(err)) {
    return err.response?.data?.message ?? fallback;
  }
  return fallback;
}
