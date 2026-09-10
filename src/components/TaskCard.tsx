'use client';

import React, { useState } from 'react';
import { RenderedCard, TeammateProfile } from '@/types';
import { Lock, Mic, CheckCircle2, ShieldCheck, Check, Clock, UserCheck } from 'lucide-react';
import { LockBadge } from '@/components/ui/LockBadge';

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
  const [confirmed, setConfirmed] = useState(false);

  // Flag map
  const flagMap: Record<string, string> = {
    en: '🇺🇸',
    hi: '🇮🇳',
    ja: '🇯🇵',
  };

  const handleConfirm = () => {
    setConfirmed(true);
    if (onConfirmTask) onConfirmTask();
  };

  return (
    <div className="glass-panel-interactive rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden border border-slate-800 hover:border-teal-500/40 transition-all duration-300 group">
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500/40 via-cyan-500/40 to-indigo-500/40 opacity-50 group-hover:opacity-100 transition-opacity" />

      {/* Teammate Header */}
      <div>
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl p-2 rounded-xl bg-slate-800/80 shadow-inner flex-shrink-0">
              {teammate.avatar}
            </span>
            <div>
              <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                {teammate.name}
                {teammate.is_current_sender && (
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                    Speaker
                  </span>
                )}
              </h4>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                <span>{flagMap[teammate.preferred_language] || '🌐'}</span>
                <span>{teammate.language_label}</span>
                <span className="text-slate-600">•</span>
                <span className="text-slate-400">{teammate.role}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] font-mono text-emerald-400 shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[10px] font-semibold">Locked</span>
          </div>
        </div>

        {/* Localized Content */}
        {card ? (
          <div className="space-y-4">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-teal-400/90 flex items-center justify-between">
                <span>Localized View</span>
                <span className="text-slate-500 lowercase">({card.language_code})</span>
              </span>
              <h5 className="text-base font-bold text-slate-100 mt-1 leading-snug">
                {card.rendered_headline}
              </h5>
              <div className="text-sm text-slate-300 mt-2.5 leading-relaxed bg-slate-900/60 p-3.5 rounded-xl border border-slate-800/80 shadow-inner">
                {card.rendered_body}
              </div>
            </div>

            {/* Invariant Locked Attributes */}
            <div className="space-y-2 pt-1">
              <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-slate-400 flex items-center gap-1.5">
                <Lock className="w-3 h-3 text-amber-400" />
                Locked Attributes (0% Drift)
              </span>

              <div className="grid grid-cols-1 gap-2 text-xs">
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800/90">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
                    Owner:
                  </span>
                  <LockBadge color="cyan">
                    {card.displayed_locked_fields.owner}
                  </LockBadge>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800/90">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    Deadline:
                  </span>
                  <LockBadge color="amber">
                    {card.displayed_locked_fields.deadline}
                  </LockBadge>
                </div>

                {card.displayed_locked_fields.conditions.length > 0 && (
                  <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/90">
                    <span className="text-slate-400 block mb-1">Strict Condition:</span>
                    {card.displayed_locked_fields.conditions.map((cond, idx) => (
                      <LockBadge key={idx} color="emerald" className="block text-[11px] py-1 truncate">
                        {cond}
                      </LockBadge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-slate-500 text-sm flex flex-col items-center justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-slate-700 border-t-teal-500 animate-spin mb-2" />
            <span>Waiting for task broadcast...</span>
          </div>
        )}
      </div>

      {/* Action footer */}
      {card && (
        <div className="mt-6 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-3">
          <button
            onClick={() => onOpenCorrection(teammate)}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all hover:border-teal-500/50 hover:text-white"
          >
            <Mic className="w-3.5 h-3.5 text-teal-400" />
            Voice Correct
          </button>

          <button
            onClick={handleConfirm}
            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold shadow-sm transition-all ${
              confirmed
                ? 'bg-emerald-600 text-white cursor-default'
                : 'bg-teal-600 hover:bg-teal-500 text-white hover:scale-[1.02]'
            }`}
          >
            {confirmed ? (
              <>
                <Check className="w-3.5 h-3.5" />
                Confirmed
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                Confirm Task
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
