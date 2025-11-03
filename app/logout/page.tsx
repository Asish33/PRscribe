"use client";

import { signOut } from "next-auth/react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function LogoutPage() {
  return (
    <div className="relative min-h-screen w-full bg-black text-zinc-50 flex items-center justify-center px-6">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_50%_0%,rgba(59,130,246,0.12)_0%,rgba(0,0,0,0)_60%)]" />
      <Card className="w-full max-w-md border-zinc-800 bg-zinc-950 text-center">
        <CardHeader>
          <CardTitle className="text-2xl">Sign out</CardTitle>
          <CardDescription className="text-zinc-400">
            You are about to end your session.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="flex-1 h-11 bg-zinc-100 text-black hover:bg-white"
            >
              Sign out
            </Button>
            <Button
              variant="outline"
              asChild
              className="flex-1 h-11 border-zinc-800 bg-zinc-950 text-zinc-300 hover:bg-zinc-900"
            >
              <a href="/dashboard">Cancel</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
