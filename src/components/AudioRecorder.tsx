'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Sparkles, Volume2, AlertCircle } from 'lucide-react';
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

      setIsRecording(true);
      setRecordSeconds(0);
      timerRef.current = setInterval(() => {
        setRecordSeconds((prev) => prev + 1);
      }, 1000);

      drawWaveform();
    } catch (err: any) {
      console.error('Microphone access denied:', err);
      setErrorMessage('Microphone access was denied. You can still click "Try Demo Hinglish Sample" below!');
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
    }

    // Pass Hinglish sample for demo evaluation
    onTranscriptReady(SAMPLE_AUDIO_CASES[0].transcript);
  };

  const triggerSampleDemo = (index: number = 0) => {
    onTranscriptReady(SAMPLE_AUDIO_CASES[index].transcript);
  };

  return (
    <div className="w-full glass-panel rounded-2xl p-6 border border-teal-500/20 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

      <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
        <div className="flex items-center gap-4">
          <button
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isProcessing}
            className={`relative flex items-center justify-center w-16 h-16 rounded-full transition-all duration-300 shadow-lg ${
              isRecording
                ? 'bg-rose-600 hover:bg-rose-700 ring-4 ring-rose-500/40 animate-pulse'
                : 'bg-gradient-to-tr from-teal-600 to-emerald-500 hover:from-teal-500 hover:to-emerald-400 hover:scale-105 ring-4 ring-teal-500/20'
            } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
            title={isRecording ? 'Click to stop' : 'Click to speak'}
          >
            {isRecording ? (
              <Square className="w-6 h-6 text-white" />
            ) : (
              <Mic className="w-7 h-7 text-white" />
            )}
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-slate-100">
                {isRecording
                  ? 'Listening (Speak Hinglish, Hindi, or English)...'
                  : isProcessing
                  ? 'Processing AssemblyAI Dictation...'
                  : 'Press Mic to Dispatch Task'}
              </h3>
              {isRecording && (
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Powered by AssemblyAI Universal-3.5 Pro with native code-switching and noise suppression.
            </p>
          </div>
        </div>

        {/* Live Audio Visualizer or Demo Quick-Triggers */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          {isRecording ? (
            <div className="flex items-center gap-3 bg-slate-900/60 px-4 py-2 rounded-xl border border-slate-800">
              <canvas ref={canvasRef} width="160" height="36" className="rounded" />
              <span className="font-mono text-sm text-teal-300 font-semibold">
                00:{recordSeconds < 10 ? `0${recordSeconds}` : recordSeconds}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium mr-1">Demo Quick-Loads:</span>
              <button
                onClick={() => triggerSampleDemo(0)}
                disabled={isProcessing}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-teal-950/80 hover:bg-teal-900 text-teal-300 border border-teal-700/50 transition-all shadow-sm hover:shadow"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Hinglish Deployment Sample
              </button>
              <button
                onClick={() => triggerSampleDemo(1)}
                disabled={isProcessing}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-950/60 hover:bg-amber-900/80 text-amber-300 border border-amber-700/40 transition-all shadow-sm"
              >
                <Volume2 className="w-3.5 h-3.5" />
                Shift to 5 PM Delta
              </button>
            </div>
          )}
        </div>
      </div>

      {errorMessage && (
        <div className="mt-3 flex items-center gap-2 text-xs text-amber-300 bg-amber-950/40 border border-amber-800/60 px-3 py-2 rounded-lg">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};
