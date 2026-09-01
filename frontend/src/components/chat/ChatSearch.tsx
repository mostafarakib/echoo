"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSearchUsers } from "@/hooks/useUsers";
import { useAccessChat } from "@/hooks/useChats";
import { User } from "@/types/user";

interface ChatSearchProps {
  onChatOpened: () => void;
}

export function ChatSearch({ onChatOpened }: ChatSearchProps) {
  const [query, setQuery] = useState("");
  const { data: results, isFetching } = useSearchUsers(query);
  const accessChat = useAccessChat();

  const handleSelectUser = (user: User) => {
    accessChat.mutate(user._id, { onSuccess: onChatOpened });
  };

  return (
    <div className="flex flex-col gap-3 p-4">
      <Input
        placeholder="Search by name or email"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        autoFocus
      />

      {isFetching && (
        <div className="flex justify-center py-4">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      )}

      <div className="flex flex-col gap-1">
        {results?.map((user) => (
          <button
            key={user._id}
            onClick={() => handleSelectUser(user)}
            disabled={accessChat.isPending}
            className="flex items-center gap-3 rounded-md p-2 text-left hover:bg-accent disabled:opacity-50"
          >
            <Avatar className="h-9 w-9">
              <AvatarImage src={user.pic} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col overflow-hidden">
              <span className="truncate text-sm font-medium">{user.name}</span>
              <span className="truncate text-xs text-muted-foreground">
                {user.email}
              </span>
            </div>
          </button>
        ))}

        {query && !isFetching && results?.length === 0 && (
          <p className="py-4 text-center text-sm text-muted-foreground">
            No users found
          </p>
        )}
      </div>
    </div>
  );
}
