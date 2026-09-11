'use client';

import React from 'react';
import Link from 'next/link';
import { Mic, Globe, ShieldCheck, ArrowRight, Check, ArrowUpRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-[#FFFCFA] text-[#252522] overflow-hidden">
      {/* Delicate Ambient Grid Canvas Background */}
      <div className="absolute inset-0 ambient-grid pointer-events-none z-0 opacity-60" />

      {/* Hero Section - Granola & Strawberry Style */}
      <section className="relative z-10 pt-16 pb-20 md:pt-24 md:pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        {/* Top Feature Pill - Granola Oat Style */}
        <Link
          href="/studio"
          className="group inline-flex items-center gap-2 pl-2 pr-3.5 py-1.5 rounded-full bg-[#F7F7F2] hover:bg-[#EFEFEA] border border-black/[0.06] transition-colors mb-8"
        >
          <span className="px-2 py-0.5 text-[11px] font-semibold rounded-full bg-[#D1E043] text-[#252522]">
            New
          </span>
          <span className="text-xs font-medium text-[#252522]">
            Voice Notepad for Multilingual Teams
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-[#6B6B65] transition-transform group-hover:translate-x-0.5" />
        </Link>

        {/* Big Editorial Serif Heading - Exact Granola / Strawberry Style */}
        <h1 className="font-editorial text-5xl sm:text-7xl lg:text-[clamp(64px,6.5vw,100px)] font-normal tracking-[-0.02em] leading-[0.94] text-[#252522] max-w-5xl text-balance mb-8">
          Voice that works alongside your entire team.
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-2xl text-[#6B6B65] max-w-2xl font-sans font-normal leading-relaxed text-balance mb-10">
          Notes, task assignments, and multilingual handoff. Without translation drift.
        </p>

        {/* Pill Buttons - Granola / Strawberry Light Mode Design */}
        <div className="flex flex-col sm:flex-row items-center gap-3.5 mb-16">
          <Link
            href="/studio"
            className="inline-flex items-center justify-center gap-2 px-8 h-13 rounded-full text-base font-medium bg-[#252522] hover:bg-[#3A3A34] text-[#FFFCFA] shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Mic className="w-4 h-4 text-[#D1E043]" />
            <span>Open Voice Studio</span>
          </Link>

          <Link
            href="/team"
            className="inline-flex items-center justify-center gap-2 px-7 h-13 rounded-full text-base font-medium bg-white hover:bg-[#F7F7F2] border border-black/[0.1] text-[#252522] shadow-xs transition-all hover:border-black/[0.2]"
          >
            <span>Explore Team Relay (18 Locales)</span>
          </Link>
        </div>

        {/* Interactive Window Stage - Strawberry macOS Window & Granola Notepad Sheet */}
        <div className="w-full max-w-5xl rounded-3xl border border-black/[0.08] bg-white p-6 sm:p-8 shadow-xl shadow-black/[0.04] text-left relative overflow-hidden">
          {/* Window Header */}
          <div className="flex items-center justify-between pb-5 border-b border-black/[0.06] mb-6">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#FF5F56]"></span>
              <span className="w-3 h-3 rounded-full bg-[#FFBD2E]"></span>
              <span className="w-3 h-3 rounded-full bg-[#27C93F]"></span>
              <span className="ml-3 text-xs font-mono text-[#9E9E96]">bhasha.notepad / voice-intake</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-mono text-[#252522] bg-[#F7F7F2] px-3 py-1 rounded-full border border-black/[0.06]">
              <span className="w-2 h-2 rounded-full bg-[#D1E043]"></span>
              <span>18 Languages Active</span>
            </div>
          </div>

          {/* Interactive Three-Stage Flow */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Stage 1: Spoken Note */}
            <div className="editorial-card-oats p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-[#7A7A72] mb-3">
                  <span>01. SPOKEN VOICE NOTE</span>
                  <Mic className="w-3.5 h-3.5 text-[#ED5A31]" />
                </div>
                <div className="p-3.5 rounded-xl bg-white border border-black/[0.06] mb-3 shadow-xs">
                  <p className="text-sm font-sans text-[#252522] leading-relaxed italic">
                    &ldquo;Kal Rahul deployment kare, but only after tests pass — deadline 4 PM.&rdquo;
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-[#7A7A72] font-mono pt-2">
                <span>Spoken in Hinglish</span>
                <span className="text-[#5B6F00] font-medium">98% Clarity</span>
              </div>
            </div>

            {/* Stage 2: Locked Facts (Meaning Packet) */}
            <div className="editorial-card-oats p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-[#7A7A72] mb-3">
                  <span>02. FACT INVARIANTS</span>
                  <span className="text-[#5B6F00] font-bold">LOCKED</span>
                </div>
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between p-2 rounded-lg bg-white border border-black/[0.06]">
                    <span className="text-[#7A7A72]">Assignee:</span>
                    <span className="text-[#252522] font-semibold">Rahul</span>
                  </div>
                  <div className="flex justify-between p-2 rounded-lg bg-white border border-black/[0.06]">
                    <span className="text-[#7A7A72]">Deadline:</span>
                    <span className="text-[#ED5A31] font-semibold">Tomorrow 4:00 PM</span>
                  </div>
                  <div className="flex justify-between p-2 rounded-lg bg-white border border-black/[0.06]">
                    <span className="text-[#7A7A72]">Condition:</span>
                    <span className="text-[#5B6F00]">Tests must pass</span>
                  </div>
                </div>
              </div>
              <div className="text-[11px] font-mono text-[#5B6F00] pt-3 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                <span>Zero Fact Drift Guaranteed</span>
              </div>
            </div>

            {/* Stage 3: Multilingual Task Delivery */}
            <div className="editorial-card-oats p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-[#7A7A72] mb-3">
                  <span>03. TEAM RELAY</span>
                  <Globe className="w-3.5 h-3.5 text-[#252522]" />
                </div>
                <div className="space-y-2">
                  <div className="p-2.5 rounded-lg bg-white border border-black/[0.06] shadow-xs">
                    <div className="flex items-center gap-1.5 text-xs text-[#7A7A72] font-mono mb-1">
                      <span>🇯🇵 Japanese (Kenji)</span>
                    </div>
                    <p className="text-xs text-[#252522]">テスト合格後にRahulがデプロイ実行 (明日午後4時)</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white border border-black/[0.06] shadow-xs">
                    <div className="flex items-center gap-1.5 text-xs text-[#7A7A72] font-mono mb-1">
                      <span>🇩🇪 German (Elena)</span>
                    </div>
                    <p className="text-xs text-[#252522]">Rahul führt Deployment nach Test-Bestehen bis 16 Uhr durch</p>
                  </div>
                </div>
              </div>
              <div className="text-[11px] font-mono text-[#7A7A72] pt-3 flex justify-between">
                <span>18 Team Languages</span>
                <span className="text-[#252522] font-medium">1-Click Copy</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Monochrome Contrast Bar ("Trusted by fast-moving teams") - Exact Granola Style */}
      <section className="py-12 bg-[#252522] text-[#FFFCFA] overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 text-center mb-6">
          <p className="text-xs font-mono uppercase tracking-widest text-white/50">
            Trusted by teams collaborating across global languages
          </p>
        </div>

        <div className="flex overflow-hidden">
          <div className="animate-marquee flex items-center gap-20 text-white/80 font-editorial text-2xl tracking-wider select-none">
            <span>Tokyo Engineering</span>
            <span>Berlin Product Hub</span>
            <span>Bengaluru Core Team</span>
            <span>Paris Operations</span>
            <span>San Francisco Infra</span>
            <span>Tokyo Engineering</span>
            <span>Berlin Product Hub</span>
            <span>Bengaluru Core Team</span>
          </div>
        </div>
      </section>

      {/* Feature Bento Section - Granola Editorial Layout */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-editorial text-4xl sm:text-6xl text-[#252522] font-normal tracking-tight mb-4">
            Effortless notes, enhanced instantly.
          </h2>
          <p className="text-lg text-[#6B6B65] font-sans">
            Capture spontaneous spoken instructions. Bhasha structures every requirement, locks deadlines, and translates idiomatic tasks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="editorial-card p-8 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-full bg-[#F7F7F2] border border-black/[0.06] flex items-center justify-center text-[#252522] mb-6">
                <Mic className="w-5 h-5 text-[#ED5A31]" />
              </div>
              <h3 className="font-editorial text-2xl text-[#252522] font-normal mb-3">
                Speak Naturally
              </h3>
              <p className="text-sm text-[#6B6B65] leading-relaxed font-sans">
                Supports mixed-language speech and Hinglish. Automatically cleans filler words, captures true intent, and transcribes without hesitation.
              </p>
            </div>
            <div className="pt-8">
              <Link href="/studio" className="text-xs font-mono text-[#252522] font-semibold hover:underline flex items-center gap-1">
                Open Studio →
              </Link>
            </div>
          </div>

          {/* Card 2 */}
          <div className="editorial-card p-8 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-full bg-[#F7F7F2] border border-black/[0.06] flex items-center justify-center text-[#252522] mb-6">
                <Globe className="w-5 h-5 text-[#5B6F00]" />
              </div>
              <h3 className="font-editorial text-2xl text-[#252522] font-normal mb-3">
                18 Language Relay
              </h3>
              <p className="text-sm text-[#6B6B65] leading-relaxed font-sans">
                Each team member receives instructions in their preferred language—from Hindi to Japanese—with 1-click clipboard copy and zero drift.
              </p>
            </div>
            <div className="pt-8">
              <Link href="/team" className="text-xs font-mono text-[#252522] font-semibold hover:underline flex items-center gap-1">
                View Team Inboxes →
              </Link>
            </div>
          </div>

          {/* Card 3 */}
          <div className="editorial-card p-8 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-full bg-[#F7F7F2] border border-black/[0.06] flex items-center justify-center text-[#252522] mb-6">
                <ShieldCheck className="w-5 h-5 text-[#D1E043]" />
              </div>
              <h3 className="font-editorial text-2xl text-[#252522] font-normal mb-3">
                Immutable Fact Locks
              </h3>
              <p className="text-sm text-[#6B6B65] leading-relaxed font-sans">
                Deadlines, names, and prerequisites are locked into factual invariants. Translations adapt the grammar without mutating the commitments.
              </p>
            </div>
            <div className="pt-8">
              <Link href="/audit" className="text-xs font-mono text-[#252522] font-semibold hover:underline flex items-center gap-1">
                Inspect Audit Proof →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
