"use client";

import { useState } from "react";
import { ArrowLeft, Info } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Chat } from "@/types/chat";
import { User } from "@/types/user";
import { getSender, getFullSender } from "@/lib/utils/chat-logic";
import { useChatUIStore } from "@/stores/chat-ui-store";
import { ProfileDialog } from "@/components/dialogs/ProfileDialog";
import { GroupSettingsDialog } from "@/components/dialogs/GroupSettingsDialog";

export function ChatHeader({
  chat,
  currentUser,
}: {
  chat: Chat;
  currentUser: User;
}) {
  const setSelectedChat = useChatUIStore((s) => s.setSelectedChat);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const name = chat.isGroupChat
    ? chat.chatName
    : getSender(currentUser, chat.users);
  const otherUser = chat.isGroupChat
    ? null
    : getFullSender(currentUser, chat.users);

  return (
    <>
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
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setDetailsOpen(true)}
        >
          <Info className="h-5 w-5" />
        </Button>
      </div>
      {chat.isGroupChat ? (
        <GroupSettingsDialog
          chat={chat}
          open={detailsOpen}
          onOpenChange={setDetailsOpen}
        />
      ) : (
        otherUser && (
          <ProfileDialog
            user={otherUser}
            open={detailsOpen}
            onOpenChange={setDetailsOpen}
          />
        )
      )}
    </>
  );
}
