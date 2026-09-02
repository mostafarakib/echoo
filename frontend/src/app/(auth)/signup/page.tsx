import Link from "next/link";
import { SignupForm } from "@/components/auth/SignupForm";
import { GuestOnly } from "@/components/auth/GuestOnly";
import { AuthLayout } from "@/components/auth/AuthLayout";

export default function SignupPage() {
  return (
    <GuestOnly>
      <AuthLayout>
        <div className="mb-6 flex flex-col gap-1">
          <h2 className="text-2xl font-semibold tracking-tight">
            Create your account
          </h2>
          <p className="text-sm text-muted-foreground">
            Join Echoo and start chatting in seconds.
          </p>
        </div>
        <SignupForm />
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-primary hover:underline"
          >
            Login
          </Link>
        </p>
      </AuthLayout>
    </GuestOnly>
  );
}
