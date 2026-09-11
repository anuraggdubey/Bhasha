'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MeaningPacket, TeammateProfile } from '@/types';
import {
  DEFAULT_SAMPLE_PACKET,
  TEAMMATE_PROFILES,
} from '@/lib/mockData';
import {
  Mic,
  Users,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Lock,
  CheckCircle2,
  Globe,
  Layers,
  ArrowUpRight,
} from 'lucide-react';

export default function DashboardPage() {
  const [tasks, setTasks] = useState<MeaningPacket[]>([DEFAULT_SAMPLE_PACKET]);
  const [notification, setNotification] = useState<string | null>(null);

  // Load tasks from backend /api/tasks
  useEffect(() => {
    fetch('/api/tasks')
      .then((res) => res.json())
      .then((data) => {
        if (data.tasks && data.tasks.length > 0) {
          setTasks(data.tasks);
        }
      })
      .catch((err) => console.warn('Could not load tasks:', err));
  }, []);

  return (
    <div className="relative min-h-screen bg-[#FFFCFA] text-[#252522]">
      {/* Ambient Grid */}
      <div className="absolute inset-0 ambient-grid pointer-events-none z-0 opacity-40" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Toast Notification */}
        {notification && (
          <div className="fixed top-20 right-6 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#252522] text-[#FFFCFA] text-xs font-medium shadow-lg">
              <Sparkles className="w-3.5 h-3.5 text-[#D1E043]" />
              <span>{notification}</span>
            </div>
          </div>
        )}

        {/* Dashboard Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-black/[0.08] pb-6">
          <div>
            <h1 className="font-editorial text-4xl sm:text-5xl font-normal tracking-tight text-[#252522] mb-2">
              System Overview
            </h1>
            <p className="text-base text-[#6B6B65] font-sans">
              Monitor active voice notes, multilingual relays, and zero-drift invariant proofs across your team.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/studio"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#252522] hover:bg-[#383834] text-[#FFFCFA] font-medium text-xs shadow-xs transition-all hover:scale-105"
            >
              <Mic className="w-3.5 h-3.5 text-[#D1E043]" />
              <span>Record Voice Note</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* High-Level Editorial Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="editorial-card p-6 bg-white">
            <div className="flex items-center justify-between mb-3 text-xs font-mono uppercase text-[#7A7A72]">
              <span>Active Tasks</span>
              <Layers className="w-4 h-4 text-[#252522]" />
            </div>
            <div className="font-editorial text-4xl font-normal text-[#252522]">
              {tasks.length}
            </div>
            <p className="text-xs text-[#6B6B65] mt-1.5 font-sans flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5B6F00]"></span>
              Synchronized across all relays
            </p>
          </div>

          <div className="editorial-card p-6 bg-white">
            <div className="flex items-center justify-between mb-3 text-xs font-mono uppercase text-[#7A7A72]">
              <span>Relay Locales</span>
              <Globe className="w-4 h-4 text-[#252522]" />
            </div>
            <div className="font-editorial text-4xl font-normal text-[#252522]">
              18 Locales
            </div>
            <p className="text-xs text-[#6B6B65] mt-1.5 font-sans">
              English, Hindi, Japanese, Spanish & more
            </p>
          </div>

          <div className="editorial-card p-6 bg-white">
            <div className="flex items-center justify-between mb-3 text-xs font-mono uppercase text-[#7A7A72]">
              <span>Fact Drift Rate</span>
              <ShieldCheck className="w-4 h-4 text-[#5B6F00]" />
            </div>
            <div className="font-editorial text-4xl font-normal text-[#5B6F00]">
              0.00%
            </div>
            <p className="text-xs text-[#6B6B65] mt-1.5 font-sans">
              Mathematical invariant guarantee
            </p>
          </div>

          <div className="editorial-card p-6 bg-white">
            <div className="flex items-center justify-between mb-3 text-xs font-mono uppercase text-[#7A7A72]">
              <span>Connected Members</span>
              <Users className="w-4 h-4 text-[#ED5A31]" />
            </div>
            <div className="font-editorial text-4xl font-normal text-[#252522]">
              {TEAMMATE_PROFILES.length} Active
            </div>
            <p className="text-xs text-[#6B6B65] mt-1.5 font-sans">
              Real-time localized feeds
            </p>
          </div>
        </div>

        {/* Feature Navigation Hub */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-editorial text-2xl font-normal text-[#252522]">
              Core Workspaces
            </h2>
            <span className="text-xs text-[#7A7A72]">Select an area to explore</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Studio */}
            <Link
              href="/studio"
              className="editorial-card p-6 bg-white group flex flex-col justify-between hover:border-black/20 transition-all hover:shadow-md"
            >
              <div>
                <div className="w-10 h-10 rounded-full bg-[#F7F7F2] border border-black/[0.06] text-[#252522] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <Mic className="w-5 h-5 text-[#ED5A31]" />
                </div>
                <h3 className="font-editorial text-xl font-normal text-[#252522] mb-2 group-hover:text-[#ED5A31] transition-colors">
                  Voice Studio
                </h3>
                <p className="text-xs text-[#6B6B65] leading-relaxed font-sans">
                  Dictate spontaneous speech in Hinglish or English. Bhasha locks factual commitments and renders tasks into any language.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-black/[0.06] flex items-center justify-between text-xs font-medium text-[#252522]">
                <span>Open Studio</span>
                <ArrowUpRight className="w-4 h-4 text-[#7A7A72] group-hover:text-[#252522] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </Link>

            {/* Card 2: Team Relay */}
            <Link
              href="/team"
              className="editorial-card p-6 bg-white group flex flex-col justify-between hover:border-black/20 transition-all hover:shadow-md"
            >
              <div>
                <div className="w-10 h-10 rounded-full bg-[#F7F7F2] border border-black/[0.06] text-[#252522] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <Users className="w-5 h-5 text-[#5B6F00]" />
                </div>
                <h3 className="font-editorial text-xl font-normal text-[#252522] mb-2 group-hover:text-[#5B6F00] transition-colors">
                  Team Relay
                </h3>
                <p className="text-xs text-[#6B6B65] leading-relaxed font-sans">
                  Inspect inboxes for each teammate. Teammates receive instructions in their native language and submit spoken corrections.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-black/[0.06] flex items-center justify-between text-xs font-medium text-[#252522]">
                <span>View Team Inboxes</span>
                <ArrowUpRight className="w-4 h-4 text-[#7A7A72] group-hover:text-[#252522] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </Link>

            {/* Card 3: Invariant Audit */}
            <Link
              href="/audit"
              className="editorial-card p-6 bg-white group flex flex-col justify-between hover:border-black/20 transition-all hover:shadow-md"
            >
              <div>
                <div className="w-10 h-10 rounded-full bg-[#F7F7F2] border border-black/[0.06] text-[#252522] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-5 h-5 text-[#252522]" />
                </div>
                <h3 className="font-editorial text-xl font-normal text-[#252522] mb-2 group-hover:text-[#252522] transition-colors">
                  Invariant Audit
                </h3>
                <p className="text-xs text-[#6B6B65] leading-relaxed font-sans">
                  Inspect the side-by-side proof matrix and version audit log proving that assignees and deadlines never drift in translation.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-black/[0.06] flex items-center justify-between text-xs font-medium text-[#252522]">
                <span>Inspect Audit Matrix</span>
                <ArrowUpRight className="w-4 h-4 text-[#7A7A72] group-hover:text-[#252522] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </Link>
          </div>
        </div>

        {/* Active Tasks Table */}
        <div className="editorial-card p-6 bg-white">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-black/[0.06] gap-2">
            <div>
              <h3 className="font-editorial text-xl font-normal text-[#252522]">
                Active Relayed Tasks
              </h3>
              <p className="text-xs text-[#6B6B65]">
                Tasks currently synchronized across team members with locked invariants.
              </p>
            </div>
            <Link
              href="/team"
              className="text-xs font-medium text-[#252522] hover:underline flex items-center gap-1"
            >
              <span>View all in Team Relay</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead>
                <tr className="border-b border-black/[0.06] text-[#7A7A72]">
                  <th className="py-3 px-3 font-medium uppercase">Task Instruction</th>
                  <th className="py-3 px-3 font-medium uppercase">Assignee</th>
                  <th className="py-3 px-3 font-medium uppercase">Deadline</th>
                  <th className="py-3 px-3 font-medium uppercase">Relay Languages</th>
                  <th className="py-3 px-3 font-medium uppercase">Version</th>
                  <th className="py-3 px-3 font-medium uppercase">Status</th>
                  <th className="py-3 px-3 font-medium uppercase text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.04]">
                {tasks.map((task) => (
                  <tr key={task.task_id} className="hover:bg-[#F7F7F2]/60 transition-colors">
                    <td className="py-3.5 px-3 font-medium text-[#252522] max-w-xs truncate">
                      {task.action}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="font-semibold text-[#252522] flex items-center gap-1">
                        <Lock className="w-3 h-3 text-[#5B6F00]" />
                        {task.locked_fields.owner || 'Unassigned'}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 font-mono text-[#ED5A31]">
                      {task.locked_fields.deadline || 'No deadline'}
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-1">
                        {task.detected_languages.map((l) => (
                          <span
                            key={l}
                            className="px-2 py-0.5 rounded-full bg-[#F7F7F2] border border-black/[0.06] text-[10px] font-mono uppercase text-[#252522]"
                          >
                            {l}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-3 font-mono font-semibold text-[#252522]">
                      v{task.version}.0
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#F7F7F2] text-[#5B6F00] border border-black/[0.06]">
                        <CheckCircle2 className="w-3 h-3" />
                        Synchronized
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <Link
                        href="/team"
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#F7F7F2] hover:bg-[#EFEFEA] text-[#252522] text-xs font-medium transition-colors"
                      >
                        <span>Inspect</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Active Teammates Roster */}
        <div className="editorial-card p-6 bg-white">
          <div className="flex items-center justify-between pb-3 mb-5 border-b border-black/[0.06]">
            <div>
              <h3 className="font-editorial text-xl font-normal text-[#252522]">
                Synchronized Relay Teammates
              </h3>
              <p className="text-xs text-[#6B6B65]">
                Team members receiving tasks translated automatically into their native language.
              </p>
            </div>
            <Link
              href="/team"
              className="text-xs font-medium text-[#252522] hover:underline flex items-center gap-1"
            >
              <span>Manage Team</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {TEAMMATE_PROFILES.map((profile) => (
              <div
                key={profile.id}
                className="p-4 rounded-xl bg-[#F7F7F2] border border-black/[0.06] flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl p-1.5 rounded-full bg-white border border-black/[0.06]">
                    {profile.avatar}
                  </span>
                  <div>
                    <div className="text-sm font-semibold text-[#252522]">{profile.name}</div>
                    <div className="text-xs text-[#7A7A72]">{profile.role}</div>
                  </div>
                </div>
                <span className="text-xs font-medium text-[#252522] px-2.5 py-1 rounded-full bg-white border border-black/[0.06]">
                  {profile.language_label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
