import React from 'react';
import { cn } from '../../lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  noPadding?: boolean;
}

export const Card = ({ className, children, noPadding = false, ...props }: CardProps) => {
  return (
    <div 
      className={cn(
        "bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden",
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

export const CardHeader = ({ title, subtitle, action }: { title: string, subtitle?: string, action?: React.ReactNode }) => (
  <div className="flex items-start justify-between mb-4">
    <div>
      <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
      {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
    </div>
    {action && <div>{action}</div>}
  </div>
);
