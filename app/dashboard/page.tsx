"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import axios from "axios";

interface InstallationStatus {
  installed: boolean;
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [installationStatus, setInstallationStatus] =
    useState<InstallationStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkInstallationStatus = useCallback(async () => {
    if (!session?.user) return;

    try {
      setLoading(true);
      setError(null);
      console.log(session)
      const res = await axios.post(process.env.NEXT_PUBLIC_BACKEND_URL + "check", {
        email: session?.user?.email,
      });
      const data: InstallationStatus = res.data;

      setInstallationStatus(data);
    } catch (err) {
      console.error("Error checking installation status:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to check installation status"
      );
    } finally {
      setLoading(false);
    }
  }, [session?.user]);

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      checkInstallationStatus();
    }
  }, [status, session, checkInstallationStatus]);

  if (status === "loading") {
    return (
      <div className="min-h-screen w-full bg-black text-zinc-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]" />
          <p className="mt-4 text-zinc-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null; 
  }

  const user = session?.user;
  const avatarUrl = (user as any)?.avatar_url || user?.image;
  const username =
    (user as any)?.login || user?.name || user?.email?.split("@")[0];
  const installUrl = "https://github.com/apps/pr-managers";

  return (
    <div className="min-h-screen w-full bg-black text-zinc-50">
      <div className="mx-auto max-w-4xl px-6 py-12">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-medium transition-colors hover:border-zinc-600 hover:bg-zinc-800"
          >
            Logout
          </button>
        </div>

        {/* User Info Card */}
        <div className="mb-6 rounded-2xl bg-zinc-900 border border-zinc-800 p-6 shadow-xl">
          <div className="flex items-center gap-4">
            {avatarUrl && (
              <Image
                src={avatarUrl}
                alt={username || "User avatar"}
                width={64}
                height={64}
                className="rounded-full border-2 border-zinc-700"
              />
            )}
            <div>
              <h2 className="text-xl font-semibold">{username || "User"}</h2>
              {user?.email && (
                <p className="text-sm text-zinc-400">{user.email}</p>
              )}
            </div>
          </div>
        </div>

        {/* Installation Status Card */}
        <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-6 shadow-xl">
          <h3 className="mb-4 text-lg font-semibold">
            GitHub App Installation
          </h3>

          {loading ? (
            <div className="flex items-center gap-3 text-zinc-400">
              <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent" />
              <span>Checking installation status...</span>
            </div>
          ) : error ? (
            <div className="rounded-lg bg-red-900/20 border border-red-800 p-4 text-red-400">
              <p className="font-medium">Error</p>
              <p className="text-sm mt-1">{error}</p>
              <button
                onClick={checkInstallationStatus}
                className="mt-3 rounded-lg bg-red-900/40 hover:bg-red-900/60 px-4 py-2 text-sm font-medium transition-colors"
              >
                Retry
              </button>
            </div>
          ) : installationStatus?.installed ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 rounded-lg bg-green-900/20 border border-green-800 p-4">
                <span className="text-2xl">✅</span>
                <div>
                  <p className="font-medium text-green-400">
                    GitHub App Installed
                  </p>
                  <p className="text-sm text-green-400/70 mt-1">
                    Your GitHub App is successfully installed and connected.
                  </p>
                </div>
              </div>
              <button
                onClick={checkInstallationStatus}
                className="rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm font-medium transition-colors hover:border-zinc-600 hover:bg-zinc-700"
              >
                Refresh Status
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3 rounded-lg bg-amber-900/20 border border-amber-800 p-4">
                <span className="text-2xl">🚀</span>
                <div>
                  <p className="font-medium text-amber-400">
                    You haven't installed the GitHub App yet
                  </p>
                  <p className="text-sm text-amber-400/70 mt-1">
                    Install the GitHub App to get started with repository
                    management.
                  </p>
                </div>
              </div>
              <a
                href={installUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-white text-black hover:bg-zinc-200 transition-colors px-6 py-3 font-medium"
              >
                Install App
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
