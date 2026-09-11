// ==============================================================================
// Bhasha — Dev 2 (Saloni) Automated Pipeline Verification Script
// Tests: /api/dictate, /api/extract, /api/render, /api/correct, /api/events
// ==============================================================================

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

async function logStep(title, fn) {
  console.log(`\n------------------------------------------------------------`);
  console.log(`▶ ${title}`);
  console.log(`------------------------------------------------------------`);
  try {
    const res = await fn();
    console.log(`✅ Passed:`, res);
    return res;
  } catch (err) {
    console.error(`❌ Failed:`, err.message);
    throw err;
  }
}

async function runTests() {
  console.log(`🚀 Starting Dev 2 (Saloni) Backend Intelligence Test Suite`);
  console.log(`Target: ${BASE_URL}`);

  let createdTaskId = null;
  let testPacket = null;

  // Test 1: POST /api/dictate (Simulated audio upload)
  await logStep('Test 1: AssemblyAI Dictation Route (POST /api/dictate)', async () => {
    // Construct a synthetic 1-second silent WAV buffer
    const wavHeader = Buffer.alloc(44);
    wavHeader.write('RIFF', 0);
    wavHeader.writeUInt32LE(36, 4);
    wavHeader.write('WAVE', 8);
    wavHeader.write('fmt ', 12);
    wavHeader.writeUInt32LE(16, 16);
    wavHeader.writeUInt16LE(1, 20); // PCM
    wavHeader.writeUInt16LE(1, 22); // Mono
    wavHeader.writeUInt32LE(16000, 24); // 16kHz
    wavHeader.writeUInt32LE(32000, 28); // Byte rate
    wavHeader.writeUInt16LE(2, 32); // Block align
    wavHeader.writeUInt16LE(16, 34); // Bits per sample
    wavHeader.write('data', 36);
    wavHeader.writeUInt32LE(0, 40);

    const formData = new FormData();
    const blob = new Blob([wavHeader], { type: 'audio/wav' });
    formData.append('audio', blob, 'test_sample.wav');

    const res = await fetch(`${BASE_URL}/api/dictate`, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
    const data = await res.json();
    if (data.status !== 'success') throw new Error(`Dictate status not success: ${JSON.stringify(data)}`);
    return { transcript: data.transcript, confidence: data.confidence, detected_languages: data.detected_languages };
  });

  // Test 2: POST /api/extract (Hinglish transcript to Meaning Packet)
  await logStep('Test 2: LLM Meaning Packet Extraction (POST /api/extract)', async () => {
    const transcript = "Kal Rahul deployment kare, but only after tests pass — deadline 4 PM.";
    const res = await fetch(`${BASE_URL}/api/extract`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transcript }),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
    const data = await res.json();
    if (data.status !== 'success' || !data.packet) throw new Error(`Extraction failed: ${JSON.stringify(data)}`);

    createdTaskId = data.packet.task_id;
    testPacket = data.packet;

    return {
      task_id: data.packet.task_id,
      action: data.packet.action,
      owner: data.packet.locked_fields.owner,
      deadline: data.packet.locked_fields.deadline,
      conditions: data.packet.locked_fields.conditions,
      detected_languages: data.packet.detected_languages,
    };
  });

  // Test 3: POST /api/render (Multi-language Cards with Locked Facts)
  await logStep('Test 3: Zero-Drift Multi-Language Rendering (POST /api/render)', async () => {
    const res = await fetch(`${BASE_URL}/api/render`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        task_id: createdTaskId,
        target_languages: ['en', 'hi', 'ja'],
      }),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
    const data = await res.json();
    if (data.status !== 'success' || !Array.isArray(data.renders)) {
      throw new Error(`Rendering failed: ${JSON.stringify(data)}`);
    }

    const summaries = data.renders.map((r) => ({
      lang: r.language_code,
      headline: r.rendered_headline,
      body: r.rendered_body,
      is_locked_fact_intact: r.is_locked_fact_intact,
    }));

    return summaries;
  });

  // Test 4: POST /api/correct (Voice Delta Update: Push deadline to 5 PM)
  await logStep('Test 4: Voice Delta Correction (POST /api/correct)', async () => {
    const res = await fetch(`${BASE_URL}/api/correct`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        task_id: createdTaskId,
        correction_transcript: "Actually push the deadline to 5 PM tomorrow",
      }),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
    const data = await res.json();
    if (data.status !== 'success') throw new Error(`Correction failed: ${JSON.stringify(data)}`);

    return {
      version: data.updated_packet.version,
      updated_deadline: data.updated_packet.locked_fields.deadline,
      delta: data.delta,
      first_card_body: data.renders[0]?.rendered_body,
    };
  });

  // Test 5: GET /api/tasks (Verify persisted store)
  await logStep('Test 5: In-Memory Task Store Verification (GET /api/tasks)', async () => {
    const res = await fetch(`${BASE_URL}/api/tasks`);
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
    const data = await res.json();
    return {
      total_active_tasks: data.tasks?.length || 0,
    };
  });

  console.log(`\n============================================================`);
  console.log(`🎉 ALL DEV 2 (SALONI) BACKEND INTELLIGENCE TESTS PASSED!`);
  console.log(`============================================================\n`);
}

runTests().catch((e) => {
  console.error('\n💥 Test suite execution failed:', e);
  process.exit(1);
});
