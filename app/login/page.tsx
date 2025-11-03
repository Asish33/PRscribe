"use client";

import { signIn } from "next-auth/react";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full bg-black text-zinc-50 flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-2xl bg-zinc-900 border border-zinc-800 p-8 shadow-xl">
        <div className="flex flex-col items-center gap-4">
          <Image
            className="dark:invert"
            src="/next.svg"
            alt="Logo"
            width={80}
            height={16}
            priority
          />
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome back
          </h1>
          <p className="text-zinc-400 text-center">Sign in to continue</p>
        </div>

        <div className="mt-8">
          <button
            onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
            className="w-full inline-flex items-center justify-center gap-3 rounded-lg bg-white text-black hover:bg-zinc-200 transition-colors h-12 px-4 font-medium"
          >
            Continue with GitHub
          </button>
        </div>

        <p className="mt-6 text-xs text-center text-zinc-500">
          By continuing, you agree to our Terms and acknowledge our Privacy
          Policy.
        </p>
      </div>
    </div>
  );
}
