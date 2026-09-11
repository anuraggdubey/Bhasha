'use client';

import React, { useState } from 'react';
import { TeammateProfile, MeaningPacket, RenderedCard } from '@/types';
import { UserPlus, X, Plus, Users, User, Phone, Mail } from 'lucide-react';
import { SUPPORTED_LANGUAGES, getLanguageMeta } from '@/lib/languages';

interface AddTeammateModalProps {
  isOpen: boolean;
  onClose: () => void;
  packet: MeaningPacket;
  onAddTeammate: (teammate: TeammateProfile, renderCard: RenderedCard) => void;
}

export const AddTeammateModal: React.FC<AddTeammateModalProps> = ({
  isOpen,
  onClose,
  packet,
  onAddTeammate,
}) => {
  const [recipientType, setRecipientType] = useState<'individual' | 'group'>('individual');
  const [selectedLangCode, setSelectedLangCode] = useState('es');
  const [name, setName] = useState('Carlos Mendez');
  const [role, setRole] = useState('Cloud Infrastructure Lead');
  const [whatsappNumber, setWhatsappNumber] = useState('+91 98765 43210');
  const [email, setEmail] = useState('carlos.mendez@bhasha.team');
  const [groupName, setGroupName] = useState('Madrid Cloud Ops Group');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const langMeta = getLanguageMeta(selectedLangCode);

    const isGroup = recipientType === 'group';

    const newTeammate: TeammateProfile = {
      id: `teammate-${selectedLangCode}-${Date.now()}`,
      name: isGroup ? groupName.trim() || `${langMeta.name} Team Group` : name.trim() || `${langMeta.name} Engineer`,
      role: isGroup ? 'WhatsApp Team Group' : role.trim() || 'Software Engineer',
      preferred_language: selectedLangCode,
      language_label: `${langMeta.flag} ${langMeta.nativeName}`,
      avatar: (isGroup ? groupName : name).trim().charAt(0).toUpperCase() || 'T',
      recipient_type: recipientType,
      whatsapp_number: isGroup ? undefined : whatsappNumber.trim(),
      email: email.trim() || undefined,
      group_name: isGroup ? groupName.trim() : undefined,
    };

    const newRenderCard: RenderedCard = {
      task_id: packet.task_id,
      version: packet.version,
      language_code: selectedLangCode,
      language_label: langMeta.nativeName,
      rendered_headline: langMeta.headline,
      rendered_body: `${packet.locked_fields.owner || 'Assignee'} must ${packet.action} by ${packet.locked_fields.deadline || 'deadline'}. Prerequisites: ${packet.locked_fields.conditions.join(', ') || 'All tests passing'}.`,
      displayed_locked_fields: {
        owner: packet.locked_fields.owner || 'Unassigned',
        deadline: packet.locked_fields.deadline || 'No deadline',
        conditions: packet.locked_fields.conditions.length > 0 ? packet.locked_fields.conditions : ['Only after all tests pass'],
      },
      is_locked_fact_intact: true,
    };

    onAddTeammate(newTeammate, newRenderCard);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#FFFCFA] rounded-3xl p-7 md:p-8 border border-black/[0.1] shadow-2xl text-[#252522]">
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-black/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#F7F7F2] border border-black/[0.06] text-[#252522] flex items-center justify-center">
              <UserPlus className="w-4 h-4 text-[#5B6F00]" />
            </div>
            <div>
              <h3 className="font-editorial text-2xl font-normal text-[#252522]">
                Add Teammate or Group
              </h3>
              <p className="text-xs text-[#6B6B65]">
                Configure direct delivery via WhatsApp or Email in 18 languages.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#7A7A72] hover:text-[#252522] hover:bg-[#F7F7F2] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Recipient Type Toggle: Individual vs WhatsApp Group */}
        <div className="flex items-center gap-2 p-1 rounded-full bg-[#F4F4EE] border border-black/[0.06] mb-5">
          <button
            type="button"
            onClick={() => setRecipientType('individual')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-full text-xs font-medium transition-all ${
              recipientType === 'individual'
                ? 'bg-white text-[#1A1A18] shadow-xs font-semibold'
                : 'text-[#7A7A72] hover:text-[#1A1A18]'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Individual Contact</span>
          </button>

          <button
            type="button"
            onClick={() => setRecipientType('group')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-full text-xs font-medium transition-all ${
              recipientType === 'group'
                ? 'bg-white text-[#1A1A18] shadow-xs font-semibold'
                : 'text-[#7A7A72] hover:text-[#1A1A18]'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-[#25D366]" />
            <span>WhatsApp Team Group</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Select Target Language from 18 Languages */}
          <div>
            <label className="block text-xs font-medium text-[#7A7A72] mb-1.5 font-sans">
              Delivery Language
            </label>
            <select
              value={selectedLangCode}
              onChange={(e) => {
                setSelectedLangCode(e.target.value);
                const meta = getLanguageMeta(e.target.value);
                if (recipientType === 'individual') {
                  setName(`${meta.name} Engineer`);
                } else {
                  setGroupName(`${meta.name} Team Group`);
                }
              }}
              className="w-full px-4 py-3 rounded-2xl bg-[#F7F7F2] border border-black/[0.08] text-sm text-[#252522] focus:outline-none focus:border-black/30 focus:bg-white cursor-pointer font-sans"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code} className="bg-white text-[#252522]">
                  {lang.flag} {lang.name} ({lang.nativeName})
                </option>
              ))}
            </select>
          </div>

          {recipientType === 'individual' ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Teammate Name */}
                <div>
                  <label className="block text-xs font-medium text-[#7A7A72] mb-1.5 font-sans">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-[#F7F7F2] border border-black/[0.08] text-sm text-[#252522] focus:outline-none focus:border-black/30 focus:bg-white font-sans"
                    placeholder="e.g. Carlos Mendez"
                    required
                  />
                </div>

                {/* Role */}
                <div>
                  <label className="block text-xs font-medium text-[#7A7A72] mb-1.5 font-sans">
                    Team Role
                  </label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-[#F7F7F2] border border-black/[0.08] text-sm text-[#252522] focus:outline-none focus:border-black/30 focus:bg-white font-sans"
                    placeholder="e.g. Cloud Lead"
                    required
                  />
                </div>
              </div>

              {/* WhatsApp Phone Number */}
              <div>
                <label className="block text-xs font-medium text-[#7A7A72] mb-1.5 font-sans flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#25D366]" />
                  <span>WhatsApp Number (with country code)</span>
                </label>
                <input
                  type="text"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#F7F7F2] border border-black/[0.08] text-sm text-[#252522] focus:outline-none focus:border-black/30 focus:bg-white font-sans"
                  placeholder="+91 98765 43210"
                />
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-medium text-[#7A7A72] mb-1.5 font-sans flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#7A7A72]" />
                  <span>Email Address</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#F7F7F2] border border-black/[0.08] text-sm text-[#252522] focus:outline-none focus:border-black/30 focus:bg-white font-sans"
                  placeholder="carlos@company.com"
                />
              </div>
            </>
          ) : (
            <>
              {/* WhatsApp Group Name */}
              <div>
                <label className="block text-xs font-medium text-[#7A7A72] mb-1.5 font-sans">
                  WhatsApp Group Name
                </label>
                <input
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-[#F7F7F2] border border-black/[0.08] text-sm text-[#252522] focus:outline-none focus:border-black/30 focus:bg-white font-sans"
                  placeholder="e.g. Madrid Cloud Operations Group"
                  required
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F0FDF4] border border-[#25D366]/20 text-xs text-[#166534] space-y-1">
                <span className="font-semibold flex items-center gap-1.5 text-[#15803D]">
                  <Users className="w-3.5 h-3.5 text-[#25D366]" />
                  Universal WhatsApp Group Forwarding
                </span>
                <p className="text-[11px] leading-relaxed">
                  When you confirm & dispatch this card, Bhasha will open your WhatsApp with the full translated message ready to select and send to <strong>{groupName || 'any group'}</strong> with one click!
                </p>
              </div>
            </>
          )}

          <div className="pt-3 flex items-center justify-end gap-3 border-t border-black/[0.06]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full text-xs font-medium text-[#7A7A72] hover:text-[#252522] hover:bg-[#F7F7F2] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full text-xs font-medium bg-[#1A1A18] hover:bg-[#333330] text-[#FFFCFA] shadow-xs transition-all hover:scale-105"
            >
              <Plus className="w-3.5 h-3.5 text-[#D1E043]" />
              <span>Add to Team Relay</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
