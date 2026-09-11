'use client';

import React, { useState } from 'react';
import { MeaningPacket } from '@/types';
import { Code2, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';

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
    <div className="w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left pb-4 border-b border-black/[0.06] transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#F7F7F2] border border-black/[0.06] flex items-center justify-center text-[#252522]">
            <Code2 className="w-4 h-4 text-[#252522]" />
          </div>
          <div>
            <h4 className="font-editorial text-lg font-normal text-[#252522]">
              Meaning Packet Structure
            </h4>
            <p className="text-xs text-[#6B6B65]">
              Inspect the structured invariant representation extracted from speech.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-full bg-[#F7F7F2] text-[#252522]">
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>
      </button>

      {isOpen && (
        <div className="mt-4 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-[#7A7A72]">
              ID: {packet.task_id?.slice(0, 12)}...
            </span>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#F7F7F2] hover:bg-[#EFEFEA] text-xs font-sans text-[#252522] transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#5B6F00]" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy JSON</span>
                </>
              )}
            </button>
          </div>

          <pre className="p-4 rounded-xl bg-[#F7F7F2] border border-black/[0.06] text-xs font-mono text-[#252522] overflow-x-auto leading-relaxed">
            {JSON.stringify(packet, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};
