'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, Github, Twitter, FileText } from 'lucide-react';
import { BhashaLogo } from '@/components/BhashaLogo';
import Mascot from '@/components/Mascot';

export default function Footer() {
  const GITHUB_REPO = 'https://github.com/anuraggdubey/Bhasha';
  const TWITTER_URL = 'https://x.com/anuraggdubeyy';
  const DOCS_URL = 'https://github.com/anuraggdubey/Bhasha/blob/main/bhasha-documentation.md';

  return (
    <footer className="mt-32 border-t border-black/[0.08] bg-[#F7F7F2] text-[#252522] overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        {/* Footer Top Brand Header & Quick External Channels */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-12 mb-16 border-b border-black/[0.06]">
          <div>
            <Link href="/" className="group inline-block mb-2">
              <BhashaLogo size={36} showText={true} />
            </Link>
            <p className="text-xs text-[#6B6B65] max-w-md font-sans">
              Spoken voice notes rendered into 18 world languages with zero fact drift.
            </p>
          </div>

          {/* Direct Social & Documentation Badges */}
          <div className="flex flex-wrap items-center gap-2.5">
            <a
              href={GITHUB_REPO}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white hover:bg-[#F2F2EC] border border-black/[0.08] text-xs font-medium text-[#252522] transition-all hover:border-black/[0.18] shadow-2xs"
            >
              <Github className="w-3.5 h-3.5" />
              <span>GitHub</span>
              <ArrowUpRight className="w-3 h-3 text-[#7A7A72]" />
            </a>

            <a
              href={TWITTER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white hover:bg-[#F2F2EC] border border-black/[0.08] text-xs font-medium text-[#252522] transition-all hover:border-black/[0.18] shadow-2xs"
            >
              <Twitter className="w-3.5 h-3.5 text-[#1DA1F2]" />
              <span>Twitter / X</span>
              <ArrowUpRight className="w-3 h-3 text-[#7A7A72]" />
            </a>

            <a
              href={DOCS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white hover:bg-[#F2F2EC] border border-black/[0.08] text-xs font-medium text-[#252522] transition-all hover:border-black/[0.18] shadow-2xs"
            >
              <FileText className="w-3.5 h-3.5 text-[#5B6F00]" />
              <span>Documentation</span>
              <ArrowUpRight className="w-3 h-3 text-[#7A7A72]" />
            </a>
          </div>
        </div>

        {/* Navigation Columns - Granola Style */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 lg:gap-16 mb-20">
          {/* Column 1: Product */}
          <div className="flex flex-col gap-3">
            <h4 className="font-editorial text-2xl text-[#252522] tracking-tight">
              Product
            </h4>
            <ul className="flex flex-col gap-2.5 text-sm text-[#6B6B65] font-sans">
              <li>
                <Link href="/studio" className="hover:text-[#252522] transition-colors flex items-center gap-1 group">
                  Voice Studio
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link href="/team" className="hover:text-[#252522] transition-colors flex items-center gap-1 group">
                  Team Relay
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link href="/audit" className="hover:text-[#252522] transition-colors flex items-center gap-1 group">
                  Invariant Audit
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-[#252522] transition-colors flex items-center gap-1 group">
                  Overview
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Developers & Docs */}
          <div className="flex flex-col gap-3">
            <h4 className="font-editorial text-2xl text-[#252522] tracking-tight">
              Developers &amp; Docs
            </h4>
            <ul className="flex flex-col gap-2.5 text-sm text-[#6B6B65] font-sans">
              <li>
                <a
                  href={DOCS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#252522] transition-colors flex items-center gap-1.5 group"
                >
                  <FileText className="w-3.5 h-3.5 text-[#5B6F00]" />
                  <span>Documentation</span>
                  <ArrowUpRight className="w-3 h-3 opacity-60 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
              <li>
                <a
                  href={GITHUB_REPO}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#252522] transition-colors flex items-center gap-1.5 group"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>GitHub Repository</span>
                  <ArrowUpRight className="w-3 h-3 opacity-60 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
              <li>
                <a
                  href={TWITTER_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#252522] transition-colors flex items-center gap-1.5 group"
                >
                  <Twitter className="w-3.5 h-3.5 text-[#1DA1F2]" />
                  <span>Twitter / X</span>
                  <ArrowUpRight className="w-3 h-3 opacity-60 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
              <li className="text-xs text-[#7A7A72] pt-1">
                Zero-drift multilingual communication engine.
              </li>
            </ul>
          </div>

          {/* Column 3: 18 Languages */}
          <div className="flex flex-col gap-3">
            <h4 className="font-editorial text-2xl text-[#252522] tracking-tight">
              18 Languages
            </h4>
            <ul className="flex flex-col gap-2.5 text-sm text-[#6B6B65] font-sans">
              <li>
                <span className="text-[#252522] font-medium">Global Locales:</span>
              </li>
              <li className="text-xs text-[#7A7A72] leading-relaxed">
                Hindi (हिन्दी), English (US/UK), Japanese (日本語), Spanish (Español), French (Français), German (Deutsch), Mandarin (中文), Korean (한국어), Portuguese, Italian, Dutch, Russian, Turkish, Arabic, Polish, Ukrainian, Vietnamese, Indonesian.
              </li>
              <li>
                <Link href="/studio" className="text-xs text-[#5B6F00] hover:underline font-medium inline-flex items-center gap-1">
                  Try Language Dropdown →
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Trust & Truth */}
          <div className="flex flex-col gap-3">
            <h4 className="font-editorial text-2xl text-[#252522] tracking-tight">
              Trust &amp; Truth
            </h4>
            <ul className="flex flex-col gap-2.5 text-sm text-[#6B6B65] font-sans">
              <li>
                <span className="text-[#6B6B65]">Zero Translation Drift</span>
              </li>
              <li>
                <span className="text-[#6B6B65]">Immutable Fact Locks</span>
              </li>
              <li>
                <span className="text-[#6B6B65]">Spoken Voice Corrections</span>
              </li>
              <li>
                <span className="text-[#6B6B65]">Deterministic Invariants</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Giant Architectural Wordmark & Brandmark */}
        <div className="w-full pt-16 pb-6 select-none flex flex-col items-center justify-center relative">
          <div className="opacity-[0.20] mb-4 pointer-events-none">
            <BhashaLogo size={64} showText={false} />
          </div>
          <div className="flex font-editorial font-black text-[clamp(80px,18vw,280px)] tracking-[-0.04em] text-[#252522] opacity-[0.14] hover:opacity-25 transition-opacity leading-none pointer-events-none mt-4">
            {'BHASHA'.split('').map((letter, idx) => (
              <span 
                key={idx} 
                className={`inline-block animate-fade-in ${idx === 0 ? 'relative' : ''}`}
                style={{ animationDelay: `${idx * 150}ms`, animationFillMode: 'both' }}
              >
                {letter}
                {idx === 0 && (
                  <span className="absolute -top-[60%] left-1/2 -translate-x-1/2 opacity-100 pointer-events-none" style={{ filter: 'none', opacity: 1 }}>
                    <Mascot color="purple" size={90} />
                  </span>
                )}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom copyright bar with direct interactive links */}
        <div className="pt-8 border-t border-black/[0.06] flex flex-col sm:flex-row items-center justify-between text-xs text-[#7A7A72] font-sans gap-4">
          <p>© 2026 Bhasha System Inc. Voice-first task handoff for multilingual teams.</p>
          <div className="flex items-center gap-6">
            <a
              href={GITHUB_REPO}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#252522] transition-colors flex items-center gap-1.5"
            >
              <Github className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </a>

            <a
              href={TWITTER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#252522] transition-colors flex items-center gap-1.5"
            >
              <Twitter className="w-3.5 h-3.5 text-[#1DA1F2]" />
              <span>Twitter / X</span>
            </a>

            <a
              href={DOCS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#252522] transition-colors flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5 text-[#5B6F00]" />
              <span>Documentation</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
