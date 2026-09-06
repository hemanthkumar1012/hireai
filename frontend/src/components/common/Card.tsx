import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  hoverEffect = false,
  className = '',
  ...props
}) => {
  const hoverStyles = hoverEffect
    ? 'transition-all duration-200 hover:-translate-y-0.5 hover:border-[#c3c3c8] hover:shadow-lift'
    : '';

  return (
    <div
      className={`rounded-3xl border border-brand-border bg-brand-surface1 p-4 shadow-soft sm:p-5 ${hoverStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
