'use client';

import React, { useState } from 'react';
import { Info, X, Zap, Key } from 'lucide-react';

export const DemoModeBanner: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="relative z-20 mb-6 rounded-2xl bg-gradient-to-r from-teal-950/70 via-slate-900/80 to-indigo-950/70 border border-teal-500/30 p-4 shadow-xl backdrop-blur-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start sm:items-center gap-3">
          <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20 flex-shrink-0">
            <Zap className="w-4 h-4 text-teal-300 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-200">
                Interactive Showcase Mode Active
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Universal-3.5 Ready
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Live microphone dictation runs via AssemblyAI. If no API key is set in <code className="text-teal-300 font-mono">.env.local</code>, instant fallback simulation guarantees 100% demo uptime.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            onClick={() => setDismissed(true)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Dismiss notice"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
