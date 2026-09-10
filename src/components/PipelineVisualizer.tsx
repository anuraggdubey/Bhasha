'use client';

import React, { useState, useEffect } from 'react';
import { Mic, Waves, Cpu, ShieldCheck, Languages, Radio, CheckCircle2, ChevronRight } from 'lucide-react';

interface PipelineVisualizerProps {
  isProcessing: boolean;
  currentStep?: number;
}

interface StepItem {
  id: number;
  label: string;
  sublabel: string;
  icon: React.ComponentType<{ className?: string }>;
  tech: string;
  color: string;
}

export const PipelineVisualizer: React.FC<PipelineVisualizerProps> = ({
  isProcessing,
  currentStep = 0,
}) => {
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);

  useEffect(() => {
    if (isProcessing) {
      const interval = setInterval(() => {
        setActiveStepIndex((prev) => (prev + 1) % 6);
      }, 500);
      return () => clearInterval(interval);
    } else {
      setActiveStepIndex(5); // Completed state
    }
  }, [isProcessing]);

  const steps: StepItem[] = [
    {
      id: 1,
      label: 'Speech Input',
      sublabel: 'Raw code-switch audio',
      icon: Mic,
      tech: 'Web Audio API',
      color: 'teal',
    },
    {
      id: 2,
      label: 'ASR Dictation',
      sublabel: 'Universal-3.5 Pro',
      icon: Waves,
      tech: 'AssemblyAI API',
      color: 'emerald',
    },
    {
      id: 3,
      label: 'Meaning Extraction',
      sublabel: 'Intent & Entity Schema',
      icon: Cpu,
      tech: 'Zod + LLM',
      color: 'cyan',
    },
    {
      id: 4,
      label: 'Fact-Lock Guard',
      sublabel: 'Owner, Date, Rules',
      icon: ShieldCheck,
      tech: 'Invariant Validator',
      color: 'amber',
    },
    {
      id: 5,
      label: 'Native Rendering',
      sublabel: 'Contextual Nuances',
      icon: Languages,
      tech: 'Parallel Synthesis',
      color: 'indigo',
    },
    {
      id: 6,
      label: 'Split-Screen Relay',
      sublabel: 'Synchronized Team',
      icon: Radio,
      tech: 'Server-Sent Events',
      color: 'teal',
    },
  ];

  return (
    <div className="w-full glass-panel rounded-2xl p-5 border border-slate-800/90 shadow-xl relative overflow-hidden mb-6">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-400">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Live Orchestration Pipeline
            </h3>
            <p className="text-[11px] text-slate-400">
              From continuous multilingual speech stream to zero-drift localized execution
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isProcessing ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-mono text-teal-400 bg-teal-950/60 px-2.5 py-1 rounded-full border border-teal-700/50">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
              Streaming Pipeline Active
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-700/40">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Synchronized & Ready
            </span>
          )}
        </div>
      </div>

      {/* Pipeline Steps Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 relative">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isActive = isProcessing && activeStepIndex === idx;
          const isDone = !isProcessing || activeStepIndex > idx;

          return (
            <div
              key={step.id}
              className={`relative rounded-xl p-3 flex flex-col justify-between border transition-all duration-300 ${
                isActive
                  ? 'bg-teal-950/40 border-teal-400/80 shadow-[0_0_20px_rgba(20,184,166,0.3)] scale-[1.02]'
                  : isDone
                  ? 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  : 'bg-slate-950/30 border-slate-900/60 opacity-60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono text-slate-500 font-bold">
                    0{step.id}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                      isActive
                        ? 'bg-teal-500 text-slate-950 shadow-md'
                        : isDone
                        ? 'bg-slate-800 text-teal-300'
                        : 'bg-slate-900 text-slate-500'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                </div>

                <h4 className="text-xs font-bold text-slate-200 truncate">
                  {step.label}
                </h4>
                <p className="text-[11px] text-slate-400 truncate mt-0.5">
                  {step.sublabel}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between">
                <span className="text-[9px] font-mono text-slate-400 bg-slate-950/60 px-1.5 py-0.5 rounded border border-slate-800">
                  {step.tech}
                </span>
                {idx < 5 && (
                  <ChevronRight className="hidden lg:block w-3 h-3 text-slate-600 -mr-1" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
