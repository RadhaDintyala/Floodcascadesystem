import React from 'react';
import { cn } from '../../lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  noPadding?: boolean;
  dark?: boolean;
}

export const Card = ({ className, children, noPadding = false, dark = false, ...props }: CardProps) => {
  return (
    <div 
      className={cn(
        dark ? "bg-slate-800 border-slate-700" : "bg-white border border-slate-200",
        "rounded-lg shadow-sm overflow-hidden",
        className
      )} 
      {...props}
    >
      <div className={cn(noPadding ? "" : "p-5")}>
        {children}
      </div>
    </div>
  );
};

export const CardHeader = ({ title, subtitle, action, dark = false }: { title: string, subtitle?: string, action?: React.ReactNode, dark?: boolean }) => (
  <div className="flex items-start justify-between mb-4">
    <div>
      <h3 className={cn("text-lg font-semibold", dark ? "text-white" : "text-slate-800")}>{title}</h3>
      {subtitle && <p className={cn("text-sm mt-0.5", dark ? "text-slate-400" : "text-slate-500")}>{subtitle}</p>}
    </div>
    {action && <div>{action}</div>}
  </div>
);
