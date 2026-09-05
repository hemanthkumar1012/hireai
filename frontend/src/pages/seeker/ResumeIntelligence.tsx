import React, { useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  Award,
  CheckCircle2,
  FileText,
  GraduationCap,
  Lightbulb,
  Loader2,
  Sparkles,
  Target,
  Trophy,
  Upload,
  XCircle,
} from 'lucide-react';

import { profilesApi } from '../../services/api';
import {
  JobSeekerProfile,
  ResumeAnalysis,
} from '../../types';

import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const categoryLabels: Record<string, string> = {
  ats_compatibility: 'ATS Compatibility',
  keywords: 'Keywords',
  skills: 'Skills',
  experience: 'Experience',
  achievements: 'Achievements',
  formatting: 'Formatting',
  completeness: 'Completeness',
};

const getScoreClass = (score: number) => {
  if (score >= 80) {
    return 'text-emerald-400';
  }

  if (score >= 60) {
    return 'text-amber-400';
  }

  return 'text-red-400';
};

const getScoreBarClass = (score: number) => {
  if (score >= 80) {
    return 'bg-emerald-500';
  }

  if (score >= 60) {
    return 'bg-amber-500';
  }

  return 'bg-red-500';
};

export const ResumeIntelligence: React.FC = () => {
  const [profile, setProfile] = useState<JobSeekerProfile | null>(null);
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');

  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  const [alert, setAlert] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const result = await profilesApi.getMyProfile();

        setProfile(result);

        if (result.resume_analysis) {
          setAnalysis(result.resume_analysis);
        }
      } catch (error) {
        console.error('Failed to load resume profile.', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const validateFile = (file: File) => {
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    const extension = file.name
      .toLowerCase()
      .slice(file.name.lastIndexOf('.'));

    if (!['.pdf', '.docx'].includes(extension)) {
      setAlert({
        type: 'error',
        text: 'Please upload a PDF or DOCX resume.',
      });

      return false;
    }

    if (file.type && !allowedTypes.includes(file.type)) {
      setAlert({
        type: 'error',
        text: 'The selected file does not appear to be a valid PDF or DOCX.',
      });

      return false;
    }

    if (file.size > MAX_FILE_SIZE) {
      setAlert({
        type: 'error',
        text: 'Resume file is too large. Maximum allowed size is 5 MB.',
      });

      return false;
    }

    return true;
  };

  const handleFileSelect = (file: File) => {
    setAlert(null);

    if (!validateFile(file)) {
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (file) {
      handleFileSelect(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      setAlert({
        type: 'error',
        text: 'Please select your resume first.',
      });

      return;
    }

    setAnalyzing(true);
    setAlert(null);

    try {
      const result = await profilesApi.analyzeResume(
        selectedFile,
        jobDescription
      );

      if (!result.analysis) {
        throw new Error('Resume analysis was not returned.');
      }

      setAnalysis(result.analysis);

      const updatedProfile = await profilesApi.getMyProfile();
      setProfile(updatedProfile);

      setAlert({
        type: 'success',
        text: 'Resume analyzed successfully.',
      });
    } catch (error: unknown) {
      let message = 'Unable to analyze the resume. Please try again.';

      if (
        typeof error === 'object' &&
        error !== null &&
        'response' in error
      ) {
        const response = (
          error as {
            response?: {
              data?: {
                detail?: string;
              };
            };
          }
        ).response;

        if (response?.data?.detail) {
          message = response.data.detail;
        }
      }

      setAlert({
        type: 'error',
        text: message,
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const atsScore = analysis?.ats_score ?? 0;

  const skills = profile?.skills ?? [];
  const workHistory = profile?.work_history ?? [];
  const education = profile?.education ?? [];

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-slate-100 tracking-tight">
          AI Resume Analyzer
        </h2>

        <p className="text-xs text-slate-400 font-semibold mt-1">
          Upload your resume to get an ATS score, identify weaknesses, and
          receive specific improvements.
        </p>
      </div>

      {alert && (
        <div
          className={`flex items-start gap-2 p-3.5 text-xs font-bold rounded-xl border ${
            alert.type === 'success'
              ? 'bg-emerald-500/5 border-emerald-500/15 text-emerald-400'
              : 'bg-red-500/5 border-red-500/15 text-red-400'
          }`}
        >
          {alert.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          )}

          <span>{alert.text}</span>
        </div>
      )}

      <Card className="space-y-5 bg-brand-surface1/60">
        <div className="flex items-center gap-2 border-b border-brand-border pb-3">
          <Upload className="w-4 h-4 text-indigo-400" />

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Upload Resume
            </h3>

            <p className="text-[10px] text-slate-500 mt-0.5">
              PDF or DOCX, maximum 5 MB
            </p>
          </div>
        </div>

        <div
          onClick={() => fileInputRef.current?.click()}
          className="border border-dashed border-brand-border hover:border-indigo-500/50 rounded-2xl p-8 text-center cursor-pointer transition duration-200 bg-brand-surface2/30"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={handleFileChange}
            className="hidden"
          />

          <Upload className="w-8 h-8 mx-auto text-indigo-400 mb-3" />

          <p className="text-sm font-bold text-slate-200">
            {selectedFile
              ? 'Resume selected'
              : 'Click to choose your resume'}
          </p>

          <p className="text-[10px] text-slate-500 mt-1">
            Supported formats: PDF and DOCX
          </p>
        </div>

        {selectedFile && (
          <div className="flex items-center justify-between gap-4 p-3 rounded-xl border border-brand-border bg-brand-surface2/40">
            <div className="flex items-center gap-3 min-w-0">
              <FileText className="w-5 h-5 text-indigo-400 shrink-0" />

              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-200 truncate">
                  {selectedFile.name}
                </p>

                <p className="text-[10px] text-slate-500 mt-0.5">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={removeSelectedFile}
              className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition"
            >
              <XCircle className="w-4 h-4" />
            </button>
          </div>
        )}

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Job Description
            </label>

            <span className="text-[9px] text-slate-600">
              Optional
            </span>
          </div>

          <textarea
            value={jobDescription}
            onChange={(event) => setJobDescription(event.target.value)}
            rows={6}
            placeholder="Paste the job description here to get job-specific keyword matching and recommendations..."
            className="w-full p-4 bg-brand-surface2/60 border border-brand-border rounded-2xl text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
          />
        </div>

        <Button
          type="button"
          onClick={handleAnalyze}
          isLoading={analyzing}
          className="w-full font-bold py-2.5 text-xs shadow-lg"
        >
          {analyzing ? 'Analyzing Resume...' : 'Analyze Resume'}
        </Button>
      </Card>

      {analysis && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="flex items-center justify-between bg-gradient-to-r from-indigo-950/20 to-brand-surface1 border-indigo-500/10">
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  ATS Score
                </p>

                <div className="flex items-end gap-2 mt-1">
                  <h3 className="text-3xl font-extrabold text-indigo-400">
                    {atsScore}
                  </h3>

                  <span className="text-xs text-slate-500 mb-1">
                    / 100
                  </span>
                </div>

                <p className="text-[10px] text-slate-400 mt-1 font-semibold">
                  {analysis.score_label}
                </p>
              </div>

              <Trophy className="w-8 h-8 text-indigo-500/60" />
            </Card>

            <Card className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Matched Keywords
                </p>

                <h3 className="text-2xl font-extrabold text-emerald-400 mt-1">
                  {analysis.matched_keywords?.length ?? 0}
                </h3>

                <p className="text-[10px] text-slate-500 mt-1">
                  Found in your resume
                </p>
              </div>

              <CheckCircle2 className="w-8 h-8 text-emerald-500/60" />
            </Card>

            <Card className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Missing Keywords
                </p>

                <h3 className="text-2xl font-extrabold text-amber-400 mt-1">
                  {analysis.missing_keywords?.length ?? 0}
                </h3>

                <p className="text-[10px] text-slate-500 mt-1">
                  Potential gaps
                </p>
              </div>

              <Target className="w-8 h-8 text-amber-500/60" />
            </Card>
          </div>

          <Card className="space-y-5 bg-brand-surface1/60">
            <div className="flex items-center gap-2 border-b border-brand-border pb-3">
              <Target className="w-4 h-4 text-indigo-400" />

              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                ATS Breakdown
              </h3>
            </div>

            <div className="space-y-4">
              {Object.entries(analysis.category_scores || {}).map(
                ([key, value]) => {
                  if (typeof value !== 'number') {
                    return null;
                  }

                  return (
                    <div key={key}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          {categoryLabels[key] || key}
                        </span>

                        <span
                          className={`text-[10px] font-bold ${getScoreClass(
                            value
                          )}`}
                        >
                          {value}/100
                        </span>
                      </div>

                      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${getScoreBarClass(
                            value
                          )}`}
                          style={{
                            width: `${Math.min(100, Math.max(0, value))}%`,
                          }}
                        />
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="space-y-4">
              <div className="flex items-center gap-2 border-b border-brand-border pb-3">
                <Sparkles className="w-4 h-4 text-indigo-400" />

                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Resume Summary
                </h3>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                {analysis.summary || 'No summary was generated.'}
              </p>
            </Card>

            <Card className="space-y-4">
              <div className="flex items-center gap-2 border-b border-brand-border pb-3">
                <Award className="w-4 h-4 text-emerald-400" />

                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Strengths
                </h3>
              </div>

              {analysis.strengths?.length ? (
                <div className="space-y-2.5">
                  {analysis.strengths.map((strength, index) => (
                    <div
                      key={`${strength}-${index}`}
                      className="flex items-start gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />

                      <p className="text-xs text-slate-400 leading-relaxed">
                        {strength}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500">
                  No strengths were identified.
                </p>
              )}
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="space-y-4">
              <div className="flex items-center gap-2 border-b border-brand-border pb-3">
                <AlertCircle className="w-4 h-4 text-red-400" />

                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Issues Found
                </h3>
              </div>

              {analysis.issues?.length ? (
                <div className="space-y-3">
                  {analysis.issues.map((issue, index) => (
                    <div
                      key={`${issue}-${index}`}
                      className="flex items-start gap-2 p-3 rounded-xl bg-red-500/5 border border-red-500/10"
                    >
                      <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />

                      <p className="text-xs text-slate-400 leading-relaxed">
                        {issue}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500">
                  No major issues were detected.
                </p>
              )}
            </Card>

            <Card className="space-y-4">
              <div className="flex items-center gap-2 border-b border-brand-border pb-3">
                <Lightbulb className="w-4 h-4 text-amber-400" />

                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Recommended Changes
                </h3>
              </div>

              {analysis.recommendations?.length ? (
                <div className="space-y-3">
                  {analysis.recommendations.map(
                    (recommendation, index) => (
                      <div
                        key={`${recommendation}-${index}`}
                        className="flex items-start gap-2"
                      >
                        <span className="w-5 h-5 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center text-[9px] font-bold shrink-0">
                          {index + 1}
                        </span>

                        <p className="text-xs text-slate-400 leading-relaxed">
                          {recommendation}
                        </p>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <p className="text-xs text-slate-500">
                  No additional recommendations were generated.
                </p>
              )}
            </Card>
          </div>

          <Card className="space-y-4">
            <div className="flex items-center gap-2 border-b border-brand-border pb-3">
              <FileText className="w-4 h-4 text-indigo-400" />

              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Keywords
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 mb-2">
                  Matched
                </p>

                {analysis.matched_keywords?.length ? (
                  <div className="flex flex-wrap gap-1.5">
                    {analysis.matched_keywords.map((keyword) => (
                      <Badge
                        key={keyword}
                        variant="primary"
                        className="text-[8px] uppercase font-bold tracking-wider px-2 py-0.5"
                      >
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500">
                    No matched keywords detected.
                  </p>
                )}
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-amber-400 mb-2">
                  Missing
                </p>

                {analysis.missing_keywords?.length ? (
                  <div className="flex flex-wrap gap-1.5">
                    {analysis.missing_keywords.map((keyword) => (
                      <span
                        key={keyword}
                        className="px-2 py-1 rounded-md bg-amber-500/5 border border-amber-500/10 text-[8px] uppercase font-bold tracking-wider text-amber-400"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500">
                    No missing keywords detected.
                  </p>
                )}
              </div>
            </div>
          </Card>

          <Card className="space-y-4">
            <div className="flex items-center gap-2 border-b border-brand-border pb-3">
              <FileText className="w-4 h-4 text-indigo-400" />

              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Detected Resume Sections
              </h3>
            </div>

            {analysis.detected_sections?.length ? (
              <div className="flex flex-wrap gap-2">
                {analysis.detected_sections.map((section) => (
                  <Badge
                    key={section}
                    variant="primary"
                    className="text-[8px] uppercase font-bold tracking-wider px-2.5 py-1"
                  >
                    {section}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500">
                No standard resume sections were detected.
              </p>
            )}
          </Card>

          {analysis.weak_bullets?.length > 0 && (
            <Card className="space-y-5">
              <div className="flex items-center gap-2 border-b border-brand-border pb-3">
                <Lightbulb className="w-4 h-4 text-amber-400" />

                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Weak Bullet Improvements
                </h3>
              </div>

              <div className="space-y-5">
                {analysis.weak_bullets.map((bullet, index) => (
                  <div
                    key={`${bullet.original}-${index}`}
                    className="space-y-3"
                  >
                    <div className="p-3 rounded-xl bg-red-500/5 border border-red-500/10">
                      <p className="text-[9px] font-bold uppercase tracking-wider text-red-400 mb-1.5">
                        Current
                      </p>

                      <p className="text-xs text-slate-400 leading-relaxed">
                        {bullet.original}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/10">
                      <p className="text-[9px] font-bold uppercase tracking-wider text-amber-400 mb-1.5">
                        Problem
                      </p>

                      <p className="text-xs text-slate-400 leading-relaxed">
                        {bullet.problem}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                      <p className="text-[9px] font-bold uppercase tracking-wider text-emerald-400 mb-1.5">
                        Suggested Rewrite
                      </p>

                      <p className="text-xs text-slate-300 leading-relaxed">
                        {bullet.suggestion}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {skills.length > 0 && (
            <Card className="space-y-4">
              <div className="flex items-center gap-2 border-b border-brand-border pb-3">
                <Sparkles className="w-4 h-4 text-indigo-400" />

                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Extracted Skills
                </h3>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {skills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="primary"
                    className="text-[8px] uppercase font-bold tracking-wider px-2 py-0.5"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </Card>
          )}

          {workHistory.length > 0 && (
            <Card className="space-y-4">
              <div className="flex items-center gap-2 border-b border-brand-border pb-3">
                <Award className="w-4 h-4 text-indigo-400" />

                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Work History
                </h3>
              </div>

              <div className="space-y-4">
                {workHistory.map((job, index) => (
                  <div
                    key={`${job.company}-${job.role}-${index}`}
                    className="border-l-2 border-indigo-500/20 pl-3.5"
                  >
                    <p className="text-xs font-bold text-slate-300">
                      {job.role}
                    </p>

                    <p className="text-[10px] text-indigo-400 font-semibold mt-0.5">
                      {job.company}
                    </p>

                    {job.duration && (
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        {job.duration}
                      </p>
                    )}

                    {job.description && (
                      <p className="text-[10px] text-slate-500 leading-relaxed mt-1">
                        {job.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )}

          {education.length > 0 && (
            <Card className="space-y-4">
              <div className="flex items-center gap-2 border-b border-brand-border pb-3">
                <GraduationCap className="w-4 h-4 text-indigo-400" />

                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Education
                </h3>
              </div>

              <div className="space-y-4">
                {education.map((item, index) => (
                  <div
                    key={`${item.school}-${item.degree}-${index}`}
                    className="border-l-2 border-indigo-500/20 pl-3.5"
                  >
                    <p className="text-xs font-bold text-slate-300">
                      {item.degree}
                      {item.field_of_study
                        ? ` in ${item.field_of_study}`
                        : ''}
                    </p>

                    <p className="text-[10px] text-indigo-400 font-semibold mt-0.5">
                      {item.school}
                    </p>

                    {item.year && (
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        {item.year}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )}
        </>
      )}

      {!analysis && !analyzing && (
        <Card className="py-16 text-center">
          <FileText className="w-10 h-10 mx-auto text-slate-600 mb-3" />

          <h3 className="text-sm font-bold text-slate-300">
            No resume analysis yet
          </h3>

          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            Upload your resume above and run the analyzer to get your ATS
            score and personalized recommendations.
          </p>
        </Card>
      )}

      {analyzing && (
        <Card className="py-12 text-center">
          <Loader2 className="w-8 h-8 mx-auto text-indigo-400 animate-spin mb-3" />

          <p className="text-xs font-bold text-slate-300">
            Analyzing your resume...
          </p>

          <p className="text-[10px] text-slate-500 mt-1">
            Extracting content, calculating ATS score, and generating
            recommendations.
          </p>
        </Card>
      )}
    </div>
  );
};
