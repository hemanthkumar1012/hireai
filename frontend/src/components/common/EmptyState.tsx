import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon: LucideIcon;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ title, description, icon: Icon, action }) => {
  return (
    <div className="flex min-h-56 flex-col items-center justify-center border border-dashed border-brand-border rounded-2xl p-6 sm:p-10 text-center bg-brand-surface1/20 backdrop-blur-sm w-full">
      <div className="bg-brand-surface2/60 border border-brand-border p-3 rounded-xl text-indigo-400 mb-4 shadow-xl">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-sm font-bold text-slate-200 mb-1.5">{title}</h3>
      <p className="text-xs text-slate-400 max-w-xs mb-5 leading-relaxed">{description}</p>
      {action && (
        <div className="animate-fade-in">
          {action}
        </div>
      )}
    </div>
  );
};
