import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Chat } from "@/types/chat";
import { User } from "@/types/user";
import { getSender, getFullSender } from "@/lib/utils/chat-logic";

export function ChatListItem({
  chat,
  currentUser,
  isSelected,
  onClick,
}: {
  chat: Chat;
  currentUser: User;
  isSelected: boolean;
  onClick: () => void;
}) {
  const name = chat.isGroupChat
    ? chat.chatName
    : getSender(currentUser, chat.users);
  const avatarUser = chat.isGroupChat
    ? null
    : getFullSender(currentUser, chat.users);
  const preview = chat.latestMessage
    ? `${
        chat.latestMessage.sender._id === currentUser._id
          ? "You"
          : chat.latestMessage.sender.name.split(" ")[0]
      }: ${
        chat.latestMessage.content.length > 30
          ? chat.latestMessage.content.slice(0, 31) + "..."
          : chat.latestMessage.content
      }`
    : "No messages yet";

  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors",
        isSelected ? "bg-primary text-primary-foreground" : "hover:bg-accent",
      )}
    >
      <Avatar className="h-10 w-10 shrink-0">
        {avatarUser && <AvatarImage src={avatarUser.pic} alt={name} />}
        <AvatarFallback>{name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex min-w-0 flex-col">
        <span className="truncate text-sm font-semibold">{name}</span>
        <span
          className={cn(
            "truncate text-xs",
            isSelected ? "text-primary-foreground/80" : "text-muted-foreground",
          )}
        >
          {preview}
        </span>
      </div>
    </button>
  );
}
