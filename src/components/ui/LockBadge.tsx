import React from 'react';
import { Lock } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

interface LockBadgeProps {
  color?: 'amber' | 'cyan' | 'emerald' | 'indigo' | 'coral' | 'lime';
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
  return (
    <span
      className={twMerge(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#F7F7F2] text-[#252522] border border-black/[0.08]',
        className
      )}
      title={tooltip || 'Fact-Locked: Invariant across all language translations'}
    >
      {icon && <Lock className="w-3 h-3 text-[#5B6F00] flex-shrink-0" />}
      <span>{children}</span>
    </span>
  );
};
