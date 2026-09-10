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

The project is divided across three developers with clear separation of concerns, ensuring high velocity and zero merge conflicts.

```
┌───────────────────────────────────────────────────────────────────────────────┐
│                           TEAM RESPONSIBILITY MATRIX                          │
├───────────────────┬───────────────────┬───────────────────────────────────────┤
│ Contributor       │ Core Role         │ Key Deliverables                      │
├───────────────────┼───────────────────┼───────────────────────────────────────┤
│ DEV 1: JOSHNA     │ Frontend Lead &   │ • Full UI/UX Design System            │
│                   │ UI Architecture   │ • Simulated Multi-User Split View     │
│                   │                   │ • Audio Recorder & Waveform Component │
│                   │                   │ • "Fact-Lock Proof" Visual Inspector  │
│                   │                   │ • Frontend API Client & State Sync    │
├───────────────────┼───────────────────┼───────────────────────────────────────┤
│ DEV 2: SALONI     │ Backend Lead &    │ • AssemblyAI Dictation API Pipeline   │
│                   │ AI STT/LLM Engine │ • LLM Meaning Packet Extractor        │
│                   │                   │ • Per-Language Context Renderer       │
│                   │                   │ • Voice Delta Correction Processor    │
│                   │                   │ • REST API Endpoints & WebSockets     │
├───────────────────┼───────────────────┼───────────────────────────────────────┤
│ DEV 3: ANURAG     │ Repo Setup, QA/   │ • Repo, Config & Shared Types         │
│                   │ Bug Fixer, DevOps,│ • Fullstack QA Testing & Bug Fixing   │
│                   │ Idea Refiner & Doc│ • Live Deployment & Hosting (HTTPS/WS)│
│                   │                   │ • Idea Refinement, Pitch Deck & Demo  │
│                   │                   │ • Test Audio Samples & Mock Fallbacks │
│                   │                   │ • Project Documentation & Submission  │
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
                     │   DEV 2 (Saloni): Audio Ingestion │
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
                     │   DEV 2 (Saloni): Extraction LLM  │
                     │   Speech ──> Meaning Packet       │
                     │   • Tag & lock facts (🔒)         │
                     │   • Validate strict JSON Schema   │
                     └─────────────────┬─────────────────┘
                                       │ Canonical Meaning Packet
                                       ▼
                     ┌───────────────────────────────────┐
                     │   DEV 3 (Anurag): Task Store      │
                     │   • In-Memory Canonical Store     │
                     │   • Task History & Versioning     │
                     └─────────────────┬─────────────────┘
                                       │ Broadcast Event
                                       ▼
                     ┌───────────────────────────────────┐
                     │   DEV 2 (Saloni): Multi-Language  │
                     │   Rendering Engine                │
                     │   • Hindi Render (Locked Injected)│
                     │   • Japanese Render (Locked Inj.) │
                     │   • English Render (Locked Inj.)  │
                     └─────────────────┬─────────────────┘
                                       │ WebSocket / SSE Push
                                       ▼
                     ┌───────────────────────────────────┐
                     │   DEV 1 (Joshna): Split Screen UI │
                     │   • Manager View (English/Hinglish│
                     │   • Rahul's View (Hindi)          │
                     │   • Teammate View (Japanese)      │
                     │   • Side-by-Side Fact Proof View  │
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
   - Implement `apiClient.ts` to call Dev 2's backend endpoints.
   - Setup WebSocket or Server-Sent Events (SSE) listener for reactive updates.

---

### DEV 2: SALONI (Backend Lead, AssemblyAI Integration, LLM Pipeline & APIs)

**Primary Objective**: Build the intelligence engine that transcribes code-switched audio via AssemblyAI, structures it into a locked Meaning Packet, and renders it faithfully in multiple languages without fact drift.

#### Detailed Deliverables for Saloni:
1. **AssemblyAI Dictation API Integration**:
   - Integrate AssemblyAI's Dictation API endpoint: `https://dictation.assemblyai.com/transcribe` (Universal-3.5 Pro).
   - Pass audio binary streams with proper headers (`Authorization: <ASSEMBLYAI_API_KEY>`).
   - Enable code-switching detection for mixed languages (Hindi + English).
   - Configure automatic filler removal and punctuation formatting to deliver clean input text to the LLM.

2. **LLM Meaning Packet Extraction Service**:
   - Build prompt pipeline (via Claude 3.5 Sonnet, GPT-4o, or Gemini 1.5 Pro) with strict JSON Schema output.
   - System Prompt constraints:
     - Isolate entities (Person names, deadlines, numbers, conditions).
     - Place all immutable values inside `locked_fields`.
     - Flag ambiguity instead of hallucinating (e.g., if owner is unspecified, set `"owner": null`).
   - Implement JSON schema validator (e.g., Zod or Ajv) to guarantee valid `MeaningPacket` objects.

3. **Multi-Language Rendering Service**:
   - Implement `/api/render` endpoint.
   - Input: `MeaningPacket` + `target_languages: ["hi", "ja", "en"]`.
   - Prompt rules for each language:
     - Generate idiomatic, natural phrasing for the `action`.
     - Strict rule: **Never translate locked field values semantically**. Locked numbers and times must remain identical; names must be retained or strictly phonetic.

4. **Voice Correction & Delta Processor**:
   - Implement `/api/correct` endpoint.
   - Process correction audio through AssemblyAI $\rightarrow$ Extract delta diff $\rightarrow$ Apply patch to stored Meaning Packet $\rightarrow$ Increment version $\rightarrow$ Re-render all targets.

5. **REST API Endpoints & Real-time Broadcasting**:
   - Build lightweight, high-performance Node.js (Express/Fastify) or Python (FastAPI) server.
   - Implement WebSocket / SSE channel for publishing task updates to Dev 1's UI.

---

### DEV 3: ANURAG (Repo Setup, QA & Bug Fixing, Live Deployment, Idea Refiner & Documentation)

**Primary Objective**: Drive foundational repository setup and scaffolding, lead product idea refinement & hackathon alignment, execute rigorous fullstack QA testing & cross-stack bug fixing, manage production live deployment (HTTPS & WebSockets), and deliver polished documentation to guarantee a bulletproof, winning submission.

#### Detailed Deliverables for Anurag:

1. **Repo Setup & Architecture Scaffolding**:
   - Initialize monorepo / fullstack codebase, configure package managers, build scripts, and TypeScript configs.
   - Configure `.env.example` with API key placeholders (`ASSEMBLYAI_API_KEY`, `LLM_API_KEY`, `PORT`, etc.).
   - Define shared TypeScript interfaces (`MeaningPacket`, `RenderedCard`, `LockedFields`, `VoiceDelta`).
   - Scaffold the in-memory task store skeleton and state helper functions.

2. **Product Idea Refiner & Pitch Strategist**:
   - Refine the core value proposition: rigorously define the boundary between *"Plain Translation"* vs *"Structured Meaning Packet"* so judges immediately grasp the distinction within 15 seconds.
   - Align the demo flow directly with AssemblyAI's hackathon evaluation criteria (spotlighting the Universal-3.5 Pro Dictation API's code-switching and noise-filtering capabilities).
   - Design the pitch narrative, slide deck, and presentation assets.

3. **Fullstack QA Testing, Bug Hunting & Bug Fixing**:
   - **Pipeline Verification**: Benchmark AssemblyAI transcription latency on rapid Hinglish audio and validate LLM schema compliance with Zod/Ajv.
   - **Cross-Stack Bug Fixing**:
     - Hunt and fix frontend bugs: microphone permission errors, canvas waveform visual glitches, and WebSocket state flickering.
     - Hunt and fix backend bugs: unhandled exceptions on invalid audio streams, API timeouts, retry logic with exponential backoff, and voice delta race conditions.
   - **Edge-Case & Stress Testing**: Validate ambiguous instructions, dialectal slang, rapid sequential voice corrections, and non-Latin script formatting.

4. **Live Deployment & DevOps**:
   - Set up cloud hosting and continuous deployment (e.g. Vercel for frontend, Render/Railway/Fly.io for backend, or single fullstack deployment).
   - Enforce HTTPS across production domains (critical for browser microphone permissions in modern web browsers).
   - Configure environment variables and verify persistent WebSocket/SSE connectivity on the live URL.

5. **Project Documentation, Mock Datasets & Submission Package**:
   - Synthesize or record 3 pristine audio test clips (`sample1_hinglish_deploy.wav`, `sample2_correction_deadline.wav`, `sample3_japanese_confirm.wav`).
   - Create and verify mock fallback JSON files (`mock_meaning_packet.json`, `mock_rendered_cards.json`) and verify the single-click "Mock Demo Mode" fail-safe toggle.
   - Author comprehensive, professional `README.md` with visual architecture diagrams, setup instructions, and API docs.
   - Author official Hackathon submission writeup (pitch paragraph, problem statement, technical hurdles solved, and recorded demo walkthrough links).
   - Lead 5 full rehearsals of the 90-second demo script with Joshna and Saloni.

---

## 6. Backend API Specification

All endpoints communicate using JSON over HTTP, with WebSockets for push updates.

### 6.1. Transcribe Audio (`POST /api/dictate`)
- **Owner**: Dev 2 (Saloni)
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
- **Owner**: Dev 2 (Saloni)
- **Input**:
```json
{
  "transcript": "Kal Rahul deployment kare, but only after tests pass — deadline 4 PM."
}
```
- **Output**: Complete `MeaningPacket` object (as defined in Section 4.1).

### 6.3. Render Multi-Language Cards (`POST /api/render`)
- **Owner**: Dev 2 (Saloni)
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
- **Owner**: Dev 2 (Saloni) & Dev 3 (Anurag)
- **Input**: `multipart/form-data` with `audio` or raw JSON with `task_id` + `correction_text`.
- **Output**: Updated `MeaningPacket` (version incremented) + freshly updated renders for all connected clients.

### 6.5. Real-Time Server-Sent Events Channel (`GET /api/events`)
- **Native Vercel Serverless/Edge compatible stream** using standard web `ReadableStream`.
- **Events**:
  - `TASK_CREATED`: Emitted when new task is extracted.
  - `TASK_MODIFIED`: Emitted when voice correction updates locked fields (triggers simultaneous instant update across Manager, Rahul, and Kenji views).
  - `RENDERS_UPDATED`: Emitted when per-language renders refresh.

---

## 7. Next.js 14 Full-Stack Directory & Architecture

Unified Full-Stack Next.js (App Router) structure optimized for Vercel deployment:

```
Bhasha/
├── README.md                          <-- Dev 3 (Anurag)
├── bhasha-implementationplan.md       <-- Master engineering plan
├── package.json                       <-- Next.js 14 fullstack dependencies
├── tsconfig.json                      <-- Path aliases (@/*)
├── tailwind.config.ts                 <-- Custom glassmorphism design tokens
├── postcss.config.mjs
├── next.config.mjs
├── .env.example                       <-- Dev 3 (Anurag)
├── .gitignore
│
└── src/
    ├── app/
    │   ├── layout.tsx                 <-- Dev 1 (Joshna) Root layout & typography
    │   ├── page.tsx                   <-- Dev 1 (Joshna) Master split-screen dashboard
    │   ├── globals.css                <-- Dev 1 (Joshna) Glassmorphism & lock glow styles
    │   └── api/                       <-- Dev 2 (Saloni) Next.js App Router Route Handlers
    │       ├── dictate/route.ts       <-- AssemblyAI Dictation API client route
    │       ├── extract/route.ts       <-- LLM Meaning Packet extraction route
    │       ├── render/route.ts        <-- Multi-language context rendering route
    │       ├── correct/route.ts       <-- Voice delta correction route
    │       ├── tasks/route.ts         <-- Dev 3 In-memory tasks endpoint
    │       └── events/route.ts        <-- Real-time SSE stream for Vercel push
    │
    ├── components/                    <-- Dev 1 (Joshna)
    │   ├── AudioRecorder.tsx          <-- Mic button & canvas waveform visualizer
    │   ├── TaskCard.tsx               <-- Localized team card with fact-lock badges
    │   ├── FactLockProof.tsx          <-- Comparative proof table (0% drift)
    │   └── CorrectionModal.tsx        <-- Voice delta correction modal
    │
    ├── lib/
    │   ├── assemblyai.ts              <-- Dev 2 (Saloni) AssemblyAI Universal-3.5 Pro client
    │   ├── llm.ts                     <-- Dev 2 (Saloni) LLM Meaning Packet prompts & parser
    │   ├── taskStore.ts               <-- Dev 3 (Anurag) Canonical in-memory task store & event hub
    │   └── mockData.ts                <-- Dev 3 (Anurag) Pre-recorded samples & fallback JSON
    │
    └── types/
        └── index.ts                   <-- Dev 3 (Anurag) Shared TypeScript data contracts
```

---

## 8. Step-by-Step Implementation Timeline

### Phase 1: Foundation, Contracts & Scaffolding (Day 1)
- **Anurag (Repo Setup & Scaffolding)**: Initialize monorepo workspace, configure TypeScript paths, setup `.env.example`, write shared types (`MeaningPacket`, `RenderedCard`). Set up in-memory task store skeleton and write initial test harness for audio payloads and mock data schemas.
- **Saloni**: Test AssemblyAI Dictation API beta endpoint (`dictation.assemblyai.com/transcribe`) with sample code-switched audio. Draft LLM extraction prompt and verify JSON outputs.
- **Joshna**: Create UI skeleton, configure styling system (dark mode, typography, badge tokens), design the split-screen 3-column container.

### Phase 2: Core Pipelines, UI & Idea Refinement (Day 2)
- **Saloni**: Implement `/api/dictate` and `/api/extract` endpoints. Implement `/api/render` per-language prompt pipeline (Hindi, Japanese, English).
- **Joshna**: Build `AudioRecorder` with canvas waveform visualization. Build `TaskCard` showing headline, natural phrasing, and locked field chips.
- **Anurag (Testing, Mock Data & Idea Refinement)**: Test AssemblyAI transcription latency and accuracy with mixed Hinglish accents. Catch early bugs in LLM extraction schema. Prepare 3 pristine test audio clips and verify mock JSON fallbacks. Refine the core "Meaning Packet vs. Translation" pitch slides and rubric alignment.

### Phase 3: Integration, Real-Time Sync & Bug Fixing (Day 3)
- **Saloni**: Build `/api/correct` delta update engine. Setup WebSocket server to push task changes.
- **Joshna**: Connect frontend to backend endpoints. Wire WebSocket hook for instant real-time card updates across the split screen.
- **Joshna**: Build `FactLockProof` component highlighting identical locked attributes across all 3 language columns.
- **Anurag (Cross-Stack Bug Fixing & Stress Testing)**: Perform end-to-end integration testing across audio recording, backend processing, and live WebSocket card refreshes. Hunt and fix bugs: browser microphone compatibility quirks, WebSocket reconnection handling, voice delta race conditions, and UI flicker.

### Phase 4: Polish, Live Deployment & Demo Dry Run (Day 4)
- **Joshna**: Add micro-animations (card entry transitions, lock badge glow, pulsing update indicator).
- **Saloni**: Add error boundaries and fallback handling for LLM rate limits or audio network timeouts.
- **Anurag (DevOps, Documentation & Demo Prep)**: Execute production live deployment (HTTPS for mic access, persistent WebSockets). Author comprehensive `README.md`, API documentation, and official hackathon submission writeup. Validate the single-click "Mock Demo Mode" fail-safe and lead 5 full rehearsals of the 90-second demo script with Joshna and Saloni.

---

## 9. The 90-Second Winning Demo Script

To impress the judges, the live demo must be smooth, punchy, and make the "fact-lock" visible within the first 30 seconds.

| Time | Presenter / Action | What is Happening On Screen | Key Pitch Point |
| :--- | :--- | :--- | :--- |
| **00:00 - 00:20** | **Speaker 1 (Manager)**:<br>Presses mic and speaks Hinglish: *"Kal Rahul deployment kare, but only after tests pass — deadline 4 PM."* | Audio waveform moves live.<br>AssemblyAI transcribes Hinglish with zero filler words. | *"We don't type or force people to speak pure English. AssemblyAI handles natural code-switching."* |
| **00:20 - 00:45** | **System Extraction**: | Instant card animation.<br>Meaning Packet displays: **Owner: Rahul (🔒)**, **Deadline: Tomorrow 4 PM (🔒)**, **Condition: Tests pass (🔒)**. | *"Notice this isn't a translation. It's a Meaning Packet with locked facts."* |
| **00:45 - 01:10** | **Show Split View**: | Rahul's column shows Hindi.<br>Kenji's column shows Japanese.<br>Side-by-side Proof View highlights identical locked values. | *"Rahul reads Hindi, Kenji reads Japanese. Both see the exact same 4 PM and test condition."* |
| **01:10 - 01:30** | **Voice Correction**: | Rahul clicks mic on his Hindi card: *"Actually push it to 5 PM."*<br>All 3 columns flash and update to **5 PM** simultaneously. | *"One voice delta updates the shared packet. No re-translation telephone game. Zero drift."* |

---

## 10. Fail-Safe Mechanisms (Hackathon Guardrails)

1. **API Rate Limiting / Offline Mode**:
   - Dev 3's mock datasets can be activated with a single UI toggle (`USE_MOCK_DATA=true` or a demo toggle switch in the UI header).
   - If AssemblyAI or LLM takes $>3$ seconds, UI provides instant preview using cached sample cards.
2. **Audio Input Fallback**:
   - If browser microphone permissions fail on the demo laptop, a "Quick Sample" dropdown allows clicking "Hinglish Deployment" to inject the pre-recorded audio file directly.
3. **Strict Validation**:
   - If LLM misses a locked field, the schema fallback guarantees default locks on any extracted date or proper noun.
