'use client';

import React, { useState, useEffect } from 'react';
import { TeammateProfile } from '@/types';
import { X, Check, Users, User, Phone, Mail, Sparkles, Pencil } from 'lucide-react';
import { SUPPORTED_LANGUAGES, getLanguageMeta } from '@/lib/languages';

interface EditTeammateModalProps {
  isOpen: boolean;
  onClose: () => void;
  teammate: TeammateProfile | null;
  onSaveTeammate: (updatedTeammate: TeammateProfile) => void;
}

export const EditTeammateModal: React.FC<EditTeammateModalProps> = ({
  isOpen,
  onClose,
  teammate,
  onSaveTeammate,
}) => {
  const [recipientType, setRecipientType] = useState<'individual' | 'group'>('individual');
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [preferredLang, setPreferredLang] = useState('en');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [email, setEmail] = useState('');
  const [groupName, setGroupName] = useState('');
  const [avatar, setAvatar] = useState('👨‍💻');

  useEffect(() => {
    if (teammate) {
      setRecipientType(teammate.recipient_type || 'individual');
      setName(teammate.name || '');
      setRole(teammate.role || '');
      setPreferredLang(teammate.preferred_language || 'en');
      setWhatsappNumber(teammate.whatsapp_number || '');
      setEmail(teammate.email || '');
      setGroupName(teammate.group_name || teammate.name || '');
      setAvatar(teammate.avatar || '👨‍💻');
    }
  }, [teammate]);

  if (!isOpen || !teammate) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const langMeta = getLanguageMeta(preferredLang);
    const isGroup = recipientType === 'group';

    const updated: TeammateProfile = {
      ...teammate,
      name: isGroup ? groupName.trim() || teammate.name : name.trim() || teammate.name,
      role: isGroup ? 'WhatsApp Team Group' : role.trim() || teammate.role,
      preferred_language: preferredLang,
      language_label: `${langMeta.flag} ${langMeta.nativeName}`,
      recipient_type: recipientType,
      whatsapp_number: isGroup ? undefined : whatsappNumber.trim() || undefined,
      email: email.trim() || undefined,
      group_name: isGroup ? groupName.trim() || teammate.name : undefined,
      avatar: (isGroup ? groupName : name || 'T').trim().charAt(0).toUpperCase(),
    };

    onSaveTeammate(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#FFFCFA] rounded-3xl p-7 md:p-8 border border-black/[0.1] shadow-2xl text-[#252522]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-black/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#F5F5F0] border border-black/[0.06] flex items-center justify-center text-lg">
              <Pencil className="w-4 h-4 text-[#1A1A18]" />
            </div>
            <div>
              <h3 className="font-editorial text-2xl font-normal text-[#1A1A18]">
                Edit Teammate
              </h3>
              <p className="text-xs text-[#7A7A72]">
                Update contact channels, role, or preferred delivery language.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#7A7A72] hover:text-[#1A1A18] hover:bg-[#F2F2EC] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Type Toggle: Individual vs WhatsApp Group */}
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
            <span>WhatsApp Group</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Initial Letter Avatar Preview */}
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#FAF9F6] border border-black/[0.04]">
            <div className="w-10 h-10 rounded-full bg-[#F2F2EC] text-[#252522] border border-black/[0.08] font-editorial text-base font-semibold flex items-center justify-center shrink-0 shadow-2xs">
              {(recipientType === 'group' ? groupName : name || 'T').trim().charAt(0).toUpperCase() || 'T'}
            </div>
            <div>
              <span className="text-xs font-semibold text-[#1A1A18] block">Avatar Badge</span>
              <span className="text-[11px] text-[#7A7A72]">Generated from initial letter</span>
            </div>
          </div>

          {/* Delivery Language */}
          <div>
            <label className="block text-xs font-medium text-[#7A7A72] mb-1.5 font-sans">
              Delivery Language
            </label>
            <select
              value={preferredLang}
              onChange={(e) => setPreferredLang(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-[#F7F7F2] border border-black/[0.08] text-sm text-[#1A1A18] focus:outline-none focus:border-black/30 focus:bg-white cursor-pointer font-sans"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code} className="bg-white text-[#1A1A18]">
                  {lang.flag} {lang.name} ({lang.nativeName})
                </option>
              ))}
            </select>
          </div>

          {recipientType === 'individual' ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#7A7A72] mb-1.5 font-sans">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-[#F7F7F2] border border-black/[0.08] text-sm text-[#1A1A18] focus:outline-none focus:border-black/30 focus:bg-white font-sans"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#7A7A72] mb-1.5 font-sans">
                    Role
                  </label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-[#F7F7F2] border border-black/[0.08] text-sm text-[#1A1A18] focus:outline-none focus:border-black/30 focus:bg-white font-sans"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#7A7A72] mb-1.5 font-sans flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#25D366]" />
                  <span>WhatsApp Number</span>
                </label>
                <input
                  type="text"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#F7F7F2] border border-black/[0.08] text-sm text-[#1A1A18] focus:outline-none focus:border-black/30 focus:bg-white font-sans"
                  placeholder="+91 98765 43210"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#7A7A72] mb-1.5 font-sans flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#7A7A72]" />
                  <span>Email Address</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#F7F7F2] border border-black/[0.08] text-sm text-[#1A1A18] focus:outline-none focus:border-black/30 focus:bg-white font-sans"
                  placeholder="name@company.com"
                />
              </div>
            </>
          ) : (
            <div>
              <label className="block text-xs font-medium text-[#7A7A72] mb-1.5 font-sans">
                WhatsApp Group Name
              </label>
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-[#F7F7F2] border border-black/[0.08] text-sm text-[#1A1A18] focus:outline-none focus:border-black/30 focus:bg-white font-sans"
                placeholder="e.g. Tokyo Sprint Sync Group"
                required
              />
            </div>
          )}

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-black/[0.06]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full text-xs font-medium text-[#7A7A72] hover:text-[#1A1A18] hover:bg-[#F2F2EC] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full text-xs font-medium bg-[#1A1A18] hover:bg-[#2C2C28] text-[#FFFCFA] shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Check className="w-3.5 h-3.5 text-[#D1E043]" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
