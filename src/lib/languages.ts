export interface SupportedLanguage {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  headline: string;
}

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', headline: 'Task Assignment' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', headline: 'कार्य आवंटन' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', headline: '割り当てタスク' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', headline: 'Asignación de Tarea' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', headline: 'Attribution de Tâche' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', headline: 'Aufgabenzuweisung' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹', headline: 'Assegnazione Attività' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷', headline: 'Atribuição de Tarefa' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱', headline: 'Taaktoewijzing' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳', headline: '任务分配' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷', headline: '작업 할당' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺', headline: 'Назначение задачи' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷', headline: 'Görev Ataması' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', headline: 'إسناد المهمة' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski', flag: '🇵🇱', headline: 'Przydział zadania' },
  { code: 'uk', name: 'Ukrainian', nativeName: 'Українська', flag: '🇺🇦', headline: 'Призначення завдання' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳', headline: 'Phân công nhiệm vụ' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩', headline: 'Penugasan Tugas' },
];

export function getLanguageMeta(code: string): SupportedLanguage {
  const found = SUPPORTED_LANGUAGES.find((l) => l.code === code.toLowerCase());
  return (
    found || {
      code,
      name: code.toUpperCase(),
      nativeName: code.toUpperCase(),
      flag: '🌐',
      headline: 'Task Assignment',
    }
  );
}
