"use client";

import { signOut } from "next-auth/react";

export default function LogoutPage() {
  return (
    <div className="min-h-screen w-full bg-black text-zinc-50 flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-2xl bg-zinc-900 border border-zinc-800 p-8 shadow-xl text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Sign out</h1>
        <p className="mt-2 text-zinc-400">You are about to end your session.</p>
        <div className="mt-8 flex gap-3">
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex-1 rounded-lg bg-white text-black hover:bg-zinc-200 transition-colors h-12 px-4 font-medium"
          >
            Sign out
          </button>
          <a
            href="/dashboard"
            className="flex-1 rounded-lg border border-zinc-700 hover:border-zinc-500 transition-colors h-12 px-4 font-medium inline-flex items-center justify-center"
          >
            Cancel
          </a>
        </div>
      </div>
    </div>
  );
}
