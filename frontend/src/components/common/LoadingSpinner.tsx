import React from 'react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 w-full">
      <div className="relative w-8 h-8">
        {/* Background Ring */}
        <div className="absolute top-0 left-0 w-full h-full border-2 border-indigo-500/10 rounded-full"></div>
        {/* Foreground dual-color Spinner */}
        <div className="absolute top-0 left-0 w-full h-full border-2 border-transparent border-t-indigo-500 border-r-violet-500 rounded-full animate-spin"></div>
      </div>
      <p className="mt-4 text-[10px] font-bold uppercase tracking-widest text-indigo-400/80 animate-pulse-subtle">
        Resolving platform telemetry...
      </p>
    </div>
  );
};
