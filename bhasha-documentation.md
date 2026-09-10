# Bhasha
### One meaning, every language

---

## 1. One-Line Pitch

Bhasha is a voice-first task handoff system for multilingual teams: someone speaks naturally in whatever language mix comes to them, and everyone else on the team gets the exact same instruction — correct names, numbers, deadlines, and conditions — in their own preferred language.

---

## 2. The Problem

Multilingual teams lose precision at the handoff moment, not the conversation moment. A manager gives an instruction mixing Hindi and English. It gets relayed, typed up, or translated by hand before it reaches everyone — and details drift: a deadline shifts, a condition gets dropped, a name gets mistranslated. Translation tools translate *sentences*. They don't protect the *facts* inside those sentences.

Existing tools solve adjacent but different problems:
- **Dictation apps** (Wispr Flow, SuperWhisper, etc.) convert speech to text in one language — they don't handle team handoff or code-switched input well.
- **Translation apps** (Google Translate, DeepL) translate text or speech accurately for two people talking — they don't preserve a task's critical facts across many simultaneous readers, and they don't structure the output into an actionable item.
- **Task tools** (Slack, Notion, Asana) assume the task is already written down correctly in one language.

Nothing sits at the intersection: **spoken, multilingual, and fact-locked.**

---

## 3. What It Is

Bhasha does not translate sentences. It extracts the *meaning* of a spoken instruction into a structured, language-independent object — the **Meaning Packet** — and then renders that same packet into each teammate's preferred language on demand. Because every language version is generated from the same underlying packet (not from each other), critical facts can be locked so they cannot silently change in translation.

**Example:**

> Spoken (Hindi-English mixed): *"Kal Rahul deployment kare, but only after tests pass — deadline 4 PM."*

Becomes:

```
Meaning Packet
─────────────────
Task:       Deploy application
Owner:      Rahul          🔒 locked
Deadline:   Tomorrow, 4 PM 🔒 locked
Condition:  Only after tests pass  🔒 locked
```

Rahul sees this in Hindi. A Japanese teammate sees it in Japanese. Both see the same owner, the same deadline, the same condition — because both are rendered from the same locked packet, not translated from each other's version.

---

## 4. Why Not Just Translate? (Addressing the obvious objection)

The most common criticism of an idea like this is fair: *"isn't this just AssemblyAI plus a translation prompt?"* Here's the actual difference, stated plainly:

| | Plain translation | Bhasha |
|---|---|---|
| Unit of work | Sentence | Structured task (owner, deadline, condition, action) |
| Source of truth | Each language version, translated from the last | One shared Meaning Packet, rendered into each language |
| Critical facts | Can drift silently across re-translation | Locked fields, provably unchanged — visible in a side-by-side view |
| Output | Text | An actionable, confirmable task |
| Failure mode it prevents | "4 PM" becoming "4 AM" three hops later | N/A — there's no hop, only one source |

The demo is built specifically to make this difference visible, not just claimed (see Section 11).

---

## 5. Core Concept: The Meaning Packet

The Meaning Packet is the central technical idea. It has two kinds of fields:

- **Locked fields** — names, dates, times, numbers, and explicit conditions. These are extracted once, tagged, and inserted into every language render as-is (transliterated for script only, never re-translated for meaning). This is what makes the "meaning lock" provable rather than just claimed.
- **Flexible fields** — the natural-language description of the task itself, which can be phrased idiomatically per language, as long as it doesn't touch a locked field.

When a teammate corrects or confirms a task by voice, the correction updates the shared Meaning Packet directly — not a personal translated copy — so every other viewer's rendering updates too.

---

## 6. How It Works (Technical Flow)

```
┌─────────────┐     ┌───────────────────────┐     ┌────────────────────┐
│  Spoken      │ →   │  AssemblyAI Dictation  │ →   │  LLM: Extraction    │
│  instruction │     │  API (Universal-3.5    │     │  Speech → Meaning   │
│  (mixed      │     │  Pro, native code-     │     │  Packet + locked    │
│  languages)  │     │  switching, filler     │     │  field tagging      │
│              │     │  removal)              │     │                     │
└─────────────┘     └───────────────────────┘     └──────────┬─────────┘
                                                               │
                                                               ▼
                                                   ┌────────────────────┐
                                                   │  Shared Meaning     │
                                                   │  Packet (canonical, │
                                                   │  single source)     │
                                                   └──────────┬─────────┘
                                                               │
                                          ┌────────────────────┼────────────────────┐
                                          ▼                    ▼                    ▼
                                  ┌───────────────┐   ┌───────────────┐   ┌───────────────┐
                                  │ Render: Hindi │   │ Render: Japanese │ │ Render: English│
                                  │ (locked fields │   │ (locked fields  │  │ (locked fields │
                                  │  inserted as-is)│  │  inserted as-is)│  │  inserted as-is)│
                                  └───────┬───────┘   └───────┬───────┘   └───────┬───────┘
                                          │                    │                    │
                                          ▼                    ▼                    ▼
                                    Rahul's view         Teammate's view      Manager's view
                                          │                    │                    │
                                          └──────── voice confirm / correct ────────┘
                                                       (updates the shared packet)
```

**Step by step:**

1. **Capture** — User speaks naturally, mixing languages as they normally think.
2. **Transcribe** — Audio goes to AssemblyAI's Dictation API (beta endpoint), using Universal-3.5 Pro for native code-switching across supported languages and automatic filler-word removal, producing a clean transcript.
3. **Extract** — An LLM parses the clean transcript into a Meaning Packet: task, owner, deadline, condition, numbers, and names. Locked fields are tagged explicitly.
4. **Store** — The Meaning Packet is saved as the single canonical record for that task (in-memory store or lightweight DB for the hackathon build).
5. **Render** — On each teammate's screen, the packet is rendered into their chosen language: flexible fields are phrased naturally, locked fields are inserted verbatim/transliterated only.
6. **Confirm or correct** — A teammate can speak a correction ("actually make it 5 PM"). This re-invokes extraction on just the delta, updates the shared packet, and all renders refresh.

---

## 7. How Users Use It (User Journey)

**As a manager (sender):**
1. Open Bhasha, press the mic button.
2. Speak the instruction naturally — no need to pick a language or slow down for code-switching.
3. Review the extracted task card before sending (task, owner, deadline, condition shown clearly, locked fields marked).
4. Send. Done.

**As a teammate (receiver):**
1. Get notified of a new task.
2. See it in your own preferred language, already set once in your profile.
3. Tap to confirm, or speak a correction if something's off ("push it to 5 PM").
4. Your confirmation/correction updates instantly for everyone else too, in their language.

No one manually translates anything at any point.

---

## 8. Tech Stack (Hackathon Build)

| Layer | Choice | Why |
|---|---|---|
| Speech-to-text | AssemblyAI Dictation API (beta, `dictation.assemblyai.com/transcribe`) | Required by the hackathon; native code-switching + filler removal reduces noise before extraction |
| Meaning extraction & rendering | LLM (Claude/GPT via API) | Structured extraction (Meaning Packet) and per-language natural rendering |
| Frontend | Simple web app, two side-by-side simulated user views | Fastest way to demo "same packet, two languages" live |
| Shared state | In-memory store or lightweight DB (Firebase/Supabase) | Just needs to hold one canonical packet per task for the demo |
| Voice correction loop | Same dictation pipeline, scoped to a single field update | Reuses the same core pipeline, no new infra |

---

## 9. How This Fulfills the Hackathon (AssemblyAI: Voice Hackathon Week — Hack into Dictation)

- **Uses the required API directly**: the entire pipeline is built on AssemblyAI's beta Dictation API — not a generic Whisper/ChatGPT stand-in.
- **Showcases the API's flagship capability**: native code-switching across languages (Universal-3.5 Pro) and clean, filler-free transcription are the whole reason the extraction step works reliably — the demo depends on and highlights this, rather than treating it as incidental.
- **Matches the event's stated target audience**: the event calls out people "building AI agents or AI-native applications" and people "experimenting with memory, context retrieval, or knowledge systems" — the Meaning Packet *is* a small structured knowledge/context object, not just a transcript.
- **Extends the event's own framing**: AssemblyAI's pitch is "dictation is becoming the default input method, everywhere." Bhasha takes that literally for teams, not just individuals — the mic replaces typing *and* manual translation *and* re-explaining yourself.
- **Fits the format**: buildable solo or in a team of up to 4, deliverable as a working web demo within the hackathon window (Sept 9–13, 2026), no external integrations required for the MVP.

---

## 10. MVP Scope (What Actually Gets Built for the Hackathon)

**In scope:**
- Task handoffs only (not general conversation or documents)
- Two simulated user views (e.g., "Manager" and "Rahul") on one screen for the demo
- Three languages demonstrated live (e.g., Hindi, English, Japanese)
- Meaning Packet extraction with locked critical fields (owner, deadline, condition)
- Voice-based confirmation and correction of a task
- A visible "proof" view showing locked fields are identical across all language renders

**Out of scope (for now):**
- Real integrations with Slack/Notion/email
- User accounts, auth, persistence beyond the demo session
- More than one task type (e.g., no free-form notes, no meetings mode)
- More than 3 languages in the live demo (the architecture supports more; the demo doesn't need to prove that live)

---

## 11. Demo Script

1. **Setup**: Two screens/windows side by side — "Manager" view and "Rahul" view (set to Hindi).
2. **Speak** into the Manager view, mixing Hindi and English naturally: the deployment instruction example above.
3. **Show** the extracted Meaning Packet appear, with locked fields visibly marked.
4. **Switch** to Rahul's view — same task appears in Hindi, same owner/deadline/condition.
5. **Add a third view** in Japanese live — same locked facts, phrased naturally in Japanese.
6. **Speak a correction** ("actually, push it to 5 PM") into any view.
7. **Show** all views update instantly, the locked deadline field changing consistently everywhere — proving the "one source of truth" claim instead of just stating it.

This is the moment that answers the "isn't this just a translation prompt" objection directly and visibly, in front of judges.

---

## 12. Honest Limitations

- **"Locked" means the LLM extraction correctly identified and tagged the field** — it isn't cryptographic proof, it's a pipeline guarantee. Worth stating plainly if asked, rather than overselling it as unbreakable.
- **Ambiguous instructions** (vague deadlines, unclear owners) will need a fallback: ask for clarification rather than guessing and locking a wrong fact.
- **Code-switch coverage** depends on which language pairs AssemblyAI's model handles natively — this should be tested directly against the beta endpoint early, not assumed.
- **Scope is narrow by design** for the hackathon (task handoffs only) — the broader "shared meaning across any communication" vision is a post-hackathon roadmap item, not part of the MVP claim.

---

## 13. Roadmap Beyond the Hackathon (Optional / Future)

- Real integrations: Slack, Notion, WhatsApp Business, email
- Support for meeting-level Meaning Packets (multiple tasks extracted from one conversation)
- Team-wide language preference settings and notification delivery
- Audit trail of corrections per task (who changed what, when)

---

## 14. Closing Pitch

> Translators help people understand words. Bhasha helps multilingual teams agree on exactly what must happen.

---

## Appendix: Team & Logistics (fill in before submission)

- **Team members:**
- **Roles:**
- **Repo link:**
- **Demo video link:**
- **Hackathon:** AssemblyAI Voice Hackathon Week — Hack into Dictation (Sept 9–13, 2026)
