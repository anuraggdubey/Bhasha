# Bhasha (भाषा)
### *One Meaning, Every Language*
**Voice-First Task Handoff & Orchestration for Multilingual Teams**

[![Live Demo](https://img.shields.io/badge/Live_Demo-bhashaz.vercel.app-10b981?style=for-the-badge&logo=vercel)](https://bhashaz.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-14_App_Router-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![STT](https://img.shields.io/badge/AssemblyAI-Universal--3.5_Pro-teal?style=flat-square)](https://www.assemblyai.com/)
[![Deploy with Vercel](https://img.shields.io/badge/Vercel-Production_Ready-000000?style=flat-square&logo=vercel)](https://vercel.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

> 🌐 **Live Production Link**: **[https://bhashaz.vercel.app/](https://bhashaz.vercel.app/)**  
> 📖 **Architecture Documentation**: [`bhasha-documentation.md`](./bhasha-documentation.md)  
> 📋 **Engineering Plan**: [`bhasha-implementationplan.md`](./bhasha-implementationplan.md)

---

## 📌 Executive Summary

Modern global and distributed engineering teams lose precision at the handoff moment, not the conversation moment. When an engineering lead speaks an instruction mixing Hindi and English (*Hinglish*), traditional translation tools translate sentence-by-sentence. In doing so, critical numbers, deadlines, names, and conditional clauses silently morph or get dropped:

> **Spoken Input**: *"Kal Rahul deployment kare, but only after tests pass — deadline 4 PM."*  
> **Traditional Translation**: Chained hops can alter *"4 PM"* to *"4 AM"* or omit the prerequisite *"only after tests pass"*.

**Bhasha** does **not** translate sentences. Instead, it extracts the spoken instruction into an intermediate, language-independent data structure — the **Meaning Packet** — where critical facts are **locked (🔒)**. Each teammate receives a localized task card rendered directly from this single source of truth into their preferred language (Hindi, Japanese, English), with zero fact drift.

---

## ⚡ Why Bhasha? (Translation vs. Meaning Packets)

| Feature | Standard Sentence Translation | Bhasha Platform |
| :--- | :--- | :--- |
| **Unit of Work** | Raw sentence string | Structured task (owner, deadline, condition, action) |
| **Source of Truth** | Sequential translation chain (telephone game) | Single canonical **Meaning Packet** |
| **Critical Facts** | Drifts across hops (e.g. 4 PM $\rightarrow$ 4 AM) | **Locked fields (🔒)**, provably invariant across all renders |
| **Input Handling** | Struggles on code-switched dialects (Hinglish) | Native code-switching via AssemblyAI Universal-3.5 Pro |
| **Corrections** | Requires full manual re-translation | **Voice Delta Loop**: speaks a delta to mutate the shared packet |
| **Verification** | Blind trust in translation engine | Built-in **Fact-Lock Proof View** for real-time verification |

---

## 🏗️ Technical Architecture & Pipeline

```
                                  VOICE INPUT
                        (Code-switched, e.g., Hinglish)
                                       │
                                       ▼
                     ┌───────────────────────────────────┐
                     │         Web Audio Capture         │
                     │  • MediaRecorder / Web Audio API  │
                     │  • Live Canvas Waveform Feedback  │
                     └─────────────────┬─────────────────┘
                                       │ Audio Blob (WAV/WebM)
                                       ▼
                     ┌───────────────────────────────────┐
                     │   AssemblyAI Dictation API        │
                     │   Endpoint: /transcribe (Beta)    │
                     │   Model: Universal-3.5 Pro        │
                     │   • Native Code-Switching         │
                     │   • Automatic Filler Removal      │
                     └─────────────────┬─────────────────┘
                                       │ Clean Raw Transcript
                                       ▼
                     ┌───────────────────────────────────┐
                     │    LLM Extraction Engine          │
                     │    Transcript ──> Meaning Packet  │
                     │    • Lock Owner, Deadline, Prereqs│
                     │    • Strict JSON Schema Validation│
                     └─────────────────┬─────────────────┘
                                       │ Canonical Meaning Packet (🔒)
                                       ▼
                     ┌───────────────────────────────────┐
                     │    In-Memory Canonical Store      │
                     │    • Versioning & State Manager   │
                     │    • Event Dispatcher             │
                     └─────────────────┬─────────────────┘
                                       │ Broadcast Event
                                       ▼
                     ┌───────────────────────────────────┐
                     │    Multi-Language Context Engine  │
                     │    • Render Hindi (Facts Locked)  │
                     │    • Render Japanese (Facts Locked│
                     │    • Render English (Facts Locked)│
                     └─────────────────┬─────────────────┘
                                       │ Server-Sent Events (SSE)
                                       ▼
                     ┌───────────────────────────────────┐
                     │   Simulated Real-Time Team Relay  │
                     │   • Manager View (Hinglish/English│
                     │   • Rahul's View (Hindi)          │
                     │   • Kenji's View (Japanese)       │
                     │   • 0% Drift Fact-Lock Proof View │
                     └───────────────────────────────────┘
```

---

## 🔑 Key Capabilities

1. **Native Code-Switching Dictation**:
   - Uses AssemblyAI's Universal-3.5 Pro engine to transcribe natural speech mixing languages (e.g. Hindi + English) without requiring the speaker to manually select a language or suppress speech fillers.
2. **Fact-Locked Meaning Packet**:
   - Distinguishes between *locked fields* (assignees, timestamps, deadlines, logical constraints) and *flexible fields* (action description). Locked fields are held constant across all localizations.
3. **Simultaneous Multi-Language Rendering**:
   - Generates natural, culturally nuanced task cards in each recipient's language (English, Hindi, Japanese) while binding locked entities verbatim.
4. **Voice Delta Correction Loop**:
   - Any team member can speak a correction (*"Actually make that 5 PM, integration tests are taking longer"*). The engine isolates the delta, updates the single canonical packet, and cascades the update to all views simultaneously.
5. **Fact-Lock Proof Inspector**:
   - A side-by-side comparative verification table embedded in the interface that displays canonical locked values alongside localized outputs, mathematically proving zero fact drift.

---

## 🔄 How Zero-Drift Translation Works

Bhasha eliminates the "telephone game" of traditional chained translation by decoupling **invariant facts** from **cultural phrasing**:

1. **Voice Dictation & Code-Switching Ingestion**:
   - Audio is captured and streamed to **AssemblyAI Universal-3.5 Pro** via `/api/dictate` (with browser Web Speech API as fallback).
   - Native multilingual code-switching transcribes mixed speech (e.g., *Hinglish*, *Spanglish*) without manual language selection, automatically stripping filler sounds (*"uh"*, *"umm"*).
2. **Invariant Fact-Locking (Meaning Packet Extraction)**:
   - High-velocity LLMs (Groq Llama 3.3 70B / OpenAI GPT-4o) parse the transcript into a language-independent JSON data structure: the **Meaning Packet**.
   - Critical entities (`owner`, `deadline`, `prerequisites`, `numerical constraints`) are extracted into `locked_fields` with a fact-lock verification contract.
3. **Multilingual Rendering (18 Supported Languages)**:
   - Rather than translating words sequentially, `/api/render` generates culturally natural phrasing directly from the canonical packet into each recipient's language.
   - Locked entities are pinned verbatim, guaranteeing **0% fact drift** (e.g., "4:00 PM IST" and "after tests pass" remain identical across English, Hindi, Japanese, Spanish, etc.).
4. **Voice Delta Correction Loop**:
   - When any teammate speaks a correction (*"Actually make that 5 PM"*), `/api/correct` extracts only the delta change, mutates the central packet (e.g., `v1.0` $\rightarrow$ `v2.0`), and broadcasts updates to all cards simultaneously via Server-Sent Events (SSE).

---

## 📲 How Team Relay Dispatch Works (WhatsApp & Email)

In **Team Relay**, verified instructions are dispatched directly to teammates and squad channels in their native languages:

1. **Direct WhatsApp Dispatch (Individual Teammates)**:
   - Clicking **"Dispatch WhatsApp"** opens the verified contact via `https://wa.me/<phone_number>?text=<encoded_task_memo>`.
   - Generates a clean localized memo with recipient greeting, translated action body, and 🔒 locked verification markers.
2. **Universal WhatsApp Group Dispatch**:
   - For shared channels or squad handoffs (e.g., *"Frontend Squad"*, *"DevOps Core"*), Bhasha triggers `https://api.whatsapp.com/send?text=<encoded_task_memo>`.
   - Opens the WhatsApp group chat selector, allowing instant 1-click dispatch to any existing channel without requiring complex bot configurations.
3. **Pre-Filled Email Draft Dispatch**:
   - Clicking **"Send Email"** generates a formatted `mailto:<email>?subject=<headline>&body=<memo>`.
   - Instantly opens the sender's default email client (Gmail, Outlook, Apple Mail) with structured briefing notes ready to send.
4. **Real-Time Audit Trail & Delivery History**:
   - Every dispatch is logged through `/api/dispatch`.
   - The slide-out **Relay Drawer** tracks delivery timestamps, channel badges, recipient names, and translated headlines in real-time.

---

## 📦 Canonical Data Contract (`MeaningPacket`)

The central unit of state across the system:

```json
{
  "task_id": "task-sample-deployment-v1",
  "version": 1,
  "raw_transcript": "Kal Rahul deployment kare, but only after tests pass — deadline 4 PM.",
  "detected_languages": ["hi", "en"],
  "action": "Deploy application to production",
  "locked_fields": {
    "owner": "Rahul",
    "deadline": "Tomorrow, 4:00 PM IST",
    "conditions": [
      "Only after all tests pass successfully"
    ],
    "critical_values": [
      { "label": "Priority", "value": "High" }
    ]
  },
  "status": "pending_confirmation",
  "created_at": "2026-09-10T14:30:00.000Z",
  "updated_at": "2026-09-10T14:30:00.000Z"
}
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `v18.17.0+` (Tested on `v20.x` and `v24.x`)
- **npm**: `v9+`

### Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/anuraggdubey/Bhasha.git
   cd Bhasha
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   Provide your API credentials in `.env.local`:
   ```env
   # AssemblyAI API Key (Universal-3.5 Pro)
   ASSEMBLYAI_API_KEY=your_assemblyai_api_key_here

   # LLM Provider Key (OpenAI GPT-4o / Anthropic Claude 3.5 Sonnet)
   OPENAI_API_KEY=your_openai_api_key_here

   # Offline Demo / Fail-Safe Mode (bypasses live API calls if true)
   NEXT_PUBLIC_USE_MOCK_DATA=false
   ```
   > **Note**: If API keys are omitted, Bhasha automatically activates **Fail-Safe Mock Mode** using pre-configured test scenarios, enabling instant local exploration without external API dependencies.

4. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Production Deployment (Vercel)

Bhasha is engineered as a unified Full-Stack Next.js 14 application using the App Router, natively compatible with Vercel serverless and edge environments.

1. Push your repository to GitHub.
2. Import the repository into the [Vercel Dashboard](https://vercel.com/new).
3. Configure the following environment variables in the project settings:
   - `ASSEMBLYAI_API_KEY`
   - `OPENAI_API_KEY`
   - `NEXT_PUBLIC_USE_MOCK_DATA` (`false` for production)
4. Deploy. Vercel provisions an HTTPS-secured domain (required by modern web browsers for Web Audio API and microphone access).

---

## 🔌 API Reference

| Route | Method | Description |
| :--- | :--- | :--- |
| `/api/dictate` | `POST` | Transcribes audio via AssemblyAI Universal-3.5 Pro with native code-switching. |
| `/api/extract` | `POST` | Extracts language-independent Meaning Packet with locked facts from a transcript. |
| `/api/render` | `POST` | Generates localized task cards in target languages preserving locked attributes. |
| `/api/correct` | `POST` | Processes spoken delta corrections and updates canonical task state. |
| `/api/tasks` | `GET` | Retrieves canonical task state and active renders. |
| `/api/events` | `GET` | Real-time Server-Sent Events (SSE) channel pushing updates to connected clients. |

---

## 💻 Product Walkthrough & Verification Flow

1. **Audio Capture**:
   - Press the microphone button or click **Hinglish Deployment Sample**.
   - Input: *"Kal Rahul deployment kare, but only after tests pass — deadline 4 PM."*
2. **Meaning Packet Extraction**:
   - The engine processes the audio, scrubs filler words, and displays the canonical Meaning Packet:
     - **Owner**: `Rahul` 🔒
     - **Deadline**: `Tomorrow, 4:00 PM IST` 🔒
     - **Condition**: `Only after tests pass` 🔒
3. **Simultaneous Team View**:
   - **Manager View**: English/Hinglish representation.
   - **Rahul's View**: Localized in Hindi (*"राहुल को कल शाम 4:00 PM IST तक एप्लिकेशन डिप्लॉय करना है..."*).
   - **Kenji's View**: Localized in Japanese (*"Rahulは明日午後4:00 PM ISTまでにアプリケーションをデプロイしてください..."*).
4. **Interactive Fact-Lock Proof**:
   - The comparative table demonstrates that across all three recipient languages, locked fields remain invariant.
5. **Voice Correction Loop**:
   - Click **Voice Correct** on Rahul's card and speak or trigger:
     *"Actually make that 5 PM, integration tests are taking longer."*
   - The delta updates the central Meaning Packet, and all cards flash and refresh to **5:00 PM** in real-time.

---

## 📁 Repository Structure

```
Bhasha/
├── README.md                          # Master project documentation
├── bhasha-implementationplan.md       # Detailed technical implementation plan
├── bhasha-documentation.md            # Product architecture & design brief
├── package.json                       # Next.js 14 fullstack dependencies
├── tsconfig.json                      # TypeScript configuration (@/* path aliases)
├── tailwind.config.ts                 # Glassmorphism & custom design tokens
├── postcss.config.mjs
├── next.config.mjs
├── .env.example                       # Documented environment variables
├── .gitignore
│
└── src/
    ├── app/
    │   ├── layout.tsx                 # Root layout with custom typography
    │   ├── page.tsx                   # Master interactive split-screen dashboard
    │   ├── globals.css                # Dark glassmorphism & fact-lock glow CSS
    │   └── api/                       # Next.js App Router Route Handlers
    │       ├── dictate/route.ts       # AssemblyAI Dictation API integration
    │       ├── extract/route.ts       # Meaning Packet extraction route
    │       ├── render/route.ts        # Per-language context rendering route
    │       ├── correct/route.ts       # Voice delta correction route
    │       ├── tasks/route.ts         # Task store retrieval route
    │       └── events/route.ts        # Server-Sent Events (SSE) real-time stream
    ├── components/
    │   ├── AudioRecorder.tsx          # Mic capture & live canvas waveform visualizer
    │   ├── TaskCard.tsx               # Localized team card with fact-lock badges
    │   ├── FactLockProof.tsx          # Comparative proof table (0% drift)
    │   └── CorrectionModal.tsx        # Voice delta correction modal
    ├── lib/
    │   ├── assemblyai.ts              # AssemblyAI client wrapper
    │   ├── llm.ts                     # LLM extraction & prompt engine
    │   ├── taskStore.ts               # In-memory canonical state hub
    │   └── mockData.ts                # Verified test datasets & fail-safe fallbacks
    └── types/
        └── index.ts                   # Canonical TypeScript data contracts
```

---

## ⚖️ License

Distributed under the MIT License. See `LICENSE` for more information.
