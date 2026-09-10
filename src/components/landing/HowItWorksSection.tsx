'use client';

import React from 'react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Mic, Waves, Cpu, ShieldCheck, Languages, Radio, ArrowRight, ArrowDown } from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Speech Ingestion',
      category: 'AssemblyAI Universal-3.5 Pro',
      description:
        'A team member speaks in natural conversational dialect (Hinglish, mixed English/Hindi, or slang). AssemblyAI models transcribe verbatim audio with extreme phonetic fidelity.',
      icon: Mic,
      tag: 'Universal-3.5 Pro',
      color: 'teal',
    },
    {
      step: '02',
      title: 'Semantic Decomposition',
      category: 'Structured Intent Extraction',
      description:
        'The raw speech stream is parsed into a canonical Meaning Packet AST: isolating the core intent, invariant owner, execution constraints, and strict deadline dates.',
      icon: Cpu,
      tag: 'Zod + LLM Schema',
      color: 'cyan',
    },
    {
      step: '03',
      title: 'Fact-Lock Guarding',
      category: 'Zero Drift Invariants',
      description:
        'Owner names, timestamps, and deployment conditions are mathematically sealed as immutable facts. No downstream localized synthesis is permitted to mutate or drop them.',
      icon: ShieldCheck,
      tag: '0% Drift Assurance',
      color: 'amber',
    },
    {
      step: '04',
      title: 'Synchronized Multilingual Relay',
      category: 'Real-time Event Broadcast',
      description:
        'The canonical packet is rendered into localized cultural views (English, Hindi Devanagari, Japanese Kanji) and broadcasted instantly to every teammate screen via SSE.',
      icon: Radio,
      tag: 'Server-Sent Events',
      color: 'emerald',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 md:py-32 relative border-t border-slate-800/80 bg-slate-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="System Architecture"
          badgeColor="teal"
          title="How Bhasha Solves"
          highlightedTitle="The Relay Pipeline."
          subtitle="Four coordinated layers that transform chaotic spoken instructions into rock-solid, synchronized cross-cultural execution."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto relative">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="glass-panel-interactive rounded-3xl p-6 flex flex-col justify-between border border-slate-800 hover:border-teal-500/40 relative group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black font-mono text-slate-700 group-hover:text-teal-400/80 transition-colors">
                      {item.step}
                    </span>
                    <div className="w-10 h-10 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <span className="text-[10px] font-mono uppercase tracking-wider text-teal-300 font-semibold block mb-1">
                    {item.category}
                  </span>
                  <h4 className="text-lg font-bold text-white mb-2">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-900 text-slate-400 border border-slate-800">
                    {item.tag}
                  </span>
                  {index < 3 && (
                    <ArrowRight className="hidden lg:block w-4 h-4 text-slate-600 group-hover:text-teal-400 group-hover:translate-x-1 transition-all" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
