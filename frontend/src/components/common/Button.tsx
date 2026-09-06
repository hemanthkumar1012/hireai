import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyle = 'inline-flex min-h-10 items-center justify-center rounded-full font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent1/40 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';

  const variants = {
    primary: 'border border-brand-accent1 bg-brand-accent1 text-white shadow-soft hover:bg-[#5f4bd3] hover:shadow-lift active:scale-[0.98]',
    secondary: 'border border-brand-border bg-brand-surface2 text-brand-text hover:bg-brand-surface1 hover:border-[#b8b8bd] active:scale-[0.98]',
    outline: 'border border-brand-border bg-white text-brand-text hover:bg-brand-surface2 hover:border-[#b8b8bd] active:scale-[0.98]',
    danger: 'border border-red-200 bg-red-50 text-brand-danger hover:bg-red-100 active:scale-[0.98]',
    ghost: 'border border-transparent bg-transparent text-brand-muted hover:bg-brand-surface2 hover:text-brand-text',
  };

  const sizes = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-6 py-3 text-sm',
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <svg className="-ml-1 mr-2 h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Working...
        </>
      ) : children}
    </button>
  );
};
