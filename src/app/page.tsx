'use client';

import React from 'react';
import { HeroSection } from '@/components/landing/HeroSection';
import { ProblemSection } from '@/components/landing/ProblemSection';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { ComparisonSection } from '@/components/landing/ComparisonSection';
import { TechStackSection } from '@/components/landing/TechStackSection';
import { Footer } from '@/components/landing/Footer';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#080c14] text-slate-100 relative selection:bg-teal-500/30 selection:text-teal-200">
      {/* Hero Section */}
      <HeroSection />

      {/* Problem vs Solution Section */}
      <ProblemSection />

      {/* How It Works Section */}
      <HowItWorksSection />

      {/* Zero Drift Proof & Comparison Section */}
      <ComparisonSection />

      {/* Enterprise Tech Stack & Team Section */}
      <TechStackSection />

      {/* Footer */}
      <Footer />
    </main>
  );
}
