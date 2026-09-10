'use client';

import React, { useState } from 'react';
import { TeammateProfile, MeaningPacket, RenderedCard } from '@/types';
import { UserPlus, X, Globe, Sparkles, Check } from 'lucide-react';

interface AddTeammateModalProps {
  isOpen: boolean;
  onClose: () => void;
  packet: MeaningPacket;
  onAddTeammate: (teammate: TeammateProfile, renderCard: RenderedCard) => void;
}

interface LanguageOption {
  code: string;
  name: string;
  nativeLabel: string;
  flag: string;
  defaultAvatar: string;
  sampleHeadline: string;
  sampleBody: string;
}

const LANGUAGE_OPTIONS: LanguageOption[] = [
  {
    code: 'es',
    name: 'Spanish',
    nativeLabel: 'Español',
    flag: '🇪🇸',
    defaultAvatar: '👨‍🎨',
    sampleHeadline: 'Tarea de Despliegue en Producción',
    sampleBody: 'Por favor ejecute el despliegue del módulo de autenticación mañana antes de las 4:00 PM IST. Condición estricta: Solo después de que pasen todas las pruebas.',
  },
  {
    code: 'de',
    name: 'German',
    nativeLabel: 'Deutsch',
    flag: '🇩🇪',
    defaultAvatar: '👩‍🔬',
    sampleHeadline: 'Produktions-Bereitstellungsaufgabe',
    sampleBody: 'Bitte führen Sie das Deployment des Authentifizierungsmoduls bis morgen 16:00 Uhr IST durch. Voraussetzung: Nur wenn alle Tests erfolgreich bestanden sind.',
  },
  {
    code: 'fr',
    name: 'French',
    nativeLabel: 'Français',
    flag: '🇫🇷',
    defaultAvatar: '👨‍💼',
    sampleHeadline: 'Tâche de Déploiement en Production',
    sampleBody: 'Veuillez déployer le module d\'authentification demain avant 16h00 IST. Condition bloquante: Uniquement après réussite de tous les tests.',
  },
  {
    code: 'zh',
    name: 'Mandarin',
    nativeLabel: '中文 (Simplified)',
    flag: '🇨🇳',
    defaultAvatar: '👩‍💻',
    sampleHeadline: '生产环境部署任务',
    sampleBody: '请在明天下午4:00 IST前完成认证模块的部署上线。严格前提条件：必须在所有自动化测试通过后方可执行。',
  },
];

export const AddTeammateModal: React.FC<AddTeammateModalProps> = ({
  isOpen,
  onClose,
  packet,
  onAddTeammate,
}) => {
  const [selectedLang, setSelectedLang] = useState<LanguageOption>(LANGUAGE_OPTIONS[0]);
  const [name, setName] = useState('Carlos Mendez');
  const [role, setRole] = useState('Cloud Infrastructure Engineer');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newTeammate: TeammateProfile = {
      id: `teammate-${selectedLang.code}-${Date.now()}`,
      name: name.trim() || `${selectedLang.name} Teammate`,
      role: role.trim() || 'Software Engineer',
      preferred_language: selectedLang.code,
      language_label: `${selectedLang.flag} ${selectedLang.nativeLabel}`,
      avatar: selectedLang.defaultAvatar,
    };

    const newRenderCard: RenderedCard = {
      task_id: packet.task_id,
      version: packet.version,
      language_code: selectedLang.code,
      language_label: selectedLang.nativeLabel,
      rendered_headline: selectedLang.sampleHeadline,
      rendered_body: selectedLang.sampleBody,
      displayed_locked_fields: {
        owner: packet.locked_fields.owner || 'Rahul',
        deadline: packet.locked_fields.deadline || 'Tomorrow, 4:00 PM IST',
        conditions: packet.locked_fields.conditions.length > 0 ? packet.locked_fields.conditions : ['Only after all tests pass'],
      },
      is_locked_fact_intact: true,
    };

    onAddTeammate(newTeammate, newRenderCard);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg glass-panel-elevated rounded-3xl p-6 md:p-8 border border-teal-500/30 shadow-2xl">
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-teal-500/15 text-teal-400 border border-teal-500/30">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Add Global Teammate Relay</h3>
              <p className="text-xs text-slate-400">
                Render the Meaning Packet live in another language with 0% fact drift.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Select Target Language */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
              Select Relay Language
            </label>
            <div className="grid grid-cols-2 gap-2">
              {LANGUAGE_OPTIONS.map((lang) => (
                <button
                  type="button"
                  key={lang.code}
                  onClick={() => {
                    setSelectedLang(lang);
                    if (lang.code === 'es') setName('Carlos Mendez');
                    if (lang.code === 'de') setName('Stefan Weber');
                    if (lang.code === 'fr') setName('Camille Laurent');
                    if (lang.code === 'zh') setName('Mei Zhang');
                  }}
                  className={`p-3 rounded-xl text-left border transition-all ${
                    selectedLang.code === lang.code
                      ? 'bg-teal-950/60 border-teal-400 text-teal-200 shadow-md'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{lang.flag}</span>
                    <div className="overflow-hidden">
                      <div className="text-xs font-bold truncate">{lang.name}</div>
                      <div className="text-[10px] text-slate-400 truncate">{lang.nativeLabel}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Teammate Name */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">
              Teammate Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-teal-500"
              placeholder="e.g. Carlos Mendez"
              required
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">
              Engineering Role
            </label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-teal-500"
              placeholder="e.g. Cloud Infrastructure Engineer"
              required
            />
          </div>

          {/* Preview of Invariant Guarantee */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-teal-500/25 text-xs text-slate-300">
            <span className="font-mono text-[10px] uppercase tracking-wider text-teal-400 block mb-1">
              Invariant Inheritance Verification
            </span>
            <p className="text-[11px] text-slate-400">
              The new card will immediately inherit: <strong className="text-slate-200">Owner: {packet.locked_fields.owner}</strong>, <strong className="text-slate-200">Deadline: {packet.locked_fields.deadline}</strong> with zero manual translation hops.
            </p>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-850 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold bg-teal-500 hover:bg-teal-400 text-slate-950 shadow-lg shadow-teal-500/25 transition-all hover:scale-105"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Spawn Live Relay View</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
