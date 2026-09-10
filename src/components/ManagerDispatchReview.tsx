'use client';

import React from 'react';
import { MeaningPacket } from '@/types';
import { ShieldCheck, Send, Edit3, Lock, CheckCircle, Clock, AlertTriangle, ArrowRight } from 'lucide-react';
import { LockBadge } from '@/components/ui/LockBadge';

interface ManagerDispatchReviewProps {
  packet: MeaningPacket;
  onConfirmDispatch: () => void;
  isDispatched: boolean;
  onOpenVoiceCorrection: () => void;
}

export const ManagerDispatchReview: React.FC<ManagerDispatchReviewProps> = ({
  packet,
  onConfirmDispatch,
  isDispatched,
  onOpenVoiceCorrection,
}) => {
  return (
    <div className="w-full glass-panel-elevated rounded-2xl p-5 border border-teal-500/30 shadow-2xl relative overflow-hidden mb-6">
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-800 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-teal-500/15 border border-teal-500/30 text-teal-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Manager Dispatch Station (Sender Review)
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/30">
                Pre-Broadcast Gate
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Review extracted meaning and verify locked invariants before broadcasting to multilingual team relay.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isDispatched ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/60 text-emerald-300 border border-emerald-700/60 shadow-sm">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              Broadcasted to All Relays
            </span>
          ) : (
            <button
              onClick={onConfirmDispatch}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-teal-500 to-emerald-400 hover:from-teal-400 hover:to-emerald-300 text-slate-950 shadow-lg shadow-teal-500/20 transition-all hover:scale-105"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Broadcast to Team</span>
            </button>
          )}
        </div>
      </div>

      {/* Raw Speech vs Meaning AST */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 relative z-10">
        {/* Spoken Transcript */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block mb-1">
            Raw Spoken Input
          </span>
          <p className="text-xs font-medium text-slate-200 italic leading-relaxed">
            &quot;{packet.raw_transcript}&quot;
          </p>
          <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>Detected: {packet.detected_languages?.join(', ') || 'Hinglish'}</span>
            <span className="text-teal-400 font-mono">v{packet.version}</span>
          </div>
        </div>

        {/* Core Extracted Task */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block mb-1">
            Canonical Action
          </span>
          <p className="text-xs font-bold text-teal-300">
            {packet.action}
          </p>
          <p className="text-[11px] text-slate-400 mt-2">
            Status: <span className="text-amber-300 font-mono font-semibold capitalize">{packet.status.replace('_', ' ')}</span>
          </p>
        </div>

        {/* Locked Invariants Summary */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-teal-500/25">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 flex items-center gap-1">
              <Lock className="w-3 h-3 text-amber-400" />
              Locked Invariants
            </span>
            <button
              onClick={onOpenVoiceCorrection}
              className="text-[11px] text-teal-300 hover:text-teal-200 underline font-medium flex items-center gap-1"
            >
              <Edit3 className="w-3 h-3" />
              Voice Delta
            </button>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Assignee:</span>
              <LockBadge color="cyan">{packet.locked_fields.owner || 'Unassigned'}</LockBadge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Deadline:</span>
              <LockBadge color="amber">{packet.locked_fields.deadline || 'No deadline'}</LockBadge>
            </div>
            {packet.locked_fields.conditions.length > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Rule:</span>
                <LockBadge color="emerald" className="max-w-[160px] truncate">
                  {packet.locked_fields.conditions[0]}
                </LockBadge>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
