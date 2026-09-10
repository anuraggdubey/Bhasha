import React from 'react';
import { Lock } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface LockBadgeProps {
  color?: 'amber' | 'cyan' | 'emerald' | 'indigo';
  children: React.ReactNode;
  icon?: boolean;
  className?: string;
  tooltip?: string;
}

export const LockBadge: React.FC<LockBadgeProps> = ({
  color = 'amber',
  children,
  icon = true,
  className,
  tooltip,
}) => {
  const colorClass = {
    amber: 'locked-badge',
    cyan: 'locked-badge-cyan',
    emerald: 'locked-badge-emerald',
    indigo: 'locked-badge-indigo',
  }[color];

  return (
    <span
      className={twMerge(colorClass, 'cursor-help select-none', className)}
      title={tooltip || 'Fact-Locked: Invariant across all language translations'}
    >
      {icon && <Lock className="w-2.5 h-2.5 flex-shrink-0" />}
      <span>{children}</span>
    </span>
  );
};
