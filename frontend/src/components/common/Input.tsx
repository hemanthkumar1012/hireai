import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  className = '',
  ...props
}, ref) => {
  return (
    <div className="w-full mb-4">
      {label && (
        <label className="block text-[10px] font-bold uppercase tracking-wider text-brand-muted mb-1.5 font-sans">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={`w-full px-3.5 py-2.5 bg-brand-surface1 border ${
          error
            ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
            : 'border-brand-border focus:border-brand-accent1 focus:ring-brand-accent1/20'
        } rounded-xl text-sm text-brand-text placeholder-[#A1A1A6] focus:outline-none focus:ring-4 transition duration-200 ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1.5 text-[10px] font-semibold text-red-500">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
