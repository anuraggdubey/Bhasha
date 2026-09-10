'use client';

import React, { useState } from 'react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ShieldCheck, Lock, CheckCircle2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const ComparisonSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'hindi' | 'japanese' | 'english'>('hindi');

  const renders = {
    hindi: {
      lang: 'Hindi (Devanagari)',
      recipient: 'Rahul (Engineer, India)',
      flag: '🇮🇳',
      headline: 'ऑथ मॉड्यूल का परिनियोजन (Deployment)',
      body: 'कृपया प्रमाणीकरण (auth) मॉड्यूल को कल शाम 4:00 PM तक प्रोडक्शन में डिप्लॉय करें। ध्यान रहे कि सभी यूनिट और इंटीग्रेशन टेस्ट पास होने के बाद ही डिप्लॉय करना है।',
      owner: 'Rahul (राहुल)',
      deadline: 'कल शाम 4:00 PM',
      condition: 'टेस्ट पास होने के बाद ही',
    },
    japanese: {
      lang: 'Japanese (日本語)',
      recipient: 'Kenji (SRE Lead, Tokyo)',
      flag: '🇯🇵',
      headline: '認証モジュールの本番デプロイ',
      body: '明日16:00（JST）までに認証モジュールをステージングから本番環境へ移行してください。前提条件として、自動テスト全件合格が必須となります。',
      owner: 'Rahul',
      deadline: '明日 16:00',
      condition: 'テスト合格後のみ',
    },
    english: {
      lang: 'English (Product View)',
      recipient: 'Ananya (Product Manager, SF)',
      flag: '🇺🇸',
      headline: 'Deploy Authentication Module',
      body: 'Coordinate with engineering to push the authentication module to production by tomorrow at 4:00 PM. Blocker condition: All unit and integration test suites must pass first.',
      owner: 'Rahul',
      deadline: 'Tomorrow 4:00 PM',
      condition: 'Only after tests pass',
    },
  };

  const current = renders[activeTab];

  return (
    <section id="comparison" className="py-20 md:py-32 relative border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Live Proof Matrix"
          badgeColor="emerald"
          title="Zero Fact Drift"
          highlightedTitle="Across Three Cultures."
          subtitle="One Hinglish voice command rendered into Hindi, Japanese, and English. The natural prose adapts to each culture, while every operational constraint remains locked."
        />

        {/* The Spoken Input Bar */}
        <div className="max-w-4xl mx-auto mb-10 p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-teal-500/30 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20 font-mono text-xs font-bold">
              AUDIO
            </span>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-teal-300 font-bold block">
                Spoken Hinglish Input
              </span>
              <p className="text-sm font-medium text-slate-200">
                &quot;Rahul ko bolo auth module kal 4 baje tak deploy kare, lekin tests pass hone ke baad hi.&quot;
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-400 self-end sm:self-center flex-shrink-0">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Fact Invariants Locked</span>
          </div>
        </div>

        {/* Interactive Comparison Card */}
        <div className="max-w-4xl mx-auto glass-panel-elevated rounded-3xl p-6 md:p-8 border border-slate-800 shadow-2xl">
          {/* Language Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-800 pb-4 mb-6 overflow-x-auto">
            <button
              onClick={() => setActiveTab('hindi')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'hindi'
                  ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              <span>🇮🇳</span>
              <span>Hindi View (Rahul)</span>
            </button>

            <button
              onClick={() => setActiveTab('japanese')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'japanese'
                  ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              <span>🇯🇵</span>
              <span>Japanese View (Kenji)</span>
            </button>

            <button
              onClick={() => setActiveTab('english')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'english'
                  ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              <span>🇺🇸</span>
              <span>English View (Ananya)</span>
            </button>
          </div>

          {/* Active Tab View Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                  <span>Recipient:</span>
                  <strong className="text-slate-200">{current.recipient}</strong>
                </div>
                <h4 className="text-xl font-bold text-white leading-snug">
                  {current.headline}
                </h4>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 text-sm text-slate-200 leading-relaxed">
                {current.body}
              </div>
            </div>

            {/* Invariant Facts Verification Box */}
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-teal-500/25 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                  <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Lock className="w-3 h-3 text-amber-400" />
                    Locked Facts
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400">VERIFIED</span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] font-mono uppercase">Assignee</span>
                    <span className="text-cyan-300 font-bold">{current.owner}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px] font-mono uppercase">Deadline</span>
                    <span className="text-amber-300 font-bold">{current.deadline}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px] font-mono uppercase">Blocker Rule</span>
                    <span className="text-emerald-300 font-bold">{current.condition}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 inline mr-1" />
                Zero deviation from canonical Meaning Packet.
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-400">
              Want to speak your own custom voice commands and watch all 3 views update?
            </p>

            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-teal-500 hover:bg-teal-400 text-slate-950 shadow-md shadow-teal-500/20 transition-all hover:scale-105"
            >
              <span>Test Voice Relay in Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
