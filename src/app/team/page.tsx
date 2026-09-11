'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  MeaningPacket,
  RenderedCard,
  TeammateProfile,
  DispatchRecord,
} from '@/types';
import {
  TEAMMATE_PROFILES as INITIAL_TEAMMATES,
  DEFAULT_SAMPLE_PACKET,
  DEFAULT_SAMPLE_RENDERS,
} from '@/lib/mockData';
import { TaskCard } from '@/components/TaskCard';
import { CorrectionModal } from '@/components/CorrectionModal';
import { AddTeammateModal } from '@/components/AddTeammateModal';
import { EditTeammateModal } from '@/components/EditTeammateModal';
import { getLanguageMeta } from '@/lib/languages';
import {
  Users,
  Plus,
  Mic,
  Check,
} from 'lucide-react';

export default function TeamRelayPage() {
  const [activeTask, setActiveTask] = useState<MeaningPacket>(DEFAULT_SAMPLE_PACKET);
  const [renders, setRenders] = useState<RenderedCard[]>(DEFAULT_SAMPLE_RENDERS);
  const [teammates, setTeammates] = useState<TeammateProfile[]>(INITIAL_TEAMMATES);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [selectedTeammateForCorrection, setSelectedTeammateForCorrection] =
    useState<TeammateProfile | null>(null);
  const [selectedTeammateForEdit, setSelectedTeammateForEdit] =
    useState<TeammateProfile | null>(null);
  const [isAddTeammateOpen, setIsAddTeammateOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dispatchRecords, setDispatchRecords] = useState<DispatchRecord[]>([]);

  useEffect(() => {
    fetch('/api/dispatch')
      .then((res) => res.json())
      .then((data) => {
        if (data.dispatches) setDispatchRecords(data.dispatches);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource('/api/events');
      eventSource.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data);
          if (parsed.type === 'TASK_MODIFIED') {
            setActiveTask(parsed.data.task);
            if (parsed.data.renders) setRenders(parsed.data.renders);
            showNotification('Synchronized voice update received.');
          } else if (parsed.type === 'RENDERS_UPDATED') {
            if (parsed.data.renders) setRenders(parsed.data.renders);
          }
        } catch (err) {}
      };
    } catch (e) {
      console.warn('SSE connection warning:', e);
    }

    return () => {
      if (eventSource) eventSource.close();
    };
  }, []);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleCorrectionSubmit = async (correctionTranscript: string) => {
    setIsProcessing(true);
    showNotification('Processing voice correction...');

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
      if (data.status === 'success' && data.updated_packet && data.renders) {
        setActiveTask(data.updated_packet);
        setRenders(data.renders);
        showNotification(`Version ${data.updated_packet.version}.0 broadcasted to all team languages.`);
      }
    } catch (err) {
      console.error('Correction failed:', err);
      showNotification('Correction request failed.');
    } finally {
      setIsProcessing(false);
      setSelectedTeammateForCorrection(null);
    }
  };

  const handleTeammateLanguageChange = async (teammateId: string, newLangCode: string) => {
    const meta = getLanguageMeta(newLangCode);
    setTeammates((prev) =>
      prev.map((t) =>
        t.id === teammateId
          ? { ...t, preferred_language: newLangCode, language_label: meta.nativeName }
          : t
      )
    );

    showNotification(`Translating to ${meta.name}...`);

    try {
      const res = await fetch('/api/render', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task_id: activeTask.task_id,
          packet: activeTask,
          target_languages: [newLangCode],
        }),
      });

      const data = await res.json();
      if (data.renders && data.renders.length > 0) {
        setRenders((prev) => {
          const filtered = prev.filter((r) => r.language_code !== newLangCode);
          return [...filtered, data.renders[0]];
        });
        showNotification(`Updated in ${meta.name}!`);
      }
    } catch (e) {
      console.warn('Language update error:', e);
    }
  };

  const handleAddTeammate = (newTeammate: TeammateProfile, newCard: RenderedCard) => {
    setTeammates((prev) => [...prev, newTeammate]);
    setRenders((prev) => [...prev, newCard]);
    showNotification(`Added ${newTeammate.name} (${newTeammate.language_label}) to team relay.`);
  };

  const handleSaveTeammate = async (updatedTeammate: TeammateProfile) => {
    setTeammates((prev) =>
      prev.map((t) => (t.id === updatedTeammate.id ? updatedTeammate : t))
    );
    showNotification(`Updated details for ${updatedTeammate.name}!`);

    const existingCard = renders.find(
      (r) => r.language_code === updatedTeammate.preferred_language
    );
    if (!existingCard) {
      await handleTeammateLanguageChange(
        updatedTeammate.id,
        updatedTeammate.preferred_language
      );
    }
  };

  const handleDeleteTeammate = (teammateId: string) => {
    const teammateToDelete = teammates.find((t) => t.id === teammateId);
    if (!teammateToDelete) return;

    if (teammates.length <= 1) {
      showNotification('At least one team member must remain in relay.');
      return;
    }

    setTeammates((prev) => prev.filter((t) => t.id !== teammateId));
    if (selectedFilter === teammateId) {
      setSelectedFilter('all');
    }
    showNotification(`Removed ${teammateToDelete.name} from team relay.`);
  };

  const handleDispatchTask = async (
    teammateId: string,
    channel: 'whatsapp' | 'whatsapp_group' | 'email'
  ) => {
    const teammate = teammates.find((t) => t.id === teammateId);
    if (!teammate) return;

    const card = renders.find((r) => r.language_code === teammate.preferred_language);
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setTeammates((prev) =>
      prev.map((t) =>
        t.id === teammateId
          ? { ...t, last_dispatched_at: nowTime, dispatched_channel: channel }
          : t
      )
    );

    const channelLabel =
      channel === 'whatsapp_group'
        ? 'WhatsApp Group'
        : channel === 'whatsapp'
        ? 'WhatsApp'
        : 'Email';

    showNotification(`Dispatched to ${teammate.name} via ${channelLabel}!`);

    try {
      const res = await fetch('/api/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teammate_id: teammate.id,
          recipient_name: teammate.name,
          channel,
          language: teammate.preferred_language,
          headline: card?.rendered_headline || activeTask.action,
        }),
      });
      const data = await res.json();
      if (data.record) {
        setDispatchRecords((prev) => [data.record, ...prev]);
      }
    } catch (e) {
      console.warn('Dispatch tracking error:', e);
    }
  };

  const filteredTeammates =
    selectedFilter === 'all'
      ? teammates
      : teammates.filter((t) => t.id === selectedFilter);

  return (
    <div className="relative min-h-screen bg-[#FFFCFA] text-[#252522]">
      {/* Ambient Grid */}
      <div className="absolute inset-0 ambient-grid pointer-events-none z-0 opacity-40" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Toast Notification */}
        {notification && (
          <div className="fixed top-20 right-6 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#252522] text-[#FFFCFA] text-xs font-medium shadow-lg">
              <Check className="w-3.5 h-3.5 text-[#D1E043]" />
              <span>{notification}</span>
            </div>
          </div>
        )}

        {/* Page Header - Granola Editorial Style */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-black/[0.08] pb-6 mb-8">
          <div>
            <h1 className="font-editorial text-4xl sm:text-5xl font-normal tracking-tight text-[#252522] mb-2">
              Team Relay
            </h1>
            <p className="text-base text-[#6B6B65] font-sans">
              Each team member receives instructions in their preferred language. Change any language to preview zero-drift translations.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsAddTeammateOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-[#F7F7F2] border border-black/[0.1] text-[#252522] text-xs font-medium shadow-xs transition-all hover:border-black/[0.2]"
            >
              <Plus className="w-3.5 h-3.5 text-[#5B6F00]" />
              <span>Add Teammate</span>
            </button>

            <Link
              href="/studio"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#252522] hover:bg-[#383834] text-[#FFFCFA] text-xs font-medium shadow-xs transition-all hover:scale-105"
            >
              <Mic className="w-3.5 h-3.5 text-[#D1E043]" />
              <span>Record Spoken Note</span>
            </Link>
          </div>
        </div>

        {/* Teammate Filter Navigation Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="inline-flex items-center gap-1 p-1 rounded-full bg-[#F4F4EE] border border-black/[0.06] overflow-x-auto max-w-full">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                selectedFilter === 'all'
                  ? 'bg-white text-[#1A1A18] shadow-xs font-semibold'
                  : 'text-[#6B6B65] hover:text-[#1A1A18]'
              }`}
            >
              All Inboxes ({teammates.length})
            </button>

            {teammates.map((teammate) => (
              <button
                key={teammate.id}
                onClick={() => setSelectedFilter(teammate.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  selectedFilter === teammate.id
                    ? 'bg-white text-[#1A1A18] shadow-xs font-semibold'
                    : 'text-[#6B6B65] hover:text-[#1A1A18]'
                }`}
              >
                <span className="w-4 h-4 rounded-full bg-[#E8E8E2] text-[#1A1A18] text-[9px] font-semibold flex items-center justify-center font-editorial">
                  {teammate.name.trim().charAt(0).toUpperCase()}
                </span>
                <span>{teammate.name}</span>
                <span className="text-[10px] text-[#888882]">({teammate.preferred_language.toUpperCase()})</span>
              </button>
            ))}
          </div>

          <span className="text-xs text-[#7A7A72] font-sans">
            {teammates.length} synchronized inboxes · zero translation drift
          </span>
        </div>

        {/* Multilingual Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {filteredTeammates.map((teammate) => {
            const card = renders.find(
              (r) => r.language_code === teammate.preferred_language
            );
            return (
              <div key={teammate.id} className="h-full flex flex-col">
                <TaskCard
                  teammate={teammate}
                  card={card}
                  rawTranscript={activeTask.raw_transcript}
                  onOpenCorrection={(t) => setSelectedTeammateForCorrection(t)}
                  onLanguageChange={handleTeammateLanguageChange}
                  onDeleteTeammate={handleDeleteTeammate}
                  onEditTeammate={(t) => setSelectedTeammateForEdit(t)}
                  onDispatchTask={handleDispatchTask}
                />
              </div>
            );
          })}
        </div>

        {/* Live Relay Activity Drawer / Status Log */}
        <div className="mt-12 pt-8 border-t border-black/[0.08]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E] animate-pulse" />
              <h3 className="font-editorial text-xl font-normal text-[#1A1A18]">
                Relay Dispatch Activity
              </h3>
            </div>
            <span className="text-xs text-[#7A7A72]">
              {dispatchRecords.length} message{dispatchRecords.length === 1 ? '' : 's'} dispatched this session
            </span>
          </div>

          {dispatchRecords.length > 0 ? (
            <div className="space-y-2">
              {dispatchRecords.map((rec) => (
                <div
                  key={rec.id}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-black/[0.06] shadow-2xs text-xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-7 h-7 rounded-full bg-[#F0FDF4] border border-[#22C55E]/20 text-[#15803D] flex items-center justify-center font-bold text-xs shrink-0">
                      ✓
                    </span>
                    <div className="truncate">
                      <span className="font-semibold text-[#1A1A18]">{rec.recipient_name}</span>
                      <span className="text-[#7A7A72] ml-2">
                        received localized note ({rec.language.toUpperCase()}) via {rec.channel === 'whatsapp_group' ? 'WhatsApp Group' : rec.channel === 'whatsapp' ? 'WhatsApp' : 'Email'}
                      </span>
                    </div>
                  </div>

                  <span className="font-mono text-[#7A7A72] shrink-0 ml-3">{rec.timestamp}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-[#FAF9F6] border border-black/[0.04] text-center text-xs text-[#7A7A72]">
              <p>Ready to relay — click <strong>&ldquo;Send via WhatsApp&rdquo;</strong> or <strong>&ldquo;Email&rdquo;</strong> on any card above to deliver the localized task.</p>
            </div>
          )}
        </div>

        {/* Voice Delta Correction Modal */}
        <CorrectionModal
          isOpen={Boolean(selectedTeammateForCorrection)}
          teammate={selectedTeammateForCorrection}
          onClose={() => setSelectedTeammateForCorrection(null)}
          onSubmitCorrection={handleCorrectionSubmit}
          isSubmitting={isProcessing}
        />

        {/* Add New Teammate Modal */}
        <AddTeammateModal
          isOpen={isAddTeammateOpen}
          onClose={() => setIsAddTeammateOpen(false)}
          onAddTeammate={handleAddTeammate}
          packet={activeTask}
        />

        {/* Edit Teammate Modal */}
        <EditTeammateModal
          isOpen={Boolean(selectedTeammateForEdit)}
          teammate={selectedTeammateForEdit}
          onClose={() => setSelectedTeammateForEdit(null)}
          onSaveTeammate={handleSaveTeammate}
        />
      </div>
    </div>
  );
}
