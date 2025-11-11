"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]")
    );
    if (elements.length === 0) return;
    const onIntersect: IntersectionObserverCallback = (entries, obs) => {
      for (const entry of entries) {
        const el = entry.target as HTMLElement;
        if (entry.isIntersecting) {
          el.classList.add("opacity-100", "translate-y-0");
          el.classList.remove("opacity-0", "translate-y-3");
        } else {
          // Reset when scrolled away so it can animate again on re-enter
          el.classList.add("opacity-0", "translate-y-3");
          el.classList.remove("opacity-100", "translate-y-0");
        }
      }
    };
    const observer = new IntersectionObserver(onIntersect, {
      threshold: 0.15,
      rootMargin: "0px 0px -5% 0px",
    });
    elements.forEach((el, idx) => {
      // Ensure initial hidden state so animations always play
      el.classList.add("opacity-0", "translate-y-3");
      el.style.transition = "opacity 500ms ease, transform 500ms ease";
      el.style.transitionDelay = `${idx * 60}ms`;
      observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);
  return (
    <div className="min-h-screen bg-black text-zinc-100">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-zinc-800/60 bg-black/60 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center rounded-full bg-zinc-900/60 ring-1 ring-zinc-800 p-1.5 shadow-sm">
              <Image
                src="/globe.svg"
                alt="PRscribe"
                width={18}
                height={18}
                className="invert opacity-90"
              />
            </div>
            <div className="leading-tight">
              <div className="text-base md:text-lg font-semibold tracking-tight text-zinc-100">
                PRscribe
              </div>
              <div className="text-[10px] md:text-xs text-zinc-500">
                AI Summaries for GitHub PRs
              </div>
            </div>
          </div>
          <nav className="hidden items-center gap-6 text-sm text-zinc-400 md:flex">
            <a
              href="#features"
              className="hover:text-zinc-200 transition-colors"
            >
              Features
            </a>
            <a href="#how" className="hover:text-zinc-200 transition-colors">
              How it works
            </a>
            <a
              href="/dashboard"
              className="hover:text-zinc-200 transition-colors"
            >
              Dashboard
            </a>
            <a href="/login" className="hover:text-zinc-200 transition-colors">
              Sign in
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              asChild
              className="h-9 border-zinc-800 bg-zinc-950 text-zinc-300 hover:bg-zinc-900 hover:shadow-[0_0_20px_rgba(59,130,246,0.2)]"
            >
              <Link href="/login">Sign in</Link>
            </Button>
            <Button
              asChild
              className="h-9 bg-zinc-100 text-black hover:bg-white hover:shadow-[0_0_24px_rgba(167,139,250,0.25)]"
            >
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_50%_0%,rgba(59,130,246,0.15)_0%,rgba(0,0,0,0)_60%)]" />
        <div className="pointer-events-none absolute -left-32 top-10 -z-10 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-32 top-32 -z-10 h-72 w-72 rounded-full bg-fuchsia-500/10 blur-3xl" />
        {/* floating icons for depth */}
        <Image
          src="/github.svg"
          alt=""
          width={48}
          height={48}
          className="pointer-events-none absolute left-10 top-24 -z-10 opacity-10 blur-[1px]"
        />
        <Image
          src="/vercel.svg"
          alt=""
          width={48}
          height={48}
          className="pointer-events-none absolute right-16 top-10 -z-10 opacity-10 blur-[1px]"
        />
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-6 pb-20 pt-12 md:grid-cols-2 md:pt-16">
          <div>
            <h1 className="text-balance text-4xl font-semibold leading-tight tracking-tight md:text-5xl bg-clip-text text-transparent bg-linear-to-r from-zinc-100 via-zinc-200 to-zinc-400">
              Turn noisy GitHub PRs into concise AI summaries
            </h1>
            <p className="mt-4 max-w-prose text-pretty text-zinc-400">
              We ingest your GitHub webhooks, group related actions, generate
              crisp AI insights, and email the right people so your team stays
              aligned without the noise.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                className="px-5 py-2.5 bg-zinc-100 text-black hover:bg-white shadow-sm hover:shadow-[0_0_28px_rgba(59,130,246,0.25)]"
              >
                <Link href="/login">Get started free</Link>
              </Button>
              <Button
                variant="outline"
                asChild
                className="px-5 py-2.5 border-zinc-800 bg-zinc-950 text-zinc-300 hover:bg-zinc-900 hover:shadow-[0_0_28px_rgba(167,139,250,0.2)]"
              >
                <a href="#how">See how it works</a>
              </Button>
            </div>
          </div>
          <div className="relative rounded-xl bg-zinc-950/60 p-4 shadow-2xl ring-1 ring-black/20">
            <Card className="overflow-hidden bg-linear-to-b from-zinc-950 to-black shadow-xl backdrop-blur">
              <div className="h-1 w-full bg-linear-to-r from-cyan-500/40 via-fuchsia-400/30 to-transparent animate-pulse" />
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2 text-xs text-zinc-400">
                  <Badge
                    variant="secondary"
                    className="bg-zinc-900 text-zinc-300"
                  >
                    PR
                  </Badge>
                  <span className="inline-block translate-x-0 animate-pulse">
                    →
                  </span>
                  <Badge
                    variant="secondary"
                    className="bg-zinc-900 text-zinc-300"
                  >
                    AI Insights
                  </Badge>
                  <span className="inline-block translate-x-0 animate-pulse">
                    →
                  </span>
                  <Badge
                    variant="secondary"
                    className="bg-zinc-900 text-zinc-300"
                  >
                    Comment
                  </Badge>
                </div>
                <CardTitle className="sr-only">Flow preview</CardTitle>
                <CardDescription className="sr-only">
                  Webhook to AI to automation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {/* Code diff animation */}
                <div className="rounded-lg border border-zinc-800/40 bg-zinc-900/40 p-3 shadow-sm">
                  <div className="font-mono text-[12px] leading-5">
                    <div className="text-emerald-400/90">
                      + feat(auth): add OAuth callback validation
                    </div>
                    <div
                      className="text-emerald-400/90"
                      style={{ animationDelay: "120ms" }}
                    >
                      &nbsp;&nbsp;+ ensure state param integrity
                    </div>
                    <div
                      className="text-rose-400/90"
                      style={{ animationDelay: "240ms" }}
                    >
                      - fix: remove redundant console logs
                    </div>
                    <div
                      className="text-zinc-400/90"
                      style={{ animationDelay: "360ms" }}
                    >
                      @@ packages/webhooks/handler.ts @@
                    </div>
                    <div
                      className="text-zinc-300/90"
                      style={{ animationDelay: "480ms" }}
                    >
                      const retries = 3 // retry on transient 5xx errors
                    </div>
                  </div>
                </div>
                {/* Animated arrow to summary */}
                <div className="flex items-center justify-center text-zinc-500">
                  <span className="animate-pulse">↓</span>
                </div>
                {/* AI summary with glow-on-hover */}
                <div className="rounded-lg border border-zinc-800/40 bg-zinc-900/40 p-3 shadow-sm transition-shadow hover:shadow-[0_0_24px_rgba(59,130,246,0.15)]">
                  <div className="mb-1 text-zinc-300">AI Insights</div>
                  <div className="text-zinc-500">
                    Auth flow hardened; webhook retry logic stabilized; comments
                    auto-posted on affected PRs.
                  </div>
                </div>
                {/* Comment automation */}
                <div className="rounded-lg border border-zinc-800/40 bg-zinc-900/40 p-3 shadow-sm">
                  <div className="mb-1 text-zinc-300">Automation</div>
                  <div className="text-zinc-500">
                    Posted insights comment to PR #128 • Assigned reviewers
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="border-t border-zinc-800/60 bg-black py-16"
      >
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-10 flex items-end justify-between">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
              Built for busy engineering teams
            </h2>
            <span className="text-xs text-zinc-500">
              Fast to set up • Private by default
            </span>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <FeatureCard
              title="GitHub-native"
              desc="Listen to pushes, PRs, reviews, comments, releases and more via webhooks."
              icon="/github.svg"
            />
            <FeatureCard
              title="AI summaries"
              desc="Generate crisp, context-aware updates using your repository signals."
              icon="/next.svg"
            />
            <FeatureCard
              title="Smart delivery"
              desc="Automatically route updates to the right people via email."
              icon="/vercel.svg"
            />
            <FeatureCard
              title="Noise control"
              desc="Deduplicate, group related events, and throttle bursts to reduce spam."
              icon="/window.svg"
            />
            <FeatureCard
              title="Secure"
              desc="We only store what’s needed. Rotate secrets and configure scopes."
              icon="/file.svg"
            />
            <FeatureCard
              title="Simple setup"
              desc="Connect GitHub, add a webhook URL, and you’re done in minutes."
              icon="/globe.svg"
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section
        id="how"
        className="border-t border-zinc-800/60 bg-linear-to-b from-black to-zinc-950 py-16"
      >
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
            How it works
          </h2>
          <ol className="mt-8 grid gap-4 md:grid-cols-3">
            <StepCard
              step="1"
              title="Connect your repos"
              desc="Add our webhook URL to your GitHub org or repo settings."
            />
            <StepCard
              step="2"
              title="Tune your summaries"
              desc="Pick rules, cadence, and audiences per repository."
            />
            <StepCard
              step="3"
              title="Ship with signal"
              desc="We email timely AI summaries so everyone stays aligned."
            />
          </ol>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-zinc-800/60 bg-zinc-950 py-16">
        <div className="mx-auto max-w-6xl rounded-xl bg-linear-to-b from-zinc-950 to-black px-6 py-10 shadow-xl">
          <div className="grid items-center gap-6 md:grid-cols-2">
            <div>
              <h3 className="text-xl md:text-2xl font-semibold">
                Less noise. More signal.
              </h3>
              <p className="mt-2 text-zinc-400">
                Connect GitHub and start sending AI summaries in minutes.
              </p>
            </div>
            <div className="flex gap-3 md:justify-end">
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-md bg-zinc-100 px-5 py-2.5 text-sm font-medium text-black transition-colors hover:bg-white shadow-sm"
              >
                Get started
              </Link>
              <a
                href="#features"
                className="inline-flex items-center justify-center rounded-md border border-zinc-800 bg-zinc-950 px-5 py-2.5 text-sm text-zinc-300 transition-colors hover:bg-zinc-900"
              >
                Explore features
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800/60 bg-black py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 text-xs text-zinc-500 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="relative flex items-center justify-center rounded-full bg-zinc-900/60 ring-1 ring-zinc-800 p-1 shadow-sm">
              <Image
                src="/globe.svg"
                alt="PRscribe"
                width={12}
                height={12}
                className="invert opacity-90"
              />
            </div>
            <span>© {new Date().getFullYear()} PRscribe</span>
          </div>
          <div className="flex gap-4">
            <a href="/login" className="hover:text-zinc-300">
              Sign in
            </a>
            <a href="/dashboard" className="hover:text-zinc-300">
              Dashboard
            </a>
            <a href="#" className="hover:text-zinc-300">
              Privacy
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  title,
  desc,
  icon,
}: {
  title: string;
  desc: string;
  icon?: string;
}) {
  return (
    <Card
      data-reveal
      className="bg-zinc-950/50 backdrop-blur border border-zinc-800/40 shadow-sm hover:shadow-md transition-colors opacity-0 translate-y-3"
    >
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2 text-zinc-300">
          {icon ? (
            <Image
              src={icon}
              alt=""
              width={16}
              height={16}
              className="opacity-80 invert"
            />
          ) : null}
          <CardTitle className="text-sm">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-sm text-zinc-500">
          {desc}
        </CardDescription>
      </CardContent>
    </Card>
  );
}

function StepCard({
  step,
  title,
  desc,
}: {
  step: string;
  title: string;
  desc: string;
}) {
  return (
    <Card
      data-reveal
      className="bg-zinc-950/50 backdrop-blur border border-zinc-800/40 shadow-sm opacity-0 translate-y-3"
    >
      <CardHeader className="pb-2">
        <Badge
          variant="outline"
          className="border-zinc-800/40 bg-black text-zinc-400"
        >
          {step}
        </Badge>
        <CardTitle className="text-sm text-zinc-200">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-sm text-zinc-500">
          {desc}
        </CardDescription>
      </CardContent>
    </Card>
  );
}
