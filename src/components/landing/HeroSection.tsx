'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Mic, ShieldCheck, Sparkles, Play, Globe, Zap, Cpu } from 'lucide-react';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative pt-12 pb-24 md:pt-20 md:pb-32 overflow-hidden">
      {/* Background Decorative Gradients and Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-teal-500/20 via-emerald-500/10 to-indigo-500/15 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute top-10 left-10 w-72 h-72 bg-teal-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Live System Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-teal-500/30 text-xs font-mono text-teal-300 shadow-lg shadow-teal-500/10 mb-8 animate-fade-in">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
            </span>
            <span>Enterprise Voice Orchestration</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400">Universal-3.5 Pro</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white leading-[1.1] mb-6">
            One Meaning,{' '}
            <span className="text-gradient-brand">Every Language.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed mb-10">
            Voice-first task orchestration for global teams. Speak in Hinglish, Japanese, or English — dispatch with <strong className="text-teal-300 font-semibold">zero fact drift</strong> using cryptographically bounded Meaning Packets.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              href="/studio"
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl text-base font-bold bg-gradient-to-r from-teal-400 via-teal-500 to-emerald-400 hover:from-teal-300 hover:to-emerald-300 text-slate-950 shadow-xl shadow-teal-500/25 hover:shadow-teal-500/40 transition-all hover:scale-[1.03] group"
            >
              <Mic className="w-5 h-5 text-slate-950 group-hover:scale-110 transition-transform" />
              <span>Launch Voice Studio</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="/team"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-4 rounded-2xl text-base font-semibold bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700/80 hover:border-slate-600 transition-all"
            >
              <Globe className="w-4 h-4 text-teal-400" />
              <span>Explore Team Relay</span>
            </Link>
          </div>

          {/* Live Micro-Preview Glass Card */}
          <div className="glass-panel-elevated rounded-3xl p-6 md:p-8 border border-slate-800/90 max-w-4xl mx-auto text-left shadow-2xl relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-teal-500/10 border border-teal-500/25 flex items-center justify-center text-teal-400">
                  <Play className="w-5 h-5 ml-0.5 fill-teal-400/20" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    Live Code-Switching Speech Stream
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-teal-500/15 text-teal-300 border border-teal-500/30">
                      Hinglish Voice Audio
                    </span>
                  </h4>
                  <p className="text-xs text-slate-400">
                    &quot;Rahul ko bolo auth module kal 4 baje tak deploy kare, lekin tests pass hone ke baad hi.&quot;
                  </p>
                </div>
              </div>

              <Link
                href="/studio"
                className="self-start md:self-center inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-950/80 border border-teal-600/50 text-teal-300 text-xs font-semibold hover:bg-teal-900 transition-colors"
              >
                <span>Try In Studio</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {/* 3 Split Cards Output Demonstration */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              {/* Hindi View */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-200">🇮🇳 Rahul (Developer)</span>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">0% Drift</span>
                  </div>
                  <p className="text-xs text-teal-300 font-semibold">ऑथ मॉड्यूल डिप्लॉयमेंट</p>
                  <p className="text-xs text-slate-300 mt-1">
                    कल 4:00 PM तक ऑथ मॉड्यूल को डिप्लॉय करें। शर्त: टेस्ट पास होने के बाद ही।
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-400">Locked Deadline:</span>
                  <span className="text-amber-300 font-semibold">कल शाम 4:00 PM</span>
                </div>
              </div>

              {/* Japanese View */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-200">🇯🇵 Kenji (SRE Lead)</span>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">0% Drift</span>
                  </div>
                  <p className="text-xs text-teal-300 font-semibold">認証モジュールのデプロイ</p>
                  <p className="text-xs text-slate-300 mt-1">
                    明日16:00までに認証モジュールを本番展開。前提: テスト全件通過後のみ。
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-400">Locked Deadline:</span>
                  <span className="text-amber-300 font-semibold">明日 16:00</span>
                </div>
              </div>

              {/* English View */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-200">🇺🇸 Ananya (Product Mgr)</span>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">0% Drift</span>
                  </div>
                  <p className="text-xs text-teal-300 font-semibold">Deploy Auth Module</p>
                  <p className="text-xs text-slate-300 mt-1">
                    Deploy authentication module by tomorrow 4:00 PM. Condition: Tests must pass first.
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-400">Locked Deadline:</span>
                  <span className="text-amber-300 font-semibold">Tomorrow 4:00 PM</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-12 border-t border-slate-800/80 max-w-4xl mx-auto">
            <div>
              <div className="text-3xl sm:text-4xl font-black text-teal-400">
                <AnimatedCounter value={0} suffix="%" />
              </div>
              <p className="text-xs font-mono uppercase tracking-wider text-slate-400 mt-1">
                Fact Drift Rate
              </p>
            </div>

            <div>
              <div className="text-3xl sm:text-4xl font-black text-white">
                <AnimatedCounter value={100} prefix="+" />
              </div>
              <p className="text-xs font-mono uppercase tracking-wider text-slate-400 mt-1">
                Languages Supported
              </p>
            </div>

            <div>
              <div className="text-3xl sm:text-4xl font-black text-amber-400">
                &lt; 1.2s
              </div>
              <p className="text-xs font-mono uppercase tracking-wider text-slate-400 mt-1">
                Voice-to-Relay Time
              </p>
            </div>

            <div>
              <div className="text-3xl sm:text-4xl font-black text-emerald-400">
                100%
              </div>
              <p className="text-xs font-mono uppercase tracking-wider text-slate-400 mt-1">
                Schema Invariance
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
