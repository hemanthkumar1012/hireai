import React from 'react';

interface MatchScoreMetricProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
}

export const MatchScoreMetric: React.FC<MatchScoreMetricProps> = ({ score, size = 'md' }) => {
  const getColors = () => {
    if (score >= 80) return { text: 'text-emerald-400', border: 'stroke-emerald-500', bg: 'bg-emerald-500/10' };
    if (score >= 60) return { text: 'text-amber-400', border: 'stroke-amber-500', bg: 'bg-amber-500/10' };
    return { text: 'text-rose-400', border: 'stroke-rose-500', bg: 'bg-rose-500/10' };
  };

  const colors = getColors();
  
  const sizeMap = {
    sm: { diameter: 44, strokeWidth: 3.5, radius: 18, circumference: 113, textClass: 'text-[11px]' },
    md: { diameter: 64, strokeWidth: 5, radius: 26, circumference: 163, textClass: 'text-sm' },
    lg: { diameter: 96, strokeWidth: 7, radius: 38, circumference: 238, textClass: 'text-xl' }
  };

  const currentSize = sizeMap[size];
  const strokeDashoffset = currentSize.circumference - (score / 100) * currentSize.circumference;

  return (
    <div className="flex items-center justify-center relative">
      <svg className="transform -rotate-90" width={currentSize.diameter} height={currentSize.diameter}>
        {/* Background Circle */}
        <circle
          className="stroke-slate-800"
          strokeWidth={currentSize.strokeWidth}
          fill="transparent"
          r={currentSize.radius}
          cx={currentSize.diameter / 2}
          cy={currentSize.diameter / 2}
        />
        {/* Foreground Circle */}
        <circle
          className={`transition-all duration-1000 ease-out ${colors.border}`}
          strokeWidth={currentSize.strokeWidth}
          strokeDasharray={currentSize.circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          r={currentSize.radius}
          cx={currentSize.diameter / 2}
          cy={currentSize.diameter / 2}
        />
      </svg>
      {/* Percentage Center Text */}
      <span className={`absolute font-bold tracking-tight ${colors.text} ${currentSize.textClass}`}>
        {score}%
      </span>
    </div>
  );
};
