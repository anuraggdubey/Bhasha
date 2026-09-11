'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MeaningPacket, RenderedCard } from '@/types';
import { DEFAULT_SAMPLE_PACKET, DEFAULT_SAMPLE_RENDERS } from '@/lib/mockData';
import { SUPPORTED_LANGUAGES, getLanguageMeta } from '@/lib/languages';
import { AudioRecorder } from '@/components/AudioRecorder';
import {
  Copy,
  Check,
  Globe,
  ArrowRight,
  CheckCircle2,
  FileText,
} from 'lucide-react';

export default function StudioPage() {
  const router = useRouter();
  const [activePacket, setActivePacket] = useState<MeaningPacket>(DEFAULT_SAMPLE_PACKET);
  const [isProcessing, setIsProcessing] = useState(false);
  const [targetLanguage, setTargetLanguage] = useState<string>('hi');
  const [translatedCard, setTranslatedCard] = useState<RenderedCard | null>(DEFAULT_SAMPLE_RENDERS[1] || null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [copiedSection, setCopiedSection] = useState<'transcript' | 'translation' | null>(null);

  const showToast = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 3500);
  };

  const copyToClipboard = (text: string, section: 'transcript' | 'translation') => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedSection(section);
      showToast('Copied to clipboard');
      setTimeout(() => setCopiedSection(null), 2000);
    }
  };

  const handleTranscriptReady = async (transcript: string) => {
    setIsProcessing(true);
    showToast('Processing speech & translating...');

    // Immediately update the original spoken note with the exact words spoken
    const updatedPacket: MeaningPacket = {
      ...activePacket,
      raw_transcript: transcript,
      action: transcript,
    };
    setActivePacket(updatedPacket);

    try {
      // 1. Extract packet in background
      const extractRes = await fetch('/api/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript }),
      });

      const extractData = await extractRes.json();
      const packet = extractData.packet || updatedPacket;
      setActivePacket(packet);

      // 2. Render in target language
      await renderSingleLanguage(packet, targetLanguage);
      showToast('Translated into ' + getLanguageMeta(targetLanguage).name);
    } catch (err) {
      console.error('Processing error:', err);
      showToast('Note processed.');
    } finally {
      setIsProcessing(false);
    }
  };

  const renderSingleLanguage = async (packet: MeaningPacket, langCode: string) => {
    try {
      const res = await fetch('/api/render', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task_id: packet.task_id,
          packet,
          target_languages: [langCode],
        }),
      });
      const data = await res.json();
      if (data.renders && data.renders.length > 0) {
        setTranslatedCard(data.renders[0]);
      }
    } catch (e) {
      console.warn('Render error:', e);
    }
  };

  const handleLanguageChange = async (newLang: string) => {
    setTargetLanguage(newLang);
    setIsProcessing(true);
    await renderSingleLanguage(activePacket, newLang);
    setIsProcessing(false);
  };

  const handleDispatchToTeam = async () => {
    setIsProcessing(true);
    showToast('Forwarding note to Team Relay...');

    try {
      await fetch('/api/render', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task_id: activePacket.task_id,
          packet: activePacket,
          target_languages: ['en', 'hi', 'ja', 'es', targetLanguage],
        }),
      });

      setTimeout(() => router.push('/team'), 400);
    } catch (e) {
      router.push('/team');
    } finally {
      setIsProcessing(false);
    }
  };

  const currentLangMeta = getLanguageMeta(targetLanguage);

  return (
    <div className="relative min-h-screen bg-[#FFFCFA] text-[#252522]">
      {/* Delicate Ambient Grid */}
      <div className="absolute inset-0 ambient-grid pointer-events-none z-0 opacity-40" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Toast Notification */}
        {statusMessage && (
          <div className="fixed top-20 right-6 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#252522] text-[#FFFCFA] text-xs font-medium shadow-lg">
              <Check className="w-3.5 h-3.5 text-[#D1E043]" />
              <span>{statusMessage}</span>
            </div>
          </div>
        )}

        {/* Studio Header - Granola Editorial Style */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-black/[0.08]">
          <div>
            <h1 className="font-editorial text-4xl sm:text-5xl font-normal tracking-tight text-[#252522] mb-2">
              Voice Studio
            </h1>
            <p className="text-base text-[#6B6B65] font-sans">
              Speak spontaneous notes. Instant multilingual translation into 18 languages.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDispatchToTeam}
              disabled={isProcessing}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#252522] hover:bg-[#383834] text-[#FFFCFA] font-medium text-xs shadow-xs transition-all hover:scale-[1.02] disabled:opacity-50 active:scale-[0.98]"
            >
              <CheckCircle2 className="w-4 h-4 text-[#D1E043]" />
              <span>Send to Team Relay</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Voice Recorder & Text Input Card */}
        <AudioRecorder
          onTranscriptReady={handleTranscriptReady}
          isProcessing={isProcessing}
        />

        {/* Two-Column Output Grid: Transcribed Input vs Translated Output */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Card: Spoken Input Note */}
          <div className="editorial-card p-7 bg-white flex flex-col justify-between min-h-[320px]">
            <div>
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-black/[0.06]">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#252522]">
                  <FileText className="w-4 h-4 text-[#252522]" />
                  <span>Original Spoken Voice Note</span>
                </div>
                <button
                  onClick={() => copyToClipboard(activePacket.raw_transcript, 'transcript')}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F7F7F2] hover:bg-[#EFEFEA] text-[#252522] text-xs font-medium transition-all"
                  title="Copy Transcript"
                >
                  {copiedSection === 'transcript' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#5B6F00]" />
                      <span className="text-[#5B6F00]">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              <div className="py-2">
                <p className="font-editorial text-2xl font-normal leading-relaxed text-[#252522]">
                  &ldquo;{activePacket.raw_transcript}&rdquo;
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-black/[0.06] flex items-center justify-between text-xs text-[#7A7A72]">
              <span>Spoken Input</span>
              <span className="text-[#5B6F00] font-medium flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Speech Transcribed
              </span>
            </div>
          </div>

          {/* Right Card: Rendered Output with In-Card Language Dropdown */}
          <div className="editorial-card p-7 bg-white flex flex-col justify-between min-h-[320px]">
            <div>
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-black/[0.06]">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-semibold text-[#252522]">Rendered Output</span>

                  {/* Language Selector Dropdown inside Rendered Output header */}
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F7F7F2] border border-black/[0.08]">
                    <span className="text-xs">{currentLangMeta.flag}</span>
                    <select
                      value={targetLanguage}
                      onChange={(e) => handleLanguageChange(e.target.value)}
                      className="bg-transparent text-xs font-semibold text-[#252522] focus:outline-none cursor-pointer pr-1"
                    >
                      {SUPPORTED_LANGUAGES.map((l) => (
                        <option key={l.code} value={l.code} className="bg-white text-[#252522]">
                          {l.flag} {l.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  onClick={() =>
                    copyToClipboard(
                      translatedCard?.rendered_body || activePacket.raw_transcript,
                      'translation'
                    )
                  }
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F7F7F2] hover:bg-[#EFEFEA] text-[#252522] text-xs font-medium transition-all"
                  title="Copy Output"
                >
                  {copiedSection === 'translation' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#5B6F00]" />
                      <span className="text-[#5B6F00]">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              <div className="py-2">
                {isProcessing ? (
                  <div className="flex items-center gap-2 text-sm text-[#7A7A72] py-4">
                    <div className="w-4 h-4 rounded-full border-2 border-black/[0.2] border-t-[#252522] animate-spin" />
                    <span>Translating into {currentLangMeta.name}...</span>
                  </div>
                ) : (
                  <p className="font-editorial text-2xl font-normal leading-relaxed text-[#252522]">
                    {translatedCard?.rendered_body || activePacket.raw_transcript}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-black/[0.06] flex items-center justify-between text-xs text-[#7A7A72]">
              <span>Target: {currentLangMeta.nativeName}</span>
              <span className="text-[#5B6F00] font-medium flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-[#5B6F00]" /> Live Translation
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
