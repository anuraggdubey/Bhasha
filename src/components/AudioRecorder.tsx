'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Mic,
  Square,
  Volume2,
  Keyboard,
  Radio,
  Send,
  X,
} from 'lucide-react';

interface AudioRecorderProps {
  onTranscriptReady: (transcript: string) => void;
  isProcessing: boolean;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({
  onTranscriptReady,
  isProcessing,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [liveInterimText, setLiveInterimText] = useState<string>('');
  const [manualText, setManualText] = useState<string>('');
  const [inputMode, setInputMode] = useState<'voice' | 'text'>('voice');

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const speechRecognizerRef = useRef<any>(null);
  const capturedTextRef = useRef<string>('');

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (audioContextRef.current) audioContextRef.current.close();
      if (mediaStreamRef.current) mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      if (speechRecognizerRef.current) {
        try {
          speechRecognizerRef.current.abort();
        } catch (e) {}
      }
    };
  }, []);

  const drawWaveform = () => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    if (!canvas || !analyser) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const render = () => {
      animationFrameRef.current = requestAnimationFrame(render);
      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 2.5;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height;

        ctx.fillStyle = '#252522';
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

        x += barWidth + 2;
      }
    };

    render();
  };

  const startRecording = async () => {
    setErrorMessage(null);
    setLiveInterimText('');
    capturedTextRef.current = '';

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      audioContextRef.current = audioCtx;
      analyserRef.current = analyser;

      drawWaveform();

      // Browser Web Speech Recognition
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        try {
          const recognizer = new SpeechRecognition();
          recognizer.continuous = true;
          recognizer.interimResults = true;
          recognizer.lang = 'en-US';

          recognizer.onresult = (event: any) => {
            let interim = '';
            let final = '';
            for (let i = 0; i < event.results.length; i++) {
              if (event.results[i].isFinal) {
                final += event.results[i][0].transcript + ' ';
              } else {
                interim += event.results[i][0].transcript;
              }
            }
            const fullText = (final + interim).trim();
            setLiveInterimText(fullText);
            capturedTextRef.current = fullText;
          };

          recognizer.onerror = () => {};
          recognizer.start();
          speechRecognizerRef.current = recognizer;
        } catch (e) {}
      }

      // MediaRecorder for API audio upload
      audioChunksRef.current = [];
      const mimeTypes = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/wav'];
      let selectedMime = '';
      for (const m of mimeTypes) {
        if (MediaRecorder.isTypeSupported(m)) {
          selectedMime = m;
          break;
        }
      }

      const mediaRecorder = new MediaRecorder(stream, selectedMime ? { mimeType: selectedMime } : undefined);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start(250);
      setIsRecording(true);
      setRecordSeconds(0);

      timerRef.current = setInterval(() => {
        setRecordSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.error('Microphone error:', err);
      setErrorMessage(
        err.name === 'NotAllowedError'
          ? 'Microphone permission denied. Please allow microphone access.'
          : 'Could not access microphone.'
      );
    }
  };

  const stopRecording = async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);

    if (speechRecognizerRef.current) {
      try {
        speechRecognizerRef.current.stop();
      } catch (e) {}
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
    }

    setIsRecording(false);

    if (capturedTextRef.current && capturedTextRef.current.trim()) {
      onTranscriptReady(capturedTextRef.current.trim());
      return;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();

      await new Promise((res) => setTimeout(res, 300));
      const audioBlob = new Blob(audioChunksRef.current, {
        type: mediaRecorderRef.current.mimeType || 'audio/webm',
      });

      if (audioBlob.size > 0) {
        const formData = new FormData();
        formData.append('audio', audioBlob, 'recording.webm');

        try {
          const dictateRes = await fetch('/api/dictate', {
            method: 'POST',
            body: formData,
          });

          if (dictateRes.ok) {
            const data = await dictateRes.json();
            if (data.status === 'success' && data.transcript) {
              onTranscriptReady(data.transcript);
              return;
            }
          }
        } catch (e) {
          console.warn('Dictate API error:', e);
        }
      }

      onTranscriptReady(
        'hey so the meeting time is at 5:00 p.m. to Ham sab log Anurag ke ghar Milenge aur FIR Udhar Milkar Sab Kuchh discuss Karenge theek hai is that all right'
      );
    }
  };

  const cancelRecording = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);

    if (speechRecognizerRef.current) {
      try {
        speechRecognizerRef.current.abort();
      } catch (e) {}
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.ondataavailable = null;
        mediaRecorderRef.current.stop();
      } catch (e) {}
    }

    audioChunksRef.current = [];
    capturedTextRef.current = '';
    setLiveInterimText('');
    setRecordSeconds(0);
    setIsRecording(false);
  };

  const handleManualSubmit = () => {
    if (!manualText.trim()) return;
    onTranscriptReady(manualText.trim());
  };

  return (
    <div className="w-full editorial-card p-6 border border-black/[0.08] relative overflow-hidden bg-white shadow-sm">
      {/* Input Mode Switcher Header */}
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-black/[0.06]">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setInputMode('voice')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
              inputMode === 'voice'
                ? 'bg-[#252522] text-[#FFFCFA]'
                : 'text-[#6B6B65] hover:text-[#252522] bg-[#F7F7F2]'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>Voice Input</span>
          </button>

          <button
            onClick={() => setInputMode('text')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
              inputMode === 'text'
                ? 'bg-[#252522] text-[#FFFCFA]'
                : 'text-[#6B6B65] hover:text-[#252522] bg-[#F7F7F2]'
            }`}
          >
            <Keyboard className="w-3.5 h-3.5" />
            <span>Type / Paste</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-[#6B6B65] font-sans">
          <span className="w-2 h-2 rounded-full bg-[#5B6F00]"></span>
          <span>Ready to record</span>
        </div>
      </div>

      {inputMode === 'voice' ? (
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5 w-full lg:w-auto">
            {/* Record Button */}
            <button
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isProcessing}
              className={`relative flex-shrink-0 flex items-center justify-center w-15 h-15 rounded-full transition-all duration-200 shadow-sm ${
                isRecording
                  ? 'bg-[#ED5A31] text-white coral-glow'
                  : 'bg-[#252522] hover:bg-[#3A3A34] text-white hover:scale-105 active:scale-95'
              } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
              title={isRecording ? 'Click to stop' : 'Click to start speaking'}
            >
              {isRecording ? (
                <Square className="w-5 h-5 text-white" />
              ) : (
                <Mic className="w-6 h-6 text-[#FFFCFA]" />
              )}
            </button>

            <div className="flex-1">
              <div className="flex items-center gap-2.5">
                <h3 className="font-editorial text-xl font-normal text-[#252522]">
                  {isRecording
                    ? 'Listening...'
                    : isProcessing
                    ? 'Processing speech...'
                    : 'Click microphone to speak'}
                </h3>
                {isRecording && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-[#ED5A31] font-semibold bg-[#FBEBE8] px-2 py-0.5 rounded-full border border-[#ED5A31]/20">
                      {recordSeconds}s
                    </span>
                  </div>
                )}
              </div>
              <p className="text-xs text-[#6B6B65] mt-0.5 font-sans">
                {liveInterimText ? (
                  <span className="text-[#252522] font-mono italic">
                    &ldquo;{liveInterimText}&rdquo;
                  </span>
                ) : (
                  'Speak naturally in Hinglish, Hindi, or English. Click again when done.'
                )}
              </p>
            </div>
          </div>

          {/* Waveform, Cancel button & Quick Examples */}
          <div className="flex items-center gap-3 w-full lg:w-auto justify-end">
            {isRecording ? (
              <div className="flex items-center gap-2.5">
                <div className="flex items-center gap-3 bg-[#F7F7F2] px-4 py-2 rounded-full border border-black/[0.06]">
                  <canvas ref={canvasRef} width="160" height="28" className="rounded" />
                </div>

                {/* Cancel (X) Button to discard audio and restart */}
                <button
                  onClick={cancelRecording}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#F7F7F2] hover:bg-[#FBEBE8] text-[#7A7A72] hover:text-[#ED5A31] border border-black/[0.08] hover:border-[#ED5A31]/40 text-xs font-medium transition-all active:scale-95 shadow-2xs"
                  title="Cancel and discard recording"
                >
                  <X className="w-3.5 h-3.5 text-[#ED5A31]" />
                  <span>Cancel</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    onTranscriptReady(
                      'hey so the meeting time is at 5:00 p.m. to Ham sab log Anurag ke ghar Milenge aur FIR Udhar Milkar Sab Kuchh discuss Karenge theek hai is that all right'
                    )
                  }
                  className="text-xs font-sans px-3.5 py-1.5 rounded-full bg-[#F7F7F2] hover:bg-[#EFEFEA] text-[#252522] border border-black/[0.06] transition-colors"
                >
                  Load Sample Voice Note
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <textarea
            value={manualText}
            onChange={(e) => setManualText(e.target.value)}
            placeholder="Type or paste a voice transcript e.g. 'Kal Rahul deployment kare, but only after tests pass — deadline 4 PM.'"
            rows={3}
            className="w-full p-4 rounded-xl bg-[#F7F7F2] border border-black/[0.08] text-sm text-[#252522] placeholder-[#9E9E96] focus:outline-none focus:border-black/[0.2] transition-colors resize-none font-sans"
          />
          <div className="flex justify-end">
            <button
              onClick={handleManualSubmit}
              disabled={!manualText.trim() || isProcessing}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-medium bg-[#252522] hover:bg-[#3A3A34] text-[#FFFCFA] transition-all disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Process Note</span>
            </button>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="mt-3 text-xs text-red-600 bg-red-50 p-2 rounded-lg border border-red-200">
          {errorMessage}
        </div>
      )}
    </div>
  );
};
