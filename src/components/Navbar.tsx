'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Mic, Users, ShieldCheck, LayoutDashboard, Menu, X, ArrowUpRight } from 'lucide-react';
import { BhashaLogo } from '@/components/BhashaLogo';

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/studio', label: 'Voice Studio', icon: Mic },
    { href: '/team', label: 'Team Relay', icon: Users },
    { href: '/audit', label: 'Invariant Audit', icon: ShieldCheck },
    { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#FFFCFA]/90 backdrop-blur-xl border-b border-black/[0.06] py-3 shadow-xs'
          : 'bg-[#FFFCFA]/60 backdrop-blur-md border-b border-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brandmark - Custom Half-Bha + PC Active Mic Logo */}
        <Link href="/" className="flex items-center group">
          <BhashaLogo size={32} showText={true} />
        </Link>

        {/* Desktop Navigation - Pill Navigation */}
        <nav className="hidden md:flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#F7F7F2] border border-black/[0.06]">
          {navLinks.map(({ href, label }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`relative px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                  isActive
                    ? 'text-[#252522] bg-white shadow-xs font-semibold'
                    : 'text-[#6B6B65] hover:text-[#252522] hover:bg-black/[0.03]'
                }`}
              >
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Action CTA - Black Pill Button (Granola / Strawberry Style) */}
        <div className="hidden sm:flex items-center gap-3">
          <Link
            href="/team"
            className="text-xs font-medium text-[#6B6B65] hover:text-[#252522] px-3 py-2 transition-colors"
          >
            18 Languages
          </Link>

          <Link
            href="/studio"
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-medium bg-[#252522] hover:bg-[#383834] text-[#FFFCFA] shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Mic className="w-3.5 h-3.5" />
            <span>Open Studio</span>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-full text-[#252522] hover:bg-black/[0.05]"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-3 pb-6 bg-[#FFFCFA] border-b border-black/[0.08] shadow-lg space-y-2 mt-2">
          {navLinks.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#F7F7F2] text-[#252522] font-semibold'
                    : 'text-[#6B6B65] hover:text-[#252522]'
                }`}
              >
                <Icon className="w-4 h-4 text-[#252522]" />
                <span>{label}</span>
              </Link>
            );
          })}

          <div className="pt-2">
            <Link
              href="/studio"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-full text-xs font-medium bg-[#252522] text-[#FFFCFA]"
            >
              <Mic className="w-4 h-4" />
              <span>Open Voice Studio</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
export default Navbar;
