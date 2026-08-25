import React from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Job } from '../../types';
import { Briefcase, MapPin, DollarSign } from 'lucide-react';

interface JobCardProps {
  job: Job;
  onApply?: (jobId: number) => void;
  isApplying?: boolean;
  hasApplied?: boolean;
  hideAction?: boolean;
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  onApply,
  isApplying = false,
  hasApplied = false,
  hideAction = false
}) => {
  return (
    <Card hoverEffect className="flex flex-col justify-between h-full">
      <div>
        <div className="flex items-start justify-between">
          <div>
            <h4 className="text-base font-bold text-slate-100 group-hover:text-indigo-400 transition-colors">
              {job.title}
            </h4>
            <p className="text-xs text-indigo-400 font-medium mt-0.5">{job.company_name}</p>
          </div>
          {hasApplied && (
            <Badge variant="success">Applied</Badge>
          )}
        </div>

        <div className="flex flex-wrap gap-y-1 gap-x-3 text-xs text-slate-400 mt-3 font-medium">
          <span className="flex items-center gap-1">
            <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
            Full-time
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-indigo-400" />
            {job.location}
          </span>
          {job.salary_range && (
            <span className="flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-indigo-400" />
              {job.salary_range}
            </span>
          )}
        </div>

        <p className="text-xs text-slate-400 mt-3 line-clamp-3 leading-relaxed">
          {job.description}
        </p>

        {job.skills_needed && job.skills_needed.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {job.skills_needed.slice(0, 4).map((skill, index) => (
              <Badge key={index} variant="primary" className="text-[10px] px-2 py-0">
                {skill}
              </Badge>
            ))}
            {job.skills_needed.length > 4 && (
              <span className="text-[10px] text-slate-500 font-bold self-center">
                +{job.skills_needed.length - 4} more
              </span>
            )}
          </div>
        )}
      </div>

      {!hideAction && (
        <div className="mt-5 pt-3 border-t border-brand-border">
          <Button
            onClick={() => onApply && onApply(job.id)}
            disabled={hasApplied}
            isLoading={isApplying}
            variant={hasApplied ? "outline" : "primary"}
            className="w-full text-xs py-2"
          >
            {hasApplied ? "Applied" : "Apply Instantly"}
          </Button>
        </div>
      )}
    </Card>
  );
};
