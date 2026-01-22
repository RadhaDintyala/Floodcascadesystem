import React from 'react';
import { cn } from '../../lib/utils';

type BadgeVariant = 'default' | 'critical' | 'warning' | 'success' | 'neutral';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variants = {
  default: "bg-blue-100 text-blue-800 border-blue-200",
  critical: "bg-red-100 text-red-800 border-red-200",
  warning: "bg-amber-100 text-amber-800 border-amber-200",
  success: "bg-emerald-100 text-emerald-800 border-emerald-200",
  neutral: "bg-slate-100 text-slate-800 border-slate-200",
};

export const Badge = ({ children, variant = 'default', className }: BadgeProps) => {
  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
};
