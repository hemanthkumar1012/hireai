import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Cpu, CheckCircle2, ShieldCheck, ArrowRight, Zap, Target, Award, ListFilter, 
  TrendingUp, CloudUpload, Sparkles, BookOpen, ChevronDown, ChevronUp, Database, Flame, Terminal, ChevronRight
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { MatchScoreMetric } from '../components/dashboard/MatchScoreMetric';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const faqs = [
    {
      q: "How does ApplyRight calculate candidate match scores?",
      a: "ApplyRight compares parsed technical competencies, historic work timelines, and credential parameters against specific job descriptions to compute a normalized suitability percentage score."
    },
    {
      q: "Is my resume data kept private and secure?",
      a: "Absolutely. All resume contents are stored inside your isolated database. Data is processed locally or over secure generative API endpoints using standard TLS encryption."
    },
    {
      q: "Which AI models power ApplyRight's analysis?",
      a: "The platform integrates Google's generative AI API (specifically gemini-1.5-flash) for resume text structures, gap analyses, and tailored interview preps."
    },
    {
      q: "Can I run ApplyRight inside Docker containers?",
      a: "Yes. We package the entire stack—PostgreSQL, Redis, Celery, Backend, and Frontend—into a single docker-compose orchestrator configuration for local and cloud deploys."
    },
    {
      q: "How does career gap analysis help seekers?",
      a: "By auditing your CV against target roles, our intelligence service identifies missing stack dependencies and structures step-by-step certifications and upskilling roadmaps."
    }
  ];

  const features = [
    {
      icon: Cpu,
      title: "AI Resume Intelligence",
      desc: "Extract technical skills, work histories, and academic milestones from raw text or CV files into structured database assets instantly."
    },
    {
      icon: Target,
      title: "Semantic Job Matching",
      desc: "Measure candidate alignment profiles against target vacancy postings to output fit metrics and technical discrepancies."
    },
    {
      icon: ListFilter,
      title: "Candidate Ranking",
      desc: "Sort candidate pools logically by matching weights, allowing recruiters to isolate qualified candidates in seconds."
    },
    {
      icon: ShieldCheck,
      title: "Career Gap Analysis",
      desc: "Scan your resume against target career path milestones to map missing technical dependencies and certified roadmaps."
    },
    {
      icon: BookOpen,
      title: "Interview Preparation",
      desc: "Generate tailored behavioral and technical questions focused on profile gap areas, complete with suggested response points."
    },
    {
      icon: TrendingUp,
      title: "Recruitment Analytics",
      desc: "View applicant conversions funnel logs, matching score intervals, and active job campaign stats in clean dashboards."
    }
  ];

  return (
    <div className="bg-brand-bg text-slate-105 min-h-screen overflow-x-hidden font-sans relative selection:bg-indigo-500/30 selection:text-white">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 animated-grid opacity-[0.22] pointer-events-none" />

      {/* Premium blur decorations */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] mesh-glow-indigo rounded-full pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-[450px] h-[450px] mesh-glow-purple rounded-full pointer-events-none" />

      {/* Navigation Header */}
      <header className="relative z-10 max-w-7xl mx-auto px-6 h-20 flex items-center justify-between border-b border-brand-border bg-brand-bg/40 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-xl text-white shadow shadow-indigo-500/20">
            <Cpu className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            ApplyRight
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-xs font-bold text-slate-400 hover:text-white transition">
            Sign In
          </Link>
          <Button onClick={() => navigate('/register')} variant="primary" size="sm" className="font-bold text-xs px-4">
            Get Started
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Hero */}
        <div className="lg:col-span-6 space-y-6 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-full text-[10px] font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            AI-Powered Career Intelligence
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.08] text-slate-100">
            Hire smarter.<br />
            <span className="bg-gradient-to-r from-white via-indigo-200 to-violet-300 bg-clip-text text-transparent">
              Get hired faster.
            </span>
          </h1>

          <p className="text-sm text-slate-400 max-w-lg leading-relaxed">
            Turn resumes, skills, jobs, and career goals into intelligent hiring and career decisions. Automate CV audits, gap assess pipelines, and customized interview readiness vectors.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
            <Button onClick={() => navigate('/register')} size="lg" className="w-full sm:w-auto font-bold flex items-center gap-2">
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button onClick={() => navigate('/login')} variant="outline" size="lg" className="w-full sm:w-auto font-bold">
              View Demo
            </Button>
          </div>
        </div>

        {/* Right Hero - Realistic Dashboard Preview */}
        <div className="lg:col-span-6">
          <div className="relative border border-brand-border bg-brand-surface1/60 rounded-2xl p-4 sm:p-5 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.85)] backdrop-blur-md">
            
            {/* Top Chrome Tab Controls */}
            <div className="border border-brand-border bg-[#070A0F]/70 rounded-xl overflow-hidden shadow-inner text-xs font-sans">
              <div className="h-10 bg-brand-surface1 border-b border-brand-border px-4 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-800" />
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-800" />
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-800" />
                </div>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest font-mono">Telemetry Panel</span>
                <div className="w-14 h-1.5 bg-slate-800 rounded-full" />
              </div>

              {/* Mock Dashboard Layout */}
              <div className="p-4 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-extrabold text-slate-200">Alex Mercer — Seeker Analytics</h4>
                    <p className="text-[9px] text-slate-500 mt-0.5">Target: Senior Full-Stack Engineer</p>
                  </div>
                  <Badge variant="primary" className="text-[8px] font-bold">PARSING OK</Badge>
                </div>

                {/* Score Meters */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-brand-surface1/85 p-3 rounded-xl border border-brand-border flex items-center justify-between">
                    <div>
                      <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">ATS Score</p>
                      <p className="text-sm font-extrabold text-slate-250 mt-1">85% / Excellent</p>
                    </div>
                    <Award className="w-5 h-5 text-indigo-400/80" />
                  </div>

                  <div className="bg-brand-surface1/85 p-3 rounded-xl border border-brand-border flex items-center justify-between">
                    <div>
                      <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Fit Rating</p>
                      <p className="text-sm font-extrabold text-slate-250 mt-1">92% Match</p>
                    </div>
                    <div className="shrink-0 scale-75">
                      <MatchScoreMetric score={92} size="sm" />
                    </div>
                  </div>
                </div>

                {/* Recommended Jobs */}
                <div className="space-y-2">
                  <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Recommended Opportunities</p>
                  <div className="border border-brand-border bg-brand-surface1/50 p-2.5 rounded-xl flex items-center justify-between text-[11px]">
                    <div>
                      <p className="font-bold text-slate-300">Python Backend Architect</p>
                      <p className="text-[9px] text-indigo-400 mt-0.5">ByteScale Systems • NYC</p>
                    </div>
                    <span className="text-[9px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/10">92% Match</span>
                  </div>
                </div>

                {/* AI Insights Summary snippet */}
                <div className="space-y-1.5">
                  <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">AI Insights & Gaps</p>
                  <div className="bg-brand-surface1/55 border border-brand-border p-3 rounded-xl text-[10px] text-slate-350 leading-relaxed space-y-1">
                    <p className="font-semibold text-slate-200">✓ Strong credentials in FastAPI and React database states.</p>
                    <p className="text-amber-400/90 font-semibold">! Technical Gaps: Missing experience in AWS deployment pipelines.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Trusted Technology Strip */}
      <section className="relative z-10 border-y border-brand-border/60 bg-[#070A0F]/40 backdrop-blur-md py-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap items-center justify-center gap-x-12 gap-y-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
          <span className="flex items-center gap-1.5"><Terminal className="w-4 h-4 text-indigo-500/60" /> Python</span>
          <span className="flex items-center gap-1.5"><Flame className="w-4 h-4 text-indigo-500/60" /> FastAPI</span>
          <span className="flex items-center gap-1.5"><Cpu className="w-4 h-4 text-indigo-500/60" /> React</span>
          <span className="flex items-center gap-1.5"><Database className="w-4 h-4 text-indigo-500/60" /> PostgreSQL</span>
          <span className="flex items-center gap-1.5"><Sparkles className="w-4 h-4 text-indigo-500/60" /> Artificial Intelligence</span>
        </div>
      </section>

      {/* Everything You Need Feature section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-24 space-y-16">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100">Everything you need to make better career decisions.</h2>
          <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">Comprehensive intelligence toolkits for job seekers and recruitment teams.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, index) => {
            const Icon = feat.icon;
            return (
              <div 
                key={index}
                className="border border-brand-border bg-brand-surface1/60 p-6 rounded-2xl flex flex-col justify-between hover:border-indigo-500/20 hover:shadow-2xl transition duration-300 group"
              >
                <div>
                  <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl w-fit group-hover:scale-105 transition-all duration-300">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-100 mt-5 mb-2">{feat.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{feat.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pb-24 space-y-16">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-extrabold text-slate-100">How It Works</h2>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">Follow our automated recruitment and career intelligence pipeline stages.</p>
        </div>

        <div className="relative">
          {/* Connecting Connector Path Line on Desktop */}
          <div className="hidden lg:block absolute top-6 left-12 right-12 h-[1px] bg-brand-border z-0" />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            <div className="bg-brand-surface1/40 border border-brand-border p-5 rounded-2xl space-y-3 hover:border-slate-700 transition">
              <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/15">01</span>
              <h4 className="text-xs font-bold text-slate-250 uppercase tracking-wider">Upload Profile</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">Paste your raw CV details or job parameters in the editor.</p>
            </div>

            <div className="bg-brand-surface1/40 border border-brand-border p-5 rounded-2xl space-y-3 hover:border-slate-700 transition">
              <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/15">02</span>
              <h4 className="text-xs font-bold text-slate-250 uppercase tracking-wider">AI Scan</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">Google Gemini extracts skills, educations, and milestones.</p>
            </div>

            <div className="bg-brand-surface1/40 border border-brand-border p-5 rounded-2xl space-y-3 hover:border-slate-700 transition">
              <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/15">03</span>
              <h4 className="text-xs font-bold text-slate-250 uppercase tracking-wider">Score Suitability</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">Match profiles against descriptions to compute alignment percentages.</p>
            </div>

            <div className="bg-brand-surface1/40 border border-brand-border p-5 rounded-2xl space-y-3 hover:border-slate-700 transition">
              <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/15">04</span>
              <h4 className="text-xs font-bold text-slate-250 uppercase tracking-wider">Bridge Gaps</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">Generate targeted certified checklists and mock question sheets.</p>
            </div>
          </div>
        </div>
      </section>

      {/* AI Telemetry Flow section */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pb-24 space-y-16">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-extrabold text-slate-100">AI Intelligence Flow</h2>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">Transforming raw resume details into structured career actions.</p>
        </div>

        <div className="border border-brand-border bg-brand-surface1/30 p-8 rounded-2xl backdrop-blur-sm relative">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10 text-xs font-bold tracking-wider text-slate-300 text-center">
            
            <div className="bg-brand-surface2/80 border border-brand-border px-5 py-3 rounded-xl w-32 shadow-xl hover:border-indigo-500/30 transition">RESUME</div>
            
            <ChevronRight className="w-5 h-5 text-indigo-500/60 hidden md:block" />
            <div className="bg-brand-surface2/80 border border-brand-border px-5 py-3 rounded-xl w-32 shadow-xl hover:border-indigo-500/30 transition">SKILLS</div>
            
            <ChevronRight className="w-5 h-5 text-indigo-500/60 hidden md:block" />
            <div className="bg-brand-surface2/80 border border-brand-border px-5 py-3 rounded-xl w-32 shadow-xl hover:border-indigo-500/30 transition">MATCH</div>
            
            <ChevronRight className="w-5 h-5 text-indigo-500/60 hidden md:block" />
            <div className="bg-brand-surface2/80 border border-brand-border px-5 py-3 rounded-xl w-32 shadow-xl hover:border-indigo-500/30 transition">INSIGHTS</div>
            
            <ChevronRight className="w-5 h-5 text-indigo-500/60 hidden md:block" />
            <div className="bg-brand-surface2/80 border border-brand-border px-5 py-3 rounded-xl w-32 shadow-xl hover:border-indigo-500/30 transition">ACTION</div>
          </div>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div className="bg-brand-surface1/50 border border-brand-border p-6 rounded-2xl">
            <h3 className="text-3xl font-extrabold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">10K+</h3>
            <p className="text-xs text-slate-400 font-semibold mt-1">Profiles analyzed</p>
          </div>

          <div className="bg-brand-surface1/50 border border-brand-border p-6 rounded-2xl">
            <h3 className="text-3xl font-extrabold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">95%</h3>
            <p className="text-xs text-slate-400 font-semibold mt-1">Matching accuracy</p>
          </div>

          <div className="bg-brand-surface1/50 border border-brand-border p-6 rounded-2xl">
            <h3 className="text-3xl font-extrabold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">3.2x</h3>
            <p className="text-xs text-slate-400 font-semibold mt-1">Faster candidate screening</p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 pb-24 space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-extrabold text-slate-100">Frequently Asked Questions</h2>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">Get details on telemetry calculations and container deployment configurations.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div key={idx} className="border border-brand-border bg-brand-surface1/60 rounded-xl overflow-hidden transition">
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-5 py-4 flex items-center justify-between text-left text-xs font-bold text-slate-200 hover:text-white"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-indigo-400" /> : <ChevronDown className="w-4 h-4 text-indigo-400" />}
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 text-xs text-slate-400 leading-relaxed border-t border-brand-border/40 pt-3 bg-brand-surface2/20">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Final CTA Banner */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pb-24 text-center">
        <div className="bg-gradient-to-br from-indigo-950/40 via-violet-950/20 to-brand-surface1 border border-indigo-500/10 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-32 h-32 bg-indigo-500/10 rounded-full filter blur-2xl opacity-40 pointer-events-none" />
          
          <h2 className="text-3xl font-extrabold text-slate-100 tracking-tight leading-tight">
            Your next opportunity starts with better intelligence.
          </h2>
          <p className="text-xs text-slate-400 mt-3 max-w-md mx-auto leading-relaxed">
            Begin matching profiles semantically and diagnosing technology gap pipelines immediately in one console interface.
          </p>
          <div className="mt-8">
            <Button onClick={() => navigate('/register')} size="lg" className="font-bold shadow-lg">
              Start with ApplyRight
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-brand-border bg-[#070A0F] py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-xs">
          <div className="space-y-4">
            <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[10px]">Product</h4>
            <ul className="space-y-2 text-slate-550 font-bold">
              <li><Link to="/register" className="hover:text-slate-300">Parse CV</Link></li>
              <li><Link to="/register" className="hover:text-slate-300">Jobs Match</Link></li>
              <li><Link to="/register" className="hover:text-slate-300">Prep Portal</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[10px]">Company</h4>
            <ul className="space-y-2 text-slate-550 font-bold">
              <li><a href="#" className="hover:text-slate-300">About Us</a></li>
              <li><a href="#" className="hover:text-slate-300">Careers</a></li>
              <li><a href="#" className="hover:text-slate-300">Contact</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[10px]">Resources</h4>
            <ul className="space-y-2 text-slate-550 font-bold">
              <li><a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-slate-300">GitHub</a></li>
              <li><a href="#" className="hover:text-slate-300">Documentation</a></li>
              <li><a href="#" className="hover:text-slate-300">API Reference</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[10px]">Legal</h4>
            <ul className="space-y-2 text-slate-550 font-bold">
              <li><a href="#" className="hover:text-slate-300">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-slate-300">Terms of Service</a></li>
              <li><a href="#" className="hover:text-slate-300">Security Audit</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-12 pt-6 border-t border-brand-border/40 text-center text-[10px] text-slate-500 font-semibold">
          <p>© 2026 ApplyRight platform. Flagship Recruitment Engineering Project.</p>
        </div>
      </footer>
    </div>
  );
};
