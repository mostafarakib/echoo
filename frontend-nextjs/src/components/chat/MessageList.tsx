"use client";

import { useEffect, useRef } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Message } from "@/types/message";
import { User } from "@/types/user";
import { MessageGroup } from "./MessageGroup";

function groupMessages(messages: Message[]) {
  const groups: Message[][] = [];
  for (const message of messages) {
    const last = groups[groups.length - 1];
    if (last && last[0].sender._id === message.sender._id) last.push(message);
    else groups.push([message]);
  }
  return groups;
}

export function MessageList({
  messages,
  currentUser,
  isLoading,
}: {
  messages: Message[];
  currentUser: User;
  isLoading: boolean;
}) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col justify-end gap-3 p-4">
        <Skeleton className="h-10 w-1/2" />
        <Skeleton className="ml-auto h-10 w-1/3" />
        <Skeleton className="h-10 w-2/5" />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
      {groupMessages(messages).map((group) => (
        <MessageGroup
          key={group[0]._id}
          messages={group}
          isOwn={group[0].sender._id === currentUser._id}
        />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
