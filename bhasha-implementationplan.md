# Bhasha — Master Technical Implementation Plan
### "One Meaning, Every Language"
**AssemblyAI Voice Hackathon Week: Hack into Dictation (Sept 9–13, 2026)**

---

## 1. Project Overview & Core Philosophy

**Bhasha** is a voice-first task handoff and orchestration system designed for multilingual teams. In modern global and regional teams (e.g., in India, Southeast Asia, or global remote hubs), individuals naturally think and speak in code-switched dialects (e.g., Hinglish: mixing Hindi and English). 

### The Problem
Traditional translation tools translate *sentences* sequentially (e.g., Manager $\rightarrow$ English $\rightarrow$ Hindi $\rightarrow$ Japanese). This causes **semantic fact drift** — critical numbers, names, deadlines, and conditional clauses silently morph or get dropped (e.g., "4 PM" becoming "4 AM", or "only after tests pass" being translated away).

### The Solution: The Meaning Packet
Bhasha does **not** perform sentence-to-sentence translation. Instead, it extracts the input speech into a single canonical, language-agnostic data structure: the **Meaning Packet**.
- **Locked Fields (🔒)**: Names, dates, times, numerical amounts, and logical constraints. Extracted once, validated, and injected verbatim or transliterated across all renders.
- **Flexible Fields**: The conversational action clause, which is rendered naturally and idiomatically into each recipient's chosen language.
- **Voice-Driven Delta Corrections**: Teammates can speak corrections (e.g., *"Actually push it to 5 PM"*), mutating the central Meaning Packet, which immediately cascades across all language views.

---

## 2. Team Structure & Contributor Ownership Matrix

The project is divided across two developers with clear separation of concerns, ensuring high velocity and zero merge conflicts.

```
┌───────────────────────────────────────────────────────────────────────────────┐
│                           TEAM RESPONSIBILITY MATRIX                          │
├───────────────────┬───────────────────┬───────────────────────────────────────┤
│ Contributor       │ Core Role         │ Key Deliverables                      │
├───────────────────┼───────────────────┼───────────────────────────────────────┤
│ DEV 1: JOSHNA     │ Frontend Lead &   │ • Full UI/UX Design System            │
│                   │ UI Architecture   │ • Voice Studio & Team Relay Dashboards│
│                   │                   │ • Audio Recorder & Waveform Component │
│                   │                   │ • "Fact-Lock Proof" Visual Inspector  │
│                   │                   │ • Frontend API Client & State Sync    │
├───────────────────┼───────────────────┼───────────────────────────────────────┤
│ DEV 2: ANURAG     │ Full-Stack Lead,  │ • AssemblyAI Dictation API Pipeline   │
│                   │ AI STT/LLM Engine,│ • LLM Meaning Packet Extractor (Locks)│
│                   │ Backend, DevOps & │ • 18-Language Context Rendering Engine│
│                   │ Documentation     │ • Voice Delta Correction Processor    │
│                   │                   │ • WhatsApp & Email Dispatch Subsystems│
│                   │                   │ • REST API Endpoints, SSE & Store     │
│                   │                   │ • Repo Setup, Types, CI/CD & Deploy   │
│                   │                   │ • Project Documentation & Presentation│
└───────────────────┴───────────────────┴───────────────────────────────────────┘
```

---

## 3. End-to-End System Architecture

```
                                  VOICE INPUT
                          (Code-switched, e.g. Hinglish)
                                       │
                                       ▼
                     ┌───────────────────────────────────┐
                     │   DEV 1 (Joshna): UI Audio Capture │
                     │   • Web Audio API / MediaRecorder │
                     │   • Live Canvas Waveform          │
                     └─────────────────┬─────────────────┘
                                       │ Audio Blob (WAV/WebM)
                                       ▼
                     ┌───────────────────────────────────┐
                     │   DEV 2 (Anurag): Audio Ingestion │
                     │   POST /api/dictate               │
                     └─────────────────┬─────────────────┘
                                       │
                                       ▼
                     ┌───────────────────────────────────┐
                     │   AssemblyAI Dictation API (Beta) │
                     │   Model: Universal-3.5 Pro        │
                     │   • Native Code-Switching         │
                     │   • Automatic Filler Removal      │
                     └─────────────────┬─────────────────┘
                                       │ Clean Raw Transcript
                                       ▼
                     ┌───────────────────────────────────┐
                     │   DEV 2 (Anurag): Extraction LLM  │
                     │   Speech ──> Meaning Packet       │
                     │   • Tag & lock facts (🔒)         │
                     │   • Validate strict JSON Schema   │
                     └─────────────────┬─────────────────┘
                                       │ Canonical Meaning Packet
                                       ▼
                     ┌───────────────────────────────────┐
                     │   DEV 2 (Anurag): Task Store      │
                     │   • In-Memory Canonical Store     │
                     │   • Task History & Versioning     │
                     └─────────────────┬─────────────────┘
                                       │ Broadcast Event
                                       ▼
                     ┌───────────────────────────────────┐
                     │   DEV 2 (Anurag): Multi-Language  │
                     │   Rendering & Dispatch Engine     │
                     │   • 18 Language Renders (Locked)  │
                     │   • WhatsApp & Email Dispatch     │
                     └─────────────────┬─────────────────┘
                                       │ WebSocket / SSE Push
                                       ▼
                     ┌───────────────────────────────────┐
                     │   DEV 1 (Joshna): UI Dashboards   │
                     │   • Voice Studio & Team Relay     │
                     │   • 18-Language Member Views      │
                     │   • Side-by-Side Fact Proof View  │
                     │   • Real-Time Dispatch Drawer     │
                     └───────────────────────────────────┘
```

---

## 4. Canonical Data Schemas & Contracts

### 4.1. Meaning Packet JSON Schema (`MeaningPacket`)
This schema represents the single source of truth for every task.

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "MeaningPacket",
  "type": "object",
  "required": [
    "task_id",
    "version",
    "raw_transcript",
    "detected_languages",
    "action",
    "locked_fields",
    "status",
    "created_at",
    "updated_at"
  ],
  "properties": {
    "task_id": {
      "type": "string",
      "format": "uuid",
      "description": "Unique identifier for the task"
    },
    "version": {
      "type": "integer",
      "description": "Monotonically increasing version counter updated upon voice corrections"
    },
    "raw_transcript": {
      "type": "string",
      "description": "Cleaned verbatim transcript returned by AssemblyAI"
    },
    "detected_languages": {
      "type": "array",
      "items": { "type": "string" },
      "example": ["hi", "en"]
    },
    "action": {
      "type": "string",
      "description": "Core intent or operation to be carried out (flexible field)",
      "example": "Deploy application to production"
    },
    "locked_fields": {
      "type": "object",
      "required": ["owner", "deadline", "conditions", "critical_values"],
      "properties": {
        "owner": {
          "type": "string",
          "description": "Assignee or responsible entity (immutable)",
          "example": "Rahul"
        },
        "deadline": {
          "type": "string",
          "description": "Date, time, or relative moment (immutable)",
          "example": "Tomorrow, 4:00 PM IST"
        },
        "conditions": {
          "type": "array",
          "items": { "type": "string" },
          "description": "Logical prerequisites or gating constraints",
          "example": ["Only after all test suites pass successfully"]
        },
        "critical_values": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "label": { "type": "string", "example": "Version" },
              "value": { "type": "string", "example": "v2.4.0" }
            }
          }
        }
      }
    },
    "status": {
      "type": "string",
      "enum": ["pending_confirmation", "confirmed", "modified", "in_progress", "done"],
      "default": "pending_confirmation"
    },
    "created_at": { "type": "string", "format": "date-time" },
    "updated_at": { "type": "string", "format": "date-time" }
  }
}
```

### 4.2. Rendered Task Card Schema (`RenderedCard`)
Returned to DEV 1 (Joshna) for displaying cards in specific teammates' languages.

```json
{
  "task_id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
  "version": 1,
  "language_code": "hi",
  "language_label": "हिन्दी (Hindi)",
  "rendered_headline": "एप्लिकेशन डिप्लॉयमेंट",
  "rendered_body": "राहुल को कल शाम 4:00 PM IST तक एप्लिकेशन डिप्लॉय करना है, लेकिन केवल तभी जब सभी टेस्ट पास हो जाएं।",
  "displayed_locked_fields": {
    "owner": "Rahul (राहुल)",
    "deadline": "Tomorrow, 4:00 PM IST (कल शाम 4:00 PM)",
    "conditions": ["सभी टेस्ट पास होने के बाद ही (Only after tests pass)"]
  },
  "is_locked_fact_intact": true
}
```

### 4.3. Voice Delta Correction Schema (`VoiceCorrectionRequest`)
When someone speaks a correction:

```json
{
  "task_id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
  "spoken_by": "Rahul",
  "spoken_language": "en",
  "correction_transcript": "Actually push the deadline to 5 PM and assign Amit as co-owner",
  "delta_changes": [
    {
      "field": "locked_fields.deadline",
      "previous_value": "Tomorrow, 4:00 PM IST",
      "new_value": "Tomorrow, 5:00 PM IST"
    }
  ]
}
```

---

## 5. Detailed Responsibilities Breakdown

---

### DEV 1: JOSHNA (Frontend Architecture, UI/UX & Interactive Views)

**Primary Objective**: Deliver a high-impact, premium user interface that makes the core "Fact-Locked Meaning Packet" value immediately obvious to judges in under 10 seconds.

#### Detailed Deliverables for Joshna:
1. **Application Shell & Layout**:
   - Split-screen multi-teammate simulation view:
     - **Pane 1 (Sender / Manager)**: Hinglish/English voice input view with mic recording status.
     - **Pane 2 (Assignee / Rahul)**: Hindi localized view with immediate live updates.
     - **Pane 3 (Teammate / Kenji)**: Japanese localized view demonstrating global team relay.
   - Global layout toggle: Switch between "Split Screen View" (for demo) and "Single User View" (mobile/standalone).
   - Modern, high-contrast dark/light design system using CSS tokens, sleek glassmorphism, and smooth micro-animations.

2. **Audio Recorder & Waveform Component**:
   - Record audio using browser `MediaRecorder` / Web Audio API.
   - Audio format output: 16kHz WAV or WebM blob.
   - Real-time SVG/Canvas audio waveform visualizer showing active mic input.
   - Timer counter and "Transcribing with AssemblyAI..." animated pulse status indicator.
   - Fallback button: "Load Sample Audio" (calls Dev 3's pre-recorded samples for zero-latency live judging).

3. **"Fact-Lock Proof" Visual Component**:
   - An interactive side-by-side inspection component.
   - Highlights locked values (`Rahul`, `4 PM`, `only after tests pass`) with glowing badges (🔒).
   - Visual connector or synchronized hover: Hovering over "4 PM" in English highlights the corresponding locked node in Hindi and Japanese.
   - Differentiates flexible wording vs locked facts.

4. **Task Lifecycle UI**:
   - Status transitions: Extracted $\rightarrow$ Pending Confirmation $\rightarrow$ Confirmed $\rightarrow$ Updated.
   - Quick Voice Correction Modal: Teammate clicks mic on their card, speaks a correction, and watches the animation ripple across all screens.

5. **Frontend API Integration**:
   - Implement `apiClient.ts` to call backend endpoints.
   - Setup WebSocket or Server-Sent Events (SSE) listener for reactive updates.

---

### DEV 2: ANURAG (Full-Stack Backend Lead, AssemblyAI STT/LLM Engine, WhatsApp/Email Dispatch, DevOps & QA)

**Primary Objective**: Engineer the end-to-end intelligence engine, full-stack Next.js API architecture, AssemblyAI Universal-3.5 speech pipeline, invariant Meaning Packet fact-locking, multi-language rendering, WhatsApp/Email dispatch systems, live Vercel deployment, and rigorous QA.

#### Detailed Deliverables for Anurag:

1. **AssemblyAI Dictation API Integration & Audio Processing**:
   - Integrate AssemblyAI's Dictation API endpoint: `https://dictation.assemblyai.com/transcribe` (Universal-3.5 Pro).
   - Pass audio binary streams with proper headers (`Authorization: <ASSEMBLYAI_API_KEY>`).
   - Enable code-switching detection for mixed languages (Hindi + English / Hinglish).
   - Configure automatic filler removal and punctuation formatting to deliver clean input text to the LLM.
   - Implement fail-safe Web Speech API fallback for zero-latency local speech recognition.

2. **LLM Meaning Packet Extraction & Invariant Fact-Locking**:
   - Build high-velocity LLM prompt pipeline (Groq Llama 3.3 70B, GPT-4o, Claude 3.5 Sonnet, or Gemini 1.5 Pro) with strict JSON Schema output.
   - System Prompt constraints:
     - Isolate critical entities: assignees/owners, deadlines, numerical constraints, and prerequisite conditions.
     - Place all immutable values inside `locked_fields`.
     - Flag ambiguity instead of hallucinating (e.g., if owner is unspecified, set `"owner": null`).
   - Implement Zod runtime schema validation (`MeaningPacketSchema`) to guarantee 100% compliant data structures.

3. **18-Language Rendering Engine & Zero-Drift Localizer**:
   - Implement `/api/render` endpoint supporting 18 international and Indian regional languages (English, Hindi, Japanese, Spanish, German, French, Tamil, Telugu, etc.).
   - Prompt rules for each language:
     - Generate idiomatic, natural phrasing for the `action`.
     - Strict rule: **Never translate locked field values semantically**. Locked numbers and times must remain identical; names must be retained or strictly phonetic.
     - Guarantee 0% fact drift across all recipient cards.

4. **Team Relay Dispatch Subsystems (WhatsApp & Email)**:
   - Build 1-click Direct WhatsApp dispatch using official scheme `https://wa.me/<number>?text=<memo>`.
   - Build Universal WhatsApp Group dispatch using `https://api.whatsapp.com/send?text=<memo>` for 1-click forwarding to any team chat.
   - Build prefilled email drafting with RFC-compliant `mailto:` protocols.
   - Implement `/api/dispatch` tracking service with real-time SSE updates and interactive Relay Drawer.

5. **Voice Correction & Delta Processor**:
   - Implement `/api/correct` endpoint.
   - Process correction audio through AssemblyAI $\rightarrow$ Extract delta diff $\rightarrow$ Apply patch to stored Meaning Packet $\rightarrow$ Increment version $\rightarrow$ Re-render all targets.

6. **Repo Scaffolding, DevOps, CI/CD & Production Deployment**:
   - Set up Next.js 14 App Router, TypeScript configurations, environment variables, and GitHub Actions CI workflow (`.github/workflows/ci.yml`).
   - Deploy to Vercel with HTTPS enforcement (mandatory for browser microphone access) and Server-Sent Events support.
   - Perform fullstack stress-testing, latency benchmarking, and edge-case handling.
   - Author comprehensive project documentation (`README.md`, `bhasha-documentation.md`), pitch assets, and test datasets.

---

## 6. Backend API Specification

All endpoints communicate using JSON over HTTP, with WebSockets and Server-Sent Events for push updates.

### 6.1. Transcribe Audio (`POST /api/dictate`)
- **Owner**: Dev 2 (Anurag)
- **Input**: `multipart/form-data` with `file: audio/wav` or `audio/webm`
- **AssemblyAI Call**: Posts to `https://dictation.assemblyai.com/transcribe` with `model=universal-3.5-pro`
- **Output**:
```json
{
  "status": "success",
  "transcript": "Kal Rahul deployment kare, but only after tests pass — deadline 4 PM.",
  "confidence": 0.96,
  "detected_languages": ["hi", "en"]
}
```

### 6.2. Extract Meaning Packet (`POST /api/extract`)
- **Owner**: Dev 2 (Anurag)
- **Input**:
```json
{
  "transcript": "Kal Rahul deployment kare, but only after tests pass — deadline 4 PM."
}
```
- **Output**: Complete `MeaningPacket` object (as defined in Section 4.1).

### 6.3. Render Multi-Language Cards (`POST /api/render`)
- **Owner**: Dev 2 (Anurag)
- **Input**:
```json
{
  "task_id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
  "target_languages": ["en", "hi", "ja"]
}
```
- **Output**:
```json
{
  "task_id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
  "renders": [
    {
      "language_code": "en",
      "headline": "Application Deployment",
      "body": "Rahul is assigned to deploy the application tomorrow by 4:00 PM IST, only after tests pass.",
      "locked_fields": { "owner": "Rahul", "deadline": "Tomorrow, 4:00 PM IST", "conditions": ["Only after tests pass"] }
    },
    {
      "language_code": "hi",
      "headline": "एप्लिकेशन डिप्लॉयमेंट",
      "body": "राहुल को कल शाम 4:00 PM IST तक एप्लिकेशन डिप्लॉय करना है, लेकिन केवल तभी जब सभी टेस्ट पास हो जाएं।",
      "locked_fields": { "owner": "Rahul", "deadline": "Tomorrow, 4:00 PM IST", "conditions": ["Only after tests pass"] }
    },
    {
      "language_code": "ja",
      "headline": "アプリケーションのデプロイ",
      "body": "Rahulは明日午後4:00 PM ISTまでにアプリケーションをデプロイしてください。ただしテスト合格後のみ実行可能です。",
      "locked_fields": { "owner": "Rahul", "deadline": "Tomorrow, 4:00 PM IST", "conditions": ["Only after tests pass"] }
    }
  ]
}
```

### 6.4. Voice Delta Correction (`POST /api/correct`)
- **Owner**: Dev 2 (Anurag)
- **Input**: `multipart/form-data` with `audio` or raw JSON with `task_id` + `correction_text`.
- **Output**: Updated `MeaningPacket` (version incremented) + freshly updated renders for all connected clients.

### 6.5. Team Relay Dispatch Tracking (`POST /api/dispatch` & `GET /api/dispatch`)
- **Owner**: Dev 2 (Anurag)
- **Input**: JSON with `teammate_id`, `channel` (`whatsapp` | `whatsapp_group` | `email`), `language`, `headline`.
- **Output**: Recorded dispatch audit record pushed in real-time to the active Relay Drawer.

### 6.6. Real-Time Server-Sent Events Channel (`GET /api/events`)
- **Native Vercel Serverless/Edge compatible stream** using standard web `ReadableStream`.
- **Events**:
  - `TASK_CREATED`: Emitted when new task is extracted.
  - `TASK_MODIFIED`: Emitted when voice correction updates locked fields.
  - `RENDERS_UPDATED`: Emitted when per-language renders refresh.

---

## 7. Next.js 14 Full-Stack Directory & Architecture

Unified Full-Stack Next.js (App Router) structure optimized for Vercel deployment:

```
Bhasha/
├── README.md                          <-- Dev 2 (Anurag) Master documentation & live links
├── bhasha-implementationplan.md       <-- Master engineering plan
├── package.json                       <-- Next.js 14 fullstack dependencies
├── tsconfig.json                      <-- Path aliases (@/*)
├── tailwind.config.ts                 <-- Custom glassmorphism & typography design tokens
├── postcss.config.mjs
├── next.config.mjs
├── .env.example                       <-- Dev 2 (Anurag) Environment configuration
├── .gitignore
│
└── src/
    ├── app/
    │   ├── layout.tsx                 <-- Dev 1 (Joshna) Root layout & typography
    │   ├── page.tsx                   <-- Dev 1 (Joshna) Master landing page & hero
    │   ├── studio/page.tsx            <-- Dev 1 (Joshna) Voice Studio dictation & preview
    │   ├── team/page.tsx              <-- Dev 1 (Joshna) Team Relay dashboard & cards
    │   ├── globals.css                <-- Dev 1 (Joshna) Styling & 85% scale system
    │   └── api/                       <-- Dev 2 (Anurag) Next.js App Router Route Handlers
    │       ├── dictate/route.ts       <-- AssemblyAI Dictation API client route
    │       ├── extract/route.ts       <-- LLM Meaning Packet extraction route
    │       ├── render/route.ts        <-- Multi-language context rendering route
    │       ├── correct/route.ts       <-- Voice delta correction route
    │       ├── dispatch/route.ts      <-- WhatsApp & Email dispatch logging route
    │       ├── tasks/route.ts         <-- In-memory tasks endpoint
    │       └── events/route.ts        <-- Real-time SSE stream for Vercel push
    │
    ├── components/                    <-- Dev 1 (Joshna)
    │   ├── AudioRecorder.tsx          <-- Mic button & canvas waveform visualizer
    │   ├── TaskCard.tsx               <-- Localized team card with fact-lock badges
    │   ├── FactLockProof.tsx          <-- Comparative proof table (0% drift)
    │   ├── CorrectionModal.tsx        <-- Voice delta correction modal
    │   ├── EditTeammateModal.tsx      <-- Member editor modal
    │   └── Navbar.tsx & Footer.tsx    <-- Granola-style navigation & architectural footer
    │
    ├── lib/                           <-- Dev 2 (Anurag)
    │   ├── assemblyai.ts              <-- AssemblyAI Universal-3.5 Pro client
    │   ├── llm.ts                     <-- LLM Meaning Packet prompts & 18-lang localizer
    │   ├── dispatch.ts                <-- WhatsApp & Email URI generators
    │   ├── taskStore.ts               <-- Canonical in-memory task store & event hub
    │   └── mockData.ts                <-- Verified sample data & fail-safe fallbacks
    │
    └── types/
        └── index.ts                   <-- Dev 2 (Anurag) Shared TypeScript data contracts
```

---

## 8. Step-by-Step Implementation Timeline

### Phase 1: Foundation, Contracts & Scaffolding (Day 1)
- **Anurag (Full-Stack Backend Lead)**: Initialize repository, configure TypeScript paths, setup `.env.example`, write shared types (`MeaningPacket`, `RenderedCard`). Set up in-memory task store skeleton and write initial test harness for audio payloads and mock data schemas. Test AssemblyAI Dictation API beta endpoint (`dictation.assemblyai.com/transcribe`) with sample code-switched audio.
- **Joshna (Frontend Lead)**: Create UI skeleton, configure styling system (Granola typography, badges, tokens), design the Voice Studio and Team Relay views.

### Phase 2: Core Pipelines, UI & Relay Engine (Day 2)
- **Anurag**: Implement `/api/dictate` and `/api/extract` endpoints with strict Zod schema validation. Implement `/api/render` 18-language prompt pipeline with zero fact drift guarantees. Build WhatsApp and Email dispatch URL generation logic.
- **Joshna**: Build `AudioRecorder` with canvas waveform visualization. Build `TaskCard` with typographic avatar badges, clean memo surfaces, and 1-click dispatch buttons.

### Phase 3: Integration, Real-Time Sync & Bug Fixing (Day 3)
- **Anurag**: Build `/api/correct` delta update engine. Implement `/api/dispatch` logging and Server-Sent Events (SSE) broadcasting. Perform end-to-end integration testing across audio recording, backend processing, and live card refreshes. Hunt and fix edge-case bugs.
- **Joshna**: Connect frontend to backend endpoints. Wire SSE listener for instant real-time card updates across Team Relay. Build `FactLockProof` component highlighting identical locked attributes across all languages.

### Phase 4: Polish, Live Deployment & Demo Dry Run (Day 4)
- **Joshna**: Fine-tune UI layout scaling (85% zoom), micro-animations, lock badge glow, and responsive cards.
- **Anurag**: Execute production Vercel live deployment ([https://bhashaz.vercel.app/](https://bhashaz.vercel.app/)), configure HTTPS, set up GitHub Actions CI pipeline, author comprehensive `README.md`, and lead rehearsals of the 90-second demo script with Joshna.

---

## 9. The 90-Second Winning Demo Script

To impress the judges, the live demo must be smooth, punchy, and make the "fact-lock" visible within the first 30 seconds.

| Time | Presenter / Action | What is Happening On Screen | Key Pitch Point |
| :--- | :--- | :--- | :--- |
| **00:00 - 00:20** | **Speaker 1 (Manager)**:<br>Presses mic and speaks Hinglish: *"Kal Rahul deployment kare, but only after tests pass — deadline 4 PM."* | Audio waveform moves live.<br>AssemblyAI transcribes Hinglish with zero filler words. | *"We don't type or force people to speak pure English. AssemblyAI handles natural code-switching."* |
| **00:20 - 00:45** | **System Extraction**: | Instant card animation.<br>Meaning Packet displays: **Owner: Rahul (🔒)**, **Deadline: Tomorrow 4 PM (🔒)**, **Condition: Tests pass (🔒)**. | *"Notice this isn't a translation. It's a Meaning Packet with locked facts."* |
| **00:45 - 01:10** | **Team Relay & Multi-Language**: | Rahul's view shows Hindi.<br>Kenji's view shows Japanese.<br>Side-by-side Proof View highlights identical locked values. | *"Rahul reads Hindi, Kenji reads Japanese. Both see the exact same 4 PM and test condition."* |
| **01:10 - 01:30** | **Voice Correction & 1-Click Dispatch**: | Speaks voice correction: *"Actually push it to 5 PM."*<br>All cards flash and update to **5 PM**.<br>Clicks **WhatsApp** to dispatch prefilled localized memo. | *"One voice delta updates the shared packet with 0% drift, and dispatches instantly to WhatsApp or Email."* |

---

## 10. Fail-Safe Mechanisms (Hackathon Guardrails)

1. **API Rate Limiting / Offline Mode**:
   - Anurag's mock datasets can be activated with a single UI toggle (`NEXT_PUBLIC_USE_MOCK_DATA=true` or demo buttons in the UI).
   - If external APIs take $>3$ seconds, UI provides instant preview using verified cached sample cards.
2. **Audio Input Fallback**:
   - If browser microphone permissions fail on the demo laptop, a "Quick Sample" dropdown allows clicking "Hinglish Deployment" to inject the pre-recorded audio file directly.
3. **Strict Validation**:
   - If LLM misses a locked field, the schema fallback guarantees default locks on any extracted date or proper noun.
