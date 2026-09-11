import { MeaningPacket, RenderedCard, TeammateProfile } from '@/types';

export const TEAMMATE_PROFILES: TeammateProfile[] = [
  {
    id: 'sender-manager',
    name: 'Ananya (Manager)',
    role: 'Engineering Lead',
    preferred_language: 'en',
    language_label: 'English / Hinglish (Speaker)',
    avatar: 'A',
    is_current_sender: true,
    recipient_type: 'individual',
    whatsapp_number: '+919876543210',
    email: 'ananya@bhasha.team',
  },
  {
    id: 'assignee-rahul',
    name: 'Rahul Sharma',
    role: 'DevOps Engineer',
    preferred_language: 'hi',
    language_label: 'हिन्दी (Hindi)',
    avatar: 'R',
    recipient_type: 'individual',
    whatsapp_number: '+919811223344',
    email: 'rahul.devops@bhasha.team',
  },
  {
    id: 'teammate-kenji',
    name: 'Kenji Sato',
    role: 'QA Lead',
    preferred_language: 'ja',
    language_label: '日本語 (Japanese)',
    avatar: 'K',
    recipient_type: 'group',
    group_name: 'Tokyo Sprint Sync Group',
    email: 'kenji.qa@bhasha.jp',
  },
];

export const DEFAULT_SAMPLE_PACKET: MeaningPacket = {
  task_id: 'task-sample-meeting-v1',
  version: 1,
  raw_transcript: 'hey so the meeting time is at 5:00 p.m. to Ham sab log Anurag ke ghar Milenge aur FIR Udhar Milkar Sab Kuchh discuss Karenge theek hai is that all right',
  detected_languages: ['hi', 'en'],
  action: 'Meeting at 5:00 PM at Anurag\'s house to discuss everything',
  locked_fields: {
    owner: 'Anurag',
    deadline: 'Today, 5:00 PM',
    conditions: ['If everyone is free'],
    critical_values: [{ label: 'Time', value: '5:00 PM' }],
  },
  status: 'pending_confirmation',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const DEFAULT_SAMPLE_RENDERS: RenderedCard[] = [
  {
    task_id: 'task-sample-meeting-v1',
    version: 1,
    language_code: 'en',
    language_label: 'English',
    rendered_headline: 'Meeting Update',
    rendered_body: 'Hey, so the meeting is at 5:00 PM. We will all meet at Anurag\'s house and discuss everything there, okay? Is that all right?',
    displayed_locked_fields: {
      owner: 'Anurag',
      deadline: 'Today, 5:00 PM',
      conditions: ['If everyone is free'],
    },
    is_locked_fact_intact: true,
  },
  {
    task_id: 'task-sample-meeting-v1',
    version: 1,
    language_code: 'hi',
    language_label: 'हिन्दी (Hindi)',
    rendered_headline: 'मीटिंग का समय',
    rendered_body: 'अरे, तो मीटिंग का समय शाम 5:00 बजे है। हम सब लोग अनुराग के घर मिलेंगे और फिर उधर मिलकर सब कुछ डिस्कस करेंगे, ठीक है?',
    displayed_locked_fields: {
      owner: 'Rahul (राहुल)',
      deadline: 'Tomorrow, 4:00 PM IST (कल शाम 4:00 PM)',
      conditions: ['सभी टेस्ट पास होने के बाद ही (Only after tests pass)'],
    },
    is_locked_fact_intact: true,
  },
  {
    task_id: 'task-sample-deployment-v1',
    version: 1,
    language_code: 'ja',
    language_label: '日本語 (Japanese)',
    rendered_headline: '本番デプロイタスク',
    rendered_body: 'Rahulは明日午後4:00 PM ISTまでにアプリケーションをデプロイしてください。ただしテスト合格後のみ実行可能です。',
    displayed_locked_fields: {
      owner: 'Rahul',
      deadline: 'Tomorrow, 4:00 PM IST (明日 16:00)',
      conditions: ['テスト合格後のみ (Only after tests pass)'],
    },
    is_locked_fact_intact: true,
  },
];

export const SAMPLE_AUDIO_CASES = [
  {
    id: 'sample-1',
    title: 'Hinglish Deployment Task (Core Demo)',
    speaker: 'Ananya (Manager)',
    transcript: 'Kal Rahul deployment kare, but only after tests pass — deadline 4 PM.',
    audioDescription: 'Mixed Hindi-English voice instruction with conditions & time lock',
    packet: DEFAULT_SAMPLE_PACKET,
    renders: DEFAULT_SAMPLE_RENDERS,
  },
  {
    id: 'sample-2',
    title: 'Voice Correction: Shift to 5 PM',
    speaker: 'Rahul (Assignee)',
    transcript: 'Actually make that 5 PM, integration tests are taking longer.',
    audioDescription: 'Voice delta updating the deadline lock without touching owner or condition',
    deltaTarget: 'locked_fields.deadline',
    newDeadline: 'Tomorrow, 5:00 PM IST',
  },
];
