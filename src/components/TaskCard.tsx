'use client';

import React, { useState } from 'react';
import { RenderedCard, TeammateProfile } from '@/types';
import {
  Mic,
  CheckCircle2,
  Check,
  Copy,
  Lock,
  Trash2,
  Clock,
  User,
  Sparkles,
  Globe,
  ChevronDown,
  MessageCircle,
  Mail,
  Users,
  Pencil,
  ArrowUpRight,
} from 'lucide-react';
import { SUPPORTED_LANGUAGES, getLanguageMeta } from '@/lib/languages';
import { getWhatsAppDispatchUrl, getEmailDispatchUrl } from '@/lib/dispatch';

interface TaskCardProps {
  teammate: TeammateProfile;
  card?: RenderedCard;
  rawTranscript?: string;
  onOpenCorrection: (teammate: TeammateProfile) => void;
  onLanguageChange?: (teammateId: string, newLangCode: string) => void;
  onDeleteTeammate?: (teammateId: string) => void;
  onEditTeammate?: (teammate: TeammateProfile) => void;
  onDispatchTask?: (
    teammateId: string,
    channel: 'whatsapp' | 'whatsapp_group' | 'email'
  ) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  teammate,
  card,
  rawTranscript,
  onOpenCorrection,
  onLanguageChange,
  onDeleteTeammate,
  onEditTeammate,
  onDispatchTask,
}) => {
  const [copied, setCopied] = useState(false);
  const [dispatchedChannel, setDispatchedChannel] = useState<string | null>(
    teammate.dispatched_channel || null
  );
  const [dispatchedTime, setDispatchedTime] = useState<string | null>(
    teammate.last_dispatched_at || null
  );

  const langMeta = getLanguageMeta(teammate.preferred_language);
  const isGroup = teammate.recipient_type === 'group';

  const handleCopy = () => {
    if (card && navigator.clipboard) {
      navigator.clipboard.writeText(card.rendered_body);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSendWhatsApp = (forceGroupPicker: boolean = false) => {
    if (!card) return;
    const url = getWhatsAppDispatchUrl(card, teammate, forceGroupPicker);
    window.open(url, '_blank', 'noopener,noreferrer');

    const channelType = forceGroupPicker || isGroup ? 'whatsapp_group' : 'whatsapp';
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setDispatchedChannel(channelType);
    setDispatchedTime(nowTime);

    if (onDispatchTask) {
      onDispatchTask(teammate.id, channelType);
    }
  };

  const handleSendEmail = () => {
    if (!card) return;
    const url = getEmailDispatchUrl(card, teammate);
    window.open(url, '_blank');

    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setDispatchedChannel('email');
    setDispatchedTime(nowTime);

    if (onDispatchTask) {
      onDispatchTask(teammate.id, 'email');
    }
  };

  const hasCommitments =
    card &&
    ((card.displayed_locked_fields.owner && card.displayed_locked_fields.owner !== 'Unassigned') ||
      (card.displayed_locked_fields.deadline && card.displayed_locked_fields.deadline !== 'No deadline') ||
      (card.displayed_locked_fields.conditions && card.displayed_locked_fields.conditions.length > 0));

  return (
    <div className="h-full w-full bg-white rounded-3xl p-6 sm:p-7 border border-black/[0.08] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_36px_-6px_rgba(0,0,0,0.08)] hover:border-black/[0.16] transition-all duration-300 flex flex-col justify-between relative group">
      {/* Upper Section: Identity, Language, Memo Sheet, and Commitments */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {/* Top Header Row: Identity & Compact Action Toolbar */}
          <div className="flex items-start justify-between gap-3 pb-3">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              {/* Initial Letter Avatar (Replacing emoji) */}
              <div className="w-10 h-10 rounded-full bg-[#F2F2EC] text-[#252522] border border-black/[0.08] font-editorial text-base font-semibold flex items-center justify-center shrink-0 shadow-2xs">
                {(teammate.name || 'T').trim().charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h4 className="font-serif text-[15px] font-semibold text-[#1A1A18] leading-tight">
                    {teammate.name}
                  </h4>
                  {teammate.is_current_sender ? (
                    <span className="text-[9px] uppercase font-mono font-medium tracking-wider px-1.5 py-0.5 rounded-full bg-[#F2F2EC] text-[#666660] border border-black/[0.05] shrink-0">
                      Sender
                    </span>
                  ) : isGroup ? (
                    <span className="text-[9px] uppercase font-mono font-medium tracking-wider px-1.5 py-0.5 rounded-full bg-[#DCFCE7] text-[#15803D] border border-[#22C55E]/20 shrink-0 flex items-center gap-1">
                      <Users className="w-2.5 h-2.5" /> Group
                    </span>
                  ) : null}
                </div>

                {/* Subtitle with Role & Channel */}
                <p className="text-xs text-[#7A7A72] truncate mt-0.5">
                  {teammate.role}
                  {teammate.whatsapp_number && ` · 📱 ${teammate.whatsapp_number}`}
                  {teammate.group_name && ` · 👥 ${teammate.group_name}`}
                </p>
              </div>
            </div>

            {/* Clean Segmented Header Actions Toolbar: Edit, Copy, Remove */}
            <div className="inline-flex items-center gap-0.5 p-1 rounded-full bg-[#F6F6F2] border border-black/[0.05] shrink-0">
              {onEditTeammate && (
                <button
                  onClick={() => onEditTeammate(teammate)}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-[#7A7A72] hover:text-[#1A1A18] hover:bg-white transition-all shadow-2xs"
                  title={`Edit details for ${teammate.name}`}
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
              )}

              <button
                onClick={handleCopy}
                className="w-7 h-7 rounded-full flex items-center justify-center text-[#7A7A72] hover:text-[#1A1A18] hover:bg-white transition-all shadow-2xs"
                title="Copy translated instruction"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-[#5B6F00]" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>

              {onDeleteTeammate && (
                <button
                  onClick={() => onDeleteTeammate(teammate.id)}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-[#7A7A72] hover:text-[#ED5A31] hover:bg-[#FBEBE8] transition-all"
                  title={`Remove ${teammate.name} from team relay`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Language Delivery Sub-Bar */}
          <div className="flex items-center justify-between py-2 px-3 rounded-xl bg-[#FAF9F6] border border-black/[0.04] mb-4">
            <div className="flex items-center gap-1.5 text-xs text-[#7A7A72]">
              <Globe className="w-3.5 h-3.5 text-[#7A7A72]" />
              <span className="font-medium text-[#555550]">Relayed in</span>
            </div>

            {onLanguageChange ? (
              <div className="relative flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white hover:bg-[#F5F5F0] border border-black/[0.08] transition-colors cursor-pointer shadow-2xs">
                <span className="text-xs">{langMeta.flag}</span>
                <select
                  value={teammate.preferred_language}
                  onChange={(e) => onLanguageChange(teammate.id, e.target.value)}
                  className="bg-transparent text-xs font-semibold text-[#1A1A18] cursor-pointer focus:outline-none pr-1"
                >
                  {SUPPORTED_LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code} className="bg-white text-[#1A1A18]">
                      {l.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3 h-3 text-[#7A7A72] pointer-events-none" />
              </div>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-white border border-black/[0.08] text-[#1A1A18]">
                {langMeta.flag} {teammate.language_label}
              </span>
            )}
          </div>

          {/* Note Body Sheet (Editorial Paper Memo with Fixed Minimum Height) */}
          {card ? (
            <div className="p-4 sm:p-5 rounded-2xl bg-[#FCFCFA] border border-black/[0.06] space-y-2 shadow-2xs min-h-[148px] flex flex-col justify-center">
              <h5 className="font-editorial text-xl font-normal text-[#1A1A18] leading-snug">
                {card.rendered_headline}
              </h5>
              <p className="text-xs sm:text-sm font-sans leading-relaxed text-[#44443F]">
                {card.rendered_body}
              </p>
            </div>
          ) : (
            <div className="text-center py-12 text-[#9E9E96] text-xs font-sans flex flex-col items-center justify-center min-h-[148px]">
              <div className="w-5 h-5 rounded-full border-2 border-black/[0.15] border-t-[#252522] animate-spin mb-3" />
              <span>Preparing localized task...</span>
            </div>
          )}
        </div>

        {/* Invariant Facts Section (Consistent Height Container) */}
        <div className="pt-3 min-h-[96px] flex flex-col justify-end">
          {hasCommitments ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] text-[#7A7A72] px-1">
                <span className="flex items-center gap-1 font-medium">
                  <Lock className="w-3 h-3 text-[#5B6F00]" />
                  <span className="uppercase text-[10px] tracking-wider">Locked Commitments</span>
                </span>
                <span className="text-[10px] text-[#888882]">Zero drift verified</span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {card.displayed_locked_fields.owner && card.displayed_locked_fields.owner !== 'Unassigned' && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F6F6F2] border border-black/[0.06] text-xs font-medium text-[#252522]">
                    <User className="w-3.5 h-3.5 text-[#7A7A72]" />
                    <span>{card.displayed_locked_fields.owner}</span>
                  </div>
                )}

                {card.displayed_locked_fields.deadline && card.displayed_locked_fields.deadline !== 'No deadline' && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F6F6F2] border border-black/[0.06] text-xs font-medium text-[#252522]">
                    <Clock className="w-3.5 h-3.5 text-[#ED5A31]" />
                    <span>{card.displayed_locked_fields.deadline}</span>
                  </div>
                )}

                {card.displayed_locked_fields.conditions && card.displayed_locked_fields.conditions.length > 0 && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F6F6F2] border border-black/[0.06] text-xs font-medium text-[#6B6B65]">
                    <Sparkles className="w-3.5 h-3.5 text-[#5B6F00]" />
                    <span className="truncate max-w-[220px]">
                      {card.displayed_locked_fields.conditions[0]}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-[11px] text-[#A8A8A2] italic px-1">
              No locked entities detected.
            </div>
          )}
        </div>
      </div>

      {/* Action Footer: Redesigned Action Dock (Fixed Height Across All Cards) */}
      {card && (
        <div className="mt-6 pt-4 border-t border-black/[0.06] space-y-2.5">
          {/* Dispatch Confirmation Banner if sent */}
          {dispatchedChannel ? (
            <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-[#F0FDF4] border border-[#22C55E]/20 text-[11px] text-[#15803D]">
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" />
                <span>
                  Dispatched via {dispatchedChannel === 'whatsapp_group' ? 'WhatsApp Group' : dispatchedChannel === 'whatsapp' ? 'WhatsApp' : 'Email'}
                </span>
              </span>
              <span className="font-mono text-[10px] text-[#166534]">{dispatchedTime}</span>
            </div>
          ) : null}

          {/* Primary Action Button: Full-width, high-contrast Dispatch */}
          <button
            onClick={() => handleSendWhatsApp(false)}
            className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-[#1A1A18] hover:bg-[#2C2C28] text-[#FFFCFA] text-xs font-semibold shadow-xs hover:scale-[1.01] active:scale-[0.99] transition-all group/btn"
          >
            <span className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-[#25D366]/20 flex items-center justify-center shrink-0">
                <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
              </span>
              <span>{isGroup ? 'Dispatch to WhatsApp Group' : 'Send via WhatsApp'}</span>
            </span>

            <span className="text-[11px] text-[#A8A8A2] group-hover/btn:text-white flex items-center gap-1 font-normal transition-colors">
              <span>{isGroup ? 'Open Picker' : 'Direct Chat'}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </button>

          {/* Secondary Quick Action Dock: Email Draft & Voice Correct */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={handleSendEmail}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#F6F6F2] hover:bg-[#EFEFEA] text-[#44443F] hover:text-[#1A1A18] text-xs font-medium border border-black/[0.05] transition-all active:scale-[0.98]"
              title={teammate.email ? `Draft email to ${teammate.email}` : 'Compose email draft'}
            >
              <Mail className="w-3.5 h-3.5 text-[#7A7A72]" />
              <span>Email Draft</span>
            </button>

            <button
              onClick={() => onOpenCorrection(teammate)}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#F6F6F2] hover:bg-[#EFEFEA] text-[#44443F] hover:text-[#1A1A18] text-xs font-medium border border-black/[0.05] transition-all active:scale-[0.98]"
              title="Speak voice adjustment for this teammate"
            >
              <Mic className="w-3.5 h-3.5 text-[#ED5A31]" />
              <span>Voice Correct</span>
            </button>
          </div>

          {/* Symmetrical Group / Forward Link: Exact Same Height Across All Cards */}
          <div className="text-center pt-1 h-[22px] flex items-center justify-center">
            <button
              onClick={() => handleSendWhatsApp(true)}
              className="text-[11px] text-[#7A7A72] hover:text-[#15803D] transition-colors inline-flex items-center gap-1 font-sans"
            >
              <Users className="w-3 h-3 text-[#22C55E]" />
              <span>{isGroup ? 'Share with another WhatsApp group →' : 'Forward to a WhatsApp Group →'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
