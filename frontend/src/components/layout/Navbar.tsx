"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ChatSearch } from "@/components/chat/ChatSearch";
import { NotificationDropdown } from "./NotificationDropdown";
import { ProfileDropdown } from "./ProfileDropdown";
import { cn } from "@/lib/utils";
import Image from "next/image";

export function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <nav className="flex h-16 shrink-0 items-center justify-between border-b bg-white px-4">
      <Sheet open={searchOpen} onOpenChange={setSearchOpen}>
        <SheetTrigger
          className={cn(buttonVariants({ variant: "ghost" }), "gap-2")}
        >
          <Search className="h-4 w-4" />
          <span className="hidden sm:inline">Search users</span>
        </SheetTrigger>
        <SheetContent side="left" className="w-80 p-0">
          <SheetHeader className="border-b p-4">
            <SheetTitle>Search Users</SheetTitle>
          </SheetHeader>
          <ChatSearch onChatOpened={() => setSearchOpen(false)} />
        </SheetContent>
      </Sheet>

      <Image
        src="/echoo.png"
        alt="logo"
        width={150}
        height={64}
        className="w-30 md:w-37.5 h-auto"
        loading="eager"
      />

      <div className="flex items-center gap-2">
        <NotificationDropdown />
        <ProfileDropdown />
      </div>
    </nav>
  );
}
