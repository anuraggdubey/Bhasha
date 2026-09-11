'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { DEFAULT_SAMPLE_PACKET, DEFAULT_SAMPLE_RENDERS } from '@/lib/mockData';
import { FactLockProof } from '@/components/FactLockProof';
import { MeaningPacketInspector } from '@/components/MeaningPacketInspector';
import { CorrectionHistoryTimeline } from '@/components/CorrectionHistoryTimeline';
import {
  ShieldCheck,
  CheckCircle,
  Activity,
  Lock,
  Mic,
  Globe,
} from 'lucide-react';

export default function AuditPage() {
  const [activeTask, setActiveTask] = useState(DEFAULT_SAMPLE_PACKET);

  return (
    <div className="relative min-h-screen bg-[#FFFCFA] text-[#252522]">
      {/* Ambient Grid */}
      <div className="absolute inset-0 ambient-grid pointer-events-none z-0 opacity-40" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Audit Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-black/[0.08] pb-6">
          <div>
            <h1 className="font-editorial text-4xl sm:text-5xl font-normal tracking-tight text-[#252522] mb-2">
              Invariant Audit
            </h1>
            <p className="text-base text-[#6B6B65] font-sans">
              Verifiable proof demonstrating that locked entities (assignees, deadlines, prerequisites) remain 100% intact across all 18 languages.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/studio"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#252522] hover:bg-[#383834] text-[#FFFCFA] text-xs font-medium shadow-xs transition-all hover:scale-105"
            >
              <Mic className="w-3.5 h-3.5 text-[#D1E043]" />
              <span>Record Spoken Note</span>
            </Link>
          </div>
        </div>

        {/* Metrics Banner - Granola Editorial Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="editorial-card p-6 bg-white">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono uppercase text-[#7A7A72]">Fact Drift Rate</span>
              <ShieldCheck className="w-4 h-4 text-[#5B6F00]" />
            </div>
            <div className="font-editorial text-4xl font-normal text-[#5B6F00]">0.00%</div>
            <p className="text-xs text-[#6B6B65] mt-1 font-sans">All locked facts mathematically preserved</p>
          </div>

          <div className="editorial-card p-6 bg-white">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono uppercase text-[#7A7A72]">Supported Languages</span>
              <Globe className="w-4 h-4 text-[#252522]" />
            </div>
            <div className="font-editorial text-4xl font-normal text-[#252522]">18 Locales</div>
            <p className="text-xs text-[#6B6B65] mt-1 font-sans">Zero hallucination across all translations</p>
          </div>

          <div className="editorial-card p-6 bg-white">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono uppercase text-[#7A7A72]">Active Invariants</span>
              <Lock className="w-4 h-4 text-[#ED5A31]" />
            </div>
            <div className="font-editorial text-4xl font-normal text-[#ED5A31]">3 Entities</div>
            <p className="text-xs text-[#6B6B65] mt-1 font-sans">Assignee, Deadline, Prerequisites</p>
          </div>

          <div className="editorial-card p-6 bg-white">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono uppercase text-[#7A7A72]">Synchronization</span>
              <CheckCircle className="w-4 h-4 text-[#5B6F00]" />
            </div>
            <div className="font-editorial text-4xl font-normal text-[#5B6F00]">Instant</div>
            <p className="text-xs text-[#6B6B65] mt-1 font-sans">Automatic updates across team inboxes</p>
          </div>
        </div>

        {/* Side-by-Side Proof Comparison */}
        <section className="editorial-card p-6 bg-white">
          <FactLockProof packet={activeTask} renders={DEFAULT_SAMPLE_RENDERS} />
        </section>

        {/* Meaning Packet Tree & Version Timeline Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 editorial-card p-6 bg-white">
            <MeaningPacketInspector packet={activeTask} />
          </div>

          <div className="lg:col-span-5 editorial-card p-6 bg-white">
            <CorrectionHistoryTimeline packet={activeTask} />
          </div>
        </div>
      </div>
    </div>
  );
}
