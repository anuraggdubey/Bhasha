'use client';

import React from 'react';
import { Mic, ShieldCheck, Globe, Check } from 'lucide-react';

interface PipelineVisualizerProps {
  isProcessing: boolean;
  currentStep?: number;
}

export const PipelineVisualizer: React.FC<PipelineVisualizerProps> = ({
  isProcessing,
}) => {
  const steps = [
    {
      id: 1,
      label: 'Spoken Voice Note',
      desc: 'Speech transcription',
      icon: Mic,
    },
    {
      id: 2,
      label: 'Invariant Fact Locks',
      desc: 'Owner, deadline & prerequisites',
      icon: ShieldCheck,
    },
    {
      id: 3,
      label: '18-Language Relay',
      desc: 'Zero-drift delivery',
      icon: Globe,
    },
  ];

  return (
    <div className="w-full editorial-card-oats p-4 mb-6 border border-black/[0.06] bg-[#F7F7F2]">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div
              key={step.id}
              className="flex items-center gap-3 p-3 rounded-xl bg-white border border-black/[0.04] shadow-xs"
            >
              <div className="w-8 h-8 rounded-full bg-[#F7F7F2] border border-black/[0.06] flex items-center justify-center text-[#252522] flex-shrink-0">
                <Icon className="w-4 h-4 text-[#252522]" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#252522] truncate">
                    {step.label}
                  </span>
                  {idx === 0 && isProcessing && (
                    <span className="w-2 h-2 rounded-full bg-[#ED5A31] animate-ping" />
                  )}
                  {idx < 2 && !isProcessing && (
                    <Check className="w-3.5 h-3.5 text-[#5B6F00]" />
                  )}
                </div>
                <p className="text-[11px] text-[#7A7A72] truncate font-sans">
                  {step.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
