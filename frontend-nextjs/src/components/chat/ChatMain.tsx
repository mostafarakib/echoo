"use client";

import { useCallback, useEffect, useState } from "react";
import { useChatUIStore } from "@/stores/chat-ui-store";
import { useAuth } from "@/hooks/useAuth";
import { useMessages } from "@/hooks/useMessages";
import { useChatRoomSocket } from "@/hooks/useChatRoomSocket";
import { useMarkAsRead } from "@/hooks/useNotifications";
import { EmptyChatState } from "./EmptyChatState";
import { ChatHeader } from "./ChatHeader";
import { MessageList } from "./MessageList";
import { MessageComposer } from "./MessageComposer";
import { TypingIndicator } from "./TypingIndicator";
import { Chat } from "@/types/chat";
import { User } from "@/types/user";

export function ChatMain() {
  const { user } = useAuth();
  const selectedChat = useChatUIStore((s) => s.selectedChat);

  if (!selectedChat || !user) {
    return (
      <main className="hidden flex-1 md:flex">
        <EmptyChatState />
      </main>
    );
  }

  // key resets isTyping and any other local state whenever the chat changes
  return (
    <ChatConversation key={selectedChat._id} chat={selectedChat} user={user} />
  );
}

function ChatConversation({ chat, user }: { chat: Chat; user: User }) {
  const [isTyping, setIsTyping] = useState(false);
  const markAsRead = useMarkAsRead();
  const { data: messages = [], isLoading } = useMessages(chat._id);

  const handleTyping = useCallback(
    (typing: boolean) => setIsTyping(typing),
    [],
  );
  useChatRoomSocket(chat._id, handleTyping);

  useEffect(() => {
    markAsRead.mutate({ chatId: chat._id });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chat._id]);

  return (
    <main className="flex flex-1 flex-col">
      <ChatHeader chat={chat} currentUser={user} />
      <MessageList
        messages={messages}
        currentUser={user}
        isLoading={isLoading}
      />
      {isTyping && <TypingIndicator />}
      <MessageComposer chatId={chat._id} />
    </main>
  );
}
