'use client';

import React, { useState } from 'react';
import { TeammateProfile } from '@/types';
import { X, Mic, Send, Sparkles } from 'lucide-react';

interface CorrectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  teammate: TeammateProfile | null;
  onSubmitCorrection: (correctionText: string) => void;
  isSubmitting: boolean;
}

export const CorrectionModal: React.FC<CorrectionModalProps> = ({
  isOpen,
  onClose,
  teammate,
  onSubmitCorrection,
  isSubmitting,
}) => {
  const [correctionText, setCorrectionText] = useState('');

  if (!isOpen || !teammate) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!correctionText.trim()) return;
    onSubmitCorrection(correctionText);
    setCorrectionText('');
  };

  const handleQuickDemoDelta = () => {
    const deltaText = 'Actually make that 5 PM, integration tests are taking longer.';
    onSubmitCorrection(deltaText);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[#FFFCFA] rounded-3xl p-7 border border-black/[0.1] shadow-2xl relative text-[#252522]">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full text-[#7A7A72] hover:text-[#252522] hover:bg-[#F7F7F2] transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3.5 mb-6">
          <div className="w-12 h-12 rounded-full bg-[#F2F2EC] border border-black/[0.08] font-editorial text-lg font-semibold text-[#252522] flex items-center justify-center shrink-0 shadow-2xs">
            {(teammate.name || 'T').trim().charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-editorial text-2xl font-normal text-[#252522]">
              Voice Correction: {teammate.name}
            </h3>
            <p className="text-xs text-[#6B6B65] mt-0.5">
              Updates in {teammate.language_label} sync directly into the central task.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-medium text-[#7A7A72] mb-2 font-sans">
              Spoken Delta or Revision
            </label>
            <textarea
              value={correctionText}
              onChange={(e) => setCorrectionText(e.target.value)}
              placeholder='e.g., "Actually make that 5 PM, need more time for tests"'
              rows={3}
              className="w-full rounded-2xl bg-[#F7F7F2] border border-black/[0.08] text-sm text-[#252522] p-4 focus:outline-none focus:border-black/30 focus:bg-white transition-all resize-none font-sans"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={handleQuickDemoDelta}
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-medium bg-[#F7F7F2] hover:bg-[#EFEFEA] text-[#252522] border border-black/[0.06] transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#ED5A31]" />
              <span>Demo: &ldquo;Shift to 5 PM&rdquo;</span>
            </button>

            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-full text-xs font-medium text-[#7A7A72] hover:text-[#252522] hover:bg-[#F7F7F2] transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !correctionText.trim()}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-medium bg-[#252522] hover:bg-[#383834] text-[#FFFCFA] transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
              >
                <Send className="w-3.5 h-3.5 text-[#D1E043]" />
                <span>{isSubmitting ? 'Relaying...' : 'Dispatch Delta'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
