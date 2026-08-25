import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'primary';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'primary', className = '' }) => {
  const styles = {
    primary: "bg-indigo-500/5 text-indigo-400 border border-indigo-500/10",
    success: "bg-emerald-500/5 text-emerald-400 border border-emerald-500/10",
    warning: "bg-amber-500/5 text-amber-400 border border-amber-500/10",
    error: "bg-red-500/5 text-red-400 border border-red-500/10",
    info: "bg-blue-500/5 text-blue-400 border border-blue-500/10"
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${styles[variant]} ${className}`}>
      {children}
    </span>
  );
};
