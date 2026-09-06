import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Cpu,
  Database,
  ListFilter,
  ShieldCheck,
  Sparkles,
  Target,
  Terminal,
  TrendingUp,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { MatchScoreMetric } from '../components/dashboard/MatchScoreMetric';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: 'How does ApplyRight calculate candidate match scores?',
      a: 'ApplyRight compares your skills, experience, education, and resume content against a specific job description to produce a practical match score.',
    },
    {
      q: 'Is my resume data kept private and secure?',
      a: 'Your resume is handled through the application backend and stored with your account. We do not display your resume data publicly.',
    },
    {
      q: 'Which AI models power ApplyRight?',
      a: 'ApplyRight can use Google Gemini for resume analysis, career gap analysis, job matching, and interview preparation.',
    },
    {
      q: 'Can I use ApplyRight as a recruiter?',
      a: 'Yes. Recruiters can post jobs, review applicants, compare candidate profiles, and use matching insights to speed up screening.',
    },
    {
      q: 'How does career gap analysis help?',
      a: 'It compares your current profile with a target role and highlights the skills or experience you should strengthen next.',
    },
  ];

  const features = [
    {
      icon: Cpu,
      title: 'AI Resume Intelligence',
      desc: 'Turn a PDF or DOCX resume into structured skills, experience, education, and actionable resume insights.',
    },
    {
      icon: Target,
      title: 'Job Matching',
      desc: 'See how closely your profile aligns with a role before spending time on an application.',
    },
    {
      icon: ListFilter,
      title: 'Candidate Ranking',
      desc: 'Help recruiters compare applicants using consistent matching signals and relevant profile data.',
    },
    {
      icon: ShieldCheck,
      title: 'Career Gap Analysis',
      desc: 'Find the important skills you are missing for the roles you want next.',
    },
    {
      icon: BookOpen,
      title: 'Interview Preparation',
      desc: 'Practice role-specific technical and behavioral questions based on your profile.',
    },
    {
      icon: TrendingUp,
      title: 'Recruitment Analytics',
      desc: 'Understand applications, candidates, and hiring activity from a single workspace.',
    },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden bg-brand-bg text-brand-text font-sans">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 left-[8%] h-72 w-72 rounded-full bg-violet-200/40 blur-3xl" />
        <div className="absolute top-40 right-[10%] h-80 w-80 rounded-full bg-indigo-100/60 blur-3xl" />
      </div>

      <header className="relative z-10 border-b border-brand-border/80 bg-brand-bg/90 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-accent1 text-white shadow-soft">
              <Cpu className="h-5 w-5" />
            </span>
            <span className="text-lg font-extrabold tracking-tight text-brand-text">ApplyRight</span>
          </Link>

          <nav className="flex items-center gap-3 sm:gap-5">
            <Link
              to="/login"
              className="rounded-full px-3 py-2 text-sm font-semibold text-brand-text transition hover:bg-white"
            >
              Sign In
            </Link>
            <Button onClick={() => navigate('/register')} variant="primary" size="sm">
              Get Started
            </Button>
          </nav>
        </div>
      </header>

      <main className="relative z-10">
        <section className="mx-auto grid max-w-7xl items-center gap-14 px-6 pb-20 pt-16 lg:grid-cols-2 lg:px-8 lg:pb-24 lg:pt-24">
          <div className="max-w-2xl">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-violet-700 shadow-sm">
              <Sparkles className="h-3.5 w-3.5" />
              AI-powered career platform
            </div>

            <h1 className="max-w-3xl text-5xl font-extrabold leading-[1.02] tracking-[-0.04em] text-brand-text sm:text-6xl lg:text-7xl">
              Build a better career.
              <span className="block text-brand-accent1">One right move at a time.</span>
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-8 text-[#4B4B50] sm:text-xl">
              Analyze your resume, understand your strengths, find better-fit jobs, and prepare for interviews with one focused career workspace.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button
                onClick={() => navigate('/register')}
                size="lg"
                className="w-full sm:w-auto"
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                onClick={() => navigate('/login')}
                variant="outline"
                size="lg"
                className="w-full sm:w-auto"
              >
                Sign In
              </Button>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-brand-muted">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                Resume analysis
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                Job matching
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                Interview prep
              </span>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-[28px] border border-brand-border bg-white p-3 shadow-[0_30px_80px_rgba(0,0,0,0.12)] sm:p-5">
              <div className="overflow-hidden rounded-[22px] border border-[#E4E4E8] bg-[#F7F7F8]">
                <div className="flex items-center justify-between border-b border-[#E4E4E8] bg-white px-5 py-4">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#D9D9DE]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#D9D9DE]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#D9D9DE]" />
                  </div>
                  <span className="text-xs font-semibold text-brand-muted">Resume Intelligence</span>
                </div>

                <div className="space-y-5 p-5 sm:p-7">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-lg font-bold text-brand-text">Alex Mercer</p>
                      <p className="mt-1 text-sm text-brand-muted">Senior Full-Stack Engineer</p>
                    </div>
                    <Badge variant="success">Analysis ready</Badge>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl border border-brand-border bg-white p-5">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-brand-muted">ATS score</p>
                          <p className="mt-2 text-3xl font-extrabold text-brand-text">85</p>
                          <p className="mt-1 text-sm font-medium text-emerald-700">Excellent</p>
                        </div>
                        <Award className="h-7 w-7 text-brand-accent1" />
                      </div>
                    </div>

                    <div className="rounded-2xl border border-brand-border bg-white p-5">
                      <p className="text-xs font-semibold uppercase tracking-wide text-brand-muted">Job fit</p>
                      <div className="mt-2 flex items-center justify-between">
                        <div>
                          <p className="text-3xl font-extrabold text-brand-text">92%</p>
                          <p className="mt-1 text-sm font-medium text-brand-muted">Strong match</p>
                        </div>
                        <MatchScoreMetric score={92} size="sm" />
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-brand-border bg-white p-5">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-brand-muted">Recommended role</p>
                        <p className="mt-2 text-base font-bold text-brand-text">Python Backend Engineer</p>
                        <p className="mt-1 text-sm text-brand-muted">ByteScale Systems · Remote</p>
                      </div>
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">92% match</span>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-violet-200 bg-violet-50/70 p-5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-violet-700">AI insight</p>
                    <p className="mt-2 text-sm leading-6 text-[#34343A]">
                      Strong experience with FastAPI and React. Consider strengthening AWS deployment experience for senior backend roles.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-brand-border bg-white">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-10 gap-y-4 px-6 py-7 text-sm font-semibold text-brand-muted lg:px-8">
            <span className="flex items-center gap-2"><Terminal className="h-4 w-4" /> Python</span>
            <span className="flex items-center gap-2"><Cpu className="h-4 w-4" /> FastAPI</span>
            <span className="flex items-center gap-2"><Sparkles className="h-4 w-4" /> React</span>
            <span className="flex items-center gap-2"><Database className="h-4 w-4" /> PostgreSQL</span>
            <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> AI-powered workflows</span>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand-accent1">Everything in one place</p>
            <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-brand-text sm:text-5xl">
              Tools that move your career forward.
            </h2>
            <p className="mt-5 text-lg leading-8 text-[#4B4B50]">
              ApplyRight brings the most useful parts of the job search into one clear, practical workflow.
            </p>
          </div>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="rounded-3xl border border-brand-border bg-white p-7 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lift"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-brand-accent1">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-6 text-xl font-bold text-brand-text">{feature.title}</h3>
                  <p className="mt-3 text-[15px] leading-7 text-[#55555B]">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="bg-[#1D1D1F] px-6 py-24 text-white">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-violet-300">Simple workflow</p>
              <h2 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">From resume to next opportunity.</h2>
              <p className="mt-5 text-lg leading-8 text-white/70">
                Keep the process simple. Add your profile, understand the gaps, then apply with more confidence.
              </p>
            </div>

            <div className="mt-14 grid gap-5 lg:grid-cols-4">
              {[
                ['01', 'Build your profile', 'Add your resume, skills, experience, and career goals.'],
                ['02', 'Analyze your resume', 'Get structured insights and an ATS-focused review.'],
                ['03', 'Find better-fit jobs', 'Compare your profile against relevant opportunities.'],
                ['04', 'Prepare and apply', 'Use tailored insights to improve applications and interviews.'],
              ].map(([number, title, desc]) => (
                <div key={number} className="rounded-3xl border border-white/10 bg-white/5 p-6">
                  <span className="text-sm font-bold text-violet-300">{number}</span>
                  <h3 className="mt-5 text-xl font-bold">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-white/65">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-6 py-24 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand-accent1">FAQ</p>
            <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-brand-text sm:text-5xl">Questions, answered.</h2>
          </div>

          <div className="mt-12 overflow-hidden rounded-3xl border border-brand-border bg-white">
            {faqs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <button
                  key={faq.q}
                  type="button"
                  onClick={() => setActiveFaq(isOpen ? null : index)}
                  className="block w-full border-b border-brand-border p-6 text-left last:border-b-0"
                >
                  <div className="flex items-center justify-between gap-6">
                    <span className="text-base font-bold text-brand-text sm:text-lg">{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="h-5 w-5 shrink-0 text-brand-muted" />
                    ) : (
                      <ChevronDown className="h-5 w-5 shrink-0 text-brand-muted" />
                    )}
                  </div>
                  {isOpen && <p className="mt-4 max-w-3xl text-[15px] leading-7 text-[#55555B]">{faq.a}</p>}
                </button>
              );
            })}
          </div>
        </section>

        <section className="px-6 pb-24 lg:px-8">
          <div className="mx-auto max-w-6xl rounded-[32px] bg-violet-50 px-8 py-14 text-center sm:px-12">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-violet-700">Ready when you are</p>
            <h2 className="mx-auto mt-4 max-w-3xl text-4xl font-extrabold tracking-tight text-brand-text sm:text-5xl">
              Make your next application a smarter one.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#55555B]">
              Start with your resume. Build from there.
            </p>
            <div className="mt-8">
              <Button onClick={() => navigate('/register')} size="lg">
                Create your account
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-brand-border bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-8 text-sm text-brand-muted sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <p>© {new Date().getFullYear()} ApplyRight. All rights reserved.</p>
          <p>Career intelligence for job seekers and recruiters.</p>
        </div>
      </footer>
    </div>
  );
};
