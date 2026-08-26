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
  const baseStyle = "inline-flex min-h-10 items-center justify-center font-semibold rounded-xl transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-bg disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none";
  
  const variants = {
    primary: "bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white shadow-lg shadow-indigo-650/15 hover:shadow-indigo-500/25 active:scale-[0.98] border border-indigo-500/10",
    secondary: "bg-brand-surface2 border border-brand-border text-slate-100 hover:bg-brand-surface1 hover:border-slate-700 active:scale-[0.98]",
    outline: "bg-transparent border border-brand-border text-slate-300 hover:border-indigo-500/40 hover:text-indigo-400 hover:bg-indigo-500/5 active:scale-[0.98]",
    danger: "bg-red-950/20 border border-red-500/20 text-red-400 hover:bg-red-900/20 active:scale-[0.98]",
    ghost: "bg-transparent hover:bg-brand-surface1 text-slate-400 hover:text-white"
  };

  const sizes = {
    sm: "px-3.5 py-1.5 text-xs",
    md: "px-4 py-2 text-xs",
    lg: "px-6 py-2.5 text-sm"
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Syncing...
        </>
      ) : children}
    </button>
  );
};
