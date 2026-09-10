'use client';

import React from 'react';
import { MeaningPacket } from '@/types';
import { History, GitCommit, ArrowRight, Mic, CheckCircle2, Clock } from 'lucide-react';
import { LockBadge } from '@/components/ui/LockBadge';

interface RevisionEntry {
  version: number;
  timestamp: string;
  speaker: string;
  sourceText: string;
  changeSummary: string;
  lockedFieldChanged?: string;
  oldValue?: string;
  newValue?: string;
}

interface CorrectionHistoryTimelineProps {
  packet: MeaningPacket;
}

export const CorrectionHistoryTimeline: React.FC<CorrectionHistoryTimelineProps> = ({ packet }) => {
  // Generate audit trail based on current version
  const revisions: RevisionEntry[] = [
    {
      version: 1,
      timestamp: packet.created_at || new Date().toISOString(),
      speaker: 'Ananya (Manager)',
      sourceText: 'Kal Rahul deployment kare, but only after tests pass — deadline 4 PM.',
      changeSummary: 'Initial task created from spoken Hinglish instruction',
      lockedFieldChanged: 'Canonical Task Created',
      oldValue: 'N/A',
      newValue: 'Owner: Rahul | Deadline: Tomorrow, 4:00 PM IST',
    },
  ];

  if (packet.version > 1) {
    revisions.push({
      version: packet.version,
      timestamp: packet.updated_at || new Date().toISOString(),
      speaker: 'Rahul (Assignee / DevOps)',
      sourceText: 'Actually make that 5 PM, integration tests are taking longer.',
      changeSummary: 'Voice delta correction applied without touching owner or condition rules',
      lockedFieldChanged: 'locked_fields.deadline',
      oldValue: 'Tomorrow, 4:00 PM IST',
      newValue: packet.locked_fields.deadline || 'Tomorrow, 5:00 PM IST',
    });
  }

  return (
    <div className="w-full glass-panel rounded-2xl p-5 border border-slate-800 shadow-xl mb-6">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <History className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Audit Trail & Correction History
            </h4>
            <p className="text-[11px] text-slate-400">
              Live record of all spoken modifications and immutable packet version transitions
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 font-mono text-xs text-indigo-300 bg-indigo-950/50 px-2.5 py-1 rounded-full border border-indigo-700/50">
          <GitCommit className="w-3.5 h-3.5" />
          <span>{revisions.length} Revisions Recorded</span>
        </div>
      </div>

      <div className="space-y-4">
        {revisions.map((rev, idx) => (
          <div
            key={rev.version}
            className={`p-4 rounded-xl border transition-all ${
              idx === revisions.length - 1
                ? 'bg-slate-900/90 border-teal-500/40 shadow-[0_0_15px_rgba(20,184,166,0.1)]'
                : 'bg-slate-950/50 border-slate-800/80 opacity-75'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-slate-800 text-teal-300 border border-slate-700">
                  v{rev.version}.0
                </span>
                <span className="text-xs font-bold text-slate-200">{rev.speaker}</span>
                <span className="text-[10px] text-slate-500 font-mono">
                  {new Date(rev.timestamp).toLocaleTimeString()}
                </span>
              </div>

              {idx === revisions.length - 1 && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/30 self-start sm:self-center">
                  Active Canonical State
                </span>
              )}
            </div>

            <p className="text-xs text-slate-300 mb-2">
              <span className="text-slate-400 font-mono">Speech:</span> &quot;{rev.sourceText}&quot;
            </p>

            {rev.oldValue && rev.oldValue !== 'N/A' && (
              <div className="mt-2 pt-2 border-t border-slate-800/60 flex flex-wrap items-center gap-2 text-xs font-mono">
                <span className="text-slate-400">Delta Shift:</span>
                <span className="line-through text-rose-400 bg-rose-950/40 px-2 py-0.5 rounded border border-rose-800/50">
                  {rev.oldValue}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-teal-400" />
                <span className="text-amber-300 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800/50 font-bold">
                  {rev.newValue}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
