import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface SectionHeadingProps {
  badge?: string;
  badgeColor?: 'teal' | 'amber' | 'indigo' | 'emerald';
  title: string;
  highlightedTitle?: string;
  subtitle?: string;
  align?: 'left' | 'center';
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  badge,
  badgeColor = 'teal',
  title,
  highlightedTitle,
  subtitle,
  align = 'center',
  className,
}) => {
  const badgeClasses = {
    teal: 'bg-teal-500/10 text-teal-300 border-teal-500/30',
    amber: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
    indigo: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30',
    emerald: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
  }[badgeColor];

  const alignmentClass = align === 'center' ? 'text-center mx-auto' : 'text-left';

  return (
    <div className={twMerge('max-w-3xl mb-12', alignmentClass, className)}>
      {badge && (
        <div className={twMerge('inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium border mb-4', badgeClasses)}>
          <span>{badge}</span>
        </div>
      )}
      <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
        {title}{' '}
        {highlightedTitle && (
          <span className="text-gradient-brand">{highlightedTitle}</span>
        )}
      </h2>
      {subtitle && (
        <p className="mt-4 text-base md:text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
};
