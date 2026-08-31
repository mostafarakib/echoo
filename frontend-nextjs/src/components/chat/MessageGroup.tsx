import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Message } from "@/types/message";
import { MessageBubble } from "./MessageBubble";

export function MessageGroup({
  messages,
  isOwn,
}: {
  messages: Message[];
  isOwn: boolean;
}) {
  const sender = messages[0].sender;

  return (
    <div className={cn("flex items-end gap-2", isOwn && "flex-row-reverse")}>
      {!isOwn ? (
        <Avatar className="h-7 w-7 shrink-0 self-end">
          <AvatarImage src={sender.pic} alt={sender.name} />
          <AvatarFallback>{sender.name.charAt(0)}</AvatarFallback>
        </Avatar>
      ) : (
        <div className="w-7 shrink-0" />
      )}
      <div
        className={cn("flex max-w-[75%] flex-col gap-1", isOwn && "items-end")}
      >
        {messages.map((message) => (
          <MessageBubble key={message._id} message={message} isOwn={isOwn} />
        ))}
      </div>
    </div>
  );
}
