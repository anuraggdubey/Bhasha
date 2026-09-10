# Bhasha (भाषा)
### *One Meaning, Every Language*
**Voice-First Task Handoff System for Multilingual Teams**

[![Built for](https://img.shields.io/badge/AssemblyAI-Voice_Hackathon_2026-teal?style=for-the-badge&logo=assemblyai)](https://www.assemblyai.com/)
[![Next.js](https://img.shields.io/badge/Next.js-14_App_Router-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Deploy with Vercel](https://img.shields.io/badge/Vercel-Deploy_Ready-000000?style=for-the-badge&logo=vercel)](https://vercel.com/)

---

## 📖 1. What is Bhasha?

Multilingual teams lose precision at the handoff moment, not the conversation moment. A manager gives a spoken instruction in **Hinglish** (Hindi + English). Traditional translation tools translate *sentences*, allowing critical numbers, deadlines, and conditions to drift across hops (e.g., *"4 PM"* becoming *"4 AM"* or conditions being silently dropped).

**Bhasha** solves this by extracting spoken instructions into an intermediate, language-independent **Meaning Packet** with **Locked Facts (🔒)**.
- **Locked Fields (🔒)**: Names, dates, times, and gating conditions are extracted once and held invariant.
- **Flexible Phrasing**: The task intent is phrased naturally and idiomatically into each teammate's preferred language (Hindi, Japanese, English).
- **Voice Delta Loop**: Speaking a quick voice correction (*"Actually make that 5 PM"*) mutates the shared Meaning Packet and refreshes all team views simultaneously.

---

## 🛠️ 2. Tech Stack & Architecture

- **Speech-to-Text**: [AssemblyAI Dictation API](https://dictation.assemblyai.com/transcribe) (Universal-3.5 Pro) with native code-switching & automatic filler removal.
- **Extraction & Rendering Engine**: LLM with structured JSON schema outputs.
- **Fullstack Web Framework**: [Next.js 14](https://nextjs.org/) (App Router) + TypeScript.
- **Styling & Design System**: Tailwind CSS with custom glassmorphism and fact-lock glow badges.
- **Real-Time State Push**: Server-Sent Events (`/api/events`) for instant multi-client card synchronization.
- **Deployment Target**: Vercel (Edge & Serverless, HTTPS-enforced for browser mic access).

---

## 👥 3. Team & Ownership Matrix

| Contributor | Role | Deliverables & Responsibilities |
| :--- | :--- | :--- |
| **DEV 1: JOSHNA** | **Frontend Lead & UI Architecture** | • Full UI/UX Design System & Theme<br>• Simulated Multi-User Split View (Manager, Rahul [Hindi], Kenji [Japanese])<br>• Audio Recorder & Web Audio API Waveform Visualizer<br>• "Fact-Lock Proof" Visual Comparison Inspector<br>• Frontend API Client & State Sync |
| **DEV 2: SALONI** | **Backend Lead & AI/STT Engine** | • AssemblyAI Dictation API Integration (`Universal-3.5 Pro`)<br>• LLM Structured Meaning Packet Extractor<br>• Per-Language Context Rendering Engine (Hindi, Japanese, English)<br>• Voice Delta Correction Processor<br>• Next.js API Route Handlers (`/api/dictate`, `/api/extract`, `/api/render`, `/api/correct`) |
| **DEV 3: ANURAG** | **Repo Setup, QA/Bug Fixing, DevOps & Docs** | • Fullstack Next.js + TypeScript Scaffolding & Shared Types<br>• In-Memory Canonical Task Store & Event Dispatcher<br>• Fullstack QA Testing, Bug Hunting & Edge-Case Patching<br>• Live Production Deployment to Vercel (HTTPS mic permissions)<br>• Pre-Recorded Test Clips, Mock Fallbacks & Demo Script Rehearsals |

---

## 🚀 4. Quickstart Guide

### Prerequisites
- Node.js `v18+` (Tested on `v20` and `v24`)
- npm `v9+`

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/anuraggdubey/Bhasha.git
   cd Bhasha
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   Add your API keys:
   ```env
   ASSEMBLYAI_API_KEY=your_assemblyai_api_key_here
   OPENAI_API_KEY=your_openai_api_key_here
   NEXT_PUBLIC_USE_MOCK_DATA=false
   ```
   *(Note: If no API keys are provided, the app automatically runs in Fail-Safe Mock Mode with pre-recorded Hinglish samples for instant demo evaluation).*

4. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 5. Deployment to Vercel

Bhasha is built as a unified full-stack Next.js app optimized for direct deployment to Vercel.

1. Push your repository to GitHub.
2. Go to [Vercel Dashboard](https://vercel.com/new) and click **Import Project**.
3. Add the following **Environment Variables** in project settings:
   - `ASSEMBLYAI_API_KEY`
   - `OPENAI_API_KEY`
   - `NEXT_PUBLIC_USE_MOCK_DATA` (`false` for live API calls, `true` for mock mode)
4. Click **Deploy**. Vercel will build and assign an HTTPS URL (required for browser microphone access).

---

## 🎬 6. Hackathon Live Demo Script (90 Seconds)

1. **The Spoken Instruction (0:00 - 0:20)**:
   - Manager presses the mic button and speaks naturally in Hinglish:
     > *"Kal Rahul deployment kare, but only after tests pass — deadline 4 PM."*
   - Watch the audio waveform move in real-time.
2. **The Meaning Packet (0:20 - 0:45)**:
   - AssemblyAI cleans fillers and transcribes Hinglish.
   - The Meaning Packet shows locked facts:
     - **Owner**: `Rahul` 🔒
     - **Deadline**: `Tomorrow, 4:00 PM IST` 🔒
     - **Condition**: `Only after tests pass` 🔒
3. **The Multi-Language Relay (0:45 - 1:10)**:
   - Rahul sees his card in Hindi.
   - Kenji sees his card in Japanese.
   - The **Fact-Lock Proof View** highlights that all three recipients see the exact same deadline and condition.
4. **The Voice Correction (1:10 - 1:30)**:
   - Rahul clicks **Voice Correct** on his Hindi card:
     > *"Actually make that 5 PM, tests are taking longer."*
   - All three cards flash and update to **5:00 PM** in real-time. Zero drift, one shared source of truth.

---

## 📁 7. Repository Structure

```
Bhasha/
├── README.md                          # Master documentation & setup guide
├── bhasha-implementationplan.md       # Detailed engineering implementation plan
├── bhasha-documentation.md            # Product architecture & design brief
├── package.json                       # Next.js 14 fullstack dependencies
├── tsconfig.json                      # Path aliases (@/*)
├── tailwind.config.ts                 # Custom dark glassmorphism design tokens
├── postcss.config.mjs
├── next.config.mjs
├── .env.example                       # Documented environment variables
├── .gitignore
│
└── src/
    ├── app/
    │   ├── layout.tsx                 # Root layout with fonts & dark theme
    │   ├── page.tsx                   # Master interactive split-screen dashboard
    │   ├── globals.css                # Glassmorphism & fact-lock glow CSS
    │   └── api/
    │       ├── dictate/route.ts       # AssemblyAI Dictation API route
    │       ├── extract/route.ts       # LLM Meaning Packet extraction route
    │       ├── render/route.ts        # Per-language card rendering route
    │       ├── correct/route.ts       # Voice delta correction route
    │       ├── tasks/route.ts         # In-memory tasks endpoint
    │       └── events/route.ts        # Server-Sent Events (SSE) real-time stream
    ├── components/
    │   ├── AudioRecorder.tsx          # Mic capture & canvas waveform visualizer
    │   ├── TaskCard.tsx               # Localized team card with fact-lock badges
    │   ├── FactLockProof.tsx          # Comparative proof table (0% drift)
    │   └── CorrectionModal.tsx        # Voice delta correction modal
    ├── lib/
    │   ├── assemblyai.ts              # AssemblyAI Universal-3.5 Pro client
    │   ├── llm.ts                     # LLM extraction & prompt engine
    │   ├── taskStore.ts               # In-memory canonical task store
    │   └── mockData.ts                # Verified sample test cases & fallbacks
    └── types/
        └── index.ts                   # Canonical TypeScript data contracts
```

---

## ⚖️ License
MIT License. Built for the AssemblyAI Voice Hackathon Week 2026.
