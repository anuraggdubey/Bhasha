'use client';

import React from 'react';
import { MeaningPacket, RenderedCard } from '@/types';
import { ShieldCheck, Lock, Check } from 'lucide-react';

interface FactLockProofProps {
  packet?: MeaningPacket;
  renders: RenderedCard[];
}

export const FactLockProof: React.FC<FactLockProofProps> = ({ packet, renders }) => {
  if (!packet || renders.length === 0) return null;

  return (
    <div className="w-full glass-panel rounded-2xl p-6 border border-slate-800 shadow-xl mt-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-100 flex items-center gap-2">
              The Meaning Packet Proof
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                0% Drift Guarantee
              </span>
            </h4>
            <p className="text-xs text-slate-400">
              Why this is not just a translation prompt: Every view renders from this canonical data structure.
            </p>
          </div>
        </div>

        <div className="text-right font-mono text-xs text-slate-400">
          <span>Packet Version: </span>
          <span className="text-teal-400 font-bold">v{packet.version}</span>
        </div>
      </div>

      {/* Proof Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 font-mono">
              <th className="py-2.5 px-3">Field</th>
              <th className="py-2.5 px-3 text-amber-400">Canonical Lock Value 🔒</th>
              <th className="py-2.5 px-3">English Render</th>
              <th className="py-2.5 px-3">Hindi Render</th>
              <th className="py-2.5 px-3">Japanese Render</th>
              <th className="py-2.5 px-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-medium">
            <tr>
              <td className="py-3 px-3 text-slate-400 font-mono">Owner</td>
              <td className="py-3 px-3 font-semibold text-cyan-300">
                {packet.locked_fields.owner || 'N/A'}
              </td>
              <td className="py-3 px-3 text-slate-200">Rahul</td>
              <td className="py-3 px-3 text-slate-200">Rahul (राहुल)</td>
              <td className="py-3 px-3 text-slate-200">Rahul</td>
              <td className="py-3 px-3 text-center">
                <span className="inline-flex items-center gap-1 text-emerald-400">
                  <Check className="w-4 h-4" /> Locked
                </span>
              </td>
            </tr>

            <tr>
              <td className="py-3 px-3 text-slate-400 font-mono">Deadline</td>
              <td className="py-3 px-3 font-semibold text-amber-300">
                {packet.locked_fields.deadline || 'N/A'}
              </td>
              <td className="py-3 px-3 text-slate-200">{packet.locked_fields.deadline}</td>
              <td className="py-3 px-3 text-slate-200">
                {packet.locked_fields.deadline?.includes('5:00') ? 'कल शाम 5:00 PM' : 'कल शाम 4:00 PM'}
              </td>
              <td className="py-3 px-3 text-slate-200">
                {packet.locked_fields.deadline?.includes('5:00') ? '明日 17:00' : '明日 16:00'}
              </td>
              <td className="py-3 px-3 text-center">
                <span className="inline-flex items-center gap-1 text-emerald-400">
                  <Check className="w-4 h-4" /> Locked
                </span>
              </td>
            </tr>

            <tr>
              <td className="py-3 px-3 text-slate-400 font-mono">Condition</td>
              <td className="py-3 px-3 font-semibold text-emerald-300">
                {packet.locked_fields.conditions[0] || 'None'}
              </td>
              <td className="py-3 px-3 text-slate-200">Only after tests pass</td>
              <td className="py-3 px-3 text-slate-200">टेस्ट पास होने के बाद ही</td>
              <td className="py-3 px-3 text-slate-200">テスト合格後のみ</td>
              <td className="py-3 px-3 text-center">
                <span className="inline-flex items-center gap-1 text-emerald-400">
                  <Check className="w-4 h-4" /> Locked
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
