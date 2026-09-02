"use client";

import { motion } from "motion/react";
import { MessageCircle, Users, Zap } from "lucide-react";

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Brand panel */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-primary p-10 text-primary-foreground lg:flex">
        <span className="text-2xl font-bold tracking-tight">Echoo</span>

        <div className="flex flex-col gap-6">
          <h1 className="text-3xl font-bold leading-tight">
            Real conversations,
            <br />
            real time.
          </h1>
          <p className="max-w-sm text-primary-foreground/80">
            Fast, focused messaging for one-on-one and group chats — no clutter,
            just conversation.
          </p>

          <div className="flex flex-col gap-3 pt-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-foreground/10">
                <Zap className="h-4 w-4" />
              </div>
              <span className="text-sm">
                Instant delivery, no refresh needed
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-foreground/10">
                <Users className="h-4 w-4" />
              </div>
              <span className="text-sm">
                Group chats with full admin controls
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-foreground/10">
                <MessageCircle className="h-4 w-4" />
              </div>
              <span className="text-sm">
                Typing indicators &amp; live notifications
              </span>
            </div>
          </div>
        </div>

        <span className="text-xs text-primary-foreground/60">
          © {new Date().getFullYear()} Echoo
        </span>
      </div>

      {/* Form panel */}
      <div className="flex w-full flex-col items-center justify-center px-6 py-12 lg:w-1/2">
        <div className="mb-8 lg:hidden">
          <span className="text-2xl font-bold tracking-tight text-primary">
            Echoo
          </span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="w-full max-w-sm"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}
