import { MeaningPacket, RenderedCard, TeammateProfile } from '@/types';

export const TEAMMATE_PROFILES: TeammateProfile[] = [
  {
    id: 'sender-manager',
    name: 'Ananya (Manager)',
    role: 'Engineering Lead',
    preferred_language: 'en',
    language_label: 'English / Hinglish (Speaker)',
    avatar: '👩‍💼',
    is_current_sender: true,
  },
  {
    id: 'assignee-rahul',
    name: 'Rahul Sharma',
    role: 'DevOps Engineer',
    preferred_language: 'hi',
    language_label: 'हिन्दी (Hindi)',
    avatar: '👨‍💻',
  },
  {
    id: 'teammate-kenji',
    name: 'Kenji Sato',
    role: 'QA Lead',
    preferred_language: 'ja',
    language_label: '日本語 (Japanese)',
    avatar: '👨‍🔬',
  },
];

export const DEFAULT_SAMPLE_PACKET: MeaningPacket = {
  task_id: 'task-sample-deployment-v1',
  version: 1,
  raw_transcript: 'Kal Rahul deployment kare, but only after tests pass — deadline 4 PM.',
  detected_languages: ['hi', 'en'],
  action: 'Deploy application to production',
  locked_fields: {
    owner: 'Rahul',
    deadline: 'Tomorrow, 4:00 PM IST',
    conditions: ['Only after all tests pass successfully'],
    critical_values: [{ label: 'Priority', value: 'High' }],
  },
  status: 'pending_confirmation',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const DEFAULT_SAMPLE_RENDERS: RenderedCard[] = [
  {
    task_id: 'task-sample-deployment-v1',
    version: 1,
    language_code: 'en',
    language_label: 'English',
    rendered_headline: 'Production Deployment Task',
    rendered_body: 'Rahul is requested to execute the deployment tomorrow by 4:00 PM IST, only after test suites pass.',
    displayed_locked_fields: {
      owner: 'Rahul',
      deadline: 'Tomorrow, 4:00 PM IST',
      conditions: ['Only after all tests pass successfully'],
    },
    is_locked_fact_intact: true,
  },
  {
    task_id: 'task-sample-deployment-v1',
    version: 1,
    language_code: 'hi',
    language_label: 'हिन्दी (Hindi)',
    rendered_headline: 'प्रोडक्शन डिप्लॉयमेंट कार्य',
    rendered_body: 'राहुल को कल शाम 4:00 PM IST तक एप्लिकेशन डिप्लॉय करना है, लेकिन केवल तभी जब सभी टेस्ट पास हो जाएं।',
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
