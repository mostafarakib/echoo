import Link from "next/link";
import { LoginForm } from "@/components/auth/LoginForm";
import { GuestOnly } from "@/components/auth/GuestOnly";
import { AuthLayout } from "@/components/auth/AuthLayout";

export default function LoginPage() {
  return (
    <GuestOnly>
      <AuthLayout>
        <div className="mb-6 flex flex-col gap-1">
          <h2 className="text-2xl font-semibold tracking-tight">
            Welcome back
          </h2>
          <p className="text-sm text-muted-foreground">
            Log in to keep the conversation going.
          </p>
        </div>
        <LoginForm />
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-medium text-primary hover:underline"
          >
            Sign up
          </Link>
        </p>
      </AuthLayout>
    </GuestOnly>
  );
}
