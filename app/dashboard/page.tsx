"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { ChevronRight, ExternalLink } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  ResponsiveContainer,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { ComposedChart, Area } from "recharts";

interface InstallationStatus {
  installed: boolean;
}

interface PullRequest {
  id?: string;
  pullRequestId?: number;
  title?: string;
  summary?: string;
  url: string;
  reponame: string;
  branches: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [installationStatus, setInstallationStatus] =
    useState<InstallationStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [prData, setPrData] = useState<PullRequest[] | null>(null);
  const [prLoading, setPrLoading] = useState(false);
  const [prError, setPrError] = useState<string | null>(null);
  const [selectedPr, setSelectedPr] = useState<PullRequest | null>(null);

  useEffect(() => {
    if (status !== "authenticated" || !session?.user?.email) return;

    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setPrLoading(true);
        setError(null);
        setPrError(null);

        const email = session!.user!.email as string;
        const res = await axios.post(
          process.env.NEXT_PUBLIC_BACKEND_URL + "check",
          { email }
        );
        if (cancelled) return;
        const statusPayload = res.data as
          | InstallationStatus
          | { installed: boolean };
        const installed =
          (statusPayload as InstallationStatus)?.installed ?? false;
        setInstallationStatus({ installed });
        setLoading(false);

        if (installed) {
          try {
            const prRes = await axios.post(
              process.env.NEXT_PUBLIC_BACKEND_URL + "getPr",
              { email }
            );
            if (cancelled) return;
            console.log("getPr response:", prRes.data);
            const prPayload = prRes.data as { prdata?: PullRequest[] };
            setPrData(prPayload?.prdata ?? []);
          } catch (e) {
            if (cancelled) return;
            const message =
              e instanceof Error ? e.message : "Failed to load pull requests";
            setPrError(message);
            setPrData([]);
          } finally {
            if (cancelled) return;
            setPrLoading(false);
          }
        } else {
          setPrData([]);
          setPrLoading(false);
        }
      } catch (err) {
        if (cancelled) return;
        const message =
          err instanceof Error ? err.message : "Failed to load dashboard data";
        setError(message);
        setPrError(message);
        setLoading(false);
        setPrLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [status, session]);

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

  const installUrl = "https://github.com/apps/pr-managers";

  function getPrUrl(pr: PullRequest) {
    return pr?.url || "#";
  }

  const chartData = (() => {
    if (!prData || prData.length === 0)
      return [] as { day: string; created: number; updated: number }[];

    const days = 14; // last 14 days
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const labels: string[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
        2,
        "0"
      )}-${String(d.getDate()).padStart(2, "0")}`;
      labels.push(key);
    }

    const counts = new Map<string, { created: number; updated: number }>();
    labels.forEach((l) => counts.set(l, { created: 0, updated: 0 }));

    const toKey = (value?: string | Date) => {
      if (!value) return "";
      const d = new Date(value);
      if (isNaN(d.getTime())) return "";
      d.setHours(0, 0, 0, 0);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
        2,
        "0"
      )}-${String(d.getDate()).padStart(2, "0")}`;
    };

    for (const pr of prData) {
      const cKey = toKey(pr.createdAt);
      const uKey = toKey(pr.updatedAt);
      if (cKey && counts.has(cKey)) {
        const row = counts.get(cKey)!;
        row.created += 1;
      }
      if (uKey && counts.has(uKey)) {
        const row = counts.get(uKey)!;
        row.updated += 1;
      }
    }

    return labels.map((l) => ({
      day: l,
      created: counts.get(l)?.created || 0,
      updated: counts.get(l)?.updated || 0,
    }));
  })();

  const formatDateTime = (value?: string | Date) => {
    if (!value) return "-";
    const d = value instanceof Date ? value : new Date(value);
    return isNaN(d.getTime()) ? "-" : d.toLocaleString();
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const CustomTooltip = ({ active, label, payload }: any) => {
    if (!active || !payload || payload.length === 0) return null;
    const seen = new Set<string>();
    const items: { name: string; value: number | string; color?: string }[] =
      [];
    for (const p of payload) {
      const key = p?.dataKey as string | undefined;
      if (!key || seen.has(key)) continue;
      seen.add(key);
      const displayName = key === "created" ? "Created" : "Updated";
      items.push({
        name: displayName,
        value: p?.value as number | string,
        color:
          (p?.color as string | undefined) || (p?.stroke as string | undefined),
      });
    }
    return (
      <div
        style={{
          background: "#0a0a0a",
          border: "1px solid #27272a",
          color: "#fafafa",
          padding: "8px 10px",
          borderRadius: 6,
        }}
      >
        <div style={{ color: "#a1a1aa", marginBottom: 4, fontSize: 12 }}>
          {label}
        </div>
        {items.map((it) => (
          <div
            key={it.name}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 12,
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                background: it.color ?? "#8884d8",
                borderRadius: 2,
                display: "inline-block",
              }}
            />
            <span style={{ color: "#fafafa" }}>{it.name}</span>
            <span style={{ color: "#a1a1aa" }}>{it.value}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen w-full bg-black text-zinc-50">
      {/* subtle background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_-10%,rgba(120,119,198,0.15),transparent_60%)]" />
      <div className="relative mx-auto max-w-4xl px-6 py-10 md:py-12">
        {/* Header */}
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-zinc-100 to-zinc-400">
              Dashboard
            </h1>
            <p className="mt-1 text-sm md:text-base text-zinc-400">
              Manage pull requests across repositories at a glance.
            </p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="rounded-lg border border-zinc-800 bg-zinc-900/80 px-4 py-2 text-sm font-medium transition-colors hover:border-zinc-700 hover:bg-zinc-800/80 shadow-sm"
          >
            Logout
          </button>
        </div>

        {/* Installation CTA (shown only if not installed) */}
        {!loading &&
        !error &&
        installationStatus &&
        !installationStatus.installed ? (
          <div className="rounded-2xl bg-zinc-900/70 backdrop-blur border border-zinc-800 p-6 shadow-xl">
            <h3 className="mb-4 text-lg font-semibold">
              GitHub App Installation
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 rounded-lg bg-amber-900/20 border border-amber-800 p-4">
                <span className="text-2xl">🚀</span>
                <div>
                  <p className="font-medium text-amber-400">
                    You haven&apos;t installed the GitHub App yet
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
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-white text-black hover:bg-zinc-200 transition-colors px-6 py-3 font-medium shadow-sm"
              >
                Install App
              </a>
            </div>
          </div>
        ) : null}
        {error ? (
          <div className="mt-6 rounded-lg bg-red-900/20 border border-red-800 p-4 text-red-400">
            <p className="font-medium">Error</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        ) : null}

        {/* Pull Requests - only when app is installed */}
        {installationStatus?.installed ? (
          <div className="mt-8 space-y-6">
            {prData && prData.length > 0 ? (
              <Card className="overflow-hidden border-zinc-800 bg-zinc-950/80 backdrop-blur shadow-lg">
                <div className="h-1 w-full bg-linear-to-r from-cyan-500/40 via-fuchsia-400/30 to-transparent" />
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">
                    PR Activity (last 14 days)
                  </CardTitle>
                  <CardDescription>Created vs Updated</CardDescription>
                  <div className="mt-2 flex items-center gap-4 text-xs text-zinc-400">
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2 w-4 rounded-sm"
                        style={{ background: "#22d3ee" }}
                      />
                      <span>Created</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2 w-4 rounded-sm"
                        style={{ background: "#a78bfa" }}
                      />
                      <span>Updated</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart
                        data={chartData}
                        margin={{ left: 8, right: 8, top: 8, bottom: 8 }}
                      >
                        <defs>
                          <linearGradient
                            id="createdGradient"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor="#22d3ee"
                              stopOpacity="0.35"
                            />
                            <stop
                              offset="100%"
                              stopColor="#22d3ee"
                              stopOpacity="0"
                            />
                          </linearGradient>
                          <linearGradient
                            id="updatedGradient"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor="#a78bfa"
                              stopOpacity="0.35"
                            />
                            <stop
                              offset="100%"
                              stopColor="#a78bfa"
                              stopOpacity="0"
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                        <XAxis
                          dataKey="day"
                          tick={{ fill: "#a1a1aa", fontSize: 12 }}
                          stroke="#3f3f46"
                          tickMargin={8}
                        />
                        <YAxis
                          allowDecimals={false}
                          tick={{ fill: "#a1a1aa", fontSize: 12 }}
                          stroke="#3f3f46"
                        />
                        <Tooltip content={<CustomTooltip />} />
                        {/* Legend handled manually above header to avoid duplicates */}
                        <Area
                          type="monotone"
                          dataKey="created"
                          fill="url(#createdGradient)"
                          stroke="#22d3ee"
                          strokeWidth={1.5}
                          fillOpacity={1}
                        />
                        <Area
                          type="monotone"
                          dataKey="updated"
                          fill="url(#updatedGradient)"
                          stroke="#a78bfa"
                          strokeWidth={1.5}
                          fillOpacity={1}
                        />
                        <Line
                          type="monotone"
                          dataKey="created"
                          name="Created"
                          stroke="#22d3ee"
                          strokeWidth={2}
                          dot={false}
                          activeDot={{ r: 4 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="updated"
                          name="Updated"
                          stroke="#a78bfa"
                          strokeWidth={2}
                          dot={false}
                          activeDot={{ r: 4 }}
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            ) : null}

            <h3 className="text-lg font-semibold">Recent Pull Requests</h3>

            {prLoading ? (
              <div className="flex items-center gap-3 text-zinc-400">
                <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent" />
                <span>Loading pull requests...</span>
              </div>
            ) : prError ? (
              <div className="rounded-lg bg-red-900/20 border border-red-800 p-4 text-red-400">
                <p className="font-medium">Error loading PRs</p>
                <p className="text-sm mt-1">{prError}</p>
              </div>
            ) : prData && prData.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {prData.map((pr, idx) => (
                  <Card
                    key={(pr.id as string) || pr.pullRequestId || idx}
                    className="group border-zinc-800 bg-zinc-950/80 backdrop-blur transition-all hover:border-zinc-700 hover:bg-zinc-900/80 cursor-pointer shadow-sm hover:shadow-md"
                    onClick={() => setSelectedPr(pr)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setSelectedPr(pr);
                      }
                    }}
                  >
                    <CardHeader className="pb-1">
                      <CardTitle className="text-base md:text-lg text-zinc-100 line-clamp-1">
                        {pr.title || `PR #${pr.pullRequestId}`}
                      </CardTitle>
                      <CardDescription className="text-xs text-zinc-500">
                        {typeof pr.createdAt === "string" ||
                        pr.createdAt instanceof Date
                          ? new Date(pr.createdAt).toLocaleString()
                          : ""}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-end">
                        <ChevronRight className="h-4 w-4 text-zinc-500 transition-transform group-hover:translate-x-0.5" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-6 text-zinc-400 text-sm">
                No pull requests found.
              </div>
            )}
          </div>
        ) : null}
        {/* Modal for PR details */}
        {selectedPr ? (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            aria-modal="true"
            role="dialog"
          >
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setSelectedPr(null)}
            />
            <div
              className="relative z-10 w-full max-w-3xl rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl md:text-2xl font-semibold text-zinc-100">
                    {selectedPr.title || `PR #${selectedPr.pullRequestId}`}
                  </h2>
                  <p className="mt-1 text-xs text-zinc-500">
                    Created: {formatDateTime(selectedPr?.createdAt)} • Updated:{" "}
                    {formatDateTime(selectedPr?.updatedAt)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedPr(null)}
                  className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-200 hover:border-zinc-600 hover:bg-zinc-800"
                >
                  Close
                </button>
              </div>
              <div className="space-y-3">
                {selectedPr.summary ? (
                  <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4">
                    <p className="text-sm text-zinc-300 line-clamp-3 wrap-break-word">
                      {selectedPr.summary}
                    </p>
                  </div>
                ) : (
                  <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4 text-sm text-zinc-400">
                    No description provided.
                  </div>
                )}
                <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4 text-sm text-zinc-300">
                  <div className="grid gap-2 sm:grid-cols-2">
                    <div className="flex items-center gap-2">
                      <span className="text-zinc-500">Repo:</span>
                      <span className="truncate">
                        {selectedPr.reponame || "-"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-zinc-500">Branch:</span>
                      <span className="truncate">
                        {selectedPr.branches || "-"}
                      </span>
                    </div>
                    <div className="sm:col-span-2 flex items-start gap-2">
                      <span className="text-zinc-500">URL:</span>
                      {selectedPr.url ? (
                        <a
                          href={selectedPr.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-zinc-200 hover:text-white underline-offset-2 hover:underline truncate"
                        >
                          {selectedPr.url}
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      ) : (
                        <span className="text-zinc-400">-</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              {selectedPr.url ? (
                <div className="mt-4 flex justify-end">
                  <a
                    href={getPrUrl(selectedPr)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-md border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-200 hover:border-zinc-600 hover:bg-zinc-800"
                  >
                    View on GitHub
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
