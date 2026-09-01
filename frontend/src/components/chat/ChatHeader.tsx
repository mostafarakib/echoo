"use client";

import { ArrowLeft, Info } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Chat } from "@/types/chat";
import { User } from "@/types/user";
import { getSender, getFullSender } from "@/lib/utils/chat-logic";
import { useChatUIStore } from "@/stores/chat-ui-store";

export function ChatHeader({
  chat,
  currentUser,
  onOpenDetails,
}: {
  chat: Chat;
  currentUser: User;
  onOpenDetails: () => void;
}) {
  const setSelectedChat = useChatUIStore((s) => s.setSelectedChat);
  const name = chat.isGroupChat
    ? chat.chatName
    : getSender(currentUser, chat.users);
  const otherUser = chat.isGroupChat
    ? null
    : getFullSender(currentUser, chat.users);

  return (
    <div className="flex items-center justify-between border-b bg-background p-3">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setSelectedChat(null)}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <Avatar className="h-9 w-9">
          {otherUser && <AvatarImage src={otherUser.pic} alt={name} />}
          <AvatarFallback>{name.charAt(0)}</AvatarFallback>
        </Avatar>
        <span className="font-semibold">{name}</span>
      </div>
      <Button variant="ghost" size="icon" onClick={onOpenDetails}>
        <Info className="h-5 w-5" />
      </Button>
    </div>
  );
}
