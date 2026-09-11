import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Bhasha — AI Voice Task Handoff | Zero Drift Multilingual Relay',
  description:
    'Voice-first task handoff for high-velocity teams powered by AssemblyAI Universal-3.5 and Groq Llama 3.3. Speak in any language, eliminate fact drift across 18 team languages.',
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased selection:bg-[#5B6F00]/20 selection:text-[#252522] min-h-screen flex flex-col bg-[#FFFCFA] text-[#252522]">
        <Navbar />
        <main className="flex-1 pt-20">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
