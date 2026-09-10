'use client';

import React from 'react';
import { RenderedCard, TeammateProfile } from '@/types';
import { Lock, Mic, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

interface TaskCardProps {
  teammate: TeammateProfile;
  card?: RenderedCard;
  rawTranscript?: string;
  onOpenCorrection: (teammate: TeammateProfile) => void;
  onConfirmTask?: () => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  teammate,
  card,
  rawTranscript,
  onOpenCorrection,
  onConfirmTask,
}) => {
  return (
    <div className="glass-panel-interactive rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden border border-slate-800">
      {/* Teammate Header */}
      <div>
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl p-2 rounded-xl bg-slate-800/80 shadow-inner">
              {teammate.avatar}
            </span>
            <div>
              <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                {teammate.name}
                {teammate.is_current_sender && (
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                    Sender
                  </span>
                )}
              </h4>
              <span className="text-xs text-slate-400 font-medium">
                {teammate.role} • {teammate.language_label}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-700/60 text-[11px] font-mono text-slate-300">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>Fact-Locked</span>
          </div>
        </div>

        {/* Localized Content */}
        {card ? (
          <div className="space-y-4">
            <div>
              <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400">
                Action / कार्य / タスク
              </span>
              <h5 className="text-base font-semibold text-slate-200 mt-0.5">
                {card.rendered_headline}
              </h5>
              <p className="text-sm text-slate-300 mt-2 leading-relaxed bg-slate-900/40 p-3 rounded-xl border border-slate-800/80">
                {card.rendered_body}
              </p>
            </div>

            {/* Locked Attributes Inspection */}
            <div className="space-y-2 pt-1">
              <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400 flex items-center gap-1">
                <Lock className="w-3 h-3 text-amber-400" />
                Locked Facts (Invariant Across Views)
              </span>

              <div className="grid grid-cols-1 gap-2 text-xs">
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-400">Owner:</span>
                  <span className="locked-badge-cyan">
                    <Lock className="w-2.5 h-2.5" />
                    {card.displayed_locked_fields.owner}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-400">Deadline:</span>
                  <span className="locked-badge">
                    <Lock className="w-2.5 h-2.5" />
                    {card.displayed_locked_fields.deadline}
                  </span>
                </div>

                {card.displayed_locked_fields.conditions.length > 0 && (
                  <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                    <span className="text-slate-400 block mb-1">Condition:</span>
                    {card.displayed_locked_fields.conditions.map((cond, idx) => (
                      <span key={idx} className="locked-badge-emerald block text-[11px] py-1">
                        <Lock className="w-2.5 h-2.5 inline mr-1" />
                        {cond}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-10 text-slate-500 text-sm">
            Waiting for spoken task from manager...
          </div>
        )}
      </div>

      {/* Action footer */}
      {card && (
        <div className="mt-6 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-3">
          <button
            onClick={() => onOpenCorrection(teammate)}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all hover:border-teal-500/50"
          >
            <Mic className="w-3.5 h-3.5 text-teal-400" />
            Voice Correct
          </button>

          <button
            onClick={onConfirmTask}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-teal-600 hover:bg-teal-500 text-white shadow-sm transition-all"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Confirm Task
          </button>
        </div>
      )}
    </div>
  );
};
