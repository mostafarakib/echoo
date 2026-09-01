import { X } from "lucide-react";
import { User } from "@/types/user";

export function SelectedUserChip({
  user,
  onRemove,
}: {
  user: User;
  onRemove: () => void;
}) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-1 text-xs font-medium">
      {user.name}
      <button
        onClick={onRemove}
        className="rounded-full hover:bg-secondary-foreground/10"
      >
        <X className="h-3 w-3" />
      </button>
    </span>
  );
}
