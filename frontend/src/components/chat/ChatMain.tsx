"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useChatUIStore } from "@/stores/chat-ui-store";
import { useAuth } from "@/hooks/useAuth";
import { useMessages } from "@/hooks/useMessages";
import { useChatRoomSocket } from "@/hooks/useChatRoomSocket";
import { useMarkAsRead } from "@/hooks/useNotifications";
import { EmptyChatState } from "./EmptyChatState";
import { ChatHeader } from "./ChatHeader";
import { ChatDetailsPanel } from "./ChatDetailsPanel";
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

  return (
    <ChatConversation key={selectedChat._id} chat={selectedChat} user={user} />
  );
}

function ChatConversation({ chat, user }: { chat: Chat; user: User }) {
  const [isTyping, setIsTyping] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
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
    <main className="relative flex flex-1 flex-col overflow-hidden">
      <AnimatePresence initial={false}>
        {detailsOpen ? (
          <motion.div
            key="details"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="absolute inset-0 flex flex-col bg-background"
          >
            <ChatDetailsPanel
              chat={chat}
              currentUser={user}
              onBack={() => setDetailsOpen(false)}
            />
          </motion.div>
        ) : (
          <motion.div
            key="conversation"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="absolute inset-0 flex flex-col"
          >
            <ChatHeader
              chat={chat}
              currentUser={user}
              onOpenDetails={() => setDetailsOpen(true)}
            />
            <MessageList
              messages={messages}
              currentUser={user}
              isLoading={isLoading}
            />
            {isTyping && <TypingIndicator />}
            <MessageComposer chatId={chat._id} />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
