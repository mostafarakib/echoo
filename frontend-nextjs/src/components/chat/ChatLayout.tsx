"use client";

import { ChatSidebar } from "./ChatSidebar";
import { ChatMain } from "./ChatMain";
import { useGlobalChatSocket } from "@/hooks/useGlobalChatSocket";

export function ChatLayout() {
  useGlobalChatSocket();

  return (
    <div className="flex flex-1 overflow-hidden">
      <ChatSidebar />
      <ChatMain />
    </div>
  );
}
