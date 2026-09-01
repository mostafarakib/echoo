"use client";

import { useState } from "react";
import { ChevronDown, LogOut, User as UserIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { ProfileDialog } from "@/components/dialogs/ProfileDialog";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ProfileDropdown() {
  const { user, logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);

  if (!user) return null;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          className={cn(buttonVariants({ variant: "ghost" }), "gap-1 px-2")}
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.pic} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setProfileOpen(true)}>
            <UserIcon className="mr-2 h-4 w-4" />
            My Profile
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => logout.mutate()}
            className="text-destructive"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ProfileDialog
        user={user}
        open={profileOpen}
        onOpenChange={setProfileOpen}
      />
    </>
  );
}
