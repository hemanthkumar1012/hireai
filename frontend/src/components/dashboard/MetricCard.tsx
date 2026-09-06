import React from 'react';
import { Card } from '../common/Card';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon: Icon,
  description,
  trend,
}) => {
  return (
    <Card
      className="min-h-[148px] flex flex-col justify-between border-[#E5E5EA] bg-white p-5 shadow-[0_8px_24px_rgba(0,0,0,0.04)]"
      hoverEffect
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#6E6E73]">
            {title}
          </p>
          <h3 className="mt-2 text-[30px] leading-none font-bold tracking-[-0.03em] text-[#1D1D1F]">
            {value}
          </h3>
        </div>

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#E4DEFF] bg-[#F3F0FF] text-[#6E5AE6]">
          <Icon className="h-5 w-5" strokeWidth={1.8} />
        </div>
      </div>

      {(description || trend) && (
        <div className="mt-5 flex min-h-5 items-center gap-2 text-[12px]">
          {trend && (
            <span
              className={`font-semibold ${
                trend.isPositive ? 'text-[#248A3D]' : 'text-[#C9342C]'
              }`}
            >
              {trend.value}
            </span>
          )}
          {description && <span className="text-[#6E6E73]">{description}</span>}
        </div>
      )}
    </Card>
  );
};
