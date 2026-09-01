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
import { useCreateGroup } from "@/hooks/useCreateGroup";
import { User } from "@/types/user";

export function CreateGroupDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [groupName, setGroupName] = useState("");
  const [query, setQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const { data: results = [] } = useSearchUsers(query);
  const createGroup = useCreateGroup();

  const reset = () => {
    setGroupName("");
    setQuery("");
    setSelectedUsers([]);
  };

  const handleAddUser = (user: User) => {
    if (selectedUsers.find((u) => u._id === user._id)) {
      toast.warning("User already added");
      return;
    }
    setSelectedUsers((prev) => [...prev, user]);
  };

  const handleSubmit = () => {
    if (!groupName || selectedUsers.length < 2) {
      toast.warning("Enter a group name and add at least 2 users");
      return;
    }
    createGroup.mutate(
      { name: groupName, users: selectedUsers.map((u) => u._id) },
      {
        onSuccess: () => {
          toast.success("Group created!");
          reset();
          onOpenChange(false);
        },
        onError: () => toast.error("Failed to create group"),
      },
    );
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
        if (!next) reset();
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create a Group</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          <Input
            placeholder="Group name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
          <Input
            placeholder="Add users e.g. Farhan, Rakib, John"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {selectedUsers.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {selectedUsers.map((user) => (
                <SelectedUserChip
                  key={user._id}
                  user={user}
                  onRemove={() =>
                    setSelectedUsers((prev) =>
                      prev.filter((u) => u._id !== user._id),
                    )
                  }
                />
              ))}
            </div>
          )}
          <div className="flex max-h-48 flex-col overflow-y-auto">
            {results.slice(0, 4).map((user) => (
              <UserListItem
                key={user._id}
                user={user}
                onClick={() => handleAddUser(user)}
              />
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={createGroup.isPending}>
            Create Group
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
