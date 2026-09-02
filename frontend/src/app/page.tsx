import Link from "next/link";
import { MessageCircle, Users, Zap } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { GuestOnly } from "@/components/auth/GuestOnly";

export default function HomePage() {
  return (
    <GuestOnly>
      <div className="flex min-h-screen flex-col">
        <header className="flex items-center justify-between p-6">
          <span className="text-xl font-bold tracking-tight">Echoo</span>
          <div className="flex gap-2">
            <Link
              href="/login"
              className={cn(buttonVariants({ variant: "ghost" }))}
            >
              Login
            </Link>
            <Link href="/signup" className={cn(buttonVariants())}>
              Sign Up
            </Link>
          </div>
        </header>

        <main className="flex flex-1 flex-col items-center justify-center gap-8 px-6 text-center">
          <div className="flex flex-col gap-4">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Real conversations,{" "}
              <span className="text-primary">real time.</span>
            </h1>
            <p className="max-w-md text-muted-foreground">
              Echoo is a fast, focused chat app for one-on-one and group
              conversations — no clutter, just messaging.
            </p>
          </div>

          <div className="flex gap-3">
            <Link href="/signup" className={cn(buttonVariants({ size: "lg" }))}>
              Get Started
            </Link>
            <Link
              href="/login"
              className={cn(buttonVariants({ size: "lg", variant: "outline" }))}
            >
              I already have an account
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <span className="text-sm font-medium">Instant messaging</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <span className="text-sm font-medium">Group chats</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <MessageCircle className="h-5 w-5 text-primary" />
              </div>
              <span className="text-sm font-medium">Typing indicators</span>
            </div>
          </div>
        </main>
      </div>
    </GuestOnly>
  );
}
