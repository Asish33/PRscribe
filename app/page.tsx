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

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-zinc-100">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-zinc-800/60 bg-black/60 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <Image
              src="/globe.svg"
              alt="Logo"
              width={24}
              height={24}
              className="invert"
            />
            <span className="text-sm font-semibold tracking-wide text-zinc-300">
              Repo Manager
            </span>
          </div>
          <nav className="hidden gap-6 text-sm text-zinc-400 md:flex">
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
              href="#pricing"
              className="hover:text-zinc-200 transition-colors"
            >
              Pricing
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              asChild
              className="h-9 border-zinc-800 bg-zinc-950 text-zinc-300 hover:bg-zinc-900"
            >
              <Link href="/login">Sign in</Link>
            </Button>
            <Button
              asChild
              className="h-9 bg-zinc-100 text-black hover:bg-white"
            >
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_50%_0%,rgba(59,130,246,0.15)_0%,rgba(0,0,0,0)_60%)]" />
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-6 pb-24 pt-20 md:grid-cols-2 md:pt-28">
          <div>
            <h1 className="text-balance text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
              Turn noisy GitHub activity into concise AI summaries
            </h1>
            <p className="mt-4 max-w-prose text-pretty text-zinc-400">
              We ingest your GitHub webhooks, group related actions, generate
              crisp AI summaries, and email the right people so your team stays
              aligned without the noise.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                className="px-5 py-2.5 bg-zinc-100 text-black hover:bg-white"
              >
                <Link href="/login">Get started free</Link>
              </Button>
              <Button
                variant="outline"
                asChild
                className="px-5 py-2.5 border-zinc-800 bg-zinc-950 text-zinc-300 hover:bg-zinc-900"
              >
                <a href="#how">See how it works</a>
              </Button>
            </div>
          </div>
          <div className="relative rounded-xl border border-zinc-800 bg-zinc-950/60 p-4 shadow-2xl ring-1 ring-black/20">
            <Card className="border-zinc-800 bg-linear-to-b from-zinc-950 to-black">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2 text-xs text-zinc-400">
                  <Badge
                    variant="secondary"
                    className="bg-zinc-900 text-zinc-300"
                  >
                    Webhook
                  </Badge>
                  <span>→</span>
                  <Badge
                    variant="secondary"
                    className="bg-zinc-900 text-zinc-300"
                  >
                    AI Summary
                  </Badge>
                  <span>→</span>
                  <Badge
                    variant="secondary"
                    className="bg-zinc-900 text-zinc-300"
                  >
                    Email
                  </Badge>
                </div>
                <CardTitle className="sr-only">Flow preview</CardTitle>
                <CardDescription className="sr-only">
                  Webhook to AI to Email
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <Card className="border-zinc-800 bg-zinc-900/60">
                  <CardContent className="p-3">
                    <div className="mb-1 text-zinc-300">
                      Push to main by @octocat
                    </div>
                    <div className="text-zinc-500">
                      12 files changed • 2 PRs referenced
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-zinc-800 bg-zinc-900/60">
                  <CardContent className="p-3">
                    <div className="mb-1 text-zinc-300">AI summary</div>
                    <div className="text-zinc-500">
                      Refactors auth flow; fixes webhook retry logic; adds email
                      batching.
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-zinc-800 bg-zinc-900/60">
                  <CardContent className="p-3">
                    <div className="mb-1 text-zinc-300">Email preview</div>
                    <div className="text-zinc-500">
                      Sent to platform@yourco.com • 8 recipients
                    </div>
                  </CardContent>
                </Card>
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
            <h2 className="text-2xl font-semibold tracking-tight">
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
          <h2 className="text-2xl font-semibold tracking-tight">
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
        <div className="mx-auto max-w-6xl rounded-xl border border-zinc-800 bg-linear-to-b from-zinc-950 to-black px-6 py-10">
          <div className="grid items-center gap-6 md:grid-cols-2">
            <div>
              <h3 className="text-xl font-semibold">
                Less noise. More signal.
              </h3>
              <p className="mt-2 text-zinc-400">
                Connect GitHub and start sending AI summaries in minutes.
              </p>
            </div>
            <div className="flex gap-3 md:justify-end">
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-md bg-zinc-100 px-5 py-2.5 text-sm font-medium text-black transition-colors hover:bg-white"
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
            <Image
              src="/globe.svg"
              alt="Logo"
              width={16}
              height={16}
              className="invert"
            />
            <span>© {new Date().getFullYear()} Repo Manager</span>
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
    <Card className="border-zinc-800 bg-zinc-950 hover:bg-zinc-900">
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
    <Card className="border-zinc-800 bg-zinc-950">
      <CardHeader className="pb-2">
        <Badge
          variant="outline"
          className="border-zinc-800 bg-black text-zinc-400"
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
