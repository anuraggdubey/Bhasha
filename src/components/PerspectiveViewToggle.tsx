'use client';

import React from 'react';
import { Columns3, Mic, UserCheck, ShieldCheck, Eye } from 'lucide-react';

export type DashboardViewMode = 'split' | 'sender' | 'receiver' | 'proof';

interface PerspectiveViewToggleProps {
  currentMode: DashboardViewMode;
  onModeChange: (mode: DashboardViewMode) => void;
}

export const PerspectiveViewToggle: React.FC<PerspectiveViewToggleProps> = ({
  currentMode,
  onModeChange,
}) => {
  const modes = [
    {
      id: 'split' as DashboardViewMode,
      label: 'Multi-Perspective Relay',
      sublabel: 'Split-Screen (Hindi, Japanese, English)',
      icon: Columns3,
    },
    {
      id: 'sender' as DashboardViewMode,
      label: 'Manager Dispatch',
      sublabel: 'Speech Ingestion & Pre-Broadcast',
      icon: Mic,
    },
    {
      id: 'receiver' as DashboardViewMode,
      label: 'Teammate Receiver',
      sublabel: 'Native View & Voice Correction',
      icon: UserCheck,
    },
    {
      id: 'proof' as DashboardViewMode,
      label: 'Fact-Lock Proof',
      sublabel: '0% Drift Matrix & JSON AST',
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="w-full flex items-center gap-2 p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg overflow-x-auto mb-6">
      {modes.map((mode) => {
        const Icon = mode.icon;
        const isActive = currentMode === mode.id;

        return (
          <button
            key={mode.id}
            onClick={() => onModeChange(mode.id)}
            className={`flex-1 min-w-[160px] flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
              isActive
                ? 'bg-gradient-to-r from-teal-500/20 to-emerald-500/20 text-teal-300 border border-teal-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
            }`}
          >
            <div
              className={`p-1.5 rounded-lg ${
                isActive ? 'bg-teal-500/20 text-teal-300' : 'bg-slate-800 text-slate-400'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
            </div>
            <div className="text-left overflow-hidden">
              <div className="font-bold truncate">{mode.label}</div>
              <div className="text-[10px] text-slate-400 font-normal truncate hidden sm:block">
                {mode.sublabel}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};
