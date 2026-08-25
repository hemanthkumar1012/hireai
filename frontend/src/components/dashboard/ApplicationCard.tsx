import React from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { MatchScoreMetric } from './MatchScoreMetric';
import { Application } from '../../types';
import { Calendar, ArrowRight } from 'lucide-react';
import { Button } from '../common/Button';

interface ApplicationCardProps {
  application: Application;
  onViewDetails?: (appId: number) => void;
}

export const ApplicationCard: React.FC<ApplicationCardProps> = ({
  application,
  onViewDetails
}) => {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'accepted': return 'success';
      case 'interviewed': return 'info';
      case 'reviewing': return 'warning';
      case 'rejected': return 'error';
      default: return 'primary';
    }
  };

  const job = application.job;

  if (!job) return null;

  return (
    <Card hoverEffect className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5">
      <div className="flex items-center gap-4">
        <div className="hidden sm:block">
          <MatchScoreMetric score={application.match_score} size="md" />
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="text-sm font-bold text-slate-100">{job.title}</h4>
            <Badge variant={getStatusVariant(application.status)}>
              {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
            </Badge>
          </div>
          <p className="text-xs text-indigo-400 font-semibold mt-0.5">{job.company_name}</p>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-2 font-medium">
            <Calendar className="w-3.5 h-3.5" />
            Applied on {new Date(application.created_at).toLocaleDateString()}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-brand-border justify-between sm:justify-end">
        <div className="sm:hidden flex items-center gap-2">
          <span className="text-xs text-slate-400 font-semibold">Match score:</span>
          <Badge variant={application.match_score >= 80 ? 'success' : application.match_score >= 60 ? 'warning' : 'error'}>
            {application.match_score}%
          </Badge>
        </div>
        {onViewDetails && (
          <Button
            onClick={() => onViewDetails(application.id)}
            variant="outline"
            className="text-xs py-1.5 flex items-center gap-1 hover:bg-indigo-600/10 hover:text-indigo-400"
          >
            Insights & Prep
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        )}
      </div>
    </Card>
  );
};
