'use client';

import React, { useState, useEffect } from 'react';
import { TEAMMATE_PROFILES, DEFAULT_SAMPLE_PACKET, DEFAULT_SAMPLE_RENDERS } from '@/lib/mockData';
import { MeaningPacket, RenderedCard, TeammateProfile } from '@/types';
import { AudioRecorder } from '@/components/AudioRecorder';
import { TaskCard } from '@/components/TaskCard';
import { FactLockProof } from '@/components/FactLockProof';
import { CorrectionModal } from '@/components/CorrectionModal';
import { Radio, Sparkles, RefreshCw, Cpu, CheckCircle } from 'lucide-react';

export default function Home() {
  const [activeTask, setActiveTask] = useState<MeaningPacket>(DEFAULT_SAMPLE_PACKET);
  const [renders, setRenders] = useState<RenderedCard[]>(DEFAULT_SAMPLE_RENDERS);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedTeammateForCorrection, setSelectedTeammateForCorrection] =
    useState<TeammateProfile | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // Connect to Server-Sent Events (SSE) for real-time split-screen updates
  useEffect(() => {
    let eventSource: EventSource | null = null;

    try {
      eventSource = new EventSource('/api/events');

      eventSource.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data);
          if (parsed.type === 'TASK_MODIFIED') {
            setActiveTask(parsed.data.task);
            setRenders(parsed.data.renders);
            showNotification('⚡ Voice correction applied: Deadline locked to 5 PM across all views!');
          }
        } catch (e) {
          // ignore heartbeat
        }
      };
    } catch (err) {
      console.warn('SSE connection skipped or unsupported');
    }

    return () => {
      if (eventSource) eventSource.close();
    };
  }, []);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  // Pipeline flow: Transcribe -> Extract Meaning Packet -> Render Multi-language
  const handleTranscriptReady = async (transcript: string) => {
    setIsProcessing(true);
    showNotification('Processing speech with AssemblyAI Universal-3.5 Pro...');

    try {
      // 1. Extract Meaning Packet
      const extractRes = await fetch('/api/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript }),
      });
      const extractData = await extractRes.json();
      const newPacket = extractData.packet || DEFAULT_SAMPLE_PACKET;
      setActiveTask(newPacket);

      // 2. Render Cards in Hindi, Japanese, and English
      const renderRes = await fetch('/api/render', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task_id: newPacket.task_id,
          target_languages: ['en', 'hi', 'ja'],
        }),
      });
      const renderData = await renderRes.json();
      if (renderData.renders) {
        setRenders(renderData.renders);
      }

      showNotification('✅ Meaning Packet extracted and rendered with locked facts!');
    } catch (err) {
      console.error('Pipeline error:', err);
      showNotification('Using demo sample packet.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Voice delta correction
  const handleCorrectionSubmit = async (correctionTranscript: string) => {
    setIsProcessing(true);
    try {
      const res = await fetch('/api/correct', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task_id: activeTask.task_id,
          correction_transcript: correctionTranscript,
        }),
      });
      const data = await res.json();
      if (data.updated_packet && data.renders) {
        setActiveTask(data.updated_packet);
        setRenders(data.renders);
        showNotification('⚡ Shared packet updated! All views refreshed.');
      }
    } catch (err) {
      console.error('Correction failed:', err);
    } finally {
      setIsProcessing(false);
      setSelectedTeammateForCorrection(null);
    }
  };

  const handleResetDemo = () => {
    setActiveTask(DEFAULT_SAMPLE_PACKET);
    setRenders(DEFAULT_SAMPLE_RENDERS);
    showNotification('Demo state reset to initial Hinglish assignment.');
  };

  return (
    <main className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto flex flex-col justify-between">
      {/* Header */}
      <div>
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6 mb-8">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 text-slate-950 font-black text-xl shadow-lg shadow-teal-500/20">
                B
              </span>
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
                  Bhasha
                  <span className="text-xs font-mono font-medium px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/30">
                    Universal-3.5 Pro
                  </span>
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  One meaning, every language • Voice-first task handoff with zero fact drift
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
              <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>Real-time Team Relay</span>
            </div>

            <button
              onClick={handleResetDemo}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-medium transition-all"
              title="Reset to Initial Demo State"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>
        </header>

        {/* Global Toast Notification */}
        {notification && (
          <div className="fixed top-5 right-5 z-50 animate-in slide-in-from-top duration-300">
            <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-teal-950/90 border border-teal-500 text-teal-200 text-xs font-semibold shadow-2xl backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-teal-400" />
              <span>{notification}</span>
            </div>
          </div>
        )}

        {/* Voice Input Section */}
        <section className="mb-8">
          <AudioRecorder
            onTranscriptReady={handleTranscriptReady}
            isProcessing={isProcessing}
          />
        </section>

        {/* Simulated Split-Screen Multilingual Team View */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <Cpu className="w-5 h-5 text-teal-400" />
                Live Multilingual Team Relay (Simulated Split-Screen)
              </h2>
              <p className="text-xs text-slate-400">
                Notice how the same Meaning Packet renders in each teammate's preferred language while keeping owner, deadline, and conditions strictly locked.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TEAMMATE_PROFILES.map((teammate) => {
              const card = renders.find((r) => r.language_code === teammate.preferred_language);
              return (
                <TaskCard
                  key={teammate.id}
                  teammate={teammate}
                  card={card}
                  rawTranscript={activeTask?.raw_transcript}
                  onOpenCorrection={(t) => setSelectedTeammateForCorrection(t)}
                  onConfirmTask={() =>
                    showNotification(`Task accepted and confirmed by ${teammate.name}!`)
                  }
                />
              );
            })}
          </div>
        </section>

        {/* Fact-Lock Proof View */}
        <section className="mb-12">
          <FactLockProof packet={activeTask} renders={renders} />
        </section>
      </div>

      {/* Voice Correction Modal */}
      <CorrectionModal
        isOpen={!!selectedTeammateForCorrection}
        onClose={() => setSelectedTeammateForCorrection(null)}
        teammate={selectedTeammateForCorrection}
        onSubmitCorrection={handleCorrectionSubmit}
        isSubmitting={isProcessing}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 pt-6 text-center text-xs text-slate-500">
        <p>
          Built for <strong className="text-slate-300">AssemblyAI Voice Hackathon Week 2026</strong> • Team: Joshna (Dev 1), Saloni (Dev 2), Anurag (Dev 3)
        </p>
      </footer>
    </main>
  );
}
