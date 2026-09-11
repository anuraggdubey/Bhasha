import { DictateResponse } from '@/types';

/**
 * AssemblyAI Speech-to-Text & Dictation Client with Groq Whisper Fallback
 * Primary:
 * - Dictation API (Universal-3.5 Pro): https://dictation.assemblyai.com/transcribe
 * - Core API v2: https://api.assemblyai.com/v2/upload + /v2/transcript
 * Fallback:
 * - Groq Whisper Large v3: https://api.groq.com/openai/v1/audio/transcriptions
 */

export async function transcribeWithAssemblyAI(
  audioBuffer: Buffer,
  mimeType: string = 'audio/wav'
): Promise<DictateResponse> {
  const apiKey = process.env.ASSEMBLYAI_API_KEY;
  const groqKey = process.env.GROQ_API_KEY;

  const hasAssemblyKey = Boolean(apiKey && !apiKey.includes('your_') && apiKey.trim() !== '');
  const hasGroqKey = Boolean(groqKey && !groqKey.includes('your_') && groqKey.trim() !== '');

  if (!hasAssemblyKey && !hasGroqKey) {
    return {
      status: 'error',
      transcript: '',
      error: 'Missing API Key. Please add ASSEMBLYAI_API_KEY or GROQ_API_KEY to your .env.local to transcribe audio in real-time.',
    };
  }

  // 1. If AssemblyAI key is available, run AssemblyAI Dictation & Core v2
  if (apiKey && !apiKey.includes('your_') && apiKey.trim() !== '') {
    const assemblyKey = apiKey.trim();

    // 1A. Primary: AssemblyAI Dictation API endpoint (Universal-3.5 Pro)
    try {
      console.log('[AssemblyAI Service] Calling live Dictation API (Universal-3.5 Pro)...');
      const dictationRes = await fetch('https://dictation.assemblyai.com/transcribe', {
        method: 'POST',
        headers: {
          Authorization: assemblyKey,
          'Content-Type': mimeType || 'audio/wav',
          'X-Model': 'universal-3.5-pro',
          'X-Code-Switching': 'true',
          'X-Remove-Filler-Words': 'true',
        },
        body: new Uint8Array(audioBuffer),
      });

      if (dictationRes.ok) {
        const data = await dictationRes.json();
        const transcript = data.text || data.transcript || '';
        if (transcript) {
          return {
            status: 'success',
            transcript,
            confidence: data.confidence || 0.96,
            detected_languages: data.languages || data.detected_languages || ['en'],
          };
        }
      } else {
        const errText = await dictationRes.text();
        console.warn(`[AssemblyAI Service] Dictation status ${dictationRes.status}: ${errText}. Trying Core v2 fallback...`);
      }
    } catch (dictationErr: any) {
      console.warn('[AssemblyAI Service] Dictation API network failed, trying Core v2...', dictationErr.message);
    }

    // 1B. Fallback: Core AssemblyAI v2 API (Upload -> Transcribe)
    try {
      console.log('[AssemblyAI Service] Uploading audio to AssemblyAI Core API v2...');
      const uploadRes = await fetch('https://api.assemblyai.com/v2/upload', {
        method: 'POST',
        headers: {
          Authorization: assemblyKey,
          'Content-Type': 'application/octet-stream',
        },
        body: new Uint8Array(audioBuffer),
      });

      if (uploadRes.ok) {
        const uploadData = await uploadRes.json();
        const uploadUrl = uploadData.upload_url;

        if (uploadUrl) {
          console.log('[AssemblyAI Service] Submitting transcript job to v2 API...');
          const transcriptReqRes = await fetch('https://api.assemblyai.com/v2/transcript', {
            method: 'POST',
            headers: {
              Authorization: assemblyKey,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              audio_url: uploadUrl,
              language_detection: true,
              speech_model: 'best',
              punctuate: true,
              format_text: true,
            }),
          });

          if (transcriptReqRes.ok) {
            const transcriptData = await transcriptReqRes.json();
            const transcriptId = transcriptData.id;

            // Poll for transcript completion (up to 20 seconds)
            const startTime = Date.now();
            while (Date.now() - startTime < 20000) {
              await new Promise((res) => setTimeout(res, 1000));
              const pollRes = await fetch(`https://api.assemblyai.com/v2/transcript/${transcriptId}`, {
                headers: { Authorization: assemblyKey },
              });

              if (pollRes.ok) {
                const pollData = await pollRes.json();
                if (pollData.status === 'completed') {
                  return {
                    status: 'success',
                    transcript: pollData.text || '',
                    confidence: pollData.confidence || 0.95,
                    detected_languages: pollData.language_code ? [pollData.language_code] : ['en'],
                  };
                }
                if (pollData.status === 'error') {
                  console.warn(`[AssemblyAI Service] v2 job error: ${pollData.error}`);
                  break;
                }
              }
            }
          }
        }
      }
    } catch (coreErr: any) {
      console.error('[AssemblyAI Service] Core API failed:', coreErr);
    }
  }

  // 2. High-speed Fallback: Groq Whisper Large v3
  if (groqKey && !groqKey.includes('your_') && groqKey.trim() !== '') {
    console.log('[Audio Service] Calling Groq Whisper Large v3 fallback...');
    const groqResult = await transcribeWithGroqWhisper(audioBuffer, mimeType, groqKey.trim());
    if (groqResult) {
      return groqResult;
    }
  }

  return {
    status: 'error',
    transcript: '',
    error: 'Audio transcription failed. Please check your API keys in .env.local and try again.',
  };
}

/**
 * High-Speed Groq Whisper Large v3 Transcription
 */
async function transcribeWithGroqWhisper(
  audioBuffer: Buffer,
  mimeType: string,
  groqKey: string
): Promise<DictateResponse | null> {
  try {
    const formData = new FormData();
    const blob = new Blob([new Uint8Array(audioBuffer)], { type: mimeType || 'audio/wav' });
    formData.append('file', blob, 'audio.wav');
    formData.append('model', 'whisper-large-v3');
    formData.append('response_format', 'json');

    const res = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${groqKey}`,
      },
      body: formData,
    });

    if (res.ok) {
      const data = await res.json();
      if (data.text) {
        return {
          status: 'success',
          transcript: data.text,
          confidence: 0.98,
          detected_languages: ['auto'],
        };
      }
    } else {
      const errText = await res.text();
      console.warn(`[Groq Whisper Service] HTTP ${res.status}: ${errText}`);
    }
  } catch (err: any) {
    console.warn('[Groq Whisper Service] Request failed:', err.message);
  }
  return null;
}
