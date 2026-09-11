'use client';

import React from 'react';

interface BhashaLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
  textColor?: string;
  dotColor?: string;
}

export const BhashaLogo: React.FC<BhashaLogoProps> = ({
  className = '',
  size = 32,
  showText = false,
  textColor = 'text-[#252522]',
  dotColor = '#ED5A31', // Active mic indicator color
}) => {
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* Pure Vector Mark: Half 'Bha' (भ्) seamlessly fused with PC Active Microphone */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 44 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-200 group-hover:scale-105"
      >
        {/* Shirorekha (Devanagari Top Bar over the letter) */}
        <line
          x1="22"
          y1="7"
          x2="39"
          y2="7"
          stroke="currentColor"
          strokeWidth="3.2"
          strokeLinecap="round"
        />

        {/* Half Bha (भ्) Left Graceful Loop, Descender, and Middle Knot */}
        <path
          d="M 12 14.5 
             C 10.5 12, 12 8.5, 15 8.5 
             C 18 8.5, 19.5 11, 19.5 14 
             L 19.5 25 
             C 19.5 28.5, 15.5 30, 13 28 
             C 10.5 26, 12.5 22.5, 16 22.5 
             L 26 22.5"
          stroke="currentColor"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* PC Active Microphone Symbol - seamlessly attached to the horizontal connector */}
        {/* Mic Capsule Body */}
        <rect
          x="28.5"
          y="11.5"
          width="7"
          height="12"
          rx="3.5"
          fill="currentColor"
        />

        {/* Mic Pickup Cradle (U-shaped arc) */}
        <path
          d="M 25.5 17 
             C 25.5 23.5, 38.5 23.5, 38.5 17"
          stroke="currentColor"
          strokeWidth="2.8"
          strokeLinecap="round"
          fill="none"
        />

        {/* Mic Stem */}
        <line
          x1="32"
          y1="23.5"
          x2="32"
          y2="29.5"
          stroke="currentColor"
          strokeWidth="2.8"
          strokeLinecap="round"
        />

        {/* Mic Stand Base */}
        <line
          x1="27"
          y1="29.5"
          x2="37"
          y2="29.5"
          stroke="currentColor"
          strokeWidth="2.8"
          strokeLinecap="round"
        />

        {/* PC Active Mic Indicator Dot (Live signal indicator) */}
        <circle
          cx="39"
          cy="9.5"
          r="2.2"
          fill={dotColor}
          className="animate-pulse"
        />
      </svg>

      {showText && (
        <span className={`font-editorial text-2xl font-bold tracking-tight ${textColor}`}>
          Bhasha
        </span>
      )}
    </div>
  );
};
