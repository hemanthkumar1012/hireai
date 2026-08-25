import React from 'react';
import { Card } from '../components/common/Card';
import { ShieldAlert } from 'lucide-react';

export const AdminPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-slate-100 tracking-tight">Admin Console Operations</h2>
        <p className="text-xs text-slate-400 font-semibold mt-1">Superuser dashboard details for platform audits.</p>
      </div>
      <Card className="p-8 border-indigo-500/10 bg-gradient-to-br from-brand-surface1 via-indigo-950/20 to-brand-surface1 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full filter blur-xl pointer-events-none" />
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-200">Access Level: Platform Administrator</h4>
            <p className="text-xs text-slate-400 mt-1">You are logged in as a system Administrator. All telemetry and database audits are active.</p>
          </div>
        </div>
      </Card>
    </div>
  );
};
