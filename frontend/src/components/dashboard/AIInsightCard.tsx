import React from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { MatchScoreMetric } from './MatchScoreMetric';
import { Sparkles, ArrowRight, Lightbulb } from 'lucide-react';
import { Button } from '../common/Button';

interface AIInsightCardProps {
  score?: number;
  title?: string;
  explanation: string;
  recommendations?: string[];
  isLoading?: boolean;
  onActionClick?: () => void;
  actionText?: string;
}

export const AIInsightCard: React.FC<AIInsightCardProps> = ({
  score,
  title = "AI Fit Analysis",
  explanation,
  recommendations = [],
  isLoading = false,
  onActionClick,
  actionText
}) => {
  if (isLoading) {
    return (
      <Card className="space-y-4 animate-pulse border-indigo-500/10">
        <div className="flex items-center justify-between pb-3 border-b border-brand-border">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-slate-800 rounded-full" />
            <div className="h-4 bg-slate-800 w-28 rounded" />
          </div>
          <div className="w-10 h-10 bg-slate-800 rounded-full" />
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-slate-800 w-full rounded" />
          <div className="h-3 bg-slate-800 w-5/6 rounded" />
          <div className="h-3 bg-slate-800 w-4/5 rounded" />
        </div>
      </Card>
    );
  }

  return (
    <Card hoverEffect className="border-indigo-500/10 relative overflow-hidden bg-gradient-to-br from-brand-surface1 via-brand-surface1 to-indigo-500/5">
      {/* Background soft mesh decoration */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-500/5 rounded-full filter blur-xl pointer-events-none" />

      <div className="flex items-start justify-between border-b border-brand-border/60 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-lg">
            <Sparkles className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wide">{title}</h4>
        </div>
        {score !== undefined && (
          <div className="shrink-0 scale-90">
            <MatchScoreMetric score={score} size="md" />
          </div>
        )}
      </div>

      <div className="mt-4 space-y-4 text-xs">
        <div>
          <span className="font-bold text-indigo-450 uppercase text-[9px] tracking-wider block mb-1">Fit Evaluation:</span>
          <p className="text-slate-300 leading-relaxed bg-[#070A0F]/30 border border-brand-border p-3.5 rounded-xl">
            {explanation}
          </p>
        </div>

        {recommendations.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-brand-border/40">
            <div className="flex items-center gap-1.5 text-indigo-450">
              <Lightbulb className="w-3.5 h-3.5" />
              <span className="font-bold uppercase text-[9px] tracking-wider">Recommended Upskills:</span>
            </div>
            <ul className="space-y-1.5 pl-1">
              {recommendations.map((rec, index) => (
                <li key={index} className="flex gap-2 items-start text-slate-400 text-[11px] leading-relaxed">
                  <ArrowRight className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        )}

        {onActionClick && actionText && (
          <div className="pt-2">
            <Button onClick={onActionClick} variant="outline" className="w-full text-[11px] font-bold py-1.5 flex items-center justify-center gap-1.5">
              {actionText}
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};
