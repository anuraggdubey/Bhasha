import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'interactive';
  children: React.ReactNode;
  className?: string;
  glowColor?: 'teal' | 'amber' | 'indigo' | 'none';
}

export const GlassCard: React.FC<GlassCardProps> = ({
  variant = 'default',
  children,
  className,
  glowColor = 'none',
  ...props
}) => {
  const variantClass = {
    default: 'glass-panel',
    elevated: 'glass-panel-elevated',
    interactive: 'glass-panel-interactive',
  }[variant];

  const glowStyles = {
    none: '',
    teal: 'hover:shadow-[0_0_30px_rgba(20,184,166,0.2)] hover:border-teal-500/40',
    amber: 'hover:shadow-[0_0_30px_rgba(245,158,11,0.2)] hover:border-amber-500/40',
    indigo: 'hover:shadow-[0_0_30px_rgba(99,102,241,0.2)] hover:border-indigo-500/40',
  }[glowColor];

  return (
    <div
      className={twMerge(
        'rounded-2xl relative overflow-hidden transition-all duration-300',
        variantClass,
        glowStyles,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
