"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserListItem } from "@/components/shared/UserListItem";
import { SelectedUserChip } from "@/components/shared/SelectedUserChip";
import { useSearchUsers } from "@/hooks/useUsers";
import {
  useRenameGroup,
  useAddToGroup,
  useRemoveFromGroup,
} from "@/hooks/useGroupActions";
import { useAuth } from "@/hooks/useAuth";
import { useChatUIStore } from "@/stores/chat-ui-store";
import { Chat } from "@/types/chat";

export function GroupSettingsDialog({
  chat,
  open,
  onOpenChange,
}: {
  chat: Chat;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { user } = useAuth();
  const [groupName, setGroupName] = useState("");
  const [query, setQuery] = useState("");
  const { data: results = [] } = useSearchUsers(query);
  const renameGroup = useRenameGroup();
  const addToGroup = useAddToGroup();
  const removeFromGroup = useRemoveFromGroup();
  const setSelectedChat = useChatUIStore((s) => s.setSelectedChat);

  if (!user) return null;
  const isAdmin = chat.groupAdmin?._id === user._id;

  const handleRemoveUser = (userId: string) => {
    if (!isAdmin && userId !== user._id) {
      toast.error("Only admin can remove members");
      return;
    }
    removeFromGroup.mutate(
      { chatId: chat._id, userId },
      {
        onSuccess: () => {
          if (userId === user._id) {
            setSelectedChat(null);
            onOpenChange(false);
          }
        },
        onError: () => toast.error("Failed to remove user"),
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{chat.chatName}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-1">
            {chat.users.map((u) => (
              <SelectedUserChip
                key={u._id}
                user={u}
                onRemove={() => handleRemoveUser(u._id)}
              />
            ))}
          </div>
          {isAdmin && (
            <>
              <div className="flex gap-2">
                <Input
                  placeholder="New group name"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                />
                <Button
                  onClick={() => {
                    if (!groupName) return;
                    renameGroup.mutate(
                      { chatId: chat._id, chatName: groupName },
                      {
                        onSuccess: () => setGroupName(""),
                        onError: () => toast.error("Failed to rename"),
                      },
                    );
                  }}
                  disabled={renameGroup.isPending}
                >
                  Update
                </Button>
              </div>
              <Input
                placeholder="Add users e.g. Farhan, Rakib, John"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <div className="flex max-h-40 flex-col overflow-y-auto">
                {results.slice(0, 4).map((searchedUser) => (
                  <UserListItem
                    key={searchedUser._id}
                    user={searchedUser}
                    onClick={() => {
                      if (chat.users.find((u) => u._id === searchedUser._id)) {
                        toast.warning("User already in group");
                        return;
                      }
                      addToGroup.mutate(
                        { chatId: chat._id, userId: searchedUser._id },
                        { onError: () => toast.error("Failed to add user") },
                      );
                    }}
                  />
                ))}
              </div>
            </>
          )}
        </div>
        <DialogFooter>
          <Button
            variant="destructive"
            onClick={() => handleRemoveUser(user._id)}
          >
            Leave Group
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
