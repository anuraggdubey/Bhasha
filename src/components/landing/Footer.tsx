'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Mic, ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-slate-800/80 bg-[#060a12] py-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 text-slate-950 font-black text-lg shadow-lg shadow-teal-500/20">
              B
            </div>
            <div>
              <span className="text-lg font-bold text-white tracking-tight">Bhasha</span>
              <p className="text-xs text-slate-400">
                One Meaning, Every Language • Voice-First Task Orchestration
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-slate-400 font-medium">
            <Link href="/#features" className="hover:text-teal-300 transition-colors">
              Features
            </Link>
            <Link href="/#how-it-works" className="hover:text-teal-300 transition-colors">
              How it Works
            </Link>
            <Link href="/#comparison" className="hover:text-teal-300 transition-colors">
              Zero Drift Proof
            </Link>
            <Link href="/#tech-stack" className="hover:text-teal-300 transition-colors">
              Architecture
            </Link>
            <Link href="/dashboard" className="text-teal-400 hover:text-teal-300 font-bold transition-colors">
              Launch Demo →
            </Link>
          </div>

          <button
            onClick={scrollToTop}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-all text-xs flex items-center gap-1.5"
            title="Scroll to top"
          >
            <ArrowUp className="w-4 h-4" />
            <span>Top</span>
          </button>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            <strong className="text-slate-300">Bhasha</strong> — Enterprise Voice-First Task Orchestration Engine.
          </p>
          <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Universal-3.5 Pro Streaming Dictation</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
