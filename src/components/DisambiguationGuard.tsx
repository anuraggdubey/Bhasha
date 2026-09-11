'use client';

import React from 'react';
import { MeaningPacket } from '@/types';
import { ShieldCheck, Check } from 'lucide-react';

interface DisambiguationGuardProps {
  packet: MeaningPacket;
}

export const DisambiguationGuard: React.FC<DisambiguationGuardProps> = ({ packet }) => {
  return (
    <div className="w-full py-3.5 px-5 rounded-2xl bg-[#F7F7F2] border border-black/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
      <div className="flex items-center gap-2.5">
        <ShieldCheck className="w-4 h-4 text-[#5B6F00] shrink-0" />
        <span className="font-medium text-[#252522]">
          Zero-Drift Verification
        </span>
        <span className="text-[#7A7A72] hidden sm:inline">•</span>
        <span className="text-[#6B6B65]">
          Assignee ({packet.locked_fields.owner || 'Unassigned'}) &amp; Deadline ({packet.locked_fields.deadline || 'Unset'}) locked
        </span>
      </div>

      <div className="flex items-center gap-1.5 text-[#5B6F00] font-medium shrink-0">
        <Check className="w-3.5 h-3.5" />
        <span>Ready to relay</span>
      </div>
    </div>
  );
};
