"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/types/user";

interface ProfileDialogProps {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProfileDialog({
  user,
  open,
  onOpenChange,
}: ProfileDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col items-center gap-3 sm:max-w-xs">
        <DialogHeader>
          <DialogTitle className="text-center">{user.name}</DialogTitle>
        </DialogHeader>
        <Avatar className="h-28 w-28">
          <AvatarImage src={user.pic} alt={user.name} />
          <AvatarFallback className="text-2xl">
            {user.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <p className="text-sm text-muted-foreground">{user.email}</p>
      </DialogContent>
    </Dialog>
  );
}
