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
        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 font-sans">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={`w-full px-3.5 py-2 bg-brand-surface1/60 border ${
          error 
            ? 'border-red-500/30 focus:border-red-500 focus:ring-red-500/25' 
            : 'border-brand-border focus:border-indigo-500 focus:ring-indigo-500/25'
        } rounded-xl text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-4 transition duration-300 ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1.5 text-[10px] font-semibold text-red-400">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
