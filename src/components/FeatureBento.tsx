'use client';

import React, { useEffect, useState } from 'react';
import { Mic, ShieldCheck, Lock, Github, Check, RefreshCw } from 'lucide-react';

export default function FeatureBento() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-black/[0.04]">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="font-editorial text-4xl sm:text-5xl text-[#252522] font-normal tracking-tight">
          Your entire multilingual stack in one place
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-12">
        
        {/* Card 1: Voice-Native Intake */}
        <div className="flex flex-col gap-6 group cursor-default">
          <div className="bg-[#F7F7F2] rounded-3xl h-[300px] w-full overflow-hidden relative border border-black/[0.04] transition-colors group-hover:bg-[#EFEFEA]">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                {/* Background glow */}
                <div className="absolute inset-0 bg-[#ED5A31] blur-2xl opacity-10 rounded-full animate-pulse-slow transition-opacity group-hover:opacity-20"></div>
                {/* The pill */}
                <div 
                  className={`relative bg-white border border-black/[0.06] rounded-full px-6 py-4 flex items-center gap-4 shadow-sm group-hover:shadow-md transition-all duration-700 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] ${
                    show ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                  }`}
                >
                  <Mic className="w-5 h-5 text-[#ED5A31]" />
                  <div className="flex gap-1 h-5 items-center">
                    <div className="w-1 h-3 bg-[#ED5A31] rounded-full animate-wave" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-1 h-5 bg-[#ED5A31] rounded-full animate-wave" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-1 h-2 bg-[#ED5A31] rounded-full animate-wave" style={{ animationDelay: '300ms' }}></div>
                    <div className="w-1 h-4 bg-[#ED5A31] rounded-full animate-wave" style={{ animationDelay: '450ms' }}></div>
                  </div>
                  <span className="text-sm font-sans text-[#252522] ml-2">Listening...</span>
                </div>
              </div>
            </div>
          </div>
          <div className="px-2">
            <h3 className="text-xl font-medium text-[#252522] mb-2 font-sans">Voice-Native Intake</h3>
            <p className="text-[#6B6B65] text-[15px] leading-relaxed font-sans">
              Speak naturally in Hinglish or mixed languages. Bhasha instantly strips filler words and extracts your core intent.
            </p>
          </div>
        </div>

        {/* Card 2: Immutable Fact Locks */}
        <div className="flex flex-col gap-6 group cursor-default">
          <div className="bg-[#F7F7F2] rounded-3xl h-[300px] w-full overflow-hidden relative border border-black/[0.04] transition-colors group-hover:bg-[#EFEFEA]">
            <div className="absolute inset-0 flex items-center justify-center">
              <div 
                className={`transition-all duration-700 ease-out ${
                  show ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
                }`}
              >
                <div className="bg-white border border-black/[0.06] rounded-2xl p-5 shadow-sm w-[260px] animate-float group-hover:shadow-md transition-all">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-black/[0.04]">
                    <span className="text-xs font-mono text-[#7A7A72]">INVARIANTS</span>
                    <ShieldCheck className="w-4 h-4 text-[#5B6F00]" />
                  </div>
                  <div className="space-y-3 font-mono text-[11px]">
                    <div className="flex justify-between items-center bg-[#F7F7F2] p-2 rounded border border-transparent">
                      <span className="text-[#7A7A72]">assignee</span>
                      <span className="text-[#252522] font-semibold">Rahul</span>
                    </div>
                    <div className="flex justify-between items-center bg-[#D1E043]/10 p-2 rounded border border-[#5B6F00]/20 relative overflow-hidden">
                      {/* Shimmer effect on hover */}
                      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/50 to-transparent group-hover:animate-[shimmer_1.5s_infinite]"></div>
                      <span className="text-[#7A7A72]">deadline</span>
                      <span className="text-[#5B6F00] font-semibold flex items-center gap-1.5">
                        <Lock className="w-3 h-3" /> 4:00 PM
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="px-2">
            <h3 className="text-xl font-medium text-[#252522] mb-2 font-sans">Immutable Fact Locks</h3>
            <p className="text-[#6B6B65] text-[15px] leading-relaxed font-sans">
              Deadlines, technical terms, and assignees are strictly protected as invariants to guarantee zero translation drift.
            </p>
          </div>
        </div>

        {/* Card 3: Global Team Relay */}
        <div className="flex flex-col gap-6 group cursor-default">
          <div className="bg-[#F7F7F2] rounded-3xl h-[300px] w-full overflow-hidden relative border border-black/[0.04] transition-colors group-hover:bg-[#EFEFEA]">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-full max-w-[300px] h-full flex flex-col items-center justify-center gap-6">
                <div 
                  className={`bg-[#252522] text-white text-[13px] px-5 py-3 rounded-2xl rounded-br-sm shadow-md z-10 group-hover:scale-105 transition-all duration-700 ease-out ${
                    show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                  }`}
                >
                  &ldquo;Deploy after tests pass.&rdquo;
                </div>
                <div className="flex gap-3 w-full justify-center">
                  <div 
                    className={`flex flex-col items-center gap-2 transition-all duration-700 ease-out delay-[200ms] ${
                      show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                    }`}
                  >
                    <span className="text-xl" suppressHydrationWarning>🇯🇵</span>
                    <div className="bg-white border border-black/[0.06] text-[#252522] text-[10px] px-3 py-1.5 rounded-xl shadow-xs group-hover:-translate-y-1 transition-transform">テスト合格...</div>
                  </div>
                  <div 
                    className={`flex flex-col items-center gap-2 transition-all duration-700 ease-out delay-[400ms] ${
                      show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                    }`}
                  >
                    <span className="text-xl" suppressHydrationWarning>🇩🇪</span>
                    <div className="bg-white border border-black/[0.06] text-[#252522] text-[10px] px-3 py-1.5 rounded-xl shadow-xs group-hover:-translate-y-1 transition-transform delay-75">Nach Tests...</div>
                  </div>
                  <div 
                    className={`flex flex-col items-center gap-2 transition-all duration-700 ease-out delay-[600ms] ${
                      show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                    }`}
                  >
                    <span className="text-xl" suppressHydrationWarning>🇪🇸</span>
                    <div className="bg-white border border-black/[0.06] text-[#252522] text-[10px] px-3 py-1.5 rounded-xl shadow-xs group-hover:-translate-y-1 transition-transform delay-150">Despliegue...</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="px-2">
            <h3 className="text-xl font-medium text-[#252522] mb-2 font-sans">Global Team Relay</h3>
            <p className="text-[#6B6B65] text-[15px] leading-relaxed font-sans">
              Instantly localize verified instructions into 18 languages, ensuring every teammate has perfect context.
            </p>
          </div>
        </div>

        {/* Card 4: Seamless Task Sync */}
        <div className="flex flex-col gap-6 group cursor-default">
          <div className="bg-[#F7F7F2] rounded-3xl h-[300px] w-full overflow-hidden relative border border-black/[0.04] transition-colors group-hover:bg-[#EFEFEA]">
            <div className="absolute inset-0 flex items-center justify-center">
              <div 
                className={`transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  show ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'
                }`}
              >
                <div className="bg-white border border-black/[0.06] rounded-2xl p-5 shadow-sm w-[260px] group-hover:shadow-md transition-shadow">
                  <div className="text-[11px] font-mono text-[#7A7A72] mb-4 flex items-center gap-1.5">
                    <RefreshCw className="w-3 h-3 group-hover:animate-spin" />
                    Routine: Task Verified
                  </div>
                  <div className="space-y-0">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#F7F7F2] flex items-center justify-center border border-black/[0.04]">
                        <Github className="w-4 h-4 text-[#252522]" />
                      </div>
                      <div className="text-xs text-[#252522]">Issue created in <span className="font-semibold">core</span></div>
                    </div>
                    
                    <div className="w-px h-5 bg-black/[0.08] ml-4 my-1"></div>
                    
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#D1E043]/20 flex items-center justify-center border border-[#D1E043]/30">
                        <Check className="w-4 h-4 text-[#5B6F00]" />
                      </div>
                      <div className="text-xs text-[#5B6F00] font-medium">Assigned to Rahul</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="px-2">
            <h3 className="text-xl font-medium text-[#252522] mb-2 font-sans">Seamless Task Sync</h3>
            <p className="text-[#6B6B65] text-[15px] leading-relaxed font-sans">
              Automatically push fact-checked instructions directly to Jira, Linear, or GitHub without manual data entry.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
