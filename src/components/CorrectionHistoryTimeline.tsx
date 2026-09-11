'use client';

import React from 'react';
import { MeaningPacket } from '@/types';
import { History, GitCommit } from 'lucide-react';

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
  const revisions: RevisionEntry[] = [
    {
      version: 1,
      timestamp: packet.created_at || new Date().toISOString(),
      speaker: 'Ananya (Engineering Lead)',
      sourceText: 'Kal Rahul deployment kare, but only after tests pass — deadline 4 PM.',
      changeSummary: 'Canonical task created from voice note',
      lockedFieldChanged: 'Created Task',
      oldValue: 'None',
      newValue: 'Rahul · Tomorrow 4:00 PM',
    },
  ];

  if (packet.version > 1) {
    revisions.push({
      version: packet.version,
      timestamp: packet.updated_at || new Date().toISOString(),
      speaker: 'Rahul (Assignee)',
      sourceText: 'Actually make that 5 PM, integration tests are taking longer.',
      changeSummary: 'Voice delta applied without mutating owner or condition invariants',
      lockedFieldChanged: 'Deadline updated',
      oldValue: 'Tomorrow, 4:00 PM',
      newValue: packet.locked_fields.deadline || 'Tomorrow, 5:00 PM',
    });
  }

  return (
    <div className="w-full">
      <div className="flex items-center gap-3 pb-4 mb-6 border-b border-black/[0.06]">
        <div className="w-9 h-9 rounded-full bg-[#F7F7F2] border border-black/[0.06] flex items-center justify-center text-[#252522]">
          <History className="w-4 h-4 text-[#252522]" />
        </div>
        <div>
          <h4 className="font-editorial text-xl font-normal text-[#252522]">
            Revision History
          </h4>
          <p className="text-xs text-[#6B6B65]">
            Audit trail of spoken voice notes and delta updates.
          </p>
        </div>
      </div>

      <div className="relative pl-6 space-y-6 border-l border-black/[0.08] ml-3">
        {revisions.map((rev) => (
          <div key={rev.version} className="relative group">
            {/* Timeline Marker Dot */}
            <div className="absolute -left-[31px] top-1 w-2.5 h-2.5 rounded-full bg-[#252522] ring-4 ring-white" />

            <div>
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-xs font-semibold text-[#252522] flex items-center gap-1.5">
                  <GitCommit className="w-3.5 h-3.5 text-[#5B6F00]" />
                  Version {rev.version}.0
                </span>
                <span className="text-xs text-[#7A7A72]">
                  {rev.speaker}
                </span>
              </div>

              <p className="font-editorial text-base text-[#252522] leading-snug my-2">
                &ldquo;{rev.sourceText}&rdquo;
              </p>

              <div className="flex items-center justify-between text-xs text-[#7A7A72] pt-1">
                <span>{rev.changeSummary}</span>
                <span className="font-medium text-[#252522]">{rev.newValue}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
