"use client";

import { Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { useNotifications, useMarkAsRead } from "@/hooks/useNotifications";
import { useAccessChat } from "@/hooks/useChats";
import { Notification } from "@/types/notification";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function NotificationDropdown() {
  const { data: notifications = [] } = useNotifications();
  const markAsRead = useMarkAsRead();
  const accessChat = useAccessChat();

  const handleOpenNotification = (notification: Notification) => {
    markAsRead.mutate({ chatId: notification.chat._id });
    if (!notification.chat.isGroupChat) {
      accessChat.mutate(notification.sender._id);
    }
    // Group chats: once ChatList exists, wire this to setSelectedChat(notification.chat) directly
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          buttonVariants({ variant: "ghost", size: "icon" }),
          "relative",
        )}
      >
        <Bell
          className={cn(
            "h-5 w-5",
            notifications.length > 0 && "animate-wiggle",
          )}
        />
        {notifications.length > 0 && (
          <Badge className="absolute -right-1 -top-1 h-5 w-5 justify-center rounded-full p-0 text-xs">
            {notifications.length}
          </Badge>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        {notifications.length === 0 && (
          <p className="p-3 text-center text-sm text-muted-foreground">
            No new notifications
          </p>
        )}
        {notifications.map((notification) => (
          <button
            key={notification._id}
            onClick={() => handleOpenNotification(notification)}
            className="flex w-full flex-col items-start gap-0.5 rounded-sm p-2 text-left text-sm hover:bg-accent"
          >
            <span className="font-medium">
              {notification.chat.isGroupChat
                ? notification.chat.chatName
                : notification.sender.name}
            </span>
            <span className="truncate text-xs text-muted-foreground">
              {notification.message.content}
            </span>
          </button>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
