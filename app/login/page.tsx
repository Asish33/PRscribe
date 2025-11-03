"use client";

import { signIn } from "next-auth/react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  return (
    <div className="relative min-h-screen w-full bg-black text-zinc-50 flex items-center justify-center px-6">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_50%_0%,rgba(59,130,246,0.12)_0%,rgba(0,0,0,0)_60%)]" />
      <Card className="w-full max-w-md border-zinc-800 bg-zinc-950">
        <CardHeader className="items-center text-center">
          <Image
            className="invert"
            src="/globe.svg"
            alt="Logo"
            width={28}
            height={28}
          />
          <CardTitle className="text-2xl">Welcome back</CardTitle>
          <CardDescription className="text-zinc-400">
            Sign in to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
            className="w-full h-11 bg-zinc-100 text-black hover:bg-white"
          >
            Continue with GitHub
          </Button>
          <p className="mt-6 text-xs text-center text-zinc-500">
            By continuing, you agree to our Terms and acknowledge our Privacy
            Policy.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
