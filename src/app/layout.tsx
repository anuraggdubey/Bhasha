import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Bhasha Relay — One Meaning, Every Language',
  description:
    'Voice-first task handoff system for multilingual teams powered by AssemblyAI Dictation API and Fact-Locked Meaning Packets.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased selection:bg-teal-500/30 selection:text-teal-200">
        {children}
      </body>
    </html>
  );
}
