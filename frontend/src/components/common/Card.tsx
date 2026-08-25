import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, hoverEffect = false, className = '', ...props }) => {
  return (
    <div
      className={`bg-brand-surface1 border border-brand-border rounded-2xl p-4 sm:p-5 shadow-2xl ${
        hoverEffect 
          ? 'hover:border-indigo-500/25 transition-all duration-300 hover:shadow-[0_15px_30px_-10px_rgba(0,0,0,0.8),0_0_15px_-3px_rgba(99,102,241,0.05)] hover:-translate-y-0.5' 
          : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
