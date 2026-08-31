import { cn } from "@/lib/utils";
import { Message } from "@/types/message";

export function MessageBubble({
  message,
  isOwn,
}: {
  message: Message;
  isOwn: boolean;
}) {
  return (
    <div
      className={cn(
        "max-w-full whitespace-pre-wrap wrap-break-word rounded-2xl px-4 py-2 text-sm",
        isOwn ? "bg-primary text-primary-foreground" : "bg-muted",
      )}
    >
      {message.content}
    </div>
  );
}
