"use client";

import { useRef, useState } from "react";
import { Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useSendMessage } from "@/hooks/useSendMessages";
import { useSocket } from "@/providers/SocketProvider";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "motion/react";

const TYPING_TIMER_LENGTH = 3000;

export function MessageComposer({ chatId }: { chatId: string }) {
  const [content, setContent] = useState("");
  const sendMessage = useSendMessage(chatId);
  const socket = useSocket();
  const { user } = useAuth();

  const isTypingRef = useRef(false);
  const lastTypingTimeRef = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContent(e.target.value);
    if (!socket || !user) return;

    if (!isTypingRef.current) {
      isTypingRef.current = true;
      socket.emit("typing", chatId, user._id);
    }
    lastTypingTimeRef.current = Date.now();

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      if (
        Date.now() - lastTypingTimeRef.current >= TYPING_TIMER_LENGTH &&
        isTypingRef.current
      ) {
        socket.emit("stop typing", chatId, user._id);
        isTypingRef.current = false;
      }
    }, TYPING_TIMER_LENGTH);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !user) return;

    if (socket && isTypingRef.current) {
      socket.emit("stop typing", chatId, user._id);
      isTypingRef.current = false;
    }

    const messageContent = content;
    setContent("");

    sendMessage.mutate(
      { content: messageContent, chatId },
      {
        onSuccess: (message) => socket?.emit("new message", message),
      },
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 border-t bg-background p-3"
    >
      <Input
        placeholder="Type a message..."
        value={content}
        onChange={handleChange}
        autoComplete="off"
      />
      <motion.button
        type="submit"
        whileTap={{ scale: 0.85, rotate: -15 }}
        disabled={sendMessage.isPending || !content.trim()}
        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground disabled:opacity-50"
      >
        <Send className="h-4 w-4" />
      </motion.button>
    </form>
  );
}
