"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChatList } from "./ChatList";
import { CreateGroupDialog } from "@/components/dialogs/CreateGroupDialog";
import { useChatUIStore } from "@/stores/chat-ui-store";

export function ChatSidebar() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const selectedChat = useChatUIStore((s) => s.selectedChat);

  return (
    <aside
      className={cn(
        "w-full flex-col border-r bg-white md:flex md:w-96",
        selectedChat ? "hidden" : "flex",
      )}
    >
      <div className="flex items-center justify-between border-b p-3">
        <h2 className="text-lg font-semibold">Chats</h2>
        <button
          onClick={() => setDialogOpen(true)}
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "gap-1",
          )}
        >
          <Plus className="h-4 w-4" />
          New Group
        </button>
      </div>
      <ChatList />
      <CreateGroupDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </aside>
  );
}
