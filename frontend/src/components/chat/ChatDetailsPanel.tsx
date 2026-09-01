"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, Crown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { UserListItem } from "@/components/shared/UserListItem";
import { useSearchUsers } from "@/hooks/useUsers";
import {
  useRenameGroup,
  useAddToGroup,
  useRemoveFromGroup,
} from "@/hooks/useGroupActions";
import { getFullSender } from "@/lib/utils/chat-logic";
import { Chat } from "@/types/chat";
import { User } from "@/types/user";

export function ChatDetailsPanel({
  chat,
  currentUser,
  onBack,
}: {
  chat: Chat;
  currentUser: User;
  onBack: () => void;
}) {
  const isAdmin = chat.groupAdmin?._id === currentUser._id;
  const [groupName, setGroupName] = useState(chat.chatName);
  const [query, setQuery] = useState("");
  const [memberToRemove, setMemberToRemove] = useState<User | null>(null);
  const { data: results = [] } = useSearchUsers(query);
  const renameGroup = useRenameGroup();
  const addToGroup = useAddToGroup();
  const removeFromGroup = useRemoveFromGroup();

  const otherUser = !chat.isGroupChat
    ? getFullSender(currentUser, chat.users)
    : null;

  const confirmRemove = () => {
    if (!memberToRemove) return;
    const isSelf = memberToRemove._id === currentUser._id;

    removeFromGroup.mutate(
      { chatId: chat._id, userId: memberToRemove._id },
      {
        onSuccess: () => {
          toast.success(
            isSelf
              ? "You left the group"
              : `${memberToRemove.name} removed from the group`,
          );
          setMemberToRemove(null);
          if (isSelf) onBack();
        },
        onError: () => {
          toast.error("Failed to remove member");
          setMemberToRemove(null);
        },
      },
    );
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex items-center gap-3 border-b bg-background p-3">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <span className="font-semibold">
          {chat.isGroupChat ? "Group Info" : "Contact Info"}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-4">
        {!chat.isGroupChat && otherUser ? (
          <div className="flex flex-col items-center gap-2 py-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={otherUser.pic} alt={otherUser.name} />
              <AvatarFallback className="text-2xl">
                {otherUser.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <span className="text-lg font-semibold">{otherUser.name}</span>
            <span className="text-sm text-muted-foreground">
              {otherUser.email}
            </span>
          </div>
        ) : (
          <>
            {isAdmin && (
              <div className="flex flex-col gap-2">
                <h3 className="text-sm font-semibold text-muted-foreground">
                  Group Name
                </h3>
                <div className="flex gap-2">
                  <Input
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                  />
                  <Button
                    onClick={() => {
                      if (!groupName.trim() || groupName === chat.chatName)
                        return;
                      renameGroup.mutate(
                        { chatId: chat._id, chatName: groupName },
                        {
                          onSuccess: () => toast.success("Group renamed"),
                          onError: () => toast.error("Failed to rename group"),
                        },
                      );
                    }}
                    disabled={renameGroup.isPending}
                  >
                    Save
                  </Button>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-semibold text-muted-foreground">
                Group Members ({chat.users.length})
              </h3>
              <div className="flex flex-col divide-y">
                {chat.users.map((member) => {
                  const memberIsAdmin = chat.groupAdmin?._id === member._id;
                  const canRemove = isAdmin || member._id === currentUser._id;

                  return (
                    <div
                      key={member._id}
                      className="flex items-center justify-between gap-3 py-2"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={member.pic} alt={member.name} />
                          <AvatarFallback>
                            {member.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="flex items-center gap-1 text-sm font-medium">
                            {member.name}
                            {memberIsAdmin && (
                              <span className="inline-flex items-center gap-0.5 rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                                <Crown className="h-2.5 w-2.5" /> Admin
                              </span>
                            )}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {member.email}
                          </span>
                        </div>
                      </div>
                      {canRemove && !memberIsAdmin && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setMemberToRemove(member)}
                        >
                          {member._id === currentUser._id ? "Leave" : "Remove"}
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {isAdmin && (
              <div className="flex flex-col gap-2">
                <h3 className="text-sm font-semibold text-muted-foreground">
                  Add Members
                </h3>
                <Input
                  placeholder="Search by name or email"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <div className="flex flex-col">
                  {results
                    .filter((u) => !chat.users.find((m) => m._id === u._id))
                    .slice(0, 4)
                    .map((user) => (
                      <UserListItem
                        key={user._id}
                        user={user}
                        onClick={() =>
                          addToGroup.mutate(
                            { chatId: chat._id, userId: user._id },
                            {
                              onSuccess: () =>
                                toast.success(`${user.name} added to group`),
                              onError: () =>
                                toast.error("Failed to add member"),
                            },
                          )
                        }
                      />
                    ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <AlertDialog
        open={!!memberToRemove}
        onOpenChange={(open) => !open && setMemberToRemove(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {memberToRemove?._id === currentUser._id
                ? "Leave this group?"
                : `Remove ${memberToRemove?.name}?`}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {memberToRemove?._id === currentUser._id
                ? "You won't be able to see new messages in this group unless someone adds you back."
                : "They will no longer have access to this group's messages."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmRemove}
              className="bg-destructive text-destructive-foreground text-white"
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
