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
    <div
      className="flex flex-1 flex-col gap-3 overflow-y-auto p-4"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='380' height='380'%3E%3Cdefs%3E%3Cpath id='b' d='M0 0 h12 a3 3 0 0 1 3 3 v7 a3 3 0 0 1 -3 3 h-6 l-3 3 v-3 h-1 a3 3 0 0 1 -3 -3 v-7 a3 3 0 0 1 3 -3 z'/%3E%3C/defs%3E%3Cg fill='none' stroke='%239CA3AF' stroke-width='1.4' opacity='0.4'%3E%3Cuse href='%23b' transform='translate(40 50) rotate(-10)'/%3E%3Cuse href='%23b' transform='translate(230 30) rotate(8)'/%3E%3Cuse href='%23b' transform='translate(120 150) rotate(-6)'/%3E%3Cuse href='%23b' transform='translate(20 250) rotate(14)'/%3E%3Cuse href='%23b' transform='translate(260 220) rotate(-12)'/%3E%3C/g%3E%3C/svg%3E\")",
        backgroundRepeat: "repeat",
        backgroundSize: "380px 380px",
      }}
    >
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
