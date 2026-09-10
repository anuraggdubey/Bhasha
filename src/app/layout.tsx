import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'Bhasha — One Meaning, Every Language | Voice-First Task Orchestration',
  description:
    'Voice-first task handoff system for multilingual teams powered by AssemblyAI Universal-3.5 Pro and Fact-Locked Meaning Packets. Eliminate translation drift across English, Hindi, Japanese, and more.',
  keywords: [
    'AssemblyAI',
    'Enterprise Voice AI',
    'Speech-to-text',
    'Universal-3.5 Pro',
    'Multilingual Task Handoff',
    'Fact Locking',
    'Hinglish',
    'Zero Fact Drift',
  ],
  authors: [{ name: 'Bhasha Engineering Team' }],
  openGraph: {
    title: 'Bhasha — Voice-First Multilingual Task Handoff',
    description: 'Zero fact drift across teams. Speak in Hinglish, assign with guaranteed invariant deadlines and owners.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased selection:bg-teal-500/30 selection:text-teal-200 min-h-screen flex flex-col bg-[#080c14] text-slate-100">
        <Navbar />
        <div className="flex-1 pt-20">
          {children}
        </div>
      </body>
    </html>
  );
}
