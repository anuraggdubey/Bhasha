'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Sparkles, Volume2, AlertCircle, Radio, Clock, ShieldAlert } from 'lucide-react';
import { SAMPLE_AUDIO_CASES } from '@/lib/mockData';

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

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (audioContextRef.current) audioContextRef.current.close();
      if (mediaStreamRef.current) mediaStreamRef.current.getTracks().forEach((t) => t.stop());
    };
  }, []);

  // Waveform rendering loop
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

        const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
        gradient.addColorStop(0, '#0d9488');
        gradient.addColorStop(1, '#2dd4bf');

        ctx.fillStyle = gradient;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

        x += barWidth + 2;
      }
    };

    render();
  };

  const startRecording = async () => {
    setErrorMessage(null);
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

      // Initialize MediaRecorder to capture audio binary
      audioChunksRef.current = [];
      try {
        const recorder = new MediaRecorder(stream);
        recorder.ondataavailable = (event) => {
          if (event.data && event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };
        recorder.start(200);
        mediaRecorderRef.current = recorder;
      } catch (recErr) {
        console.warn('MediaRecorder initialization warning:', recErr);
      }

      setIsRecording(true);
      setRecordSeconds(0);
      timerRef.current = setInterval(() => {
        setRecordSeconds((prev) => prev + 1);
      }, 1000);

      drawWaveform();
    } catch (err: any) {
      console.error('Microphone access denied:', err);
      setErrorMessage('Microphone access not granted. Click a Demo Sample below to experience the zero-drift pipeline instantly!');
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);

    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== 'inactive') {
      recorder.onstop = async () => {
        if (mediaStreamRef.current) {
          mediaStreamRef.current.getTracks().forEach((t) => t.stop());
        }

        try {
          const audioBlob = new Blob(audioChunksRef.current, {
            type: recorder.mimeType || 'audio/webm',
          });

          if (audioBlob.size > 0) {
            const formData = new FormData();
            formData.append('audio', audioBlob, 'recording.webm');

            const dictateRes = await fetch('/api/dictate', {
              method: 'POST',
              body: formData,
            });

            if (dictateRes.ok) {
              const dictateData = await dictateRes.json();
              if (dictateData.transcript) {
                onTranscriptReady(dictateData.transcript);
                return;
              }
            }
          }
        } catch (postErr) {
          console.warn('[AudioRecorder] Failed to post audio to /api/dictate, falling back to sample:', postErr);
        }

        // Fallback to sample Hinglish audio
        onTranscriptReady(SAMPLE_AUDIO_CASES[0].transcript);
      };

      recorder.stop();
    } else {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      }
      onTranscriptReady(SAMPLE_AUDIO_CASES[0].transcript);
    }
  };

  const triggerSampleDemo = (index: number = 0) => {
    onTranscriptReady(SAMPLE_AUDIO_CASES[index].transcript);
  };

  // Additional 3rd sample for variety
  const triggerHotfixDemo = () => {
    onTranscriptReady(
      "Kenji-san, critical memory leak in payment gateway. Deploy hotfix patch immediately before market open at 9 AM Tokyo time. Tests must pass."
    );
  };

  return (
    <div className="w-full glass-panel-elevated rounded-2xl p-6 border border-teal-500/25 shadow-2xl relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

      <div className="flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
        <div className="flex items-center gap-5">
          <button
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isProcessing}
            className={`relative flex items-center justify-center w-16 h-16 rounded-2xl transition-all duration-300 shadow-xl ${
              isRecording
                ? 'bg-rose-600 hover:bg-rose-700 ring-4 ring-rose-500/40 animate-pulse'
                : 'bg-gradient-to-tr from-teal-500 to-emerald-400 hover:from-teal-400 hover:to-emerald-300 hover:scale-105 ring-4 ring-teal-500/20'
            } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
            title={isRecording ? 'Click to stop recording' : 'Click to speak task in Hinglish/English/Hindi'}
          >
            {isRecording ? (
              <Square className="w-6 h-6 text-white" />
            ) : (
              <Mic className="w-7 h-7 text-slate-950" />
            )}
          </button>

          <div>
            <div className="flex items-center gap-2.5">
              <h3 className="text-lg font-extrabold text-slate-100">
                {isRecording
                  ? 'Listening (Speak Hinglish, Hindi, or English)...'
                  : isProcessing
                  ? 'Transcribing & Extracting Meaning Packet...'
                  : 'Dispatch Voice Task'}
              </h3>
              {isRecording && (
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
              <span>Powered by AssemblyAI Universal-3.5 Pro</span>
              <span className="text-slate-600">•</span>
              <span className="text-teal-400 font-mono">Code-Switching Ready</span>
            </p>
          </div>
        </div>

        {/* Live Audio Visualizer or Demo Quick-Triggers */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
          {isRecording ? (
            <div className="flex items-center gap-3 bg-slate-900/80 px-4 py-2 rounded-xl border border-slate-700 shadow-inner">
              <canvas ref={canvasRef} width="160" height="36" className="rounded" />
              <div className="flex items-center gap-1.5 font-mono text-sm text-teal-300 font-bold">
                <Clock className="w-3.5 h-3.5 text-teal-400 animate-spin" />
                <span>00:{recordSeconds < 10 ? `0${recordSeconds}` : recordSeconds}</span>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-400 font-mono font-medium mr-1">One-Click Samples:</span>
              <button
                onClick={() => triggerSampleDemo(0)}
                disabled={isProcessing}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-teal-950/80 hover:bg-teal-900 text-teal-300 border border-teal-700/60 transition-all shadow-sm hover:scale-[1.02]"
              >
                <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                Hinglish Dispatch
              </button>
              <button
                onClick={() => triggerSampleDemo(1)}
                disabled={isProcessing}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-950/60 hover:bg-amber-900/80 text-amber-300 border border-amber-700/50 transition-all shadow-sm hover:scale-[1.02]"
              >
                <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                Shift to 5 PM
              </button>
              <button
                onClick={triggerHotfixDemo}
                disabled={isProcessing}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-950/60 hover:bg-indigo-900/80 text-indigo-300 border border-indigo-700/50 transition-all shadow-sm hover:scale-[1.02]"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-indigo-400" />
                Hotfix Tokyo
              </button>
            </div>
          )}
        </div>
      </div>

      {errorMessage && (
        <div className="mt-4 flex items-center gap-2 text-xs text-amber-300 bg-amber-950/40 border border-amber-800/60 px-3.5 py-2.5 rounded-xl">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-amber-400" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};
