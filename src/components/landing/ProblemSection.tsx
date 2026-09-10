'use client';

import React from 'react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { AlertOctagon, CheckCircle2, XCircle, ArrowRight, ShieldAlert, Cpu } from 'lucide-react';

export const ProblemSection: React.FC = () => {
  return (
    <section id="features" className="py-20 md:py-32 relative border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="The Problem vs Our Solution"
          badgeColor="amber"
          title="The Multilingual"
          highlightedTitle="Hand-off Trap."
          subtitle="When distributed engineering teams speak different languages, standard translation prompts degrade critical specifications. Here is why naive LLM translation fails."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Failure: Naive Translation */}
          <div className="rounded-3xl p-8 bg-gradient-to-b from-rose-950/20 to-slate-950/80 border border-rose-500/20 shadow-xl relative overflow-hidden">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400">
                <XCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Naive LLM Translation</h3>
                <p className="text-xs text-rose-300 font-mono">Unconstrained Prompt-based Translation</p>
              </div>
            </div>

            <p className="text-sm text-slate-300 mb-6 leading-relaxed">
              Standard translation prompts generate fluent prose, but treat exact operational constraints as disposable conversational tokens.
            </p>

            <ul className="space-y-4 text-xs text-slate-300">
              <li className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <AlertOctagon className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-rose-200 block mb-0.5">Deadline Inversion</strong>
                  <span>&quot;Deploy kal shaam tak&quot; gets loosely translated as &quot;deploy tomorrow&quot; — stripping the critical 4:00 PM cutoff time.</span>
                </div>
              </li>

              <li className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <AlertOctagon className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-rose-200 block mb-0.5">Entity Transliteration Drift</strong>
                  <span>Developer names, database schemas, and microservice keys get translated into local words, breaking ticket linkage.</span>
                </div>
              </li>

              <li className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <AlertOctagon className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-rose-200 block mb-0.5">Condition Evaporation</strong>
                  <span>&quot;Only if smoke tests pass&quot; gets omitted or converted into an optional suggestion, risking production outages.</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Solution: Bhasha Fact-Lock Engine */}
          <div className="rounded-3xl p-8 bg-gradient-to-b from-teal-950/30 via-slate-900/90 to-slate-950/80 border border-teal-500/30 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center gap-3 mb-6 relative z-10">
              <div className="p-3 rounded-2xl bg-teal-500/20 border border-teal-500/30 text-teal-400">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Bhasha Fact-Lock Engine</h3>
                <p className="text-xs text-teal-300 font-mono">Meaning Packet + Invariant Schema</p>
              </div>
            </div>

            <p className="text-sm text-slate-300 mb-6 leading-relaxed relative z-10">
              Bhasha separates semantic meaning from linguistic rendering. Facts are extracted into an immutable data packet before localized synthesis occurs.
            </p>

            <ul className="space-y-4 text-xs text-slate-300 relative z-10">
              <li className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-teal-500/40 transition-colors">
                <CheckCircle2 className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-teal-200 block mb-0.5">Immutable Invariant Fields</strong>
                  <span>Assignee, deadline timestamp, and blocker rules are sealed in an immutable JSON packet with 0% drift across every view.</span>
                </div>
              </li>

              <li className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-teal-500/40 transition-colors">
                <CheckCircle2 className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-teal-200 block mb-0.5">Native Code-Switching ASR</strong>
                  <span>Powered by AssemblyAI Universal-3.5 Pro to natively comprehend Hinglish, colloquial idioms, and background noise.</span>
                </div>
              </li>

              <li className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-teal-500/40 transition-colors">
                <CheckCircle2 className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-teal-200 block mb-0.5">Synchronized Voice Corrections</strong>
                  <span>Spoken delta changes (&quot;Make it 5 PM instead&quot;) update the central packet and push instant SSE sync to all teammates.</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
