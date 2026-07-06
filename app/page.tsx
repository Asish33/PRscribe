"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import LightRays from "@/components/LightRays";

export default function Home() {
  useEffect(() => {
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]")
    );
    if (elements.length === 0) return;
    const onIntersect: IntersectionObserverCallback = (entries) => {
      for (const entry of entries) {
        const el = entry.target as HTMLElement;
        if (entry.isIntersecting) {
          el.classList.add("is-visible");
        }
      }
    };
    const observer = new IntersectionObserver(onIntersect, {
      threshold: 0.1,
      rootMargin: "0px 0px -5% 0px",
    });
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-black text-zinc-100 selection:bg-blue-500/30">
      <header className="absolute top-0 z-50 w-full bg-transparent">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-5">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white">
              <Image src="/globe.svg" alt="PRscribe" width={18} height={18} className="brightness-0" />
            </div>
            <span className="text-xl font-medium tracking-tight text-white">PRscribe</span>
          </div>

         

          {/* CTA */}
          <div className="flex items-center">
            <Link
              href="/login"
              className="inline-flex h-10 items-center justify-center rounded-xl border border-white/10 bg-transparent px-5 text-sm font-medium text-white transition-colors hover:bg-white/5"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      <section className="relative flex min-h-[85vh] flex-col items-center justify-center overflow-hidden pb-32 pt-20">
        
        <div className="pointer-events-none absolute inset-0 z-0 h-[800px] w-full">
          <LightRays
            raysOrigin="top-center"
            raysColor="#8fc8f5"
            raysSpeed={1.4}
            lightSpread={1.1}
            fadeDistance={1}
            rayLength={2.5}
            followMouse={true}
            pulsating={false}
            noiseAmount={0}
            distortion={0}
            saturation={1}
            mouseInfluence={0.1}
            className="opacity-100"
          />
        </div>
        
        <div className="relative z-10 mx-auto flex max-w-[900px] flex-col items-center text-center px-6 mt-16">
          {/* Headline */}
          <h1 className="text-balance text-5xl font-medium tracking-tight text-white sm:text-6xl md:text-[80px] md:leading-[1.1]">
            AI-Powered Efficiency<br />for High Performers.
          </h1>

          {/* Subtext */}
          <p className="mt-8 max-w-2xl text-pretty text-lg text-zinc-400 md:text-xl md:leading-relaxed">
            Turn noisy GitHub PRs into concise AI summaries. PRscribe helps you take control of your code reviews with AI-driven insights. Say goodbye to distractions and unlock your full potential effortlessly.
          </p>

          {/* Actions */}
          <div className="mt-10">
            <Link
              href="/login"
              className="inline-flex h-14 items-center justify-center rounded-xl bg-[#2563eb] px-8 text-base font-medium text-white transition-colors hover:bg-blue-600 shadow-[0_0_40px_-10px_rgba(37,99,235,0.5)]"
            >
              Try PRscribe for free
            </Link>
          </div>

          <p className="mt-12 text-sm font-medium text-zinc-500">
            Trusted by 100+ businesses worldwide
          </p>

          {/* Trusted By Logos */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-8 opacity-40 grayscale md:gap-16">
            <div className="flex items-center gap-2 text-xl font-bold tracking-tight">
              <span className="h-6 w-6 rounded-full bg-white" /> Logoipsum
            </div>
            <div className="flex items-center gap-2 text-xl font-bold tracking-tight">
              <span className="h-6 w-6 rounded bg-white" /> Logoipsum
            </div>
            <div className="flex items-center gap-2 text-xl font-bold tracking-tight">
              <span className="h-6 w-6 rounded-full bg-white" /> Logoipsum
            </div>
            <div className="flex items-center gap-2 text-xl font-bold tracking-tight">
              <span className="h-6 w-6 rounded-sm bg-white" /> Logoipsum
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES GRID ── */}
      <section id="features" className="bg-black py-32">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="mb-20 text-center">
            <h2 className="text-4xl font-medium tracking-tight text-white sm:text-5xl">
              Make your workflow feel effortless
            </h2>
            <p className="mt-4 text-lg text-zinc-500">
              Your productivity should feel calm, focused, and frictionless.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <FeatureCard
              title="Instant Clarity"
              desc="Start each day with a clear, AI-powered plan, no guesswork needed."
              icon={
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
              }
            />
            <FeatureCard
              title="Deep Focus"
              desc="Block out the noise and stay in the zone longer with PRscribe's summaries."
              icon={
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
              }
            />
            <FeatureCard
              title="Smart Priorities"
              desc="Important updates are surfaced, so you don't have to think twice."
              icon={
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>
              }
            />
            <FeatureCard
              title="Effortless Planning"
              desc="Plan your week with a clean, intelligent interface that keeps things simple."
              icon={
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/></svg>
              }
            />
            <FeatureCard
              title="One Tool, Everything"
              desc="Webhooks, PRs, and AI summaries — all in one seamless workflow."
              icon={
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19.439 7.85c-.049.322.059.648.289.878l1.568 1.568c.47.47.706 1.087.706 1.704s-.235 1.233-.706 1.704l-1.611 1.611a.954.954 0 0 0-.256.871c.084.383.336.7.703.882l1.636.818c.84.42 1.258 1.346.994 2.251-.265.905-1.121 1.488-2.073 1.409l-1.78-.148a.954.954 0 0 0-.967.662c-.104.37.009.771.285 1.026l1.247 1.14c.732.67 1.002 1.674.653 2.583-.349.91-1.284 1.464-2.26 1.345l-1.716-.21a.954.954 0 0 0-1.021.579c-.147.354-.055.76.233 1.028l1.378 1.272c.677.625.962 1.58.683 2.455-.278.875-1.155 1.442-2.115 1.365l-1.782-.143a.954.954 0 0 0-.973.655c-.106.37.004.772.278 1.03l1.218 1.15c.67.632.937 1.606.638 2.493-.298.887-1.217 1.44-2.176 1.311l-1.72-.232a.954.954 0 0 0-1.028.563c-.15.352-.06.758.225 1.029l1.378 1.31c.642.61.91 1.547.64 2.408-.27.86-1.12 1.433-2.062 1.39l-1.784-.08a.954.954 0 0 0-.979.643c-.109.367-.002.77.268 1.032l1.177 1.144c.64.622.887 1.564.595 2.428-.292.864-1.173 1.428-2.127 1.364l-1.719-.115a.954.954 0 0 0-.99.596c-.14.348-.052.748.222 1.01l1.378 1.321c.624.598.875 1.5.602 2.333-.274.832-1.127 1.378-2.046 1.311l-1.787-.13a.954.954 0 0 0-.996.611c-.12.355-.022.755.244 1.015l1.166 1.14c.626.612.863 1.517.576 2.36-.286.843-1.152 1.39-2.08 1.31l-1.73-.146A2.052 2.052 0 0 1 2 20.083V3.917C2 2.858 2.858 2 3.917 2h16.166c1.06 0 1.917.858 1.917 1.917v3.933Z"/></svg>
              }
            />
            <FeatureCard
              title="Visible Progress"
              desc="Track real progress, not just activity, and finish each day with purpose."
              icon={
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
              }
            />
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/5 bg-black py-20">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="grid gap-12 md:grid-cols-4">
            {/* Brand */}
            <div className="col-span-2 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white">
                  <Image src="/globe.svg" alt="PRscribe" width={16} height={16} className="brightness-0" />
                </div>
                <span className="text-lg font-medium tracking-tight text-white">PRscribe</span>
              </div>
              <p className="max-w-xs text-sm leading-relaxed text-zinc-500">
                Your AI-powered companion for effortless PR summaries.
              </p>
              <div className="mt-auto pt-12 text-sm text-zinc-600">
                Created by PRscribe team
              </div>
            </div>

            {/* Navigation */}
            <div>
              <h4 className="mb-6 font-medium text-white">Navigation</h4>
              <div className="flex flex-col gap-4 text-sm text-zinc-400">
                <a href="#features" className="hover:text-white">Features</a>
                <a href="#how" className="hover:text-white">Benefits</a>
                <a href="#testimonials" className="hover:text-white">Testimonials</a>
                <a href="#pricing" className="hover:text-white">Pricing</a>
                <a href="#faq" className="hover:text-white">FAQ</a>
                <a href="/dashboard" className="hover:text-white">Dashboard</a>
              </div>
            </div>

            {/* Socials */}
            <div>
              <h4 className="mb-6 font-medium text-white">Socials</h4>
              <div className="flex flex-col gap-4 text-sm text-zinc-400">
                <a href="#" className="hover:text-white">Twitter (X)</a>
                <a href="#" className="hover:text-white">Instagram</a>
                <a href="#" className="hover:text-white">Facebook</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ─── Feature Card ─── */
function FeatureCard({ title, desc, icon }: { title: string; desc: string; icon: React.ReactNode }) {
  return (
    <div
      data-reveal
      className="group relative flex flex-col gap-5 rounded-[24px] border border-white/5 bg-[#0a0a0a] p-8 transition-all duration-300 hover:bg-[#111] reveal-item"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-zinc-300">
        {icon}
      </div>
      <div>
        <h3 className="mb-3 text-xl font-medium tracking-tight text-white">
          {title}
        </h3>
        <p className="text-[15px] leading-relaxed text-zinc-500">
          {desc}
        </p>
      </div>
    </div>
  );
}
