'use client';

import React from 'react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Cpu, Terminal, Radio, Shield, Sparkles, Layers } from 'lucide-react';

export const TechStackSection: React.FC = () => {
  const technologies = [
    {
      name: 'AssemblyAI Universal-3.5 Pro',
      role: 'Speech Recognition & Dictation',
      detail:
        'Handles code-switching, technical jargon, accents, and noisy acoustic streams with ultra-low word error rate.',
      badge: 'Core Voice AI',
    },
    {
      name: 'Next.js 14 App Router',
      role: 'Full-Stack Architecture',
      detail:
        'Server components, edge-ready API routes, and optimized client-side hydration for maximum responsiveness.',
      badge: 'Framework',
    },
    {
      name: 'Server-Sent Events (SSE)',
      role: 'Real-time Synchronized Relay',
      detail:
        'Unidirectional live event stream powering synchronized split-screen team views with instant delta voice correction.',
      badge: 'Real-time',
    },
    {
      name: 'Zod Runtime Schema',
      role: 'Deterministic Meaning Packet Validation',
      detail:
        'Strict TypeScript type inference ensuring that LLM structured outputs strictly conform to invariant entity contracts.',
      badge: 'Reliability',
    },
    {
      name: 'Web Audio API',
      role: 'Real-time Audio Visualizer',
      detail:
        'In-browser 64-point FFT analyzer drawing high-fidelity 60fps canvas soundwaves during voice capture.',
      badge: 'Client Audio',
    },
    {
      name: 'OpenAI GPT-4o-mini',
      role: 'Meaning Extraction & Cultural Synthesis',
      detail:
        'Transforms conversational transcripts into structured canonical packets and localized cultural dialect phrasing.',
      badge: 'Reasoning Engine',
    },
  ];



  return (
    <section id="tech-stack" className="py-20 md:py-32 relative border-t border-slate-800/80 bg-slate-950/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Enterprise Infrastructure"
          badgeColor="indigo"
          title="Engineered for Production"
          highlightedTitle="& Global Scale."
          subtitle="A resilient multi-layer architecture integrating high-throughput speech recognition, deterministic schema validation, and real-time event streaming."
        />

        {/* Technologies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {technologies.map((tech) => (
            <div
              key={tech.name}
              className="glass-panel-interactive rounded-2xl p-6 border border-slate-800 hover:border-indigo-500/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 font-semibold">
                    {tech.badge}
                  </span>
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                </div>
                <h4 className="text-base font-bold text-white mb-1">{tech.name}</h4>
                <p className="text-xs font-mono text-teal-400 mb-2">{tech.role}</p>
                <p className="text-xs text-slate-300 leading-relaxed">{tech.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
