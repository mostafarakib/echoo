"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Navbar } from "@/components/layout/Navbar";

export default function ChatsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading, isAuthenticated, logout, currentUserQuery } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      if (currentUserQuery.isError) {
        logout.mutate(undefined, {
          onSettled: () => router.replace("/login"),
        });
      } else {
        router.replace("/login");
      }
    }
  }, [isLoading, isAuthenticated, logout, currentUserQuery.isError, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Skeleton className="h-12 w-48" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="flex h-screen flex-col">
      <Navbar />
      {children}
    </div>
  );
}
