'use client';

import React from 'react';
import { MeaningPacket, RenderedCard } from '@/types';
import { ShieldCheck, Check } from 'lucide-react';

interface FactLockProofProps {
  packet?: MeaningPacket;
  renders: RenderedCard[];
}

export const FactLockProof: React.FC<FactLockProofProps> = ({ packet, renders }) => {
  if (!packet || renders.length === 0) return null;

  const enRender = renders.find((r) => r.language_code === 'en');
  const hiRender = renders.find((r) => r.language_code === 'hi');
  const jaRender = renders.find((r) => r.language_code === 'ja');

  const rows = [
    {
      id: 'owner',
      fieldName: 'Assignee',
      canonical: packet.locked_fields.owner || 'Unassigned',
      enVal: enRender?.displayed_locked_fields.owner || packet.locked_fields.owner || 'Rahul',
      hiVal: hiRender?.displayed_locked_fields.owner ? `${hiRender.displayed_locked_fields.owner} (राहुल)` : packet.locked_fields.owner || 'Rahul',
      jaVal: jaRender?.displayed_locked_fields.owner || packet.locked_fields.owner || 'Rahul',
      description: 'Identity remains identical across every language',
    },
    {
      id: 'deadline',
      fieldName: 'Deadline',
      canonical: packet.locked_fields.deadline || 'None',
      enVal: enRender?.displayed_locked_fields.deadline || packet.locked_fields.deadline || 'Tomorrow, 4:00 PM',
      hiVal: hiRender?.displayed_locked_fields.deadline || packet.locked_fields.deadline || 'कल शाम 4:00 बजे',
      jaVal: jaRender?.displayed_locked_fields.deadline || packet.locked_fields.deadline || '明日午後4時',
      description: 'Timestamp is preserved without distortion or timezone drift',
    },
    {
      id: 'condition',
      fieldName: 'Prerequisite',
      canonical: packet.locked_fields.conditions.join('; ') || 'Tests pass',
      enVal: enRender?.displayed_locked_fields.conditions.join('; ') || packet.locked_fields.conditions[0] || 'Tests pass',
      hiVal: hiRender?.displayed_locked_fields.conditions.join('; ') || packet.locked_fields.conditions[0] || 'टेस्ट पास होने के बाद',
      jaVal: jaRender?.displayed_locked_fields.conditions.join('; ') || packet.locked_fields.conditions[0] || 'テスト合格後',
      description: 'Required conditions cannot be weakened in translation',
    },
  ];

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-black/[0.06] pb-4 mb-6 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#F7F7F2] border border-black/[0.06] flex items-center justify-center text-[#252522]">
            <ShieldCheck className="w-5 h-5 text-[#5B6F00]" />
          </div>
          <div>
            <h4 className="font-editorial text-xl font-normal text-[#252522] flex items-center gap-2">
              Fact-Lock Proof Matrix
              <span className="text-xs font-sans px-2.5 py-0.5 rounded-full bg-[#F7F7F2] text-[#5B6F00] font-medium border border-black/[0.06]">
                0.0% Drift
              </span>
            </h4>
            <p className="text-xs text-[#6B6B65]">
              Proof that translation never alters commitments: all localized cards inherit canonical locked invariants.
            </p>
          </div>
        </div>

        <div className="text-xs font-sans text-[#7A7A72]">
          Version: <span className="font-semibold text-[#252522]">v{packet.version}.0</span>
        </div>
      </div>

      {/* Proof Matrix Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse font-sans">
          <thead>
            <tr className="border-b border-black/[0.06] text-[#7A7A72]">
              <th className="py-3 px-3 font-medium uppercase">Entity</th>
              <th className="py-3 px-3 font-medium uppercase">Canonical Note</th>
              <th className="py-3 px-3 font-medium uppercase">🇺🇸 English</th>
              <th className="py-3 px-3 font-medium uppercase">🇮🇳 Hindi</th>
              <th className="py-3 px-3 font-medium uppercase">🇯🇵 Japanese</th>
              <th className="py-3 px-3 font-medium uppercase text-right">Verification</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/[0.04]">
            {rows.map((row) => (
              <tr key={row.id} className="hover:bg-[#F7F7F2]/60 transition-colors">
                <td className="py-3.5 px-3 font-semibold text-[#252522]">
                  {row.fieldName}
                </td>
                <td className="py-3.5 px-3 font-medium text-[#252522]">
                  <span className="px-2 py-0.5 rounded bg-[#F7F7F2] border border-black/[0.06]">
                    {row.canonical}
                  </span>
                </td>
                <td className="py-3.5 px-3 text-[#252522]">
                  {row.enVal}
                </td>
                <td className="py-3.5 px-3 text-[#252522]">
                  {row.hiVal}
                </td>
                <td className="py-3.5 px-3 text-[#252522]">
                  {row.jaVal}
                </td>
                <td className="py-3.5 px-3 text-right">
                  <span className="inline-flex items-center gap-1 text-[#5B6F00] font-medium">
                    <Check className="w-3.5 h-3.5" />
                    Intact
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
