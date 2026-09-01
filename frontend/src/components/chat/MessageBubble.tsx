import { cn } from "@/lib/utils";
import { Message } from "@/types/message";
import { motion } from "motion/react";

export function MessageBubble({
  message,
  isOwn,
}: {
  message: Message;
  isOwn: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={cn(
        "max-w-full whitespace-pre-wrap wrap-break-word px-4 py-2 text-sm",
        isOwn
          ? "rounded-[20px_20px_4px_20px] bg-primary text-primary-foreground"
          : "rounded-[20px_20px_20px_4px] bg-muted",
      )}
    >
      {message.content}
    </motion.div>
  );
}
