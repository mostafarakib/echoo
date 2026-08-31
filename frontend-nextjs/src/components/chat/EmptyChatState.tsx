import { MessageCircle } from "lucide-react";

export function EmptyChatState() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground">
      <MessageCircle className="h-10 w-10" />
      <p className="text-lg">Click on a chat to start messaging</p>
    </div>
  );
}
