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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg glass-panel rounded-2xl p-6 border border-teal-500/30 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl p-2 rounded-xl bg-slate-800">{teammate.avatar}</span>
          <div>
            <h3 className="text-base font-bold text-slate-100">
              Voice Correction from {teammate.name}
            </h3>
            <p className="text-xs text-slate-400">
              Speaking in {teammate.language_label} updates the central Meaning Packet directly.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Spoken Correction / Delta Instruction
            </label>
            <div className="relative">
              <textarea
                value={correctionText}
                onChange={(e) => setCorrectionText(e.target.value)}
                placeholder='e.g., "Actually make it 5 PM, need more time for tests"'
                rows={3}
                className="w-full rounded-xl bg-slate-900/90 border border-slate-700 text-sm text-slate-100 p-3.5 focus:outline-none focus:border-teal-400 transition-all resize-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={handleQuickDemoDelta}
              disabled={isSubmitting}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Demo: "Shift to 5 PM"
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !correctionText.trim()}
                className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold bg-teal-600 hover:bg-teal-500 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-teal-900/30"
              >
                <Send className="w-3.5 h-3.5" />
                {isSubmitting ? 'Relaying Delta...' : 'Dispatch Delta'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
