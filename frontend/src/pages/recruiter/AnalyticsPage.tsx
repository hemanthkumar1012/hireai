import React, { useState, useEffect } from 'react';
import { applicationsApi, jobsApi } from '../../services/api';
import { Card } from '../../components/common/Card';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, Award, ShieldAlert, Sparkles } from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const [applications, setApplications] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appsRes, jobsRes] = await Promise.all([
          applicationsApi.listRecruiter(),
          jobsApi.list()
        ]);
        setApplications(appsRes);
        setJobs(jobsRes);
      } catch (err) {
        console.error("Failed to load analytics data.", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner />;

  // Prepare data for Match Distribution Bar Chart
  const distributionData = [
    { range: '90-100%', count: applications.filter(a => a.match_score >= 90).length },
    { range: '80-89%', count: applications.filter(a => a.match_score >= 80 && a.match_score < 90).length },
    { range: '70-79%', count: applications.filter(a => a.match_score >= 70 && a.match_score < 80).length },
    { range: '60-69%', count: applications.filter(a => a.match_score >= 60 && a.match_score < 70).length },
    { range: '0-59%', count: applications.filter(a => a.match_score < 60).length },
  ];

  // Prepare data for Pipeline Status distribution
  const statusData = [
    { name: 'Applied', value: applications.filter(a => a.status === 'applied').length },
    { name: 'Reviewing', value: applications.filter(a => a.status === 'reviewing').length },
    { name: 'Interviewed', value: applications.filter(a => a.status === 'interviewed').length },
    { name: 'Accepted', value: applications.filter(a => a.status === 'accepted').length },
    { name: 'Rejected', value: applications.filter(a => a.status === 'rejected').length },
  ].filter(s => s.value > 0);

  const COLORS = ['#6366f1', '#a855f7', '#3b82f6', '#10b981', '#ef4444'];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-slate-100 tracking-tight">Recruitment Analytics</h2>
        <p className="text-xs text-slate-400 font-semibold mt-1">Review candidates alignment distributions, campaign conversion levels, and funnel pipelines.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Match Score Distribution Bar Chart */}
        <div className="lg:col-span-7">
          <Card className="p-5 space-y-4 bg-brand-surface1/60">
            <div className="flex items-center justify-between border-b border-brand-border/60 pb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-400" />
                <h3 className="text-xs font-bold text-slate-205 uppercase tracking-wide">Match Score Distribution</h3>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-indigo-500/5 text-indigo-400 border border-indigo-500/10 font-bold text-[8px] uppercase tracking-wider">Histogram</span>
            </div>
            
            <div className="h-64 text-[10px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={distributionData} margin={{ top: 20, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E2638" vertical={false} />
                  <XAxis dataKey="range" stroke="#64748b" />
                  <YAxis stroke="#64748b" allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0E1321', border: '1px solid #1E2638', borderRadius: '12px' }}
                    labelStyle={{ color: '#fff', fontWeight: 'bold' }}
                    itemStyle={{ color: '#6366f1' }}
                  />
                  <Bar dataKey="count" fill="url(#barGradient)" radius={[6, 6, 0, 0]}>
                    <defs>
                      <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#a855f7" />
                      </linearGradient>
                    </defs>
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Right Side: Status Distribution Pie Chart */}
        <div className="lg:col-span-5">
          <Card className="p-5 space-y-4 bg-brand-surface1/60">
            <div className="flex items-center justify-between border-b border-brand-border/60 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <h3 className="text-xs font-bold text-slate-205 uppercase tracking-wide">Funnel Conversions</h3>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-indigo-500/5 text-indigo-400 border border-indigo-500/10 font-bold text-[8px] uppercase tracking-wider">Stages</span>
            </div>

            <div className="h-64 flex flex-col justify-center items-center relative text-[10px]">
              {statusData.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height="80%">
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={75}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ backgroundColor: '#0E1321', border: '1px solid #1E2638', borderRadius: '12px' }}
                        itemStyle={{ color: '#fff' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>

                  {/* Legend */}
                  <div className="flex flex-wrap gap-x-3.5 gap-y-1 justify-center mt-1">
                    {statusData.map((entry, idx) => (
                      <div key={idx} className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                        <span className="text-slate-400 font-bold capitalize">{entry.name} ({entry.value})</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-12 text-slate-500 font-semibold w-full">
                  <ShieldAlert className="w-8 h-8 mx-auto text-slate-600 mb-3" />
                  <p className="text-xs">No active pipeline statistics found.</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
