'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { TEAMMATE_PROFILES as INITIAL_TEAMMATES, DEFAULT_SAMPLE_PACKET, DEFAULT_SAMPLE_RENDERS } from '@/lib/mockData';
import { MeaningPacket, RenderedCard, TeammateProfile } from '@/types';
import { AudioRecorder } from '@/components/AudioRecorder';
import { TaskCard } from '@/components/TaskCard';
import { FactLockProof } from '@/components/FactLockProof';
import { CorrectionModal } from '@/components/CorrectionModal';
import { PipelineVisualizer } from '@/components/PipelineVisualizer';
import { MeaningPacketInspector } from '@/components/MeaningPacketInspector';
import { DemoModeBanner } from '@/components/DemoModeBanner';
import { ManagerDispatchReview } from '@/components/ManagerDispatchReview';
import { CorrectionHistoryTimeline } from '@/components/CorrectionHistoryTimeline';
import { DisambiguationGuard } from '@/components/DisambiguationGuard';
import { AddTeammateModal } from '@/components/AddTeammateModal';
import { PerspectiveViewToggle, DashboardViewMode } from '@/components/PerspectiveViewToggle';
import { Radio, Sparkles, RefreshCw, Cpu, CheckCircle, ArrowLeft, Users, ShieldCheck, UserPlus } from 'lucide-react';

export default function DashboardPage() {
  const [activeTask, setActiveTask] = useState<MeaningPacket>(DEFAULT_SAMPLE_PACKET);
  const [renders, setRenders] = useState<RenderedCard[]>(DEFAULT_SAMPLE_RENDERS);
  const [teammates, setTeammates] = useState<TeammateProfile[]>(INITIAL_TEAMMATES);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedTeammateForCorrection, setSelectedTeammateForCorrection] =
    useState<TeammateProfile | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [isDispatched, setIsDispatched] = useState(true);
  const [isAddTeammateOpen, setIsAddTeammateOpen] = useState(false);
  const [viewMode, setViewMode] = useState<DashboardViewMode>('split');

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
            showNotification('⚡ Voice correction applied: Deadline locked across all views!');
          }
        } catch (e) {
          // heartbeat
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
    setIsDispatched(false);
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
      const targetLanguages = teammates.map((t) => t.preferred_language);
      const renderRes = await fetch('/api/render', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task_id: newPacket.task_id,
          target_languages: targetLanguages,
        }),
      });
      const renderData = await renderRes.json();
      if (renderData.renders) {
        setRenders(renderData.renders);
      }

      showNotification('✅ Meaning Packet extracted! Ready for Manager Review.');
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
    setTeammates(INITIAL_TEAMMATES);
    setIsDispatched(true);
    showNotification('Demo state reset to initial Hinglish assignment.');
  };

  const handleAddTeammate = (newTeammate: TeammateProfile, newCard: RenderedCard) => {
    setTeammates((prev) => [...prev, newTeammate]);
    setRenders((prev) => [...prev, newCard]);
    showNotification(`✨ Added ${newTeammate.name} (${newTeammate.language_label}) to live relay!`);
  };

  return (
    <main className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto flex flex-col justify-between">
      <div>
        {/* Top Breadcrumb & Control Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5 mb-6">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white hover:border-slate-700 transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Landing Page
            </Link>

            <div className="h-4 w-px bg-slate-800" />

            <div>
              <h1 className="text-xl md:text-2xl font-black text-white flex items-center gap-2.5">
                Bhasha Relay Station
                <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/30">
                  Universal-3.5
                </span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAddTeammateOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-950/80 hover:bg-teal-900 text-teal-300 border border-teal-700/60 text-xs font-bold transition-all shadow-sm hover:scale-105"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>+ Add Language Relay</span>
            </button>

            <button
              onClick={handleResetDemo}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold transition-all"
              title="Reset to Initial Demo State"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>
        </div>

        {/* Global Toast Notification */}
        {notification && (
          <div className="fixed top-20 right-5 z-50 animate-in slide-in-from-top duration-300">
            <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-teal-950/95 border border-teal-500 text-teal-200 text-xs font-semibold shadow-2xl backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-teal-400" />
              <span>{notification}</span>
            </div>
          </div>
        )}

        {/* Showcase Mode Notice */}
        <DemoModeBanner />

        {/* Perspective Mode Switcher */}
        <PerspectiveViewToggle
          currentMode={viewMode}
          onModeChange={(mode) => setViewMode(mode)}
        />

        {/* Pipeline Telemetry Tracker */}
        <PipelineVisualizer isProcessing={isProcessing} />

        {/* Manager Speech Ingestion Box (Always visible in Split or Sender mode) */}
        {(viewMode === 'split' || viewMode === 'sender') && (
          <section className="mb-6">
            <AudioRecorder
              onTranscriptReady={handleTranscriptReady}
              isProcessing={isProcessing}
            />
          </section>
        )}

        {/* Pre-Broadcast Manager Review Gate */}
        <ManagerDispatchReview
          packet={activeTask}
          onConfirmDispatch={() => {
            setIsDispatched(true);
            showNotification('🚀 Task broadcasted to all teammate relays with locked facts!');
          }}
          isDispatched={isDispatched}
          onOpenVoiceCorrection={() => setSelectedTeammateForCorrection(teammates[0])}
        />

        {/* Disambiguation & Entity Safety Check */}
        <DisambiguationGuard packet={activeTask} />

        {/* Multilingual Team Relay (Visible in Split or Receiver mode) */}
        {(viewMode === 'split' || viewMode === 'receiver') && (
          <section className="space-y-4 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <Users className="w-5 h-5 text-teal-400" />
                  Live Multilingual Team Relay ({teammates.length} Synchronized Views)
                </h2>
                <p className="text-xs text-slate-400">
                  Every card renders in the teammate&apos;s preferred language while owner, deadline, and conditions remain 100% locked.
                </p>
              </div>

              <button
                onClick={() => setIsAddTeammateOpen(true)}
                className="self-start sm:self-center text-xs font-mono text-teal-300 hover:text-teal-200 underline"
              >
                + Add Another Language (Spanish, German, etc.)
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teammates.map((teammate) => {
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
        )}

        {/* Fact-Lock Proof View (Visible in Split or Proof mode) */}
        {(viewMode === 'split' || viewMode === 'proof') && (
          <section className="mb-6">
            <FactLockProof packet={activeTask} renders={renders} />
          </section>
        )}

        {/* Revision Timeline / Audit Trail */}
        <CorrectionHistoryTimeline packet={activeTask} />

        {/* Meaning Packet JSON Inspector */}
        <section className="mb-12">
          <MeaningPacketInspector packet={activeTask} />
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

      {/* Add Teammate Modal */}
      <AddTeammateModal
        isOpen={isAddTeammateOpen}
        onClose={() => setIsAddTeammateOpen(false)}
        packet={activeTask}
        onAddTeammate={handleAddTeammate}
      />

      {/* Dashboard Footer */}
      <footer className="border-t border-slate-800/80 pt-6 text-center text-xs text-slate-500">
        <p>
          <strong className="text-slate-300">Bhasha Relay</strong> — Voice-first task handoff and orchestration for multilingual teams. Powered by AssemblyAI Universal-3.5 Pro.
        </p>
      </footer>
    </main>
  );
}
