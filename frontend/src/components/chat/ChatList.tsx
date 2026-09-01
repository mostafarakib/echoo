"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { ChatListItem } from "./ChatListItem";
import { useChats } from "@/hooks/useChats";
import { useChatUIStore } from "@/stores/chat-ui-store";
import { useAuth } from "@/hooks/useAuth";

export function ChatList() {
  const { user } = useAuth();
  const { data: chats, isLoading } = useChats();
  const { selectedChat, setSelectedChat } = useChatUIStore();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3 p-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex flex-1 flex-col gap-1">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!user) return null;
  if (!chats?.length)
    return (
      <p className="p-4 text-center text-sm text-muted-foreground">
        No conversations yet
      </p>
    );

  return (
    <div className="flex flex-col gap-1 overflow-y-auto p-2">
      {chats.map((chat) => (
        <ChatListItem
          key={chat._id}
          chat={chat}
          currentUser={user}
          isSelected={selectedChat?._id === chat._id}
          onClick={() => setSelectedChat(chat)}
        />
      ))}
    </div>
  );
}
