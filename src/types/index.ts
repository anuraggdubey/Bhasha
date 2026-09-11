// ==============================================================================
// Bhasha — Core Type Definitions & Data Contracts
// Single Source of Truth for Dev 1 (Joshna), Dev 2 (Saloni), and Dev 3 (Anurag)
// ==============================================================================

export type TaskStatus =
  | 'pending_confirmation'
  | 'confirmed'
  | 'modified'
  | 'in_progress'
  | 'done';

export interface CriticalValue {
  label: string;
  value: string;
}

export interface LockedFields {
  owner: string | null;
  deadline: string | null;
  conditions: string[];
  critical_values?: CriticalValue[];
}

export interface MeaningPacket {
  task_id: string;
  version: number;
  raw_transcript: string;
  detected_languages: string[];
  action: string;
  locked_fields: LockedFields;
  status: TaskStatus;
  created_at: string;
  updated_at: string;
}

export interface RenderedCard {
  task_id: string;
  version: number;
  language_code: string; // e.g. 'en' | 'hi' | 'ja'
  language_label: string; // e.g. 'English', 'हिन्दी', '日本語'
  rendered_headline: string;
  rendered_body: string;
  displayed_locked_fields: {
    owner: string;
    deadline: string;
    conditions: string[];
  };
  is_locked_fact_intact: boolean;
}

export interface VoiceDeltaChange {
  field: 'locked_fields.deadline' | 'locked_fields.owner' | 'locked_fields.conditions' | 'action';
  previous_value: string | string[] | null;
  new_value: string | string[];
}

export interface VoiceCorrectionRequest {
  task_id: string;
  spoken_by?: string;
  spoken_language?: string;
  correction_transcript: string;
}

export interface TeammateProfile {
  id: string;
  name: string;
  role: string;
  preferred_language: 'en' | 'hi' | 'ja' | 'es' | 'de' | 'fr' | 'zh' | string;
  language_label: string;
  avatar: string;
  is_current_sender?: boolean;
  recipient_type?: 'individual' | 'group';
  whatsapp_number?: string;
  email?: string;
  group_name?: string;
  last_dispatched_at?: string;
  dispatched_channel?: 'whatsapp' | 'whatsapp_group' | 'email';
}

export interface DispatchRecord {
  id: string;
  teammate_id: string;
  recipient_name: string;
  channel: 'whatsapp' | 'whatsapp_group' | 'email';
  language: string;
  headline: string;
  timestamp: string;
  status: 'sent' | 'delivered';
}

// API Responses
export interface DictateResponse {
  status: 'success' | 'error';
  transcript: string;
  confidence?: number;
  detected_languages?: string[];
  error?: string;
}

export interface ExtractResponse {
  status: 'success' | 'error';
  packet?: MeaningPacket;
  error?: string;
}

export interface RenderResponse {
  status: 'success' | 'error';
  task_id: string;
  renders?: RenderedCard[];
  error?: string;
}

export interface CorrectResponse {
  status: 'success' | 'error';
  updated_packet?: MeaningPacket;
  renders?: RenderedCard[];
  delta?: VoiceDeltaChange[];
  error?: string;
}
