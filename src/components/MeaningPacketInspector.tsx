'use client';

import React, { useState } from 'react';
import { MeaningPacket } from '@/types';
import { Code2, ChevronDown, ChevronUp, Copy, Check, ShieldCheck, Sparkles } from 'lucide-react';

interface MeaningPacketInspectorProps {
  packet?: MeaningPacket;
}

export const MeaningPacketInspector: React.FC<MeaningPacketInspectorProps> = ({ packet }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!packet) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(packet, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full glass-panel rounded-2xl border border-slate-800 shadow-xl overflow-hidden mt-6">
      {/* Header bar that toggles the inspector */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-900/40 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Code2 className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-100">
                Meaning Packet JSON Inspector
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
                Single Source of Truth
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Inspect the canonical AST extracted from speech before it gets translated into localized cards.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-slate-500 hidden sm:inline">
            task_id: {packet.task_id?.slice(0, 8)}...
          </span>
          <div className="p-1.5 rounded-lg bg-slate-800 text-slate-400">
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>
      </button>

      {/* Expandable JSON & Metadata Viewer */}
      {isOpen && (
        <div className="p-5 border-t border-slate-800 bg-slate-950/60 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>
                Canonical Schema: <strong className="text-slate-200">Zod Validated MeaningPacket v{packet.version}</strong>
              </span>
            </div>

            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy JSON</span>
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block mb-1">
                Core Intent Action
              </span>
              <p className="text-xs font-bold text-teal-300">
                {packet.action}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Detected: {packet.detected_languages?.join(', ') || 'Hinglish, English'}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block mb-1">
                Invariant Locked Fields
              </span>
              <div className="text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Owner:</span>
                  <span className="text-cyan-300 font-mono font-semibold">{packet.locked_fields.owner}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Deadline:</span>
                  <span className="text-amber-300 font-mono font-semibold">{packet.locked_fields.deadline}</span>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block mb-1">
                Strict Conditions ({packet.locked_fields.conditions.length})
              </span>
              <ul className="text-xs text-emerald-300 list-disc list-inside space-y-0.5">
                {packet.locked_fields.conditions.map((cond, i) => (
                  <li key={i} className="truncate">{cond}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Raw Code Block */}
          <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 font-mono text-xs text-slate-300 p-4 max-h-64 overflow-y-auto">
            <pre className="whitespace-pre-wrap leading-relaxed">
              {JSON.stringify(packet, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
